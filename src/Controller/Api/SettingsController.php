<?php

namespace App\Controller\Api;

use App\Entity\Settings;
use App\Entity\User;
use App\Repository\SettingsRepository;
use App\Service\ApiResponse;
use App\Service\FileUploader;
use App\Service\ValidatorService;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Security;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use OpenApi\Annotations as OA;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;

/**
 * @Route("/api/settings", name="api_settings_")
 */
class SettingsController extends AbstractController
{
    /**
     * Get settings data
     *
     * @Security("is_granted('ROLE_ADMIN')")
     *
     * @Route("/", name="index", options={"expose"=true}, methods={"GET"})
     *
     * @OA\Response(
     *     response=200,
     *     description="Returns settings",
     * )
     * @OA\Tag(name="Settings")
     *
     * @param ApiResponse $apiResponse
     * @param SettingsRepository $repository
     * @return JsonResponse
     */
    public function index(ApiResponse $apiResponse, SettingsRepository $repository): JsonResponse
    {
        $settings = $repository->findAll();
        if(count($settings) > 0){
            $settings = $settings[0];
        }
        return $apiResponse->apiJsonResponse($settings, User::VISITOR_READ);
    }

    /**
     * Update settings data
     *
     * @Security("is_granted('ROLE_ADMIN')")
     *
     * @Route("/update", name="update", options={"expose"=true}, methods={"POST"})
     *
     * @OA\Response(
     *     response=200,
     *     description="Returns settings",
     * )
     * @OA\Tag(name="Settings")
     *
     * @param Request $request
     * @param ApiResponse $apiResponse
     * @param SettingsRepository $repository
     * @param ValidatorService $validatorService
     * @return JsonResponse
     */
    public function update(Request $request, ApiResponse $apiResponse, SettingsRepository $repository, ValidatorService $validatorService): JsonResponse
    {
        $em = $this->getDoctrine()->getManager();
        $settings = $repository->findAll();
        $settings = (count($settings) == 0) ? new Settings() : $settings[0];

        $data = json_decode($request->getContent());
        if($data === null){
            return $apiResponse->apiJsonResponseBadRequest("Il manque des données");
        }

        $settings->setWebsiteName($data->websiteName);
        $settings->setEmailGlobal($data->emailGlobal);
        $settings->setEmailContact($data->emailContact);
        $settings->setEmailRgpd($data->emailRgpd);
        $settings->setLogoMail($data->logoMail);
        $settings->setUrlHomepage($this->generateUrl('app_homepage', [], UrlGeneratorInterface::ABSOLUTE_URL));

        $noErrors = $validatorService->validate($settings);
        if ($noErrors !== true) {
            return $apiResponse->apiJsonResponseValidationFailed($noErrors);
        }

        $em->persist($settings); $em->flush();

        return $apiResponse->apiJsonResponse($settings, User::VISITOR_READ);
    }

    /**
     * Test upload
     *
     * @Security("is_granted('ROLE_ADMIN')")
     *
     * @Route("/upload", name="test_upload", options={"expose"=true}, methods={"POST"})
     *
     * @OA\Response(
     *     response=200,
     *     description="Returns settings",
     * )
     * @OA\Tag(name="Settings")
     *
     * @param Request $request
     * @param ApiResponse $apiResponse
     * @param FileUploader $fileUploader
     * @return JsonResponse
     */
    public function testUpload(Request $request, ApiResponse $apiResponse, FileUploader $fileUploader): JsonResponse
    {
        $file = $request->files->get('avatar');

        if ($file) {
            $fileName = $fileUploader->upload($file, "uploads");
        }

        return $apiResponse->apiJsonResponseSuccessful("uploaded");
    }
}
