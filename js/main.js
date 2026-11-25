/* =========================================================
   main.js — comportamiento del portafolio
   No hace falta editar este archivo para cambiar contenido.
   ========================================================= */

(function () {
  const root = document.documentElement;
  const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const DPR = Math.min(window.devicePixelRatio || 1, 2);

  /* =========================================================
     FONDO: ondas de luz neón celeste (se crea solo en todas las páginas)
     ========================================================= */
  (function waves() {
    const cv = document.createElement("canvas");
    cv.id = "bg-waves";
    cv.setAttribute("aria-hidden", "true");
    document.body.prepend(cv);
    const ctx = cv.getContext("2d");
    let w, h, hv, mobile; // hv: alto "virtual" para que en celular vertical las ondas queden en los bordes
    function size() {
      w = innerWidth; h = innerHeight; mobile = w < 700; hv = Math.min(h, w * 0.75);
      cv.width = w * DPR; cv.height = h * DPR;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    }
    size();
    addEventListener("resize", () => { size(); if (still) frame(0); });

    // Cada cinta: recorrido base (t de 0 a 1 → x, y) + ancho de la cinta
    const ribbons = [
      { // superior izquierda
        path: (t) => [t * 0.5 * w - 0.05 * w, hv * (0.36 - 0.42 * t) + Math.sin(t * 3.2) * 0.04 * hv],
        spread: 0.10, lines: 26, phase: 0, glow: 0.9,
      },
      { // superior derecha
        path: (t) => [w * (0.6 + 0.45 * t), hv * (-0.04 + 0.26 * t * t) + Math.sin(t * 4) * 0.02 * hv],
        spread: 0.09, lines: 22, phase: 2, glow: 0.7,
      },
      { // inferior: baja hacia el centro y sube a la derecha
        path: (t) => [t * 1.1 * w - 0.05 * w, h - hv * (0.34 - 0.33 * Math.sin(Math.PI * t * 0.95) + 0.38 * Math.pow(t, 3))],
        spread: 0.13, lines: 34, phase: 4, glow: 1,
      },
    ];

    function frame(time) {
      const T = time / 9000;
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";
      const steps = mobile ? 50 : 90;
      for (const r of ribbons) {
        const n = mobile ? Math.ceil(r.lines / 2) : r.lines;
        for (let i = 0; i < n; i++) {
          const k = i / (n - 1) - 0.5;              // posición dentro de la cinta (-0.5 .. 0.5)
          const core = 1 - Math.abs(k) * 2;          // 1 en el centro, 0 en los bordes
          const pts = [];
          for (let s = 0; s <= steps; s++) {
            const t = s / steps;
            const [x, y] = r.path(t);
            const twist = Math.sin(t * Math.PI * 2 + T * 6 + r.phase) * 0.6 + 0.4;
            pts.push([x, y + k * r.spread * hv * twist + Math.sin(t * 9 + T * 4 + i * 0.3) * 3]);
          }
          ctx.strokeStyle = `rgba(60, 225, 255, ${0.05 + core * 0.24 * r.glow})`;
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          pts.forEach(([x, y], j) => (j ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
          ctx.stroke();
          // partículas sobre algunas líneas
          if (i % 3 === 0) {
            ctx.fillStyle = `rgba(150, 245, 255, ${0.15 + core * 0.35})`;
            for (let j = (i % 2); j < pts.length; j += 2) ctx.fillRect(pts[j][0], pts[j][1], 1.2, 1.2);
          }
        }
        // línea central brillante con resplandor
        ctx.shadowColor = "rgba(60, 225, 255, 1)";
        ctx.shadowBlur = 24;
        ctx.strokeStyle = `rgba(190, 250, 255, ${0.85 * r.glow})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let s = 0; s <= steps; s++) {
          const t = s / steps, [x, y] = r.path(t);
          s ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
        }
        ctx.stroke();
        ctx.shadowBlur = 0;
      }
      ctx.globalCompositeOperation = "source-over";
    }

    if (still) { frame(0); return; }
    let last = 0;
    (function tick(t) {
      if (!document.hidden && t - last > 33) { frame(t); last = t; } // ~30 fps
      requestAnimationFrame(tick);
    })(0);
  })();

  /* ---------- Idioma EN / ES ---------- */
  const saved = localStorage.getItem("lang");
  const browser = (navigator.language || "en").toLowerCase().startsWith("es") ? "es" : "en";
  setLang(saved || browser);

  function setLang(lang) {
    root.dataset.lang = lang;
    root.lang = lang;
    localStorage.setItem("lang", lang);
    document.querySelectorAll(".lang-toggle").forEach((b) => {
      b.innerHTML = lang === "en" ? "<b>EN</b> / ES" : "EN / <b>ES</b>";
      b.setAttribute("aria-label", lang === "en" ? "Cambiar a español" : "Switch to English");
    });
    document.querySelectorAll("[data-cv]").forEach((a) => {
      a.href = a.dataset.cvBase + (lang === "en" ? "CV_Brithany_Serracin_EN.pdf" : "CV_Brithany_Serracin_ES.pdf");
    });
  }
  document.querySelectorAll(".lang-toggle").forEach((b) =>
    b.addEventListener("click", () => setLang(root.dataset.lang === "en" ? "es" : "en"))
  );

  /* ---------- Menú móvil ---------- */
  const menuBtn = document.querySelector(".menu-btn");
  const menu = document.querySelector(".nav ul");
  if (menuBtn && menu) {
    menuBtn.addEventListener("click", () => {
      const open = menu.classList.toggle("open");
      menuBtn.setAttribute("aria-expanded", open);
    });
    menu.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => menu.classList.remove("open")));
  }

  /* ---------- Imágenes: oculta las que aún no existen ---------- */
  document.querySelectorAll(".photo-slot img, .badge-slot img, .thumb img").forEach((img) => {
    const ok = () => {
      const slot = img.closest(".photo-slot");
      if (slot) { slot.classList.add("has-photo"); portrait(img, slot); }
    };
    const fail = () => img.remove();
    if (img.complete) (img.naturalWidth ? ok() : fail());
    else { img.addEventListener("load", ok); img.addEventListener("error", fail); }
  });

  /* ---------- Aparición al hacer scroll ---------- */
  const io = new IntersectionObserver(
    (entries) => entries.forEach((e) => e.isIntersecting && (e.target.classList.add("in"), io.unobserve(e.target))),
    { threshold: 0.1 }
  );
  document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

  /* ---------- Link activo en el menú ---------- */
  const links = [...document.querySelectorAll('.nav ul a[href^="#"]')];
  const sections = links.map((a) => document.querySelector(a.getAttribute("href"))).filter(Boolean);
  if (sections.length) {
    const spy = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) links.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#" + e.target.id));
      }),
      { rootMargin: "-45% 0px -50% 0px" }
    );
    sections.forEach((s) => spy.observe(s));
  }

  /* ---------- Visor de imágenes ---------- */
  const zoomables = document.querySelectorAll(".figure img, .log img, .gallery img");
  if (zoomables.length) {
    const lb = document.createElement("div");
    lb.className = "lightbox";
    lb.innerHTML = '<img alt="">';
    document.body.appendChild(lb);
    const big = lb.querySelector("img");
    zoomables.forEach((img) =>
      img.addEventListener("click", () => { big.src = img.src; big.alt = img.alt; lb.classList.add("open"); })
    );
    lb.addEventListener("click", () => lb.classList.remove("open"));
    document.addEventListener("keydown", (e) => e.key === "Escape" && lb.classList.remove("open"));
  }

  document.querySelectorAll("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));

  /* Ajusta un canvas a su tamaño en pantalla (nítido en pantallas retina) */
  function fit(cv) {
    const w = cv.clientWidth, h = cv.clientHeight;
    cv.width = Math.round(w * DPR); cv.height = Math.round(h * DPR);
    const ctx = cv.getContext("2d");
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    return { ctx, w, h };
  }
  /* Ejecuta la animación solo mientras el elemento está visible */
  function loop(el, draw) {
    let on = false, raf = 0;
    const tick = (t) => { draw(t); if (on) raf = requestAnimationFrame(tick); };
    if (still) { draw(0); return; }
    new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !on) { on = true; raf = requestAnimationFrame(tick); }
      else if (!e.isIntersecting) { on = false; cancelAnimationFrame(raf); }
    }).observe(el);
  }

  /* =========================================================
     RETRATO DE PARTÍCULAS
     Convierte la foto en puntos cian. Funciona en la web publicada
     (Vercel). Si se abre el archivo directo desde la computadora,
     el navegador bloquea la lectura de píxeles y se muestra la foto
     con filtro cian.
     ========================================================= */
  function portrait(img, slot) {
    const cv = slot.querySelector("#portrait");
    if (!cv) return;
    const { ctx, w, h } = fit(cv);
    const step = 4;
    const cols = Math.floor(w / step), rows = Math.floor(h / step);
    const off = document.createElement("canvas");
    off.width = cols; off.height = rows;
    const o = off.getContext("2d");
    // "cover": recorta la foto para llenar el recuadro (centrada arriba, donde suele estar la cara)
    const s = Math.max(cols / img.naturalWidth, rows / img.naturalHeight);
    const dw = img.naturalWidth * s, dh = img.naturalHeight * s;
    o.drawImage(img, (cols - dw) / 2, (rows - dh) * 0.25, dw, dh);
    let data;
    try { data = o.getImageData(0, 0, cols, rows).data; } catch (e) { return; } // file:// → se queda la foto con filtro

    const lum = new Float32Array(cols * rows);
    let min = 1, max = 0;
    for (let i = 0; i < cols * rows; i++) {
      const l = (0.299 * data[i * 4] + 0.587 * data[i * 4 + 1] + 0.114 * data[i * 4 + 2]) / 255;
      lum[i] = l; if (l < min) min = l; if (l > max) max = l;
    }
    const dots = [];
    for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) {
      let l = (lum[y * cols + x] - min) / (max - min || 1);
      l = Math.pow(l, 1.4);
      if (l < 0.08) continue;
      const fx = x / cols;
      // El borde derecho se "desintegra" en partículas
      const drift = fx > 0.72 ? (fx - 0.72) * 3.2 : 0;
      if (drift && Math.random() < drift * 0.6) continue;
      dots.push({
        x: x * step + step / 2 + (drift ? (Math.random() * 18 + 4) * drift : 0),
        y: y * step + step / 2 + (drift ? (Math.random() - 0.5) * 10 * drift : 0),
        r: 0.35 + l * step * 0.48, a: 0.25 + l * 0.75,
        sx: Math.random() * w, sy: Math.random() * h,
      });
    }
    slot.classList.add("particles");
    const start = performance.now();
    const ease = (t) => 1 - Math.pow(1 - t, 3);
    function draw(now) {
      const t = still ? 1 : Math.min(1, (now - start) / 1600);
      const k = ease(t);
      ctx.clearRect(0, 0, w, h);
      for (const d of dots) {
        const x = d.sx + (d.x - d.sx) * k, y = d.sy + (d.y - d.sy) * k;
        ctx.fillStyle = `rgba(142,244,255,${d.a})`;
        ctx.beginPath(); ctx.arc(x, y, d.r, 0, 6.283); ctx.fill();
      }
      if (t < 1) requestAnimationFrame(draw);
    }
    requestAnimationFrame(draw);
  }

  /* =========================================================
     GLOBO TERRÁQUEO DE PUNTOS + conexiones de red desde Costa Rica
     (mapa: Natural Earth, dominio público, cuadrícula de 3°)
     ========================================================= */
  const LAND = ["000000000000000000000000000000","000000000000000000000000000000","00000001fe0ff80000000000000000","0000000fe3fffc00d0000018000000","0000192fc7fff80000002003800000","000018bec07ff800000201fff41000","03c003cbf83fe0000c0037ffffff80","87ffffffae3f80007fcff7ffffffff","03ffffffbc1c0600effffffffffffe","07fffff8300c0003dfffffffffff5c","0083fff83a000022cfffffffffe040","0000fffe3f0000209fffffffff80c0","00007fffbf80005ffffffffffff080","00001ffffc00001ffffffffffff000","00001ffffc00001ffd7bffffffd000","00001ffff800005df877ffffff9000","00001fffe000007073fbfffff60000","00001fffe000007097fbfffffa2000","00000fffc000003e00fffffff0c000","000007ff8000007f98fffffff90000","000001f0800000fffef7fffff80000","000000f0000001fffff8fffff00000","00000060400001ffff7f1fdfc00000","00000072080001ffff3e0f1e800000","0000001e000003ffffbc0e1f080000","00000003000003fffff00607000000","000000011d0001fffff80601000000","000000003f0000fffff80000040000","000000003fe00043fff00008300000","000000003fe00001ffe00006e00000","000000007ff80001ffc00002688000","000000007ffe0000ff800002007000","000000007fff0000ff800000c03800","000000003fff0000ff800000000000","000000001ffe0000ffc80000019000","000000000ffe0000ff98000007d800","0000000007fe0000ff1000000ff800","0000000007fc00007f3000003ffc00","000000000ff000007e0000003ffe00","000000000ff000007e0000003ffe00","000000000fe000003c0000001ffe00","000000000fc0000020000000103c00","000000001f80000000000000001c02","000000001e00000000000000000002","000000000c00000000000000000004","000000001c00000000000000000008","000000001800000000000000000000","000000001800000000000000000000","000000000000000000000000000000","000000000000000000000000000000","000000000000000000000000000000","000000000100000000000000000000","0000000004000000000f01fffff800","000000000e000002efffefffffffc0","0000102f4f0001fffffffffffffff0","001ffffff8001fffffffffffffffe0","023fffffc01c3fffffffffffffffc0","007fffffff3fffffffffffffffffe0","ffdfffffffffffffffffffffffffff","ffffffffffffffffffffffffffffff"];

  const globeCv = document.getElementById("globe");
  if (globeCv) drawGlobe(globeCv);

  function drawGlobe(cv) {
    const { ctx, w: size } = fit(cv);
    const cx = size / 2, cy = size / 2, R = size * 0.37, tilt = 0.32;
    const rad = Math.PI / 180;
    const land = [];
    LAND.forEach((hex, r) => {
      for (let c = 0; c < 120; c++) {
        const nib = parseInt(hex[c >> 2], 16);
        if (nib & (8 >> (c & 3))) land.push([(90 - (r + 0.5) * 3) * rad, (-180 + (c + 0.5) * 3) * rad]);
      }
    });
    const home = [9.93 * rad, -84.08 * rad]; // San José, Costa Rica
    const nodes = [[25.8, -80.2], [40.7, -74], [19.4, -99.1], [-23.5, -46.6], [40.4, -3.7], [4.7, -74.1], [37.8, -122.4]]
      .map(([a, b]) => [a * rad, b * rad]);
    let rot = 84 * rad; // empieza con Costa Rica al frente

    const P = (lat, lon, alt = 1) => {
      const x = Math.cos(lat) * Math.sin(lon + rot), y = Math.sin(lat), z = Math.cos(lat) * Math.cos(lon + rot);
      const y2 = y * Math.cos(tilt) - z * Math.sin(tilt), z2 = y * Math.sin(tilt) + z * Math.cos(tilt);
      return [cx + x * R * alt, cy - y2 * R * alt, z2];
    };
    const toVec = ([lat, lon]) => [Math.cos(lat) * Math.cos(lon), Math.cos(lat) * Math.sin(lon), Math.sin(lat)];
    const toLL = ([x, y, z]) => [Math.asin(z), Math.atan2(y, x)];
    function arcPoint(a, b, t) { // interpolación sobre la esfera
      const A = toVec(a), B = toVec(b);
      const dot = Math.min(1, A[0] * B[0] + A[1] * B[1] + A[2] * B[2]), om = Math.acos(dot), so = Math.sin(om) || 1;
      const k1 = Math.sin((1 - t) * om) / so, k2 = Math.sin(t * om) / so;
      return toLL([A[0] * k1 + B[0] * k2, A[1] * k1 + B[1] * k2, A[2] * k1 + B[2] * k2]);
    }

    loop(cv, (time) => {
      ctx.clearRect(0, 0, size, size);
      // anillo orbital (parte trasera)
      ctx.save(); ctx.translate(cx, cy); ctx.rotate(-0.38);
      ctx.strokeStyle = "rgba(63,216,242,0.25)"; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.ellipse(0, 0, R * 1.42, R * 0.36, 0, Math.PI, Math.PI * 2); ctx.stroke();
      ctx.restore();

      // esfera
      const g = ctx.createRadialGradient(cx - R * 0.3, cy - R * 0.3, R * 0.1, cx, cy, R);
      g.addColorStop(0, "rgba(20,60,100,0.55)"); g.addColorStop(0.8, "rgba(6,20,40,0.9)"); g.addColorStop(1, "rgba(63,216,242,0.35)");
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, R, 0, 6.283); ctx.fill();
      ctx.shadowColor = "rgba(63,216,242,0.9)"; ctx.shadowBlur = 14;
      ctx.strokeStyle = "rgba(142,244,255,0.75)"; ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.arc(cx, cy, R, 0, 6.283); ctx.stroke();
      ctx.shadowBlur = 0;

      // continentes
      for (const [lat, lon] of land) {
        const [x, y, z] = P(lat, lon);
        if (z <= 0.02) continue;
        ctx.fillStyle = `rgba(142,244,255,${0.25 + z * 0.75})`;
        ctx.fillRect(x - 0.9, y - 0.9, 1.8, 1.8);
      }

      // conexiones desde Costa Rica
      nodes.forEach((n, i) => {
        ctx.strokeStyle = "rgba(142,244,255,0.75)"; ctx.lineWidth = 1;
        ctx.beginPath(); let drawing = false;
        for (let s = 0; s <= 30; s++) {
          const t = s / 30, [la, lo] = arcPoint(home, n, t);
          const [x, y, z] = P(la, lo, 1 + Math.sin(Math.PI * t) * 0.18);
          if (z > 0) { drawing ? ctx.lineTo(x, y) : ctx.moveTo(x, y); drawing = true; } else drawing = false;
        }
        ctx.stroke();
        const pt = ((time / 2600) + i * 0.17) % 1, [pl, po] = arcPoint(home, n, pt);
        const [px, py, pz] = P(pl, po, 1 + Math.sin(Math.PI * pt) * 0.18);
        if (pz > 0) { ctx.fillStyle = "#ffffff"; ctx.beginPath(); ctx.arc(px, py, 1.6, 0, 6.283); ctx.fill(); }
        const [nx, ny, nz] = P(n[0], n[1]);
        if (nz > 0) { ctx.fillStyle = "#8ef4ff"; ctx.beginPath(); ctx.arc(nx, ny, 2, 0, 6.283); ctx.fill(); }
      });
      const [hx, hy, hz] = P(home[0], home[1]);
      if (hz > 0) {
        const pulse = (time / 1400) % 1;
        ctx.strokeStyle = `rgba(60,242,154,${1 - pulse})`;
        ctx.beginPath(); ctx.arc(hx, hy, 3 + pulse * 9, 0, 6.283); ctx.stroke();
        ctx.fillStyle = "#3cf29a"; ctx.beginPath(); ctx.arc(hx, hy, 2.6, 0, 6.283); ctx.fill();
      }

      // anillo orbital (parte delantera) + satélite
      ctx.save(); ctx.translate(cx, cy); ctx.rotate(-0.38);
      ctx.shadowColor = "rgba(63,216,242,0.9)"; ctx.shadowBlur = 8;
      ctx.strokeStyle = "rgba(142,244,255,0.85)"; ctx.lineWidth = 1.3;
      ctx.beginPath(); ctx.ellipse(0, 0, R * 1.42, R * 0.36, 0, 0, Math.PI); ctx.stroke();
      const sa = (time / 5000) * 6.283;
      if (Math.sin(sa) > 0) {
        ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(Math.cos(sa) * R * 1.42, Math.sin(sa) * R * 0.36, 2.4, 0, 6.283); ctx.fill();
      }
      ctx.restore();

      rot += 0.0025;
    });
  }

  /* =========================================================
     BARRAS DE MONITOREO (decorativas)
     ========================================================= */
  const barsCv = document.getElementById("bars");
  if (barsCv) {
    const { ctx, w, h } = fit(barsCv);
    const n = Math.floor((w - 60) / 5);
    const seed = Array.from({ length: n }, (_, i) => Math.random() * 6.283);
    loop(barsCv, (time) => {
      ctx.clearRect(0, 0, w, h);
      const t = time / 900;
      for (let i = 0; i < n; i++) {
        const env = 0.35 + 0.65 * Math.abs(Math.sin(i / n * Math.PI * 2.2 + t * 0.4));
        const v = (0.25 + 0.75 * Math.abs(Math.sin(seed[i] + t * (0.8 + (i % 5) * 0.15)))) * env;
        const bh = Math.max(2, v * (h - 6));
        ctx.fillStyle = `rgba(63,216,242,${0.35 + v * 0.65})`;
        ctx.fillRect(i * 5, h - bh, 2, bh);
      }
      ctx.fillStyle = "rgba(63,216,242,0.12)"; ctx.fillRect(0, h - 1, n * 5, 1);
      // columnas de guiones a la derecha
      for (let c = 0; c < 3; c++) for (let r = 0; r < 8; r++) {
        const on = Math.sin(t * 2 + c + r * 0.7) > -0.2;
        ctx.fillStyle = on ? "rgba(63,216,242,0.8)" : "rgba(63,216,242,0.2)";
        ctx.fillRect(w - 46 + c * 16, 6 + r * ((h - 12) / 8), 8, 2);
      }
    });
  }
})();
