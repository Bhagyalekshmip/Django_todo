from django.db import models

from django.contrib.auth.models import User

class task(models.Model):
    title = models.CharField(max_length=100)
    due_date = models.DateTimeField(null=True, blank=True)  # Optional due date
    completed = models.BooleanField(default=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return self.title
