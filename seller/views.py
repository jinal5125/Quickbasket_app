from django.shortcuts import render
from django.http import HttpResponseRedirect
from .models import *
from customer.models import customer,cart, cartitem
from seller.models import seller 
import random
from .utils import *

def login(request):

    if "email" in request.session:
        uid = user.objects.get(email=request.session["email"])

        if uid.role == "seller":
            sid = seller.objects.get(user_id=uid)
            pid = product.objects.all()
            context = {
                "uid": uid,
                "sid": sid,
                "pid" : pid,
            }
            return render(request,"seller/index.html",context)
        elif uid.role == "customer":
            return HttpResponseRedirect("/customer/view_product/")
        
    else:
        if request.POST:
            email = request.POST['email']
            password = request.POST['password']
            
            request.session['email'] = email

            try:
                uid = user.objects.get(email=email)
                if uid.role == "seller":
                    sid = seller.objects.get(user_id=uid)
                    pid = product.objects.all()
                    context = {
                        "uid" : uid,
                        "sid" : sid,
                        "pid" : pid,
                    }
                    return render(request,"seller/index.html",context)
                
                elif uid.role == "customer":
                    return HttpResponseRedirect("/customer/view_product/")

            except:
                pass
        return render(request,"seller/login.html")

    if request.POST:
        email = request.POST["email"]
        password = request.POST["password"]

        try:
            uid = user.objects.get(email=email)

            if uid.password == password:

                request.session["email"] = email   # session yaha set karo

                if uid.role == "seller":
                    sid = seller.objects.get(user_id=uid)
                    context = {
                        "uid": uid,
                        "sid": sid
                    }
                    return render(request,"seller/index.html",context)

        except:
            pass

    return render(request,"seller/login.html")

def register(request):
    if request.POST:
        role = request.POST['role']
        firstname = request.POST['firstname']
        lastname = request.POST['lastname']
        email = request.POST['email']
        contactno = request.POST['contactno']

        l1 = ["tu598","njk53","mnkj67","fef23","fws78","tdy732"]

        password = random.choice(l1) + email[3:7] + contactno[3:6]

        uid = user.objects.create(
            role = role,
            email = email,
            password = password
        )

        if role == "seller":
            seller.objects.create(
                    user_id = uid,
                    firstname = firstname,
                    lastname = lastname,
                    contactno = contactno
                )
        elif role == "customer":
            customer.objects.create(
                    user_id = uid,
                    firstname = firstname,
                    lastname = lastname,
                    contactno = contactno
            )

        context = {
            's_msg' : "successfully registration completed - please check your mail for password"
        }

        return render(request,"seller/login.html",context)

    else:

        return render(request,"seller/register.html")


def logout(request):
    if "email" in request.session:
        del request.session["email"] 
        return HttpResponseRedirect("/seller/login")
    else:
         return HttpResponseRedirect("/seller/login")
    

def update_profile(request):
    if "email" in request.session:
        uid = user.objects.get(email = request.session['email'])

        if uid.role == "seller":
                    sid = seller.objects.get(user_id=uid)
                    firstname = request.POST['firstname']
                    lastname = request.POST['lastname']
                    contactno = request.POST['contactno']
                    seller_store_name = request.POST['seller_store_name']
                    

                    sid.firstname = firstname
                    sid.lastname = lastname
                    sid.contactno = contactno
                    sid.seller_store_name = seller_store_name

                    if "pic" in request.FILES:
                        sid.pic = request.FILES['pic']

                    sid.save()

                    context = {
                        "uid" : uid,
                        "sid" : sid
                    }
                    return render(request,"seller/index.html",context)
        return HttpResponseRedirect("/seller/login")
    else:
         return HttpResponseRedirect("/seller/login")
    


def add_product(request):
    if "email" in request.session:
        uid = user.objects.get(email = request.session['email'])
        sid = seller.objects.get(user_id = uid)

        if request.POST:
            product.objects.create(
                user_id = uid,
                product_name = request.POST['product_name'],
                product_category = request.POST['product_category'],
                product_price = request.POST['product_price'],
                stock_qty = request.POST['stock_qty'],
                picture = request.FILES['picture'],
                description = request.POST['description'],
                discount = request.POST['discount'],
                budge_text = request.POST['budge_text'],
                weight_unit = request.POST['weight_unit'],
                brand = request.POST['brand']
            )
            pid = product.objects.all()
            context = {
                "uid": uid,
                "pid" : pid,
                "sid" : sid,
            }

            return render(request,"seller/index.html",context)

def view_product(request):
    if "email" in request.session:
        uid = user.objects.get(email=request.session['email'])
        sid = seller.objects.get(user_id=uid)
        pid = product.objects.all()
        context = {
            "uid": uid,
            "sid": sid,
            "pid": pid,
            "show_products": True,
        }
        return render(request, "seller/index.html", context)


def edit_product(request, pk):
    if "email" in request.session:
        uid = user.objects.get(email=request.session['email'])
        sid = seller.objects.get(user_id=uid)
        pid = product.objects.get(pk=pk)

        if request.method == 'POST':
            pid.product_name     = request.POST['product_name']
            pid.product_category = request.POST['product_category']
            pid.product_price    = request.POST['product_price']
            pid.stock_qty        = request.POST['stock_qty']
            pid.description      = request.POST['description']
            pid.discount         = request.POST['discount']
            pid.budge_text       = request.POST['budge_text']
            pid.weight_unit      = request.POST['weight_unit']
            pid.brand            = request.POST['brand']

            if 'picture' in request.FILES:
                pid.picture = request.FILES['picture']

            pid.save()
            return HttpResponseRedirect("/seller/view_product/")

        context = {
            "uid": uid,
            "sid": sid,
            "pid": pid,
        }
        return render(request, "seller/index.html", context)
    return HttpResponseRedirect("/seller/login/")



def delete_product(request, pk):
    if "email" in request.session:
        pid = product.objects.get(pk=pk)
        pid.delete()
        return HttpResponseRedirect("/seller/view_product/")
    else:
        return HttpResponseRedirect("/seller/login/")



def forgot_password(request):
    if request.POST:
        email = request.POST['email']
        try:
            uid = user.objects.get(email=email)
            otp = random.randint(1111,9999)
            uid.otp = otp
            uid.save()

            myCustomMail("forgot password" ,"mailTemplate",email,{'otp' : otp})

            if uid:
                context = {
                    'email' : email
                }
                return render(request,"seller/reset_password.html",context)
        except:
            context = {
                'e_msg' : "User dose not exist"
            }
            return render(request,"seller/forgot_password.html",context)
    else:
        return render(request,"seller/forgot_password.html")
    
def reset_password(request):
    if request.POST:
        email = request.POST['email']
        otp = request.POST['otp']
        newpassword = request.POST['newpassword']
        repassword = request.POST['repassword']

        uid = user.objects.get(email = email)

        if otp == str(uid.otp) and newpassword == repassword:
            uid.password =newpassword
            uid.save()

            context = {
                's_msg' : "Password successfully changed"
            }
            return render(request,"seller/login.html",context)
    else:
        return render(request,"seller/login.html")