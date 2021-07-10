<?php

namespace App\Entity;

use App\Repository\SettingsRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * @ORM\Entity(repositoryClass=SettingsRepository::class)
 */
class Settings
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
     * @Assert\NotBlank()
     */
    private $websiteName;

    /**
     * @ORM\Column(type="string", length=255)
     * @Assert\NotBlank()
     */
    private $urlHomepage;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"visitor:read"})
     * @Assert\NotBlank()
     */
    private $emailGlobal;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"visitor:read"})
     * @Assert\NotBlank()
     */
    private $emailContact;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups({"visitor:read"})
     * @Assert\NotBlank()
     */
    private $emailRgpd;

    /**
     * @ORM\Column(type="text")
     * @Groups({"visitor:read"})
     * @Assert\NotBlank()
     */
    private $logoMail;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getWebsiteName(): ?string
    {
        return $this->websiteName;
    }

    public function setWebsiteName(string $websiteName): self
    {
        $this->websiteName = $websiteName;

        return $this;
    }

    public function getUrlHomepage(): ?string
    {
        return $this->urlHomepage;
    }

    public function setUrlHomepage(string $urlHomepage): self
    {
        $this->urlHomepage = $urlHomepage;

        return $this;
    }

    public function getEmailGlobal(): ?string
    {
        return $this->emailGlobal;
    }

    public function setEmailGlobal(string $emailGlobal): self
    {
        $this->emailGlobal = $emailGlobal;

        return $this;
    }

    public function getEmailContact(): ?string
    {
        return $this->emailContact;
    }

    public function setEmailContact(string $emailContact): self
    {
        $this->emailContact = $emailContact;

        return $this;
    }

    public function getEmailRgpd(): ?string
    {
        return $this->emailRgpd;
    }

    public function setEmailRgpd(string $emailRgpd): self
    {
        $this->emailRgpd = $emailRgpd;

        return $this;
    }

    public function getLogoMail(): ?string
    {
        return $this->logoMail;
    }

    public function setLogoMail(string $logoMail): self
    {
        $this->logoMail = $logoMail;

        return $this;
    }
}
