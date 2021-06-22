<?php

namespace App\Controller\Api;

use App\Entity\User;
use App\Repository\UserRepository;
use App\Service\ApiResponse;
use App\Service\Export;
use App\Service\FileUploader;
use App\Service\MailerService;
use App\Service\SanitizeData;
use App\Service\SettingsService;
use App\Service\ValidatorService;
use DateTime;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Security;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Nelmio\ApiDocBundle\Annotation\Model;
use OpenApi\Annotations as OA;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;

/**
 * @Route("/api/users", name="api_users_")
 */
class UserController extends AbstractController
{
    const FOLDER_AVATARS = "avatars";
    /**
     * Admin - Get array of users
     *
     * @Security("is_granted('ROLE_ADMIN')")
     *
     * @Route("/", name="index", options={"expose"=true}, methods={"GET"})
     *
     * @OA\Response(
     *     response=200,
     *     description="Returns array of users",
     *     @Model(type=User::class, groups={"admin:read"})
     * )
     * @OA\Tag(name="Users")
     *
     * @param Request $request
     * @param UserRepository $userRepository
     * @param ApiResponse $apiResponse
     * @return JsonResponse
     */
    public function index(Request $request, UserRepository $userRepository, ApiResponse $apiResponse): JsonResponse
    {
        $order = $request->query->get('order') ?: 'ASC';
        $users = $userRepository->findBy([], ['lastname' => $order]);
        return $apiResponse->apiJsonResponse($users, User::ADMIN_READ);
    }

    /**
     * Admin - Create an user
     *
     * @Security("is_granted('ROLE_ADMIN')")
     *
     * @Route("/", name="create", options={"expose"=true}, methods={"POST"})
     *
     * @OA\Response(
     *     response=200,
     *     description="Returns a new user object",
     *     @Model(type=User::class, groups={"admin:write"})
     * )
     *
     * @OA\Response(
     *     response=400,
     *     description="JSON empty or missing data or validation failed",
     * )
     *
     * @OA\RequestBody (
     *     @Model(type=User::class, groups={"admin:write"}),
     *     required=true
     * )
     *
     * @OA\Tag(name="Users")
     *
     * @param Request $request
     * @param ValidatorService $validator
     * @param UserPasswordEncoderInterface $passwordEncoder
     * @param ApiResponse $apiResponse
     * @param SanitizeData $sanitizeData
     * @param FileUploader $fileUploader
     * @return JsonResponse
     */
    public function create(Request $request, ValidatorService $validator, UserPasswordEncoderInterface $passwordEncoder,
                           ApiResponse $apiResponse, SanitizeData $sanitizeData, FileUploader $fileUploader): JsonResponse
    {
        $em = $this->getDoctrine()->getManager();
        $data = json_decode($request->get('data'));

        if ($data === null) {
            return $apiResponse->apiJsonResponseBadRequest('Les données sont vides.');
        }

        if (!isset($data->username) || !isset($data->email) || !isset($data->firstname) || !isset($data->lastname)) {
            return $apiResponse->apiJsonResponseBadRequest('Il manque des données.');
        }

        $user = new User();
        $user->setUsername($sanitizeData->fullSanitize($data->username));
        $user->setFirstname(ucfirst($sanitizeData->sanitizeString($data->firstname)));
        $user->setLastname(mb_strtoupper($sanitizeData->sanitizeString($data->lastname)));
        $user->setEmail($data->email);
        $pass = (isset($data->password) && $data->password != "") ? $data->password : uniqid();
        $user->setPassword($passwordEncoder->encodePassword($user, $pass));

        if (isset($data->roles)) {
            $user->setRoles($data->roles);
        }

        $file = $request->files->get('avatar');
        if ($file) {
            $fileName = $fileUploader->upload($file, self::FOLDER_AVATARS);
            $user->setAvatar($fileName);
        }

        $noErrors = $validator->validate($user);

        if ($noErrors !== true) {
            return $apiResponse->apiJsonResponseValidationFailed($noErrors);
        }

        $em->persist($user);
        $em->flush();

        return $apiResponse->apiJsonResponse($user, User::ADMIN_READ);
    }

