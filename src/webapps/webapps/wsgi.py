"""
WSGI config for webapps project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/1.10/howto/deployment/wsgi/
"""

import os

from django.core.wsgi import get_wsgi_application

env = os.environ['ENV'] if 'ENV' in os.environ else 'dev'

if env != 'prod':
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "webapps.settings")
else:
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "webapps.settings-dev")

application = get_wsgi_application()
