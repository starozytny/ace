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
                                au quotidien. <br>
                                Je vous accompagne dans la mise en oeuvre de
                                changements et l’adoption de nouveaux comportements
                                pour faciliter votre développement stratégique et une
                                meilleure gestion opérationnelle.
                </p>
                <ol>
                    <li>Leadership</li>
                    <li>Changement</li>
                    <li>Développement</li>
                </ol>
                <p>EN SÉANCE INDIVIDUELLE D’1H / POSSIBILITÉ DE GROUPES POUR LES ENTREPRISES</p>
                <p>LE NOMBRE DE SÉANCES EST À DÉFINIR APRÈS LE 1ER ENTRETIEN.</p>
                ";

        $data = [
            [
                "title" => "L’un des facteurs clé de votre réussite : la préparation mentale",
            ],
            [
                "title" => "Entrepreneurs, dirigeants, managers, vous souhaitez optimiser votre performance ?",
            ],
            [
                "title" => "Vous avez un projet professionnel ou personnel à réaliser qui vous tient à coeur ?",
            ],
            [
                "title" => "Vous vous sentez perdus dans votre choix d’orientation ? Vous avez du mal à vous organiser, en manque de motivation ?",
            ],
        ];

        foreach($data as $item){
            $title = $item['title'];

            $service = (new AcService())
                ->setAccroche("Seuls on va plus vite, ensemble on va plus loin")
                ->setContent($content)
                ->setTitle($title)
            ;

            $slug = new AsciiSlugger();
            $service->setSlug($slug->slug(trim($title)));

            $this->em->persist($service);
        }

        $this->em->flush();

        $io->newLine();
        $io->comment('--- [FIN DE LA COMMANDE] ---');

        return Command::SUCCESS;
    }
}
