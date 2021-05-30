<?php

namespace App\Repository\Ace;

use App\Entity\Ace\AcAtelier;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method AcAtelier|null find($id, $lockMode = null, $lockVersion = null)
 * @method AcAtelier|null findOneBy(array $criteria, array $orderBy = null)
 * @method AcAtelier[]    findAll()
 * @method AcAtelier[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class AcAtelierRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, AcAtelier::class);
    }

    // /**
    //  * @return AcAtelier[] Returns an array of AcAtelier objects
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
    public function findOneBySomeField($value): ?AcAtelier
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
