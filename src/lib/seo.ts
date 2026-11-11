/**
 * Reglas de SEO compartidas por las fichas de producto y las páginas de categoría.
 *
 * - Fabricante real: Valveco es un distribuidor; el fabricante (Danfoss, ASCO,
 *   Winters…) viene al inicio del título. Ese es el que va en los datos
 *   estructurados (`brand`) y en el título para buscadores.
 * - Título para buscadores: hasta ~60 caracteres (Google corta lo demás), con el
 *   tipo de producto primero y el fabricante después.
 * - Meta descripción: entre ~110 y 155 caracteres, armada con el resumen, los
 *   datos clave y el llamado a cotizar, siempre cortada en una frase completa.
 *
 * El título visible de la ficha (h1) no cambia: estas reglas solo afectan a
 * <title>, la meta descripción y los datos estructurados.
 */
import type { CollectionEntry } from 'astro:content';
import { site, categoryBySlug, subcategoryBySlug } from '../data/site';

type Product = CollectionEntry<'products'>;

/** Prefijo del título → nombre del fabricante como lo escribe la propia marca. */
const MAKERS: [RegExp, string][] = [
  [/^ABAC\b/i, 'ABAC'],
  [/^ALLFLOWS\b/i, 'Allflows'],
  [/^ASCO\b/i, 'ASCO'],
  [/^BRAY\b/i, 'Bray'],
  [/^DANFOSS\b/i, 'Danfoss'],
  [/^FESTO\b/i, 'Festo'],
  [/^GENEBRE\b/i, 'Genebre'],
  [/^HELMAN\b/i, 'Helman'],
  [/^I FLOW\b/i, 'I-Flow'],
  [/^KEROTEST\b/i, 'Kerotest'],
  [/^MIPEL\b/i, 'Mipel'],
  [/^MONVA\b/i, 'Monva'],
  [/^NWM METER\b/i, 'NWM Meter'],
  [/^RED WHITE\b/i, 'Red-White'],
  [/^THERMOVAL\b/i, 'Thermoval'],
  [/^TUBINOX\b/i, 'Tubinox'],
  [/^UNI ?D\b/i, 'UNiD'],
  [/^VALBIA\b/i, 'Valbia'],
  [/^VELAN\b/i, 'Velan'],
  [/^WATSON\b/i, 'Watson'],
  [/^WINTERS\b/i, 'Winters'],
];

/** Fabricantes que aparecen dentro del título y no al inicio. */
const MAKERS_INSIDE: [RegExp, string][] = [
  [/\bThermoval\b/i, 'Thermoval'],
  [/\bUNI D\b/i, 'UNiD'],
];

/** Fabricante real del producto, o '' si no se conoce. */
export function manufacturer(p: Product): string {
  if (p.data.brand === 'comfit') return 'Comfit';
  const t = p.data.title;
  for (const [re, name] of MAKERS) if (re.test(t)) return name;
  for (const [re, name] of MAKERS_INSIDE) if (re.test(t)) return name;
  return '';
}

/**
 * Título sin el prefijo del fabricante en mayúsculas: "DANFOSS, Válvula
 * solenoide EV220B" → { name: "Válvula solenoide EV220B", maker: "Danfoss" }.
 */
function splitTitle(p: Product): { name: string; maker: string } {
  const maker = manufacturer(p);
  let name = p.data.title.replace(/\s*\|\s*/g, ' – ').replace(/\s+/g, ' ').trim();
  for (const [re] of MAKERS) {
    if (re.test(name)) {
      name = name.replace(re, '').replace(/^[\s,/–-]+/, '').replace(/^BLCH\s+/i, '');
      break;
    }
  }
  // Fabricante al final del nombre ("… DANFOSS"): ya va aparte.
  if (maker) name = name.replace(new RegExp(`[\\s,–-]+${maker.replace(/[-/]/g, '.')}$`, 'i'), '');
  name = name.charAt(0).toUpperCase() + name.slice(1);
  return { name, maker };
}

