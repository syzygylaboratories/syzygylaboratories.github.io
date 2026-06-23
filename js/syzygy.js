function startConnectedParticleGrid() {

    const canvas = document.getElementById("syzygy");
    const ctx = canvas.getContext("2d");

    const mouse = { x: -9999, y: -9999 };

    window.addEventListener("mousemove", (e) => {

        const rect = canvas.getBoundingClientRect();

        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;

    });

    let particles = [];

    function resize() {

        const dpr = window.devicePixelRatio || 1;

        canvas.width = canvas.offsetWidth * dpr;
        canvas.height = canvas.offsetHeight * dpr;

        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        initParticles();

    }

    function initParticles() {

        particles = [];

        const spacing = 20;

        const cols = Math.floor(canvas.offsetWidth / spacing);
        const rows = Math.floor(canvas.offsetHeight / spacing);

        // Centre rings on hero image

        const hero = document.querySelector(".hero");
        const img = document.getElementById("hero-logo");
        let cx = canvas.offsetWidth * 0.5;
        let cy = canvas.offsetHeight * 0.5;

        if (hero) {
            const heroRect = hero.getBoundingClientRect();
            const canvasRect = canvas.getBoundingClientRect();
            cx = (heroRect.left - canvasRect.left) + heroRect.width / 2;
            cy = (heroRect.top - canvasRect.top) + heroRect.height / 2;
            cy -= 15; // slight downward offset for better visual balance
        }

        // Ring sizes

        const R1 = 260;
        const T1 = 28;

        const R2 = 170;
        const T2 = 22;

        const R3 = 95;
        const T3 = 18;

        // Align rightmost points

        const c1x = cx;
        const c2x = cx + (R1 - R2);
        const c3x = cx + (R1 - R3);

        const c1y = cy;
        const c2y = cy;
        const c3y = cy;

        for (let y = 0; y <= rows; y++) {

            for (let x = 0; x <= cols; x++) {

                const px = x * spacing;
                const py = y * spacing;

                const d1 = Math.hypot(px - c1x, py - c1y);
                const d2 = Math.hypot(px - c2x, py - c2y);
                const d3 = Math.hypot(px - c3x, py - c3y);

                const ring1 = Math.max(
                    0,
                    1 - Math.abs(d1 - R1) / T1
                ) ** 2;

                const ring2 = Math.max(
                    0,
                    1 - Math.abs(d2 - R2) / T2
                ) ** 2;

                const ring3 = Math.max(
                    0,
                    1 - Math.abs(d3 - R3) / T3
                ) ** 2;

                const ring = Math.max(
                    ring1,
                    ring2,
                    ring3
                );

                particles.push({

                    x: px,
                    y: py,

                    ox: px,
                    oy: py,

                    active: 0,

                    ring

                });

            }

        }

    }

    function animate() {

        const w = canvas.offsetWidth;
        const h = canvas.offsetHeight;

        ctx.clearRect(0, 0, w, h);

        const activationRadius = 120;

        // Update + draw particles

        for (let p of particles) {

            const dx = p.x - mouse.x;
            const dy = p.y - mouse.y;

            const dist = Math.hypot(dx, dy);

            const influence = Math.max(
                0,
                1 - dist / activationRadius
            );

            p.active += (influence - p.active) * 0.1;

            // Spring back

            p.x += (p.ox - p.x) * 0.05;
            p.y += (p.oy - p.y) * 0.05;

            // Mouse repulsion

            p.x += dx * p.active * 0.12;
            p.y += dy * p.active * 0.12;

            // Appearance

            const radius =

                1 +

                p.active * 2 +

                p.ring * 4;

            const alpha =

                0.25 +

                p.active * 0.9 +

                p.ring * 0.9;

            // Glow

            if (p.ring > 0.02) {

                const glowRadius =

                    radius *

                    (2 + p.ring * 2);

                const grad = ctx.createRadialGradient(

                    p.x,
                    p.y,
                    radius,

                    p.x,
                    p.y,
                    glowRadius

                );

                grad.addColorStop(
                    0,
                    `rgba(220,240,255,${0.25 * p.ring})`
                );

                grad.addColorStop(
                    1,
                    "rgba(220,240,255,0)"
                );

                ctx.beginPath();

                ctx.arc(
                    p.x,
                    p.y,
                    glowRadius,
                    0,
                    Math.PI * 2
                );

                ctx.fillStyle = grad;

                ctx.fill();

            }

            // Particle

            ctx.beginPath();

            ctx.arc(
                p.x,
                p.y,
                radius,
                0,
                Math.PI * 2
            );

            ctx.fillStyle = p.ring > 0

                ? `rgba(220,240,255,${alpha})`

                : `rgba(255,255,255,${alpha})`;

            ctx.fill();

        }

        // Connections

        for (let i = 0; i < particles.length; i++) {

            const p1 = particles[i];

            if (

                p1.active < 0.15 &&

                p1.ring < 0.1

            ) continue;

            for (let j = i + 1; j < particles.length; j++) {

                const p2 = particles[j];

                if (

                    p2.active < 0.15 &&

                    p2.ring < 0.1

                ) continue;

                const dist = Math.hypot(

                    p1.x - p2.x,

                    p1.y - p2.y

                );

                const maxLinkDist = 80;

                if (dist < maxLinkDist) {

                    const strength =

                        (1 - dist / maxLinkDist)

                        *

                        (

                            (p1.active + p2.active) * 0.5

                            +

                            (p1.ring + p2.ring) * 0.4

                        );

                    ctx.beginPath();

                    ctx.moveTo(
                        p1.x,
                        p1.y
                    );

                    ctx.lineTo(
                        p2.x,
                        p2.y
                    );

                    ctx.strokeStyle =

                        p1.ring > 0 || p2.ring > 0

                        ?

                        `rgba(220,240,255,${strength})`

                        :

                        `rgba(180,220,255,${strength})`;

                    ctx.lineWidth = Math.max(
                        0.5,
                        strength * 2
                    );

                    ctx.stroke();

                }

            }

        }

        requestAnimationFrame(animate);

    }

    window.addEventListener(
        "resize",
        resize
    );

    resize();

    animate();

}

startConnectedParticleGrid();