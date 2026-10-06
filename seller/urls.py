
from django.contrib import admin
from django.urls import path,include
from seller import views

urlpatterns = [
    path('login/', views.login, name='login'),
    path('register/', views.register, name='register'),
    path('logout/', views.logout, name='logout'),
    path('update_profile/', views.update_profile, name='update_profile'),
    path('add_product/', views.add_product, name='add_product'),
    path('view_product/', views.view_product, name='view_product'),
    path('forgot_password/', views.forgot_password, name='forgot_password'),
    path('reset_password/', views.reset_password, name='reset_password'),
    path('edit_product/<int:pk>', views.edit_product, name='edit_product'),
    path('delete_product/<int:pk>', views.delete_product, name='delete_product'),
    
]
