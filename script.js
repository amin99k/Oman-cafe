let lang='en';let cart={};const menu=window.menuData||{};
function itemName(i){return lang==='ar'?i.ar:i.en}
function findItem(id){for(const c of Object.values(menu)){const f=c.find(i=>i.id===id);if(f)return f}return null}
function render(){Object.keys(menu).forEach(k=>{const g=document.getElementById(k+'Grid');if(g)g.innerHTML=menu[k].map(card).join('')});updateOrder();translate()}
function card(i){let c=cart[i.id]?.qty||0;return `<div class="card"><img src="${i.image}"><div class="cardBody"><h3>${itemName(i)}</h3><p class="price">${Number(i.price).toFixed(3)} OMR</p><div class="qty"><button onclick="update('${i.id}',-1)">-</button><span>${c}</span><button onclick="update('${i.id}',1)">+</button></div></div></div>`}
function update(id,v){const i=findItem(id);if(!i)return;if(!cart[id])cart[id]={...i,qty:0};cart[id].qty+=v;if(cart[id].qty<=0)delete cart[id];render()}
function updateOrder(){let l=Object.keys(cart);document.getElementById('order').innerText=l.length?l.map(k=>cart[k].en+' x'+cart[k].qty).join(', '):'No items selected.'}
function confirmOrder(){let list=Object.keys(cart);if(!list.length)return alert('Select item');document.getElementById('checkout').style.display='flex';document.getElementById('checkoutItems').innerHTML=list.map(k=>`<div>${cart[k].en} x${cart[k].qty}</div>`).join('')}
function closeCheckout(){document.getElementById('checkout').style.display='none'}
function showMain(id,b){document.querySelectorAll('.section').forEach(s=>s.classList.remove('active'));document.getElementById(id).classList.add('active');document.querySelectorAll('.tabs button').forEach(x=>x.classList.remove('active'));b.classList.add('active')}
function showSub(id,b){let p=b.closest('.section');p.querySelectorAll('.subsection').forEach(s=>s.classList.remove('active'));document.getElementById(id).classList.add('active');p.querySelectorAll('.subtabs button').forEach(x=>x.classList.remove('active'));b.classList.add('active')}
function showMini(id,b){let p=b.closest('.subsection');p.querySelectorAll('.miniSection').forEach(s=>s.classList.remove('active'));document.getElementById(id).classList.add('active');p.querySelectorAll('.miniTabs button').forEach(x=>x.classList.remove('active'));b.classList.add('active')}
function setLang(l,b){lang=l;document.documentElement.dir=l==='ar'?'rtl':'ltr';document.querySelectorAll('.lang button').forEach(x=>x.classList.remove('active'));b.classList.add('active');render()}
render();