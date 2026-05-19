const person = document.querySelector(".person");

if (person) {
    window.addEventListener("mousemove", e => {
        let x = (e.clientX / window.innerWidth - 0.5) * 20;
        let y = (e.clientY / window.innerHeight - 0.5) * 20;

        person.style.transform = `translate(${x}px, ${y}px)`;
    });
}

const toggle = document.querySelector(".menu-toggle");
const overlay = document.getElementById("navOverlay");
const navLinks = document.querySelectorAll(".nav-link");
const body = document.body;

/* Open overlay */
function openNav() {
    overlay.classList.add("active");
    toggle.classList.add("active");
    body.style.overflow = "hidden";
}

/* Close overlay */
function closeNav() {
    overlay.classList.remove("active");
    toggle.classList.remove("active");
    body.style.overflow = "";
}

/* Toggle on burger click */
toggle.addEventListener("click", () => {
    if (overlay.classList.contains("active")) {
        closeNav();
    } else {
        openNav();
    }
});

/* Close when any nav link clicked */
navLinks.forEach(link => {
    link.addEventListener("click", closeNav);
});

/* Close on Escape key */
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && overlay.classList.contains("active")) {
        closeNav();
    }
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

/* ============ ABOUT PAGE INTERACTIONS ============ */

(function () {
    const heroSection = document.querySelector('.hero-section');
    if (!heroSection) return; // Only on about page

    /* ── 1. Section Reveal on Scroll ── */
    const revealSections = document.querySelectorAll('.reveal-section');

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                sectionObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.08,
        rootMargin: '0px 0px -50px 0px'
    });

    revealSections.forEach((section) => sectionObserver.observe(section));

    /* ── 2. Mouse-Reactive Glow Follower ── */
    const glowFollower = document.getElementById('glowFollower');
    if (glowFollower) {
        let mouseX = 0, mouseY = 0;
        let currentX = 0, currentY = 0;
        let isMouseOnPage = false;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            if (!isMouseOnPage) {
                isMouseOnPage = true;
                glowFollower.classList.add('active');
            }
        });

        document.addEventListener('mouseleave', () => {
            isMouseOnPage = false;
            glowFollower.classList.remove('active');
        });

        function animateGlow() {
            currentX += (mouseX - currentX) * 0.08;
            currentY += (mouseY - currentY) * 0.08;
            if (glowFollower) {
                glowFollower.style.transform = `translate(${currentX - 200}px, ${currentY - 200}px)`;
            }
            requestAnimationFrame(animateGlow);
        }
        animateGlow();
    }

    /* ── 3. Hero Portrait Parallax ── */
    const heroPortrait = document.getElementById('heroPortrait');
    if (heroPortrait) {
        const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        if (!isTouchDevice) {
            document.querySelector('.hero-section').addEventListener('mousemove', (e) => {
                const rect = heroPortrait.getBoundingClientRect();
                const x = (e.clientX - rect.left - rect.width / 2) / 30;
                const y = (e.clientY - rect.top - rect.height / 2) / 30;
                heroPortrait.style.transform = `translate(${x}px, ${y}px)`;
            });

            document.querySelector('.hero-section').addEventListener('mouseleave', () => {
                heroPortrait.style.transform = 'translate(0, 0)';
            });
        }
    }

    /* ── 4. Experience sections scrolling entrance ── */
    const expSections = document.querySelectorAll('.exp-section');
    const expObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, { threshold: 0.15 });

    expSections.forEach((section) => expObserver.observe(section));

    /* ── 5. Skill Pill hover magnetic effect ── */
    const skillPills = document.querySelectorAll('.skill-pill');
    skillPills.forEach((pill) => {
        const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        if (isTouchDevice) return;

        pill.addEventListener('mousemove', (e) => {
            const rect = pill.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const moveX = (x - centerX) / 8;
            const moveY = (y - centerY) / 8;
            pill.style.transform = `translate(${moveX}px, ${moveY}px) scale(1.04)`;
        });

        pill.addEventListener('mouseleave', () => {
            pill.style.transform = '';
        });
    });

    /* ── 6. Floating Particles (only for about page) ── */
    const particlesContainer = document.getElementById('particles-container');
    if (particlesContainer && !particlesContainer.querySelector('.particle')) {
        const particleCount = window.innerWidth < 600 ? 10 : 18;

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            const size = Math.random() * 2.5 + 1.5;
            particle.style.width = size + 'px';
            particle.style.height = size + 'px';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.bottom = '-10px';
            particle.style.animationDuration = (Math.random() * 15 + 12) + 's';
            particle.style.animationDelay = (Math.random() * 10) + 's';
            particle.style.opacity = Math.random() * 0.2 + 0.05;
            particlesContainer.appendChild(particle);
        }
    }
})();

/* ============ AI HUD TERMINAL & ANIMATIONS ============ */

