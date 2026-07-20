// ===== 语言切换 =====
let currentLang = 'zh';

function toggleLang() {
    currentLang = currentLang === 'zh' ? 'en' : 'zh';
    document.documentElement.lang = currentLang === 'zh' ? 'zh-CN' : 'en';
    document.getElementById('langLabel').textContent = currentLang === 'zh' ? 'EN' : '中';

    document.querySelectorAll('[data-zh]').forEach(el => {
        const text = el.getAttribute(`data-${currentLang}`);
        if (text) {
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                el.placeholder = text;
            } else {
                el.textContent = text;
            }
        }
    });

    // 更新页面标题
    document.title = currentLang === 'zh'
        ? '苗苗 — AI 驱动的独立开发者'
        : 'Miaomiao — AI-Powered Indie Developer';
}

document.getElementById('langToggle').addEventListener('click', toggleLang);

// ===== 汉堡菜单 =====
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
});

navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
    });
});

// ===== 导航栏滚动效果 =====
const navbar = document.getElementById('navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    navbar.classList.toggle('scrolled', scrollY > 50);
    lastScroll = scrollY;
});

// ===== 自定义光标 =====
const cursorDot = document.getElementById('cursorDot');
const cursorRing = document.getElementById('cursorRing');

if (window.matchMedia('(pointer: fine)').matches) {
    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;

    document.addEventListener('mousemove', e => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursorDot.style.left = mouseX + 'px';
        cursorDot.style.top = mouseY + 'px';
    });

    function animateRing() {
        ringX += (mouseX - ringX) * 0.15;
        ringY += (mouseY - ringY) * 0.15;
        cursorRing.style.left = ringX + 'px';
        cursorRing.style.top = ringY + 'px';
        requestAnimationFrame(animateRing);
    }
    animateRing();

    // 悬停放大效果
    document.querySelectorAll('a, button, .stack-item, .exp-card, .project-card-large').forEach(el => {
        el.addEventListener('mouseenter', () => cursorRing.classList.add('hover'));
        el.addEventListener('mouseleave', () => cursorRing.classList.remove('hover'));
    });
}

// ===== 滚动动画 =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            // 添加延迟，让卡片依次出现
            setTimeout(() => {
                entry.target.classList.add('visible');
            }, index * 80);
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// 给需要动画的元素添加 fade-in class
document.querySelectorAll('.project-card-large, .exp-card, .about-content p, .contact-item').forEach(el => {
    el.classList.add('fade-in');
    observer.observe(el);
});

// ===== 终端打字效果 =====
const terminalBody = document.querySelector('.terminal-body');
if (terminalBody) {
    const lines = terminalBody.querySelectorAll('.terminal-line');
    lines.forEach((line, i) => {
        line.style.opacity = '0';
        line.style.transform = 'translateY(4px)';
        setTimeout(() => {
            line.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            line.style.opacity = '1';
            line.style.transform = 'translateY(0)';
        }, 300 + i * 120);
    });
}

// ===== 平滑滚动 =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});
