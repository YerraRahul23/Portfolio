const person = document.querySelector(".person");

window.addEventListener("mousemove", e => {
    let x = (e.clientX / window.innerWidth - 0.5) * 20;
    let y = (e.clientY / window.innerHeight - 0.5) * 20;

    person.style.transform = `translate(${x}px, ${y}px)`;
});

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
