/* =========================================================
   PACE 4 — ARCHIVO EDITABLE (v2)
   Todo el contenido comercial del sitio vive aquí.
   - CONFIG: contacto y redes.
   - HERO: fotos del carrusel principal.
   - CATEGORIAS: opciones del filtro del catálogo.
   - PRODUCTOS: el catálogo. `precio` en CLP. `imagenes` = fotos del
     carrusel de la tarjeta (la primera es la portada).
   ========================================================= */

window.PACE = {
  CONFIG: {
    marca: "Pace 4",
    email: "rbd.pace.4@gmail.com",
    instagram: "pace4.cl", // sin @
    tiktok: "pace4.cl", // sin @
    moneda: "CLP",
  },

  HERO: [
    { src: "assets/img/fotos/hero-club.webp", alt: "Pista de baile con luces láser; al centro, una polera Pace 4 con el texto Club Ready, Performance Unlocked" },
    { src: "assets/img/fotos/hero-runner.webp", alt: "Corredor en un túnel con humo y luces de neón, vestido con conjunto deportivo Pace 4" },
    { src: "assets/img/fotos/hero-crop.webp", alt: "Modelo apoyada en un pilar de concreto con crop top y short Pace 4" },
  ],

  CATEGORIAS: {
    tops: "Tops",
    polerones: "Polerones",
    pantalones: "Pantalones",
    chalecos: "Chalecos",
  },

  PRODUCTOS: [
    {
      id: "top-hibrid",
      nombre: "Top Hibrid",
      categoria: "tops",
      precio: 15000,
      novedad: true,
      imagenes: [
        { src: "assets/img/fotos/top-hibrid-1.webp", alt: "Top Hibrid negro con paneles grises, vista frontal" },
        { src: "assets/img/fotos/top-hibrid-2.webp", alt: "Top Hibrid, vista lateral" },
        { src: "assets/img/fotos/top-hibrid-3.webp", alt: "Top Hibrid, vista de espalda con logo Pace" },
      ],
      descripcion: "", // [PENDIENTE]
      tallas: [], // [PENDIENTE]
    },
    {
      id: "chaleco-running-p1",
      nombre: "Chaleco Running P1",
      categoria: "chalecos",
      precio: 35000,
      novedad: true,
      imagenes: [
        { src: "assets/img/fotos/chaleco-running-p1-1.webp", alt: "Chaleco Running P1 negro con bolsillos y franjas reflectantes" },
      ],
      descripcion: "", // [PENDIENTE]
      tallas: [], // [PENDIENTE]
    },
    {
      id: "poleron-tribal",
      nombre: "Polerón Tribal",
      categoria: "polerones",
      precio: 35000,
      novedad: true,
      imagenes: [
        { src: "assets/img/fotos/poleron-tribal-1.webp", alt: "Polerón Tribal gris con capucha y logo Pace bordado en verde" },
      ],
      descripcion: "", // [PENDIENTE]
      tallas: [], // [PENDIENTE]
    },
    {
      id: "buzo-tribal",
      nombre: "Buzo Tribal",
      categoria: "pantalones",
      precio: 45000,
      novedad: true,
      imagenes: [
        { src: "assets/img/fotos/buzo-tribal-1.webp", alt: "Buzo Tribal gris con diseño tribal verde neón en las piernas" },
      ],
      descripcion: "", // [PENDIENTE]
      tallas: [], // [PENDIENTE]
    },
  ],

  CREW: { src: "assets/img/fotos/crew.webp", alt: "Cuatro amigos en un festival vistiendo Pace 4: polerón, tops y pantalones" },
};
