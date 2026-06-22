const canvas = document.getElementById("syzygy");
const ctx = canvas.getContext("2d");

// Mouse
const mouse = { x: 0, y: 0 };

window.addEventListener("mousemove", (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
});

// Nodes
const nodes = [
    { x: 120, y: 180, vx: 1.2, vy: 0.9 },
    { x: 320, y: 120, vx: -1.0, vy: 1.1 },
    { x: 520, y: 220, vx: 0.8, vy: -1.0 }
];

// Resize with proper DPR handling
function resize() {
    const dpr = window.devicePixelRatio || 1;

    canvas.width = canvas.offsetWidth * dpr;
    canvas.height = canvas.offsetHeight * dpr;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

window.addEventListener("resize", resize);
resize();

// Animation loop
function animate() {

    const w = canvas.offsetWidth;
    const h = canvas.offsetHeight;

    ctx.clearRect(0, 0, w, h);

    nodes.forEach(n => {

        // movement
        n.x += n.vx;
        n.y += n.vy;

        // mouse interaction (soft attraction/repulsion)
        const dx = n.x - mouse.x;
        const dy = n.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 160) {
            n.x += dx * 0.02;
            n.y += dy * 0.02;
        }

        // bounce (WITH radius safety)
        const r = 10;

        if (n.x <= r) {
            n.x = r;
            n.vx *= -1;
        }
        if (n.x >= w - r) {
            n.x = w - r;
            n.vx *= -1;
        }

        if (n.y <= r) {
            n.y = r;
            n.vy *= -1;
        }
        if (n.y >= h - r) {
            n.y = h - r;
            n.vy *= -1;
        }
    });

    // lines
    ctx.strokeStyle = "#555";
    ctx.lineWidth = 1;

    ctx.beginPath();
    ctx.moveTo(nodes[0].x, nodes[0].y);
    ctx.lineTo(nodes[1].x, nodes[1].y);
    ctx.lineTo(nodes[2].x, nodes[2].y);
    ctx.lineTo(nodes[0].x, nodes[0].y);
    ctx.stroke();

    // nodes
    nodes.forEach(n => {
        ctx.beginPath();
        ctx.arc(n.x, n.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = "#666";
        ctx.fill();
    });

    requestAnimationFrame(animate);
}

animate();