// ============================================
// TechHub - 增强版交互脚本
// ============================================

// ============================================
// 1. 主题切换
// ============================================
function initTheme() {
    const themeToggle = document.querySelector('.theme-toggle');
    const icon = themeToggle.querySelector('i');

    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
    } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    }

    themeToggle.addEventListener('click', function () {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        if (currentTheme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'light');
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
            localStorage.setItem('theme', 'light');
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
            localStorage.setItem('theme', 'dark');
        }
    });
}

// ============================================
// 2. 导航栏滚动效果
// ============================================
window.addEventListener('scroll', function () {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// ============================================
// 3. 移动端菜单
// ============================================
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', function () {
        navLinks.classList.toggle('active');
        this.classList.toggle('active');
    });
}

// ============================================
// 4. 平滑滚动到锚点
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                menuToggle.classList.remove('active');
            }
            window.scrollTo({
                top: targetElement.offsetTop - 70,
                behavior: 'smooth'
            });
        }
    });
});

// ============================================
// 5. 滚动动画
// ============================================
function animateOnScroll() {
    const elements = document.querySelectorAll('.tech-card, .project-card, .contact-card, .blog-card, .detail-item, .highlight-item');
    elements.forEach(element => {
        const elementPosition = element.getBoundingClientRect().top;
        const screenPosition = window.innerHeight / 1.3;
        if (elementPosition < screenPosition) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
}

document.addEventListener('DOMContentLoaded', function () {
    const animateElements = document.querySelectorAll('.tech-card, .project-card, .contact-card, .blog-card, .detail-item');
    animateElements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
    });

    const highlights = document.querySelectorAll('.highlight-item');
    highlights.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(10px)';
        element.style.transition = `opacity 0.5s ease ${0.4 + index * 0.1}s, transform 0.5s ease ${0.4 + index * 0.1}s`;
    });

    animateOnScroll();
    initTheme();
    updateActiveNav();
});

window.addEventListener('scroll', animateOnScroll);

// ============================================
// 6. 外部链接处理
// ============================================
document.querySelectorAll('a[href^="http"]').forEach(link => {
    link.setAttribute('target', '_blank');
    link.setAttribute('rel', 'noopener noreferrer');
});

