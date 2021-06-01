<?php

namespace App\Entity\Ace;

use App\Repository\Ace\AcAtelierRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

/**
 * @ORM\Entity(repositoryClass=AcAtelierRepository::class)
 */
class AcAtelier
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     * @Groups({"visitor:read"})
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"visitor:read"})
     */
    private $name;

    /**
     * @ORM\Column(type="text")
     * @Groups({"visitor:read"})
     */
    private $content;

    /**
     * @ORM\Column(type="integer")
     * @Groups({"visitor:read"})
     */
    private $min;

    /**
     * @ORM\Column(type="integer")
     * @Groups({"visitor:read"})
     */
    private $max;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Groups({"visitor:read"})
     */
    private $file;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): self
    {
        $this->name = $name;

        return $this;
    }

    public function getContent(): ?string
    {
        return $this->content;
    }

    public function setContent(string $content): self
    {
        $this->content = $content;

        return $this;
    }

    public function getMin(): ?int
    {
        return $this->min;
    }

    public function setMin(int $min): self
    {
        $this->min = $min;

        return $this;
    }

    public function getMax(): ?int
    {
        return $this->max;
    }

    public function setMax(int $max): self
    {
        $this->max = $max;

        return $this;
    }

    public function getFile(): ?string
    {
        return $this->file;
    }

    public function setFile(?string $file): self
    {
        $this->file = $file;

        return $this;
    }
}
