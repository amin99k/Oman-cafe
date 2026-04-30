let lang = 'en';
let cart = {};
const menu = window.menuData || {};

function itemName(item){ return lang === 'ar' ? item.ar : item.en; }
function cartName(key){ return lang === 'ar' ? cart[key].ar : cart[key].en; }
function itemPrice(item){ return Number(item.price || 0); }

function card(item){
  const key = item.id;
  const c = cart[key]?.qty || 0;
  const disabled = item.available === false;
  return `
  <div class="card ${disabled ? 'unavailable' : ''}">
    <img src="${item.image}" alt="${item.en}">
    <div class="cardBody">
      <h3>${itemName(item)}</h3>
      <p class="price">${itemPrice(item).toFixed(3)} OMR</p>
      ${disabled ? `<p class="soldOut">${lang === 'ar' ? 'غير متوفر' : 'Sold out'}</p>` : `
      <div class="qty">
        <button onclick="update('${item.id}',-1)">-</button>
        <span>${c}</span>
        <button onclick="update('${item.id}',1)">+</button>
      </div>`}
    </div>
  </div>`;
}

function findItem(id){
  for (const category of Object.values(menu)) {
    const found = category.find(item => item.id === id);
    if (found) return found;
  }
  return null;
}

function render(){
  Object.keys(menu).forEach(k => {
    const grid = document.getElementById(k + 'Grid');
    if (grid) grid.innerHTML = menu[k].map(card).join('');
  });
  updateOrder();
  translate();
}

function update(id,val){
  const item = findItem(id);
  if (!item || item.available === false) return;
  if (!cart[id]) cart[id] = { id:item.id, en:item.en, ar:item.ar, price:itemPrice(item), qty:0 };
  cart[id].qty += val;
  if (cart[id].qty <= 0) delete cart[id];
  document.getElementById('payment').classList.remove('show');
  render();
}

function updateOrder(){
  const list = Object.keys(cart);
  if(list.length === 0){
    document.getElementById('order').innerText = lang === 'ar' ? 'لم يتم اختيار أي عناصر.' : 'No items selected.';
    document.getElementById('cartDetails').innerHTML = '';
    return;
  }
  const total = list.reduce((s,k)=>s + cart[k].price * cart[k].qty, 0).toFixed(3);
  document.getElementById('order').innerText = list.map(k => cartName(k) + ' x' + cart[k].qty).join(', ') + ' | ' + (lang === 'ar' ? 'المجموع: ' : 'Total: ') + total + ' OMR';
}

function confirmOrder(){
  const list = Object.keys(cart);
  if(list.length === 0){
    alert(lang === 'ar' ? 'الرجاء اختيار عنصر واحد على الأقل.' : 'Please select at least one item.');
    return;
  }
  document.getElementById('payment').classList.add('show');
  document.getElementById('cartDetails').innerHTML = list.map(k => `
    <div>
      <span>${cartName(k)} x${cart[k].qty}</span>
      <span>
        <button onclick="update('${cart[k].id}',-1)">-</button>
        <button onclick="update('${cart[k].id}',1)">+</button>
      </span>
    </div>`).join('');
}

function payPaypal(){ alert(lang === 'ar' ? 'باي بال غير متاح حالياً.' : 'PayPal is currently unavailable.'); }

function payCash(){
  const mode = document.querySelector("input[name='mode']:checked").value;
  const table = document.getElementById('table').value;
  const place = mode === 'take' ? (lang === 'ar' ? 'سفري' : 'Takeaway') : table;
  alert((lang === 'ar' ? 'تم تأكيد الطلب. سيصل النادل أو موظف الصالة لاستلام الدفع نقداً.' : 'Order confirmed. A waiter or floor staff will come for cash payment.') + '\n' + place);
}

function callWaiter(){
  const mode = document.querySelector("input[name='mode']:checked").value;
  if(mode === 'take'){
    alert(lang === 'ar' ? 'خدمة النادل مخصصة للجلوس داخل الصالة.' : 'Waiter call is for dine-in tables.');
    return;
  }
  const table = document.getElementById('table').value;
  alert((lang === 'ar' ? 'تم استدعاء النادل إلى ' : 'Waiter is coming to ') + table);
}

function showMain(id,btn){
  document.querySelectorAll('.section').forEach(s=>s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  document.querySelectorAll('.tabs button').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
}

function showSub(id,btn){
  const p = btn.closest('.section');
  p.querySelectorAll('.subsection').forEach(s=>s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  p.querySelectorAll('.subtabs button').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
}

function showMini(id,btn){
  const p = btn.closest('.subsection');
  p.querySelectorAll('.miniSection').forEach(s=>s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  p.querySelectorAll('.miniTabs button').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
}

function modeChanged(){
  const mode = document.querySelector("input[name='mode']:checked").value;
  document.getElementById('table').disabled = mode === 'take';
}

function setLang(l,btn){
  lang = l;
  document.documentElement.dir = l === 'ar' ? 'rtl' : 'ltr';
  document.querySelectorAll('.lang button').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  render();
}

function translate(){
  document.getElementById('tagline').innerText = lang === 'ar' ? 'تجربة مقهى هادئة وأنيقة' : 'A calm and elegant cafe experience';
  document.querySelectorAll('[data-en]').forEach(el=>{ el.innerText = lang === 'ar' ? el.dataset.ar : el.dataset.en; });
  Array.from(document.getElementById('table').options).forEach((o,i)=>{ o.text = lang === 'ar' ? 'طاولة ' + (i+1) : 'Table ' + (i+1); });
}

const tableEl = document.getElementById('table');
for(let i=1;i<=30;i++){
  const o = document.createElement('option');
  o.value = 'Table ' + i;
  o.text = 'Table ' + i;
  tableEl.add(o);
}

render();
modeChanged();