// ============================================
// 7. 导航栏高亮当前section
// ============================================
function updateActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const navLinksAll = document.querySelectorAll('.nav-links a[href^="#"]');

    window.addEventListener('scroll', () => {
        let current = '';
        const scrollPosition = window.pageYOffset + 100;
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        navLinksAll.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// ============================================
// 8. 统计数字计数动画
// ============================================
function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

function observeStats() {
    const stats = document.querySelectorAll('.stat-number');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                const target = parseInt(entry.target.getAttribute('data-target'));
                animateCounter(entry.target, target);
                entry.target.classList.add('animated');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    stats.forEach(stat => observer.observe(stat));
}

window.addEventListener('load', function () {
    animateOnScroll();
    observeStats();
});

// ============================================
// ====== 以下为炫酷增强特效 ======
// ============================================

// ============================================
// 增强1: 交互式粒子网络
// ============================================
class ParticleNetwork {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.particleCount = 80;
        this.connectionDistance = 120;
        this.mouse = { x: -1000, y: -1000, radius: 150 };
        this.animationId = null;
        this.isVisible = true;

        this.resize();
        this.initParticles();
        this.bindEvents();
        this.animate();
    }

    resize() {
        const hero = document.querySelector('.hero');
        this.width = hero.offsetWidth;
        this.height = hero.offsetHeight;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.canvas.style.width = this.width + 'px';
        this.canvas.style.height = this.height + 'px';
    }

    initParticles() {
        this.particles = [];
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                vx: (Math.random() - 0.5) * 0.6,
                vy: (Math.random() - 0.5) * 0.6,
                size: Math.random() * 2.5 + 1,
                opacity: Math.random() * 0.6 + 0.2,
                pulseSpeed: Math.random() * 0.02 + 0.01,
                pulseOffset: Math.random() * Math.PI * 2
            });
        }
    }

    bindEvents() {
        window.addEventListener('resize', () => {
            this.resize();
            this.initParticles();
        });

        const hero = document.querySelector('.hero');
        hero.addEventListener('mousemove', (e) => {
            const rect = hero.getBoundingClientRect();
            this.mouse.x = e.clientX - rect.left;
            this.mouse.y = e.clientY - rect.top;
        });

        hero.addEventListener('mouseleave', () => {
            this.mouse.x = -1000;
            this.mouse.y = -1000;
        });

        // 标签页不可见时暂停动画
        document.addEventListener('visibilitychange', () => {
            this.isVisible = !document.hidden;
            if (this.isVisible && !this.animationId) {
                this.animate();
            }
        });
    }

    animate() {
        if (!this.isVisible) {
            this.animationId = null;
            return;
        }

        this.animationId = requestAnimationFrame(() => this.animate());
        this.ctx.clearRect(0, 0, this.width, this.height);

        const time = Date.now();

        // 更新并绘制粒子
        for (let i = 0; i < this.particles.length; i++) {
            const p = this.particles[i];

            // 移动
            p.x += p.vx;
            p.y += p.vy;

            // 鼠标交互 - 吸引
            const dx = this.mouse.x - p.x;
            const dy = this.mouse.y - p.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < this.mouse.radius) {
                const force = (this.mouse.radius - dist) / this.mouse.radius;
                const angle = Math.atan2(dy, dx);
                p.vx += Math.cos(angle) * force * 0.1;
                p.vy += Math.sin(angle) * force * 0.1;
            }

            // 速度阻尼
            p.vx *= 0.99;
            p.vy *= 0.99;

            // 边界回弹
            if (p.x < 0 || p.x > this.width) p.vx *= -1;
            if (p.y < 0 || p.y > this.height) p.vy *= -1;

            // 绘制粒子
            const pulse = Math.sin(time * p.pulseSpeed + p.pulseOffset) * 0.3 + 0.7;
            const alpha = p.opacity * pulse;
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(0, 217, 255, ${alpha})`;
            this.ctx.fill();

            // 发光效果
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size * 2.5, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(0, 217, 255, ${alpha * 0.15})`;
            this.ctx.fill();

            // 绘制连接线
            for (let j = i + 1; j < this.particles.length; j++) {
                const p2 = this.particles[j];
                const dx2 = p.x - p2.x;
                const dy2 = p.y - p2.y;
                const dist2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);

                if (dist2 < this.connectionDistance) {
                    const lineAlpha = (1 - dist2 / this.connectionDistance) * 0.3;
                    this.ctx.beginPath();
                    this.ctx.moveTo(p.x, p.y);
                    this.ctx.lineTo(p2.x, p2.y);
                    this.ctx.strokeStyle = `rgba(0, 217, 255, ${lineAlpha})`;
                    this.ctx.lineWidth = 0.5;
                    this.ctx.stroke();
                }
            }
        }
    }
}

// ============================================
// 增强2+6: 3D卡片倾斜 + 鼠标跟随发光
// ============================================
class CardTilt {
    constructor() {
        this.cards = document.querySelectorAll('.project-card, .tech-card, .contact-card, .blog-card');
        this.isMobile = window.innerWidth <= 768;
        this.init();
    }

    init() {
        if (this.isMobile) return;

        this.cards.forEach(card => {
            card.classList.add('tilt-enabled', 'card-glow');

            // 添加glare层
            const glare = document.createElement('div');
            glare.classList.add('card-glare');
            card.appendChild(glare);

            card.addEventListener('mousemove', (e) => this.onMouseMove(e, card));
            card.addEventListener('mouseenter', (e) => this.onMouseEnter(e, card));
            card.addEventListener('mouseleave', (e) => this.onMouseLeave(e, card));
        });
    }

