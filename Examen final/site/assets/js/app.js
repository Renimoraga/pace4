/* =========================================================
   PACE 4 — Lógica del sitio v2
   Carruseles, grillas, filtro del catálogo y ficha de producto.
   Los contenidos se editan en data.js, no aquí.
   ========================================================= */
(() => {
  "use strict";
  const { CONFIG, HERO, CATEGORIAS, PRODUCTOS, CREW } = window.PACE;

  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const money = new Intl.NumberFormat("es-CL", { style: "currency", currency: CONFIG.moneda || "CLP", maximumFractionDigits: 0 });
  const price = (p) => (typeof p.precio === "number" ? money.format(p.precio) : "Precio por confirmar");
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const igUrl = `https://instagram.com/${CONFIG.instagram}`;
  const ttUrl = `https://www.tiktok.com/@${CONFIG.tiktok}`;

  /* ---------- Carrusel ---------- */
  // Portada: prioridad alta (hero/ficha) o diferida (tarjetas). Las fotos siguientes del carrusel se cargan
  // normal: con lazy, el navegador no las pide mientras están ocultas a la derecha y aparecerían en negro.
  const loadAttr = (eager, i) => (i > 0 ? "" : eager ? 'fetchpriority="high"' : 'loading="lazy"');
  function carouselHTML(images, { label, eager = false, sizes = "" } = {}) {
    const many = images.length > 1;
    return `
      <div class="carousel" data-carousel role="region" aria-roledescription="carrusel" aria-label="${esc(label)}">
        <div class="carousel-track">
          ${images.map((im, i) => `
            <div class="carousel-slide" role="group" aria-roledescription="foto" aria-label="${i + 1} de ${images.length}" ${i ? 'aria-hidden="true"' : ""}>
              <img src="${esc(im.src)}" alt="${esc(im.alt)}" ${loadAttr(eager, i)} decoding="async" ${sizes}>
            </div>`).join("")}
        </div>
        ${many ? `
          <button class="c-btn c-prev" type="button" aria-label="Foto anterior">&lt;</button>
          <button class="c-btn c-next" type="button" aria-label="Foto siguiente">&gt;</button>
          <p class="sr-only" aria-live="polite" data-status></p>` : ""}
      </div>`;
  }

  function initCarousel(root, { autoplay = 0 } = {}) {
    const track = $(".carousel-track", root);
    const slides = $$(".carousel-slide", root);
    const status = $("[data-status]", root);
    if (slides.length < 2) return null;
    let i = 0, timer = null;

    function go(n, announce = true) {
      i = (n + slides.length) % slides.length;
      track.style.transform = `translateX(${-100 * i}%)`;
      slides.forEach((s, k) => s.setAttribute("aria-hidden", String(k !== i)));
      if (announce && status) status.textContent = `Foto ${i + 1} de ${slides.length}`;
      root.dispatchEvent(new CustomEvent("slide", { detail: i }));
    }
    $(".c-prev", root).addEventListener("click", () => { go(i - 1); restart(); });
    $(".c-next", root).addEventListener("click", () => { go(i + 1); restart(); });
    root.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") { go(i - 1); e.preventDefault(); }
      if (e.key === "ArrowRight") { go(i + 1); e.preventDefault(); }
    });

    // Swipe táctil
    let x0 = null;
    root.addEventListener("pointerdown", (e) => { if (e.pointerType !== "mouse") x0 = e.clientX; });
    root.addEventListener("pointerup", (e) => {
      if (x0 === null) return;
      const dx = e.clientX - x0; x0 = null;
      if (Math.abs(dx) > 40) { go(dx < 0 ? i + 1 : i - 1); restart(); }
    });
    root.addEventListener("pointercancel", () => (x0 = null));

    // Autoplay opcional (solo hero): se pausa con hover, foco, pestaña oculta o movimiento reducido
    let paused = false;
    function restart() {
      clearInterval(timer);
      if (autoplay && !reduceMotion && !paused) timer = setInterval(() => go(i + 1, false), autoplay);
    }
    if (autoplay) {
      const pause = () => { paused = true; clearInterval(timer); };
      const resume = () => { paused = false; restart(); };
      root.addEventListener("mouseenter", pause);
      root.addEventListener("mouseleave", resume);
      root.addEventListener("focusin", pause);
      root.addEventListener("focusout", resume);
      document.addEventListener("visibilitychange", () => (document.hidden ? pause() : resume()));
      restart();
    }
    return { go };
  }

  /* ---------- Tarjeta de producto ---------- */
  const productUrl = (p) => `producto.html?id=${encodeURIComponent(p.id)}`;
  const card = (p) => `
    <article class="card">
      ${carouselHTML(p.imagenes, { label: `Fotos de ${p.nombre}`, sizes: 'width="427" height="326"' })}
      <h3><a href="${productUrl(p)}">${esc(p.nombre)}</a></h3>
      <div class="card-meta">
        <span class="price">${price(p)}</span>
        <a class="ver-mas" href="${productUrl(p)}" aria-label="Ver más de ${esc(p.nombre)}">Ver más</a>
      </div>
    </article>`;
  function renderGrid(el, list) {
    el.innerHTML = list.map(card).join("");
    $$("[data-carousel]", el).forEach((c) => initCarousel(c));
  }

  /* ---------- Hero ---------- */
  const hero = $("#hero");
  if (hero) {
    hero.innerHTML = carouselHTML(HERO, { label: "Campaña Pace 4", eager: true, sizes: 'width="1512" height="900"' });
    const c = $("[data-carousel]", hero);
    c.classList.add("hero");
    initCarousel(c, { autoplay: 6000 });
  }

  /* ---------- Novedades ---------- */
  const nov = $("#grid-novedades");
  if (nov) renderGrid(nov, PRODUCTOS.filter((p) => p.novedad));

  /* ---------- Crew ---------- */
  const crew = $("#crew-photo");
  if (crew && CREW) {
    crew.href = igUrl;
    crew.innerHTML = `<img src="${esc(CREW.src)}" alt="${esc(CREW.alt)}" width="1005" height="766" loading="lazy" decoding="async">`;
  }

  /* ---------- Catálogo + filtro ---------- */
  const grid = $("#grid-catalogo");
  if (grid) {
    const params = new URLSearchParams(location.search);
    let cat = CATEGORIAS[params.get("categoria")] ? params.get("categoria") : "all";
    const panel = $("#filter-panel");
    const toggle = $("#filter-toggle");
    panel.innerHTML = [["all", "Todo"], ...Object.entries(CATEGORIAS)]
      .map(([v, l]) => `<button type="button" class="chip" data-v="${v}" aria-pressed="false">${esc(l)}</button>`).join("");
    const setOpen = (o) => { toggle.setAttribute("aria-expanded", String(o)); panel.hidden = !o; };
    setOpen(cat !== "all");
    toggle.addEventListener("click", () => setOpen(panel.hidden));

    function apply() {
      $$(".chip", panel).forEach((c) => c.setAttribute("aria-pressed", String(c.dataset.v === cat)));
      const list = PRODUCTOS.filter((p) => cat === "all" || p.categoria === cat);
      renderGrid(grid, list);
      history.replaceState(null, "", cat === "all" ? location.pathname : `?categoria=${cat}`);
    }
    panel.addEventListener("click", (e) => {
      const chip = e.target.closest(".chip");
      if (chip) { cat = chip.dataset.v; apply(); }
    });
    apply();
  }

  /* ---------- Ficha de producto ---------- */
  const pd = $("#pd");
  if (pd) {
    const id = new URLSearchParams(location.search).get("id");
    const p = PRODUCTOS.find((x) => x.id === id);
    if (!p) {
      pd.innerHTML = `<div class="pd-info"><h1>Producto no encontrado</h1><p>Puede que el enlace esté incompleto.</p><a class="btn-lime" href="catalogo.html">Ver todos los productos</a></div>`;
    } else {
      document.title = `${p.nombre} · Pace 4`;
      const m = $('meta[name="description"]');
      if (m) m.content = `${p.nombre} de Pace 4, ${price(p)}. Ropa técnica de la rave a la pista.`;
      const many = p.imagenes.length > 1;
      pd.innerHTML = `
        <div>
          ${carouselHTML(p.imagenes, { label: `Fotos de ${p.nombre}`, eager: true, sizes: 'width="427" height="326"' })}
          ${many ? `<div class="pd-thumbs" role="group" aria-label="Elegir foto">${p.imagenes.map((im, k) =>
            `<button type="button" data-k="${k}" aria-label="Ver foto ${k + 1}" ${k ? "" : 'aria-current="true"'}><img src="${esc(im.src)}" alt="" loading="lazy"></button>`).join("")}</div>` : ""}
        </div>
        <div class="pd-info">
          <h1>${esc(p.nombre)}</h1>
          <p class="price">${price(p)}</p>
          <p>${p.descripcion ? esc(p.descripcion) : '<span class="pending">Descripción [PENDIENTE]</span>'}</p>
          <div>
            <p class="label">Tallas</p>
            <p>${p.tallas.length ? esc(p.tallas.join(" · ")) : '<span class="pending">[PENDIENTE]</span>'}</p>
          </div>
        </div>`;
      const c = $("[data-carousel]", pd);
      const ctl = initCarousel(c);
      if (ctl) {
        const thumbs = $$(".pd-thumbs button", pd);
        thumbs.forEach((b) => b.addEventListener("click", () => ctl.go(Number(b.dataset.k))));
        c.addEventListener("slide", (e) => thumbs.forEach((b, k) =>
          k === e.detail ? b.setAttribute("aria-current", "true") : b.removeAttribute("aria-current")));
      }
    }
  }

  /* ---------- Enlaces de contacto (fuente única: CONFIG) ---------- */
  $$("[data-link]").forEach((a) => {
    const k = a.dataset.link;
    if (k === "email") { a.href = `mailto:${CONFIG.email}`; $("span", a).textContent = CONFIG.email; }
    if (k === "ig") { a.href = igUrl; $("span", a).textContent = `@${CONFIG.instagram}`; }
    if (k === "tt") { a.href = ttUrl; $("span", a).textContent = `@${CONFIG.tiktok}`; }
  });
})();
