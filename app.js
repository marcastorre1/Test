const tg = window.Telegram.WebApp;
if (tg) { tg.ready(); tg.expand(); }

// ============================================
// ⚠️ НАСТРОЙКИ
// ============================================
const MANAGER_USERNAME = 'pisdezix';   // твой ник БЕЗ @
const EUR_RATE = 19.9;

// ============================================
// ТОВАРЫ
// price: 0 → "Под заказ"
// ============================================
const products = [
    { id: 1, name: 'Футболка Oversize Black', price: 490, category: 'Футболки',
      img: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500'] },
    { id: 2, name: 'Худи унисекс Grey', price: 890, category: 'Худи',
      img: ['https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500'] },
    { id: 3, name: 'Джинсы Slim Blue', price: 1190, category: 'Штаны',
      img: ['https://images.unsplash.com/photo-1542272604-787c3835535d?w=500'] },
    { id: 4, name: 'Куртка Bomber', price: 1890, category: 'Куртки',
      img: ['https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500'] },
    { id: 5, name: 'Кепка Classic', price: 290, category: 'Аксессуары',
      img: ['https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=500'] },
    { id: 6, name: 'Кроссовки Runner', price: 1590, category: 'Обувь',
      img: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500'] },
    { id: 7, name: 'Футболка White', price: 0, category: 'Футболки',
      img: ['https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=500'] },
    { id: 8, name: 'Худи Black Premium', price: 1090, category: 'Худи',
      img: ['https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=500'] },
];

let cart = {};
let currentCategory = 'Все';

// ============================================
// ПОМОЩНИКИ
// ============================================
function getImages(p) { return Array.isArray(p.img) ? p.img : [p.img]; }
function toEur(mdl) { return (mdl / EUR_RATE).toFixed(0); }

// ============================================
// КАТЕГОРИИ
// ============================================
const categories = ['Все', ...new Set(products.map(p => p.category))];
const categoriesEl = document.getElementById('categories');

categories.forEach(cat => {
    const btn = document.createElement('button');
    btn.className = 'cat-btn';
    btn.innerText = cat;
    btn.dataset.cat = cat;
    btn.style.cssText = 'padding: 8px 16px; border-radius: 100px; border: 1px solid rgba(124,58,237,0.2); background: transparent; color: #6b6b80; font-size: 12px; font-weight: 600; cursor: pointer; font-family: inherit; transition: all 0.3s;';
    if (cat === currentCategory) {
        btn.style.background = 'linear-gradient(135deg, #7c3aed, #ec4899)';
        btn.style.color = '#fff';
        btn.style.borderColor = 'transparent';
    }
    btn.onclick = () => {
        currentCategory = cat;
        document.querySelectorAll('.cat-btn').forEach(b => {
            b.style.background = 'transparent';
            b.style.color = '#6b6b80';
            b.style.borderColor = 'rgba(124,58,237,0.2)';
        });
        btn.style.background = 'linear-gradient(135deg, #7c3aed, #ec4899)';
        btn.style.color = '#fff';
        btn.style.borderColor = 'transparent';
        renderProducts();
    };
    categoriesEl.appendChild(btn);
});

// ============================================
// КАТАЛОГ
// ============================================
const productsEl = document.getElementById('products');

function renderProducts() {
    productsEl.innerHTML = '';
    const filtered = currentCategory === 'Все'
        ? products
        : products.filter(p => p.category === currentCategory);

    filtered.forEach((p, i) => {
        const firstImg = getImages(p)[0];
        const priceHtml = p.price > 0
            ? `<div class="product-price">${p.price} MDL</div>
               <div class="product-price-eur">~${toEur(p.price)} €</div>`
            : `<div class="product-price product-order">Под заказ</div>
               <div class="product-price-eur">Цена по запросу</div>`;

        const card = document.createElement('div');
        card.className = 'product-card';
        card.style.animationDelay = (i * 0.05) + 's';
        card.innerHTML = `
            <div class="product-img-wrap">
                <img src="${firstImg}" alt="${p.name}" loading="lazy"
                     onerror="this.src='https://via.placeholder.com/400x400/faf5ff/7c3aed?text=WEAR'">
                <button class="product-add" data-id="${p.id}">+</button>
            </div>
            <div class="product-info">
                <h3>${p.name}</h3>
                ${priceHtml}
            </div>
        `;
        productsEl.appendChild(card);
    });
}

renderProducts();

function filterCategory(cat) {
    document.getElementById('catalog').scrollIntoView({ behavior: 'smooth' });
    setTimeout(() => {
        const btn = [...document.querySelectorAll('.cat-btn')].find(b => b.dataset.cat === cat);
        if (btn) btn.click();
    }, 400);
}

// ============================================
// ДОБАВЛЕНИЕ В КОРЗИНУ
// ============================================
document.body.addEventListener('click', (e) => {
    const btn = e.target.closest('.product-add');
    if (btn) {
        e.stopPropagation();
        const id = Number(btn.dataset.id);
        cart[id] = (cart[id] || 0) + 1;
        updateCart();
        if (tg) tg.HapticFeedback?.impactOccurred('light');
    }
});

// ============================================
// КОРЗИНА
// ============================================
function updateCart() {
    let count = 0, total = 0;
    let hasOnOrder = false;

    for (const id in cart) {
        const p = products.find(pr => pr.id === Number(id));
        count += cart[id];
        if (p.price > 0) total += p.price * cart[id];
        else hasOnOrder = true;
    }
    const eurTotal = toEur(total);

    document.getElementById('cartBadge').innerText = count;
    document.getElementById('barCount').innerText = count;

    let barText;
    if (total > 0 && hasOnOrder) barText = total + ' + заказ';
    else if (total > 0) barText = total;
    else barText = 'Под заказ';
    document.getElementById('barTotal').innerText = barText;

    if (total > 0 && hasOnOrder) {
        document.getElementById('modalTotal').innerHTML = total + ' MDL<br><span style="font-size:11px;opacity:0.6;">+ товары под заказ</span>';
    } else if (total > 0) {
        document.getElementById('modalTotal').innerHTML = total + ' MDL<br><span style="font-size:13px;opacity:0.6;">~' + eurTotal + ' €</span>';
    } else {
        document.getElementById('modalTotal').innerHTML = 'Под заказ';
    }

    renderCartItems();

    const badge = document.getElementById('cartBadge');
    badge.classList.remove('pop');
    void badge.offsetWidth;
    badge.classList.add('pop');
}

function renderCartItems() {
    const container = document.getElementById('cartItems');
    container.innerHTML = '';
    if (Object.keys(cart).length === 0) {
        container.innerHTML = '<p style="opacity:0.5;padding:30px 0;text-align:center;font-size:14px;">Корзина пуста</p>';
        return;
    }
    for (const id in cart) {
        const p = products.find(pr => pr.id === Number(id));
        const firstImg = getImages(p)[0];
        const priceText = p.price > 0
            ? p.price + ' MDL · ~' + toEur(p.price) + ' €'
            : 'Под заказ';
        const item = document.createElement('div');
        item.className = 'cart-item';
        item.innerHTML = `
            <img src="${firstImg}" alt="${p.name}">
            <div class="cart-item-info">
                <h4>${p.name}</h4>
                <span>${priceText}</span>
            </div>
            <div class="qty-controls">
                <button data-action="minus" data-id="${p.id}">−</button>
                <span>${cart[id]}</span>
                <button data-action="plus" data-id="${p.id}">+</button>
            </div>
        `;
        container.appendChild(item);
    }
}

document.getElementById('cartItems').addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;
    const id = Number(btn.dataset.id);
    if (btn.dataset.action === 'plus') cart[id]++;
    else if (btn.dataset.action === 'minus') {
        cart[id]--;
        if (cart[id] <= 0) delete cart[id];
    }
    updateCart();
});

