<?php

namespace App\Repository;

use App\Entity\DeaddropActivity;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<DeaddropActivity>
 *
 * @method DeaddropActivity|null find($id, $lockMode = null, $lockVersion = null)
 * @method DeaddropActivity|null findOneBy(array $criteria, array $orderBy = null)
 * @method DeaddropActivity[]    findAll()
 * @method DeaddropActivity[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class DeaddropActivityRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, DeaddropActivity::class);
    }

//    /**
//     * @return DeaddropsActivity[] Returns an array of DeaddropsActivity objects
//     */
//    public function findByExampleField($value): array
//    {
//        return $this->createQueryBuilder('d')
//            ->andWhere('d.exampleField = :val')
//            ->setParameter('val', $value)
//            ->orderBy('d.id', 'ASC')
//            ->setMaxResults(10)
//            ->getQuery()
//            ->getResult()
//        ;
//    }

//    public function findOneBySomeField($value): ?DeaddropsActivity
//    {
//        return $this->createQueryBuilder('d')
//            ->andWhere('d.exampleField = :val')
//            ->setParameter('val', $value)
//            ->getQuery()
//            ->getOneOrNullResult()
//        ;
//    }
}
