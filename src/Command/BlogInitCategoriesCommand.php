<?php

namespace App\Command;

use App\Entity\Blog\BoCategory;
use App\Service\DatabaseService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

class BlogInitCategoriesCommand extends Command
{
    protected static $defaultName = 'blog:init:categories';
    protected $em;
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
            ->setDescription('Init blog category data')
        ;
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);

        $io->title('Reset des tables');
        $this->databaseService->resetTable($io, [BoCategory::class]);

        $users = array(
            [
                'name' => 'Autres',
                'slug' => 'autres',
            ],
        );

        $io->title('Création des categories');
        foreach ($users as $user) {
            $new = (new BoCategory())
                ->setName($user['name'])
                ->setSlug($user['slug'])
            ;

            $this->em->persist($new);
            $io->text('CAT : ' . $user['name'] . ' créé' );
        }

        $this->em->flush();

        $io->newLine();
        $io->comment('--- [FIN DE LA COMMANDE] ---');
        return Command::SUCCESS;
    }
}
