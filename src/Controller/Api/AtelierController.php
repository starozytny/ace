<?php

namespace App\Controller\Api;

use App\Entity\Ace\AcAtelier;
use App\Entity\User;
use App\Repository\Ace\AcAtelierRepository;
use App\Service\ApiResponse;
use App\Service\FileUploader;
use App\Service\ValidatorService;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Security;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use OpenApi\Annotations as OA;

/**
 * @Route("/api/", name="api_ateliers_")
 */
class AtelierController extends AbstractController
{
    /**
     * Get array of ateliers
     *
     * @Route("/ateliers", name="index", options={"expose"=true}, methods={"GET"})
     *
     * @OA\Response(
     *     response=200,
     *     description="Returns array of ateliers",
     * )
     * @OA\Tag(name="Ateliers")
     *
     * @param AcAtelierRepository $repository
     * @param ApiResponse $apiResponse
     * @return JsonResponse
     */
    public function index(AcAtelierRepository $repository, ApiResponse $apiResponse): JsonResponse
    {
        $ateliers = $repository->findAll();
        return $apiResponse->apiJsonResponse($ateliers, User::VISITOR_READ);
    }

    public function setAtelier(AcAtelier $atelier, $request, $fileName): AcAtelier
    {
        $name = $request->get('name');
        $content = $request->get('content');
        $min = $request->get('min');
        $max = $request->get('max');

        $atelier->setName(trim($name));
        $atelier->setContent($content ?: null);
        $atelier->setMin($min);
        $atelier->setMax($max);

        if($fileName){
            $atelier->setFile($fileName);
        }

        return $atelier;
    }

    /**
     * Admin - Create an atelier
     *
     * @Security("is_granted('ROLE_ADMIN')")
     *
     * @Route("/ateliers", name="create", options={"expose"=true}, methods={"POST"})
     *
     * @OA\Response(
     *     response=200,
     *     description="Returns a new atelier object",
     * )
     *
     * @OA\Response(
     *     response=400,
     *     description="JSON empty or missing data or validation failed",
     * )
     *
     * @OA\Tag(name="Ateliers")
     *
     * @param Request $request
     * @param ValidatorService $validator
     * @param ApiResponse $apiResponse
     * @param FileUploader $fileUploader
     * @return JsonResponse
     */
    public function create(Request $request, ValidatorService $validator, ApiResponse $apiResponse, FileUploader $fileUploader): JsonResponse
    {
        $em = $this->getDoctrine()->getManager();
        $file = $request->files->get('file');

        $fileName = ($file) ? $fileUploader->upload($file, "ateliers", true) : null;

        $atelier = $this->setAtelier(new AcAtelier(), $request, $fileName);

        $noErrors = $validator->validate($atelier);
        if ($noErrors !== true) {
            return $apiResponse->apiJsonResponseValidationFailed($noErrors);
        }

        $em->persist($atelier);
        $em->flush();
        return $apiResponse->apiJsonResponse($atelier, User::VISITOR_READ);
    }

    /**
     * Update an atelier
     *
     * @Security("is_granted('ROLE_ADMIN')")
     *
     * @Route("/ateliers/{id}", name="update", options={"expose"=true}, methods={"POST"})
     *
     * @OA\Response(
     *     response=200,
     *     description="Returns an atelier object",
     * )
     * @OA\Response(
     *     response=403,
     *     description="Forbidden for not good role or article",
     * )
     * @OA\Response(
     *     response=400,
     *     description="Validation failed",
     * )
     *
     * @OA\Tag(name="Ateliers")
     *
     * @param Request $request
     * @param ValidatorService $validator
     * @param ApiResponse $apiResponse
     * @param AcAtelier $atelier
     * @param FileUploader $fileUploader
     * @return JsonResponse
     */
    public function update(Request $request, ValidatorService $validator, ApiResponse $apiResponse, AcAtelier $atelier, FileUploader $fileUploader): JsonResponse
    {
        $em = $this->getDoctrine()->getManager();
        $file = $request->files->get('file');

        $fileName = null;
        if($file){
            $oldFile = $this->getParameter('public_directory'). 'ateliers/' . $atelier->getFile();
            $fileName = $fileUploader->upload($file, "ateliers", true);
            if($atelier->getFile() && file_exists($oldFile) && $atelier->getFile() !== $fileName){
                unlink($oldFile);
            }
        }

        $atelier = $this->setAtelier($atelier, $request, $fileName);

        $noErrors = $validator->validate($atelier);
        if ($noErrors !== true) {
            return $apiResponse->apiJsonResponseValidationFailed($noErrors);
        }

        $em->flush();
        return $apiResponse->apiJsonResponse($atelier, User::VISITOR_READ);
    }

    private function deleteAtelier($em, AcAtelier $atelier)
    {
        if($atelier->getFile()){
            $file = $this->getParameter('public_directory'). 'ateliers/' . $atelier->getFile();
            if(file_exists($file)){
                unlink($file);
            }
        }

        $em->remove($atelier);
    }

    /**
     * Admin - Delete an atelier
     *
     * @Security("is_granted('ROLE_ADMIN')")
     *
     * @Route("/ateliers/{id}", name="delete", options={"expose"=true}, methods={"DELETE"})
     *
     * @OA\Response(
     *     response=200,
     *     description="Return message successful",
     * )
     * @OA\Response(
     *     response=403,
     *     description="Forbidden for not good role or atelier",
     * )
     *
     * @OA\Tag(name="Ateliers")
     *
     * @param ApiResponse $apiResponse
     * @param AcAtelier $atelier
     * @return JsonResponse
     */
    public function delete(ApiResponse $apiResponse, AcAtelier $atelier): JsonResponse
    {
        $em = $this->getDoctrine()->getManager();

        $this->deleteAtelier($em, $atelier);
        $em->flush();

        return $apiResponse->apiJsonResponseSuccessful("Supression réussie !");
    }

    /**
     * Admin - Delete a group of atelier
     *
     * @Security("is_granted('ROLE_ADMIN')")
     *
     * @Route("/", name="delete_group", options={"expose"=true}, methods={"DELETE"})
     *
     * @OA\Response(
     *     response=200,
     *     description="Return message successful",
     * )
     * @OA\Response(
     *     response=403,
     *     description="Forbidden for not good role or atelier",
     * )
     *
     * @OA\Tag(name="Ateliers")
     *
     * @param Request $request
     * @param ApiResponse $apiResponse
     * @return JsonResponse
     */
    public function deleteGroup(Request $request, ApiResponse $apiResponse): JsonResponse
    {
        $em = $this->getDoctrine()->getManager();
        $data = json_decode($request->getContent());

        $ateliers = $em->getRepository(AcAtelier::class)->findBy(['id' => $data]);

        if ($ateliers) {
            foreach ($ateliers as $atelier) {
                $this->deleteAtelier($em, $atelier);
            }
        }

        $em->flush();
        return $apiResponse->apiJsonResponseSuccessful("Supression de la sélection réussie !");
    }
}
