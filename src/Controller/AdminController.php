<?php

namespace App\Controller;

use App\Entity\Notification;
use App\Entity\Settings;
use App\Entity\User;
use App\Service\Data\UserService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;

/**
 * @Route("/admin", name="admin_")
 */
class AdminController extends AbstractController
{
    /**
     * @Route("/", options={"expose"=true}, name="homepage")
     */
    public function index(): Response
    {
        $em = $this->getDoctrine()->getManager();
        $users = $em->getRepository(User::class)->findAll();
        $settings = $em->getRepository(Settings::class)->findAll();

        $totalUsers = count($users); $nbConnected = 0;
        foreach($users as $user){
            if($user->getLastLogin()){
                $nbConnected++;
            }
        }
        return $this->render('admin/pages/index.html.twig', [
            'settings' => $settings ? $settings[0] : null,
            'totalUsers' => $totalUsers,
            'nbConnected' => $nbConnected,
        ]);
    }

    /**
     * @Route("/styleguide/html", name="styleguide_html")
     */
    public function styleguideHtml(): Response
    {
        return $this->render('admin/pages/styleguide/index.html.twig');
    }

    /**
     * @Route("/styleguide/react", options={"expose"=true}, name="styleguide_react")
     */
    public function styleguideReact(Request  $request): Response
    {
        if($request->isMethod("POST")){
            return new JsonResponse(['code' => true]);
        }
        return $this->render('admin/pages/styleguide/react.html.twig');
    }

    /**
     * @Route("/utilisateurs", name="users_index")
     */
    public function users(UserService $userService, SerializerInterface $serializer): Response
    {
        $objs = $userService->getList('ASC');
        $objs = $serializer->serialize($objs, 'json', ['groups' => User::ADMIN_READ]);
        return $this->render('admin/pages/user/index.html.twig', [
            'users' => $objs
        ]);
    }

    /**
     * @Route("/articles", name="blog_index")
     */
    public function blog(): Response
    {
        return $this->render('admin/pages/blog/index.html.twig');
    }

    /**
     * @Route("/articles/categories", name="blog_categories_index")
     */
    public function categories(): Response
    {
        return $this->render('admin/pages/blog/categories.html.twig');
    }

    /**
     * @Route("/parametres", name="settings_index")
     */
    public function settings(): Response
    {
        return $this->render('admin/pages/settings/index.html.twig');
    }

    /**
     * @Route("/contact", name="contact_index")
     */
    public function contact(): Response
    {
        return $this->render('admin/pages/contact/index.html.twig');
    }

    /**
     * @Route("/notifications", options={"expose"=true}, name="notifications_index")
     */
    public function notifications(SerializerInterface $serializer): Response
    {
        $em = $this->getDoctrine()->getManager();
        $objs = $em->getRepository(Notification::class)->findAll();
        $objs = $serializer->serialize($objs, 'json', ['groups' => User::ADMIN_READ]);

        return $this->render('admin/pages/notifications/index.html.twig', [
            'notifications' => $objs
        ]);
    }

    /**
     * @Route("/ateliers", name="ateliers_index")
     */
    public function ateliers(): Response
    {
        return $this->render('admin/pages/ateliers/index.html.twig');
    }

    /**
     * @Route("/services", name="services_index")
     */
    public function services(): Response
    {
        return $this->render('admin/pages/services/index.html.twig');
    }

    /**
     * @Route("/temoignages", name="testimonials_index")
     */
    public function temoignages(): Response
    {
        return $this->render('admin/pages/testimonials/index.html.twig');
    }
}
