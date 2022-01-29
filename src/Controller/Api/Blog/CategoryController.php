<?php

namespace App\Controller\Api\Blog;

use App\Entity\Blog\BoCategory;
use App\Entity\User;
use App\Service\ApiResponse;
use App\Service\Data\Blog\DataBlog;
use App\Service\ValidatorService;
use Doctrine\Common\Persistence\ManagerRegistry;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Security;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Nelmio\ApiDocBundle\Annotation\Model;
use OpenApi\Annotations as OA;

/**
 * @Route("/api/blog", name="api_blog_categories_")
 */
class CategoryController extends AbstractController
{
    private $doctrine;

    public function __construct(ManagerRegistry $doctrine)
    {
        $this->doctrine = $doctrine;
    }

    /**
     * Get array of categories
     *
     * @Route("/categories", name="index", options={"expose"=true}, methods={"GET"})
     *
     * @OA\Response(
     *     response=200,
     *     description="Returns array of categories",
     * )
     * @OA\Tag(name="Blog")
     *
     * @param Request $request
     * @param ApiResponse $apiResponse
     * @return JsonResponse
     */
    public function index(Request $request, ApiResponse $apiResponse): JsonResponse
    {
        $em = $this->doctrine->getManager();
        $order = $request->query->get('order') ?: 'ASC';
        $categories = $em->getRepository(BoCategory::class)->findBy([], ['name' => $order]);

        return $apiResponse->apiJsonResponse($categories, User::VISITOR_READ);
    }

    public function submitForm($type, BoCategory $category, Request $request, ApiResponse $apiResponse,
                               ValidatorService $validator, DataBlog $dataEntity): JsonResponse
    {
        $em = $this->doctrine->getManager();
        $data = json_decode($request->getContent());

        $category = $dataEntity->setDataCategory($category, $data);

        $noErrors = $validator->validate($category);
        if ($noErrors !== true) {
            return $apiResponse->apiJsonResponseValidationFailed($noErrors);
        }

        $em->persist($category);
        $em->flush();

        return $apiResponse->apiJsonResponse($category, User::VISITOR_READ);
    }

    /**
     * Admin - Create a category
     *
     * @Security("is_granted('ROLE_ADMIN')")
     *
     * @Route("/categories", name="create", options={"expose"=true}, methods={"POST"})
     *
     * @OA\Response(
     *     response=200,
     *     description="Returns a new category object",
     * )
     *
     * @OA\Response(
     *     response=400,
     *     description="JSON empty or missing data or validation failed",
     * )
     *
     * @OA\RequestBody (
     *     @Model(type=BoCategory::class, groups={"admin:write"}),
     *     required=true
     * )
     *
     * @OA\Tag(name="Blog")
     *
     * @param Request $request
     * @param ValidatorService $validator
     * @param ApiResponse $apiResponse
     * @param DataBlog $dataEntity
     * @return JsonResponse
     */
    public function create(Request $request, ValidatorService $validator, ApiResponse $apiResponse, DataBlog $dataEntity): JsonResponse
    {
        return $this->submitForm("create", new BoCategory(), $request, $apiResponse, $validator, $dataEntity);
    }

    /**
     * Admin - Update a category
     *
     * @Security("is_granted('ROLE_ADMIN')")
     *
     * @Route("/categories/{id}", name="update", options={"expose"=true}, methods={"PUT"})
     *
     * @OA\Response(
     *     response=200,
     *     description="Returns an category object",
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
     * @OA\RequestBody (
     *     @Model(type=BoCategory::class, groups={"admin:write"}),
     *     required=true
     * )
     *
     * @OA\Tag(name="Articles")
     *
     * @param BoCategory $obj
     * @param Request $request
     * @param ValidatorService $validator
     * @param ApiResponse $apiResponse
     * @param DataBlog $dataEntity
     * @return JsonResponse
     */
    public function update(BoCategory $obj, Request $request, ValidatorService $validator, ApiResponse $apiResponse, DataBlog $dataEntity): JsonResponse
    {
        return $this->submitForm("update", $obj, $request, $apiResponse, $validator, $dataEntity);
    }

    private function canDeleteCategory($em, BoCategory $category): bool
    {
        if($category->getSlug() === "autres"){
            return false;
        }else{
            $cat = $em->getRepository(BoCategory::class)->findOneBy(['slug' => 'autres']);
            if(!$cat){
                return false;
            }
            foreach ($category->getArticles() as $article){
                $article->setCategory($cat);
            }
        }

        return true;
    }

    /**
     * Admin - Delete a category
     *
     * @Security("is_granted('ROLE_ADMIN')")
     *
     * @Route("/categories/{id}", name="delete", options={"expose"=true}, methods={"DELETE"})
     *
     * @OA\Response(
     *     response=200,
     *     description="Return message successful",
     * )
     * @OA\Response(
     *     response=403,
     *     description="Forbidden for not good role or category",
     * )
     *
     * @OA\Tag(name="Blog")
     *
     * @param ApiResponse $apiResponse
     * @param BoCategory $category
     * @return JsonResponse
     */
    public function delete(ApiResponse $apiResponse, BoCategory $category): JsonResponse
    {
        $em = $this->doctrine->getManager();

        if($this->canDeleteCategory($em, $category)){
            $em->remove($category);
        }else{
            return $apiResponse->apiJsonResponseBadRequest("Une erreur est survenu, veuillez contacter le support.");
        }
        $em->flush();

        return $apiResponse->apiJsonResponseSuccessful("Supression réussie !");
    }

    /**
     * Admin - Delete a group of category
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
     *     description="Forbidden for not good role or categories",
     * )
     *
     * @OA\Tag(name="Blog")
     *
     * @param Request $request
     * @param ApiResponse $apiResponse
     * @return JsonResponse
     */
    public function deleteGroup(Request $request, ApiResponse $apiResponse): JsonResponse
    {
        $em = $this->doctrine->getManager();
        $data = json_decode($request->getContent());

        $categories = $em->getRepository(BoCategory::class)->findBy(['id' => $data]);

        if ($categories) {
            foreach ($categories as $category) {
                if($this->canDeleteCategory($em, $category)){
                    $em->remove($category);
                }else{
                    return $apiResponse->apiJsonResponseBadRequest("Une erreur est survenu, veuillez contacter le support.");
                }
            }
        }

        $em->flush();
        return $apiResponse->apiJsonResponseSuccessful("Supression de la sélection réussie !");
    }
}
