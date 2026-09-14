const tg = window.Telegram.WebApp;
if (tg) { tg.ready(); tg.expand(); }

// ============================================
// ЧАСЫ В ХЕДЕРЕ
// ============================================
function updateClock() {
    const now = new Date();
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    const el = document.getElementById('clock');
    if (el) el.textContent = `Сейчас: ${h}:${m}`;
}
updateClock();
setInterval(updateClock, 30000);

// ============================================
// ПОЯВЛЕНИЕ СЕКЦИЙ ПРИ ПРОКРУТКЕ
// ============================================
const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.classList.add('visible');
            }, i * 80);
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// ============================================
// 3D-НАКЛОН КАРТОЧЕК ПРИ ДВИЖЕНИИ МЫШИ
// ============================================
document.querySelectorAll('.step-card, .price-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `perspective(800px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
    });
});

// ============================================
// ПАРАЛЛАКС КУБА ПРИ ПРОКРУТКЕ
// ============================================
const cubeScene = document.querySelector('.cube-scene');
const heroGlow = document.querySelector('.cube-glow');
if (cubeScene) {
    let rafId;
    window.addEventListener('scroll', () => {
        if (rafId) return;
        rafId = requestAnimationFrame(() => {
            const y = window.scrollY;
            if (y < 800) {
                cubeScene.style.transform = `translateY(${y * 0.15}px)`;
                if (heroGlow) heroGlow.style.transform = `translateX(-50%) translateY(${y * 0.1}px)`;
            }
            rafId = null;
        });
    }, { passive: true });
}

// ============================================
// 3D-НАКЛОН КУБА ПРИ ДВИЖЕНИИ МЫШИ
// ============================================
const heroRight = document.querySelector('.hero-right');
if (heroRight && cubeScene) {
    heroRight.addEventListener('mousemove', (e) => {
        const rect = heroRight.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        cubeScene.style.animationPlayState = 'paused';
        cubeScene.style.transform = `rotateX(${-y * 20 - 25}deg) rotateY(${x * 40}deg)`;
    });
    heroRight.addEventListener('mouseleave', () => {
        cubeScene.style.animationPlayState = 'running';
        cubeScene.style.transform = '';
    });
}
