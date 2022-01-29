<?php

namespace App\Service\Data\Blog;

use App\Entity\Blog\BoArticle;
use App\Entity\Blog\BoCategory;
use App\Service\Data\DataConstructor;
use Exception;

class DataBlog extends DataConstructor
{
    public function setDataCategory(BoCategory $obj, $data): BoCategory
    {
        return ($obj)
            ->setSlug($this->sanitizeData->slugString($data->name))
            ->setName(trim($data->name))
        ;
    }

    /**
     * @throws Exception
     */
    public function setDataArticle(BoArticle $obj, $data): BoArticle
    {
        $category = $this->em->getRepository(BoCategory::class)->find($data->category);
        if(!$category){
            throw new Exception("Catégorie introuvable.");
        }

        return ($obj)
            ->setSlug($this->sanitizeData->slugString($data->title))
            ->setTitle($this->sanitizeData->trimData($data->title))
            ->setIntroduction($this->sanitizeData->trimData($data->introduction->html))
            ->setContent($this->sanitizeData->trimData($data->content->html))
            ->setCategory($category)
            ->setVisibleBy((int) $data->visibleBy)
        ;
    }
}