(function () {
    const terminalBody = document.getElementById('terminalBody');
    if (!terminalBody) return; // Only on pages with the AI HUD panel

    const cursor = terminalBody.querySelector('.terminal-cursor');

    /* ── Terminal Log Messages ── */
    const logLines = [
        { prompt: '>', text: ' Initializing PersonaGPT...', cls: '' },
        { prompt: '>', text: ' Loading vector database...', cls: '' },
        { prompt: '>', text: ' Embedding user memory...', cls: '' },
        { prompt: '>', text: ' Gemini API connected', cls: 'success' },
        { prompt: '>', text: ' LangChain agents active', cls: '' },
        { prompt: '>', text: ' Neural response generated', cls: '' },
        { prompt: '>', text: ' Inference pipeline ready', cls: 'success' },
        { prompt: '>', text: ' System status: ', cls: '' },
        { prompt: '', text: 'OPTIMAL', cls: 'highlight' }
    ];

    let lineIndex = 0;
    let charIndex = 0;
    let isTyping = false;
    let terminalInterval = null;
    const typedLines = [];

    function createLineElement(prompt, text, cls) {
        const line = document.createElement('div');
        line.className = 'terminal-line';
        if (prompt) {
            const promptSpan = document.createElement('span');
            promptSpan.className = 'prompt';
            promptSpan.textContent = prompt;
            line.appendChild(promptSpan);
        }
        const textSpan = document.createElement('span');
        textSpan.className = cls || 'text';
        textSpan.textContent = '';
        line.appendChild(textSpan);
        return { line, textSpan };
    }

    function typeNextLine() {
        if (lineIndex >= logLines.length) {
            // Loop back after pause
            clearTimeout(terminalInterval);
            terminalInterval = setTimeout(() => {
                terminalBody.innerHTML = '';
                typedLines.length = 0;
                lineIndex = 0;
                charIndex = 0;
                if (cursor) terminalBody.appendChild(cursor);
                startTyping();
            }, 4000);
            return;
        }

        const entry = logLines[lineIndex];
        const { line, textSpan } = createLineElement(entry.prompt, entry.text, entry.cls);
        if (cursor) terminalBody.insertBefore(line, cursor);
        typedLines.push({ line, textSpan, text: entry.text, pos: 0 });

        charIndex = 0;
        isTyping = true;

        function typeChar() {
            if (charIndex < entry.text.length) {
                textSpan.textContent = entry.text.substring(0, charIndex + 1);
                charIndex++;
                terminalInterval = setTimeout(typeChar, 20 + Math.random() * 30);
            } else {
                isTyping = false;
                lineIndex++;
                // Auto-scroll
                terminalBody.scrollTop = terminalBody.scrollHeight;
                terminalInterval = setTimeout(typeNextLine, 300 + Math.random() * 400);
            }
        }
        typeChar();
    }

    function startTyping() {
        terminalInterval = setTimeout(typeNextLine, 600);
    }

    /* Wait for overlay to open before starting (so we see it happen) */
    const overlay = document.getElementById('navOverlay');
    if (overlay) {
        const observer = new MutationObserver(() => {
            if (overlay.classList.contains('active')) {
                if (!lineIndex && !isTyping) {
                    setTimeout(startTyping, 800);
                }
                observer.disconnect();
            }
        });
        observer.observe(overlay, { attributes: true, attributeFilter: ['class'] });
    }

    /* ── Waveform Canvas ── */
    const canvas = document.getElementById('hudWaveform');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let animId = null;

        function resizeCanvas() {
            const rect = canvas.parentElement.getBoundingClientRect();
            canvas.width = rect.width;
            canvas.height = rect.height;
        }
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        let phase = 0;

        function drawWaveform() {
            const w = canvas.width;
            const h = canvas.height;
            ctx.clearRect(0, 0, w, h);

            const waves = [
                { amp: 10, freq: 0.02, speed: 0.02, color: 'rgba(123, 97, 255, 0.5)' },
                { amp: 6, freq: 0.035, speed: 0.03, color: 'rgba(159, 122, 234, 0.35)' },
                { amp: 14, freq: 0.012, speed: 0.015, color: 'rgba(123, 97, 255, 0.2)' }
            ];

            waves.forEach(wave => {
                ctx.beginPath();
                ctx.strokeStyle = wave.color;
                ctx.lineWidth = 1.5;
                for (let x = 0; x < w; x += 1) {
                    const y = h / 2 + Math.sin(x * wave.freq + phase * wave.speed) * wave.amp
                        + Math.sin(x * wave.freq * 0.5 + phase * wave.speed * 0.7) * (wave.amp * 0.5);
                    if (x === 0) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                }
                ctx.stroke();
            });

            phase += 1;
            animId = requestAnimationFrame(drawWaveform);
        }

        // Only run when overlay is open to save performance
        if (overlay) {
            const obs = new MutationObserver(() => {
                if (overlay.classList.contains('active')) {
                    if (!animId) drawWaveform();
                } else {
                    if (animId) {
                        cancelAnimationFrame(animId);
                        animId = null;
                    }
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                }
            });
            obs.observe(overlay, { attributes: true, attributeFilter: ['class'] });
        }
    }

    /* ── Neural Network Dots ── */
    const neuralContainer = document.getElementById('neuralDots');
    if (neuralContainer) {
        const count = 14;
        for (let i = 0; i < count; i++) {
            const dot = document.createElement('div');
            dot.className = 'neural-dot';
            dot.style.left = (5 + Math.random() * 90) + '%';
            dot.style.top = (5 + Math.random() * 90) + '%';
            dot.style.animationDelay = (Math.random() * 8) + 's';
            dot.style.animationDuration = (6 + Math.random() * 6) + 's';
            neuralContainer.appendChild(dot);
        }
    }
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