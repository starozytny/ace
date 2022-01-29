<?php


namespace App\Service\Data;


use App\Entity\User;
use App\Service\ApiResponse;
use App\Service\FileUploader;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;

class DataService
{
    private $em;
    private $apiResponse;

    public function __construct(EntityManagerInterface $em, ApiResponse $apiResponse)
    {
        $this->em = $em;
        $this->apiResponse = $apiResponse;
    }

    public function isSeenToTrue($obj, $groups = User::ADMIN_READ): JsonResponse
    {
        $obj->setIsSeen(true);

        $this->em->flush();
        return $this->apiResponse->apiJsonResponse($obj, $groups);
    }

    public function switchIsPublished($obj, $groups = User::ADMIN_READ): JsonResponse
    {
        $obj->setIsPublished(!$obj->getIsPublished());

        $this->em->flush();
        return $this->apiResponse->apiJsonResponse($obj, $groups);
    }

    public function deleteWithImg($obj, $img, FileUploader $fileUploader, $folder): JsonResponse
    {
        $this->em->remove($obj);
        $this->em->flush();

        $fileUploader->deleteFile($img, $folder);

        return $this->apiResponse->apiJsonResponseSuccessful("Supression réussie !");
    }

    public function delete($obj, $isSeen = false, $messageError = "Vous n'avez pas lu ce message."): JsonResponse
    {
        if($isSeen){
            if (!$obj->getIsSeen()) {
                return $this->apiResponse->apiJsonResponseBadRequest($messageError);
            }
        }

        $this->em->remove($obj);
        $this->em->flush();
        return $this->apiResponse->apiJsonResponseSuccessful("Supression réussie !");
    }

    public function deleteSelected($classe, $ids, $isSeen = false): JsonResponse
    {
        $objs = $this->em->getRepository($classe)->findBy(['id' => $ids]);

        if ($objs) {
            foreach ($objs as $obj) {
                if($isSeen){
                    if (!$obj->getIsSeen()) {
                        return $this->apiResponse->apiJsonResponseBadRequest('Vous n\'avez pas lu ce message.');
                    }
                }

                $this->em->remove($obj);
            }
        }

        $this->em->flush();
        return $this->apiResponse->apiJsonResponseSuccessful("Supression de la sélection réussie !");
    }

    public function createDate($timezone="Europe/Paris"): \DateTime
    {
        $date = new \DateTime();
        $date->setTimezone(new \DateTimeZone($timezone));

        return $date;
    }
}