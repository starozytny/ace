<?php

namespace App\Controller;

use App\Entity\Blog\BoArticle;
use App\Entity\User;
use App\Repository\Blog\BoArticleRepository;
use Doctrine\Common\Persistence\ManagerRegistry;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;

/**
 * @Route("/espace-membre", name="user_")
 */
class UserController extends AbstractController
{
    /**
     * @Route("/", options={"expose"=true}, name="homepage")
     */
    public function index(): Response
    {
        return $this->render('user/pages/index.html.twig');
    }

    /**
     * @Route("/profil", options={"expose"=true}, name="profil")
     */
    public function profil(): Response
    {
        /** @var User $obj */
        $obj = $this->getUser();

        return $this->render('user/pages/profil/index.html.twig',  [
            'obj' => $obj
        ]);
    }

    /**
     * @Route("/modifier-profil", name="profil_update")
     */
    public function profilUpdate(SerializerInterface $serializer): Response
    {
        /** @var User $data */
        $data = $this->getUser();
        $data = $serializer->serialize($data, 'json', ['groups' => User::ADMIN_READ]);
        return $this->render('user/pages/profil/update.html.twig',  ['donnees' => $data]);
    }

    /**
     * @Route("/actualites", name="blog")
     */
    public function blog(BoArticleRepository $repository, SerializerInterface $serializer): Response
    {
        $objs = $repository->findBy(['isPublished' => true], ["createdAt" => "ASC", "updatedAt" => "ASC"]);
        $objs = $serializer->serialize($objs, 'json', ['groups' => User::VISITOR_READ]);

        return $this->render('user/pages/blog/index.html.twig',  [
            'donnees' => $objs
        ]);
    }

    /**
     * @Route("/actualites/{slug}", options={"expose"=true}, name="blog_read")
     */
    public function readBlog(BoArticle $obj): Response
    {
        return $this->render('user/pages/blog/read.html.twig',  [
            'elem' => $obj
        ]);
    }
}
