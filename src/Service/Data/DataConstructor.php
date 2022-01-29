<?php

namespace App\Service\Data;

use App\Service\SanitizeData;
use App\Service\ValidatorService;
use Doctrine\ORM\EntityManagerInterface;

class DataConstructor
{
    protected $em;
    protected $validator;
    protected $sanitizeData;

    public function __construct(EntityManagerInterface $entityManager, ValidatorService $validator, SanitizeData $sanitizeData)
    {
        $this->em = $entityManager;
        $this->validator = $validator;
        $this->sanitizeData = $sanitizeData;
    }
}