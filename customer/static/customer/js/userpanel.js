/* ═══ CAROUSEL ═══ */
const SLIDES=5;let cur=0,cTimer;
const track=document.getElementById('cTrack');
const dotsEl=document.getElementById('cdots');

if(dotsEl){
  for(let i=0;i<SLIDES;i++){
    const d=document.createElement('div');
    d.className='dot'+(i===0?' on':'');
    d.onclick=()=>goTo(i);
    dotsEl.appendChild(d);
  }
}
function goTo(n){
  cur=n;
  if(track) track.style.transform=`translateX(-${cur*100}%)`;
  document.querySelectorAll('.dot').forEach((d,i)=>d.classList.toggle('on',i===cur));
}
function cMove(dir){goTo((cur+dir+SLIDES)%SLIDES);resetTimer();}
function resetTimer(){clearInterval(cTimer);cTimer=setInterval(()=>cMove(1),4500);}
if(track && dotsEl){
  resetTimer();
}

/* ═══ PAGES ═══ */
const cart={};
function nav(p){
  document.querySelectorAll('.page').forEach(x=>x.classList.remove('active'));
  document.getElementById('page-'+p).classList.add('active');
  window.scrollTo({top:0,behavior:'smooth'});
  // if(p==='cart') renderCart(); // Static design used as per user request

  /* Profile page: show 'info' section by default on profile page */
  if(p==='profile') showProfileSection('info');
}

/* ═══ PROFILE RIGHT-SIDE SECTION SWITCHER ═══ */
function showProfileSection(section){
  /* hide ALL right sections via inline style (works even if CSS not loaded) */
  document.querySelectorAll('.pright-section').forEach(s=>{
    s.style.display='none';
    s.style.flexDirection='';
    s.style.gap='';
  });

  /* show requested section */
  const el = document.getElementById('psec-'+section);
  if(el){
    el.style.display='flex';
    el.style.flexDirection='column';
    el.style.gap='20px';
  }

  /* update left nav active state */
  document.querySelectorAll('#page-profile .pni').forEach(a=>{
    a.classList.remove('on');
    a.style.background='';
    a.style.color='';
  });
  const activeNav = document.querySelector('#page-profile .pni[data-sec="'+section+'"]');
  if(activeNav){
    activeNav.classList.add('on');
    activeNav.style.background='rgba(37,99,235,.08)';
    activeNav.style.color='#2563eb';
  }
}

