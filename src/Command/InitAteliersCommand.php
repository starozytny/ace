<?php

namespace App\Command;

use App\Entity\Ace\AcAtelier;
use App\Entity\Ace\AcService;
use App\Service\DatabaseService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;
use Symfony\Component\String\Slugger\AsciiSlugger;

class InitAteliersCommand extends Command
{
    protected static $defaultName = 'app:init:ateliers';
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
            ->setDescription('Add initial content ateliers pages')
        ;
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);

        $io->title('Reset des tables');
        $this->databaseService->resetTable($io, ['ac_atelier']);

        $io->title('Ajout des ateliers');
        $content = "<p>
                       Et si « avoir du temps » passait par une optimisation
                        de son organisation au quotidien, gérer ses tâches
                        autrement ? <br>
                        Quel est votre rapport au temps, quelles sont les
                        possibilités pour améliorer votre méthodologie ?
                        C’est ce que je vous propose de découvrir au cours de
                        cet atelier. <br><br>
                       <b> 1 inscription = 1h de coaching gratuite sur le sujet de
                        votre choix</b>
                </p>
                ";

        for($i=0 ; $i< 4 ; $i++){

            $atelier = (new AcAtelier())
                ->setContent($content)
                ->setName("QUI SE DIT RÉGULIÈREMENT « JE N’AI PAS LE TEMPS DE... »")
                ->setMin(5)
                ->setMax(12)
            ;

            $this->em->persist($atelier);
        }

        $this->em->flush();

        $io->newLine();
        $io->comment('--- [FIN DE LA COMMANDE] ---');

        return Command::SUCCESS;
    }
}
