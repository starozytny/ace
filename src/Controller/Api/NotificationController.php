<?php

namespace App\Controller\Api;

use App\Entity\Notification;
use App\Entity\User;
use App\Repository\NotificationRepository;
use App\Service\ApiResponse;
use App\Service\Data\DataService;
use Doctrine\Common\Persistence\ManagerRegistry;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use OpenApi\Annotations as OA;

/**
 * @Route("/api/notifications", name="api_notifications_")
 */
class NotificationController extends AbstractController
{
    private $doctrine;

    public function __construct(ManagerRegistry $doctrine)
    {
        $this->doctrine = $doctrine;
    }

    /**
     * Get array of notifications
     *
     * @Route("/", name="index", options={"expose"=true}, methods={"GET"})
     *
     * @OA\Response(
     *     response=200,
     *     description="Returns array of notifications",
     * )
     * @OA\Tag(name="Notification")
     *
     * @param NotificationRepository $repository
     * @param ApiResponse $apiResponse
     * @return JsonResponse
     */
    public function index(NotificationRepository $repository, ApiResponse $apiResponse): JsonResponse
    {
        $objs = $repository->findAll();
        return $apiResponse->apiJsonResponse($objs, User::ADMIN_READ);
    }

    /**
     * Change isSeen to true
     *
     * @Route("/{id}/is-seen", name="isSeen", options={"expose"=true}, methods={"POST"})
     *
     * @OA\Response(
     *     response=200,
     *     description="Returns contact object",
     * )
     *
     * @OA\Tag(name="Notification")
     *
     * @param Notification $obj
     * @param DataService $dataService
     * @return JsonResponse
     */
    public function isSeen(Notification $obj, DataService $dataService): JsonResponse
    {
        return $dataService->isSeenToTrue($obj);
    }

    /**
     * Set all to seen
     *
     * @Route("/all/seen", name="isSeen_all", options={"expose"=true}, methods={"POST"})
     *
     * @OA\Response(
     *     response=200,
     *     description="Return message successful",
     * )
     *
     * @OA\Tag(name="Notification")
     *
     * @param NotificationRepository $notificationRepository
     * @param ApiResponse $apiResponse
     * @return JsonResponse
     */
    public function allSeen(NotificationRepository $notificationRepository, ApiResponse $apiResponse): JsonResponse
    {
        $em = $this->doctrine->getManager();
        $objs = $notificationRepository->findBy(['isSeen' => false]);

        foreach($objs as $obj){
            $obj->setIsSeen(true);
        }

        $objs = $notificationRepository->findAll();

        $em->flush();
        return $apiResponse->apiJsonResponse($objs, User::ADMIN_READ);
    }

    /**
     * Delete a notification
     *
     * @Route("/{id}", name="delete", options={"expose"=true}, methods={"DELETE"})
     *
     * @OA\Response(
     *     response=200,
     *     description="Return message successful",
     * )
     *
     * @OA\Tag(name="Notification")
     *
     * @param Notification $obj
     * @param DataService $dataService
     * @return JsonResponse
     */
    public function delete(Notification $obj, DataService $dataService): JsonResponse
    {
        return $dataService->delete($obj);
    }

    /**
     * Delete a group of message notification
     *
     * @Route("/", name="delete_group", options={"expose"=true}, methods={"DELETE"})
     *
     * @OA\Response(
     *     response=200,
     *     description="Return message successful",
     * )
     *
     * @OA\Tag(name="Notification")
     *
     * @param Request $request
     * @param DataService $dataService
     * @return JsonResponse
     */
    public function deleteSelected(Request $request, DataService $dataService): JsonResponse
    {
        return $dataService->deleteSelected(Notification::class, json_decode($request->getContent()));
    }
}
