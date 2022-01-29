<?php

namespace App\Controller\Api;

use App\Entity\User;
use App\Repository\UserRepository;
use App\Service\ApiResponse;
use App\Service\Data\DataUser;
use App\Service\Export;
use App\Service\FileUploader;
use App\Service\MailerService;
use App\Service\NotificationService;
use App\Service\SettingsService;
use App\Service\ValidatorService;
use DateTime;
use Doctrine\Common\Persistence\ManagerRegistry;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Security;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Annotation\Route;
use OpenApi\Annotations as OA;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;

/**
 * @Route("/api/users", name="api_users_")
 */
class UserController extends AbstractController
{
    const ICON = "user";

    private $doctrine;

    public function __construct(ManagerRegistry $doctrine)
    {
        $this->doctrine = $doctrine;
    }
    
    /**
     * Admin - Get array of users
     *
     * @Security("is_granted('ROLE_ADMIN')")
     *
     * @Route("/", name="index", options={"expose"=true}, methods={"GET"})
     *
     * @OA\Response(
     *     response=200,
     *     description="Returns array of users"
     * )
     * @OA\Tag(name="Users")
     *
     * @param ApiResponse $apiResponse
     * @param UserRepository $repository
     * @return JsonResponse
     */
    public function index(ApiResponse $apiResponse, UserRepository $repository): JsonResponse
    {
        return $apiResponse->apiJsonResponse($repository->findAll(), User::ADMIN_READ);
    }

    public function submitForm($type, User $obj, Request $request, ApiResponse $apiResponse,
                               ValidatorService $validator, DataUser $dataEntity,
                               UserPasswordHasherInterface $passwordHasher, FileUploader $fileUploader,
                               NotificationService $notificationService): JsonResponse
    {
        $em = $this->doctrine->getManager();
        $data = json_decode($request->get('data'));

        if ($data === null) {
            return $apiResponse->apiJsonResponseBadRequest('Les données sont vides.');
        }

        if (!isset($data->username) || !isset($data->email) || !isset($data->firstname) || !isset($data->lastname)) {
            return $apiResponse->apiJsonResponseBadRequest('Il manque des données.');
        }

        $obj = $dataEntity->setData($obj, $data);

        $file = $request->files->get('avatar');
        $groups = User::ADMIN_READ;
        if($type === "create"){
            $obj->setPassword($passwordHasher->hashPassword($obj, $data->password));

            if ($file) {
                $fileName = $fileUploader->upload($file, User::FOLDER_AVATARS);
                $obj->setAvatar($fileName);
            }
        }else{
            if($data->password != ""){
                $obj->setPassword($passwordHasher->hashPassword($obj, $data->password));
            }

            if ($file) {
                $fileName = $fileUploader->replaceFile($file, $obj->getAvatar(),User::FOLDER_AVATARS);
                $obj->setAvatar($fileName);
            }

            $groups = $this->isGranted("ROLE_ADMIN") ?  User::ADMIN_READ : User::USER_READ;
        }

        $noErrors = $validator->validate($obj);
        if ($noErrors !== true) {
            return $apiResponse->apiJsonResponseValidationFailed($noErrors);
        }

        $em->persist($obj);
        $em->flush();

        if($type === "create"){
            $notificationService->createNotification("Création d'un utilisateur", self::ICON, $this->getUser());
        }else{
            $notificationService->createNotification("Mise à jour d'un utilisateur", self::ICON, $this->getUser(),
                $this->generateUrl('admin_users_index', ['search' => $obj->getUsername()])
            );
        }

        return $apiResponse->apiJsonResponse($obj, $groups);
    }

