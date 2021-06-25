<?php


namespace App\Service;


use App\Entity\Notification;
use Doctrine\ORM\EntityManagerInterface;

class NotificationService
{
    private $em;

    public function __construct(EntityManagerInterface $em)
    {
        $this->em = $em;
    }

    public function createNotification($name, $icon, $user)
    {
        $obj = (new Notification())
            ->setName($name)
            ->setIcon($icon)
            ->setUser($user)
        ;

        $this->em->persist($obj);
        $this->em->flush();
    }
   
}