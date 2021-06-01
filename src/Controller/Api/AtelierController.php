<?php

namespace App\Controller\Api;

use App\Entity\User;
use App\Repository\Ace\AcAtelierRepository;
use App\Service\ApiResponse;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use OpenApi\Annotations as OA;

/**
 * @Route("/api/ateliers", name="api_ateliers_")
 */
class AtelierController extends AbstractController
{
    /**
     * Get array of ateliers
     *
     * @Route("/", name="index", options={"expose"=true}, methods={"GET"})
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
}
