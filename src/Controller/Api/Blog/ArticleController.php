<?php

namespace App\Controller\Api\Blog;

use App\Entity\Blog\BoArticle;
use App\Entity\Blog\BoCategory;
use App\Entity\User;
use App\Service\ApiResponse;
use App\Service\Data\Blog\DataBlog;
use App\Service\Data\DataService;
use App\Service\FileUploader;
use App\Service\ValidatorService;
use DateTime;
use Doctrine\Common\Persistence\ManagerRegistry;
use Exception;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Security;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Nelmio\ApiDocBundle\Annotation\Model;
use OpenApi\Annotations as OA;
use Symfony\Component\Serializer\SerializerInterface;

/**
 * @Route("/api/blog", name="api_articles_")
 */
class ArticleController extends AbstractController
{
    private $doctrine;

    public function __construct(ManagerRegistry $doctrine)
    {
        $this->doctrine = $doctrine;
    }
    /**
     * Get array of articles
     *
     * @Route("/articles", name="index", options={"expose"=true}, methods={"GET"})
     *
     * @OA\Response(
     *     response=200,
     *     description="Returns array of articles",
     * )
     * @OA\Tag(name="Blog")
     *
     * @param Request $request
     * @param SerializerInterface $serializer
     * @return JsonResponse
     */
    public function index(Request $request, SerializerInterface $serializer): JsonResponse
    {
        $em = $this->doctrine->getManager();
        $order = $request->query->get('order') ?: 'ASC';
        $articles = $em->getRepository(BoArticle::class)->findBy([], ['createdAt' => $order]);
        $categories = $em->getRepository(BoCategory::class)->findAll();

        $articles = $serializer->serialize($articles, "json", ['groups' => User::VISITOR_READ]);
        $categories = $serializer->serialize($categories, "json", ['groups' => User::VISITOR_READ]);

        return new JsonResponse([
            'articles' => $articles,
            'categories' => $categories
        ]);
    }

    /**
     * @throws Exception
     */
    public function submitForm($type, BoArticle $obj, Request $request, ApiResponse $apiResponse,
                               ValidatorService $validator, DataBlog $dataEntity, FileUploader $fileUploader): JsonResponse
    {
        $em = $this->doctrine->getManager();
        $data = json_decode($request->get('data'));

        if ($data === null) {
            return $apiResponse->apiJsonResponseBadRequest('Les données sont vides.');
        }

        $obj = $dataEntity->setDataArticle($obj, $data);

        $file = $request->files->get('file');
        $file1 = $request->files->get('file1');
        $file2 = $request->files->get('file2');
        $file3 = $request->files->get('file3');
        if($type === "create"){
            $fileName = ($file) ? $fileUploader->upload($file, BoArticle::FOLDER_ARTICLES, true) : null;
            $fileName1 = ($file1) ? $fileUploader->upload($file1, BoArticle::FOLDER_ARTICLES, true) : null;
            $fileName2 = ($file2) ? $fileUploader->upload($file2, BoArticle::FOLDER_ARTICLES, true) : null;
            $fileName3 = ($file3) ? $fileUploader->upload($file3, BoArticle::FOLDER_ARTICLES, true) : null;
            $obj->setFile($fileName);
            $obj->setFile1($fileName1);
            $obj->setFile2($fileName2);
            $obj->setFile3($fileName3);
        }else{
            if($file){
                $fileName = $fileUploader->replaceFile($file, $obj->getFile(),BoArticle::FOLDER_ARTICLES);
                $obj->setFile($fileName);
            }
            if($file1){
                $fileName = $fileUploader->replaceFile($file1, $obj->getFile1(),BoArticle::FOLDER_ARTICLES);
                $obj->setFile1($fileName);
            }
            if($file2){
                $fileName = $fileUploader->replaceFile($file2, $obj->getFile2(),BoArticle::FOLDER_ARTICLES);
                $obj->setFile2($fileName);
            }
            if($file3){
                $fileName = $fileUploader->replaceFile($file3, $obj->getFile3(),BoArticle::FOLDER_ARTICLES);
                $obj->setFile3($fileName);
            }

            $obj->setUpdatedAt(new DateTime());
        }

        $noErrors = $validator->validate($obj);
        if ($noErrors !== true) {
            return $apiResponse->apiJsonResponseValidationFailed($noErrors);
        }

        $em->persist($obj);
        $em->flush();

        return $apiResponse->apiJsonResponse($obj, User::VISITOR_READ);
    }

