<?php

namespace App\Repository\Ace;

use App\Entity\Ace\AcTestimonial;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method AcTestimonial|null find($id, $lockMode = null, $lockVersion = null)
 * @method AcTestimonial|null findOneBy(array $criteria, array $orderBy = null)
 * @method AcTestimonial[]    findAll()
 * @method AcTestimonial[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class AcTestimonialRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, AcTestimonial::class);
    }

    // /**
    //  * @return AcTestimonial[] Returns an array of AcTestimonial objects
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
    public function findOneBySomeField($value): ?AcTestimonial
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
