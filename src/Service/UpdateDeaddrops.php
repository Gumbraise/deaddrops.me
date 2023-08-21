<?php

namespace App\Service;

use App\Entity\Deaddrop;
use App\Entity\DeaddropActivity;
use App\Entity\DeaddropImage;
use DateTimeImmutable;
use Doctrine\ORM\EntityManagerInterface;
use DOMDocument;
use DOMElement;
use DOMNodeList;
use PHPUnit\Exception;
use Symfony\Component\Asset\Package;
use Symfony\Component\Asset\VersionStrategy\EmptyVersionStrategy;
use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\HttpClient\HttpClient;
use Symfony\Component\HttpFoundation\File\File;
use Symfony\Contracts\HttpClient\Exception\ClientExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\RedirectionExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\ServerExceptionInterface;
use Symfony\Contracts\HttpClient\Exception\TransportExceptionInterface;
use Symfony\Contracts\HttpClient\HttpClientInterface;
use Vich\UploaderBundle\Handler\DownloadHandler;
use Vich\UploaderBundle\Handler\UploadHandler;

readonly class UpdateDeaddrops
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private UploadHandler          $uploadHandler,
    )
    {
    }

    public function update(): array
    {
        $url = 'https://deaddrops.com/db/?page=view&id=';

        $httpClient = HttpClient::create();

        $range = [
            'start' => '20',
            'end' => '40',
        ];

        $elements = [];

        for ($i = $range['start']; $i <= $range['end']; $i++) {
            $element = $this->getElements($httpClient, $url . $i);
            if ($element) {
                $deaddrop = new Deaddrop();
                $deaddrop->setDeaddropId($element['id']);
                $deaddrop->setName($element['name']);
                $deaddrop->setCreatedAt($element['date-created']);
                $deaddrop->setUpdatedAt($element['date-created']);
                $deaddrop->setLatitude($element['coordinates']['latitude'] ?? null);
                $deaddrop->setLongitude($element['coordinates']['longitude'] ?? null);
                $deaddrop->setAddress($element['location']['street-address'] ?? null);
                $deaddrop->setCity($element['location']['city'] ?? null);
                $deaddrop->setCountry($element['location']['country'] ?? null);
                $deaddrop->setAbout($element['about']);
                $deaddrop->setSize($element['size']);

                $activities = new DeaddropActivity();
                $activities->setDeaddrop($deaddrop);
                $activities->setMessage($element['status']['status']);
                $activities->setStatus($element['status']['status']);
                $activities->setCreatedAt($element['status']['date']);
                $this->entityManager->persist($activities);

                $deaddrop->setIsExternalReferrer(true);

                foreach ($element['images'] as $key => $value) {
                    if (!$value) {
                        continue;
                    }
                    $image = new DeaddropImage();
                    $image->setImageFile($value["file"]);
                    $image->setImageName($value["name"]);
                    $image->setLabel($key);
                    $image->setDeaddrop($deaddrop);

                    $this->entityManager->persist($image);
                }

                $this->entityManager->persist($deaddrop);

                $elements[] = $element;
            }
        }

        $this->entityManager->flush();

        return $elements;
    }

    private function getElements(HttpClientInterface $httpClient, $url): ?array
    {
        try {
            $response = $httpClient->request('GET', $url);

            if ($response->getStatusCode() !== 200) {
                dd($response->getStatusCode());
            }

            $content = $response->getContent();

            $dom = new DOMDocument();
            @$dom->loadHTML($content);

            $baseUrl = "https://deaddrops.com/db/";

            if (str_contains($dom->getElementsByTagName('body')->item(0)->textContent, 'ERROR')) {
                return null;
            }

            return [
                'id' => intval($dom->getElementsByTagName('td')->item(10)->textContent),
                'name' => $dom->getElementsByTagName('td')->item(12)->textContent,
                'drop-type' => $dom->getElementsByTagName('td')->item(14)->textContent,
                'size' => $dom->getElementsByTagName('td')->item(16)->textContent,
                'date-created' => DateTimeImmutable::createFromFormat('Y-m-d', $dom->getElementsByTagName('td')->item(18)->textContent),
                'location' => $this->location(
                    $dom->getElementsByTagName('td')->item(20)->textContent
                ),
                'coordinates' => $this->coordinates(
                    $dom->getElementsByTagName('td')->item(22)->textContent
                ),
                'images' => [
                    'overview' => $dom->getElementsByTagName('img')->item(0) ? ($this->isImageUrl($baseUrl . $dom->getElementsByTagName('img')->item(0)->parentNode->getAttribute('href')) ? $this->getImage($baseUrl . $dom->getElementsByTagName('img')->item(0)->parentNode->getAttribute('href')) : null) : null,
                    'medium distance' => $dom->getElementsByTagName('img')->item(1) ? ($this->isImageUrl($baseUrl . $dom->getElementsByTagName('img')->item(1)->parentNode->getAttribute('href')) ? $this->getImage($baseUrl . $dom->getElementsByTagName('img')->item(1)->parentNode->getAttribute('href')) : null) : null,
                    'closeup' => $dom->getElementsByTagName('img')->item(2) ? ($this->isImageUrl($baseUrl . $dom->getElementsByTagName('img')->item(2)->parentNode->getAttribute('href')) ? $this->getImage($baseUrl . $dom->getElementsByTagName('img')->item(2)->parentNode->getAttribute('href')) : null) : null,
                ],
                'permalink' => $dom->getElementsByTagName('td')->item(24)->textContent,
                'status' => $this->getStatus($dom->getElementsByTagName('td')->item(37)),
                'about' => $dom->getElementsByTagName('td')->item(41)->textContent,
                'url' => $url,
            ];

        } catch (\Throwable $e) {
            dd($e);
        }
    }

    private function coordinates($coordinates): array
    {
        preg_match_all('/(\d+\.\d+) ([NS]) {2}(\d+\.\d+) ([WE])/', $coordinates, $matches);

        $latitude = $matches[1][0];
        $longitude = $matches[3][0];

        $latitude_direction = $matches[2][0];
        $longitude_direction = $matches[4][0];

        $latitude = ($latitude_direction === 'N') ? $latitude : -$latitude;
        $longitude = ($longitude_direction === 'E') ? $longitude : -$longitude;

        return [
            'latitude' => floatval($latitude),
            'longitude' => floatval($longitude),
        ];
    }

    private function location($location): array
    {
        $elements = explode(', ', $location);

        return [
            'street-address' => $elements[0],
            'city' => $elements[1],
            'country' => $elements[2],
        ];
    }

    private function getStatus(DOMElement $status): array
    {
        $element = $status->getElementsByTagName('em')->item(0);

        $pattern = '/\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/';

        if (preg_match($pattern, $status->textContent, $matches)) {
            $date = DateTimeImmutable::createFromFormat('Y-m-d H:i:s', $matches[0]);
        } else {
            $date = new DateTimeImmutable();
        }

        return match (trim($element->textContent)) {
            DeaddropActivity::DD_NOT_FOUND => [
                "status" => DeaddropActivity::LOCAL_NOT_FOUND,
                "date" => $date,
            ],
            DeaddropActivity::DD_WORKING => [
                "status" => DeaddropActivity::LOCAL_WORKING,
                "date" => $date,
            ],
            DeaddropActivity::DD_DEAD => [
                "status" => DeaddropActivity::LOCAL_DEAD,
                "date" => $date,
            ],
            default => null,
        };
    }

    private function getImage($url): ?array
    {
        $package = new Package(new EmptyVersionStrategy());;

        $httpClient = HttpClient::create();

        try {
            $response = $httpClient->request('GET', $url);
        } catch (TransportExceptionInterface $e) {
            dd($e);
        }
        try {
            if ($response->getStatusCode() === 200) {
                $tempImagePath = $package->getUrl('images/deaddrops');

                $tempImageFilename = basename(parse_url($response->getInfo()['url'], PHP_URL_PATH));


                $filesystem = new Filesystem();
                $filesystem->dumpFile($tempImagePath . '/' . $tempImageFilename, $response->getContent());

                return [
                    "file" => new File($tempImagePath . '/' . $tempImageFilename),
                    "name" => $tempImageFilename,
                ];
            }
        } catch (ClientExceptionInterface|RedirectionExceptionInterface|ServerExceptionInterface|TransportExceptionInterface $e) {
            dd($e);
        }

        dd($response);
    }

    private function isImageUrl($url): bool
    {
        $allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'];

        $filename = basename(parse_url($url, PHP_URL_PATH));

        $fileExtension = strtolower(pathinfo($filename, PATHINFO_EXTENSION));

        return in_array($fileExtension, $allowedExtensions);
    }
}