/* page load pe sab sections hide karo, sirf info dikhao */
document.addEventListener('DOMContentLoaded', function(){
  /* Hide all sections first */
  document.querySelectorAll('.pright-section').forEach(s=>{
    s.style.display='none';
  });
  /* Show info by default */
  const info = document.getElementById('psec-info');
  if(info){
    info.style.display='flex';
    info.style.flexDirection='column';
    info.style.gap='20px';
  }

  // Search bar logic
  const searchInput = document.getElementById('searchInput');
  const suggestionsBox = document.getElementById('searchSuggestions');
  if (searchInput && suggestionsBox) {
    searchInput.addEventListener('input', function() {
      const query = searchInput.value.toLowerCase().trim();
      filterProducts();
      
      if (query.length < 2) {
        suggestionsBox.style.display = 'none';
        return;
      }
      
      // Get all product cards on home page to build suggestion list
      const cards = document.querySelectorAll('.pcd');
      const uniqueNames = new Set();
      cards.forEach(card => {
        if (card.dataset.name) {
          uniqueNames.add(card.dataset.name);
        }
      });
      
      const suggestions = Array.from(uniqueNames).filter(name => 
        name.toLowerCase().includes(query)
      );
      
      if (suggestions.length > 0) {
        suggestionsBox.innerHTML = '';
        suggestions.forEach(name => {
          const item = document.createElement('div');
          item.className = 'search-suggestion-item';
          item.innerHTML = `<i class="fas fa-search"></i> <span>${name}</span>`;
          item.addEventListener('click', function(e) {
            e.stopPropagation();
            window.location.href = `/customer/view_product/?q=${encodeURIComponent(name)}`;
          });
          suggestionsBox.appendChild(item);
        });
        suggestionsBox.style.display = 'block';
      } else {
        suggestionsBox.style.display = 'none';
      }
    });
    
    searchInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        const query = searchInput.value.trim();
        window.location.href = `/customer/view_product/?q=${encodeURIComponent(query)}`;
      }
    });

    document.addEventListener('click', function(e) {
      if (!e.target.closest('.hsearch')) {
        suggestionsBox.style.display = 'none';
      }
    });

    searchInput.addEventListener('focus', function() {
      const query = searchInput.value.toLowerCase().trim();
      if (query.length >= 2) {
        // Trigger input event to show suggestions
        searchInput.dispatchEvent(new Event('input'));
      }
    });
    
    // Check if URL has search param on load
    const urlParams = new URLSearchParams(window.location.search);
    const queryParam = urlParams.get('q');
    if (queryParam) {
      searchInput.value = queryParam;
      filterProducts();
    }

    // Check if URL has order_success query param on load
    if (urlParams.get('order_success') === 'true') {
      setTimeout(() => {
        toast('🎉 Order Placed Successfully!');
      }, 500);
    }

    // Check if URL hash is #profile on load
    if (window.location.hash === '#profile') {
      nav('profile');
      if (urlParams.get('order_success') === 'true') {
        showProfileSection('orders');
      }
    }
  }

  /* ✅ FEEDBACK: Star rating setup */
  let selectedRating = 0;
  const stars = document.querySelectorAll('#fbStars i');
  const starLabel = document.getElementById('fbStarLabel');
  const starLabels = ['','Terrible 😞','Not Good 😐','Okay 🙂','Good 😊','Excellent! 🤩'];

  stars.forEach(star => {
    star.addEventListener('mouseover', function(){
      const val = +this.dataset.val;
      stars.forEach((s,i) => {
        s.classList.toggle('fas', i < val);
        s.classList.toggle('far', i >= val);
        s.classList.toggle('active', i < val);
      });
      if(starLabel) starLabel.textContent = starLabels[val] || '';
    });

    star.addEventListener('mouseout', function(){
      stars.forEach((s,i) => {
        s.classList.toggle('fas', i < selectedRating);
        s.classList.toggle('far', i >= selectedRating);
        s.classList.toggle('active', i < selectedRating);
      });
      if(starLabel) starLabel.textContent = selectedRating ? starLabels[selectedRating] : 'Click to rate';
    });

    star.addEventListener('click', function(){
      selectedRating = +this.dataset.val;
      stars.forEach((s,i) => {
        s.classList.toggle('fas', i < selectedRating);
        s.classList.toggle('far', i >= selectedRating);
        s.classList.toggle('active', i < selectedRating);
      });
      if(starLabel) starLabel.textContent = starLabels[selectedRating];
    });
  });

  /* expose selectedRating getter for submitFeedback */
  window._getFbRating = () => selectedRating;
});

/* ✅ FEEDBACK: Category selector */
function selFbCat(btn){
  document.querySelectorAll('.fb-cat-btn').forEach(b => b.classList.remove('on'));
  btn.classList.add('on');
}

/* ✅ FEEDBACK: Submit */
function submitFeedback(){
  const rating  = window._getFbRating ? window._getFbRating() : 0;
  const message = document.getElementById('fbMessage').value.trim();
  const cat     = document.querySelector('.fb-cat-btn.on');

  if(!rating){
    toast('⭐ Please select a star rating first!');
    return;
  }
  if(!message){
    toast('✏️ Please write your feedback message!');
    return;
  }

  /* Reset form after submit */
  document.getElementById('fbMessage').value = '';
  document.querySelectorAll('#fbStars i').forEach(s=>{
    s.classList.remove('fas','active');
    s.classList.add('far');
  });
  const lbl = document.getElementById('fbStarLabel');
  if(lbl) lbl.textContent = 'Click to rate';
  if(window._getFbRating) window._getFbRating = ()=>0;

  toast('🎉 Thank you for your feedback!');
}

