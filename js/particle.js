function startParticleGrid() {

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
                    oy: y * spacing
                });

            }
        }
    }

    function animate() {

        const w = canvas.offsetWidth;
        const h = canvas.offsetHeight;

        ctx.clearRect(0, 0, w, h);

        for (let p of particles) {

            const dx = p.x - mouse.x;
            const dy = p.y - mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            // interaction radius
            const forceRadius = 50;

            if (dist < forceRadius) {

                const force = (1 - dist / forceRadius);

                p.x += dx * force * 0.15;
                p.y += dy * force * 0.15;

            } else {

                // return to original grid position
                p.x += (p.ox - p.x) * 0.05;
                p.y += (p.oy - p.y) * 0.05;
            }

            // draw particle
            ctx.beginPath();
            ctx.arc(p.x, p.y, 1, 0, Math.PI * 2);
            ctx.fillStyle = "#666";
            ctx.fill();
        }

        requestAnimationFrame(animate);
    }

    window.addEventListener("resize", resize);

    resize();
    animate();
}

// CALL IT
startParticleGrid();