const ADMIN_PASSWORD = "marca2026";
const MANAGER_USERNAME = "markulik52";

let products = [];
let cart = []; // {id, qty}

const gridWrap = document.getElementById('gridWrap');
const drawer = document.getElementById('drawer');
const overlay = document.getElementById('overlay');
const cartBtn = document.getElementById('cartBtn');
const closeDrawer = document.getElementById('closeDrawer');
const drawerBody = document.getElementById('drawerBody');
const cartCount = document.getElementById('cartCount');
const totalPrice = document.getElementById('totalPrice');
const checkoutBtn = document.getElementById('checkoutBtn');
const toast = document.getElementById('toast');

const loginOverlay = document.getElementById('loginOverlay');
const logoTrigger = document.getElementById('logoTrigger');
const cancelLogin = document.getElementById('cancelLogin');
const submitLogin = document.getElementById('submitLogin');
const adminPasswordInput = document.getElementById('adminPassword');
const loginErr = document.getElementById('loginErr');
const adminPanel = document.getElementById('adminPanel');
const closeAdmin = document.getElementById('closeAdmin');
const adminList = document.getElementById('adminList');
const adminCount = document.getElementById('adminCount');

function showToast(msg){
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(()=>toast.classList.remove('show'), 2200);
}

function fmt(n){ return n.toFixed(0) + '€'; }

async function loadProducts(){
  try{
    const res = await window.storage.get('products', true);
    products = res && res.value ? JSON.parse(res.value) : [];
  }catch(e){
    products = [];
  }
  renderCatalog();
  renderAdminList();
}

async function saveProducts(){
  await window.storage.set('products', JSON.stringify(products), true);
}

function renderCatalog(){
  if(!products.length){
    gridWrap.innerHTML = `
      <div class="empty-state">
        <h3>Каталог пока пуст</h3>
        <p>Новые вещи скоро появятся здесь. Загляните чуть позже или напишите нам в Telegram.</p>
      </div>`;
    return;
  }
  gridWrap.innerHTML = `<div class="grid">${products.map(p => `
    <div class="card">
      <div class="card-img"><img src="${escapeHtml(p.image)}" alt="${escapeHtml(p.name)}" onerror="this.style.opacity=0"></div>
      <div class="card-body">
        <div class="card-name">${escapeHtml(p.name)}</div>
        <div class="card-desc">${escapeHtml(p.description||'')}</div>
        <div class="card-foot">
          <span class="price">${fmt(p.price)}</span>
          <button class="add-btn" onclick="addToCart('${p.id}')">В корзину</button>
        </div>
      </div>
    </div>`).join('')}</div>`;
}

function escapeHtml(str){
  const d = document.createElement('div');
  d.textContent = str || '';
  return d.innerHTML;
}

function addToCart(id){
  const existing = cart.find(c => c.id === id);
  if(existing){ existing.qty++; }
  else{ cart.push({id, qty:1}); }
  renderCart();
  showToast('Добавлено в корзину');
  openDrawer();
}

function changeQty(id, delta){
  const item = cart.find(c => c.id === id);
  if(!item) return;
  item.qty += delta;
  if(item.qty <= 0){ cart = cart.filter(c => c.id !== id); }
  renderCart();
}

function removeFromCart(id){
  cart = cart.filter(c => c.id !== id);
  renderCart();
}

function renderCart(){
  const totalItems = cart.reduce((s,c)=>s+c.qty,0);
  cartCount.textContent = totalItems;

  if(!cart.length){
    drawerBody.innerHTML = `<div class="cart-empty">Корзина пуста</div>`;
    totalPrice.textContent = fmt(0);
    checkoutBtn.disabled = true;
    return;
  }

  let total = 0;
  drawerBody.innerHTML = cart.map(c => {
    const p = products.find(pr => pr.id === c.id);
    if(!p) return '';
    total += p.price * c.qty;
    return `
      <div class="cart-item">
        <img src="${escapeHtml(p.image)}" onerror="this.style.opacity=0">
        <div class="cart-item-info">
          <div class="name">${escapeHtml(p.name)}</div>
          <span class="price">${fmt(p.price)}</span>
          <div class="qty-row">
            <button onclick="changeQty('${p.id}',-1)">–</button>
            <span>${c.qty}</span>
            <button onclick="changeQty('${p.id}',1)">+</button>
          </div>
          <button class="remove-btn" onclick="removeFromCart('${p.id}')">Удалить</button>
        </div>
      </div>`;
  }).join('');
  totalPrice.textContent = fmt(total);
  checkoutBtn.disabled = false;
}