/* ═══ CART ═══ */
function addCart(btn){
  const c=btn.closest('.pcd');
  const name=c.dataset.name,price=+c.dataset.price,img=c.dataset.img;
  cart[name]?cart[name].qty++:(cart[name]={name,price,img,qty:1});
  btn.classList.add('added');btn.innerHTML='<i class="fas fa-check"></i>';
  setTimeout(()=>{btn.classList.remove('added');btn.innerHTML='<i class="fas fa-plus"></i>';},900);
  updateBadge();toast('🛒 '+name+' added!');
}
function updateBadge(){
  const count = Object.values(cart).reduce((s,i)=>s+i.qty,0);
  const badgeEl = document.getElementById('cBadge');
  if (badgeEl) {
    badgeEl.textContent = count;
    if (count <= 0) {
      badgeEl.style.display = 'none';
    } else {
      badgeEl.style.display = 'flex';
    }
  }
}
function renderCart(){
  const items=Object.values(cart);
  const empty=document.getElementById('cempty'),full=document.getElementById('cfull'),list=document.getElementById('cList');
  if(!items.length){empty.style.display='block';full.style.display='none';return;}
  empty.style.display='none';full.style.display='grid';
  let sub=0, itemCount=0;
  list.innerHTML=items.map(it=>{
    const itemTotal = it.price*it.qty;
    sub += itemTotal;
    itemCount += it.qty;
    return `<div class="ci">
      <div class="ci-img"><img src="${it.img}" alt="${it.name}"></div>
      <div class="ci-info">
        <div class="ci-nm">${it.name}</div>
        <div class="ci-u">Unit: ₹${it.price} · Fresh</div>
      </div>
      <div class="ci-qr">
        <button class="ci-qb" onclick="chgQty('${it.name}',-1)"><i class="fas fa-minus"></i></button>
        <span class="ci-qn">${it.qty}</span>
        <button class="ci-qb" onclick="chgQty('${it.name}',1)"><i class="fas fa-plus"></i></button>
      </div>
      <div class="ci-price">₹${itemTotal}</div>
    </div>`;
  }).join('');

  const disc=Math.round(sub*.1);
  const del=sub>=399?0:40;
  const tot=sub-disc+del;

  document.getElementById('sCount').textContent = itemCount;
  document.getElementById('sSub').textContent = '₹'+sub;
  document.getElementById('sDisc').textContent = '−₹'+disc;
  document.getElementById('sDel').textContent = del ? '₹'+del : 'FREE';
  document.getElementById('sTot').textContent = '₹'+tot;
  
  const saveEl = document.getElementById('sSave');
  const saveValEl = document.getElementById('sSaveVal');
  if(disc > 0) {
    saveEl.style.display = 'flex';
    saveValEl.textContent = '₹'+disc;
  } else {
    saveEl.style.display = 'none';
  }
}
function chgQty(name,d){if(!cart[name])return;cart[name].qty+=d;if(cart[name].qty<=0)delete cart[name];updateBadge();renderCart();}
function rmItem(name){delete cart[name];updateBadge();renderCart();toast('Item removed');}
function applyCoup(){
  const c=document.getElementById('cInp').value.trim().toUpperCase();
  const v=['DAIRY30','WELCOME30','CASH100','FREEDEL','VEG212','FRUIT25'];
  toast(v.includes(c)?'🎉 Coupon '+c+' applied!':'❌ Invalid. Try: DAIRY30 or WELCOME30');
}
let currentCategory = 'all';

