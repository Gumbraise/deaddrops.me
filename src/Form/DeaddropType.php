<?php

namespace App\Form;

use App\Entity\Deaddrop;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class DeaddropType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('name')
            ->add('size')
            ->add('createdAt')
            ->add('about')
            ->add('longitude')
            ->add('latitude')
            ->add('status')
            ->add('isExternalReferrer')
            ->add('updatedAt')
            ->add('address')
            ->add('city')
            ->add('country')
            ->add('deaddropId')
            ->add('author')
        ;
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => Deaddrop::class,
        ]);
    }
}
