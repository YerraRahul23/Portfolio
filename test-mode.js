gsap.registerPlugin(ScrollTrigger);

const cards = gsap.utils.toArray(".card");

cards.forEach((card, index) => {

    if (index !== cards.length - 1) {

        gsap.to(card, {
            scale: 0.9,
            rotation: -5,
            opacity: 0,

            scrollTrigger: {
                trigger: card,
                start: "top top",
                end: "+=500",
                scrub: true,
                pin: true
            }
        });

    }

});

