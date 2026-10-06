from django.db import models

class user(models.Model):
    email = models.EmailField(max_length=30,unique=True)
    password = models.CharField(max_length=30)
    role = models.CharField(max_length=30)
    otp = models.CharField(default=456)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.email

class seller(models.Model):
    user_id = models.ForeignKey(user,on_delete=models.CASCADE)
    firstname = models.CharField(max_length=30)
    lastname = models.CharField(max_length=30)
    contactno = models.CharField(max_length=30)
    seller_store_name = models.CharField(max_length=30,null=True,blank=True)
    city = models.CharField(max_length=30,null=True,blank=True)
    address = models.TextField(null=True,blank=True)
    gstno = models.CharField(max_length=30,null=True,blank=True)
    pic = models.FileField(upload_to = "images/",default='images/seller_default.png')

    def __str__(self):
        return self.firstname +" " + self.lastname

class product(models.Model):
    user_id = models.ForeignKey(user,on_delete=models.CASCADE,null=True,blank=True)
    product_name  = models.CharField(max_length=30)
    product_category = models.CharField(max_length=30)
    product_price = models.IntegerField()
    stock_qty = models.IntegerField()
    picture = models.FileField(upload_to = "images/",default='images/product_default.png')
    description = models.TextField()
    discount = models.IntegerField()
    budge_text = models.CharField(max_length=20)
    weight_unit = models.CharField(max_length=10)
    brand = models.CharField(max_length=10)

    def __str__(self):
        return self.product_name
    

