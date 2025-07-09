
from django.contrib import admin
from django.urls import path
from app1 import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path("apisignup/",views.signup,name="signup"),
    path("login/",views.login,name="login"),
    path("addtask/",views.add_task,name="add_task"),
]