function openDrawer(){ drawer.classList.add('open'); overlay.classList.add('open'); }
function closeDrawerFn(){ drawer.classList.remove('open'); overlay.classList.remove('open'); }

cartBtn.addEventListener('click', openDrawer);
closeDrawer.addEventListener('click', closeDrawerFn);
overlay.addEventListener('click', ()=>{ closeDrawerFn(); closeLogin(); });

checkoutBtn.addEventListener('click', () => {
  let total = 0;
  const lines = cart.map(c => {
    const p = products.find(pr => pr.id === c.id);
    if(!p) return '';
    total += p.price * c.qty;
    return `— ${p.name} x${c.qty} (${fmt(p.price)} шт.)`;
  }).join('\n');

  const text = `Здравствуйте! Хочу оформить заказ с MARCA.STORRE:\n${lines}\n\nИтого: ${fmt(total)}`;
  const url = `https://t.me/${MANAGER_USERNAME}?text=${encodeURIComponent(text)}`;
  window.open(url, '_blank');
});

/* ADMIN AUTH */
function openLogin(){ loginOverlay.classList.add('open'); adminPasswordInput.value=''; loginErr.style.display='none'; adminPasswordInput.focus(); }
function closeLogin(){ loginOverlay.classList.remove('open'); }

/* Скрытый доступ к управлению: 5 нажатий на логотип подряд в течение 2 секунд */
let logoClicks = 0;
let logoClickTimer = null;
logoTrigger.addEventListener('click', () => {
  logoClicks++;
  clearTimeout(logoClickTimer);
  logoClickTimer = setTimeout(() => { logoClicks = 0; }, 2000);
  if(logoClicks >= 5){
    logoClicks = 0;
    clearTimeout(logoClickTimer);
    openLogin();
  }
});

cancelLogin.addEventListener('click', closeLogin);

submitLogin.addEventListener('click', () => {
  if(adminPasswordInput.value === ADMIN_PASSWORD){
    closeLogin();
    adminPanel.classList.add('open');
    renderAdminList();
  }else{
    loginErr.style.display='block';
  }
});
adminPasswordInput.addEventListener('keydown', (e)=>{ if(e.key==='Enter') submitLogin.click(); });

closeAdmin.addEventListener('click', () => adminPanel.classList.remove('open'));

/* ADMIN PRODUCT MANAGEMENT */
document.getElementById('addProductBtn').addEventListener('click', async () => {
  const name = document.getElementById('pName').value.trim();
  const price = parseFloat(document.getElementById('pPrice').value);
  const image = document.getElementById('pImage').value.trim() || 'https://picsum.photos/seed/' + Date.now() + '/400/500';
  const description = document.getElementById('pDesc').value.trim();

  if(!name || isNaN(price)){
    showToast('Заполните название и цену');
    return;
  }

  products.push({ id: 'p'+Date.now(), name, price, image, description });
  await saveProducts();
  renderCatalog();
  renderAdminList();
  showToast('Товар добавлен');

  document.getElementById('pName').value='';
  document.getElementById('pPrice').value='';
  document.getElementById('pImage').value='';
  document.getElementById('pDesc').value='';
});

function renderAdminList(){
  adminCount.textContent = products.length;
  if(!products.length){
    adminList.innerHTML = `<p style="color:var(--ink-dim);font-size:0.88rem;">Пока нет добавленных товаров.</p>`;
    return;
  }
  adminList.innerHTML = products.map(p => `
    <div class="admin-list-item">
      <img src="${escapeHtml(p.image)}" onerror="this.style.opacity=0">
      <div class="info">
        <div class="n">${escapeHtml(p.name)}</div>
        <div class="p">${fmt(p.price)}</div>
      </div>
      <button class="del-btn" onclick="deleteProduct('${p.id}')">Удалить</button>
    </div>`).join('');
}

async function deleteProduct(id){
  products = products.filter(p => p.id !== id);
  await saveProducts();
  renderCatalog();
  renderAdminList();
  showToast('Товар удалён');
}

loadProducts();
                                                   
