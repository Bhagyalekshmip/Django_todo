
from django.contrib import admin
from django.urls import path
from app1 import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path("apisignup/",views.signup,name="signup"),
    path("login/",views.login,name="login"),
    path("addtask/",views.add_task,name="add_task"),
    path("gettask/",views.get_tasks,name="get_task"),
    path("updatetask/<int:task_id>/",views.update_task,name="update_task"),
    path("deletetask/<int:task_id>/",views.delete_task,name="delete_task"),
    path("searchtask/",views.search_tasks,name="search_task"),
    path('togglecompletion/<int:id>/', views.toggle_task_completion),
    path('export/csv/', views.export_tasks_csv),
    path('export/json/', views.export_tasks_json),
    path('export/text/', views.export_tasks_text),
    path('export/mysql/', views.export_tasks_mysql),
    path('import/<str:doc>/', views.import_tasks),

]