// ============================================
// МОДАЛКИ
// ============================================
const cartModal = document.getElementById('cartModal');
const managerModal = document.getElementById('managerModal');

document.getElementById('openCartBtn').addEventListener('click', () => {
    renderCartItems();
    cartModal.classList.add('open');
});
document.getElementById('cartIconBtn').addEventListener('click', () => {
    renderCartItems();
    cartModal.classList.add('open');
});
document.getElementById('closeCartBtn').addEventListener('click', () => cartModal.classList.remove('open'));
cartModal.addEventListener('click', (e) => { if (e.target === cartModal) cartModal.classList.remove('open'); });
document.getElementById('closeManagerBtn').addEventListener('click', () => managerModal.classList.remove('open'));
managerModal.addEventListener('click', (e) => { if (e.target === managerModal) managerModal.classList.remove('open'); });

// ============================================
// ОФОРМЛЕНИЕ
// ============================================
document.getElementById('checkoutBtn').addEventListener('click', () => {
    if (Object.keys(cart).length === 0) {
        if (tg) tg.showAlert('Корзина пуста!');
        else alert('Корзина пуста!');
        return;
    }

    const order = [];
    let total = 0, hasOnOrder = false;

    for (const id in cart) {
        const p = products.find(pr => pr.id === Number(id));
        order.push({ name: p.name, price: p.price, qty: cart[id], sum: p.price * cart[id] });
        if (p.price > 0) total += p.price * cart[id];
        else hasOnOrder = true;
    }

    const eurTotal = toEur(total);
    const orderText = order.map(i =>
        i.price > 0
            ? '• ' + i.name + ' × ' + i.qty + ' — ' + i.sum + ' MDL (~' + toEur(i.sum) + ' €)'
            : '• ' + i.name + ' × ' + i.qty + ' — Под заказ'
    ).join('\n');

    let totalText;
    if (total > 0 && hasOnOrder) totalText = total + ' MDL (~' + eurTotal + ' €) + товары под заказ';
    else if (total > 0) totalText = total + ' MDL (~' + eurTotal + ' €)';
    else totalText = 'Всё под заказ';

    const message = 'Здравствуйте! Хочу оформить заказ в WEAR:\n\n' + orderText + '\n\nИтого: ' + totalText;

    cartModal.classList.remove('open');
    managerModal.classList.add('open');

    document.getElementById('writeManagerBtn').onclick = () => {
        const url = 'https://t.me/' + MANAGER_USERNAME + '?text=' + encodeURIComponent(message);
        if (tg) tg.openTelegramLink(url);
        else window.open(url, '_blank');
        managerModal.classList.remove('open');
        if (tg) tg.close();
    };
});

// ============================================
// ПОЯВЛЕНИЕ СЕКЦИЙ
// ============================================
const observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry, i) {
        if (entry.isIntersecting) {
            setTimeout(function() {
                entry.target.classList.add('visible');
            }, i * 60);
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// ============================================
// FAQ
// ============================================
document.querySelectorAll('.faq-item').forEach(item => {
    item.querySelector('.faq-q').addEventListener('click', () => {
        const isOpen = item.classList.contains('open');
        document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
        if (!isOpen) item.classList.add('open');
    });
});

// ============================================
// ПАРАЛЛАКС СФЕР
// ============================================
const spheres = document.querySelectorAll('.hero-sphere');
window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (y < 600) {
        spheres.forEach((s, i) => {
            const speed = 0.05 + (i * 0.03);
            s.style.transform = 'translateY(' + (y * speed) + 'px)';
        });
    }
}, { passive: true });