/** Corta en el último espacio antes de `max` y quita conectores colgando. */
function cutWords(s: string, max: number): string {
  if (s.length <= max) return s;
  let out = s.slice(0, max + 1);
  out = out.slice(0, out.lastIndexOf(' '));
  return out.replace(/[\s,;:–(-]+(de|del|la|las|el|los|y|o|para|con|en|a|x)?$/i, '').replace(/[\s,;:–(-]+$/, '');
}

const MAX_TITLE = 60;
const SUFFIX = ` | ${site.name}`;

/**
 * Título completo para <title> (se usa tal cual, sin sufijo automático).
 * Prioriza: tipo de producto, fabricante, nombre de la empresa.
 */
export function productSeoTitle(p: Product): string {
  const { name, maker } = splitTitle(p);
  const sub = subcategoryBySlug(p.data.category, p.data.subcategory)?.name ?? '';
  const withMaker = maker && !name.toLowerCase().includes(maker.toLowerCase()) ? `${name} ${maker}` : name;
  const candidates = [
    `${withMaker}${SUFFIX}`,
    `${name}${SUFFIX}`,
    withMaker,
    name,
  ];
  let title = candidates.find((c) => c.length <= MAX_TITLE) ?? cutWords(name, MAX_TITLE);
  // Títulos muy cortos ("Bridas", "Tapones"): se añade el tipo para dar contexto.
  const core = title.replace(SUFFIX, '');
  if (core.length < 26 && sub && !core.toLowerCase().includes(sub.toLowerCase().split(' ')[0])) {
    const longer = `${core} · ${sub}${SUFFIX}`;
    if (longer.length <= MAX_TITLE) title = longer;
  }
  return title;
}

/** Une frases mientras quepan en `max`; nunca corta una frase a la mitad. */
function fitSentences(parts: string[], max: number): string {
  let out = '';
  for (const part of parts) {
    const s = part.trim();
    if (!s) continue;
    const next = out ? `${out} ${s}` : s;
    if (next.length <= max) out = next;
  }
  return out;
}

const sentence = (s: string) => {
  const t = s.replace(/\s+/g, ' ').trim();
  return t && !/[.!?…]$/.test(t) ? `${t}.` : t;
};

const MAX_DESC = 155;
const CLOSE = 'Cotiza por WhatsApp con DAFERCOL.';
const CLOSE_LONG = 'Cotiza por WhatsApp con DAFERCOL, despacho a todo Colombia.';

/** Meta descripción de una ficha: resumen + datos clave + llamado a cotizar. */
export function productSeoDescription(p: Product): string {
  const { summary, specs, category, subcategory } = p.data;
  const sub = subcategoryBySlug(category, subcategory)?.name ?? '';
  const cat = categoryBySlug(category)?.name ?? '';

  // El resumen en frases; si una sola frase ya pasa del máximo, se corta por palabras.
  const sentences = (summary.replace(/\s+/g, ' ').trim().match(/[^.!?]+[.!?]*/g) ?? []).map(sentence);
  if (sentences[0] && sentences[0].length > MAX_DESC - CLOSE.length - 1) {
    sentences[0] = `${cutWords(sentences[0].replace(/[.!?]$/, ''), MAX_DESC - CLOSE.length - 3)}…`;
  }
  const keySpecs = specs
    .filter((s) => !/^(referencias|c[oó]digo)/i.test(s.label) && s.value.length <= 50)
    .slice(0, 2)
    .map((s) => sentence(`${s.label}: ${s.value}`));
  const context = sub && cat ? sentence(`${sub} en ${cat.toLowerCase()}`) : '';

  const body = fitSentences([...sentences, ...keySpecs], MAX_DESC - CLOSE.length - 1);
  let out = fitSentences([body, body.length < 70 ? context : '', CLOSE_LONG], MAX_DESC);
  if (!out.endsWith(CLOSE_LONG)) out = fitSentences([body, body.length < 70 ? context : '', CLOSE], MAX_DESC);
  return out || sentence(cutWords(summary, MAX_DESC - 1));
}

/** Migas de pan en datos estructurados (schema.org BreadcrumbList). */
export function breadcrumbLd(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: new URL(it.url, site.url).toString(),
    })),
  };
}

/** URLs canónicas (con barra final, como las sirve el sitio). */
export const urls = {
  product: (id: string) => `/productos/${id}/`,
  category: (cat: string) => `/productos/${cat}/`,
  sub: (cat: string, sub: string) => `/productos/${cat}/${sub}/`,
};
