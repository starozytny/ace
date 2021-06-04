<?php


namespace App\Service;


use Symfony\Component\HttpFoundation\Exception\BadRequestException;
use Symfony\Component\String\AbstractUnicodeString;
use Symfony\Component\String\Slugger\AsciiSlugger;

class SanitizeData
{
    public function fullSanitize($value): AbstractUnicodeString
    {
        $value = trim($value);
        $value = mb_strtolower($value);
        $value = str_replace(" ", "", $value);

        return $this->reformatCara($value);
    }

    public function reformatCara($data): AbstractUnicodeString
    {
        $slug = new AsciiSlugger();
        return $slug->slug($data);
    }

    public function updateValue($value, $newValue)
    {
        if($newValue != "" && $newValue != null){
            return $newValue;
        }

        return $value;
    }

    public function createDateFromString($date, $timezone="Europe/Paris"): \DateTime
    {
        try {
            $date = new \DateTime($date);
        } catch (\Exception $e) {
            throw new BadRequestException("Erreur dans la création de la date.");
        }
        $date->setTimezone(new \DateTimeZone($timezone));

        return $date;
    }

    public function sanitizeString($value): ?string
    {
        if($value != "" && $value != null){
            $value = trim($value);
            return htmlspecialchars($value);
        }

        return null;
    }
}