function filterProducts() {
  const searchInput = document.getElementById('searchInput');
  const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
  
  document.querySelectorAll('.pcd').forEach(card => {
    const name = card.dataset.name ? card.dataset.name.toLowerCase() : '';
    const cat = card.dataset.cat ? card.dataset.cat.toLowerCase() : '';
    
    const matchesCategory = (currentCategory === 'all' || cat === currentCategory);
    const matchesSearch = (query === '' || name.includes(query));
    
    if (matchesCategory && matchesSearch) {
      card.style.display = card.classList.contains('zepto-card') ? 'flex' : 'block';
    } else {
      card.style.display = 'none';
    }
  });
}

function fcat(e,cat){
  e.preventDefault();
  document.querySelectorAll('.cpill').forEach(t=>t.classList.remove('on'));
  e.currentTarget.classList.add('on');
  currentCategory = cat.toLowerCase();
  filterProducts();
}
function twish(el, e, productId){
  e.stopPropagation();
  const i = el.querySelector('i');
  const liked = i.classList.contains('fas');

  // Optimistic UI update
  i.classList.toggle('fas', !liked);
  i.classList.toggle('far', liked);
  el.classList.toggle('liked', !liked);

  // Call server
  fetch(`/customer/toggle_wishlist/${productId}/`)
    .then(r => r.json())
    .then(data => {
      if(data.status === 'ok'){
        toast(data.wishlisted ? '❤️ Added to wishlist!' : 'Removed from wishlist');
        // If we are in the wishlist section and item was removed, remove the card
        if(!data.wishlisted){
          const card = el.closest('.pcd');
          const wishSection = document.getElementById('psec-wish');
          if(card && wishSection && wishSection.contains(card)){
            card.style.transition = 'opacity 0.35s, transform 0.35s';
            card.style.opacity = '0';
            card.style.transform = 'scale(0.9)';
            setTimeout(() => {
              card.remove();
              // If no more items, show empty state
              const remaining = wishSection.querySelectorAll('.pcd');
              if(remaining.length === 0){
                const grid = wishSection.querySelector('.pgrid');
                if(grid) grid.remove();
                const body = wishSection.querySelector('.prc');
                if(body){
                  body.insertAdjacentHTML('beforeend',
                    `<div style="text-align:center;padding:40px 20px;">
                      <div style="font-size:3rem;margin-bottom:12px;">💔</div>
                      <p style="color:var(--mist);font-size:.95rem;font-weight:600;">Your wishlist is empty.<br>Tap the ❤️ on any product to save it here!</p>
                    </div>`
                  );
                }
              }
            }, 360);
          }
        }
      } else {
        // Revert on error
        i.classList.toggle('fas', liked);
        i.classList.toggle('far', !liked);
        el.classList.toggle('liked', liked);
        toast('❌ Could not update wishlist. Please try again.');
      }
    })
    .catch(() => {
      // Revert on network error
      i.classList.toggle('fas', liked);
      i.classList.toggle('far', !liked);
      el.classList.toggle('liked', liked);
      toast('❌ Network error. Please try again.');
    });
}
let tT;
function toast(msg){
  const t=document.getElementById('toast');
  document.getElementById('tmsg').textContent=msg;
  t.classList.add('show');clearTimeout(tT);
  tT=setTimeout(()=>t.classList.remove('show'),3200);
}
function toggleMenu(e){
  e.stopPropagation();
  const menu=document.getElementById("profileMenu");
  menu.style.display=menu.style.display==="block"?"none":"block";
}
document.addEventListener("click",function(){
  const menu = document.getElementById("profileMenu");
  if(menu) menu.style.display="none";
});

