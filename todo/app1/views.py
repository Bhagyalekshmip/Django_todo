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
 # views.py

import csv, json
from django.http import HttpResponse
from io import StringIO
from django.db import connection
from .models import task

# Export as CSV
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def export_tasks_csv(request):
    tasks = task.objects.filter(user=request.user)
    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = 'attachment; filename=tasks.csv'
    
    writer = csv.writer(response)
    writer.writerow(['ID', 'Title', 'Due Date', 'Completed'])
    for t in tasks:
        writer.writerow([t.id, t.title, t.due_date, t.completed])
    return response

# Export as JSON
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def export_tasks_json(request):
    tasks = task.objects.filter(user=request.user)
    tasks_data = [{'id': t.id, 'title': t.title, 'due_date': str(t.due_date), 'completed': t.completed} for t in tasks]
    return Response(tasks_data, content_type='application/json')

# Export as Text
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def export_tasks_text(request):
    tasks = task.objects.filter(user=request.user)
    response = HttpResponse(content_type='text/plain')
    response['Content-Disposition'] = 'attachment; filename=tasks.txt'

    for t in tasks:
        response.write(f"ID: {t.id}, Title: {t.title}, Due: {t.due_date}, Completed: {t.completed}\n")
    return response

# Export as raw MySQL (basic example – returns SQL INSERTs)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def export_tasks_mysql(request):
    tasks = task.objects.filter(user=request.user)
    response = HttpResponse(content_type='text/plain')
    response['Content-Disposition'] = 'attachment; filename=tasks.sql'

    for t in tasks:
        sql = f"INSERT INTO app1_task (id, title, due_date, completed, user_id) VALUES ({t.id}, '{t.title}', '{t.due_date}', {int(t.completed)}, {t.user.id});\n"
        response.write(sql)
    return response

import pandas as pd
from rest_framework.parsers import MultiPartParser
from rest_framework.decorators import parser_classes
@parser_classes([MultiPartParser])
@api_view(['POST'])
@permission_classes([IsAuthenticated])

def import_tasks(request, doc=None):
    print("Import view called!")
    uploaded_file = request.FILES.get('file')
    print("Got File")
    if not uploaded_file:
        return Response({'error': 'No file uploaded'}, status=400)

    try:
        if doc == 'csv':
            df = pd.read_csv(uploaded_file)
            df.columns = df.columns.str.strip().str.lower().str.replace(" ", "_")  # normalize columns

        elif doc == 'json':
            df = pd.read_json(uploaded_file)
        elif doc == 'text':
            df = pd.read_csv(uploaded_file, delimiter='|')
        else:
            return Response({'error': 'Unsupported format'}, status=400)

        required_columns = {'title', 'due_date'}
        if not required_columns.issubset(df.columns):
            return Response({'error': f'Missing columns. Required: {required_columns}'}, status=400)

        for _, row in df.iterrows():
            task.objects.create(
                title=row['title'],
                due_date=row['due_date'],
                completed=row.get('completed', False),
                user=request.user
            )

        return Response({'message': 'Tasks imported successfully'}, status=201)

    except Exception as e:
        return Response({'error': str(e)}, status=500)
