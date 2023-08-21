<?php

namespace App\Entity;

use ApiPlatform\Doctrine\Orm\Filter\OrderFilter;
use ApiPlatform\Doctrine\Orm\Filter\RangeFilter;
use ApiPlatform\Doctrine\Orm\Filter\SearchFilter;
use ApiPlatform\Metadata\ApiFilter;
use ApiPlatform\Metadata\ApiProperty;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use App\Repository\DeaddropRepository;
use Carbon\Carbon;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ApiResource]
#[Get(normalizationContext: ['groups' => ['deaddrop:get']])]
#[GetCollection(normalizationContext: ['groups' => ['deaddrop:getcollection']])]
#[ApiFilter(RangeFilter::class, properties: ['longitude', 'latitude'])]
#[ApiFilter(OrderFilter::class, properties: ['createdAt' => 'ASC'])]
#[ApiFilter(SearchFilter::class, properties: ['name' => 'partial'])]
#[ORM\Entity(repositoryClass: DeaddropRepository::class)]
class Deaddrop
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[ApiProperty(identifier: false)]
    private ?int $id = null;

    #[Groups(['deaddrop:get', 'deaddrop:getcollection'])]
    #[ORM\Column(length: 255)]
    private ?string $name = null;

    #[Groups(['deaddrop:get', 'deaddrop:getcollection'])]
    #[ORM\Column(length: 255)]
    private ?string $size = null;

    #[Groups(['deaddrop:get', 'deaddrop:getcollection'])]
    #[ORM\Column]
    private ?\DateTimeImmutable $createdAt = null;

    #[Groups(['deaddrop:get'])]
    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $about = null;

    #[Groups(['deaddrop:get', 'deaddrop:getcollection'])]
    #[ORM\Column(nullable: true)]
    private ?float $longitude = null;

    #[Groups(['deaddrop:get', 'deaddrop:getcollection'])]
    #[ORM\Column(nullable: true)]
    private ?float $latitude = null;

    #[ORM\Column]
    private ?bool $isExternalReferrer = null;

    #[ORM\Column]
    private ?\DateTimeImmutable $updatedAt = null;

    #[Groups(['deaddrop:get', 'deaddrop:getcollection'])]
    #[ORM\ManyToOne(inversedBy: 'deaddrops')]
    private ?User $author = null;

    #[ORM\OneToMany(mappedBy: 'deaddrop', targetEntity: DeaddropImage::class, orphanRemoval: true)]
    private Collection $images;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $address = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $city = null;

    #[ORM\Column(length: 3, nullable: true)]
    private ?string $country = null;

    #[Groups(['deaddrop:get', 'deaddrop:getcollection'])]
    #[ApiProperty(description: 'The deaddrop id from deaddrops.com', identifier: true)]
    #[ORM\Column(unique: true, nullable: false)]
    private ?int $deaddropId = null;

    #[Groups(['deaddrop:get'])]
    #[ORM\OneToMany(mappedBy: 'deaddrop', targetEntity: DeaddropActivity::class)]
    private Collection $activities;

    public function __construct()
    {
        $this->deaddropId = $this->id;
        $this->createdAt = new \DateTimeImmutable();
        $this->updatedAt = new \DateTimeImmutable();
        $this->isExternalReferrer = false;
        $this->images = new ArrayCollection();
        $this->activities = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function setId(int $id): static
    {
        $this->id = $id;

        return $this;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): static
    {
        $this->name = $name;

        return $this;
    }

    public function getSize(): ?string
    {
        return $this->size;
    }

    public function setSize(string $size): static
    {
        $this->size = $size;

        return $this;
    }

    public function getCreatedAt(): ?\DateTimeImmutable
    {
        return $this->createdAt;
    }

    public function setCreatedAt(\DateTimeImmutable $createdAt): static
    {
        $this->createdAt = $createdAt;

        return $this;
    }

    public function getAbout(): ?string
    {
        return $this->about;
    }

    public function setAbout(?string $about): static
    {
        $this->about = $about;

        return $this;
    }

    public function getLongitude(): ?float
    {
        return $this->longitude;
    }

    public function setLongitude(?float $longitude): static
    {
        $this->longitude = $longitude;

        return $this;
    }

    public function getLatitude(): ?float
    {
        return $this->latitude;
    }

    public function setLatitude(?float $latitude): static
    {
        $this->latitude = $latitude;

        return $this;
    }

    #[Groups(['deaddrop:get'])]
    public function getStatus(): ?array
    {
        return $this->activities->last()?->getStatus() ? [
            "status" => $this->activities->last()?->getStatus(),
            "date" => $this->activities->last()?->getCreatedAt()->format('d/m/Y'),
        ] : null;
    }

    public function isIsExternalReferrer(): ?bool
    {
        return $this->isExternalReferrer;
    }

    public function setIsExternalReferrer(bool $isExternalReferrer): static
    {
        $this->isExternalReferrer = $isExternalReferrer;

        return $this;
    }

    public function getUpdatedAt(): ?\DateTimeImmutable
    {
        return $this->updatedAt;
    }

    public function setUpdatedAt(\DateTimeImmutable $updatedAt): static
    {
        $this->updatedAt = $updatedAt;

        return $this;
    }

    public function getAuthor(): User|string
    {
        return $this->author ?: 'Anonymous';
    }

    public function setAuthor(?User $author): static
    {
        $this->author = $author;

        return $this;
    }

    /**
     * @return Collection<int, DeaddropImage>
     */
    #[Groups(['deaddrop:get'])]
    public function getImages(): Collection
    {
        return $this->images;
    }

    public function addImage(DeaddropImage $image): static
    {
        if (!$this->images->contains($image)) {
            $this->images->add($image);
            $image->setDeaddrop($this);
        }

        return $this;
    }

    public function removeImage(DeaddropImage $image): static
    {
        if ($this->images->removeElement($image)) {
            // set the owning side to null (unless already changed)
            if ($image->getDeaddrop() === $this) {
                $image->setDeaddrop(null);
            }
        }

        return $this;
    }

    public function getAddress(): ?string
    {
        return $this->address;
    }

    public function setAddress(?string $address): static
    {
        $this->address = $address;

        return $this;
    }

    public function getCity(): ?string
    {
        return $this->city;
    }

    public function setCity(?string $city): static
    {
        $this->city = $city;

        return $this;
    }

    public function getCountry(): ?string
    {
        return $this->country;
    }

    public function setCountry(?string $country): static
    {
        $this->country = $country;

        return $this;
    }

    public function getDeaddropId(): ?int
    {
        return $this->deaddropId;
    }

    public function setDeaddropId(int $deaddropId): static
    {
        $this->deaddropId = $deaddropId;

        return $this;
    }

    #[Groups(['deaddrop:get', 'deaddrop:getcollection'])]
    public function getCreatedAtReadable(): string
    {
        return Carbon::instance($this->createdAt)->diffForHumans();
    }

    #[Groups(['deaddrop:get'])]
    public function getUpdatedAtReadable(): string
    {
        return Carbon::instance($this->updatedAt)->diffForHumans();
    }

    #[Groups(['deaddrop:get', 'deaddrop:getcollection'])]
    public function getPlace(): string
    {
        return "$this->address, $this->city, $this->country";
    }

    /**
     * @return Collection<int, DeaddropActivity>
     */
    public function getActivities(): Collection
    {
        return $this->activities;
    }

    public function addActivity(DeaddropActivity $activity): static
    {
        if (!$this->activities->contains($activity)) {
            $this->activities->add($activity);
            $activity->setDeaddrop($this);
        }

        return $this;
    }

    public function removeActivity(DeaddropActivity $activity): static
    {
        if ($this->activities->removeElement($activity)) {
            // set the owning side to null (unless already changed)
            if ($activity->getDeaddrop() === $this) {
                $activity->setDeaddrop(null);
            }
        }

        return $this;
    }
}