    onMouseMove(e, card) {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // 更新CSS变量用于发光
        const mouseXPercent = (x / rect.width) * 100;
        const mouseYPercent = (y / rect.height) * 100;
        card.style.setProperty('--mouse-x', mouseXPercent + '%');
        card.style.setProperty('--mouse-y', mouseYPercent + '%');

        // 3D倾斜
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateY = ((x - centerX) / centerX) * 8;  // max ±8deg
        const rotateX = ((centerY - y) / centerY) * 8;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    }

    onMouseEnter(e, card) {
        card.style.transition = 'transform 0.1s ease-out, box-shadow 0.3s ease';
        card.style.boxShadow = '0 0 30px rgba(0, 217, 255, 0.3), 0 20px 50px rgba(0, 0, 0, 0.5)';
    }

    onMouseLeave(e, card) {
        card.style.transition = 'transform 0.6s cubic-bezier(0.23, 1, 0.32, 1), box-shadow 0.6s ease';
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        card.style.boxShadow = '';
        card.style.setProperty('--mouse-x', '50%');
        card.style.setProperty('--mouse-y', '50%');
    }
}

// ============================================
// 增强5: 自定义光标
// ============================================
class CustomCursor {
    constructor() {
        this.dot = document.querySelector('.cursor-dot');
        this.ring = document.querySelector('.cursor-ring');
        this.isMobile = window.innerWidth <= 768;
        if (this.isMobile) return;

        this.posX = 0;
        this.posY = 0;
        this.ringX = 0;
        this.ringY = 0;
        this.init();
    }

    init() {
        document.body.style.cursor = 'none';

        document.addEventListener('mousemove', (e) => {
            this.posX = e.clientX;
            this.posY = e.clientY;
            this.dot.style.left = this.posX + 'px';
            this.dot.style.top = this.posY + 'px';
        });

        // 环形光标平滑跟随
        const animate = () => {
            this.ringX += (this.posX - this.ringX) * 0.2;
            this.ringY += (this.posY - this.ringY) * 0.2;
            this.ring.style.left = this.ringX + 'px';
            this.ring.style.top = this.ringY + 'px';
            requestAnimationFrame(animate);
        };
        animate();

        // 交互元素hover效果
        const interactiveElements = document.querySelectorAll('a, button, .theme-toggle, .menu-toggle, .project-card, .tech-card, .contact-card, .blog-card, .btn, .nav-links a');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                this.dot.classList.add('cursor-hover');
                this.ring.classList.add('cursor-hover');
            });
            el.addEventListener('mouseleave', () => {
                this.dot.classList.remove('cursor-hover');
                this.ring.classList.remove('cursor-hover');
            });
        });
    }
}

// ============================================
// 增强3: Hero代码打字动画
// ============================================
class TypingAnimation {
    constructor() {
        this.codeElement = document.querySelector('.hero-code code');
        if (!this.codeElement) return;

        this.originalHTML = this.codeElement.innerHTML;
        this.fullText = this.codeElement.innerText;
        this.init();
    }

    init() {
        this.codeElement.innerHTML = '<span class="typing-cursor"></span>';
        this.typeText(0);
    }

    typeText(index) {
        if (index < this.fullText.length) {
            // 获取下一个字符
            const char = this.fullText.charAt(index);

            // 构建当前显示的HTML（带语法高亮）
            const textSoFar = this.fullText.substring(0, index + 1);

            // 使用原始HTML的高亮逻辑 - 简单的逐字符重建
            this.codeElement.innerHTML = this.highlightText(textSoFar) + '<span class="typing-cursor"></span>';

            // 随机速度让打字更自然
            const speed = Math.random() * 30 + 25;

            setTimeout(() => this.typeText(index + 1), speed);
        } else {
            // 完成 - 保持光标闪烁
            this.codeElement.innerHTML = this.originalHTML + '<span class="typing-cursor"></span>';
        }
    }

