<?php

namespace App\Entity;

use App\Repository\DeaddropActivityRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: DeaddropActivityRepository::class)]
class DeaddropActivity
{
    public const LOCAL_WORKING = 'Working';
    public const LOCAL_NOT_FOUND = 'Not Found';
    public const LOCAL_DEAD = 'Dead';
    public const DD_WORKING = 'working';
    public const DD_NOT_FOUND = 'unconfirmed, may be broken';
    public const DD_DEAD = 'broken/dead/stolen/gone';


    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne]
    private ?User $author = null;

    #[ORM\ManyToOne(inversedBy: 'activities')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Deaddrop $deaddrop = null;

    #[Groups(['deaddrop:get'])]
    #[ORM\Column(length: 255)]
    private ?string $status = null;

    #[Groups(['deaddrop:get'])]
    #[ORM\Column(type: Types::TEXT)]
    private ?string $message = null;

    #[ORM\Column]
    private ?\DateTimeImmutable $createdAt = null;

    public function __construct()
    {
        $this->createdAt = new \DateTimeImmutable();
        $this->status = self::LOCAL_WORKING;
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    #[Groups(['deaddrop:get'])]
    public function getAuthor(): User|string
    {
        return $this->author ?: 'Anonymous';
    }

    public function setAuthor(?User $author): static
    {
        $this->author = $author;

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

    public function getStatus(): ?string
    {
        return $this->status;
    }

    public function setStatus(string $status): static
    {
        $this->status = $status;

        return $this;
    }

    public function getMessage(): ?string
    {
        return $this->message;
    }

    public function setMessage(string $message): static
    {
        $this->message = $message;

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

    #[Groups(['deaddrop:get'])]
    public function getCreatedAtDMY(): string
    {
        return $this->createdAt->format('d/m/Y');
    }
}
