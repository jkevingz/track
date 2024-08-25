<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class AppController extends AbstractController
{
    #[Route('/{path<^(?!api).*>}', name: 'app.index', methods: 'GET')]
    public function index(): Response
    {
        return $this->render('app/index.html.twig');
    }
}
