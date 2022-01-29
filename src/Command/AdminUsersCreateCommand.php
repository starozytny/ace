<?php

namespace App\Command;

use App\Entity\Notification;
use App\Entity\User;
use App\Service\DatabaseService;
use Doctrine\ORM\EntityManagerInterface;
use Faker\Factory;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

class AdminUsersCreateCommand extends Command
{
    protected static $defaultName = 'admin:users:create';
    private $em;
    private $databaseService;

    public function __construct(EntityManagerInterface $entityManager, DatabaseService $databaseService)
    {
        parent::__construct();

        $this->em = $entityManager;
        $this->databaseService = $databaseService;
    }

    protected function configure()
    {
        $this
            ->setDescription('Create an user and an admin.')
            ->addOption('fake', "f", InputOption::VALUE_NONE, 'Option shit values')
        ;
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);

        $io->title('Reset des tables');
        $this->databaseService->resetTable($io, [Notification::class, User::class]);

        $users = array(
            [
                'username' => 'shanbo',
                'firstname' => 'Dev',
                'lastname' => 'Shanbora',
                'email' => 'chanbora.chhun@outlook.fr',
                'roles' => ['ROLE_USER','ROLE_ADMIN', 'ROLE_DEVELOPER']
            ],
            [
                'username' => 'staro',
                'firstname' => 'Admin',
                'lastname' => 'Starozytny',
                'email' => 'starozytny@hotmail.fr',
                'roles' => ['ROLE_USER','ROLE_ADMIN']
            ],
            [
                'username' => 'shanks',
                'firstname' => 'User',
                'lastname' => 'Shanks',
                'email' => 'shanks@hotmail.fr',
                'roles' => ['ROLE_USER']
            ]
        );

        $password = password_hash("azerty", PASSWORD_ARGON2I);

        $io->title('Création des utilisateurs');
        foreach ($users as $user) {
            $new = (new User())
                ->setUsername($user['username'])
                ->setEmail($user['email'])
                ->setRoles($user['roles'])
                ->setFirstname(ucfirst($user['firstname']))
                ->setLastname(mb_strtoupper($user['lastname']))
                ->setPassword($password)
            ;

            $this->em->persist($new);
            $io->text('USER : ' . $user['username'] . ' créé' );
        }

        if ($input->getOption('fake')) {
            $io->title('Création de 110 utilisateurs lambdas');
            $fake = Factory::create();
            for($i=0; $i<110 ; $i++) {
                $new = (new User())
                    ->setUsername($fake->userName)
                    ->setEmail($fake->freeEmail)
//                    ->setEmail("undefined@undefined.fr")
                    ->setRoles(['ROLE_USER'])
                    ->setFirstname(ucfirst($fake->firstName))
                    ->setLastname(mb_strtoupper($fake->lastName))
                    ->setPassword($password)
                ;

                $this->em->persist($new);
            }
            $io->text('USER : Utilisateurs fake créés' );
        }

        $this->em->flush();

        $io->newLine();
        $io->comment('--- [FIN DE LA COMMANDE] ---');
        return 0;
    }
}
