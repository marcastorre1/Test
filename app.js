const tg = window.Telegram.WebApp;
if (tg) { tg.ready(); tg.expand(); }

// ============================================
// ⚠️ НАСТРОЙКА
// ============================================
const TELEGRAM_USERNAME = 'pisdezix';  // твой ник БЕЗ @

// ============================================
// ОТКРЫТИЕ TELEGRAM
// ============================================
function openTelegram(service) {
    let text = 'Здравствуйте! Хочу заказать сайт.';
    if (service) {
        text = 'Здравствуйте! Хочу заказать: ' + service + '.';
    } else {
        text = 'Здравствуйте! Хочу заказать сайт. Расскажите про цены и сроки.';
    }
    const url = 'https://t.me/' + TELEGRAM_USERNAME + '?text=' + encodeURIComponent(text);
    if (tg) {
        tg.openTelegramLink(url);
    } else {
        window.open(url, '_blank');
    }
}

// ============================================
// ПОЯВЛЕНИЕ СЕКЦИЙ ПРИ ПРОКРУТКЕ
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

document.querySelectorAll('.reveal').forEach(function(el) {
    observer.observe(el);
});

// ============================================
// FAQ АККОРДЕОН
// ============================================
document.querySelectorAll('.faq-item').forEach(function(item) {
    item.querySelector('.faq-q').addEventListener('click', function() {
        const isOpen = item.classList.contains('open');
        document.querySelectorAll('.faq-item').forEach(function(i) {
            i.classList.remove('open');
        });
        if (!isOpen) item.classList.add('open');
    });
});

// ============================================
// 3D-НАКЛОН КАРТОЧЕК
// ============================================
document.querySelectorAll('.service-card, .work-card, .process-card, .price-card').forEach(function(card) {
    card.addEventListener('mousemove', function(e) {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = 'perspective(900px) rotateY(' + (x * 6) + 'deg) rotateX(' + (-y * 6) + 'deg) translateY(-4px)';
    });
    card.addEventListener('mouseleave', function() {
        card.style.transform = '';
    });
});
