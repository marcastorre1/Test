// ============================================
// ЧАСЫ В ХЕДЕРЕ
// ============================================
function updateClock() {
    const now = new Date();
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    const el = document.getElementById('clock');
    if (el) el.textContent = 'Сейчас: ' + h + ':' + m;
}
updateClock();
setInterval(updateClock, 30000);

// ============================================
// ПОЯВЛЕНИЕ СЕКЦИЙ ПРИ ПРОКРУТКЕ
// ============================================
const observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry, i) {
        if (entry.isIntersecting) {
            setTimeout(function() {
                entry.target.classList.add('visible');
            }, i * 80);
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.reveal').forEach(function(el) {
    observer.observe(el);
});

// ============================================
// 3D-НАКЛОН КАРТОЧЕК ПРИ ДВИЖЕНИИ МЫШИ
// ============================================
document.querySelectorAll('.step-card, .price-card').forEach(function(card) {
    card.addEventListener('mousemove', function(e) {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = 'perspective(800px) rotateY(' + (x * 8) + 'deg) rotateX(' + (-y * 8) + 'deg) translateY(-4px)';
    });
    card.addEventListener('mouseleave', function() {
        card.style.transform = '';
    });
});

// ============================================
// ПАРАЛЛАКС КУБА ПРИ ПРОКРУТКЕ
// ============================================
const cubeScene = document.querySelector('.cube-scene');
if (cubeScene) {
    window.addEventListener('scroll', function() {
        const y = window.scrollY;
        if (y < 800) {
            cubeScene.style.transform = 'translateY(' + (y * 0.15) + 'px)';
        }
    }, { passive: true });
}

// ============================================
// 3D-НАКЛОН КУБА ПРИ ДВИЖЕНИИ МЫШИ
// ============================================
const heroRight = document.querySelector('.hero-right');
if (heroRight && cubeScene) {
    heroRight.addEventListener('mousemove', function(e) {
        const rect = heroRight.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        cubeScene.style.animationPlayState = 'paused';
        cubeScene.style.transform = 'rotateX(' + (-y * 20 - 25) + 'deg) rotateY(' + (x * 40) + 'deg)';
    });
    heroRight.addEventListener('mouseleave', function() {
        cubeScene.style.animationPlayState = 'running';
        cubeScene.style.transform = '';
    });
}
