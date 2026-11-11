/**
 * Textos de las páginas de categoría (/productos/valvulas/) y de tipo
 * (/productos/valvulas/bola/). Son las páginas que pueden posicionar en
 * búsquedas genéricas como "válvulas de bola en Colombia", así que cada una
 * lleva un texto propio, no copiado de fabricantes.
 *
 * - `h1`: titular visible. Si falta, se usa el nombre del árbol (site.ts).
 * - `title`: <title> completo, hasta ~60 caracteres.
 * - `description`: meta descripción, 110–155 caracteres.
 * - `intro`: uno o dos párrafos bajo el titular.
 *
 * Las claves de `subs` son `categoria/tipo`, los mismos slugs de site.ts. Si se
 * agrega un tipo nuevo sin texto aquí, la página se genera igual con un texto
 * básico armado con su nombre (y la construcción avisa).
 */
export interface SeoText {
  h1?: string;
  title: string;
  description: string;
  intro: string[];
}

export const seoCategorias: Record<string, SeoText> = {
  valvulas: {
    h1: 'Válvulas industriales',
    title: 'Válvulas industriales en Colombia | DAFERCOL',
    description:
      'Válvulas de bola, aguja, cheque, solenoides, mariposa, diafragma y manifolds para proceso e instrumentación. Cotiza por WhatsApp con DAFERCOL.',
    intro: [
      'Válvulas para aislar, regular, proteger y automatizar líneas de proceso, vapor, agua, aire, gases e hidrocarburos. Hay modelos en acero inoxidable, bronce y acero al carbono, con conexión roscada, para tubing, bridada o para soldar.',
      'Elige el tipo de válvula según la función: bola para cierre rápido, aguja para regulación fina, cheque para evitar el retorno, alivio para proteger el sistema y solenoides o actuadores para automatizar.',
    ],
  },
  racores: {
    h1: 'Racores y conexiones',
    title: 'Racores y conexiones para tubing | DAFERCOL',
    description:
      'Racores de compresión para tubing, alta presión, VCR y VCO, roscados, para soldar y uniones de golpe. Cotiza por WhatsApp con DAFERCOL.',
    intro: [
      'Conexiones para unir tubing, tubería, mangueras e instrumentos sin fugas. Incluye racores de doble férula para instrumentación, accesorios de alta presión con cono y rosca, conexiones de cierre frontal para vacío y alta pureza, y uniones de golpe para el sector petrolero.',
      'Para elegir bien hace falta el diámetro exterior del tubo, el tipo de rosca, el material y la presión de trabajo. Si tienes la referencia de la pieza instalada, con eso basta.',
    ],
  },
  tuberia: {
    h1: 'Tubería, tubing y mangueras',
    title: 'Tubería, tubing y mangueras industriales | DAFERCOL',
    description:
      'Tubing de acero inoxidable, mangueras metálicas y de PTFE, bridas, codos y línea sanitaria para la industria. Cotiza por WhatsApp con DAFERCOL.',
    intro: [
      'Tubing sin costura para instrumentación, mangueras flexibles metálicas, de PTFE, goma y termoplástico, accesorios de tubería y componentes sanitarios para la industria de alimentos y farmacéutica.',
      'Indica el diámetro, el espesor de pared, el material y el fluido, y te ayudamos a elegir la línea completa con sus conexiones.',
    ],
  },
  instrumentacion: {
    h1: 'Instrumentación y medición',
    title: 'Instrumentación y medición industrial | DAFERCOL',
    description:
      'Manómetros, termómetros, sensores de temperatura, transmisores de presión, presostatos y medidores de caudal. Cotiza por WhatsApp con DAFERCOL.',
    intro: [
      'Instrumentos para medir y controlar presión, temperatura y caudal en planta: manómetros de carátula, termómetros y termopozos, sensores y transmisores electrónicos, presostatos, termostatos y medidores de agua.',
      'Para cotizar indícanos el rango de medida, la conexión al proceso y el tipo de fluido.',
    ],
  },
  reguladores: {
    h1: 'Reguladores de presión',
    title: 'Reguladores de presión y contrapresión | DAFERCOL',
    description:
      'Reguladores reductores de presión, de contrapresión, pilotados y para gases especiales en instrumentación y proceso. Cotiza con DAFERCOL.',
    intro: [
      'Reguladores que mantienen estable la presión aguas abajo (reductores) o aguas arriba (contrapresión), con resorte o pilotados, para agua, aire, vapor, gases de proceso y gases de alta pureza.',
      'Para elegir el regulador hace falta la presión de entrada, la presión de salida deseada, el caudal y el fluido.',
    ],
  },
  muestreo: {
    h1: 'Filtración y toma de muestras',
    title: 'Filtros y toma de muestras industriales | DAFERCOL',
    description:
      'Filtros en Y, de partículas y coalescentes, cilindros de muestreo y sistemas para instrumentación analítica. Cotiza por WhatsApp con DAFERCOL.',
    intro: [
      'Equipos para proteger instrumentos y tomar muestras representativas del proceso: filtros de línea, cilindros de toma de muestras en acero inoxidable y sistemas analíticos armados para acondicionar la muestra antes del analizador.',
    ],
  },
  herramientas: {
    h1: 'Herramientas industriales',
    title: 'Herramientas antichispa y para tubing | DAFERCOL',
    description:
      'Herramientas antichispa en bronce, dobladoras y cortadores de tubo, y equipos para soldadura orbital. Cotiza por WhatsApp con DAFERCOL.',
    intro: [
      'Herramientas para el montaje y el mantenimiento de líneas de fluido: herramientas manuales antichispa para áreas clasificadas, equipos para cortar, ranurar y doblar tubing, y accesorios para soldadura orbital.',
    ],
  },
  mantenimiento: {
    h1: 'Mantenimiento y repuestos',
    title: 'Repuestos, kits y lubricantes industriales | DAFERCOL',
    description:
      'Kits de reparación para válvulas solenoides, sellos para uniones de golpe, recambios, lubricantes y sellantes de roscas. Cotiza con DAFERCOL.',
    intro: [
      'Repuestos para devolver al servicio válvulas, reguladores y conexiones sin reemplazar el equipo completo, y productos químicos para el mantenimiento diario: lubricantes, sellantes de roscas, desengrasantes y detectores de fugas.',
    ],
  },
};

