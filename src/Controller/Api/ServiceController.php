<?php

namespace App\Controller\Api;

use App\Entity\Ace\AcAtelier;
use App\Entity\Ace\AcService;
use App\Entity\User;
use App\Repository\Ace\AcAtelierRepository;
use App\Repository\Ace\AcServiceRepository;
use App\Service\ApiResponse;
use App\Service\FileUploader;
use App\Service\ValidatorService;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Security;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use OpenApi\Annotations as OA;
use Symfony\Component\String\Slugger\AsciiSlugger;

/**
 * @Route("/api", name="api_services_")
 */
class ServiceController extends AbstractController
{
    /**
     * Get array of services
     *
     * @Route("/services", name="index", options={"expose"=true}, methods={"GET"})
     *
     * @OA\Response(
     *     response=200,
     *     description="Returns array of services",
     * )
     * @OA\Tag(name="Services")
     *
     * @param AcServiceRepository $repository
     * @param ApiResponse $apiResponse
     * @return JsonResponse
     */
    public function index(AcServiceRepository $repository, ApiResponse $apiResponse): JsonResponse
    {
        $services = $repository->findAll();
        return $apiResponse->apiJsonResponse($services, User::VISITOR_READ);
    }

    public function setService(AcService $service, $request, $fileName1, $fileName2, $fileName3, $fileName4, $fileName5): AcService
    {
        $title = $request->get('title');
        $intro = $request->get('intro');
        $content = $request->get('content');
        $seance = $request->get('seance');
        $nbSeance = $request->get('nbSeance');

        $service->setTitle(trim($title));
        $service->setIntro($intro ?: null);
        $service->setContent($content ?: null);
        $service->setSeance($seance ?: null);
        $service->setNbSeance($nbSeance ?: null);

        if($fileName1){
            $service->setFile1($fileName1);
        }
        if($fileName2){
            $service->setFile2($fileName2);
        }
        if($fileName3){
            $service->setFile3($fileName3);
        }
        if($fileName4){
            $service->setFile4($fileName4);
        }
        if($fileName5){
            $service->setFile5($fileName5);
        }

        if($service->getSlug() !== "etudiants-lyceens" && $service->getSlug() !== "entreprises"
            && $service->getSlug() !== "particuliers" && $service->getSlug() !== "sportifs")
        {
            $slug = new AsciiSlugger();
            $service->setSlug($slug->slug(trim($title)));
        }


        return $service;
    }

