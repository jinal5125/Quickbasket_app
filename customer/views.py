from django.shortcuts import render
from django.http import HttpResponseRedirect, JsonResponse
from .models import *
from customer.models import customer, Wishlist
from seller.models import seller,product
import random

def edit_profile(request):
    if "email" in request.session:
        uid = user.objects.get(email = request.session['email'])

        if uid.role == "customer":
            cid = customer.objects.get(user_id = uid)
            firstname = request.POST['firstname']
            lastname = request.POST['lastname']
            contactno = request.POST['contactno']

            cid.firstname = firstname
            cid.lastname = lastname
            cid.contactno = contactno

            if "pic" in request.FILES:
                cid.pic = request.FILES['pic']
            
            pid = product.objects.all()

            cid.save()

            cart_obj, created = cart.objects.get_or_create(customer=cid)
            items = cartitem.objects.filter(cart=cart_obj)
            cart_count = sum(item.qty for item in items)

            orders = Order.objects.filter(customer=cid).order_by('-created_at')
            wishlist_items = Wishlist.objects.filter(customer=cid).select_related('product')
            wishlist_ids = list(wishlist_items.values_list('product_id', flat=True))

            context = {
                "uid" : uid,
                "cid" : cid,
                "pid" : pid,
                "cart_count": cart_count,
                "orders": orders,
                "wishlist_items": wishlist_items,
                "wishlist_ids": wishlist_ids,
            }
            return render(request,"customer/userpanel.html",context)
        return HttpResponseRedirect("/seller/login")
    else:
         return HttpResponseRedirect("/seller/login")


def logout(request):
    if "email" in request.session:
        del request.session["email"] 
        return HttpResponseRedirect("/seller/login")
    else:
         return HttpResponseRedirect("/seller/login") 
    
def view_product(request):
    if "email" in request.session:
        uid = user.objects.get(email=request.session['email'])
        
        if uid.role == "customer":
            cid = customer.objects.get(user_id=uid)
            q = request.GET.get('q', '').strip()
            if q:
                pid = product.objects.filter(product_name__icontains=q)
            else:
                pid = product.objects.all()
                
            # Extract unique brands and min/max prices for filtering
            brands = pid.values_list('brand', flat=True).distinct().order_by('brand') if pid.exists() else []
            prices = pid.values_list('product_price', flat=True) if pid.exists() else []
            min_price = min(prices) if prices else 0
            max_price = max(prices) if prices else 500
            
            cart_obj, created = cart.objects.get_or_create(customer=cid)
            items = cartitem.objects.filter(cart=cart_obj)
            cart_count = sum(item.qty for item in items)
            orders = Order.objects.filter(customer=cid).order_by('-created_at')
            wishlist_items = Wishlist.objects.filter(customer=cid).select_related('product')
            wishlist_ids = list(wishlist_items.values_list('product_id', flat=True))
            context = {
                "uid": uid,
                "cid": cid,
                "pid": pid,  
                "cart_count": cart_count,
                "q": q,
                "brands": brands,
                "min_price": min_price,
                "max_price": max_price,
                "orders": orders,
                "wishlist_items": wishlist_items,
                "wishlist_ids": wishlist_ids,
            }
            return render(request, "customer/userpanel.html", context)
    
    return HttpResponseRedirect("/seller/login")


def toggle_wishlist(request, pk):
    """AJAX: toggle wishlist for a product. Returns JSON {wishlisted: bool}"""
    if "email" not in request.session:
        return JsonResponse({"status": "error", "message": "Unauthorized"}, status=401)
    uid = user.objects.get(email=request.session['email'])
    if uid.role != "customer":
        return JsonResponse({"status": "error", "message": "Forbidden"}, status=403)
    cid = customer.objects.get(user_id=uid)
    prod = product.objects.get(id=pk)
    obj, created = Wishlist.objects.get_or_create(customer=cid, product=prod)
    if not created:
        obj.delete()
        return JsonResponse({"status": "ok", "wishlisted": False})
    return JsonResponse({"status": "ok", "wishlisted": True})


def add_to_cart(request,pk):
    if "email" in request.session:
        uid = user.objects.get(email=request.session['email'])
        if uid.role == "customer":
            cid = customer.objects.get(user_id = uid)
            products = product.objects.get(id=pk)

            cart_obj,is_created = cart.objects.get_or_create(customer = cid)

            cartitemdata,is_created = cartitem.objects.get_or_create(cart=cart_obj,product=products)

            if not is_created:
                cartitemdata.qty += 1
                cartitemdata.save()

            items = cartitem.objects.filter(cart = cart_obj)  
            
            total_amount = 0
            for i in items:
                total_amount += i.product.product_price * i.qty
                
            cart_count = sum(item.qty for item in items)
            context = {
                "uid": uid,
                "cid": cid,
                "items" : items,
                "total_amount" : total_amount,
                "net_amount" : total_amount - 65 if items.exists() else 0,
                "cart_count" : cart_count
            }

            return render(request, "customer/cart.html",context)
    return HttpResponseRedirect("/seller/login")