    /**
     * Admin - Create a user
     *
     * @Security("is_granted('ROLE_ADMIN')")
     *
     * @Route("/", name="create", options={"expose"=true}, methods={"POST"})
     *
     * @OA\Response(
     *     response=200,
     *     description="Returns a new user object"
     * )
     *
     * @OA\Response(
     *     response=400,
     *     description="JSON empty or missing data or validation failed",
     * )
     *
     * @OA\Tag(name="Users")
     *
     * @param Request $request
     * @param ValidatorService $validator
     * @param ApiResponse $apiResponse
     * @param UserPasswordHasherInterface $passwordHasher
     * @param FileUploader $fileUploader
     * @param NotificationService $notificationService
     * @param DataUser $dataEntity
     * @return JsonResponse
     */
    public function create(Request $request, ValidatorService $validator, ApiResponse $apiResponse, UserPasswordHasherInterface $passwordHasher,
                           FileUploader $fileUploader, NotificationService $notificationService, DataUser $dataEntity): JsonResponse
    {
        return $this->submitForm("create", new User(), $request, $apiResponse, $validator, $dataEntity, $passwordHasher, $fileUploader, $notificationService);
    }

    /**
     * Update a user
     *
     * @Route("/{id}", name="update", options={"expose"=true}, methods={"POST"})
     *
     * @OA\Response(
     *     response=200,
     *     description="Returns an user object"
     * )
     * @OA\Response(
     *     response=403,
     *     description="Forbidden for not good role or user",
     * )
     * @OA\Response(
     *     response=400,
     *     description="Validation failed",
     * )
     *
     * @OA\Tag(name="Users")
     *
     * @param Request $request
     * @param ValidatorService $validator
     * @param NotificationService $notificationService
     * @param UserPasswordHasherInterface $passwordHasher
     * @param ApiResponse $apiResponse
     * @param User $obj
     * @param FileUploader $fileUploader
     * @param DataUser $dataEntity
     * @return JsonResponse
     */
    public function update(Request $request, ValidatorService $validator, NotificationService $notificationService,
                           UserPasswordHasherInterface $passwordHasher, ApiResponse $apiResponse, User $obj,
                           FileUploader $fileUploader, DataUser $dataEntity): JsonResponse
    {
        if ($this->getUser() !== $obj && !$this->isGranted("ROLE_ADMIN")) {
            return $apiResponse->apiJsonResponseForbidden();
        }

        return $this->submitForm("create", $obj, $request, $apiResponse, $validator, $dataEntity, $passwordHasher, $fileUploader, $notificationService);
    }

    /**
     * Admin - Delete an user
     *
     * @Security("is_granted('ROLE_ADMIN')")
     *
     * @Route("/{id}", name="delete", options={"expose"=true}, methods={"DELETE"})
     *
     * @OA\Response(
     *     response=200,
     *     description="Return message successful",
     * )
     * @OA\Response(
     *     response=403,
     *     description="Forbidden for not good role or user",
     * )
     *
     * @OA\Response(
     *     response=400,
     *     description="Cannot delete me",
     * )
     *
     * @OA\Tag(name="Users")
     *
     * @param ApiResponse $apiResponse
     * @param User $obj
     * @param FileUploader $fileUploader
     * @return JsonResponse
     */
    public function delete(ApiResponse $apiResponse, User $obj, FileUploader $fileUploader): JsonResponse
    {
        $em = $this->doctrine->getManager();

        if ($obj->getHighRoleCode() === User::CODE_ROLE_DEVELOPER) {
            return $apiResponse->apiJsonResponseForbidden();
        }

        if ($obj === $this->getUser()) {
            return $apiResponse->apiJsonResponseBadRequest('Vous ne pouvez pas vous supprimer.');
        }

        $em->remove($obj);
        $em->flush();

        $fileUploader->deleteFile($obj->getAvatar(), User::FOLDER_AVATARS);
        return $apiResponse->apiJsonResponseSuccessful("Supression réussie !");
    }

