<?php

namespace App\Entity\Blog;

use App\Entity\DataEntity;
use App\Repository\Blog\BoArticleRepository;
use Doctrine\ORM\Mapping as ORM;
use Gedmo\Mapping\Annotation as Gedmo;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use Symfony\Component\Serializer\Annotation\Groups;

/**
 * @ORM\Entity(repositoryClass=BoArticleRepository::class)
 * @UniqueEntity(fields={"title"})
 * @UniqueEntity(fields={"slug"})
 */
class BoArticle extends DataEntity
{
    const FOLDER_ARTICLES = "articles";

    const VISIBILITY_ALL = 0;

    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     * @Groups({"visitor:read", "admin:write"})
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"visitor:read", "admin:write"})
     */
    private $title;

    /**
     * @ORM\Column(type="text", nullable=true)
     * @Groups({"visitor:read", "admin:write"})
     */
    private $introduction;

    /**
     * @ORM\Column(type="text", nullable=true)
     * @Groups({"visitor:read", "admin:write"})
     */
    private $content;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Groups({"visitor:read", "admin:write"})
     */
    private $file;

    /**
     * @ORM\Column(type="string", length=255, unique=true)
     * @Gedmo\Slug(updatable=true, fields={"title"})
     * @Groups({"visitor:read", "admin:write"})
     */
    private $slug;

    /**
     * @ORM\Column(type="boolean")
     * @Groups({"visitor:read"})
     */
    private $isPublished;

    /**
     * @ORM\ManyToOne(targetEntity=BoCategory::class, inversedBy="articles")
     * @ORM\JoinColumn(nullable=false)
     * @Groups({"visitor:read"})
     */
    private $category;

    /**
     * @ORM\Column(type="datetime")
     */
    private $createdAt;

    /**
     * @ORM\Column(type="datetime", nullable=true)
     * @Groups({"visitor:write"})
     */
    private $updatedAt;

    /**
     * @ORM\Column(type="integer")
     * @Groups({"visitor:read"})
     */
    private $visibleBy = self::VISIBILITY_ALL;

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

    public function __construct()
    {
        $createAt = new \DateTime();
        $createAt->setTimezone(new \DateTimeZone("Europe/Paris"));
        $this->createdAt = $createAt;
        $this->isPublished = false;
    }

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

    public function getCreatedAt(): ?\DateTimeInterface
    {
        return $this->createdAt;
    }

    public function setCreatedAt(\DateTimeInterface $createdAt): self
    {
        $this->createdAt = $createdAt;

        return $this;
    }

    /**
     * Return created at time in string format d/m/Y
     * @Groups({"visitor:read"})
     */
    public function getCreateAtString(): ?string
    {
        if($this->createdAt == null){
            return null;
        }
        return date_format($this->createdAt, 'd/m/Y');
    }

    /**
     * Return created at time in string format 5 janv. 2017
     * @Groups({"visitor:read"})
     */
    public function getCreateAtStringLong(): ?string
    {
        return $this->getFullDateString($this->createdAt);
    }

    public function getUpdatedAt(): ?\DateTimeInterface
    {
        return $this->updatedAt;
    }

    public function setUpdatedAt(?\DateTimeInterface $updatedAt): self
    {
        $updatedAt->setTimezone(new \DateTimeZone("Europe/Paris"));
        $this->updatedAt = $updatedAt;

        return $this;
    }

    /**
     * How long ago an article was update.
     *
     * @Groups({"visitor:read"})
     */
    public function getUpdatedAtAgo(): ?string
    {
        return $this->getHowLongAgo($this->updatedAt);
    }

    public function getIntroduction(): ?string
    {
        return $this->introduction;
    }

    public function setIntroduction(?string $introduction): self
    {
        $this->introduction = $introduction;

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

    public function getFile(): ?string
    {
        return $this->file;
    }

    public function setFile(?string $file): self
    {
        $this->file = $file;

        return $this;
    }

    public function getSlug(): ?string
    {
        return $this->slug;
    }

    public function setSlug(?string $slug): self
    {
        $this->slug = $slug;

        return $this;
    }

    public function getIsPublished(): ?bool
    {
        return $this->isPublished;
    }

    public function setIsPublished(bool $isPublished): self
    {
        $this->isPublished = $isPublished;

        return $this;
    }

    public function getCategory(): ?BoCategory
    {
        return $this->category;
    }

    public function setCategory(?BoCategory $category): self
    {
        $this->category = $category;

        return $this;
    }

    public function getVisibleBy(): ?int
    {
        return $this->visibleBy;
    }

    public function setVisibleBy(int $visibleBy): self
    {
        $this->visibleBy = $visibleBy;

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

    /**
     * @return string
     * @Groups({"visitor:read"})
     */
    public function getVisibleByString(): string
    {
        $values = ["Tout le monde", "Membres"];

        return $values[$this->visibleBy];
    }


    /**
     * @return string
     * @Groups({"visitor:read"})
     */
    public function getFileFile(): string
    {
        return $this->file ? "/" . self::FOLDER_ARTICLES ."/" . $this->file : "https://robohash.org/" . $this->id . "?size=64x64";
    }

    /**
     * @return string
     * @Groups({"visitor:read"})
     */
    public function getFile1File(): ?string
    {
        return $this->file1 ? "/" . self::FOLDER_ARTICLES ."/" . $this->file1 : null;
    }

    /**
     * @return string
     * @Groups({"visitor:read"})
     */
    public function getFile2File(): ?string
    {
        return $this->file2 ? "/" . self::FOLDER_ARTICLES ."/" . $this->file2 : null;
    }

    /**
     * @return string
     * @Groups({"visitor:read"})
     */
    public function getFile3File(): ?string
    {
        return $this->file3 ? "/" . self::FOLDER_ARTICLES ."/" . $this->file3 : null;
    }
}
