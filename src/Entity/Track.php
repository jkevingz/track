<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiProperty;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Put;
use App\Controller\UploadTrackFile;
use App\Repository\TrackRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Context;
use Symfony\Component\Serializer\Attribute\Groups;
use Symfony\Component\Serializer\Normalizer\DateTimeNormalizer;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: TrackRepository::class)]
#[ApiResource(
    normalizationContext: ['groups' => ['track']],
    operations: [
        new GetCollection(paginationEnabled: false),
        new Post,
        new Put,
        new Delete,
        new Post(
            name: 'upload', 
            uriTemplate: '/tracks/{id}/upload', 
            controller: UploadTrackFile::class,
            inputFormats: ['multipart' => ['multipart/form-data']],
        ),
    ]
)]
class Track
{
    const UPLOAD_FOLDER = '/uploads/tracks';

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups('track')]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups('track')]
    #[Assert\NotBlank]
    #[Assert\Type('string')]
    #[Assert\Length(min: 2, max: 255)]
    private ?string $title = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups('track')]
    #[Assert\NotBlank]
    #[Assert\Type('string')]
    #[Assert\Length(min: 2, max: 255)]
    #[Assert\Url]
    private ?string $isrc = null;

    #[ORM\Column(type: Types::DATE_MUTABLE, nullable: true)]
    #[Context(normalizationContext: [DateTimeNormalizer::FORMAT_KEY => 'Y-m-d'])]
    #[Groups('track')]
    private ?\DateTimeInterface $release_date = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[ApiProperty(writable: false)]
    private ?string $track_path = null;

    /**
     * @var Collection<int, Artist>
     */
    #[ORM\ManyToMany(targetEntity: Artist::class, inversedBy: 'tracks', fetch: 'EAGER')]
    #[Groups('track')]
    private Collection $artists;

    public function __construct()
    {
        $this->artists = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getTitle(): ?string
    {
        return $this->title;
    }

    public function setTitle(?string $title): static
    {
        $this->title = $title;

        return $this;
    }

    public function getIsrc(): ?string
    {
        return $this->isrc;
    }

    public function setIsrc(?string $isrc): static
    {
        $this->isrc = $isrc;

        return $this;
    }

    public function getReleaseDate(): ?\DateTimeInterface
    {
        return $this->release_date;
    }

    public function setReleaseDate(?\DateTimeInterface $release_date): static
    {
        $this->release_date = $release_date;

        return $this;
    }

    public function getTrackPath(): ?string
    {
        return $this->track_path;
    }

    public function setTrackPath(?string $track_path): static
    {
        $this->track_path = $track_path;

        return $this;
    }

    /**
     * @return Collection<int, Artist>
     */
    public function getArtists(): Collection
    {
        return $this->artists;
    }

    public function addArtist(Artist $artist): static
    {
        if (!$this->artists->contains($artist)) {
            $this->artists->add($artist);
        }

        return $this;
    }

    public function removeArtist(Artist $artist): static
    {
        $this->artists->removeElement($artist);

        return $this;
    }

    #[Groups('track')]
    public function getUrl()
    {
        if (empty($this->track_path)) {
            return '';
        }

        return static::UPLOAD_FOLDER . $this->track_path;
    }
}
