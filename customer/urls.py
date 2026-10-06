
from django.contrib import admin
from django.urls import path,include
from customer import views

urlpatterns = [
    path('edit_profile/', views.edit_profile, name='edit_profile'),
    path('logout/', views.logout, name='logout'),
    path('view_product/', views.view_product, name='view_product'),
    path('add_to_cart/<int:pk>', views.add_to_cart, name='add_to_cart'),
    path('view_cart/', views.view_cart, name='view_cart'),
    path('update_cart_qty/<int:item_id>/<str:action>/', views.update_cart_qty, name='update_cart_qty'),
    path('checkout/', views.checkout, name='checkout'),
    path('toggle_wishlist/<int:pk>/', views.toggle_wishlist, name='toggle_wishlist'),
]
