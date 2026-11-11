#!/usr/bin/env node
/**
 * Genera el catálogo PDF de DAFERCOL a partir de los mismos datos del sitio.
 *
 *   npm run catalogo
 *
 * Salida:
 *   public/catalogo/catalogo-dafercol.pdf   (lo descarga /catalogo)
 *   public/catalogo/portada.webp            (vista previa en /catalogo)
 *
 * Qué es: un catálogo comercial de 8 páginas con los productos destacados de
 * cada línea, no el listado completo (ese vive en la web). La selección y el
 * orden de las páginas están en scripts/catalogo/seleccion.mjs.
 *
 *   1  Portada con el índice de líneas.
 *   2–4  Una línea por página: banda con foto, un producto destacado en grande
 *        (foto, resumen, datos clave) y seis tarjetas.
 *   5–7  Dos líneas por página, con tres o cuatro tarjetas cada una.
 *   8  Contraportada de contacto.
 *
 * Cómo funciona:
 *   1. Lee categorías y contacto de src/data/site.ts, los productos de
 *      src/content/products/*.md y la selección.
 *   2. Prepara las fotos: recorta el margen blanco sobrante para que la pieza
 *      llene el marco, las reduce a lo que se imprime (sin ampliar nunca) y las
 *      guarda en JPEG. Chrome las incrusta tal cual, sin recomprimir.
 *   3. Arma un HTML con medidas fijas en milímetros y lo imprime con Chrome sin
 *      interfaz: texto vectorial, fuentes incrustadas, enlaces activos (cada
 *      producto lleva a su ficha en la web) y marcadores por línea.
 *
 * Identidad: Manual de Marca DAFERCOL v1.0 (assets/marca/) con los ajustes del
 * sitio. Azul DAFERCOL para títulos, azul noche para portada, bandas y
 * contraportada, y acero (plateado) en los detalles. El rojo no se usa. Archivo
 * 900 expandida (118 %) en titulares y Barlow en lo demás (public/fonts/). Logo
 * oficial negativo sobre azul noche (public/marca/), nunca por debajo de 35 mm.
 *
 * Requiere Google Chrome. Si no está en la ruta habitual, indica la ruta con
 * CHROME_PATH=/ruta/al/chrome npm run catalogo
 */
