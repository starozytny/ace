<?php


namespace App\Service;


use Exception;
use Symfony\Component\HttpFoundation\Exception\BadRequestException;
use Symfony\Component\String\AbstractUnicodeString;
use Symfony\Component\String\Slugger\AsciiSlugger;

class SanitizeData
{
    public function fullSanitize($value, $return = null): ?AbstractUnicodeString
    {
        if($value != null){
            $value = trim($value);
            $value = mb_strtolower($value);
            $value = str_replace(" ", "", $value);

            return $this->slugString($value);
        }

        return $return;
    }

    public function slugString($data, $return = null): ?AbstractUnicodeString
    {
        if($data != null){
            $slug = new AsciiSlugger();
            return $slug->slug($data);
        }

        return $return;
    }

    public function updateValue($value, $newValue)
    {
        if($newValue != "" && $newValue != null){
            return $newValue;
        }

        return $value;
    }

    public function createDateFromString($date, $timezone="Europe/Paris", $return = null): \DateTime
    {
        if($date != null){
            try {
                $date = new \DateTime(str_replace('/', '-', $date));
            } catch (Exception $e) {
                throw new BadRequestException("Erreur dans la création de la date.");
            }
            $date->setTimezone(new \DateTimeZone($timezone));

            return $date;
        }

        return $return;
    }

    public function sanitizeString($value, $return = null): ?string
    {
        if($value != "" && $value != null){
            $value = trim($value);
            return htmlspecialchars($value);
        }

        return $return;
    }


    public function trimData($value, $return = null): ?string
    {
        if($value != "" && $value != null){
            return trim($value);
        }

        return $return;
    }

    /**
     * @throws Exception
     */
    public function createDate($date, $timezone="Europe/Paris", $return = null): ?\DateTime
    {
        if($date == null || $date == ""){
            return $return;
        }
        $date = new \DateTime($date);
        $date->setTimezone(new \DateTimeZone($timezone));

        return $date;
    }

    public function setToFloat($value, $return = null): ?float
    {
        return ($value == "" || $value == null) ? $return : (float) $value;
    }

    public function setToInteger($value, $return = null): ?int
    {
        return ($value == "" || $value == null) ? $return : (int) $value;
    }

    public function setToTrillean($value): int
    {
        return ($value != 99 && $value != "") ? (int) $value == 1 : 99;
    }

    public function setToZeroIfEmpty($value): int
    {
        return ($value == "" || $value == null) ? 0 : (int) $value;
    }
}