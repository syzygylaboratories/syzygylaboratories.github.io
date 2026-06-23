function startConnectedParticleGrid() {

    const canvas = document.getElementById("syzygy");
    const ctx = canvas.getContext("2d");

    const mouse = { x: 0, y: 0 };

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

        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {

                particles.push({
                    x: x * spacing,
                    y: y * spacing,
                    ox: x * spacing,
                    oy: y * spacing,
                    active: 0
                });

            }
        }
    }

    function distance(a, b, c, d) {
        return Math.sqrt((a - c) ** 2 + (b - d) ** 2);
    }

    function animate() {

        const w = canvas.offsetWidth;
        const h = canvas.offsetHeight;

        ctx.clearRect(0, 0, w, h);

        const activationRadius = 120;

        // 1. update particles
        for (let p of particles) {

            const dx = p.x - mouse.x;
            const dy = p.y - mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            let influence = Math.max(0, 1 - dist / activationRadius);

            // smooth activation state
            p.active += (influence - p.active) * 0.1;

            // spring back to grid
            p.x += (p.ox - p.x) * 0.05;
            p.y += (p.oy - p.y) * 0.05;

            // mouse displacement
            p.x += dx * p.active * 0.12;
            p.y += dy * p.active * 0.12;

            // draw particle
            ctx.beginPath();
            ctx.arc(p.x, p.y, 1 + p.active * 2, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255,255,255,${0.3 + p.active})`;
            ctx.fill();
        }

        // 2. draw connections (key feature)
        for (let i = 0; i < particles.length; i++) {

            const p1 = particles[i];

            if (p1.active < 0.15) continue;

            for (let j = i + 1; j < particles.length; j++) {

                const p2 = particles[j];

                if (p2.active < 0.15) continue;

                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                const maxLinkDist = 80;

                if (dist < maxLinkDist) {

                    const strength = (1 - dist / maxLinkDist) * (p1.active + p2.active) * 0.5;

                    ctx.beginPath();
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(p2.x, p2.y);

                    ctx.strokeStyle = `rgba(180,220,255,${strength})`;
                    ctx.lineWidth = strength * 2;

                    ctx.stroke();
                }
            }
        }

        requestAnimationFrame(animate);
    }

    window.addEventListener("resize", resize);

    resize();
    animate();
}

startConnectedParticleGrid();