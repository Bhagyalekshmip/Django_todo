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
    
    if not title or not due_date:
        return Response({'error': 'Title  and Due_date required.'}, status=status.HTTP_400_BAD_REQUEST)
    
    tasks = task.objects.create(title=title, due_date=due_date, user=request.user)
    return Response({'message': 'Task created successfully.', 'task_id': tasks.id}, status=status.HTTP_201_CREATED)


# api to get all based on authenticated user
from rest_framework.pagination import PageNumberPagination

class TaskPagination(PageNumberPagination):
    page_size = 5  # or 10
    page_size_query_param = 'page_size'

@api_view(['GET'])
@permission_classes((IsAuthenticated,))
def get_tasks(request):
    status_param = request.query_params.get('status')  # 'completed' or 'pending'
    tasks = task.objects.filter(user=request.user).order_by('due_date')
    if status_param == 'completed':
        tasks = tasks.filter(completed=True)
    elif status_param == 'pending':
        tasks = tasks.filter(completed=False)
    paginator = TaskPagination()
    result_page = paginator.paginate_queryset(tasks, request)
    tasks_data = [{'id': t.id, 'title': t.title, 'due_date': t.due_date,  'completed': t.completed} for t in result_page]
    return paginator.get_paginated_response(tasks_data)


# Api to get specific task on clcking edit options()
@api_view(['GET'])
@permission_classes((IsAuthenticated,))
def update_task(request, task_id):
    try:
        tasks = task.objects.get(id=task_id, user=request.user)
        return Response({'id': tasks.id, 'title': tasks.title, 'due_date': tasks.due_date}, status=status.HTTP_200_OK)
    except task.DoesNotExist:
        return Response({'error': 'Task not found.'}, status=status.HTTP_404_NOT_FOUND)
  
    
# put api of task
@api_view(['PUT'])
@permission_classes((IsAuthenticated,)) 
def update_task(request, task_id):
    try:
        tasks = task.objects.get(id=task_id, user=request.user)
        title = request.data.get('title')
        due_date = request.data.get('due_date')
        
        if not title or not due_date:
            return Response({'error': 'Title and Due date are required.'}, status=status.HTTP_400_BAD_REQUEST)
        
        tasks.title = title
        tasks.due_date = due_date
        tasks.save()
        
        return Response({'message': 'Task updated successfully.'}, status=status.HTTP_200_OK)
    except task.DoesNotExist:
        return Response({'error': 'Task not found.'}, status=status.HTTP_404_NOT_FOUND)
    
    
# Api to delete task
@api_view(['DELETE'])
@permission_classes((IsAuthenticated,))
def delete_task(request, task_id):
    try:
        tasks = task.objects.get(id=task_id, user=request.user)
        tasks.delete()
        return Response({'message': 'Task deleted successfully.'}, status=status.HTTP_204_NO_CONTENT)
    except task.DoesNotExist:
        return Response({'error': 'Task not found.'}, status=status.HTTP_404_NOT_FOUND)
    
# Api for search for task of specific user

@api_view(['GET'])
@permission_classes((IsAuthenticated,))
def search_tasks(request):
    query = request.query_params.get('query', '')
    tasks = task.objects.filter(user=request.user, title__icontains=query).order_by('due_date')
    tasks_data = [{'id': t.id, 'title': t.title, 'due_date': t.due_date} for t in tasks]
    return Response(tasks_data, status=status.HTTP_200_OK)

# ------------------------------------------------------------------------------------
# ---------------API TO MARK COMPLETE--------------------------------------------------

@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def toggle_task_completion(request,id):
    try:
        todo = task.objects.get(id=id, user=request.user)
        todo.completed = not todo.completed  # Toggle status
        todo.save()
        return Response({'id': todo.id, 'completed': todo.completed}, status=200)
    except task.DoesNotExist:
        return Response({'error': 'Task not found'}, status=404)