    /**
     * Admin - Delete a group of user
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
     *     description="Forbidden for not good role or user",
     * )
     *
     * @OA\Response(
     *     response=400,
     *     description="Cannot delete me",
     * )
     *
     * @OA\Tag(name="Users")
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

        $objs = $em->getRepository(User::class)->findBy(['id' => $data]);

        $avatars = [];
        if ($objs) {
            foreach ($objs as $obj) {
                if ($obj->getHighRoleCode() === User::CODE_ROLE_DEVELOPER) {
                    return $apiResponse->apiJsonResponseForbidden();
                }

                if ($obj === $this->getUser()) {
                    return $apiResponse->apiJsonResponseBadRequest('Vous ne pouvez pas vous supprimer.');
                }

                $avatars[] = $obj->getAvatar();

                $em->remove($obj);
            }
        }

        $em->flush();

        foreach($avatars as $avatar){
            $fileUploader->deleteFile($avatar, User::FOLDER_AVATARS);
        }

        return $apiResponse->apiJsonResponseSuccessful("Supression de la sélection réussie !");
    }

    /**
     * Forget password
     *
     * @Route("/password/forget", name="password_forget", options={"expose"=true}, methods={"POST"})
     *
     * @OA\Response(
     *     response=200,
     *     description="Return message successful",
     * )
     *
     * @OA\Tag(name="Users")
     *
     * @param Request $request
     * @param ApiResponse $apiResponse
     * @param MailerService $mailerService
     * @param SettingsService $settingsService
     * @return JsonResponse
     */
    public function passwordForget(Request $request, ApiResponse $apiResponse, MailerService $mailerService, SettingsService $settingsService): JsonResponse
    {
        $em = $this->doctrine->getManager();
        $data = json_decode($request->getContent());

        if ($data === null) {
            return $apiResponse->apiJsonResponseBadRequest("Il manque des données.");
        }

        $username = $data->fUsername;

        $user = $em->getRepository(User::class)->findOneBy(['username' => $username]);
        if (!$user) {
            return $apiResponse->apiJsonResponseValidationFailed([[
                'name' => 'fUsername',
                'message' => "Cet utilisateur n'existe pas."
            ]]);
        }

        if ($user->getForgetAt()) {
            $interval = date_diff($user->getForgetAt(), new DateTime());
            if ($interval->y == 0 && $interval->m == 0 && $interval->d == 0 && $interval->h == 0 && $interval->i < 30) {
                return $apiResponse->apiJsonResponseValidationFailed([[
                    'name' => 'fUsername',
                    'message' => "Un lien a déjà été envoyé. Veuillez réessayer ultérieurement."
                ]]);
            }
        }

        $code = uniqid($user->getId());

        $user->setForgetAt(new \DateTime()); // no set timezone to compare expired
        $user->setForgetCode($code);

        $url = $this->generateUrl('app_password_reinit', ['token' => $user->getToken(), 'code' => $code], UrlGeneratorInterface::ABSOLUTE_URL);
        if($mailerService->sendMail(
                $user->getEmail(),
                "Mot de passe oublié pour le site " . $settingsService->getWebsiteName(),
                "Lien de réinitialisation de mot de passe.",
                'app/email/security/forget.html.twig',
                ['url' => $url, 'user' => $user, 'settings' => $settingsService->getSettings()]) != true)
        {
            return $apiResponse->apiJsonResponseValidationFailed([[
                'name' => 'fUsername',
                'message' => "Le message n\'a pas pu être délivré. Veuillez contacter le support."
            ]]);
        }

        $em->flush();
        return $apiResponse->apiJsonResponseSuccessful(sprintf("Le lien de réinitialisation de votre mot de passe a été envoyé à : %s", $user->getHiddenEmail()));
    }

