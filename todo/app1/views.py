from django.shortcuts import render
from rest_framework.decorators import api_view,permission_classes
from rest_framework.permissions import IsAuthenticated,AllowAny
from rest_framework.response import Response 
from django.contrib.auth.models import User
from app1.models import task
from rest_framework import status
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate


@api_view(['POST'])
@permission_classes((AllowAny,))
def signup(request):
    username = request.data.get('username')
    password = request.data.get('password')
    email = request.data.get('email')
    print(username, password, email)
    if not username or not password or not email:
        return Response({'error': 'All fields are required.'}, status=status.HTTP_400_BAD_REQUEST)
    
    if User.objects.filter(username=username).exists():
        return Response({'error': 'Username already exists.'}, status=status.HTTP_400_BAD_REQUEST)
    
    user = User.objects.create_user(username=username, password=password, email=email)
    user.save()
    return Response({'message': 'User created successfully.'}, status=201)
    

#---------------LOGIN-------------------from rest_framework.authtoken.models import Token


@api_view(["POST"])
@permission_classes((AllowAny,))
def login(request):
    username = request.data.get("username")
    password = request.data.get("password")
    if username is None or password is None:
        return Response({'error': 'Please provide both username and password'},
                        status=status.HTTP_400_BAD_REQUEST)
    user = authenticate(username=username, password=password)
    if not user:
        return Response({'error': 'Invalid Credentials'},
                       status=status.HTTP_400_BAD_REQUEST)
    token, _ = Token.objects.get_or_create(user=user)
    return Response({'token': token.key},status=status.HTTP_200_OK)

# #---------------ADD TASK-------------------

@api_view(['POST'])
@permission_classes((IsAuthenticated,))
def add_task(request):
    title = request.data.get('title')
    due_date = request.data.get('due_date')
    print(title, due_date)
    
    if not title or due_date:
        return Response({'error': 'Title  and Due_date required.'}, status=status.HTTP_400_BAD_REQUEST)
    
    tasks = task.objects.create(title=title, due_date=due_date, user=request.user)
    return Response({'message': 'Task created successfully.', 'task_id': tasks.id}, status=status.HTTP_201_CREATED)