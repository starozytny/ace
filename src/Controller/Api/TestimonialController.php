<?php

namespace App\Controller\Api;

use App\Entity\Ace\AcAtelier;
use App\Entity\Ace\AcTestimonial;
use App\Entity\User;
use App\Repository\Ace\AcAtelierRepository;
use App\Repository\Ace\AcTestimonialRepository;
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
 * @Route("/api", name="api_testimonials_")
 */
class TestimonialController extends AbstractController
{
    /**
     * Get array of testimonials
     *
     * @Route("/testimonials", name="index", options={"expose"=true}, methods={"GET"})
     *
     * @OA\Response(
     *     response=200,
     *     description="Returns array of testimonials",
     * )
     * @OA\Tag(name="Témoignages")
     *
     * @param AcTestimonialRepository $repository
     * @param ApiResponse $apiResponse
     * @return JsonResponse
     */
    public function index(AcTestimonialRepository $repository, ApiResponse $apiResponse): JsonResponse
    {
        $objs = $repository->findAll();
        return $apiResponse->apiJsonResponse($objs, User::VISITOR_READ);
    }

    public function setTestimonial(AcTestimonial $testimonial, $request): AcTestimonial
    {
        $data = json_decode($request->getContent());
        $name = $data->name;
        $content = $data->content;
        $work = $data->work;

        $testimonial->setName(trim($name));
        $testimonial->setContent($content ?: null);
        $testimonial->setWork($work);

        return $testimonial;
    }

    /**
     * Admin - Create an testimonial
     *
     * @Security("is_granted('ROLE_ADMIN')")
     *
     * @Route("/testimonials", name="create", options={"expose"=true}, methods={"POST"})
     *
     * @OA\Response(
     *     response=200,
     *     description="Returns a new testimonial object",
     * )
     *
     * @OA\Response(
     *     response=400,
     *     description="JSON empty or missing data or validation failed",
     * )
     *
     * @OA\Tag(name="Témoignages")
     *
     * @param Request $request
     * @param ValidatorService $validator
     * @param ApiResponse $apiResponse
     * @return JsonResponse
     */
    public function create(Request $request, ValidatorService $validator, ApiResponse $apiResponse): JsonResponse
    {
        $em = $this->getDoctrine()->getManager();

        $obj = $this->setTestimonial(new AcTestimonial(), $request);

        $noErrors = $validator->validate($obj);
        if ($noErrors !== true) {
            return $apiResponse->apiJsonResponseValidationFailed($noErrors);
        }

        $em->persist($obj);
        $em->flush();
        return $apiResponse->apiJsonResponse($obj, User::VISITOR_READ);
    }

    /**
     * Update an testimonial
     *
     * @Security("is_granted('ROLE_ADMIN')")
     *
     * @Route("/testimonials/{id}", name="update", options={"expose"=true}, methods={"PUT"})
     *
     * @OA\Response(
     *     response=200,
     *     description="Returns an testimonial object",
     * )
     * @OA\Response(
     *     response=403,
     *     description="Forbidden for not good role or testimonial",
     * )
     * @OA\Response(
     *     response=400,
     *     description="Validation failed",
     * )
     *
     * @OA\Tag(name="Témoignages")
     *
     * @param Request $request
     * @param ValidatorService $validator
     * @param ApiResponse $apiResponse
     * @param AcTestimonial $obj
     * @return JsonResponse
     */
    public function update(Request $request, ValidatorService $validator, ApiResponse $apiResponse, AcTestimonial $obj): JsonResponse
    {
        $em = $this->getDoctrine()->getManager();

        $obj = $this->setTestimonial($obj, $request);

        $noErrors = $validator->validate($obj);
        if ($noErrors !== true) {
            return $apiResponse->apiJsonResponseValidationFailed($noErrors);
        }

        $em->flush();
        return $apiResponse->apiJsonResponse($obj, User::VISITOR_READ);
    }

    /**
     * Admin - Delete an testimonial
     *
     * @Security("is_granted('ROLE_ADMIN')")
     *
     * @Route("/testimonials/{id}", name="delete", options={"expose"=true}, methods={"DELETE"})
     *
     * @OA\Response(
     *     response=200,
     *     description="Return message successful",
     * )
     * @OA\Response(
     *     response=403,
     *     description="Forbidden for not good role or testimonial",
     * )
     *
     * @OA\Tag(name="Témoignages")
     *
     * @param ApiResponse $apiResponse
     * @param AcTestimonial $obj
     * @return JsonResponse
     */
    public function delete(ApiResponse $apiResponse, AcTestimonial $obj): JsonResponse
    {
        $em = $this->getDoctrine()->getManager();

        $em->remove($obj);
        $em->flush();

        return $apiResponse->apiJsonResponseSuccessful("Supression réussie !");
    }

    /**
     * Admin - Delete a group of testimonial
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
     *     description="Forbidden for not good role or testimonial",
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

        $objs = $em->getRepository(AcTestimonial::class)->findBy(['id' => $data]);

        if ($objs) {
            foreach ($objs as $obj) {
                $em->remove($obj);
            }
        }

        $em->flush();
        return $apiResponse->apiJsonResponseSuccessful("Supression de la sélection réussie !");
    }
}
