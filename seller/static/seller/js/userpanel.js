/* ═══ CAROUSEL ═══ */
const SLIDES=5;let cur=0,cTimer;
const track=document.getElementById('cTrack');
const dotsEl=document.getElementById('cdots');

for(let i=0;i<SLIDES;i++){
  const d=document.createElement('div');
  d.className='dot'+(i===0?' on':'');
  d.onclick=()=>goTo(i);
  dotsEl.appendChild(d);
}
function goTo(n){
  cur=n;
  track.style.transform=`translateX(-${cur*100}%)`;
  document.querySelectorAll('.dot').forEach((d,i)=>d.classList.toggle('on',i===cur));
}
function cMove(dir){goTo((cur+dir+SLIDES)%SLIDES);resetTimer();}
function resetTimer(){clearInterval(cTimer);cTimer=setInterval(()=>cMove(1),4500);}
resetTimer();

/* ═══ PAGES ═══ */
const cart={};
function nav(p){
  document.querySelectorAll('.page').forEach(x=>x.classList.remove('active'));
  document.getElementById('page-'+p).classList.add('active');
  window.scrollTo({top:0,behavior:'smooth'});
  if(p==='cart') renderCart();

  /* Profile page: show 'info' section by default on profile page */
  if(p==='profile') showProfileSection('info');
}

/* ═══ PROFILE RIGHT-SIDE SECTION SWITCHER ═══ */
function showProfileSection(section){
  /* hide all right sections */
  document.querySelectorAll('.pright-section').forEach(s=>{
    s.classList.remove('active');
    s.style.display='none';
  });

  /* show requested section */
  const el = document.getElementById('psec-'+section);
  if(el){
    el.classList.add('active');
    el.style.display='flex';
  }

  /* update left nav active state */
  document.querySelectorAll('#page-profile .pni').forEach(a=>a.classList.remove('on'));
  const activeNav = document.querySelector('#page-profile .pni[data-sec="'+section+'"]');
  if(activeNav) activeNav.classList.add('on');
}

/* page load pe sab sections hide karo, sirf info dikhao */
document.addEventListener('DOMContentLoaded', function(){
  document.querySelectorAll('.pright-section').forEach(s=>{
    s.style.display='none';
  });
  const info = document.getElementById('psec-info');
  if(info){ info.classList.add('active'); info.style.display='flex'; }
});

/* ═══ CART ═══ */
function addCart(btn){
  const c=btn.closest('.pcd');
  const name=c.dataset.name,price=+c.dataset.price,img=c.dataset.img;
  cart[name]?cart[name].qty++:(cart[name]={name,price,img,qty:1});
  btn.classList.add('added');btn.innerHTML='<i class="fas fa-check"></i>';
  setTimeout(()=>{btn.classList.remove('added');btn.innerHTML='<i class="fas fa-plus"></i>';},900);
  updateBadge();toast('🛒 '+name+' added!');
}
function updateBadge(){document.getElementById('cBadge').textContent=Object.values(cart).reduce((s,i)=>s+i.qty,0);}
function renderCart(){
  const items=Object.values(cart);
  const empty=document.getElementById('cempty'),full=document.getElementById('cfull'),list=document.getElementById('cList');
  if(!items.length){empty.style.display='block';full.style.display='none';return;}
  empty.style.display='none';full.style.display='grid';
  let sub=0;
  list.innerHTML=items.map(it=>{
    sub+=it.price*it.qty;
    return`<div class="ci"><div class="ci-img"><img src="${it.img}" alt="${it.name}"></div>
    <div><div class="ci-nm">${it.name}</div><div class="ci-u">Unit: ₹${it.price}</div>
    <div class="ci-qr"><button class="ci-qb" onclick="chgQty('${it.name}',-1)"><i class="fas fa-minus"></i></button>
    <span class="ci-qn">${it.qty}</span>
    <button class="ci-qb" onclick="chgQty('${it.name}',1)"><i class="fas fa-plus"></i></button></div></div>
    <div class="ci-r"><div class="ci-tot">₹${it.price*it.qty}</div>
    <div class="ci-del" onclick="rmItem('${it.name}')"><i class="fas fa-trash-alt"></i> Remove</div></div></div>`;
  }).join('');
  const disc=Math.round(sub*.1),del=sub>=399?0:40,tot=sub-disc+del,cnt=items.length;
  document.getElementById('cCount').textContent=cnt+' item'+(cnt>1?'s':'');
  document.getElementById('sSub').textContent='₹'+sub;
  document.getElementById('sDisc').textContent='−₹'+disc;
  document.getElementById('sDel').textContent=del?'₹40':'FREE 🎉';
  document.getElementById('sTot').textContent='₹'+tot;
}
function chgQty(name,d){if(!cart[name])return;cart[name].qty+=d;if(cart[name].qty<=0)delete cart[name];updateBadge();renderCart();}
function rmItem(name){delete cart[name];updateBadge();renderCart();toast('Item removed');}
function applyCoup(){
  const c=document.getElementById('cInp').value.trim().toUpperCase();
  const v=['DAIRY30','WELCOME30','CASH100','FREEDEL','VEG212','FRUIT25'];
  toast(v.includes(c)?'🎉 Coupon '+c+' applied!':'❌ Invalid. Try: DAIRY30 or WELCOME30');
}
function fcat(e,cat){
  e.preventDefault();
  document.querySelectorAll('.cpill').forEach(t=>t.classList.remove('on'));
  e.currentTarget.classList.add('on');
  document.querySelectorAll('.pcd').forEach(card=>{card.style.display=(cat==='all'||card.dataset.cat===cat)?'block':'none';});
}
function twish(el,e){
  e.stopPropagation();
  const i=el.querySelector('i'),liked=i.classList.contains('fas');
  i.classList.toggle('fas',!liked);i.classList.toggle('far',liked);
  el.classList.toggle('liked',!liked);
  toast(liked?'Removed from wishlist':'❤️ Added to wishlist!');
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
  document.getElementById("profileMenu").style.display="none";
});