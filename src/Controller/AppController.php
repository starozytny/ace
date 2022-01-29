<?php

namespace App\Controller;

use App\Entity\Blog\BoArticle;
use App\Entity\User;
use App\Repository\Ace\AcAtelierRepository;
use App\Repository\Ace\AcServiceRepository;
use App\Repository\Blog\BoArticleRepository;
use App\Entity\Ace\AcTestimonial;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;

class AppController extends AbstractController
{
    /**
     * @Route("/", name="app_homepage")
     */
    public function index(BoArticleRepository $repository, SerializerInterface $serializer): Response
    {
        $articles = $repository->findBy([], ['createdAt' => 'ASC']);

        $temoignagesAll = $em->getRepository(AcTestimonial::class)->findAll();
        $temoignages = [];
        $temoignages2 = [];
        $temoignages3 = [];
        for($i=0; $i<count($temoignagesAll) ; $i++){
            if($i < 3){
                $temoignages[] = $temoignagesAll[$i];
            }else if($i < 6){
                $temoignages2[] = $temoignagesAll[$i];
            }else if($i < 9){
                $temoignages3[] = $temoignagesAll[$i];
            }
        }

        $temoignages = $serializer->serialize($temoignages, 'json', ['groups' => User::VISITOR_READ]);
        $temoignages2 = $serializer->serialize($temoignages2, 'json', ['groups' => User::VISITOR_READ]);
        $temoignages3 = $serializer->serialize($temoignages3, 'json', ['groups' => User::VISITOR_READ]);

        if(count($articles) <= 0){
            return $this->render('app/pages/index.html.twig', [
                'temoignages' => $temoignages,
                'temoignages2' => $temoignages2,
                'temoignages3' => $temoignages3
            ]);
        }

        return $this->render('app/pages/index.html.twig', [
            'article' => $articles[0],
            'temoignages' => $temoignages,
            'temoignages2' => $temoignages2,
            'temoignages3' => $temoignages3
        ]);
    }

    /**
     * @Route("/legales/mentions-legales", name="app_mentions")
     */
    public function mentions(): Response
    {
        return $this->render('app/pages/legales/mentions.html.twig');
    }

    /**
     * @Route("/legales/politique-confidentialite", options={"expose"=true}, name="app_politique")
     */
    public function politique(): Response
    {
        return $this->render('app/pages/legales/politique.html.twig');
    }

    /**
     * @Route("/legales/cookies", name="app_cookies")
     */
    public function cookies(): Response
    {
        return $this->render('app/pages/legales/cookies.html.twig');
    }

    /**
     * @Route("/legales/rgpd", name="app_rgpd")
     */
    public function rgpd(): Response
    {
        return $this->render('app/pages/legales/rgpd.html.twig');
    }

    /**
     * @Route("/contact/{subject}/{atelier}", options={"expose"=true}, name="app_contact", defaults={"subject": "autre", "atelier": ""})
     */
    public function contact($subject, $atelier): Response
    {
        return $this->render('app/pages/contact/index.html.twig', ['subject' => $subject, 'atelier' => $atelier]);
    }

    /**
     * @Route("/services/{slug}", name="app_services")
     */
    public function service(AcServiceRepository $serviceRepository, $slug): Response
    {
        $service = $serviceRepository->findOneBy(['slug' => $slug]);
        return $this->render('app/pages/services/index.html.twig', [
            'service' => $service
        ]);
    }

    /**
     * @Route("/ateliers", name="app_ateliers")
     */
    public function ateliers(AcAtelierRepository $atelierRepository): Response
    {
        $ateliers = $atelierRepository->findAll();
        return $this->render('app/pages/ateliers/index.html.twig', [
            'ateliers' => $ateliers
        ]);
    }

    /**
     * @Route("/actualites", name="app_actualites")
     */
    public function actualites(BoArticleRepository $repository, SerializerInterface $serializer): Response
    {
        $objs = $repository->findBy(['isPublished' => true, "visibleBy" => BoArticle::VISIBILITY_ALL], ["createdAt" => "ASC", "updatedAt" => "ASC"]);
        $objs = $serializer->serialize($objs, 'json', ['groups' => User::VISITOR_READ]);

        return $this->render('app/pages/actualites/index.html.twig', [
            'donnees' => $objs
        ]);
    }

    /**
     * @Route("/actualites/article/{slug}", options={"expose"=true}, name="app_article")
     */
    public function article(BoArticleRepository $articleRepository, $slug): Response
    {
        $article = $articleRepository->findOneBy(['slug' => $slug]);
        if(!$article){
            throw new NotFoundHttpException();
        }

        return $this->render('app/pages/actualites/article.html.twig', [
            'article' => $article
        ]);
    }
}