    highlightText(text) {
        // 简单语法高亮重建
        return text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/(".*?")/g, '<span class="code-string">$1</span>')
            .replace(/\b(const|let|var|function|return|if|else|class|new|this)\b/g, '<span class="code-keyword">$1</span>')
            .replace(/(\/\/.*)/g, '<span class="code-comment">$1</span>');
    }
}

// ============================================
// 增强7: 滚动进度条
// ============================================
function initScrollProgress() {
    const progressBar = document.querySelector('.scroll-progress');

    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (scrollTop / docHeight) * 100;
        progressBar.style.width = progress + '%';
    });
}

// ============================================
// 增强4: Glitch文字效果
// ============================================
class GlitchEffect {
    constructor() {
        this.initHeroGlitch();
        this.initSectionTitleGlitch();
    }

    // Hero标题周期性glitch
    initHeroGlitch() {
        const highlightTitle = document.querySelector('.title-line.highlight');
        if (!highlightTitle) return;

        highlightTitle.classList.add('glitch-text');
        highlightTitle.setAttribute('data-text', highlightTitle.textContent);

        // 每3-6秒随机触发一次glitch
        setInterval(() => {
            const delay = Math.random() * 3000 + 3000;
            setTimeout(() => {
                highlightTitle.classList.add('glitch-active');
                setTimeout(() => highlightTitle.classList.remove('glitch-active'), 400);
            }, delay);
        }, 500);
    }

    // 鼠标悬停时触发glitch
    initSectionTitleGlitch() {
        const titles = document.querySelectorAll('.section-title');
        titles.forEach(title => {
            title.addEventListener('mouseenter', () => {
                title.classList.add('glitch-active');
                title.style.textShadow = '-2px 0 #ff0080, 2px 0 #00d9ff, 0 0 15px var(--primary-color)';
            });
            title.addEventListener('mouseleave', () => {
                title.classList.remove('glitch-active');
                title.style.textShadow = '';
            });
            // 离开动画结束时清理
            title.addEventListener('animationend', () => {
                title.classList.remove('glitch-active');
                title.style.textShadow = '';
            });
        });
    }
}

// ============================================
// 额外: 浮动科技背景图标
// ============================================
class FloatingIcons {
    constructor() {
        this.icons = ['fa-code', 'fa-microchip', 'fa-brain', 'fa-robot', 'fa-plane', 'fa-wave-square', 'fa-network-wired', 'fa-server', 'fa-database', 'fa-cogs'];
        this.sections = document.querySelectorAll('section');
        this.init();
    }

    init() {
        this.sections.forEach(section => {
            // 每个section随机放1-2个浮动图标
            const count = Math.floor(Math.random() * 2) + 1;
            for (let i = 0; i < count; i++) {
                const icon = document.createElement('i');
                const iconClass = this.icons[Math.floor(Math.random() * this.icons.length)];
                icon.className = `fas ${iconClass} float-icon`;
                icon.style.left = Math.random() * 80 + 10 + '%';
                icon.style.top = Math.random() * 80 + 10 + '%';
                icon.style.animationDelay = -Math.random() * 15 + 's';
                section.appendChild(icon);
            }
        });
    }
}

// ============================================
// 初始化所有增强效果
// ============================================
document.addEventListener('DOMContentLoaded', function () {
    // 粒子网络
    const particleCanvas = document.getElementById('particleCanvas');
    if (particleCanvas) {
        new ParticleNetwork(particleCanvas);
    }

    // 3D卡片倾斜 + 发光
    new CardTilt();

    // 自定义光标
    new CustomCursor();

    // 打字动画
    setTimeout(() => {
        new TypingAnimation();
    }, 500);

    // 滚动进度条
    initScrollProgress();

    // Glitch效果
    new GlitchEffect();

    // 浮动图标
    new FloatingIcons();

    console.log('🚀 TechHub enhanced with all effects loaded!');
});
