<?php

namespace App\Command;

use App\Entity\Ace\AcService;
use App\Entity\Ace\AcTestimonial;
use App\Service\DatabaseService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;
use Symfony\Component\String\Slugger\AsciiSlugger;

class InitTestimonialsCommand extends Command
{
    protected static $defaultName = 'app:init:testimonials';
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
            ->setDescription('Add initial content testimonials pages')
        ;
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);

        $io->title('Reset des tables');
        $this->databaseService->resetTable($io, ['ac_testimonial']);

        $io->title('Ajout des témoignages');

        $data = [
            [
                'name' => "Louis JOUANY", "profession" => "CEO Endeavor",
                'avis' => "
                        Valérie Ternay a démontré, avec talent, ses compétences auprès des étudiants du
                        Groupe ESIEA. A ce poste qui venait d’être créé, elle a pris en charge le support et
                        l’accompagnement de la vie étudiante et associative qu’elle a brillamment développé
                        en coordination avec les équipes pédagogiques et la direction sur l’ensemble des
                        campus. A l’écoute, avec tact, persévérance et bienveillance, elle a amené toutes les
                        parties prenantes, individus et organisations, à une meilleure communication ainsi
                        qu’une prise en compte et un développement de leurs potentiels respectifs. Son
                        investissement personnel de chaque instant ainsi que les résultats obtnus ont été
                        reconnus par toutes et tous."
            ],
            [
                'name' => "Lionel PREVOST PhD", "profession" => "Directeur de recherche à l’ESIEA",
                'avis' => "
                        J’ai eu de nombreux échanges avec Valérie, qui m’ont permis d’apprécier ses capacités
                        d’écoute et de synthèse ainsi que la qualité et la justesse de son accompagnement. Les
                        retours des étudiants la concernant sont tout aussi unanimes quant à l’aide qu’elle a pu
                        leur apporter lorsqu’ils avaient des soucis d’orientation ou personnels. Je suis
                        convaincu que l’expérience de Valérie sera précieuse à toute entreprise faisant appel à
                        ses services."
            ],
            [
                'name' => "Sophia", "profession" => "Etudiante à L’ESIEA",
                'avis' => "
                        Valérie est une coach en or, elle m’a beaucoup aidée dans plusieurs domaines de ma
                        vie : que ce soit au niveau scolaire, en me poussant toujours plus à me dépasser dans
                        mes études ou dans le cadre de ma vie étudiante où elle m’a aidé à comprendre
                        l’importance de la communication et du travail d’équipe. Ou encore dans le contexte
                        de ma vie personnelle où j’ai, grâce à elle et un travail sur moi-même, pu me découvrir
                        des axes sur lesquels je devais m’améliorer afin de devenir la personne que je veux
                        être."
            ],
            [
                'name' => "Victor Galisson", "profession" => "Ingénieur développement IA",
                'avis' => "
                        Valérie a été d'une aide précieuse lorsque j'ai souhaité effectuer un changement d'entreprise. 
                        Elle a su me motiver dans mes choix et mes décisions, en m'apportant des conseils et des 
                        techniques adaptés à ma situation. Cela m'a permis d'avoir une idée claire de ce que je 
                        souhaitais et de ce qu'il fallait que je fasse pour atteindre mes objectifs. Malgré le 
                        contexte sanitaire, je suis resté motivé grâce à nos échanges réguliers. J'aurais pu 
                        regretter de ne pas avoir tenté de saisir certaines opportunités mais Valérie a su 
                        m'aiguiller et me motiver pour postuler aux offres que je voulais vraiment. J'ai pu 
                        prendre la décision la plus en accord avec mes valeurs et mes envies et je suis désormais 
                        plus épanoui dans la société où je travaille. Je vous recommande vivement d’échanger avec Valérie !"
            ]
        ];

        foreach($data as $item){

            $obj = (new AcTestimonial())
                ->setName($item['name'])
                ->setWork($item['profession'])
                ->setContent($item['avis'])
            ;

            $this->em->persist($obj);
        }

        $this->em->flush();

        $io->newLine();
        $io->comment('--- [FIN DE LA COMMANDE] ---');

        return Command::SUCCESS;
    }
}
