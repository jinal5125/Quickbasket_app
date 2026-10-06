from django.db import models
from seller.models import user,product

class customer(models.Model):
    user_id = models.ForeignKey(user,on_delete=models.CASCADE)
    firstname = models.CharField(max_length=30)
    lastname = models.CharField(max_length=30)
    contactno = models.CharField(max_length=30)
    dob = models.DateField(null=True, blank=True)
    city = models.CharField(max_length=30,null=True,blank=True)
    address = models.TextField(null=True,blank=True)
    pincode = models.CharField(max_length=30,null=True,blank=True)
    pic = models.FileField(upload_to = "images/",default='images/customer_default.png')

    def __str__(self):
        return self.firstname +" " + self.lastname 

class cart(models.Model):
    customer = models.ForeignKey(customer,on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.customer.firstname + " " + self.customer.lastname
    
class cartitem(models.Model):
    cart = models.ForeignKey(cart,on_delete=models.CASCADE)
    product = models.ForeignKey(product,models.CASCADE)
    qty = models.IntegerField(default=1)

    def __str__(self):
        return self.product.product_name

    def productprice(self):
        return self.product.product_price * self.qty

class Order(models.Model):
    STATUS_CHOICES = (
        ('Pending', 'Pending'),
        ('Processing', 'Processing'),
        ('In Transit', 'In Transit'),
        ('Delivered', 'Delivered'),
        ('Cancelled', 'Cancelled'),
    )
    customer = models.ForeignKey(customer, on_delete=models.CASCADE)
    order_id = models.CharField(max_length=50, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    total_amount = models.IntegerField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Pending')
    address = models.TextField()
    payment_method = models.CharField(max_length=50, default='COD')

    def __str__(self):
        return f"{self.order_id} - {self.customer.firstname}"

class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(product, on_delete=models.CASCADE)
    qty = models.IntegerField(default=1)
    price = models.IntegerField()

    def __str__(self):
        return f"{self.product.product_name} x {self.qty}"

class Wishlist(models.Model):
    customer = models.ForeignKey(customer, on_delete=models.CASCADE, related_name='wishlist_items')
    product = models.ForeignKey(product, on_delete=models.CASCADE)
    added_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('customer', 'product')

    def __str__(self):
        return f"{self.customer.firstname} → {self.product.product_name}"