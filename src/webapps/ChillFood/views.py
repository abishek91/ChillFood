from django.shortcuts import render

from ChillFood.models import *
from django.contrib.auth.decorators import login_required
from django.contrib.staticfiles.templatetags.staticfiles import static
from django.shortcuts import get_object_or_404, redirect, reverse
from mimetypes import guess_type
from django.http import HttpResponse, Http404
from django.http import JsonResponse
from django.contrib.auth.tokens import default_token_generator
from .forms import *
from django.core.mail import send_mail
import boto3, os, json

from django.conf import settings

def index(request):
    context = {}
    return render(request, 'index.html',context)

def recipe_image(request, recipe_id):
    recipe = get_object_or_404(Recipe, id=recipe_id)

    if recipe.remote_pic:
        return redirect(recipe.remote_pic)
    
    if recipe.pic:
        image = recipe.pic
        content_type = guess_type(image.name)

    else:
        url = settings.BASE_DIR2 + '/ChillFood' + static('images/food.jpg')
        with open(url, "rb") as empty_recipe:
            image = empty_recipe.read()
            content_type = 'image/jpg'

    return HttpResponse(image, content_type=content_type)   

def profile_image(request, user_id):
    user = get_object_or_404(User, id=user_id)

    if user.photo:
        return redirect(user.photo);
    else:
        url = settings.BASE_DIR2 + '/ChillFood' + static('images/empty_profile.png')
        with open(url, "rb") as empty_profie:
            image = empty_profie.read()
            content_type = 'image/png'

    return HttpResponse(image, content_type=content_type)   

def step_image(request, step_id):
    
    step = get_object_or_404(Step, id=step_id)

    if step.picture:
        image = step.picture.name
        content_type = guess_type(image)

    # else:
    #   url = settings.BASE_DIR + '/ChillFood' + static('images/empty_profile.gif')
    #   with open(url, "rb") as empty_recipe:
    #       image = empty_recipe.read()
    #       content_type = 'image/gif'

    return HttpResponse(image, content_type=content_type)   

@login_required
def recipe_detail(request, recipe_id):
    recipe = get_object_or_404(Recipe, id=recipe_id)

    context = {'recipe': recipe, 'user_id': request.user.id}
    return render(request, 'recipe_detail.html', context)

def recipe_detail_json(request, recipe_id):
    recipe = get_object_or_404(Recipe, id=recipe_id)
    recipe.views += 1
    recipe.save()
    return JsonResponse(recipe.to_json_full(request.user))

@login_required
def add_rating(request, recipe_id):
    recipe = Recipe.objects.get(id=recipe_id)

    rating,created = Rating.objects.get_or_create(recipe=recipe, user=request.user)

    tastiness = rating.tastiness
    difficulty = rating.difficulty
    notification_text = request.user.get_full_name() + " has added a";
    appender = ""

    if 'tastiness' in request.POST and request.POST['tastiness']:
        tastiness = request.POST['tastiness']
        notification_text += appender + " tastiness rating of " + tastiness;
        appender = " and a "
    if 'difficulty' in request.POST and request.POST['difficulty']:
        difficulty = request.POST['difficulty']
        notification_text +=  appender + " difficulty rating of " + difficulty;
    if not tastiness and not difficulty:
        return JsonResponse({"error":"Invalid parameters"})

        

    rating.tastiness = tastiness
    rating.difficulty = difficulty
    rating.save()

    notification_text += " to your recipe " + recipe.title;
    notification = Notification(user=recipe.cook, text=notification_text,read=False,
                                link=reverse('recipe_detail', kwargs={'recipe_id':recipe.id}) + '#/recipe/' + str(recipe.id))
    notification.save()

    return JsonResponse({"recipe":recipe.to_json_full(request.user)})

@login_required
def add_comment(request, recipe_id):
    recipe = Recipe.objects.get(id=recipe_id)
    if 'text' in request.POST and request.POST['text']:
        text = request.POST['text']
        new_comment = Comment( recipe=recipe, user=request.user, text=text)
        new_comment.save()
        notification_text = request.user.get_full_name() + " has added a comment to your recipe " + recipe.title;

        notification = Notification(user=recipe.cook, text=notification_text,read=False,
                                    link=reverse('recipe_detail', kwargs={'recipe_id':recipe.id}) + '#/recipe/' + str(recipe.id))
        notification.save()
        print(recipe.title)
        return JsonResponse({"recipe":recipe.to_json_full(request.user)})
    return JsonResponse({"error":"Invalid parameters"})

def app(request):
    return render(request, 'app.html')

@login_required
def profile(request, user_id):
    user = get_object_or_404(User, id=user_id)
    context = {"profile": user}
    return render(request, 'profile.html',context)

@login_required
def follow(request, user_id):
    followee = User.objects.get(id=user_id)
    follower = User.objects.get(id=request.user.id)
    follower.following.add(followee)
    notification_text = request.user.get_full_name() + " has followed you ";
    notification = Notification(user=followee, text=notification_text,read=False,
                                    link='#/profile/' + str(follower.id))
    notification.save()
    return JsonResponse({"user":followee.to_json()})

