<?php

namespace App\Controller\Api;

use App\Entity\DeaddropImage;
use App\Service\UpdateDeadrops;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Asset\Package;
use Symfony\Component\Asset\PackageInterface;
use Symfony\Component\Asset\VersionStrategy\EmptyVersionStrategy;
use Symfony\Component\Asset\VersionStrategy\StaticVersionStrategy;
use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\HttpClient\HttpClient;
use Symfony\Component\HttpFoundation\File\File;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Vich\UploaderBundle\Handler\UploadHandler;

class DeaddropController extends AbstractController
{
    /**
     * @param UpdateDeadrops $deadropsService
     * @return Response
     */
    #[Route('/deaddrop', name: 'api_deaddrop')]
    public function index(UpdateDeadrops $deadropsService): Response
    {
        return $this->json($deadropsService->update());
    }
}
