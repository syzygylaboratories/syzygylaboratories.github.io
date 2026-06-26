window.initPhysicalWidget = function (el) {

    const canvas = document.createElement("canvas");
    el.appendChild(canvas);

    const ctx = canvas.getContext("2d");

    let w, h;
    const grid = 10;

    let mouse = { x: 0, y: 0 };

    function resize() {
        const r = el.getBoundingClientRect();
        w = canvas.width = r.width;
        h = canvas.height = r.height;
    }

    function draw() {

        ctx.clearRect(0, 0, w, h);

        const cellW = w / grid;
        const cellH = h / grid;

        for (let i = 0; i < grid; i++) {
            for (let j = 0; j < grid; j++) {

                const x = i * cellW;
                const y = j * cellH;

                const dx = mouse.x - x;
                const dy = mouse.y - y;
                const d = Math.hypot(dx, dy);

                const lift = Math.max(0, 20 - d * 0.2);

                ctx.fillStyle = "rgba(255,255,255,0.15)";
                ctx.fillRect(
                    x + lift * 0.5,
                    y - lift * 0.5,
                    cellW * 0.8,
                    cellH * 0.8
                );
            }
        }

        requestAnimationFrame(draw);
    }

    el.addEventListener("mousemove", e => {
        const r = el.getBoundingClientRect();
        mouse.x = e.clientX - r.left;
        mouse.y = e.clientY - r.top;
    });

    resize();
    draw();

    window.addEventListener("resize", resize);
};