    /**
     * Admin - Create an article
     *
     * @Security("is_granted('ROLE_ADMIN')")
     *
     * @Route("/articles", name="create", options={"expose"=true}, methods={"POST"})
     *
     * @OA\Response(
     *     response=200,
     *     description="Returns a new article object",
     * )
     *
     * @OA\Response(
     *     response=400,
     *     description="JSON empty or missing data or validation failed",
     * )
     *
     * @OA\RequestBody (
     *     @Model(type=BoArticle::class, groups={"admin:write"}),
     *     required=true
     * )
     *
     * @OA\Tag(name="Blog")
     *
     * @param Request $request
     * @param ValidatorService $validator
     * @param ApiResponse $apiResponse
     * @param DataBlog $dataEntity
     * @param FileUploader $fileUploader
     * @return JsonResponse
     * @throws Exception
     */
    public function create(Request $request, ValidatorService $validator, ApiResponse $apiResponse,
                           DataBlog $dataEntity, FileUploader $fileUploader): JsonResponse
    {
        return $this->submitForm("create", new BoArticle(), $request, $apiResponse, $validator, $dataEntity, $fileUploader);
    }

    /**
     * Update an article
     *
     * @Security("is_granted('ROLE_ADMIN')")
     *
     * @Route("/articles/{id}", name="update", options={"expose"=true}, methods={"POST"})
     *
     * @OA\Response(
     *     response=200,
     *     description="Returns an article object",
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
     *     @Model(type=BoArticle::class, groups={"admin:write"}),
     *     required=true
     * )
     *
     * @OA\Tag(name="Blog")
     *
     * @param BoArticle $obj
     * @param Request $request
     * @param ValidatorService $validator
     * @param ApiResponse $apiResponse
     * @param DataBlog $dataEntity
     * @param FileUploader $fileUploader
     * @return JsonResponse
     * @throws Exception
     */
    public function update(BoArticle $obj, Request $request, ValidatorService $validator, ApiResponse $apiResponse,
                           DataBlog $dataEntity, FileUploader $fileUploader): JsonResponse
    {
        return $this->submitForm("update", $obj, $request, $apiResponse, $validator, $dataEntity, $fileUploader);
    }

    /**
     * Switch is published
     *
     * @Security("is_granted('ROLE_ADMIN')")
     *
     * @Route("/article/{id}", name="article_published", options={"expose"=true}, methods={"POST"})
     *
     * @OA\Response(
     *     response=200,
     *     description="Returns an article object",
     * )
     * @OA\Response(
     *     response=403,
     *     description="Forbidden for not good role or article",
     * )
     *
     * @OA\Tag(name="Blog")
     *
     * @param DataService $dataService
     * @param BoArticle $obj
     * @return JsonResponse
     */
    public function switchIsPublished(DataService $dataService, BoArticle $obj): JsonResponse
    {
        return $dataService->switchIsPublished($obj, User::VISITOR_READ);
    }

    /**
     * Admin - Delete an article
     *
     * @Security("is_granted('ROLE_ADMIN')")
     *
     * @Route("/articles/{id}", name="delete", options={"expose"=true}, methods={"DELETE"})
     *
     * @OA\Response(
     *     response=200,
     *     description="Return message successful",
     * )
     * @OA\Response(
     *     response=403,
     *     description="Forbidden for not good role or article",
     * )
     *
     * @OA\Tag(name="Blog")
     *
     * @param BoArticle $obj
     * @param ApiResponse $apiResponse
     * @param FileUploader $fileUploader
     * @return JsonResponse
     */
    public function delete(BoArticle $obj, ApiResponse $apiResponse, FileUploader $fileUploader): JsonResponse
    {
        $em = $this->doctrine->getManager();

        $em->remove($obj);
        $em->flush();

        $fileUploader->deleteFile($obj->getFile(), BoArticle::FOLDER_ARTICLES);
        $fileUploader->deleteFile($obj->getFile1(), BoArticle::FOLDER_ARTICLES);
        $fileUploader->deleteFile($obj->getFile2(), BoArticle::FOLDER_ARTICLES);
        $fileUploader->deleteFile($obj->getFile3(), BoArticle::FOLDER_ARTICLES);

        return $apiResponse->apiJsonResponseSuccessful("Supression réussie !");
    }

    /**
     * Admin - Delete a group of article
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
     *     description="Forbidden for not good role or articles",
     * )
     *
     * @OA\Tag(name="Articles")
     *
     * @param Request $request
     * @param ApiResponse $apiResponse
     * @param FileUploader $fileUploader
     * @return JsonResponse
     */
    public function deleteGroup(Request $request, ApiResponse $apiResponse, FileUploader $fileUploader): JsonResponse
    {
        $em = $this->doctrine->getManager();
        $data = json_decode($request->getContent());

        $objs = $em->getRepository(BoArticle::class)->findBy(['id' => $data]);

        $files = [];
        if ($objs) {
            foreach ($objs as $obj) {
                $files[] = $obj->getFile();
                $files[] = $obj->getFile1();
                $files[] = $obj->getFile2();
                $files[] = $obj->getFile3();
                $em->remove($obj);
            }
        }

        $em->flush();

        foreach($files as $file){
            $fileUploader->deleteFile($file, BoArticle::FOLDER_ARTICLES);
        }

        return $apiResponse->apiJsonResponseSuccessful("Supression de la sélection réussie !");
    }
}
