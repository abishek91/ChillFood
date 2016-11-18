# -*- coding: utf-8 -*-
# Generated by Django 1.10.3 on 2016-11-18 00:01
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('ChillFood', '0011_auto_20161117_1835'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='category',
            name='recipes',
        ),
        migrations.RemoveField(
            model_name='cuisine',
            name='recipes',
        ),
        migrations.RemoveField(
            model_name='equipment',
            name='recipes',
        ),
        migrations.RemoveField(
            model_name='preferences',
            name='appliances',
        ),
        migrations.RemoveField(
            model_name='preferences',
            name='categories',
        ),
        migrations.RemoveField(
            model_name='preferences',
            name='cuisines',
        ),
        migrations.AddField(
            model_name='preferences',
            name='category',
            field=models.ManyToManyField(to='ChillFood.Category'),
        ),
        migrations.AddField(
            model_name='preferences',
            name='cuisine',
            field=models.ManyToManyField(to='ChillFood.Cuisine'),
        ),
        migrations.AddField(
            model_name='preferences',
            name='equipment',
            field=models.ManyToManyField(to='ChillFood.Equipment'),
        ),
        migrations.AddField(
            model_name='recipe',
            name='category',
            field=models.ManyToManyField(to='ChillFood.Category'),
        ),
        migrations.AddField(
            model_name='recipe',
            name='cuisine',
            field=models.ManyToManyField(to='ChillFood.Cuisine'),
        ),
        migrations.AddField(
            model_name='recipe',
            name='equipment',
            field=models.ManyToManyField(to='ChillFood.Equipment'),
        ),
        migrations.AlterField(
            model_name='preferences',
            name='sort_by',
            field=models.IntegerField(choices=[(1, 'Views'), (2, 'Tastiness'), (3, 'Calories'), (4, 'Tastiness'), (5, 'Time')], default=1),
        ),
    ]
