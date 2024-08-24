<?php

namespace App\DataFixtures;

use App\Entity\User as EntityUser;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class User extends Fixture
{
    public function load(ObjectManager $manager): void
    {
        $user = new EntityUser();
        $user->setEmail('email@email.com');
        $user->setPassword('$2y$13$l1sgTG4Eqd2BmyJu.t1XG.7WPMTyf86bT2nJ03CuWBr1.Ifj8uaii'); // password

        $manager->persist($user);

        $manager->flush();
    }
}
