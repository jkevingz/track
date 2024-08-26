<?php

namespace App\DataFixtures;

use App\Entity\Artist as EntityArtist;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class Artist extends Fixture
{
    public function load(ObjectManager $manager): void
    {
        $names = [
            'Led Zeppelin',
            'The Beatles',
            'Pink Floyd',
            'Queen',
            'Metallica',
            'AC/DC',
            'The Rolling Stones',
            'Guns N\' Roses',
            'Nirvana',
            'The Who',
            'Black Sabbath',
        ];

        foreach ($names as $name) {
            $artist = new EntityArtist();
            $artist->setName($name);
            $manager->persist($artist);
        }

        $manager->flush();
    }
}
