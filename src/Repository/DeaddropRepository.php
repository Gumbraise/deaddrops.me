<?php

namespace App\Repository;

use App\Entity\Deaddrop;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Deaddrop>
 *
 * @method Deaddrop|null find($id, $lockMode = null, $lockVersion = null)
 * @method Deaddrop|null findOneBy(array $criteria, array $orderBy = null)
 * @method Deaddrop[]    findAll()
 * @method Deaddrop[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class DeaddropRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Deaddrop::class);
    }

//    /**
//     * @return Deaddrop[] Returns an array of Deaddrop objects
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

//    public function findOneBySomeField($value): ?Deaddrop
//    {
//        return $this->createQueryBuilder('d')
//            ->andWhere('d.exampleField = :val')
//            ->setParameter('val', $value)
//            ->getQuery()
//            ->getOneOrNullResult()
//        ;
//    }
}