function updateCartItem(itemId, action) {
  fetch(`/customer/update_cart_qty/${itemId}/${action}/`)
    .then(response => response.json())
    .then(data => {
      if (data.status === 'success') {
        if (data.item_deleted) {
          const row = document.getElementById(`row-${itemId}`);
          if (row) {
            row.style.transition = 'all 0.4s ease';
            row.style.opacity = '0';
            row.style.transform = 'translateY(-20px)';
            setTimeout(() => {
              row.remove();
              if (data.cart_count === 0) {
                location.reload();
              }
            }, 400);
          }
        } else {
          const qtyEl = document.getElementById(`qty-${itemId}`);
          const priceEl = document.getElementById(`price-${itemId}`);
          if (qtyEl) qtyEl.textContent = data.qty;
          if (priceEl) priceEl.textContent = `₹${data.item_price}`;
        }

        const subtotalEl = document.getElementById('subtotal-val');
        const totalEl = document.getElementById('total-val');
        const badgeEl = document.getElementById('cBadge');

        if (subtotalEl) subtotalEl.textContent = `₹${data.total_amount}`;
        if (totalEl) totalEl.textContent = `₹${data.net_amount}`;
        if (badgeEl) {
          badgeEl.textContent = data.cart_count;
          if (data.cart_count <= 0) {
            badgeEl.style.display = 'none';
          } else {
            badgeEl.style.display = 'flex';
          }
        }

        toast(action === 'increase' ? '➕ Item quantity increased!' : '➖ Item quantity decreased!');
      } else {
        toast('❌ Error: ' + (data.message || 'Could not update quantity.'));
      }
    })
    .catch(err => {
      console.error(err);
      toast('❌ Error connecting to server.');
    });
}

/* ═════ SIDEBAR SEARCH FILTERS (Zepto layout) ═════ */
function filterProductsList() {
  const priceInput = document.getElementById('priceRangeInput');
  const maxPrice = priceInput ? parseFloat(priceInput.value) : Infinity;
  
  const checkedCheckboxes = Array.from(document.querySelectorAll('input[name="brand-filter"]:checked'));
  const selectedBrands = checkedCheckboxes.map(cb => cb.value.toLowerCase().trim());
  
  let visibleCount = 0;
  document.querySelectorAll('.zepto-card').forEach(card => {
    const brand = card.dataset.brand ? card.dataset.brand.toLowerCase().trim() : '';
    const price = parseFloat(card.dataset.price);
    
    const matchesPrice = (price <= maxPrice);
    const matchesBrand = (selectedBrands.length === 0 || selectedBrands.includes(brand));
    
    if (matchesPrice && matchesBrand) {
      card.style.display = 'flex';
      visibleCount++;
    } else {
      card.style.display = 'none';
    }
  });
  
  const countEl = document.getElementById('filtered-count');
  if (countEl) countEl.textContent = visibleCount;
}

function updatePriceFilter(val) {
  const display = document.getElementById('price-max-display');
  if (display) display.textContent = val;
  filterProductsList();
}

function toggleBrandFilter(brand, btn) {
  const activeBrand = brand.toLowerCase().trim();
  
  document.querySelectorAll('input[name="brand-filter"]').forEach(cb => {
    cb.checked = (cb.value.toLowerCase().trim() === activeBrand);
  });
  
  document.querySelectorAll('.q-pill').forEach(p => p.classList.remove('active'));
  if (btn) btn.classList.add('active');
  
  filterProductsList();
}

function clearAllFilters() {
  document.querySelectorAll('input[name="brand-filter"]').forEach(cb => cb.checked = false);
  const priceInput = document.getElementById('priceRangeInput');
  if (priceInput) {
    priceInput.value = priceInput.max;
    const display = document.getElementById('price-max-display');
    if (display) display.textContent = priceInput.max;
  }
  document.querySelectorAll('.q-pill').forEach(p => p.classList.remove('active'));
  filterProductsList();
}

function toggleFilterCollapse(type) {
  const body = document.getElementById(`${type}-body`);
  const arrow = document.getElementById(`${type}-arrow`);
  if (body) {
    if (body.style.display === 'none') {
      body.style.display = 'block';
      if (arrow) arrow.className = 'fas fa-chevron-down';
    } else {
      body.style.display = 'none';
      if (arrow) arrow.className = 'fas fa-chevron-right';
    }
  }
}