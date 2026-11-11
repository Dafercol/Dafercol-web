# DAFERCOL — Landing page

Sitio web de DAFERCOL SCG SAS construido con [Astro](https://astro.build) 5. Es un sitio 100 % estático:
no necesita servidor ni base de datos y se puede publicar en Netlify, Vercel, Cloudflare Pages o
cualquier hosting de archivos estáticos.

## Repositorio y despliegue

- **Código:** https://github.com/Dafercol/Dafercol-web (cuenta de GitHub de DAFERCOL).
- **Publicación:** proyecto `dafercol-web` en Vercel, conectado a este repositorio. Cada
  cambio que entra a `main` se publica solo en https://www.dafercol.com (también responde en
  https://dafercol-web.vercel.app); las demás ramas y los pull requests generan una vista previa.
- **Dominio:** `dafercol.com` está registrado en mi.com.co y sus DNS se quedan ahí porque el
  correo también vive allá (MX, SPF, IMAP, SMTP). Para Vercel solo hay dos registros: `A @`
  → `216.198.79.1` y `CNAME www` → `11de7b30a9979754.vercel-dns-017.com`. `dafercol.com`
  redirige (308) a `www.dafercol.com`. No cambiar los nameservers a Vercel sin migrar antes
  los registros del correo.
- **Flujo de trabajo:** los cambios se hacen en una rama, se abre un pull request contra
  `main` y se fusiona cuando la vista previa está revisada.

## Requisitos

- Node.js 20.3 o superior (probado con 20.18). Si actualizas a Node 22 puedes migrar a Astro 6.

## Comandos

| Comando           | Acción                                              |
| ----------------- | --------------------------------------------------- |
| `npm install`     | Instala las dependencias                            |
| `npm run dev`     | Servidor local en `http://localhost:4321`           |
| `npm run build`   | Genera el sitio estático en `dist/`                 |
| `npm run preview` | Previsualiza `dist/` antes de publicar              |
| `npm run check`   | Revisa tipos y errores en componentes `.astro`      |
| `npm run catalogo` | Genera el catálogo PDF y su portada en `public/catalogo/` |

## Estructura

```
src/
  data/site.ts            Datos de la empresa, navegación, marcas y categorías
  content.config.ts       Esquema de la colección de productos
  content/products/*.md   Un archivo por producto (define la URL)
  layouts/Layout.astro    HTML base, SEO (meta, Open Graph, JSON-LD), header, footer y WhatsApp
  components/             Header, Footer, Logo, WhatsAppButton, ProductCard, CatalogFilm
  pages/
    index.astro           Inicio
    productos/index.astro Catálogo web con filtros por marca, categoría y búsqueda
    productos/[slug].astro Detalle de producto con especificaciones y relacionados
    quienes-somos.astro
    contacto.astro        Formulario que abre WhatsApp con el mensaje listo
    catalogo.astro        Descarga del catálogo PDF
    404.astro
  styles/global.css       Sistema de diseño: tokens de marca, tipografía, controles
public/
  catalogo/               catalogo-dafercol.pdf y portada.webp (los genera `npm run catalogo`)
  fonts/                  Archivo 900 expandida y Barlow 400–700 (manual de marca)
  marca/                  Logos web e íconos de app (los generan los scripts de scripts/marca/)
  images/productos/       Imágenes de productos
  robots.txt, favicon.ico, apple-touch-icon.png, site.webmanifest, og-default.png
assets/marca/             Manual de marca (PDF), logo original y avatares del manual
scripts/marca/            Generadores de logos, íconos e imagen para redes
```

## Marca

La identidad sale del **Manual de Marca DAFERCOL v1.0** (`assets/marca/`). Lo esencial:

- **Color.** Azul DAFERCOL `#163B6E` para nombre, títulos y textos principales; azul noche
  `#0E2548` para fondos en negativo (film del inicio, heros, pie); aceros `#D3D9E0` `#9AA6B2` `#5F6E7E`
  como acento puntual (raya de las etiquetas, página actual, progreso); rojo manómetro
  `#D2232A` solo en el logo y en avisos de error; gris texto `#6B7A8B`.
- **Tipografía.** Archivo 900 expandida (118 %) para titulares grandes; Barlow para todo
  lo demás. Etiquetas en mayúsculas espaciadas. Ambas alojadas en `public/fonts/`.
- **Logo.** Componente `Logo.astro`: versión a color sobre blanco o gris muy claro,
  negativa sobre azul noche o azul DAFERCOL; mínimo 160 px de ancho en pantalla. No
  redibujar ni recomponer.

Recursos derivados (correr de nuevo si cambian los originales):

| Comando | Genera |
| ------- | ------ |
| `node scripts/marca/logos.mjs` | `public/marca/logo-{color,negativo}-*.webp` y `.png` desde `assets/marca/dafercol-horizontal-color.png`. El negativo reproduce el de la pág. 4 del manual (nombre y línea en blanco, piezas sin contorno). |
| `node scripts/marca/iconos.mjs` | `favicon.ico` (símbolo reducido, pág. 5), `apple-touch-icon.png` e íconos del manifiesto, desde los avatares de la pág. 11. |
| `node scripts/marca/og.mjs` | `public/og-default.png` (1200 × 630). |
| `swift scripts/marca/recorte-manual.swift …` | Renderiza una zona del PDF del manual a PNG (así se sacaron los avatares). |

Cuando el cliente entregue los archivos oficiales en SVG y la versión negativa, conviene
reemplazar los derivados de `public/marca/`.

## Cómo agregar un producto

1. Crea un archivo en `src/content/products/`, por ejemplo `valvula-de-aguja.md`.
   El nombre del archivo será la URL: `/productos/valvula-de-aguja`.
2. Copia el encabezado de otro producto y ajusta los campos:

```md
---
title: 'Válvula de aguja'
brand: valveco             # opcional: valveco | comfit. Sin marca, se muestra por categoría
category: valvulas         # valvulas | racores | tuberia | instrumentacion | reguladores |
                           # muestreo | herramientas | mantenimiento
subcategory: aguja         # una de las subcategorías de esa categoría (ver `categories` en site.ts)
summary: 'Texto corto para la tarjeta (máximo 220 caracteres).'
image: '/images/productos/valvula-de-aguja.jpg'   # opcional
imageFit: contain          # contain = foto recortada sobre fondo blanco; cover (defecto) = foto a sangre
featured: true             # aparece en "Productos destacados" del inicio
sku: 'SS-1RS4'             # opcional
order: 25                  # menor = aparece primero
specs:
  - { label: 'Material', value: 'Acero inoxidable 316' }
datasheet: 'https://...'   # opcional, enlace a ficha técnica
tags: ['válvula', 'aguja']  # palabras extra para la búsqueda
---

Descripción larga en Markdown.
```

3. Guarda la imagen en `public/images/productos/`. Si no hay imagen se usa un placeholder.
   El origen de las fotos de los productos sin marca queda registrado en
   `assets/origen-imagenes/`: el sitio no lo publica, pero sí se ve en el repositorio.

Para agregar una marca, una categoría o una subcategoría, edita los arreglos `brands` y
`categories` en `src/data/site.ts`; el esquema de productos y los filtros se actualizan solos.
El build falla si un producto declara una subcategoría que no pertenece a su categoría, y el
mensaje lista las opciones válidas.

El catálogo acepta enlaces con `?categoria=valvulas&sub=solenoides&marca=valveco&q=ev220`.
Los enlaces viejos a `?categoria=uniones-de-golpe` y `?categoria=accesorios-tuberia` siguen
funcionando: llevan a la categoría y subcategoría nuevas (`legacyCategories` en `site.ts`).

## Catálogo PDF

`npm run catalogo` arma el PDF descargable desde los mismos datos del sitio. Es un
catálogo comercial de 8 páginas, no el listado completo: portada con el índice de líneas,
tres páginas de una línea (un producto destacado en grande y seis tarjetas), tres páginas
de dos líneas (tres o cuatro tarjetas cada una) y contraportada de contacto. Cada producto
enlaza a su ficha en la web y cada línea, a su listado completo.

- **Selección.** Qué productos salen, en qué página y con qué foto de fondo se decide en
  `scripts/catalogo/seleccion.mjs`. Para cambiar un producto basta con reemplazar su
  identificador (el nombre de su archivo, sin `.md`). El script se detiene si un
  identificador no existe, está repetido o no es de esa línea. La selección actual se hizo
  por criterio comercial, sin datos de ventas, y solo con fotos donde no se ve una marca
  que el sitio no nombra.
- **Fotos.** Se recorta el margen blanco para que la pieza llene el marco y se reducen al
  tamaño de impresión, sin ampliar nunca. El texto es vectorial y las tipografías de la
  marca (Archivo y Barlow, licencia OFL, de `public/fonts/`) se incrustan solo con los
  caracteres usados.

El script vive en `scripts/catalogo/build.mjs` y necesita Google Chrome (o
`CHROME_PATH=/ruta/al/chrome`). Tarda unos 5 segundos.

- **Contacto.** Mientras `whatsappIsPlaceholder` sea verdadero, el PDF muestra web, correo
  y horario, y el botón de WhatsApp lleva a `/contacto`. Con los datos reales, vuelve a
  generar el PDF.
- **Cuándo regenerarlo.** Cada vez que cambien productos, fotos, categorías o contacto.
  La página `/catalogo` lee el número de páginas, el peso y la fecha del archivo al compilar.

## Pendientes antes de publicar

- [x] WhatsApp y teléfono reales en `src/data/site.ts` (+57 311 210 9248, confirmado el 3-nov-2026).
- [ ] Dirección, correo y horario reales en `src/data/site.ts` (la dirección se oculta mientras sea de plantilla).
- [x] Dominio www.dafercol.com conectado a Vercel; el sitio y el catálogo usan esa URL (9-nov-2026).
- [ ] Regenerar el catálogo con `npm run catalogo` cuando estén los datos de contacto reales.
- [ ] Reemplazar los productos de ejemplo por los reales y agregar sus imágenes.
- [ ] Ajustar los textos de "Quiénes somos".
- [ ] Pegar el iframe de Google Maps en `src/pages/contacto.astro`.
- [ ] Google Search Console: crear `.env` a partir de `.env.example` con el código de verificación
      y, una vez publicado, enviar `https://<dominio>/sitemap-index.xml`.
- [ ] Crear o reclamar el perfil de Google Business y enlazarlo al sitio.

## Nota de seguridad

`npm audit` reporta avisos en `astro`, `esbuild` y `sharp`. Afectan al servidor de desarrollo o al
proceso de build, no al sitio publicado (HTML estático). Para resolverlos hay que subir a Node 22 y
Astro 6 o superior.
