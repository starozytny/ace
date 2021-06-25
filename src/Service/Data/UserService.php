<?php


namespace App\Service\Data;


use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;

class UserService
{
    private $em;

    public function __construct(EntityManagerInterface $em)
    {
        $this->em = $em;
    }

    public function getList($order)
    {
        return $this->em->getRepository(User::class)->findBy([], ['lastname' => $order]);
    }
}