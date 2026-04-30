let lang = 'en';
let cart = {};
const menu = window.menuData || {};

function itemName(item){ return lang === 'ar' ? item.ar : item.en; }
function cartName(key){ return lang === 'ar' ? cart[key].ar : cart[key].en; }
function itemPrice(item){ return Number(item.price || 0); }
function betterImage(url){ return String(url || '').replace(/w=500/g,'w=900').replace(/q=80/g,'q=90'); }

function findItem(id){
  for (const category of Object.values(menu)) {
    const found = category.find(item => item.id === id);
    if (found) return found;
  }
  return null;
}

function card(item){
  const key = item.id;
  const count = cart[key]?.qty || 0;
  const disabled = item.available === false;
  return `
    <div class="card ${disabled ? 'unavailable' : ''}">
      <img src="${betterImage(item.image)}" alt="${item.en}">
      <div class="cardBody">
        <h3>${itemName(item)}</h3>
        <p class="price">${itemPrice(item).toFixed(3)} OMR</p>
        ${disabled ? `<p class="soldOut">${lang === 'ar' ? 'غير متوفر' : 'Sold out'}</p>` : `
          <div class="qty">
            <button onclick="update('${item.id}',-1)">-</button>
            <span>${count}</span>
            <button onclick="update('${item.id}',1)">+</button>
          </div>`}
      </div>
    </div>`;
}

function render(){
  Object.keys(menu).forEach(key => {
    const grid = document.getElementById(key + 'Grid');
    if (grid) grid.innerHTML = menu[key].map(card).join('');
  });
  updateOrder();
  renderCheckoutItems();
  translate();
}

function update(id, value){
  const item = findItem(id);
  if (!item || item.available === false) return;
  if (!cart[id]) cart[id] = { id:item.id, en:item.en, ar:item.ar, price:itemPrice(item), qty:0 };
  cart[id].qty += value;
  if (cart[id].qty <= 0) delete cart[id];
  render();
}

function cartList(){ return Object.keys(cart); }
function cartTotal(){ return cartList().reduce((sum,key) => sum + cart[key].price * cart[key].qty, 0); }

function updateOrder(){
  const list = cartList();
  const order = document.getElementById('order');
  if (!order) return;
  if (!list.length) {
    order.innerText = lang === 'ar' ? 'لم يتم اختيار أي عناصر.' : 'No items selected.';
    return;
  }
  order.innerText = `${list.length} ${lang === 'ar' ? 'عناصر' : 'items'} • ${cartTotal().toFixed(3)} OMR`;
}

function renderCheckoutItems(){
  const box = document.getElementById('checkoutItems');
  if (!box) return;
  const list = cartList();
  if (!list.length) {
    box.innerHTML = `<p>${lang === 'ar' ? 'لا توجد عناصر.' : 'No items selected.'}</p>`;
    return;
  }
  box.innerHTML = list.map(key => `
    <div class="checkoutItem">
      <span>${cartName(key)}</span>
      <span class="checkoutQty">
        <button onclick="update('${key}',-1)">-</button>
        <b>${cart[key].qty}</b>
        <button onclick="update('${key}',1)">+</button>
      </span>
    </div>`).join('') + `<div class="checkoutTotal"><span>${lang === 'ar' ? 'المجموع' : 'Total'}</span><b>${cartTotal().toFixed(3)} OMR</b></div>`;
}

function confirmOrder(){
  if (!cartList().length) {
    alert(lang === 'ar' ? 'الرجاء اختيار عنصر واحد على الأقل.' : 'Please select at least one item.');
    return;
  }
  renderCheckoutItems();
  const checkout = document.getElementById('checkout');
  if (checkout) checkout.classList.add('show');
  modeChanged();
}

function closeCheckout(){
  const checkout = document.getElementById('checkout');
  if (checkout) checkout.classList.remove('show');
}

function payPaypal(){
  alert(lang === 'ar' ? 'باي بال غير متاح حالياً.' : 'PayPal is currently unavailable.');
}

function payCash(){
  const mode = document.querySelector("input[name='mode']:checked")?.value || 'dine';
  const table = document.getElementById('table')?.value || '';
  const place = mode === 'take' ? (lang === 'ar' ? 'سفري' : 'Takeaway') : table;
  alert((lang === 'ar' ? 'تم تأكيد الطلب. سيصل النادل أو موظف الصالة لاستلام الدفع نقداً.' : 'Order confirmed. A waiter or floor staff will come for cash payment.') + '\n' + place);
}

function callWaiter(){
  const tableCount = 30;
  const message = lang === 'ar' ? 'أدخل رقم الطاولة من 1 إلى 30' : 'Enter your table number from 1 to 30';
  const input = prompt(message, '1');
  if (input === null) return;
  const number = Number(input);
  if (!Number.isInteger(number) || number < 1 || number > tableCount) {
    alert(lang === 'ar' ? 'رقم الطاولة غير صحيح.' : 'Invalid table number.');
    return;
  }
  alert((lang === 'ar' ? 'تم استدعاء النادل إلى طاولة ' : 'Waiter is coming to table ') + number);
}

function showMain(id,btn){
  document.querySelectorAll('.section').forEach(section => section.classList.remove('active'));
  document.getElementById(id)?.classList.add('active');
  document.querySelectorAll('.tabs button').forEach(button => button.classList.remove('active'));
  btn.classList.add('active');
}

function showSub(id,btn){
  const parent = btn.closest('.section');
  parent.querySelectorAll('.subsection').forEach(section => section.classList.remove('active'));
  document.getElementById(id)?.classList.add('active');
  parent.querySelectorAll('.subtabs button').forEach(button => button.classList.remove('active'));
  btn.classList.add('active');
}

function showMini(id,btn){
  const parent = btn.closest('.subsection');
  parent.querySelectorAll('.miniSection').forEach(section => section.classList.remove('active'));
  document.getElementById(id)?.classList.add('active');
  parent.querySelectorAll('.miniTabs button').forEach(button => button.classList.remove('active'));
  btn.classList.add('active');
}

function modeChanged(){
  const mode = document.querySelector("input[name='mode']:checked")?.value || 'dine';
  const table = document.getElementById('table');
  if (table) table.disabled = mode === 'take';
}

function setLang(nextLang,btn){
  lang = nextLang;
  document.documentElement.dir = nextLang === 'ar' ? 'rtl' : 'ltr';
  document.querySelectorAll('.lang button').forEach(button => button.classList.remove('active'));
  btn.classList.add('active');
  render();
}

function translate(){
  const tagline = document.getElementById('tagline');
  if (tagline) tagline.innerText = lang === 'ar' ? 'تجربة مقهى هادئة وأنيقة' : 'A calm and elegant cafe experience';
  document.querySelectorAll('[data-en]').forEach(el => { el.innerText = lang === 'ar' ? el.dataset.ar : el.dataset.en; });
  const table = document.getElementById('table');
  if (table) Array.from(table.options).forEach((option,index) => { option.text = lang === 'ar' ? 'طاولة ' + (index + 1) : 'Table ' + (index + 1); });
}

const tableElement = document.getElementById('table');
if (tableElement && tableElement.options.length === 0) {
  for(let i=1;i<=30;i++){
    const option = document.createElement('option');
    option.value = 'Table ' + i;
    option.text = 'Table ' + i;
    tableElement.add(option);
  }
}

render();
modeChanged();