def view_cart(request):
    if "email" in request.session:
        uid = user.objects.get(email=request.session['email'])
        if uid.role == "customer":
            cid = customer.objects.get(user_id = uid)
            cart_obj, created = cart.objects.get_or_create(customer=cid)
            items = cartitem.objects.filter(cart = cart_obj)

            total_amount = 0
            for i in items:
                total_amount += i.product.product_price * i.qty
            
            cart_count = sum(item.qty for item in items)
            context = {
                "uid": uid,
                "cid": cid,
                "items" : items,
                "total_amount" : total_amount,
                "net_amount" : total_amount - 65 if items.exists() else 0,
                "cart_count" : cart_count
            }

            return render(request, "customer/cart.html",context)
    return HttpResponseRedirect("/seller/login")

def update_cart_qty(request, item_id, action):
    if "email" in request.session:
        try:
            uid = user.objects.get(email=request.session['email'])
            if uid.role == "customer":
                cid = customer.objects.get(user_id=uid)
                cart_obj, created = cart.objects.get_or_create(customer=cid)
                item = cartitem.objects.get(id=item_id, cart=cart_obj)
                
                if action == "increase":
                    item.qty += 1
                    item.save()
                    item_deleted = False
                elif action == "decrease":
                    item.qty -= 1
                    if item.qty <= 0:
                        item.delete()
                        item_deleted = True
                    else:
                        item.save()
                        item_deleted = False
                else:
                    return JsonResponse({"status": "error", "message": "Invalid action"}, status=400)
                
                # Recalculate totals
                items = cartitem.objects.filter(cart=cart_obj)
                total_amount = sum(i.product.product_price * i.qty for i in items)
                net_amount = total_amount - 65 if items.exists() else 0
                cart_count = sum(i.qty for i in items)
                
                return JsonResponse({
                    "status": "success",
                    "qty": 0 if item_deleted else item.qty,
                    "item_price": 0 if item_deleted else (item.product.product_price * item.qty),
                    "total_amount": total_amount,
                    "net_amount": net_amount,
                    "cart_count": cart_count,
                    "item_deleted": item_deleted
                })
        except Exception as e:
            return JsonResponse({"status": "error", "message": str(e)}, status=400)
    return JsonResponse({"status": "error", "message": "Unauthorized"}, status=401)
    
def checkout(request):
    if "email" in request.session:
        uid = user.objects.get(email=request.session['email'])
        if uid.role == "customer":
            cid = customer.objects.get(user_id=uid)
            cart_obj, created = cart.objects.get_or_create(customer=cid)
            items = cartitem.objects.filter(cart=cart_obj)

            total_amount = 0
            for i in items:
                total_amount += i.product.product_price * i.qty

            if items:
                net_amount = total_amount - 65
            else:
                net_amount = 0

            if request.method == "POST":
                address1 = request.POST.get('address1')
                address2 = request.POST.get('address2')
                city = request.POST.get('city')
                state = request.POST.get('state')
                pincode = request.POST.get('pincode')
                payment = request.POST.get('payment')

                full_address = address1 + ", " + address2 + ", " + city + ", " + state + " - " + pincode
                order_id = "QB-" + str(random.randint(10000, 99999))

                order = Order.objects.create(
                    customer=cid,
                    order_id=order_id,
                    total_amount=net_amount,
                    address=full_address,
                    payment_method=payment,
                    status='Processing'
                )

                for i in items:
                    OrderItem.objects.create(
                        order=order,
                        product=i.product,
                        qty=i.qty,
                        price=i.product.product_price
                    )
                    # Decrement product stock simply
                    i.product.stock_qty = i.product.stock_qty - i.qty
                    i.product.save()

                items.delete()
                return HttpResponseRedirect("/customer/view_product/?order_success=true#profile")

            cart_count = 0
            for i in items:
                cart_count += i.qty

            context = {
                "uid": uid,
                "cid": cid,
                "items": items,
                "total_amount": total_amount,
                "net_amount": net_amount,
                "cart_count": cart_count
            }
            return render(request, "customer/checkout.html", context)
    return HttpResponseRedirect("/seller/login")