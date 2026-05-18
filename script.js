const person = document.querySelector(".person");

if (person) {
    window.addEventListener("mousemove", e => {
        let x = (e.clientX / window.innerWidth - 0.5) * 20;
        let y = (e.clientY / window.innerHeight - 0.5) * 20;

        person.style.transform = `translate(${x}px, ${y}px)`;
    });
}

const toggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".pill-nav");
const navLinks = document.querySelectorAll(".pill-nav a");

/* Toggle Menu */
toggle.addEventListener("click", () => {
    nav.classList.toggle("active");

    // Change icon
    if (nav.classList.contains("active")) {
        toggle.textContent = "✕";  // show close icon
    } else {
        toggle.textContent = "☰";  // show hamburger
    }
});

/* Close menu when link clicked */
navLinks.forEach(link => {
    link.addEventListener("click", () => {
        nav.classList.remove("active");
        toggle.textContent = "☰";
    });
});


const roles = [
    "AIML Developer",
    "Full-Stack Developer"
];

const typingElement = document.getElementById("typing-role");

let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeEffect() {
    const currentRole = roles[roleIndex];

    if (!isDeleting) {
        typingElement.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;

        if (charIndex === currentRole.length) {
            setTimeout(() => isDeleting = true, 1200);
        }
    } else {
        typingElement.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;

        if (charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
        }
    }

    setTimeout(typeEffect, isDeleting ? 50 : 90);
}

typeEffect();


/* ========================= */
/* Fullscreen Fade Cards     */
/* ========================= */

(function () {
    const cards = document.querySelectorAll('.project-card');
    if (!cards.length) return;

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                const card = entry.target;
                if (entry.isIntersecting) {
                    card.classList.add('active');
                } else {
                    card.classList.remove('active');
                }
            });
        },
        {
            threshold: 0.5
        }
    );

    cards.forEach((card) => observer.observe(card));
})();


/* ============ NEW HOME SECTION JS ============ */

(function () {

    const home = document.querySelector('.home');
    if (!home) return; // Only run on pages with the new home section

    /* ── 1. Fade-Up Entrance Animations ── */
    const fadeElements = document.querySelectorAll('.fade-up');
    const techCards = document.querySelectorAll('.tech-card');
    const techBadges = document.querySelectorAll('.tech-banner');

    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                fadeObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    fadeElements.forEach(el => fadeObserver.observe(el));
    techCards.forEach(el => fadeObserver.observe(el));
    techBadges.forEach(el => fadeObserver.observe(el));

    /* ── 2. Animated Progress Bars (commented out — replaced by badge wall) ── */
    // const progressObserver = new IntersectionObserver((entries) => {
    //     entries.forEach((entry) => {
    //         if (entry.isIntersecting) {
    //             const fill = entry.target.querySelector('.progress-fill');
    //             if (fill) {
    //                 const progress = entry.target.getAttribute('data-progress');
    //                 if (progress) {
    //                     fill.style.width = progress + '%';
    //                 }
    //             }
    //             progressObserver.unobserve(entry.target);
    //         }
    //     });
    // }, { threshold: 0.3 });

    // document.querySelectorAll('.tech-card').forEach(card => progressObserver.observe(card));

    /* ── 3. Floating Particles ── */
    const particlesContainer = document.getElementById('particles-container');
    if (particlesContainer) {
        const particleCount = window.innerWidth < 600 ? 20 : 40;

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            const size = Math.random() * 3 + 2;
            particle.style.width = size + 'px';
            particle.style.height = size + 'px';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDuration = (Math.random() * 15 + 10) + 's';
            particle.style.animationDelay = (Math.random() * 10) + 's';
            particle.style.opacity = Math.random() * 0.3 + 0.1;
            particlesContainer.appendChild(particle);
        }
    }

})();
