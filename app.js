document.getElementById('year').textContent = new Date().getFullYear();

const MANAGER = 'markulik52';

/* ============================================================
   ТОВАРЫ — добавляйте, меняйте и удаляйте прямо здесь.
   Каждый товар — один объект { ... } внутри массива ниже.
   Поля:
     id    — уникальный текст/число, не должен повторяться
     name  — название товара
     cat   — категория (по ней работают фильтры сверху каталога)
     price — цена в евро, просто число, без символа €
     img   — ссылка на фото товара
     desc  — короткое описание
   Чтобы добавить товар — скопируйте один блок { ... }, вставьте
   запятую после последнего блока и впишите свои данные.
   Чтобы удалить товар — сотрите его блок { ... } целиком.
============================================================ */
const products = [
  { id:'p1', name:'Худи Oversize Black', cat:'худи', price:89, img:'file_00000000c55081f4b6c864f8d996155f.png' },
  { id:'p2', name:'Футболка Essential White', cat:'футболки', price:39, img:'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80', desc:'Тяжёлый хлопок, прямой силуэт, не садится после стирки.' },
  { id:'p3', name:'Брюки Cargo Olive', cat:'брюки', price:99, img:'https://images.unsplash.com/photo-1517438476312-10d79c077509?w=600&q=80', desc:'Карго-карманы, зауженный низ, плотная ткань рип-стоп.' },
  { id:'p4', name:'Куртка Windbreaker Purple', cat:'куртки', price:129, img:'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&q=80', desc:'Лёгкая непродуваемая ткань, светоотражающие вставки.' },
  { id:'p5', name:'Свитшот Minimal Grey', cat:'худи', price:74, img:'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&q=80', desc:'Начёс изнутри, рибана на манжетах, minimal-принт.' },
  { id:'p6', name:'Шапка Beanie Violet', cat:'аксессуары', price:24, img:'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=600&q=80', desc:'Плотная вязка, шерсть с акрилом, один размер.' },
];

function telegramLink(name, price){
  const text = `Здравствуйте! Хочу купить: "${name}" — €${price}. Подскажите наличие и как оформить заказ.`;
  return `https://t.me/${MANAGER}?text=${encodeURIComponent(text)}`;
}

document.getElementById('headerTg').href = `https://t.me/${MANAGER}`;
document.getElementById('heroTg').href = `https://t.me/${MANAGER}`;

let activeFilter = 'все';

function renderFilters(){
  const cats = ['все', ...new Set(products.map(p=>p.cat).filter(Boolean))];
  const el = document.getElementById('filters');
  el.innerHTML = cats.map(c =>
    `<button class="filter-btn ${c===activeFilter?'active':''}" data-cat="${c}">${c}</button>`
  ).join('');
  el.querySelectorAll('.filter-btn').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      activeFilter = btn.dataset.cat;
      renderGrid();
      renderFilters();
    });
  });
}

function renderGrid(){
  const grid = document.getElementById('grid');
  const list = activeFilter === 'все' ? products : products.filter(p=>p.cat===activeFilter);

  if(list.length === 0){
    grid.innerHTML = `<div class="empty-state">В этой категории пока пусто. Загляните чуть позже.</div>`;
    return;
  }

  grid.innerHTML = list.map((p, i) => `
    <div class="card" style="--d:${i * 0.08}s">
      <div class="card-img" style="background-image:url('${p.img || ''}')">
        <span class="tag">${p.cat || 'вещь'}</span>
      </div>
      <div class="card-body">
        <h3>${p.name}</h3>
        <div class="desc">${p.desc || ''}</div>
        <div class="card-foot">
          <div class="price">€${p.price}</div>
          <button class="buy-btn" onclick="window.open('${telegramLink(p.name.replace(/'/g,"\\'"), p.price)}','_blank')">Купить</button>
        </div>
      </div>
    </div>
  `).join('');

  observeCards();
}

renderFilters();
renderGrid();

/* ---- scroll-анимации: карточки, заголовки секций, шаги ---- */
const cardObserver = new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      entry.target.classList.add('in');
      cardObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

function observeCards(){
  document.querySelectorAll('.card:not(.in)').forEach(card => cardObserver.observe(card));
}

const revealObserver = new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      entry.target.classList.add('in');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

document.querySelectorAll('.step').forEach((step, i)=>{
  step.style.setProperty('--d', `${i * 0.12}s`);
  revealObserver.observe(step);
});
                             
