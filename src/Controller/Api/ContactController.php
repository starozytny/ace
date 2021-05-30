<?php

namespace App\Controller\Api;

use App\Entity\Contact;
use App\Entity\User;
use App\Repository\ContactRepository;
use App\Service\ApiResponse;
use App\Service\MailerService;
use App\Service\SettingsService;
use App\Service\ValidatorService;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Security;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use OpenApi\Annotations as OA;

/**
 * @Route("/api/contact", name="api_contact_")
 */
class ContactController extends AbstractController
{
    /**
     * Admin - Get array of contacts
     *
     * @Security("is_granted('ROLE_ADMIN')")
     *
     * @Route("/", name="index", options={"expose"=true}, methods={"GET"})
     *
     * @OA\Response(
     *     response=200,
     *     description="Returns array of contacts",
     * )
     * @OA\Tag(name="Contact")
     *
     * @param Request $request
     * @param ContactRepository $contactRepository
     * @param ApiResponse $apiResponse
     * @return JsonResponse
     */
    public function index(Request $request, ContactRepository $contactRepository, ApiResponse $apiResponse): JsonResponse
    {
        $order = $request->query->get('order') ?: 'ASC';
        $contacts = $contactRepository->findBy([], ['createdAt' => $order]);
        return $apiResponse->apiJsonResponse($contacts, User::ADMIN_READ);
    }

    /**
     * Create an message contact
     *
     * @Route("/", name="create", options={"expose"=true}, methods={"POST"})
     *
     * @OA\Response(
     *     response=200,
     *     description="Returns a message",
     * )
     *
     * @OA\Tag(name="Contact")
     *
     * @param Request $request
     * @param ValidatorService $validator
     * @param ApiResponse $apiResponse
     * @param MailerService $mailerService
     * @param SettingsService $settingsService
     * @return JsonResponse
     */
    public function create(Request $request, ValidatorService $validator, ApiResponse $apiResponse,
                           MailerService $mailerService, SettingsService $settingsService): JsonResponse
    {
        $em = $this->getDoctrine()->getManager();
        $data = json_decode($request->getContent());

        if ($data === null) {
            return $apiResponse->apiJsonResponseBadRequest('Les données sont vides.');
        }


        if (!isset($data->name) || !isset($data->email) || !isset($data->message)) {
            return $apiResponse->apiJsonResponseBadRequest('Il manque des données.');
        }

        $contact = (new Contact())
            ->setName(trim($data->name))
            ->setEmail($data->email)
            ->setMessage($data->message)
        ;

        $noErrors = $validator->validate($contact);

        if ($noErrors !== true) {
            return $apiResponse->apiJsonResponseValidationFailed($noErrors);
        }

        if($mailerService->sendMail(
                $settingsService->getEmailContact(),
                "[" . $settingsService->getWebsiteName() ."] Demande de contact",
                "Demande de contact réalisé à partir de " . $settingsService->getWebsiteName(),
                'app/email/contact/contact.html.twig',
                ['contact' => $contact, 'settings' => $settingsService->getSettings()]
            ) != true)
        {
            return $apiResponse->apiJsonResponseValidationFailed([[
                'name' => 'message',
                'message' => "Le message n\'a pas pu être délivré. Veuillez contacter le support."
            ]]);
        }

        $em->persist($contact);
        $em->flush();

        return $apiResponse->apiJsonResponseSuccessful("Message envoyé.");
    }

    /**
     * Admin - Change isSeen to true
     *
     * @Security("is_granted('ROLE_ADMIN')")
     *
     * @Route("/{id}/is-seen", name="isSeen", options={"expose"=true}, methods={"POST"})
     *
     * @OA\Response(
     *     response=200,
     *     description="Returns contact object",
     * )
     *
     * @OA\Tag(name="Contact")
     *
     * @param Contact $contact
     * @param ApiResponse $apiResponse
     * @return JsonResponse
     */
    public function isSeen(Contact $contact, ApiResponse $apiResponse): JsonResponse
    {
        $em = $this->getDoctrine()->getManager();
        $contact->setIsSeen(true);

        $em->flush();
        return $apiResponse->apiJsonResponse($contact, User::ADMIN_READ);
    }

    /**
     * Admin - Delete a message contact
     *
     * @Security("is_granted('ROLE_ADMIN')")
     *
     * @Route("/{id}", name="delete", options={"expose"=true}, methods={"DELETE"})
     *
     * @OA\Response(
     *     response=200,
     *     description="Return message successful",
     * )
     *
     * @OA\Tag(name="Contact")
     *
     * @param ApiResponse $apiResponse
     * @param Contact $contact
     * @return JsonResponse
     */
    public function delete(ApiResponse $apiResponse, Contact $contact): JsonResponse
    {
        $em = $this->getDoctrine()->getManager();

        if (!$contact->getIsSeen()) {
            return $apiResponse->apiJsonResponseBadRequest('Vous n\'avez pas lu ce message.');
        }

        $em->remove($contact);
        $em->flush();

        return $apiResponse->apiJsonResponseSuccessful("Supression réussie !");
    }

    /**
     * Admin - Delete a group of message contact
     *
     * @Security("is_granted('ROLE_ADMIN')")
     *
     * @Route("/", name="delete_group", options={"expose"=true}, methods={"DELETE"})
     *
     * @OA\Response(
     *     response=200,
     *     description="Return message successful",
     * )
     *
     * @OA\Tag(name="Contact")
     *
     * @param Request $request
     * @param ApiResponse $apiResponse
     * @return JsonResponse
     */
    public function deleteGroup(Request $request, ApiResponse $apiResponse): JsonResponse
    {
        $em = $this->getDoctrine()->getManager();
        $data = json_decode($request->getContent());

        $contacts = $em->getRepository(Contact::class)->findBy(['id' => $data]);

        if ($contacts) {
            foreach ($contacts as $contact) {
                if (!$contact->getIsSeen()) {
                    return $apiResponse->apiJsonResponseBadRequest('Vous n\'avez pas lu ce message.');
                }

                $em->remove($contact);
            }
        }

        $em->flush();
        return $apiResponse->apiJsonResponseSuccessful("Supression de la sélection réussie !");
    }
}
