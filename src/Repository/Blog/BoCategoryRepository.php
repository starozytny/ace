<?php

namespace App\Repository\Blog;

use App\Entity\Blog\BoCategory;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method BoCategory|null find($id, $lockMode = null, $lockVersion = null)
 * @method BoCategory|null findOneBy(array $criteria, array $orderBy = null)
 * @method BoCategory[]    findAll()
 * @method BoCategory[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class BoCategoryRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, BoCategory::class);
    }

    // /**
    //  * @return BoCategory[] Returns an array of BoCategory objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('b')
            ->andWhere('b.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('b.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?BoCategory
    {
        return $this->createQueryBuilder('b')
            ->andWhere('b.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
