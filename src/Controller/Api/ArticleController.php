<?php

namespace App\Controller\Api;

use App\Entity\Blog\BoArticle;
use App\Entity\User;
use App\Repository\Blog\BoArticleRepository;
use App\Service\ApiResponse;
use App\Service\FileUploader;
use App\Service\SanitizeData;
use App\Service\ValidatorService;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Security;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Nelmio\ApiDocBundle\Annotation\Model;
use OpenApi\Annotations as OA;
use Symfony\Component\String\Slugger\AsciiSlugger;

/**
 * @Route("/api", name="api_articles_")
 */
class ArticleController extends AbstractController
{
    /**
     * Admin - Get array of articles
     *
     * @Security("is_granted('ROLE_ADMIN')")
     *
     * @Route("/articles", name="index", options={"expose"=true}, methods={"GET"})
     *
     * @OA\Response(
     *     response=200,
     *     description="Returns array of articles",
     * )
     * @OA\Tag(name="Articles")
     *
     * @param Request $request
     * @param BoArticleRepository $repository
     * @param ApiResponse $apiResponse
     * @return JsonResponse
     */
    public function index(Request $request, BoArticleRepository $repository, ApiResponse $apiResponse): JsonResponse
    {
        $order = $request->query->get('order') ?: 'ASC';
        $articles = $repository->findBy([], ['createdAt' => $order]);
        return $apiResponse->apiJsonResponse($articles, User::ADMIN_READ);
    }

    public function setArticle($article, $request, $fileName)
    {
        $title = $request->get('title');
        $introduction = $request->get('introduction');
        $content = $request->get('content');

        $article->setTitle(trim($title));
        $article->setIntroduction($introduction ?: null);
        $article->setContent($content ?: null);

        if($fileName){
            $article->setFile($fileName);
        }

        $slug = new AsciiSlugger();
        $article->setSlug($slug->slug(trim($title)));

        return $article;
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
     * @OA\Tag(name="Articles")
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

        $fileName = ($file) ? $fileUploader->upload($file, "articles", true) : null;

        $article = $this->setArticle(new BoArticle(), $request, $fileName);

        $noErrors = $validator->validate($article);

        if ($noErrors !== true) {
            return $apiResponse->apiJsonResponseValidationFailed($noErrors);
        }

        $em->persist($article);
        $em->flush();

        return $apiResponse->apiJsonResponse($article, User::ADMIN_READ);
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
     *     description="Only admin can change roles",
     *     @Model(type=BoArticle::class, groups={"admin:write"}),
     *     required=true
     * )
     *
     * @OA\Tag(name="Articles")
     *
     * @param Request $request
     * @param ValidatorService $validator
     * @param ApiResponse $apiResponse
     * @param BoArticle $article
     * @param FileUploader $fileUploader
     * @return JsonResponse
     */
    public function update(Request $request, ValidatorService $validator, ApiResponse $apiResponse, BoArticle $article, FileUploader $fileUploader): JsonResponse
    {
        $em = $this->getDoctrine()->getManager();
        $file = $request->files->get('file');

        $fileName = null;
        if($file){
            $oldFile = $this->getParameter('public_directory'). 'articles/' . $article->getFile();
            if($article->getFile() && file_exists($oldFile)){
                unlink($oldFile);
            }

            $fileName = $fileUploader->upload($file, "articles", true);
        }

        $article = $this->setArticle(new BoArticle(), $request, $fileName);

        $updatedAt = new \DateTime();
        $updatedAt->setTimezone(new \DateTimeZone("Europe/Paris"));
        $article->setUpdatedAt($updatedAt);

        $noErrors = $validator->validate($article);
        if ($noErrors !== true) {
            return $apiResponse->apiJsonResponseValidationFailed($noErrors);
        }

        $em->flush();

        return $apiResponse->apiJsonResponse($article, User::ADMIN_READ);
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
     * @OA\Tag(name="Articles")
     *
     * @param ApiResponse $apiResponse
     * @param BoArticle $article
     * @return JsonResponse
     */
    public function switchIsPublished(ApiResponse $apiResponse, BoArticle $article): JsonResponse
    {
        $em = $this->getDoctrine()->getManager();

        $article->setIsPublished(!$article->getIsPublished());
        $em->flush();

        return $apiResponse->apiJsonResponse($article, User::ADMIN_READ);
    }

    private function deleteArticle($em, BoArticle $article)
    {
        if($article->getFile()){
            $file = $this->getParameter('public_directory'). 'articles/' . $article->getFile();
            if(file_exists($file)){
                unlink($file);
            }
        }

        $em->remove($article);
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
     * @OA\Tag(name="Articles")
     *
     * @param ApiResponse $apiResponse
     * @param BoArticle $article
     * @return JsonResponse
     */
    public function delete(ApiResponse $apiResponse, BoArticle $article): JsonResponse
    {
        $em = $this->getDoctrine()->getManager();

        $this->deleteArticle($em, $article);
        $em->flush();

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
     * @return JsonResponse
     */
    public function deleteGroup(Request $request, ApiResponse $apiResponse): JsonResponse
    {
        $em = $this->getDoctrine()->getManager();
        $data = json_decode($request->getContent());

        $articles = $em->getRepository(BoArticle::class)->findBy(['id' => $data]);

        if ($articles) {
            foreach ($articles as $article) {
                $this->deleteArticle($em, $article);
            }
        }

        $em->flush();
        return $apiResponse->apiJsonResponseSuccessful("Supression de la sélection réussie !");
    }
}
