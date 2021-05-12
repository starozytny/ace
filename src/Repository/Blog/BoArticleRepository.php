<?php

namespace App\Repository\Blog;

use App\Entity\Blog\BoArticle;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method BoArticle|null find($id, $lockMode = null, $lockVersion = null)
 * @method BoArticle|null findOneBy(array $criteria, array $orderBy = null)
 * @method BoArticle[]    findAll()
 * @method BoArticle[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class BoArticleRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, BoArticle::class);
    }

    // /**
    //  * @return BoArticle[] Returns an array of BoArticle objects
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
    public function findOneBySomeField($value): ?BoArticle
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
