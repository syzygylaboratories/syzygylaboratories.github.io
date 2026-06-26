window.initDigitalWidget = function (el) {

    const canvas = document.createElement("canvas");
    el.appendChild(canvas);

    const ctx = canvas.getContext("2d");

    let w, h;
    let mouse = { x: 0, y: 0 };

    const particles = [];

    function resize() {
        const r = el.getBoundingClientRect();
        w = canvas.width = r.width;
        h = canvas.height = r.height;
    }

    function init() {
        for (let i = 0; i < 120; i++) {
            particles.push({
                x: Math.random() * w,
                y: Math.random() * h,
                px: 0,
                py: 0
            });
        }
    }

    function field(x, y, t) {
        return {
            vx: Math.sin(y * 0.02 + t) * 1.2,
            vy: Math.cos(x * 0.02 - t) * 1.2
        };
    }

    function draw(t) {

        ctx.fillStyle = "rgba(0,0,0,0.08)";
        ctx.fillRect(0, 0, w, h);

        for (let p of particles) {

            const f = field(p.x, p.y, t * 0.001);

            p.px = p.x;
            p.py = p.y;

            p.x += f.vx;
            p.y += f.vy;

            const dx = mouse.x - p.x;
            const dy = mouse.y - p.y;

            if (Math.hypot(dx, dy) < 80) {
                p.x += dx * 0.02;
                p.y += dy * 0.02;
            }

            ctx.beginPath();
            ctx.moveTo(p.px, p.py);
            ctx.lineTo(p.x, p.y);
            ctx.strokeStyle = "rgba(255,255,255,0.25)";
            ctx.stroke();
        }

        requestAnimationFrame(draw);
    }

    el.addEventListener("mousemove", e => {
        const r = el.getBoundingClientRect();
        mouse.x = e.clientX - r.left;
        mouse.y = e.clientY - r.top;
    });

    resize();
    init();
    requestAnimationFrame(draw);

    window.addEventListener("resize", resize);
};