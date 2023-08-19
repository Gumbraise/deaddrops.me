<?php

namespace App\Controller;

use App\Repository\DeaddropRepository;
use App\Service\UpdateDeaddrops;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class HomepageController extends AbstractController
{
    #[Route('/', name: 'app_homepage')]
    public function index(
        DeaddropRepository $deaddropRepository,
    ): Response
    {
        return $this->render('homepage/index.html.twig', [
            'deaddrops' => $deaddropRepository->findAll(),
        ]);
    }

    #[Route('/update', name: 'app_update', env: 'dev')]
    public function update(
        UpdateDeaddrops $updateDeaddrops,
    ): Response
    {
        $updateDeaddrops->update();
        return new Response('Updated', Response::HTTP_OK);
    }
}
