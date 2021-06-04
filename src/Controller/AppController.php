<?php

namespace App\Controller;

use App\Entity\Ace\AcAtelier;
use App\Entity\Ace\AcService;
use App\Entity\Blog\BoArticle;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\Routing\Annotation\Route;

class AppController extends AbstractController
{
    /**
     * @Route("/", name="app_homepage")
     */
    public function index(): Response
    {
        $em = $this->getDoctrine()->getManager();
        $articles = $em->getRepository(BoArticle::class)->findBy([], ['createdAt' => 'ASC']);
        if(count($articles) <= 0){
            return $this->render('app/pages/index.html.twig');
        }
        return $this->render('app/pages/index.html.twig', [
            'article' => $articles[0]
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
    public function service($slug): Response
    {
        $em = $this->getDoctrine()->getManager();
        $service = $em->getRepository(AcService::class)->findOneBy(['slug' => $slug]);
        return $this->render('app/pages/services/index.html.twig', [
            'service' => $service
        ]);
    }

    /**
     * @Route("/ateliers", name="app_ateliers")
     */
    public function ateliers(): Response
    {
        $em = $this->getDoctrine()->getManager();
        $ateliers = $em->getRepository(AcAtelier::class)->findAll();
        return $this->render('app/pages/ateliers/index.html.twig', [
            'ateliers' => $ateliers
        ]);
    }

    /**
     * @Route("/actualites", name="app_actualites")
     */
    public function actualites(): Response
    {
        return $this->render('app/pages/actualites/index.html.twig');
    }

    /**
     * @Route("/actualites/article/{slug}", options={"expose"=true}, name="app_article")
     */
    public function article($slug): Response
    {
        $em = $this->getDoctrine()->getManager();
        $article = $em->getRepository(BoArticle::class)->findOneBy(['slug' => $slug]);
        if(!$article){
            throw new NotFoundHttpException();
        }

        return $this->render('app/pages/actualites/article.html.twig', [
            'article' => $article
        ]);
    }
}
