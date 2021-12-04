from django.contrib import admin
from mail.models import *

# Register your models here.


class UserAdmin(admin.ModelAdmin):
    list_display = ("id", "username", "email", "password", "is_superuser")


class EmailAdmin(admin.ModelAdmin):
    list_display = ("user", "sender", "subject",
                    "body", "timestamp", "read", "archived")


# Register your models here.
admin.site.register(User, UserAdmin)
admin.site.register(Email, EmailAdmin)
