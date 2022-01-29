<?php

namespace App\Entity\Ace;

use App\Repository\Ace\AcServiceRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

/**
 * @ORM\Entity(repositoryClass=AcServiceRepository::class)
 */
class AcService
{
    const FOLDER_SERVICES = "services";

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
    private $title;

    /**
     * @ORM\Column(type="text", nullable=true)
     * @Groups({"visitor:read"})
     */
    private $intro;

    /**
     * @ORM\Column(type="text", nullable=true)
     * @Groups({"visitor:read"})
     */
    private $content;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"visitor:read"})
     */
    private $slug;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Groups({"visitor:read"})
     */
    private $file1;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Groups({"visitor:read"})
     */
    private $file2;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Groups({"visitor:read"})
     */
    private $file3;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Groups({"visitor:read"})
     */
    private $file4;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Groups({"visitor:read"})
     */
    private $file5;

    /**
     * @ORM\Column(type="text", nullable=true)
     * @Groups({"visitor:read"})
     */
    private $seance;

    /**
     * @ORM\Column(type="text", nullable=true)
     * @Groups({"visitor:read"})
     */
    private $nbSeance;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getTitle(): ?string
    {
        return $this->title;
    }

    public function setTitle(string $title): self
    {
        $this->title = $title;

        return $this;
    }

    public function getIntro(): ?string
    {
        return $this->intro;
    }

    public function setIntro(?string $intro): self
    {
        $this->intro = $intro;

        return $this;
    }

    public function getContent(): ?string
    {
        return $this->content;
    }

    public function setContent(?string $content): self
    {
        $this->content = $content;

        return $this;
    }

    public function getSlug(): ?string
    {
        return $this->slug;
    }

    public function setSlug(string $slug): self
    {
        $this->slug = $slug;

        return $this;
    }

    public function getFile1(): ?string
    {
        return $this->file1;
    }

    public function setFile1(?string $file1): self
    {
        $this->file1 = $file1;

        return $this;
    }

    public function getFile2(): ?string
    {
        return $this->file2;
    }

    public function setFile2(?string $file2): self
    {
        $this->file2 = $file2;

        return $this;
    }

    public function getFile3(): ?string
    {
        return $this->file3;
    }

    public function setFile3(?string $file3): self
    {
        $this->file3 = $file3;

        return $this;
    }

    public function getFile4(): ?string
    {
        return $this->file4;
    }

    public function setFile4(?string $file4): self
    {
        $this->file4 = $file4;

        return $this;
    }

    public function getFile5(): ?string
    {
        return $this->file5;
    }

    public function setFile5(?string $file5): self
    {
        $this->file5 = $file5;

        return $this;
    }

    public function getSeance(): ?string
    {
        return $this->seance;
    }

    public function setSeance(?string $seance): self
    {
        $this->seance = $seance;

        return $this;
    }

    public function getNbSeance(): ?string
    {
        return $this->nbSeance;
    }

    public function setNbSeance(?string $nbSeance): self
    {
        $this->nbSeance = $nbSeance;

        return $this;
    }

    /**
     * @return string
     * @Groups({"visitor:read"})
     */
    public function getFile1File(): ?string
    {
        return $this->file1 ? "/" . self::FOLDER_SERVICES ."/" . $this->file1 : "/page_accueil.jpg";
    }

    /**
     * @return string
     * @Groups({"visitor:read"})
     */
    public function getFile2File(): ?string
    {
        return $this->file2 ? "/" . self::FOLDER_SERVICES ."/" . $this->file2 : "/page_accueil.jpg";
    }
    /**
     * @return string
     * @Groups({"visitor:read"})
     */
    public function getFile3File(): ?string
    {
        return $this->file3 ? "/" . self::FOLDER_SERVICES ."/" . $this->file3 : "/page_accueil.jpg";
    }
    /**
     * @return string
     * @Groups({"visitor:read"})
     */
    public function getFile4File(): ?string
    {
        return $this->file4 ? "/" . self::FOLDER_SERVICES ."/" . $this->file4 : "/page_accueil.jpg";
    }
    /**
     * @return string
     * @Groups({"visitor:read"})
     */
    public function getFile5File(): ?string
    {
        return $this->file5 ? "/" . self::FOLDER_SERVICES ."/" . $this->file5 : "/page_accueil.jpg";
    }
}
