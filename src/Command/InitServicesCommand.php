<?php

namespace App\Command;

use App\Entity\Ace\AcService;
use App\Service\DatabaseService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;
use Symfony\Component\String\Slugger\AsciiSlugger;

class InitServicesCommand extends Command
{
    protected static $defaultName = 'app:init:services';
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
            ->setDescription('Add initial content services pages')
        ;
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);

        $io->title('Reset des tables');
        $this->databaseService->resetTable($io, ['ac_service']);

        $io->title('Ajout des services');
        $content = "<p>
                                Dans vos différents rôles de leaders et/ou manager,
                                entre objectifs stratégiques et opérations, l’amélioration
                                et la gestion de la performance ont un impact significatif
                                au quotidien. <br><br>
                                Je vous accompagne dans la mise en oeuvre de
                                changements et l’adoption de nouveaux comportements
                                pour faciliter votre développement stratégique et une
                                meilleure gestion opérationnelle.
                </p>
                <ul>
                    <li>Leadership</li>
                    <li>Changement</li>
                    <li>Développement</li>
                </ul>
                ";

        $data = [
            [
                "title" => "Vous vous sentez perdus dans votre choix d’orientation ? Vous avez du mal à vous organiser, en manque de motivation ?",
                "slug" => "etudiants-lyceens",
                'bandeau' => "bandeau_service_etudiant.jpg",
                'img1' => "etudiant_1", 'img2' => "etudiant_2", 'img3' => "etudiant_3", 'img4' => "etudiant_4"
            ],
            [
                "title" => "Entrepreneurs, dirigeants, managers, vous souhaitez optimiser votre performance ?",
                "slug" => "entreprises",
                'bandeau' => "bandeau_service_entreprise.jpg",
                'img1' => "entreprise_1", 'img2' => "entreprise_2", 'img3' => "entreprise_3", 'img4' => "entreprise_4"
            ],
            [
                "title" => "Vous avez un projet professionnel ou personnel à réaliser qui vous tient à coeur ?",
                "slug" => "particuliers",
                'bandeau' => "bandeau_service_particulier.jpg",
                'img1' => "particulier_1", 'img2' => "particulier_2", 'img3' => "particulier_3", 'img4' => "particulier_4"
            ],
            [
                "title" => "L’un des facteurs clé de votre réussite : la préparation mentale",
                "slug" => "sportifs",
                'bandeau' => "bandeau_service_sportif.jpg",
                'img1' => "sportif_1", 'img2' => "sportif_2", 'img3' => "sportif_3", 'img4' => "sportif_4"
            ],
        ];

        foreach($data as $item){
            $title = $item['title'];
            $slug = $item['slug'];

            $service = (new AcService())
                ->setContent($content)
                ->setTitle($title)
                ->setSlug($slug)
                ->setFile1($item['bandeau'])
                ->setFile2($item['img1'] . '.jpg')
                ->setFile3($item['img2'] . '.jpg')
                ->setFile4($item['img3'] . '.jpg')
                ->setFile5($item['img4'] . '.jpg')
            ;

            $this->em->persist($service);
        }

        $this->em->flush();

        $io->newLine();
        $io->comment('--- [FIN DE LA COMMANDE] ---');

        return Command::SUCCESS;
    }
}