    /**
     * Update password
     *
     * @Route("/password/update/{token}", name="password_update", options={"expose"=true}, methods={"POST"})
     *
     * @OA\Response(
     *     response=200,
     *     description="Returns a message",
     * )
     *
     * @OA\Tag(name="Users")
     *
     * @param Request $request
     * @param $token
     * @param ValidatorService $validator
     * @param UserPasswordHasherInterface $passwordHasher
     * @param ApiResponse $apiResponse
     * @return JsonResponse
     */
    public function passwordUpdate(Request $request, $token, ValidatorService $validator, UserPasswordHasherInterface $passwordHasher,
                                   ApiResponse $apiResponse): JsonResponse
    {
        $em = $this->doctrine->getManager();
        $data = json_decode($request->getContent());

        if ($data === null) {
            return $apiResponse->apiJsonResponseBadRequest('Les données sont vides.');
        }

        $user = $em->getRepository(User::class)->findOneBy(['token' => $token]);
        $user->setPassword($passwordHasher->hashPassword($user, $data->password));
        $user->setForgetAt(null);
        $user->setForgetCode(null);

        $noErrors = $validator->validate($user);
        if ($noErrors !== true) {
            return $apiResponse->apiJsonResponseValidationFailed($noErrors);
        }

        $em->flush();
        return $apiResponse->apiJsonResponseSuccessful("Modification réalisée avec success ! La page va se rafraichir automatiquement dans 5 secondes.");
    }

    /**
     * Reinitialize password
     *
     * @Route("/password/reinit/{token}", name="password_reinit", options={"expose"=true}, methods={"POST"})
     *
     * @OA\Response(
     *     response=200,
     *     description="Returns a message",
     * )
     *
     * @OA\Tag(name="Users")
     *
     * @param $token
     * @param ValidatorService $validator
     * @param UserPasswordHasherInterface $passwordHasher
     * @param ApiResponse $apiResponse
     * @return JsonResponse
     */
    public function passwordReinit($token, ValidatorService $validator, UserPasswordHasherInterface $passwordHasher,
                                   ApiResponse $apiResponse): JsonResponse
    {
        $em = $this->doctrine->getManager();

        $user = $em->getRepository(User::class)->findOneBy(['token' => $token]);

        $pass = uniqid();

        $user->setPassword($passwordHasher->hashPassword($user, $pass));
        $user->setForgetAt(null);
        $user->setForgetCode(null);

        $noErrors = $validator->validate($user);
        if ($noErrors !== true) {
            return $apiResponse->apiJsonResponseValidationFailed($noErrors);
        }

        $em->flush();
        return $apiResponse->apiJsonResponseSuccessful("Veuillez noter le nouveau mot de passe : " . $pass);
    }

    /**
     * Export list users
     *
     * @Route("/export/{format}", name="export", options={"expose"=true}, methods={"GET"})
     *
     * @OA\Response(
     *     response=200,
     *     description="Returns a new user object",
     * )
     *
     * @OA\Tag(name="Users")
     *
     * @param Export $export
     * @param $format
     * @return BinaryFileResponse
     */
    public function export(Export $export, $format): BinaryFileResponse
    {
        $em = $this->doctrine->getManager();
        $objs = $em->getRepository(User::class)->findBy([], ['username' => 'ASC']);
        $data = [];

        $nameFile = 'utilisateurs';
        $nameFolder = 'export/';

        foreach ($objs as $obj) {
            $tmp = [
                $obj->getId(),
                $obj->getUsername(),
                $obj->getHighRole(),
                $obj->getEmail(),
                date_format($obj->getCreatedAt(), 'd/m/Y'),
            ];
            if(!in_array($tmp, $data)){
                array_push($data, $tmp);
            }
        }

        if($format == 'excel'){
            $fileName = $nameFile . '.xlsx';
            $header = array(array('ID', 'Nom utilisateur', 'Role', 'Email', 'Date de creation'));
        }else{
            $fileName = $nameFile . '.csv';
            $header = array(array('id', 'username', 'role', 'email', 'createAt'));

            header('Content-Type: application/csv');
            header('Content-Disposition: attachment; filename="'.$fileName.'"');
        }

        $export->createFile($format, 'Liste des ' . $nameFile, $fileName , $header, $data, 5, $nameFolder);
        return new BinaryFileResponse($this->getParameter('private_directory'). $nameFolder . $fileName);
    }
}