export const seoTipos: Record<string, SeoText> = {
  // ---- Válvulas ----
  'valvulas/bola': {
    h1: 'Válvulas de bola',
    title: 'Válvulas de bola en acero inoxidable | DAFERCOL',
    description:
      'Válvulas de bola de 2 y 3 vías, roscadas, bridadas y para tubing, de alta presión y uso general. Cotiza por WhatsApp con DAFERCOL.',
    intro: [
      'La válvula de bola abre y cierra con un cuarto de vuelta y sella bien con poca pérdida de presión. Hay modelos de una, dos y tres piezas, de paso completo o reducido, de 2 y 3 vías, flotantes y trunnion, en acero inoxidable, bronce y acero al carbono.',
    ],
  },
  'valvulas/aguja': {
    h1: 'Válvulas de aguja y regulación',
    title: 'Válvulas de aguja para instrumentación | DAFERCOL',
    description:
      'Válvulas de aguja, de regulación y para manómetro, de bonete integral o roscado y hasta alta presión. Cotiza por WhatsApp con DAFERCOL.',
    intro: [
      'Las válvulas de aguja permiten regular el caudal con precisión y aislar instrumentos como manómetros y transmisores. Se ofrecen con bonete integral o roscado, cuerpo forjado o de barra, y conexiones NPT o para tubing.',
    ],
  },
  'valvulas/cheque': {
    h1: 'Válvulas cheque y antirretorno',
    title: 'Válvulas cheque y antirretorno | DAFERCOL',
    description:
      'Válvulas cheque de instrumentación, roscadas, de bronce y sanitarias para evitar el retorno del fluido. Cotiza por WhatsApp con DAFERCOL.',
    intro: [
      'La válvula cheque deja pasar el fluido en un solo sentido y cierra sola si el flujo se invierte. Protege bombas, compresores e instrumentos; hay modelos de resorte, de disco, tipo globo y de cortina.',
    ],
  },
  'valvulas/alivio': {
    h1: 'Válvulas de alivio y seguridad',
    title: 'Válvulas de alivio de presión | DAFERCOL',
    description:
      'Válvulas de alivio de presión proporcionales, de media presión y de purga para proteger líneas y equipos. Cotiza por WhatsApp con DAFERCOL.',
    intro: [
      'Las válvulas de alivio abren cuando la presión supera el valor ajustado y descargan el exceso para proteger la línea y el equipo. Se eligen por el rango de ajuste, la conexión y el fluido.',
    ],
  },
  'valvulas/solenoides': {
    h1: 'Válvulas solenoides y bobinas',
    title: 'Válvulas solenoides y bobinas | DAFERCOL',
    description:
      'Válvulas solenoides de 2 y 3 vías para agua, aire, vapor y gas, bobinas, conectores y temporizadores. Cotiza por WhatsApp con DAFERCOL.',
    intro: [
      'Las electroválvulas abren y cierran el paso del fluido con una señal eléctrica. Hay modelos de acción directa y servoaccionadas, normalmente cerradas o abiertas, en bronce, acero inoxidable y PVC, además de bobinas y conectores de repuesto.',
      'Para cotizar indica el fluido, la presión, el tamaño de la conexión y el voltaje de la bobina.',
    ],
  },
  'valvulas/mariposa': {
    h1: 'Válvulas de mariposa',
    title: 'Válvulas de mariposa wafer y sanitarias | DAFERCOL',
    description:
      'Válvulas de mariposa tipo wafer con asiento resiliente y válvulas sanitarias en acero inoxidable. Cotiza por WhatsApp con DAFERCOL.',
    intro: [
      'La válvula de mariposa es la opción compacta y económica para diámetros grandes: cierra con un cuarto de vuelta y se acciona con palanca, reductor o actuador.',
    ],
  },
  'valvulas/compuerta-globo-macho': {
    h1: 'Válvulas de compuerta, globo y tapón',
    title: 'Válvulas de compuerta, globo y tapón | DAFERCOL',
    description:
      'Válvulas de compuerta y globo en bronce para vapor y agua, y válvulas compuerta y tapón para servicio petrolero. Cotiza con DAFERCOL.',
    intro: [
      'Válvulas de compuerta para aislar con paso total, de globo para regular, y válvulas tapón y compuerta de alta presión para perforación, cementación y producción petrolera.',
    ],
  },
  'valvulas/diafragma-fuelle': {
    h1: 'Válvulas de diafragma y fuelle',
    title: 'Válvulas de diafragma y de fuelle | DAFERCOL',
    description:
      'Válvulas de diafragma de alta pureza y sanitarias, y válvulas de fuelle sin empaquetadura para servicios críticos. Cotiza con DAFERCOL.',
    intro: [
      'En estas válvulas el fluido no toca el mecanismo de accionamiento, por eso se usan en gases de alta pureza, procesos sanitarios y servicios donde no se admiten fugas al ambiente.',
    ],
  },
  'valvulas/manifolds': {
    h1: 'Manifolds y monobridas',
    title: 'Manifolds de 2, 3 y 5 válvulas | DAFERCOL',
    description:
      'Manifolds de 2, 3 y 5 válvulas para transmisores, monobridas de bloqueo y purga y choke manifolds. Cotiza por WhatsApp con DAFERCOL.',
    intro: [
      'Los manifolds agrupan varias válvulas en un solo bloque para aislar, igualar y purgar transmisores de presión. Las monobridas reemplazan el conjunto de válvula y brida en la toma de proceso con menos peso y menos puntos de fuga.',
    ],
  },
  'valvulas/actuadores': {
    h1: 'Actuadores para válvulas',
    title: 'Actuadores eléctricos y neumáticos | DAFERCOL',
    description:
      'Actuadores eléctricos de cuarto de vuelta, actuadores neumáticos de simple y doble efecto y kits de montaje. Cotiza con DAFERCOL.',
    intro: [
      'Actuadores para automatizar válvulas de bola y mariposa. Los eléctricos se eligen por el torque y el voltaje; los neumáticos, por el torque y la presión de aire disponible. El montaje suele seguir la norma ISO 5211.',
    ],
  },
  'valvulas/acoples-rapidos': {
    h1: 'Enchufes rápidos',
    title: 'Enchufes y acoples rápidos | DAFERCOL',
    description:
      'Enchufes rápidos para instrumentación, en miniatura, de gran caudal y con juntas de PTFE para conectar y desconectar sin herramientas.',
    intro: [
      'Los enchufes rápidos permiten conectar y desconectar líneas sin herramientas. Hay versiones con cierre en uno o en los dos extremos para que el fluido no se derrame al desconectar.',
    ],
  },
  'valvulas/especiales': {
    h1: 'Válvulas para vapor y especiales',
    title: 'Trampas de vapor y válvulas especiales | DAFERCOL',
    description:
      'Trampas de vapor, válvulas de asiento inclinado y válvulas de flotador para aplicaciones especiales. Cotiza por WhatsApp con DAFERCOL.',
    intro: [
      'Válvulas para servicios específicos: trampas que retiran el condensado de las líneas de vapor, válvulas de asiento inclinado para vapor y fluidos con sólidos, y válvulas de flotador para controlar nivel en tanques.',
    ],
  },

  // ---- Racores ----
  'racores/racores-para-tubo': {
    h1: 'Racores para tubo y tubing',
    title: 'Racores para tubing de doble férula | DAFERCOL',
    description:
      'Racores de doble férula para tubing en acero inoxidable 316: conectores, codos, tes, uniones y reducciones. Cotiza con DAFERCOL.',
    intro: [
      'Los racores de compresión de doble férula sujetan el tubing y sellan sin soldadura ni roscas en el tubo. Son el estándar en líneas de instrumentación: conectores macho y hembra, codos, tes, cruces, uniones, reducciones, tapones y pasamuros.',
      'Se piden por el diámetro exterior del tubo (en pulgadas o milímetros) y, si llevan rosca, por su tipo y tamaño.',
    ],
  },
  'racores/alta-presion': {
    h1: 'Racores de alta presión',
    title: 'Racores de alta presión con cono y rosca | DAFERCOL',
    description:
      'Conectores, uniones, tapones, pasamuros y adaptadores de alta presión con cono y rosca para tubo. Cotiza por WhatsApp con DAFERCOL.',
    intro: [
      'Accesorios con conexión de cono y rosca para líneas de muy alta presión, donde un racor de compresión estándar no alcanza. Incluyen conectores, uniones, tapones, pasamuros, adaptadores y collarines.',
    ],
  },
  'racores/cierre-frontal': {
    h1: 'Conexiones de cierre frontal VCR y VCO',
    title: 'Conexiones VCR y VCO de cierre frontal | DAFERCOL',
    description:
      'Conexiones VCR con junta metálica y VCO con junta tórica para vacío, alta pureza y semiconductores. Cotiza por WhatsApp con DAFERCOL.',
    intro: [
      'Las conexiones de cierre frontal sellan por la cara, sin desplazar el tubo al montarlas. Las VCR usan junta metálica y sirven para vacío y gases de alta pureza; las VCO usan junta tórica y se reconectan muchas veces.',
    ],
  },
  'racores/roscados': {
    h1: 'Accesorios roscados',
    title: 'Accesorios roscados en acero inoxidable | DAFERCOL',
    description:
      'Adaptadores, acoplamientos, manguitos, reducciones, tapones y tuercas de unión roscados para tubería. Cotiza por WhatsApp con DAFERCOL.',
    intro: [
      'Accesorios para unir tubería e instrumentos por rosca: adaptadores, acoplamientos, manguitos, reductores, tapones y tuercas de unión, en roscas NPT, ISO y otras.',
    ],
  },
  'racores/soldables': {
    h1: 'Accesorios para soldar',
    title: 'Accesorios para soldar a tope y encastre | DAFERCOL',
    description:
      'Accesorios para soldadura a tope y por encastre, y adaptadores para soldar en tubo de alta pureza. Cotiza por WhatsApp con DAFERCOL.',
    intro: [
      'Accesorios para uniones permanentes por soldadura, a tope o por encastre, cuando la línea no debe desarmarse y se busca la menor cantidad de puntos de fuga.',
    ],
  },
  'racores/uniones-de-golpe': {
    h1: 'Uniones de golpe e integrales',
    title: 'Uniones de golpe Fig. 602, 1002 y 1502 | DAFERCOL',
    description:
      'Uniones de golpe (hammer unions) Fig. 100 a 2202, swivel joints, pup joints y conexiones integrales para el sector petrolero.',
    intro: [
      'Las uniones de golpe se arman y desarman a golpe de maceta, sin herramientas especiales, en líneas temporales de alta presión. Se identifican por figura según la presión de trabajo: Fig. 100 y 200 para baja presión, 602 y 1002 para media, y 1502 y 2202 para alta presión y servicio ácido.',
      'Completan la línea las swivel joints, pup joints, codos y tes integrales y las mangueras integrales.',
    ],
  },
  'racores/especiales': {
    h1: 'Bridas, vacío y conexiones especiales',
    title: 'Bridas, uniones dieléctricas y vacío | DAFERCOL',
    description:
      'Bridas ANSI, DIN y EN, uniones dieléctricas, conexiones Ultra-Torr para vacío y accesorios de PFA. Cotiza por WhatsApp con DAFERCOL.',
    intro: [
      'Conexiones para casos particulares: bridas según norma ANSI, DIN o EN, uniones dieléctricas que aíslan eléctricamente la instrumentación, conexiones Ultra-Torr para vacío y accesorios de PFA para químicos agresivos.',
    ],
  },

  // ---- Tubería ----
  'tuberia/tubo': {
    h1: 'Tubo y tubing',
    title: 'Tubing de acero inoxidable 316L | DAFERCOL',
    description:
      'Tubing sin costura de acero inoxidable 316L para instrumentación y tubería inoxidable SCH40 para proceso. Cotiza con DAFERCOL.',
    intro: [
      'Tubing de precisión para líneas de instrumentación y tubería para proceso. El tubing se pide por diámetro exterior y espesor de pared; la tubería, por diámetro nominal y cédula.',
    ],
  },
  'tuberia/mangueras': {
    h1: 'Mangueras y tubo flexible',
    title: 'Mangueras metálicas, de PTFE y de goma | DAFERCOL',
    description:
      'Mangueras metálicas, de PTFE, goma, nailon y polietileno, tubo flexible y sus conexiones finales. Cotiza por WhatsApp con DAFERCOL.',
    intro: [
      'Mangueras para absorber vibración, movimiento y dilatación, o para conexiones que se cambian a menudo. Se eligen por el fluido, la presión, la temperatura y el radio de curvatura, y se entregan con las conexiones finales que necesites.',
    ],
  },
  'tuberia/accesorios': {
    h1: 'Bridas, codos y accesorios de tubería',
    title: 'Bridas, codos, tes y accesorios de tubería | DAFERCOL',
    description:
      'Bridas, codos, tes, caps, juntas antivibratorias, ring gaskets y soportes para tubería industrial. Cotiza por WhatsApp con DAFERCOL.',
    intro: [
      'Accesorios para armar y soportar líneas de tubería: bridas, codos, tes, caps, juntas antivibratorias, empaques tipo anillo y sistemas de soporte.',
    ],
  },
  'tuberia/sanitaria': {
    h1: 'Línea sanitaria',
    title: 'Accesorios sanitarios en acero inoxidable | DAFERCOL',
    description:
      'Tubería, codos, tes, férulas, abrazaderas clamp, empaques y visores sanitarios en acero inoxidable. Cotiza por WhatsApp con DAFERCOL.',
    intro: [
      'Componentes en acero inoxidable 304 y 316L con acabado sanitario para alimentos, bebidas, lácteos y farmacéutica: tubería, codos, tes, férulas, abrazaderas clamp, empaques, uniones y visores.',
    ],
  },

  // ---- Instrumentación ----
  'instrumentacion/manometros': {
    h1: 'Manómetros',
    title: 'Manómetros industriales y de glicerina | DAFERCOL',
    description:
      'Manómetros de carátula en acero inoxidable, caja fenólica y baja presión, protectores y amortiguadores de pulsación. Cotiza con DAFERCOL.',
    intro: [
      'Manómetros para leer la presión en línea, con carátulas de 1,5 a 4,5 pulgadas, conexión inferior o posterior y caja seca o con glicerina. También amortiguadores de pulsación y protectores para alargar su vida útil.',
      'Para cotizar indica el rango, el diámetro de la carátula y la conexión.',
    ],
  },
  'instrumentacion/temperatura': {
    h1: 'Medición de temperatura',
    title: 'Sensores de temperatura y termómetros | DAFERCOL',
    description:
      'Sensores PT100 y PT1000, transmisores de temperatura, termómetros bimetálicos, termopares y termopozos. Cotiza por WhatsApp con DAFERCOL.',
    intro: [
      'Instrumentos para medir temperatura en líneas y equipos: termómetros bimetálicos de lectura directa, sensores PT100 y PT1000 con o sin transmisor, termopares y termopozos que permiten retirar el sensor sin abrir el proceso.',
    ],
  },
  'instrumentacion/presion': {
    h1: 'Transmisores de presión',
    title: 'Transmisores y transductores de presión | DAFERCOL',
    description:
      'Transmisores de presión IP65 y a prueba de explosión, y transductores para aplicaciones industriales. Cotiza por WhatsApp con DAFERCOL.',
    intro: [
      'Transmisores que convierten la presión en una señal eléctrica para el sistema de control. Se eligen por el rango, la señal de salida, la conexión al proceso y la clasificación del área.',
    ],
  },
  'instrumentacion/presostatos': {
    h1: 'Presostatos y termostatos',
    title: 'Presostatos y termostatos industriales | DAFERCOL',
    description:
      'Presostatos, presostatos diferenciales, termostatos y switches de flujo para control y alarma en procesos. Cotiza con DAFERCOL.',
    intro: [
      'Interruptores que abren o cierran un contacto cuando la presión, la temperatura o el flujo cruzan un valor ajustado. Se usan para arrancar y parar bombas y compresores, y para alarmas y protección de equipos.',
    ],
  },
  'instrumentacion/caudal': {
    h1: 'Medición de caudal y contadores',
    title: 'Medidores de caudal y contadores de agua | DAFERCOL',
    description:
      'Contadores de agua de chorro único y múltiple, medidores Woltman, rotámetros y sensores de caudal. Cotiza por WhatsApp con DAFERCOL.',
    intro: [
      'Medidores para registrar el consumo de agua y controlar el caudal en procesos: contadores de chorro único y múltiple, medidores Woltman para diámetros grandes, rotámetros de área variable y sensores de caudal.',
    ],
  },

  // ---- Reguladores ----
  'reguladores/presion': {
    h1: 'Reguladores reductores de presión',
    title: 'Reguladores reductores de presión | DAFERCOL',
    description:
      'Reguladores reductores de presión de resorte y pilotados, para agua, aire, gases y vaporización de muestras. Cotiza con DAFERCOL.',
    intro: [
      'Los reguladores reductores bajan la presión de entrada a un valor estable en la salida, aunque cambien el caudal o la presión de suministro.',
    ],
  },
  'reguladores/contrapresion': {
    h1: 'Reguladores de contrapresión',
    title: 'Reguladores de contrapresión | DAFERCOL',
    description:
      'Reguladores de contrapresión de resorte y pilotados para mantener estable la presión aguas arriba del sistema. Cotiza con DAFERCOL.',
    intro: [
      'Los reguladores de contrapresión mantienen la presión aguas arriba en el valor ajustado y descargan el exceso. Protegen equipos sensibles y estabilizan sistemas con demanda variable.',
    ],
  },
  'reguladores/especiales': {
    h1: 'Reguladores para gases y aplicaciones especiales',
    title: 'Reguladores para gases especiales | DAFERCOL',
    description:
      'Reguladores de alta pureza, de cambio automático de botellas, para inertización de tanques y vaporizadores. Cotiza con DAFERCOL.',
    intro: [
      'Reguladores pensados para un uso concreto: gases de alta pureza, cambio automático entre dos botellas de gas, inertización de tanques y vaporización de muestras líquidas.',
    ],
  },

  // ---- Muestreo ----
  'muestreo/filtros': {
    h1: 'Filtros industriales',
    title: 'Filtros en Y, de partículas y coalescentes | DAFERCOL',
    description:
      'Filtros en Y para vapor y fluidos, filtros de partículas, coalescentes y de gas de alta pureza. Cotiza por WhatsApp con DAFERCOL.',
    intro: [
      'Filtros que retienen sólidos y líquidos arrastrados para proteger válvulas, reguladores e instrumentos. Se eligen por el tamaño de partícula, el caudal y la conexión.',
    ],
  },
  'muestreo/cilindros': {
    h1: 'Cilindros de toma de muestras',
    title: 'Cilindros de muestreo en acero inoxidable | DAFERCOL',
    description:
      'Cilindros de toma de muestras de una y dos conexiones en acero inoxidable 304L y 316L, en varias capacidades. Cotiza con DAFERCOL.',
    intro: [
      'Cilindros a presión para tomar y transportar muestras de gas o líquido del proceso al laboratorio sin que la muestra se pierda ni se contamine.',
    ],
  },
  'muestreo/sistemas': {
    h1: 'Sistemas analíticos y de muestreo',
    title: 'Sistemas de toma de muestras y analíticos | DAFERCOL',
    description:
      'Paneles de toma de muestras, estaciones de calibración, lazos rápidos y sistemas de distribución de gas. Cotiza con DAFERCOL.',
    intro: [
      'Sistemas armados que llevan la muestra del proceso al analizador en las condiciones correctas: sondas, lazos rápidos, estaciones de acondicionamiento y calibración, y paneles de distribución de gas.',
    ],
  },

  // ---- Herramientas ----
  'herramientas/manuales': {
    h1: 'Herramientas manuales y antichispa',
    title: 'Herramientas antichispa en bronce | DAFERCOL',
    description:
      'Llaves, macetas, picas y palas antichispa para áreas clasificadas, y herramienta manual para mantenimiento. Cotiza con DAFERCOL.',
    intro: [
      'Las herramientas antichispa, de bronce o aleaciones especiales, no generan chispas al golpear o friccionar. Son obligatorias en áreas con gases o polvos inflamables.',
    ],
  },
  'herramientas/tubo': {
    h1: 'Corte y doblado de tubo',
    title: 'Dobladoras y cortadores de tubo | DAFERCOL',
    description:
      'Dobladoras manuales, de banco y eléctricas, cortadores, ranuradoras y unidades de preensamblaje para tubing. Cotiza con DAFERCOL.',
    intro: [
      'Herramientas para preparar el tubing antes de conectarlo: cortarlo a escuadra, doblarlo sin aplastarlo y preensamblar las férulas para que la conexión selle a la primera.',
    ],
  },
  'herramientas/soldadura': {
    h1: 'Soldadura orbital',
    title: 'Equipos de soldadura orbital | DAFERCOL',
    description:
      'Unidades de potencia, cabezales, bloques de fijación y consumibles para soldadura orbital de tubo. Cotiza por WhatsApp con DAFERCOL.',
    intro: [
      'La soldadura orbital une tubo de forma automática y repetible, con la calidad que exigen las líneas de alta pureza. Aquí están la unidad de potencia, los cabezales, los bloques de fijación y los consumibles.',
    ],
  },

  // ---- Mantenimiento ----
  'mantenimiento/repuestos': {
    h1: 'Repuestos y kits de reparación',
    title: 'Kits de reparación y repuestos de válvulas | DAFERCOL',
    description:
      'Kits de reparación para válvulas solenoides, sellos para uniones de golpe y recambios para válvulas, filtros y reguladores.',
    intro: [
      'Repuestos para devolver al servicio un equipo sin reemplazarlo: kits de reparación para válvulas solenoides, sellos y o-rings para uniones de golpe y recambios para válvulas, filtros, reguladores y enchufes rápidos.',
      'Envíanos la referencia o una foto de la placa del equipo y te decimos qué kit lleva.',
    ],
  },
  'mantenimiento/quimicos': {
    h1: 'Lubricantes, sellantes y químicos',
    title: 'Lubricantes, sellantes y desengrasantes | DAFERCOL',
    description:
      'Lubricantes multipropósito y para roscas, sellantes anaeróbicos, desengrasantes y detectores de fugas líquidos. Cotiza con DAFERCOL.',
    intro: [
      'Productos para el mantenimiento diario de líneas y equipos: lubricantes multipropósito y para roscas, sellantes que evitan fugas en conexiones roscadas, desengrasantes y líquidos para detectar fugas.',
    ],
  },
};
