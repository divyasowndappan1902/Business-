document.addEventListener('DOMContentLoaded', () => {
    // Mobile menu toggle is now handled by inline onclick in HTML

    // Redirect all dummy buttons and forms to 404
    const dummyButtons = document.querySelectorAll('button:not(#nav-toggle):not([onclick]), input[type="submit"]');
    dummyButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = '404.html';
        });
    });

    // 3D Background Canvas Initialization
    init3DHeroBackground();

    // Scroll Reveal Animations
    initScrollReveal();
});

function init3DHeroBackground() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width, height;

    function resize() {
        width = canvas.parentElement.offsetWidth;
        height = canvas.parentElement.offsetHeight;
        canvas.width = width;
        canvas.height = height;
    }
    window.addEventListener('resize', resize);
    resize();

    const particles = [];
    const numParticles = 120;
    const fov = 250;

    class Particle {
        constructor() {
            this.x = (Math.random() * width * 2) - width;
            this.y = (Math.random() * height * 2) - height;
            this.z = Math.random() * width;
            this.speed = Math.random() * 2 + 1;
        }
        update() {
            this.z -= this.speed;
            if (this.z <= 0) {
                this.x = (Math.random() * width * 2) - width;
                this.y = (Math.random() * height * 2) - height;
                this.z = width;
                this.speed = Math.random() * 2 + 1;
            }
        }
        draw() {
            let x2d = (this.x * fov) / this.z + width / 2;
            let y2d = (this.y * fov) / this.z + height / 2;
            let size = (3 * fov) / this.z;

            if (x2d >= 0 && x2d <= width && y2d >= 0 && y2d <= height && size > 0) {
                ctx.beginPath();
                ctx.arc(x2d, y2d, size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(6, 182, 212, ${1 - (this.z / width)})`; // Aqua color matching UI
                ctx.fill();
            }
        }
    }

    for (let i = 0; i < numParticles; i++) {
        particles.push(new Particle());
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animate);
    }
    animate();
}

function initScrollReveal() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const animateElements = document.querySelectorAll('.service-card, .about-split__media, .about-split__content, .testimonial-card, .cta-box, .animate-scroll');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        observer.observe(el);
    });
}
