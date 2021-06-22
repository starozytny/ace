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

        $data = [
            [
                "title" => "Vous vous sentez perdus dans votre choix d’orientation ? Vous avez du mal à vous organiser, en manque de motivation ?",
                "intro" => "Il n’y a qu’une façon d’apprendre, <br> c’est par l’action. <br> Paulo Coelho",
                "slug" => "etudiants-lyceens",
                'bandeau' => "bandeau_service_etudiant.jpg",
                'img1' => "etudiant_1", 'img2' => "etudiant_2", 'img3' => "etudiant_3", 'img4' => "etudiant_4",
                "content" => "<p>
                                Du collège aux études supérieures votre parcours est riche en enseignement, entre savoir-faire et savoir-être. 
                                Comment s’y retrouver, choisir sa voie face à toutes les possibilités qui s’offrent à vous, étudier tout en restant motivé ? 
                                <br><br>
                                Je vous propose un accompagnement adapté à vos besoins pour : 
                </p>
                <ul>
                    <li>Clarifier votre projet professionnel</li>
                    <li>Identifier et développer vos soft skills</li>
                    <li>Identifier vos besoins et les ressources dont vous disposez</li>
                </ul>
                ",
                "seance" => "En séance individuelle d’1h / Possibilité de groupes pour les écoles",
                "nbSeance" => "Le nombre de séance est à définir après le 1er entretien"
            ],
            [
                "title" => "Entrepreneurs, dirigeants, managers, vous souhaitez optimiser votre performance ?",
                "intro" => "Seuls on va plus <br> vite, ensemble <br> on va plus loin",
                "slug" => "entreprises",
                'bandeau' => "bandeau_service_entreprise.jpg",
                'img1' => "entreprise_1", 'img2' => "entreprise_2", 'img3' => "entreprise_3", 'img4' => "entreprise_4",
                "content" => "<p>
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
                ",
                "seance" => "En séance individuelle d’1h / Possibilité de groupes pour les entreprises",
                "nbSeance" => "Le nombre de séance est à définir après le 1er entretien"
            ],
            [
                "title" => "Vous avez un projet professionnel ou personnel à réaliser qui vous tient à coeur ?",
                "intro" => "Ne renoncez jamais à un rêve <br> juste à cause du temps qu'il faudra pour l'accomplir. <br> Le temps passera de toute façon. <br> Earl Nightingale",
                "slug" => "particuliers",
                'bandeau' => "bandeau_service_particulier.jpg",
                'img1' => "particulier_1", 'img2' => "particulier_2", 'img3' => "particulier_3", 'img4' => "particulier_4",
                "content" => "<p>
                                Qui ne rêve pas de changement dans sa vie? En transition professionnelle ou personnelle, 
                                pour (re)trouver un équilibre, qui mieux que vous peut savoir ce que vous voulez,
                                 ce dont vous avez réellement besoin ? 
                                <br><br>
                                Changer n’est pas nécessairement tout révolutionner dans son quotidien. Chercher à 
                                l’améliorer peut contribuer à faire la différence sur la durée. 
                                <br><br>
                                Je vous propose une approche réaliste de votre projet, adaptée à vos besoins et 
                                déterminante pour le rendre concret. 
                </p>
                <ul>
                    <li>Transition</li>
                    <li>Équilibre</li>
                    <li>Actions</li>
                </ul>
                ",
                "seance" => "En séance individuelle d’1h",
                "nbSeance" => "Le nombre de séance est à définir après le 1er entretien"
            ],
            [
                "title" => "L’un des facteurs clé de votre réussite : la préparation mentale",
                "intro" => "Le sport va chercher la peur pour la dominer, <br> la fatigue pour en triompher, la difficulté pour la vaincre. <br> Pierre de Coubertin",
                "slug" => "sportifs",
                'bandeau' => "bandeau_service_sportif.jpg",
                'img1' => "sportif_1", 'img2' => "sportif_2", 'img3' => "sportif_3", 'img4' => "sportif_4",
                "content" => "<p>
                                L’un des facteurs clé de votre réussite : la préparation mentale
                                <br><br>
                                Professionnels ou amateurs : la gestion du stress, de ses émotions, la concentration, 
                                la confiance en soi sont autant d’éléments qui influencent vos performances. 
                                <br><br>
                                Apprendre à mieux les gérer, c’est vous permettre de faire face à toutes situations 
                                (positives ou négatives) qui se présentent le jour J de la compétition/du match. 
                                <br><br>
                                C’est ce que je vous propose de déterminer avec un coaching personnalisé et adapté à votre sport. 
                </p>
                <ul>
                    <li>Concentration</li>
                    <li>Confiance</li>
                    <li>Lucidité</li>
                </ul>
                ",
                "seance" => "En séance individuelle d’1h",
                "nbSeance" => "Le nombre de séance est à définir après le 1er entretien"
            ],
        ];

        foreach($data as $item){
            $title = $item['title'];
            $slug = $item['slug'];
            $service = (new AcService())
                ->setContent($item['content'])
                ->setIntro($item['intro'])
                ->setTitle($title)
                ->setSlug($slug)
                ->setFile1($item['bandeau'])
                ->setFile2($item['img1'] . '.jpg')
                ->setFile3($item['img2'] . '.jpg')
                ->setFile4($item['img3'] . '.jpg')
                ->setFile5($item['img4'] . '.jpg')
                ->setSeance($item['seance'])
                ->setNbSeance($item['nbSeance'])
            ;

            $this->em->persist($service);
        }

        $this->em->flush();

        $io->newLine();
        $io->comment('--- [FIN DE LA COMMANDE] ---');

        return Command::SUCCESS;
    }
}
