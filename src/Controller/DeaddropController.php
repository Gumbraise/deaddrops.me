<?php

namespace App\Controller;

use App\Entity\Deaddrop;
use App\Form\DeaddropType;
use App\Repository\DeaddropRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/deaddrop', name: 'app_deaddrop_')]
class DeaddropController extends AbstractController
{
    #[Route('/', name: 'index', methods: ['GET'])]
    public function index(DeaddropRepository $deaddropRepository): Response
    {
        return $this->render('deaddrop/index.html.twig', [
            'deaddrops' => $deaddropRepository->findAll(),
        ]);
    }

    #[Route('/new', name: 'new', methods: ['GET', 'POST'])]
    public function new(Request $request, EntityManagerInterface $entityManager): Response
    {
        $deaddrop = new Deaddrop();
        $form = $this->createForm(DeaddropType::class, $deaddrop);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $entityManager->persist($deaddrop);
            $entityManager->flush();

            return $this->redirectToRoute('app_deaddrop_index', [], Response::HTTP_SEE_OTHER);
        }

        return $this->render('deaddrop/new.html.twig', [
            'deaddrop' => $deaddrop,
            'form' => $form,
        ]);
    }

    #[Route('/{deaddropId}', name: 'show', methods: ['GET'])]
    public function show(Deaddrop $deaddrop): Response
    {
        return $this->render('deaddrop/show.html.twig', [
            'deaddrop' => $deaddrop,
        ]);
    }

    #[Route('/{deaddropId}/edit', name: 'edit', methods: ['GET', 'POST'])]
    public function edit(Request $request, Deaddrop $deaddrop, EntityManagerInterface $entityManager): Response
    {
        $form = $this->createForm(DeaddropType::class, $deaddrop);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $entityManager->flush();

            return $this->redirectToRoute('app_deaddrop_index', [], Response::HTTP_SEE_OTHER);
        }

        return $this->render('deaddrop/edit.html.twig', [
            'deaddrop' => $deaddrop,
            'form' => $form,
        ]);
    }

    #[Route('/{deaddropId}', name: 'delete', methods: ['POST'])]
    public function delete(Request $request, Deaddrop $deaddrop, EntityManagerInterface $entityManager): Response
    {
        if ($this->isCsrfTokenValid('delete'.$deaddrop->getId(), $request->request->get('_token'))) {
            $entityManager->remove($deaddrop);
            $entityManager->flush();
        }

        return $this->redirectToRoute('app_deaddrop_index', [], Response::HTTP_SEE_OTHER);
    }
}
