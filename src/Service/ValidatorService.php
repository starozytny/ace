<?php


namespace App\Service;


use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Validator\Validator\ValidatorInterface;

class ValidatorService
{
    private $validator;

    public function __construct(ValidatorInterface $validator)
    {
        $this->validator = $validator;
    }

    public function validate($object)
    {
        $errors = $this->validator->validate($object);

        if (count($errors) > 0) {

            $errs = [];
            foreach ($errors as $error) {
                $errs[] = [
                    'name' => $error->getPropertyPath(),
                    'message' => $error->getMessage()
                ];
            }

            return $errs;
        }

        return true;
    }

    public function validateCustom($data)
    {
        $errors = [];
        foreach($data as $elem){
            $validate = $this->switchCase($elem);
            if($validate != 1){
                array_push($errors, [
                    'name' => $elem['name'],
                    'message' => $validate
                ]);
            }
        }

        if (count($errors) > 0) {
            return $errors;
        }

        return true;
    }

    private function switchCase($elem)
    {
        switch ($elem['type']){
            case 'array':
                return $this->validateArray($elem['value']);
            case 'uniqueLength':
                return $this->validateUniqueLength($elem['value'], $elem['size']);
            case 'length':
                return $this->validateLength($elem['value'], $elem['min'], $elem['max']);
            default:
                return $this->validateText($elem['value']);
        }
    }

    private function validateArray($value)
    {
        if(count($value) <= 0){
            return 'Ce champ doit être renseigné.';
        }

        return 1;
    }

    private function validateUniqueLength($value, $size)
    {
        if(strlen($value) !== $size){
            return 'Ce champ doit contenir ' . $size . ' caractères.';
        }

        return 1;
    }

    private function validateLength($value, $min, $max)
    {
        if(strlen($value) < $min || strlen($value) > $max){
            return 'Ce champ doit contenir entre ' . ($min + 1) . ' et ' . $max . ' caractères.';
        }

        return 1;
    }

    private function validateText($value)
    {
        if($value == ""){
            return 'Ce champ doit être renseigné';
        }

        return 1;
    }
}