    /**
     * Update an user
     *
     * @Route("/{id}", name="update", options={"expose"=true}, methods={"POST"})
     *
     * @OA\Response(
     *     response=200,
     *     description="Returns an user object",
     *     @Model(type=User::class, groups={"update"})
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
     * @OA\RequestBody (
     *     description="Only admin can change roles",
     *     @Model(type=User::class, groups={"update"}),
     *     required=true
     * )
     *
     * @OA\Tag(name="Users")
     *
     * @param Request $request
     * @param ValidatorService $validator
     * @param ApiResponse $apiResponse
     * @param SanitizeData $sanitizeData
     * @param User $user
     * @param FileUploader $fileUploader
     * @return JsonResponse
     */
    public function update(Request $request, ValidatorService $validator,
                           ApiResponse $apiResponse, SanitizeData $sanitizeData, User $user, FileUploader $fileUploader): JsonResponse
    {
        if ($this->getUser() != $user && !$this->isGranted("ROLE_ADMIN")) {
            return $apiResponse->apiJsonResponseForbidden();
        }

        $em = $this->getDoctrine()->getManager();
        $data = json_decode($request->get('data'));

        if (isset($data->username)) {
            $user->setUsername($sanitizeData->fullSanitize($data->username));
        }

        if (isset($data->email)) {
            $user->setEmail($data->email);
        }

        if (isset($data->firstname)) {
            $user->setFirstname(ucfirst($sanitizeData->sanitizeString($data->firstname)));
        }

        if (isset($data->lastname)) {
            $user->setLastname(mb_strtoupper($sanitizeData->sanitizeString($data->lastname)));
        }

        $file = $request->files->get('avatar');
        if ($file) {
            $fileName = $fileUploader->replaceFile($file, $user->getAvatar(),self::FOLDER_AVATARS);
            $user->setAvatar($fileName);
        }

        $groups = User::USER_READ;
        if ($this->isGranted("ROLE_ADMIN")) {
            if (isset($data->roles)) {
                $user->setRoles($data->roles);
            }
            $groups = User::ADMIN_READ;
        }

        $noErrors = $validator->validate($user);
        if ($noErrors !== true) {
            return $apiResponse->apiJsonResponseValidationFailed($noErrors);
        }

        $em->persist($user);
        $em->flush();

        return $apiResponse->apiJsonResponse($user, $groups);
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
     * @param User $user
     * @param FileUploader $fileUploader
     * @return JsonResponse
     */
    public function delete(ApiResponse $apiResponse, User $user, FileUploader $fileUploader): JsonResponse
    {
        $em = $this->getDoctrine()->getManager();

        if ($user->getHighRoleCode() === User::CODE_ROLE_DEVELOPER) {
            return $apiResponse->apiJsonResponseForbidden();
        }

        if ($user === $this->getUser()) {
            return $apiResponse->apiJsonResponseBadRequest('Vous ne pouvez pas vous supprimer.');
        }

        $em->remove($user);
        $em->flush();

        $fileUploader->deleteFile($user->getAvatar(), self::FOLDER_AVATARS);
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
        $em = $this->getDoctrine()->getManager();
        $data = json_decode($request->getContent());

        $users = $em->getRepository(User::class)->findBy(['id' => $data]);

        $avatars = [];
        if ($users) {
            foreach ($users as $user) {
                if ($user->getHighRoleCode() === User::CODE_ROLE_DEVELOPER) {
                    return $apiResponse->apiJsonResponseForbidden();
                }

                if ($user === $this->getUser()) {
                    return $apiResponse->apiJsonResponseBadRequest('Vous ne pouvez pas vous supprimer.');
                }

                array_push($avatars, $user->getAvatar());

                $em->remove($user);
            }
        }

        $em->flush();

        foreach($avatars as $avatar){
            $fileUploader->deleteFile($avatar, self::FOLDER_AVATARS);
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
        $em = $this->getDoctrine()->getManager();
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
            if ($interval->i < 30) {
                return $apiResponse->apiJsonResponseValidationFailed([[
                    'name' => 'fUsername',
                    'message' => "Un lien a déjà été envoyé. Veuillez réessayer ultérieurement."
                ]]);
            }
        }

        $code = uniqid($user->getId());

        $user->setForgetAt(new DateTime());
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
     * @param UserPasswordEncoderInterface $passwordEncoder
     * @param ApiResponse $apiResponse
     * @return JsonResponse
     */
    public function passwordUpdate(Request $request, $token, ValidatorService $validator, UserPasswordEncoderInterface $passwordEncoder,
                           ApiResponse $apiResponse): JsonResponse
    {
        $em = $this->getDoctrine()->getManager();
        $data = json_decode($request->getContent());

        if ($data === null) {
            return $apiResponse->apiJsonResponseBadRequest('Les données sont vides.');
        }

        $user = $em->getRepository(User::class)->findOneBy(['token' => $token]);
        $user->setPassword($passwordEncoder->encodePassword($user, $data->password));
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
        $em = $this->getDoctrine()->getManager();
        $users = $em->getRepository(User::class)->findBy(array(), array('username' => 'ASC'));
        $data = array();

        foreach ($users as $user) {
            $tmp = array(
                $user->getId(),
                $user->getUsername(),
                $user->getHighRole(),
                $user->getEmail(),
                date_format($user->getCreatedAt(), 'd/m/Y'),
            );
            if(!in_array($tmp, $data)){
                array_push($data, $tmp);
            }
        }

        if($format == 'excel'){
            $fileName = 'utilisateurs.xlsx';
            $header = array(array('ID', 'Nom utilisateur', 'Role', 'Email', 'Date de creation'));
        }else{
            $fileName = 'utilisateurs.csv';
            $header = array(array('id', 'username', 'role', 'email', 'createAt'));

            header('Content-Type: application/csv');
            header('Content-Disposition: attachment; filename="'.$fileName.'"');
        }

        $export->createFile($format, 'Liste des utilisateurs', $fileName , $header, $data, 5, 'export/');
        return new BinaryFileResponse($this->getParameter('private_directory'). 'export/' . $fileName);
    }
}
