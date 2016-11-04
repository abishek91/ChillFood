# Django Libraries
import datetime
from django.core import serializers
from django.http import JsonResponse,HttpResponseBadRequest
from django.http import HttpResponse
from django.contrib.auth.decorators import login_required
from django.db.models import Avg
import re

# Local Libraries
from .models import *

# if sys.stdout.encoding != 'cp850':
#   sys.stdout = codecs.getwriter('cp850')(sys.stdout.buffer, 'strict')
# if sys.stderr.encoding != 'cp850':
#   sys.stderr = codecs.getwriter('cp850')(sys.stderr.buffer, 'strict')

@login_required
def recipes(request):
    v_from = request.GET.get('from', '0')

    if re.match(r"\d",v_from):
        v_from = int(v_from) 
    else:
        #TODO: Raise a 400 malformed query error
        v_from = 0

    v_next = None
    # post_id = request.GET.get('to', 0)

    limit = 6

    #TODO: Look for a way not to load the whole table
    recipes = Recipe.objects.filter().order_by('-views')
    #TODO: More elaborate query for homepage
    ##.annotate(rating=Avg('comment__tastiness'))\
    data = recipes[v_from:v_from+limit]
    
    if (len(recipes[v_from+limit:])):
        v_next = '%s?from=%d' % (request.path,v_from+limit)

    result = {
        "data": list(map(lambda x: x.to_json(), data)),
        "next": v_next,
    }

    return JsonResponse(result,safe=False)
    
