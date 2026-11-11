/**
 * Selección del catálogo PDF (8 páginas: portada, 6 de producto y contraportada).
 *
 * El PDF no lista todo el catálogo: muestra los productos destacados de cada línea
 * y remite a la web para el resto. Para cambiar un producto basta con reemplazar
 * su identificador (el nombre del archivo en src/content/products/, sin ".md") y
 * volver a correr `npm run catalogo`. El script avisa si un identificador no existe.
 *
 * Criterio de la selección (noviembre de 2026, sin datos de ventas): productos de
 * uso general y alta rotación en la industria (válvulas de bola, aguja y cheque,
 * solenoides, racores para tubing, uniones de golpe, manómetros, presostatos),
 * al menos uno por tipo importante de cada línea, y solo con fotos nítidas.
 * Cuando haya cifras reales de ventas, conviene revisarla con ellas.
 *
 * Tipos de página:
 *   - 'completa': una línea a página entera. `destacado` va en grande y `productos`
 *     son exactamente 6 tarjetas.
 *   - 'doble': dos líneas, media página cada una, con 3 o 4 `productos`.
 *
 * `foto` es un cuadro del film del inicio (src/assets/film/stop-N@2x.webp) y
 * `encuadre` su posición (background-position) dentro de la banda.
 */
export const paginas = [
  {
    tipo: 'completa',
    categoria: 'valvulas',
    titulo: 'Válvulas',
    texto: 'Bola, aguja, cheque, alivio, compuerta y mariposa para proceso e instrumentación.',
    foto: 2,
    encuadre: '60% 45%',
    destacado: 'comfit-valvula-de-bola-alta-presion-serie-chpbv',
    productos: [
      'valveco-monva-valvula-de-bola-paso-full-ss316-npt-1000wog',
      'valveco-abac-valvula-aguja-de-bloqueo-ss-6000-psi',
      'valveco-abac-valvula-cheque-inoxidable-roscado-npt-6000-psi',
      'comfit-valvula-de-alivio-de-presion',
      'valvulas-compuerta-gate-valve-demco-style',
      'valveco-bray-valvula-de-mariposa-serie-30',
    ],
  },
  {
    tipo: 'completa',
    categoria: 'valvulas',
    titulo: 'Automatización y control',
    texto: 'Válvulas solenoides, actuadores eléctricos y neumáticos, y manifolds para instrumentación.',
    foto: 4,
    encuadre: '50% 40%',
    destacado: 'valveco-danfoss-valvula-solenoide-servo-operada-ev220b-serie-6-22',
    productos: [
      'valveco-asco-valvulas-solenoides-de-uso-general-nc-na-2-2-serie-8210',
      'valveco-thermoval-valvula-solenoide-n-c-bronce-npt-uso-general',
      'valveco-festo-blch-electrovalvula-namur-5-2',
      'valveco-valbia-actuador-electricos-1-4-de-giro-serie-85',
      'valveco-monva-actuador-neumatico-de-simple-y-doble-efecto',
      'comfit-manifold-3-valvulas-montaje-directo',
    ],
  },
  {
    tipo: 'completa',
    categoria: 'racores',
    foto: 1,
    encuadre: '70% 55%',
    destacado: 'union-de-golpe-fig-1502',
    productos: [
      'valveco-allflows-conector-recto-macho-316-ss-5000-psi-od-x-mnpt-para-tubing',
      'valveco-allflows-conector-codo-union-316-ss-5000-psi-od-x-od-para-tubing',
      'uniones-para-tubo',
      'swivel-joints',
      'pup-joint',
      'union-de-golpe-fig-602',
    ],
  },
  {
    tipo: 'doble',
    bloques: [
      {
        categoria: 'tuberia',
        foto: 3,
        encuadre: '40% 60%',
        productos: [
          'tubing-en-acero-inoxidable',
          'manguera-metalica-serie-fm',
          'bridas',
          'valveco-tubinox-codo-inoxidable-sanitario-t-304-316l-clamp-astm-a270-3a-din118',
        ],
      },
      {
        categoria: 'instrumentacion',
        foto: 2,
        encuadre: '100% 20%',
        productos: [
          'valveco-winters-manometro-calibrable-dial-4-totalmente-inoxidable-cv-1-2',
          'valveco-danfoss-presostato-de-uso-industrial-tipo-rt',
          'valveco-danfoss-transmisor-de-presion-ip-65-mbs-3000',
          'valveco-danfoss-sensor-de-temperatura-pt-1-000-con-transmisor-mbt-3560',
        ],
      },
    ],
  },
  {
    tipo: 'doble',
    bloques: [
      {
        categoria: 'reguladores',
        foto: 4,
        encuadre: '80% 70%',
        productos: [
          'valveco-genebre-valvula-reguladora-reductora-de-presion-para-agua',
          'reguladores-de-presion-pilotados',
          'reguladores-de-contrapresion-pilotados',
          'reguladores-de-presion-calefactados-electricamente',
        ],
      },
      {
        categoria: 'muestreo',
        foto: 0,
        encuadre: '30% 60%',
        productos: [
          'valveco-filtro-en-y-de-acero-inoxidable-y-laton-para-mejor-calidad-de-fluidos',
          'cilindros-con-dos-conexiones',
          'cilindros-con-una-conexion',
        ],
      },
    ],
  },
  {
    tipo: 'doble',
    bloques: [
      {
        categoria: 'herramientas',
        foto: 3,
        encuadre: '90% 30%',
        productos: [
          'llaves-en-bronce',
          'macetas-en-bronce-con-cabo-de-fibra-de-vidrio',
          'dobladoras-de-tubo-manuales',
          'equipo-de-soldadura',
        ],
      },
      {
        categoria: 'mantenimiento',
        foto: 0,
        encuadre: '75% 35%',
        productos: [
          'valveco-danfoss-kit-de-reparacion-para-valvula-ev220-b-serie-6-22',
          'sellos-o-ring-para-hammer-unions',
          'wd-40',
          'desengrasante-h7',
        ],
      },
    ],
  },
];
