<?php


namespace App\Service;


use Doctrine\DBAL\DBALException;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

class DatabaseService
{
    private $em;

    public function __construct(EntityManagerInterface $entityManager)
    {
        $this->em = $entityManager;
    }

    public function resetTable(SymfonyStyle $io, $list)
    {
        foreach ($list as $item) {
            $objs = $this->em->getRepository($item)->findAll();
            foreach($objs as $obj){
                $this->em->remove($obj);
            }

            $this->em->flush();
        }
        $io->text('Reset [OK]');
    }
}