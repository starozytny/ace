<?php

namespace App\Repository\Ace;

use App\Entity\Ace\AcService;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method AcService|null find($id, $lockMode = null, $lockVersion = null)
 * @method AcService|null findOneBy(array $criteria, array $orderBy = null)
 * @method AcService[]    findAll()
 * @method AcService[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class AcServiceRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, AcService::class);
    }

    // /**
    //  * @return AcService[] Returns an array of AcService objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('a')
            ->andWhere('a.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('a.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?AcService
    {
        return $this->createQueryBuilder('a')
            ->andWhere('a.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
