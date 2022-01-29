<?php

namespace App\Service;

class Expiration
{
    private function getInterval($a, $b)
    {
        return date_diff($a, $b);
    }

    public function isExpiredBySecondes($a, $now, $value = 0): bool
    {
        $interval = $this->getInterval($a, $now);
        if($interval->s > $value || $interval->i > 0 || $interval->h > 0 || $interval->d > 0 || $interval->m > 0 || $interval->y > 0){
            return true;
        }

        return false;
    }

    public function isExpiredByMinutes($a, $now, $value = 0): bool
    {
        $interval = $this->getInterval($a, $now);
        if($interval->i > $value || $interval->h > 0 || $interval->d > 0 || $interval->m > 0 || $interval->y > 0){
            return true;
        }

        return false;
    }

    public function isExpiredByHours($a, $now, $value = 0): bool
    {
        $interval = $this->getInterval($a, $now);
        if($interval->h > $value || $interval->d > 0 || $interval->m > 0 || $interval->y > 0){
            return true;
        }

        return false;
    }

    public function isExpiredByDays($a, $now, $value = 0): bool
    {
        $interval = $this->getInterval($a, $now);
        if($interval->d > $value || $interval->m > 0 || $interval->y > 0){
            return true;
        }

        return false;
    }

    public function isExpiredByMonths($a, $now, $value = 0): bool
    {
        $interval = $this->getInterval($a, $now);
        if($interval->m > $value || $interval->y > 0){
            return true;
        }

        return false;
    }

    public function isExpiredByYears($a, $now, $value = 0): bool
    {
        $interval = $this->getInterval($a, $now);
        if($interval->y > $value){
            return true;
        }

        return false;
    }
}