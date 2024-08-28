<?php

namespace App\Controller;

use App\Entity\Track;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Attribute\AsController;
use Symfony\Component\String\Slugger\SluggerInterface;

#[AsController]
class UploadTrackFile extends AbstractController
{
    public function __invoke(
        Track $track,
        Request $request,
        SluggerInterface $slugger,
        #[Autowire('%kernel.project_dir%/public' . Track::UPLOAD_FOLDER)] string $directory
    ): Track
    {
        $file = $request->files->get('file');
        if (!$file) {
            return $track;
        }

        $originalFilename = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
        $safeFilename = $slugger->slug($originalFilename);
        $newFilename = $safeFilename.'-'.uniqid().'.'.$file->guessExtension();


        $file->move($directory, $newFilename);

        // updates the 'brochureFilename' property to store the PDF file name
        // instead of its contents
        $track->setTrackPath($newFilename);

        return $track;
    }
}
