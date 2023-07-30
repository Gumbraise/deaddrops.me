<?php

namespace App\Entity;

use App\Repository\DeaddropImageRepository;
use DateTimeImmutable;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;
use Vich\UploaderBundle\Mapping\Annotation as Vich;

#[Vich\Uploadable]
#[ORM\Entity(repositoryClass: DeaddropImageRepository::class)]
class DeaddropImage
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column]
    private ?DateTimeImmutable $createdAt = null;

    #[ORM\Column]
    private ?DateTimeImmutable $updatedAt = null;

    #[ORM\ManyToOne(inversedBy: 'images')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Deaddrop $deaddrop = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $label = null;

    #[ORM\Column(type: 'string', length: 255, nullable: true)]
    private $imageName;

    #[Vich\UploadableField(mapping: 'deaddrop_image', fileNameProperty: 'imageName')]
    #[Assert\File(maxSize: '1024k', mimeTypes: ["image/jpeg", "image/png"])]
    private $imageFile;

    public function __construct()
    {
        $this->createdAt = new DateTimeImmutable();
        $this->updatedAt = new DateTimeImmutable();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getCreatedAt(): ?DateTimeImmutable
    {
        return $this->createdAt;
    }

    public function setCreatedAt(DateTimeImmutable $createdAt): static
    {
        $this->createdAt = $createdAt;

        return $this;
    }

    public function getUpdatedAt(): ?DateTimeImmutable
    {
        return $this->updatedAt;
    }

    public function setUpdatedAt(DateTimeImmutable $updatedAt): static
    {
        $this->updatedAt = $updatedAt;

        return $this;
    }

    public function getDeaddrop(): ?Deaddrop
    {
        return $this->deaddrop;
    }

    public function setDeaddrop(?Deaddrop $deaddrop): static
    {
        $this->deaddrop = $deaddrop;

        return $this;
    }

    public function getLabel(): ?string
    {
        return $this->label;
    }

    public function setLabel(?string $label): static
    {
        $this->label = $label;

        return $this;
    }

    /**
     * @return string|null
     */
    public function getImageName(): ?string
    {
        return $this->imageName;
    }

    /**
     * @param string|null $imageName
     * @return $this
     */
    public function setImageName(?string $imageName): static
    {
        $this->imageName = $imageName;

        return $this;
    }

    /**
     * @return mixed
     */
    public function getImageFile(): mixed
    {
        return $this->imageFile;
    }

    /**
     * @param $imageFile
     * @return $this
     */
    public function setImageFile($imageFile): static
    {
        $this->imageFile = $imageFile;

        if ($imageFile) {
            $this->updatedAt = new DateTimeImmutable('now');
        }

        return $this;
    }
}
