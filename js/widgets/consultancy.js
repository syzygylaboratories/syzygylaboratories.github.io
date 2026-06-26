window.initConsultancyWidget = function (el) {

    const canvas = document.createElement("canvas");
    el.appendChild(canvas);

    const ctx = canvas.getContext("2d");

    let w, h;
    let mouse = { x: -9999, y: -9999 };

    const nodes = [];

    function resize() {
        const r = el.getBoundingClientRect();
        w = canvas.width = r.width;
        h = canvas.height = r.height;
    }

    function init() {
        for (let i = 0; i < 3; i++) {
            nodes.push({
                x: Math.random() * w,
                y: Math.random() * h,
                vx: (Math.random() - 0.5) * 1.2,
                vy: (Math.random() - 0.5) * 1.2
            });
        }
    }

    function update() {

        ctx.clearRect(0, 0, w, h);

        // connections
        ctx.beginPath();
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                ctx.moveTo(nodes[i].x, nodes[i].y);
                ctx.lineTo(nodes[j].x, nodes[j].y);
            }
        }
        ctx.strokeStyle = "rgba(255,255,255,0.12)";
        ctx.stroke();

        for (let n of nodes) {

            // 🔽 MUCH weaker mouse avoidance
            const dxm = n.x - mouse.x;
            const dym = n.y - mouse.y;
            const dist = Math.hypot(dxm, dym);

            if (dist < 120) {
                const force = (1 - dist / 120) * 0.002; // was ~0.02 (10x weaker)

                n.vx += dxm * force;
                n.vy += dym * force;
            }

            // motion
            n.x += n.vx;
            n.y += n.vy;

            n.vx *= 0.97;
            n.vy *= 0.97;

            // bounce
            if (n.x < 0) { n.x = 0; n.vx *= -1; }
            if (n.x > w) { n.x = w; n.vx *= -1; }
            if (n.y < 0) { n.y = 0; n.vy *= -1; }
            if (n.y > h) { n.y = h; n.vy *= -1; }

            // 🔵 BIGGER DOTS
            ctx.beginPath();
            ctx.arc(n.x, n.y, 8, 0, Math.PI * 2); // was 4 → now 8
            ctx.fillStyle = "rgba(255,255,255,0.9)";
            ctx.fill();
        }

        requestAnimationFrame(update);
    }

    el.addEventListener("mousemove", (e) => {
        const r = el.getBoundingClientRect();
        mouse.x = e.clientX - r.left;
        mouse.y = e.clientY - r.top;
    });

    el.addEventListener("mouseleave", () => {
        mouse.x = -9999;
        mouse.y = -9999;
    });

    window.addEventListener("resize", resize);

    resize();
    init();
    update();
};