import { readFile, writeFile, mkdir, readdir, stat, rm, copyFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { transform } from 'esbuild';
import sharp from 'sharp';
import YAML from 'yaml';
import { paginas } from './seleccion.mjs';

const run = promisify(execFile);
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const WORK = path.join(ROOT, 'node_modules/.cache/dafercol-catalogo');
const IMGS = path.join(WORK, 'img');
const OUT_PDF = path.join(ROOT, 'public/catalogo/catalogo-dafercol.pdf');
const FONTS = path.join(ROOT, 'public/fonts');
const LOGOS = path.join(ROOT, 'public/marca');
const FILM = path.join(ROOT, 'src/assets/film');
const OUT_COVER = path.join(ROOT, 'public/catalogo/portada.webp');
const PX_DESTACADO = 900; // 68 mm impresos ≈ 330 ppp (si el original da para tanto)
const PX_TARJETA = 560; // 44 mm impresos ≈ 320 ppp
const COVER_FOTO = 0; // cuadro del film para la portada

// ---------------------------------------------------------------- datos ----
async function loadSite() {
  const src = await readFile(path.join(ROOT, 'src/data/site.ts'), 'utf8');
  // Misma URL pública que el sitio (SITE_URL del entorno o de .env; ver astro.config.mjs):
  // de ella salen los enlaces de cada producto y la web de la contraportada.
  try {
    process.loadEnvFile(path.join(ROOT, '.env'));
  } catch {}
  const env = { PROD: false, ...(process.env.SITE_URL ? { SITE: process.env.SITE_URL } : {}) };
  const { code } = await transform(src, {
    loader: 'ts',
    format: 'esm',
    define: { 'import.meta.env': JSON.stringify(env) },
  });
  const tmp = path.join(WORK, 'site.mjs');
  await writeFile(tmp, code);
  return import(`${pathToFileURL(tmp).href}?t=${Date.now()}`);
}

async function loadProducts() {
  const dir = path.join(ROOT, 'src/content/products');
  const files = (await readdir(dir)).filter((f) => f.endsWith('.md'));
  const out = new Map();
  for (const f of files) {
    const raw = await readFile(path.join(dir, f), 'utf8');
    const m = raw.match(/^---\n([\s\S]*?)\n---/);
    if (!m) continue;
    const d = YAML.parse(m[1]);
    const id = f.replace(/\.md$/, '');
    out.set(id, { id, ...d, specs: d.specs ?? [], imageFit: d.imageFit ?? 'cover' });
  }
  return out;
}

// ------------------------------------------------------------ imágenes ----
/**
 * Foto de producto lista para imprimir a `px` de lado mayor. Las fotos sobre
 * fondo blanco se recortan al borde de la pieza (muchas traen un margen enorme
 * y la pieza se veía diminuta). Nunca se amplía: una foto pequeña se queda en
 * su tamaño real.
 */
async function foto(p, px) {
  if (!p.image) return null;
  const src = path.join(ROOT, 'public', p.image);
  if (!existsSync(src)) return null;
  const s = await stat(src);
  const name = `${p.id}-${px}-${Math.round(s.mtimeMs)}-v2.jpg`;
  const dst = path.join(IMGS, name);
  if (!existsSync(dst)) {
    let buf = await sharp(src).flatten({ background: '#ffffff' }).toBuffer();
    if (p.imageFit === 'contain') {
      // Muchas fotos traen el fondo en un blanco sucio (245–252): se lleva a blanco puro
      // para que no se vea un recuadro dentro del marco, y así el recorte encuentra el borde.
      buf = await sharp(buf).linear(1.06, 0).toBuffer();
      try {
        buf = await sharp(buf).trim({ background: '#ffffff', threshold: 14 }).toBuffer();
      } catch {} // imagen uniforme: se deja como está
    }
    await sharp(buf)
      .resize(px, px, { fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 84, mozjpeg: true, chromaSubsampling: '4:4:4' })
      .toFile(dst);
  }
  return `img/${name}`;
}

// ------------------------------------------------------------- utilidades ----
const esc = (s = '') =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const pad2 = (n) => String(n).padStart(2, '0');

/** Hasta `max` datos técnicos cortos y útiles, en orden de prioridad. */
function keySpecs(p, max) {
  const prio = [/presi[oó]n/i, /tama|medida/i, /material/i, /conexi|extremos/i, /temperatura/i, /aplicaci|servicio/i, /rango|escala|voltaje/i, /sellos/i];
  const pool = p.specs.filter((s) => !/^(referencias|c[oó]digo)/i.test(s.label) && String(s.value).length <= 64);
  const picked = [];
  for (const re of prio) {
    const s = pool.find((x) => re.test(x.label) && !picked.includes(x));
    if (s) picked.push(s);
    if (picked.length === max) return picked;
  }
  for (const s of pool) {
    if (!picked.includes(s)) picked.push(s);
    if (picked.length === max) break;
  }
  return picked;
}

// ---------------------------------------------------------------- HTML ----
/**
 * Logo horizontal oficial (archivo del manual, sin redibujar). `ancho` en mm:
 * el manual pide al menos 35 mm impresos. Proporción del recorte: 4,309.
 */
const LOGO_RATIO = 4.309;
const LOGO = (ancho, negativo = false) =>
  `<img class="logo" src="logo-${negativo ? 'negativo' : 'color'}.png" alt="DAFERCOL" style="width:${ancho}mm;height:${(ancho / LOGO_RATIO).toFixed(2)}mm">`;
/** Corte diagonal del manual (tarjeta de presentación, pág. 11). SVG: en degradado se rasteriza escalonado. */
const CORTE = (fill = '#163b6e') => `<svg class="corte" viewBox="0 0 64 40" preserveAspectRatio="none" aria-hidden="true">
  <polygon points="64,0 64,40 0,40" fill="${fill}"/>
  <line x1="0" y1="40" x2="64" y2="0" stroke="#d3d9e0" stroke-opacity=".7" stroke-width=".35"/></svg>`;

function css() {
  const barlow = (w) =>
    `@font-face{font-family:Barlow;font-weight:${w};font-style:normal;src:url("fonts/barlow-${w}.woff2") format("woff2")}`;
  return `
@font-face{font-family:Archivo;font-weight:900;font-stretch:118%;font-style:normal;src:url("fonts/archivo-900-118.woff2") format("woff2")}
${[400, 500, 600, 700].map(barlow).join('\n')}
@page { size: A4; margin: 0 }
:root{
  /* Manual de marca DAFERCOL, pág. 7 */
  --azul:#163b6e; --noche:#0e2548;
  --acero-claro:#d3d9e0; --acero-medio:#9aa6b2; --acero-oscuro:#5f6e7e; --gris:#6b7a8b; --acero-neg:#a9b4c0;
  --azul-1:#e4eaf4; --azul-05:#f2f5fa;
  --ink:#1f2a37; --ink-2:#4c5a6a; --ink-3:#6b7a8b; --line:#e2e7ec; --surface:#f5f7f9;
}
*{box-sizing:border-box;margin:0;padding:0}
html{-webkit-print-color-adjust:exact;print-color-adjust:exact}
body{font-family:Barlow,system-ui,sans-serif;color:var(--ink);font-size:8.2pt;line-height:1.35;
  font-kerning:normal;-webkit-font-smoothing:antialiased;background:#8a94a3}
a{color:inherit;text-decoration:none}
.logo{display:block}
.page{position:relative;width:210mm;height:297mm;overflow:hidden;background:#fff;break-after:page;page-break-after:always}
.page:last-child{break-after:auto;page-break-after:auto}
@media screen{ .page{margin:0 auto 6mm;box-shadow:0 2px 12px rgba(0,0,0,.25)} }
.corte{position:absolute;right:0;bottom:0;width:64mm;height:40mm;display:block}
.clamp{display:-webkit-box;-webkit-box-orient:vertical;overflow:hidden}

/* ---- pie corrido ---- */
.run-foot{position:absolute;left:14mm;right:14mm;bottom:6.5mm;height:6mm;display:flex;align-items:center;justify-content:space-between;
  font-size:6.6pt;color:var(--ink-3)}
.run-foot a{color:var(--azul);font-weight:700}
.run-foot .pg{font-weight:700;color:var(--azul);font-variant-numeric:tabular-nums;letter-spacing:.04em}
.run-foot .pg span{color:var(--ink-3);font-weight:500}

/* ---- banda de línea: foto del recorrido bajo un velo azul noche ---- */
.band{position:absolute;left:0;right:0;top:0;height:67mm;background:var(--noche);color:#fff;overflow:hidden}
.band .ph{position:absolute;inset:0 0 0 30%;background-size:cover}
.band .ph::after{content:"";position:absolute;inset:0;
  background:linear-gradient(90deg,#0e2548 0%,rgba(14,37,72,.82) 30%,rgba(14,37,72,.34) 100%),linear-gradient(0deg,rgba(14,37,72,.55),rgba(14,37,72,0) 60%)}
.band .corte{width:27mm;height:17mm}
.band .logo{position:absolute;left:14mm;top:10mm}
.band .in{position:absolute;left:14mm;right:36mm;bottom:9mm}
.eyebrow{display:flex;align-items:center;gap:3mm;font-size:6.8pt;font-weight:600;letter-spacing:.2em;text-transform:uppercase;color:var(--acero-claro)}
.eyebrow::before{content:"";flex:none;width:9mm;height:.9mm;background:var(--acero-claro)}
.band h2{margin-top:2.6mm;font-family:Archivo,Barlow,sans-serif;font-weight:900;font-stretch:118%;font-size:25pt;line-height:1.04;letter-spacing:-.008em}
.band p{margin-top:2.6mm;font-size:9.4pt;line-height:1.4;color:var(--acero-claro);max-width:150mm}
.band .all{display:inline-flex;align-items:center;gap:1.6mm;margin-top:3.4mm;padding:1.7mm 3.6mm;border-radius:1mm;border:.3mm solid rgba(211,217,224,.55);
  font-size:7.2pt;font-weight:700;letter-spacing:.02em;color:#fff}
/* banda corta (media página) */
.band.sm{height:44mm}
.band.sm .logo{left:auto;right:14mm;top:8mm}
.band.sm .in{bottom:6.5mm;right:70mm}
.band.sm h2{font-size:19pt;margin-top:2mm}
.band.sm p{margin-top:1.8mm;font-size:8.4pt;max-width:120mm}
.band.sm .all{position:absolute;right:-56mm;bottom:0;margin:0}

/* ---- marco de foto: blanco para recortes, a sangre para fotos de ambiente ---- */
.img{display:flex;align-items:center;justify-content:center;background:#fff;overflow:hidden}
.img img{display:block;max-width:100%;max-height:100%;object-fit:contain}
.img.cover img{width:100%;height:100%;max-width:none;max-height:none;object-fit:cover}
.img.empty{background:var(--surface)}

/* ---- producto destacado ---- */
.feat{position:absolute;left:14mm;right:14mm;top:73mm;height:75mm;display:grid;grid-template-columns:80mm minmax(0,1fr);
  border:.25mm solid var(--line);border-radius:2mm;overflow:hidden;background:#fff}
.feat .img{padding:6mm}
.feat .img.cover{padding:0}
.feat .txt{position:relative;display:flex;flex-direction:column;min-width:0;padding:6.4mm 7mm 6mm;background:var(--azul-05);border-left:.25mm solid var(--line)}
.feat .txt::before{content:"";position:absolute;left:7mm;top:0;width:14mm;height:1mm;background:var(--azul)}
.feat .tag{display:flex;align-items:center;gap:2.4mm;font-size:5.8pt;font-weight:700;letter-spacing:.2em;text-transform:uppercase;color:var(--ink-3)}
.feat .tag b{padding:.9mm 2.2mm;border-radius:.7mm;background:var(--noche);color:#fff;font-weight:700}
.feat .ttl{margin-top:2.8mm;font-size:14.5pt;font-weight:700;line-height:1.12;color:var(--azul);-webkit-line-clamp:2}
.feat .sum{margin-top:2mm;font-size:8.4pt;line-height:1.42;color:var(--ink-2);-webkit-line-clamp:3}
.feat .sum.solo{font-size:9.4pt;line-height:1.5;-webkit-line-clamp:6}
.feat dl{margin-top:3mm;font-size:7.2pt;line-height:1.3}
.feat dl div{display:grid;grid-template-columns:30mm minmax(0,1fr);column-gap:2mm;padding:1.25mm 0;border-top:.2mm solid #d7dee8}
.feat dt{color:var(--ink-3);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.feat dd{color:var(--ink);font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.feat .cta{margin-top:auto;display:flex;align-items:center;gap:3.4mm}
.feat .btn{padding:2.5mm 4.8mm;border-radius:1.2mm;background:var(--azul);color:#fff;font-size:8.2pt;font-weight:700}
.feat .cta .note{font-size:6.6pt;color:var(--ink-3)}

/* ---- tarjetas ---- */
.grid{position:absolute;left:14mm;right:14mm;top:154mm;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:4.5mm 4mm}
.card{display:flex;flex-direction:column;height:61.5mm;border:.25mm solid var(--line);border-radius:1.6mm;overflow:hidden;background:#fff}
.card .img{flex:none;height:34mm;padding:3mm;border-bottom:.2mm solid var(--line)}
.card .img.cover{padding:0}
.card .txt{display:flex;flex-direction:column;flex:1;min-height:0;padding:2.8mm 3.4mm 2.8mm}
.card .lab{font-size:5.2pt;font-weight:600;letter-spacing:.18em;text-transform:uppercase;color:var(--ink-3);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.card .ttl{margin-top:.9mm;font-size:8.6pt;font-weight:700;line-height:1.16;color:var(--azul);-webkit-line-clamp:2}
.card .sum{margin-top:1.1mm;font-size:6.7pt;line-height:1.32;color:var(--ink-2);-webkit-line-clamp:2}
.card .go{margin-top:auto;font-size:6.6pt;font-weight:700;color:var(--azul);letter-spacing:.02em}

/* ---- media página: banda corta + una fila de tarjetas altas ---- */
.blk{position:absolute;left:0;right:0;height:138mm}
.blk .grid{top:50mm;gap:4mm}
.blk .card{height:84mm}
.blk .card .img{height:44mm;padding:3.4mm}
.blk .card .img.cover{padding:0}
.blk .card .ttl{-webkit-line-clamp:3}
.blk .card .sum{-webkit-line-clamp:3}

/* ---- portada ---- */
.cover{background:var(--noche);color:#fff}
.cover .photo{position:absolute;inset:0 0 auto 0;height:186mm;background-size:cover;background-position:38% 50%}
.cover .photo::after{content:"";position:absolute;inset:0;
  background:linear-gradient(180deg,rgba(14,37,72,.42) 0%,rgba(14,37,72,.30) 38%,rgba(14,37,72,.78) 76%,#0e2548 100%),
             linear-gradient(90deg,rgba(14,37,72,.62) 0%,rgba(14,37,72,0) 72%)}
/* Logo negativo a 64 mm: x (alto de la D) ≈ 4,2 mm; nada entra en ese margen. */
.cover .top{position:absolute;left:16mm;right:16mm;top:16mm;display:flex;align-items:flex-start;justify-content:space-between}
.cover .top .yr{margin-top:2mm;font-size:7pt;font-weight:600;letter-spacing:.2em;text-transform:uppercase;color:var(--acero-claro)}
.cover .title{position:absolute;left:16mm;right:16mm;top:116mm}
.cover .eyebrow{font-size:7.6pt}
.cover h1{margin-top:4mm;font-family:Archivo,Barlow,sans-serif;font-weight:900;font-stretch:118%;font-size:35pt;line-height:1.02;letter-spacing:-.01em}
.cover .slogan{margin-top:5mm;font-size:7.6pt;font-weight:600;letter-spacing:.2em;line-height:1.7;text-transform:uppercase;color:var(--acero-neg);max-width:150mm}
.cover .lead{margin-top:2.6mm;font-size:10.5pt;line-height:1.45;color:var(--acero-claro);max-width:140mm}
.cover .stats{position:absolute;left:16mm;right:16mm;top:196mm;display:grid;grid-template-columns:repeat(3,1fr);gap:4mm}
.cover .stat{border-top:.35mm solid rgba(211,217,224,.22);padding-top:3mm}
.cover .stat b{display:block;font-family:Archivo,Barlow,sans-serif;font-weight:900;font-stretch:118%;font-size:20pt;line-height:1.1}
.cover .stat span{display:block;margin-top:.8mm;font-size:6.2pt;font-weight:600;letter-spacing:.18em;text-transform:uppercase;color:var(--acero-neg)}
.cover .lines{position:absolute;left:16mm;right:16mm;top:224mm;display:grid;grid-template-columns:1fr 1fr;column-gap:8mm;list-style:none}
.cover .lines a{display:flex;align-items:center;gap:3mm;padding:2mm 0;border-bottom:.25mm solid rgba(211,217,224,.12);font-size:8.4pt;font-weight:600}
.cover .lines b{font-size:6.8pt;color:var(--acero-neg);font-weight:700;width:5mm;letter-spacing:.04em}
.cover .lines em{margin-left:auto;font-style:normal;font-size:7pt;font-weight:700;color:#fff;font-variant-numeric:tabular-nums}
.cover .foot{position:absolute;left:16mm;bottom:12mm;font-size:7.4pt;font-weight:600;color:var(--acero-claro)}

/* ---- contraportada ---- */
.back{background:linear-gradient(160deg,var(--noche) 0%,var(--noche) 62%,#12305c 100%);color:#fff}
.back .logo-big{position:absolute;left:16mm;top:16mm}
.back::after{content:"";position:absolute;left:16mm;right:16mm;top:52mm;height:.35mm;background:linear-gradient(90deg,var(--acero-claro) 0 14mm,rgba(211,217,224,.16) 14mm)}
.back .inner{position:absolute;left:16mm;right:16mm;top:74mm;z-index:1}
.back h2{font-family:Archivo,Barlow,sans-serif;font-weight:900;font-stretch:118%;font-size:26pt;line-height:1.08;letter-spacing:-.005em;max-width:170mm;color:var(--acero-neg)}
.back h2 span{color:#fff}
.back p{margin-top:5mm;font-size:10.6pt;color:var(--acero-claro);max-width:132mm;line-height:1.5}
.back .ctas{display:flex;align-items:center;gap:4mm;margin-top:9mm}
.back .cta{display:inline-flex;align-items:center;padding:3.8mm 6.4mm;border-radius:1.6mm;background:#25d366;color:#0e2548;font-weight:700;font-size:10.4pt}
.back .cta.alt{background:none;border:.35mm solid rgba(211,217,224,.6);color:#fff}
.back .steps{margin-top:15mm;display:grid;grid-template-columns:repeat(3,1fr);gap:6mm}
.back .steps div{border-top:.35mm solid rgba(211,217,224,.22);padding-top:3.4mm}
.back .steps b{display:block;font-family:Archivo,Barlow,sans-serif;font-weight:900;font-stretch:118%;font-size:15pt;color:var(--acero-neg);line-height:1}
.back .steps strong{display:block;margin-top:2.2mm;font-size:9.6pt;font-weight:700}
.back .steps span{display:block;margin-top:1mm;font-size:7.8pt;line-height:1.45;color:var(--acero-claro)}
.back .contact{margin-top:14mm;display:grid;grid-template-columns:repeat(3,1fr);gap:6mm}
.back .contact div{border-top:.35mm solid rgba(211,217,224,.22);padding-top:3mm}
.back .contact span{display:block;font-size:6.2pt;letter-spacing:.2em;text-transform:uppercase;color:var(--acero-neg);font-weight:600}
.back .contact a,.back .contact b{display:block;margin-top:1.4mm;font-size:9.6pt;font-weight:600;color:#fff}
.back .legal{position:absolute;left:16mm;right:84mm;bottom:14mm;font-size:6.4pt;color:var(--acero-medio);line-height:1.5}
`;
}

let YEAR = new Date().getFullYear();

function buildHtml({ site, categories, brands, pages, totalProductos }) {
  const siteHost = site.url.replace(/^https?:\/\//, '');
  const total = pages.length + 2;
  const wa = `https://wa.me/${site.whatsapp}?text=${encodeURIComponent('Hola DAFERCOL, vi el catálogo PDF y quiero una cotización.')}`;
  const showContact = !site.__placeholder;
  // Con datos de plantilla, el botón lleva al formulario de contacto en vez de a un chat inexistente.
  const ctaHref = showContact ? wa : `${site.url}/contacto/`;
  const destacados = pages.reduce((n, pg) => n + pg.bloques.reduce((m, b) => m + b.productos.length + (b.destacado ? 1 : 0), 0), 0);
  const urlProducto = (p) => `${site.url}/productos/${p.id}/`; // canónica del sitio (con barra final)
  const urlLinea = (cat) => `${site.url}/productos/${cat.slug}/`;
  const subName = (p) => categories.find((c) => c.slug === p.category)?.subcategories.find((s) => s.slug === p.subcategory)?.name ?? '';
  const nCat = (cat) => totalProductos.filter((p) => p.category === cat.slug).length;

  const img = (p, src) =>
    `<span class="img${src ? '' : ' empty'}${p.imageFit === 'cover' ? ' cover' : ''}">${src ? `<img src="${esc(src)}" alt="">` : ''}</span>`;
  const card = (p) => `<a class="card" href="${esc(urlProducto(p))}">${img(p, p.fotoTarjeta)}
    <span class="txt"><span class="lab">${esc(subName(p))}</span><span class="ttl clamp">${esc(p.title)}</span>
    <span class="sum clamp">${esc(p.summary)}</span><span class="go">Ver ficha →</span></span></a>`;

  const band = (b, sm, first) => {
    const n = nCat(b.cat);
    return `<div class="band${sm ? ' sm' : ''}">
      <div class="ph" style="background-image:url('film-${b.foto}.jpg');background-position:${b.encuadre}"></div>
      ${first ? LOGO(36, true) : ''}
      <div class="in"><div class="eyebrow">Línea ${pad2(b.ci + 1)} · ${n} productos en la web</div>
        <h2${b.anchor ? ` id="cat-${b.cat.slug}"` : ''}>${esc(b.titulo)}</h2><p>${esc(b.texto)}</p>
        <a class="all" href="${esc(urlLinea(b.cat))}">Ver los ${n} productos →</a></div>
      ${CORTE('#ffffff')}</div>`;
  };

  // Portada: índice de las líneas con su página.
  const cover = `<section class="page cover">
    <div class="photo" style="background-image:url('film-${COVER_FOTO}.jpg')"></div>
    <div class="top">${LOGO(64, true)}<div class="yr">Edición ${YEAR}</div></div>
    <div class="title"><div class="eyebrow">Catálogo de productos</div>
      <h1>Soluciones para<br>sistemas de fluidos.</h1>
      <p class="slogan">${esc(site.slogan)}</p>
      <p class="lead">Una selección de nuestras ${categories.length} líneas. Cada producto enlaza a su ficha en ${esc(siteHost)}, con especificaciones y cotización por WhatsApp.</p></div>
    <div class="stats">
      <div class="stat"><b>${destacados}</b><span>productos destacados</span></div>
      <div class="stat"><b>${categories.length}</b><span>líneas de producto</span></div>
      <div class="stat"><b>${totalProductos.length}</b><span>productos en la web</span></div>
    </div>
    <ol class="lines">${categories
      .map((c, i) => {
        const at = pages.findIndex((pg) => pg.bloques.some((b) => b.cat === c));
        return at < 0 ? '' : `<li><a href="#cat-${c.slug}"><b>${pad2(i + 1)}</b>${esc(c.name)}<em>pág. ${pad2(at + 2)}</em></a></li>`;
      })
      .join('')}</ol>
    <div class="foot">${esc(siteHost)}</div>
    ${CORTE()}
  </section>`;

  const foot = (n) => `<footer class="run-foot"><a href="${esc(site.url)}/productos/">${esc(siteHost)}/productos</a>
    <span>Toca un producto para ver su ficha y cotizar por WhatsApp</span><span class="pg">${pad2(n)} <span>/ ${pad2(total)}</span></span></footer>`;

  const body = pages
    .map((pg, i) => {
      if (pg.tipo === 'completa') {
        const b = pg.bloques[0];
        const p = b.destacado;
        const specs = keySpecs(p, 3);
        return `<section class="page">${band(b, false, true)}
          <a class="feat" href="${esc(urlProducto(p))}">${img(p, p.fotoDestacado)}
            <span class="txt"><span class="tag"><b>Destacado</b>${esc(subName(p))}</span>
              <span class="ttl clamp">${esc(p.title)}</span><span class="sum clamp${specs.length ? '' : ' solo'}">${esc(p.summary)}</span>
              ${specs.length ? `<dl>${specs.map((s) => `<div><dt>${esc(s.label)}</dt><dd>${esc(s.value)}</dd></div>`).join('')}</dl>` : ''}
              <span class="cta"><span class="btn">Ver ficha y cotizar →</span><span class="note">Especificaciones y referencias en la web</span></span></span></a>
          <div class="grid">${b.productos.map(card).join('')}</div>${foot(i + 2)}</section>`;
      }
      return `<section class="page">${pg.bloques
        .map(
          (b, k) => `<div class="blk" style="top:${k * 142}mm">${band(b, true, k === 0)}
          <div class="grid" style="grid-template-columns:repeat(${b.productos.length},minmax(0,1fr))">${b.productos.map(card).join('')}</div></div>`,
        )
        .join('')}${foot(i + 2)}</section>`;
    })
    .join('\n');

  // Contraportada
  const contact = [
    ['Web', `<a href="${esc(site.url)}/">${esc(siteHost)}</a>`],
    ['Correo', `<a href="mailto:${esc(site.email)}">${esc(site.email)}</a>`],
    // "a. m." y "p. m." con espacios duros: no se parten al final de la línea.
    showContact ? ['WhatsApp', `<a href="${esc(wa)}">${esc(site.phone)}</a>`] : ['Horario', `<b>${esc(site.hours).replace(/ ([ap])\. m\./g, '\u00a0$1.\u00a0m.')}</b>`],
  ];
  const back = `<section class="page back">
    <div class="logo-big">${LOGO(64, true)}</div>
    <div class="inner">
      <h2>¿No encuentras tu referencia? <span>La conseguimos.</span></h2>
      <p>Este catálogo es una selección. En la web están los ${totalProductos.length} productos de nuestras ${categories.length} líneas, y manejamos muchas más referencias: escríbenos con la medida, el material o una foto y te asesoramos.</p>
      <div class="ctas"><a class="cta" href="${esc(ctaHref)}">Cotizar por WhatsApp →</a><a class="cta alt" href="${esc(site.url)}/productos/">Ver el catálogo completo →</a></div>
      <div class="steps">
        <div><b>01</b><strong>Elige el producto</strong><span>Toca cualquier producto de este catálogo para abrir su ficha en la web.</span></div>
        <div><b>02</b><strong>Revisa la referencia</strong><span>En la ficha están las medidas, los materiales y las referencias disponibles.</span></div>
        <div><b>03</b><strong>Cotiza por WhatsApp</strong><span>El botón de la ficha abre el chat con el producto ya escrito. Solo agrega la cantidad.</span></div>
      </div>
      <div class="contact">${contact.map(([k, v]) => `<div><span>${k}</span>${v}</div>`).join('')}</div>
    </div>
    <p class="legal">Imágenes de referencia. Especificaciones, disponibilidad y precios sujetos a confirmación al cotizar. ${brands
      .map((b) => esc(b.name))
      .join(', ')} y las demás marcas mencionadas pertenecen a sus respectivos dueños. Catálogo generado el ${new Date().toLocaleDateString('es-CO', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })} · ${esc(site.legalName)}.</p>
    ${CORTE()}
  </section>`;

  const preview = `<script>
    // Vista previa: #p=N muestra solo la página N (para capturas de control de calidad).
    const m = location.hash.match(/p=(\\d+)/);
    if (m) { document.querySelectorAll('.page').forEach((el, i) => { if (i + 1 !== +m[1]) el.remove(); });
      document.body.style.background = '#fff'; document.querySelector('.page').style.margin = '0'; document.querySelector('.page').style.boxShadow = 'none'; }
  </script>`;

  return `<!doctype html><html lang="es"><head><meta charset="utf-8"><title>Catálogo DAFERCOL ${YEAR}</title>
  <meta name="author" content="${esc(site.legalName)}"><meta name="description" content="Catálogo de productos DAFERCOL ${YEAR}: ${esc(site.slogan)}">
  <style>${css()}</style></head><body>${cover}${body}${back}${preview}</body></html>`;
}

// --------------------------------------------------------------- Chrome ----
function chromePath() {
  const c = [
    process.env.CHROME_PATH,
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/Applications/Chromium.app/Contents/MacOS/Chromium',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser',
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
  ].filter(Boolean);
  const hit = c.find((p) => existsSync(p));
  if (!hit) throw new Error('No encontré Google Chrome. Indica la ruta con CHROME_PATH=/ruta/al/chrome npm run catalogo');
  return hit;
}
const chromeBase = ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--allow-file-access-from-files', '--no-first-run', '--no-default-browser-check'];

// ----------------------------------------------------------------- main ----
async function main() {
  const t0 = Date.now();
  await mkdir(IMGS, { recursive: true });
  // Las mismas fuentes del sitio (Archivo 900 expandida y Barlow) y el logo oficial.
  await rm(path.join(WORK, 'fonts'), { recursive: true, force: true });
  await mkdir(path.join(WORK, 'fonts'), { recursive: true });
  for (const f of (await readdir(FONTS)).filter((f) => f.endsWith('.woff2'))) await copyFile(path.join(FONTS, f), path.join(WORK, 'fonts', f));
  // 1200 px para 64 mm de ancho ≈ 475 ppp: nítido impreso sin inflar el PDF.
  for (const v of ['color', 'negativo'])
    await sharp(path.join(LOGOS, `logo-${v}.png`)).resize(1200).png({ compressionLevel: 9 }).toFile(path.join(WORK, `logo-${v}.png`));

  const mod = await loadSite();
  const { site, categories, brands, whatsappIsPlaceholder } = mod;
  site.__placeholder = whatsappIsPlaceholder; // el PDF solo muestra el WhatsApp cuando es real
  const all = await loadProducts();
  const totalProductos = [...all.values()].filter((p) => categories.some((c) => c.slug === p.category));

  // Selección → páginas con sus productos resueltos. Cualquier dato inválido detiene el script.
  const errores = [];
  const usados = new Set();
  const anclas = new Set();
  const pick = (id, cat) => {
    const p = all.get(id);
    if (!p) return errores.push(`No existe el producto "${id}".`), null;
    if (p.category !== cat.slug) errores.push(`"${id}" es de la línea "${p.category}", no de "${cat.slug}".`);
    if (usados.has(id)) errores.push(`"${id}" está repetido.`);
    usados.add(id);
    return p;
  };
  const fotos = new Set([COVER_FOTO]);
  const pages = paginas.map((pg, n) => {
    const bloques = (pg.tipo === 'doble' ? pg.bloques : [pg]).map((b) => {
      const ci = categories.findIndex((c) => c.slug === b.categoria);
      if (ci < 0) throw new Error(`seleccion.mjs: no existe la categoría "${b.categoria}".`);
      const cat = categories[ci];
      const esperados = pg.tipo === 'completa' ? [6] : [3, 4];
      if (!esperados.includes(b.productos.length))
        errores.push(`Página ${n + 2} (${cat.slug}): lleva ${b.productos.length} productos y admite ${esperados.join(' o ')}.`);
      if (pg.tipo === 'completa' && !b.destacado) errores.push(`Página ${n + 2} (${cat.slug}): falta el producto destacado.`);
      fotos.add(b.foto);
      const anchor = !anclas.has(cat.slug);
      anclas.add(cat.slug);
      return {
        cat,
        ci,
        anchor,
        titulo: b.titulo ?? cat.name,
        texto: b.texto ?? cat.description,
        foto: b.foto,
        encuadre: b.encuadre ?? '50% 50%',
        destacado: b.destacado ? pick(b.destacado, cat) : null,
        productos: b.productos.map((id) => pick(id, cat)),
      };
    });
    return { tipo: pg.tipo, bloques };
  });
  for (const c of categories) if (!anclas.has(c.slug)) errores.push(`La línea "${c.slug}" no aparece en el catálogo.`);
  if (errores.length) throw new Error(`seleccion.mjs:\n  - ${errores.join('\n  - ')}`);

  // Fotos de producto (a su tamaño de impresión) y de ambiente (cuadros del film).
  for (const pg of pages)
    for (const b of pg.bloques) {
      if (b.destacado) b.destacado.fotoDestacado = await foto(b.destacado, PX_DESTACADO);
      for (const p of b.productos) p.fotoTarjeta = await foto(p, PX_TARJETA);
    }
  for (const n of fotos)
    await sharp(path.join(FILM, `stop-${n}@2x.webp`)).resize(1800).jpeg({ quality: 74, mozjpeg: true }).toFile(path.join(WORK, `film-${n}.jpg`));

  const html = buildHtml({ site, categories, brands, pages, totalProductos });
  const htmlPath = path.join(WORK, 'catalogo.html');
  await writeFile(htmlPath, html);
  const url = pathToFileURL(htmlPath).href;
  const chrome = chromePath();

  // PDF
  const tmpPdf = path.join(WORK, 'catalogo.pdf');
  await run(chrome, [...chromeBase, '--no-pdf-header-footer', '--generate-pdf-document-outline', '--run-all-compositor-stages-before-draw', '--virtual-time-budget=30000', `--print-to-pdf=${tmpPdf}`, url], {
    maxBuffer: 1 << 26,
  });
  await mkdir(path.dirname(OUT_PDF), { recursive: true });
  await copyFile(tmpPdf, OUT_PDF);

  // Portada para la página /catalogo (A4 a 2x → 1240 px de ancho en WebP)
  const shot = path.join(WORK, 'portada.png');
  await run(chrome, [...chromeBase, '--window-size=794,1123', '--force-device-scale-factor=2', '--virtual-time-budget=10000', `--screenshot=${shot}`, `${url}#p=1`]);
  await sharp(shot).resize(1240, 1754, { fit: 'cover', position: 'top' }).webp({ quality: 80 }).toFile(OUT_COVER);

  const pdfSize = (await stat(OUT_PDF)).size;
  console.log(`\nListo en ${((Date.now() - t0) / 1000).toFixed(1)} s`);
  console.log(`  ${path.relative(ROOT, OUT_PDF)}  ${(pdfSize / 1048576).toFixed(2)} MB, ${pages.length + 2} páginas, ${usados.size} productos`);
  console.log(`  ${path.relative(ROOT, OUT_COVER)}`);
  console.log(`  HTML de control: ${htmlPath}  (abre con #p=N para ver una página)`);
  if (whatsappIsPlaceholder) {
    console.warn('\n⚠ El WhatsApp de site.ts sigue siendo de plantilla: el PDF muestra web, correo y horario.');
    console.warn('  Cuando estén los datos reales, vuelve a correr npm run catalogo.');
  }
}

main().catch((e) => {
  console.error(e.message ?? e);
  process.exit(1);
});
