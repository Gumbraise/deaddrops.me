<?php

namespace App\Controller\Api;

use App\Service\UpdateDeadrops;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api/deadrop', name: 'api_deadrop_')]
class DeaddropApiController extends AbstractController
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

    /**
     * @param Request $request
     * @return Response
     */
    #[Route('/sidebar_list', name: 'sidebar_list', methods: 'POST')]
    public function sidebarList(Request $request): Response
    {
        return $this->render('_includes/components/sidebar.html.twig', [
            'deaddrops' => json_decode($request->getContent(), true),
        ]);
    }
}
