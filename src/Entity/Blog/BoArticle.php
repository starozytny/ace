<?php

namespace App\Entity\Blog;

use App\Repository\Blog\BoArticleRepository;
use Carbon\Carbon;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use Symfony\Component\Serializer\Annotation\Groups;

/**
 * @ORM\Entity(repositoryClass=BoArticleRepository::class)
 * @UniqueEntity(fields={"title"})
 * @UniqueEntity(fields={"slug"})
 */
class BoArticle
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     * @Groups({"admin:read", "admin:write"})
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"admin:read", "admin:write"})
     */
    private $title;

    /**
     * @ORM\Column(type="datetime")
     */
    private $createdAt;

    /**
     * @ORM\Column(type="datetime", nullable=true)
     * @Groups({"admin:write"})
     */
    private $updatedAt;

    /**
     * @ORM\Column(type="text", nullable=true)
     * @Groups({"admin:read", "admin:write"})
     */
    private $introduction;

    /**
     * @ORM\Column(type="text", nullable=true)
     * @Groups({"admin:read", "admin:write"})
     */
    private $content;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     * @Groups({"admin:read", "admin:write"})
     */
    private $file;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"admin:read", "admin:write"})
     */
    private $slug;

    /**
     * @ORM\Column(type="boolean")
     *  @Groups({"admin:read"})
     */
    private $isPublished;

    /**
     * @ORM\ManyToOne(targetEntity=BoCategory::class, inversedBy="articles")
     * @ORM\JoinColumn(nullable=false)
     * @Groups({"admin:read"})
     */
    private $category;

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
     * @Groups({"admin:read"})
     */
    public function getCreateAtString(): ?string
    {
        if($this->createdAt == null){
            return null;
        }
        return date_format($this->createdAt, 'd/m/Y');
    }

    public function getUpdatedAt(): ?\DateTimeInterface
    {
        return $this->updatedAt;
    }

    public function setUpdatedAt(?\DateTimeInterface $updatedAt): self
    {
        $this->updatedAt = $updatedAt;

        return $this;
    }

    /**
     * How long ago an article was update.
     *
     * @Groups({"admin:read"})
     */
    public function getUpdatedAtAgo(): ?string
    {
        if($this->updatedAt == null){
            return null;
        }
        return Carbon::instance($this->updatedAt)->diffForHumans();
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

    public function setSlug(string $slug): self
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
}