@login_required
def unfollow(request, user_id):
    followee = User.objects.get(id=user_id)
    follower = User.objects.get(id=request.user.id)
    
    follower.following.remove(followee)
    return JsonResponse({"user":followee.to_json()})

@login_required
def profile_json(request, user_id):
    user = get_object_or_404(User, id=user_id)
    return JsonResponse({"user":user.to_json()})

def display_users(request, user_id):
    return render(request, 'root.html')

@login_required
def notifications(request):
    
    return JsonResponse({"notifications": serializers.serialize("json", Notification.objects.filter(user=request.user).order_by('-id'))})

@login_required
def readNotifications(request):
    unread = Notification.objects.filter(read=False, user=request.user)
    for notification in unread:
        notification.read = True;
        notification.save()
    return notifications(request)

def party_confirm(request, party_id, user_id, token):
  guest = get_object_or_404(Guest, party_id = party_id, user_id = user_id)
  party = get_object_or_404(Party, id=party_id)
  recipe = party.recipe
  if len(guest.token) == 0:
    raise Http404("Invitation has already been answered.")

  [random_number,real_token] = guest.token.split(';')

  if token == real_token:
    guest.token = "";
    guest.status = 1;
    guest.save(); 

    notification_text = guest.user.get_full_name() + " has accepted your cooking party invite for recipe " + recipe.title
    notification = Notification(user=party.host, text=notification_text,read=False,link=None)
    notification.save()
    return render(request, 'party_confirm.html', {})
  else:
    raise Http404("Token does not exist")

def party_decline(request, party_id, user_id, token):
  guest = get_object_or_404(Guest, party_id = party_id, user_id = user_id)
  party = get_object_or_404(Party, id=party_id)
  recipe = party.recipe
  if not guest.token:
    raise Http404("Token does not exist")

  [random_number,real_token] = guest.token.split(';')
  
  if token == real_token:
    guest.token = "";
    guest.status = -1;
    guest.save(); 
    notification_text = guest.user.get_full_name() + " has declined your cooking party invite for recipe " + recipe.title
    notification = Notification(user=party.host, text=notification_text,read=False,link=None)
    notification.save()
    return render(request, 'party_decline.html', {})
  else:
    raise Http404("Token does not exist")

def send_authentication_email(request, user):
    context = {}
    token = default_token_generator.make_token(user)
    email_body = """
    Please click the link below to change your chillfood password

    http://%s%s
    """ % (request.get_host(), reverse('change_password', args=(user.id, token)))
    send_mail(subject="Password reset for ChillFood.com",
              message=email_body,
              from_email="chillfood@chillfood.com",
              recipient_list=[user.username])
    context['email'] = user.username
    return render(request, 'needs_confirmation.html', context)


def forgot_password(request):
    if request.method == 'GET':
        context = {}
        context['form'] = ForgotPasswordForm()
        return render(request, 'forgot_password.html', context)
    if 'email' in request.POST and request.POST['email']:
        email = request.POST['email']
        user = get_object_or_404(User, username=email)
        return send_authentication_email(request, user)
    return JsonResponse({"error":"Invalid parameters"})

def change_password(request, user_id, token):
    context = {}
    context['user_id'] = user_id
    context['token'] = token
    user = get_object_or_404(User, id=user_id)
    if request.method == 'GET':
        if default_token_generator.check_token(user, token):
            context['form'] = ChangePasswordForm()
            
            return render(request, 'change_password.html', context)
        else:
            raise Http404

    form = ChangePasswordForm(request.POST)
    errors = [];
    context['errors'] = errors
    context['form'] = form

    if not form.is_valid():
        errors.append('form invalid')
        return render(request, 'change_password.html', context)

    if not user.check_password(request.POST['old_password']):
        errors.append('Old password is incorrect')
        return render(request, 'change_password.html', context)
    user.set_password(request.POST['password1'])
    user.save()

    return redirect(reverse('index'))


def sign_s3(request):
    # S3_BUCKET = os.environ['AWS_STORAGE_BUCKET_NAME'] 
    S3_BUCKET = settings.AWS_STORAGE_BUCKET_NAME 

    file_name = request.GET.get('file_name')
    file_type = request.GET.get('file_type')
    s3 = boto3.client('s3')

    presigned_post = s3.generate_presigned_post(
    Bucket = S3_BUCKET,
    Key = file_name,
    Fields = {"acl": "public-read", "Content-Type": file_type},
    Conditions = [
      {"acl": "public-read"},
      {"Content-Type": file_type}
    ],
    ExpiresIn = 3600
    )
    
    return JsonResponse({
        'data': presigned_post,
        'url': 'https://%s.s3.amazonaws.com/%s' % (S3_BUCKET, file_name)
    },safe=False)   

def send_authentication_email(user, request):
    context = {}
    token = default_token_generator.make_token(user)
    email_body = """
    Welcome to grumblr. Please click the below link to verify your email and activate your account

    http://%s%s
    """ % (request.get_host(), reverse('confirm', args=(user.username, token)))
    person = Person.objects.get(user=user)
    send_mail(subject="Verify your email address for grumblr",
              message=email_body,
              from_email="asanand@andrew.cmu.edu",
              recipient_list=[person.email])
    context['email'] = person.email
    return render(request, 'needs_confirmation.html', context)