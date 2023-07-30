<?php

namespace App\Controller;

use App\Repository\DeaddropRepository;
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
}
