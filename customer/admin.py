from django.contrib import admin
from customer.models import *

admin.site.register(customer)
admin.site.register(cart)
admin.site.register(cartitem)

class OrderAdmin(admin.ModelAdmin):
    list_display = ('order_id', 'customer', 'total_amount', 'status', 'created_at')
    list_editable = ('status',)

admin.site.register(Order, OrderAdmin)
admin.site.register(OrderItem)
