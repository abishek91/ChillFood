# -*- coding: utf-8 -*-
# Generated by Django 1.10.1 on 2016-10-30 07:47
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('ChillFood', '0017_auto_20161028_1900'),
    ]

    operations = [
        migrations.AlterField(
            model_name='category',
            name='name',
            field=models.CharField(choices=[('veg', 'veg'), ('vegan', 'vegan'), ('Non-veg', 'Non-veg')], max_length=200),
        ),
    ]