    /**
     * Admin - Create a service
     *
     * @Security("is_granted('ROLE_ADMIN')")
     *
     * @Route("/services", name="create", options={"expose"=true}, methods={"POST"})
     *
     * @OA\Response(
     *     response=200,
     *     description="Returns a new service object",
     * )
     *
     * @OA\Response(
     *     response=400,
     *     description="JSON empty or missing data or validation failed",
     * )
     *
     * @OA\Tag(name="Services")
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
        $file1 = $request->files->get('file1');
        $file2 = $request->files->get('file2');
        $file3 = $request->files->get('file3');
        $file4 = $request->files->get('file4');
        $file5 = $request->files->get('file5');

        $fileName1 = ($file1) ? $fileUploader->upload($file1, "services", true) : null;
        $fileName2 = ($file2) ? $fileUploader->upload($file2, "services", true) : null;
        $fileName3 = ($file3) ? $fileUploader->upload($file3, "services", true) : null;
        $fileName4 = ($file4) ? $fileUploader->upload($file4, "services", true) : null;
        $fileName5 = ($file5) ? $fileUploader->upload($file5, "services", true) : null;

        $service = $this->setService(new AcService(), $request, $fileName1,  $fileName2,  $fileName3,  $fileName4,  $fileName5);

        $noErrors = $validator->validate($service);
        if ($noErrors !== true) {
            return $apiResponse->apiJsonResponseValidationFailed($noErrors);
        }

        $em->persist($service);
        $em->flush();
        return $apiResponse->apiJsonResponse($service, User::VISITOR_READ);
    }

    private function replaceFile($fileUploader, $file, $serviceFile)
    {
        if($file){
            $oldFile = $this->getParameter('public_directory'). 'services/' . $serviceFile;
            $fileName = $fileUploader->upload($file, "services", true);
            if($serviceFile && file_exists($oldFile) && $serviceFile !== $fileName){
                unlink($oldFile);
            }

            return $fileName;
        }

        return null;
    }

    /**
     * Update a service
     *
     * @Security("is_granted('ROLE_ADMIN')")
     *
     * @Route("/services/{id}", name="update", options={"expose"=true}, methods={"POST"})
     *
     * @OA\Response(
     *     response=200,
     *     description="Returns an service object",
     * )
     * @OA\Response(
     *     response=403,
     *     description="Forbidden for not good role or service",
     * )
     * @OA\Response(
     *     response=400,
     *     description="Validation failed",
     * )
     *
     * @OA\Tag(name="Services")
     *
     * @param Request $request
     * @param ValidatorService $validator
     * @param ApiResponse $apiResponse
     * @param AcService $service
     * @param FileUploader $fileUploader
     * @return JsonResponse
     */
    public function update(Request $request, ValidatorService $validator, ApiResponse $apiResponse, AcService $service, FileUploader $fileUploader): JsonResponse
    {
        $em = $this->getDoctrine()->getManager();
        $file1 = $request->files->get('file1');
        $file2 = $request->files->get('file2');
        $file3 = $request->files->get('file3');
        $file4 = $request->files->get('file4');
        $file5 = $request->files->get('file5');

        $fileName1 = $this->replaceFile($fileUploader, $file1, $service->getFile1());
        $fileName2 = $this->replaceFile($fileUploader, $file2, $service->getFile2());
        $fileName3 = $this->replaceFile($fileUploader, $file3, $service->getFile3());
        $fileName4 = $this->replaceFile($fileUploader, $file4, $service->getFile4());
        $fileName5 = $this->replaceFile($fileUploader, $file5, $service->getFile5());

        $service = $this->setService($service, $request, $fileName1, $fileName2, $fileName3, $fileName4, $fileName5);

        $noErrors = $validator->validate($service);
        if ($noErrors !== true) {
            return $apiResponse->apiJsonResponseValidationFailed($noErrors);
        }

        $em->flush();
        return $apiResponse->apiJsonResponse($service, User::VISITOR_READ);
    }

    private function deleteFile($serviceFile)
    {
        if($serviceFile){
            $file = $this->getParameter('public_directory'). 'services/' . $serviceFile;
            if(file_exists($file)){
                unlink($file);
            }
        }
    }

    private function deleteService($em, AcService $service)
    {
        $this->deleteFile($service->getFile1());
        $this->deleteFile($service->getFile2());
        $this->deleteFile($service->getFile3());
        $this->deleteFile($service->getFile4());
        $this->deleteFile($service->getFile5());

        $em->remove($service);
    }

    /**
     * Admin - Delete a service
     *
     * @Security("is_granted('ROLE_ADMIN')")
     *
     * @Route("/services/{id}", name="delete", options={"expose"=true}, methods={"DELETE"})
     *
     * @OA\Response(
     *     response=200,
     *     description="Return message successful",
     * )
     * @OA\Response(
     *     response=403,
     *     description="Forbidden for not good role or service",
     * )
     *
     * @OA\Tag(name="Services")
     *
     * @param ApiResponse $apiResponse
     * @param AcService $service
     * @return JsonResponse
     */
    public function delete(ApiResponse $apiResponse, AcService $service): JsonResponse
    {
        $em = $this->getDoctrine()->getManager();

        $this->deleteService($em, $service);
        $em->flush();

        return $apiResponse->apiJsonResponseSuccessful("Supression réussie !");
    }

    /**
     * Admin - Delete a group of service
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
     *     description="Forbidden for not good role or service",
     * )
     *
     * @OA\Tag(name="Services")
     *
     * @param Request $request
     * @param ApiResponse $apiResponse
     * @return JsonResponse
     */
    public function deleteGroup(Request $request, ApiResponse $apiResponse): JsonResponse
    {
        $em = $this->getDoctrine()->getManager();
        $data = json_decode($request->getContent());

        $services = $em->getRepository(AcService::class)->findBy(['id' => $data]);

        if ($services) {
            foreach ($services as $service) {
                $this->deleteService($em, $service);
            }
        }

        $em->flush();
        return $apiResponse->apiJsonResponseSuccessful("Supression de la sélection réussie !");
    }
}
