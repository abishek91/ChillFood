# -*- coding: utf-8 -*-
# Generated by Django 1.10.3 on 2016-11-20 00:41
from __future__ import unicode_literals

import datetime
from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('ChillFood', '0018_notification_date_time'),
    ]

    operations = [
        migrations.CreateModel(
            name='Guest',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('status', models.IntegerField(blank=True, default=0)),
                ('token', models.CharField(max_length=200)),
            ],
        ),
        migrations.CreateModel(
            name='Party',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=200)),
                ('date', models.DateField(default=datetime.date.today)),
                ('guests', models.ManyToManyField(related_name='my_invitations', through='ChillFood.Guest', to=settings.AUTH_USER_MODEL)),
                ('host', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='parties', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.AlterField(
            model_name='recipe',
            name='category_set',
            field=models.ManyToManyField(related_name='recipes', to='ChillFood.Category'),
        ),
        migrations.AlterField(
            model_name='recipe',
            name='cuisine_set',
            field=models.ManyToManyField(related_name='recipes', to='ChillFood.Cuisine'),
        ),
        migrations.AlterField(
            model_name='recipe',
            name='equipment_set',
            field=models.ManyToManyField(related_name='recipes', to='ChillFood.Equipment'),
        ),
        migrations.AddField(
            model_name='party',
            name='recipe',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='ChillFood.Recipe'),
        ),
        migrations.AddField(
            model_name='guest',
            name='party',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='ChillFood.Party'),
        ),
        migrations.AddField(
            model_name='guest',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
    ]
