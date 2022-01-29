<?php

namespace App\Command\Fake;

use App\Entity\Contact;
use App\Entity\Notification;
use App\Service\DatabaseService;
use Doctrine\ORM\EntityManagerInterface;
use Faker\Factory;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

class FakeContactCreateCommand extends Command
{
    protected static $defaultName = 'fake:contact:create';
    protected static $defaultDescription = 'Create fake contacts';
    private $em;
    private $databaseService;

    public function __construct(EntityManagerInterface $entityManager, DatabaseService $databaseService)
    {
        parent::__construct();

        $this->em = $entityManager;
        $this->databaseService = $databaseService;
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);
        $io->title('Reset des tables');
        $this->databaseService->resetTable($io, [Notification::class, Contact::class]);

        $io->title('Création de 30 contacts fake');
        $fake = Factory::create();
        for($i=0; $i<110 ; $i++) {
            $new = (new Contact())
                ->setName($fake->streetName)
                ->setEmail($fake->freeEmail)
                ->setMessage($fake->text)
            ;

            $this->em->persist($new);
        }
        $io->text('CONTACT : Contacts fake créés' );

        $this->em->flush();

        $io->newLine();
        $io->comment('--- [FIN DE LA COMMANDE] ---');
        return Command::SUCCESS;
    }
}
