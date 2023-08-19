<?php

namespace App\Repository;

use App\Entity\DeaddropImage;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<DeaddropImage>
 *
 * @method DeaddropImage|null find($id, $lockMode = null, $lockVersion = null)
 * @method DeaddropImage|null findOneBy(array $criteria, array $orderBy = null)
 * @method DeaddropImage[]    findAll()
 * @method DeaddropImage[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class DeaddropImageRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, DeaddropImage::class);
    }

//    /**
//     * @return DeaddropImage[] Returns an array of DeaddropImage objects
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

//    public function findOneBySomeField($value): ?DeaddropImage
//    {
//        return $this->createQueryBuilder('d')
//            ->andWhere('d.exampleField = :val')
//            ->setParameter('val', $value)
//            ->getQuery()
//            ->getOneOrNullResult()
//        ;
//    }
}
