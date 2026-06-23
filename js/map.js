function startHeatmapField() {

    const canvas = document.getElementById("syzygy");
    const ctx = canvas.getContext("2d");

    const mouse = { x: 0, y: 0 };

    window.addEventListener("mousemove", (e) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    });

    let grid = [];

    function resize() {

        const dpr = window.devicePixelRatio || 1;

        canvas.width = canvas.offsetWidth * dpr;
        canvas.height = canvas.offsetHeight * dpr;

        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        initGrid();
    }

    function initGrid() {

        grid = [];

        const spacing = 18; // tighter = smoother field

        const cols = Math.floor(canvas.offsetWidth / spacing);
        const rows = Math.floor(canvas.offsetHeight / spacing);

        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {

                grid.push({
                    x: x * spacing,
                    y: y * spacing,
                    ox: x * spacing,
                    oy: y * spacing,
                    v: 0
                });

            }
        }
    }

    function animate() {

        const w = canvas.offsetWidth;
        const h = canvas.offsetHeight;

        // instead of clearing fully → fade previous frame (key for heatmap feel)
        ctx.fillStyle = "rgba(0,0,0,0.15)";
        ctx.fillRect(0, 0, w, h);

        for (let p of grid) {

            const dx = p.x - mouse.x;
            const dy = p.y - mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            const radius = 140;

            let influence = Math.max(0, 1 - dist / radius);

            // smooth return to origin
            p.x += (p.ox - p.x) * 0.08;
            p.y += (p.oy - p.y) * 0.08;

            // slight displacement from field
            p.x += dx * influence * 0.08;
            p.y += dy * influence * 0.08;

            // colour intensity mapping
            const alpha = influence;
            const size = 1 + influence * 3;

            // heat colour (white → cyan → subtle blue)
            const r = 255 - influence * 80;
            const g = 255 - influence * 30;
            const b = 255;

            ctx.beginPath();
            ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;
            ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
            ctx.fill();
        }

        requestAnimationFrame(animate);
    }

    window.addEventListener("resize", resize);

    resize();
    animate();
}

startHeatmapField();