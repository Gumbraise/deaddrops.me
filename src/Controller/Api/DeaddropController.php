<?php

namespace App\Controller\Api;

use App\Repository\DeaddropRepository;
use App\Service\UpdateDeadrops;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\Normalizer\AbstractNormalizer;
use Symfony\Component\Serializer\SerializerInterface;

#[Route('/api/deadrop', name: 'api_deadrop_')]
class DeaddropController extends AbstractController
{
    /**
     * @param UpdateDeadrops $deadropsService
     * @return Response
     */
    #[Route('/deaddrop', name: 'index')]
    public function index(UpdateDeadrops $deadropsService): Response
    {
        return $this->json($deadropsService->update());
    }
}
