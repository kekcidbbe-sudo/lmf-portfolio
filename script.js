// ============================================================
//  淼淼 · 作品集 —— 交互脚本
//  暖纸手作风：有意义的微交互，去掉通用光标
// ============================================================

const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(pointer: fine)').matches;

// ===== 语言切换 =====
let currentLang = 'zh';
const roleText = {
    zh: ['AI 独立开发者', '安卓 App 作者', '爱折腾的应届生', '把想法做完的人'],
    en: ['AI Indie Developer', 'Android App Maker', 'A tinkering new grad', 'A finisher of ideas']
};

function applyLang() {
    document.documentElement.lang = currentLang === 'zh' ? 'zh-CN' : 'en';
    document.getElementById('langLabel').textContent = currentLang === 'zh' ? 'EN' : '中';

    document.querySelectorAll('[data-zh]').forEach(el => {
        const text = el.getAttribute(`data-${currentLang}`);
        if (text == null) return;
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
            el.placeholder = text;
        } else {
            el.innerHTML = text; // 允许 <mark> 等内联标签
        }
    });

    document.title = currentLang === 'zh'
        ? '淼淼 — AI 驱动的独立开发者'
        : 'Miaomiao — AI-Powered Indie Developer';

    // 重置角色轮播
    roleIndex = 0;
    restartRoles();
}

document.getElementById('langToggle').addEventListener('click', () => {
    currentLang = currentLang === 'zh' ? 'en' : 'zh';
    applyLang();
});

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

// ===== 导航栏滚动态 + 顶部进度条 =====
const navbar = document.getElementById('navbar');
const progress = document.getElementById('scrollProgress');

function onScroll() {
    const y = window.scrollY;
    navbar.classList.toggle('scrolled', y > 40);

    const docH = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = (docH > 0 ? (y / docH) * 100 : 0) + '%';
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// ===== 角色轮播（打字/淡入） =====
const rolesEl = document.getElementById('heroRoles');
let roleIndex = 0;
let roleTimer = null;

function showRole() {
    if (!rolesEl) return;
    const list = roleText[currentLang];
    rolesEl.style.opacity = '0';
    rolesEl.style.transform = 'translateY(6px)';
    setTimeout(() => {
        rolesEl.textContent = list[roleIndex % list.length];
        rolesEl.style.transition = 'opacity .4s ease, transform .4s ease';
        rolesEl.style.opacity = '1';
        rolesEl.style.transform = 'translateY(0)';
        roleIndex++;
    }, 300);
}
function restartRoles() {
    if (roleTimer) clearInterval(roleTimer);
    showRole();
    if (!prefersReduced) roleTimer = setInterval(showRole, 2600);
}

// ===== 滚动揭示（IntersectionObserver，带交错） =====
const revealTargets = document.querySelectorAll(
    '.project-card, .exp-card, .about-lead, .about-content p, .facts li, .section-header, .contact-inner, .now-container'
);
revealTargets.forEach(el => el.classList.add('reveal'));

const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const siblings = Array.from(el.parentElement.children).filter(c => c.classList.contains('reveal'));
        const idx = Math.max(0, siblings.indexOf(el));
        setTimeout(() => el.classList.add('visible'), Math.min(idx, 5) * 90);

        // 触发手绘下划线
        el.querySelectorAll('.draw-path').forEach(p => p.classList.add('drawn'));
        io.unobserve(el);
    });
}, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

revealTargets.forEach(el => io.observe(el));

// Hero 里的手绘下划线首屏就画出来
setTimeout(() => {
    document.querySelectorAll('.hero .draw-path').forEach(p => p.classList.add('drawn'));
}, 600);

// ===== 磁吸按钮 =====
if (finePointer && !prefersReduced) {
    document.querySelectorAll('.magnetic').forEach(el => {
        const strength = 0.28;
        el.addEventListener('mousemove', (e) => {
            const r = el.getBoundingClientRect();
            const x = e.clientX - r.left - r.width / 2;
            const y = e.clientY - r.top - r.height / 2;
            el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
        });
        el.addEventListener('mouseleave', () => { el.style.transform = ''; });
    });
}

// ===== 卡片视差倾斜 + 聚光跟随 =====
if (finePointer && !prefersReduced) {
    document.querySelectorAll('.tilt-card').forEach(card => {
        const max = 6; // 最大倾斜角
        card.addEventListener('mousemove', (e) => {
            const r = card.getBoundingClientRect();
            const px = (e.clientX - r.left) / r.width;
            const py = (e.clientY - r.top) / r.height;
            const rx = (0.5 - py) * max;
            const ry = (px - 0.5) * max;
            card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`;
            // 聚光坐标
            card.style.setProperty('--mx', px * 100 + '%');
            card.style.setProperty('--my', py * 100 + '%');
        });
        card.addEventListener('mouseleave', () => { card.style.transform = ''; });
    });
}

// ===== Hero 拼贴视差（随滚动轻微移动） =====
if (!prefersReduced) {
    const collage = document.querySelector('.hero-collage');
    if (collage) {
        window.addEventListener('scroll', () => {
            const y = window.scrollY;
            if (y < window.innerHeight) {
                collage.style.transform = `translateY(${y * 0.06}px)`;
            }
        }, { passive: true });
    }
}

// ===== 跑马灯无缝：复制一份内容 =====
const track = document.getElementById('marqueeTrack');
if (track) {
    track.innerHTML += track.innerHTML;
}

// ===== 平滑滚动 =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const id = this.getAttribute('href');
        if (id === '#') return;
        const target = document.querySelector(id);
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth', block: 'start' });
        }
    });
});

// ===== 初始化 =====
applyLang();
