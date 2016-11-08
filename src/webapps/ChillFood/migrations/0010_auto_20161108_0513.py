# -*- coding: utf-8 -*-
# Generated by Django 1.10.1 on 2016-11-08 05:13
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('ChillFood', '0009_auto_20161107_0007'),
    ]

    operations = [
        migrations.AlterField(
            model_name='recipeingredient',
            name='recipe',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='ingredients', to='ChillFood.Recipe'),
        ),
        migrations.AlterField(
            model_name='step',
            name='recipe',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='steps', to='ChillFood.Recipe'),
        ),
    ]
