<?php

namespace App\Controller;

use App\Entity\User;
use App\Service\Expiration;
use Doctrine\Common\Persistence\ManagerRegistry;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Authentication\AuthenticationUtils;

class SecurityController extends AbstractController
{
    private $doctrine;

    public function __construct(ManagerRegistry $doctrine)
    {
        $this->doctrine = $doctrine;
    }
    
    /**
     * @Route("/login", options={"expose"=true}, name="app_login")
     * @param AuthenticationUtils $authenticationUtils
     * @return Response
     */
    public function login(AuthenticationUtils $authenticationUtils): Response
    {
         if ($this->getUser()) {
             if($this->isGranted('ROLE_ADMIN')){
                 return $this->redirectToRoute('admin_homepage');
             }
             if($this->isGranted('ROLE_USER')){
                 return $this->redirectToRoute('user_homepage');
             }
         }

        // get the login error if there is one
        $error = $authenticationUtils->getLastAuthenticationError();
        // last username entered by the user
        $lastUsername = $authenticationUtils->getLastUsername();

        return $this->render('app/pages/security/login.html.twig', ['last_username' => $lastUsername, 'error' => $error]);
    }

    /**
     * @Route("/logout", name="app_logout")
     */
    public function logout()
    {
        throw new \LogicException('This method can be blank - it will be intercepted by the logout key on your firewall.');
    }

    /**
     * @Route("/reinitialisation/mot-de-passe/{token}-{code}", name="app_password_reinit")
     * @param $token
     * @param $code
     * @param Expiration $expiration
     * @return Response
     */
    public function reinit($token, $code, Expiration $expiration): Response
    {
        $em = $this->doctrine->getManager();
        $user = $em->getRepository(User::class)->findOneBy(['token' => $token]);
        if(!$user){
            throw new NotFoundHttpException("Cet utilisateur n'existe pas.");
        }

        if((!$user->getForgetAt() || !$user->getForgetCode())
            || ($user->getForgetCode() && $user->getForgetCode() != $code)){
            return $this->render('app/pages/security/reinit.html.twig', ['error' => true]);
        }

        if($user->getForgetAt()){
            if ($expiration->isExpiredByMinutes($user->getForgetAt(), new \DateTime(), 30)) {
                return $this->render('app/pages/security/reinit.html.twig', ['error' => true]);
            }
        }

        return $this->render('app/pages/security/reinit.html.twig', ['token' => $token]);
    }
}
