<?php

namespace App\Controller;

use App\Entity\Blog\BoArticle;
use App\Entity\Blog\BoCategory;
use App\Entity\Contact;
use App\Entity\Notification;
use App\Entity\Settings;
use App\Entity\User;
use Doctrine\Common\Persistence\ManagerRegistry;
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
    private $doctrine;

    public function __construct(ManagerRegistry $doctrine)
    {
        $this->doctrine = $doctrine;
    }
    
    private function getAllData($classe, SerializerInterface $serializer, $groups = User::ADMIN_READ): string
    {
        $em = $this->doctrine->getManager();
        $objs = $em->getRepository($classe)->findAll();

        return $serializer->serialize($objs, 'json', ['groups' => $groups]);
    }

    private function getRenderView(Request $request, SerializerInterface $serializer, $class, $route): Response
    {
        $objs = $this->getAllData($class, $serializer);
        $search = $request->query->get('search');
        if($search){
            return $this->render($route, [
                'donnees' => $objs,
                'search' => $search
            ]);
        }

        return $this->render($route, [
            'donnees' => $objs
        ]);
    }

    /**
     * @Route("/", options={"expose"=true}, name="homepage")
     */
    public function index(): Response
    {
        $em = $this->doctrine->getManager();
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
    public function users(Request $request, SerializerInterface $serializer): Response
    {
        return $this->getRenderView($request, $serializer, User::class, 'admin/pages/user/index.html.twig');
    }

    /**
     * @Route("/articles", name="blog_index")
     */
    public function blog(SerializerInterface $serializer): Response
    {
        $objs = $this->getAllData(BoArticle::class, $serializer, User::VISITOR_READ);
        $categories = $this->getAllData(BoCategory::class, $serializer, User::VISITOR_READ);

        return $this->render('admin/pages/blog/index.html.twig', [
            'donnees' => $objs,
            'categories' => $categories
        ]);
    }

    /**
     * @Route("/articles/categories", name="blog_categories_index")
     */
    public function categories(SerializerInterface $serializer): Response
    {
        $objs = $this->getAllData(BoCategory::class, $serializer, User::VISITOR_READ);

        return $this->render('admin/pages/blog/categories.html.twig', [
            'donnees' => $objs
        ]);
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
    public function contact(Request $request, SerializerInterface $serializer): Response
    {
        return $this->getRenderView($request, $serializer, Contact::class, 'admin/pages/contact/index.html.twig');
    }

    /**
     * @Route("/notifications", options={"expose"=true}, name="notifications_index")
     */
    public function notifications(SerializerInterface $serializer): Response
    {
        $objs = $this->getAllData(Notification::class, $serializer);

        return $this->render('admin/pages/notifications/index.html.twig', [
            'donnees' => $objs
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
