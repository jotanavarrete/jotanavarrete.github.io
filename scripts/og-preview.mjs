// Genera dist/_og-preview.html: escanea las páginas del build, extrae los
// meta OG/Twitter reales y renderiza tarjetas tipo WhatsApp / LinkedIn / X.
// Permite revisar los previews sociales localmente, sin deploy.
//
// Uso:
//   npm run build && node scripts/og-preview.mjs && npm run preview
//   -> abrir http://localhost:4321/_og-preview.html
import { readFile, writeFile, readdir } from 'node:fs/promises';
import { join, relative } from 'node:path';

const DIST = 'dist';

async function walk(dir) {
  const out = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) out.push(...(await walk(p)));
    else if (e.name === 'index.html') out.push(p);
  }
  return out;
}

const metaOf = (html, key, attr = 'property') => {
  const re = new RegExp(`<meta ${attr}="${key}" content="([^"]*)"`, 'i');
  const m = html.match(re);
  return m ? m[1].replace(/&amp;/g, '&').replace(/&#39;/g, "'").replace(/&quot;/g, '"') : '';
};

// og:image apunta al dominio de producción; para el preview local lo servimos
// como ruta relativa al build (el asset existe en dist/).
const localImg = (url) => {
  try {
    return new URL(url).pathname;
  } catch {
    return url;
  }
};

const files = (await walk(DIST)).sort();
const cards = [];
for (const f of files) {
  const html = await readFile(f, 'utf8');
  const title = metaOf(html, 'og:title');
  if (!title) continue;
  cards.push({
    path: '/' + relative(DIST, f).replace(/index\.html$/, ''),
    title,
    desc: metaOf(html, 'og:description'),
    url: metaOf(html, 'og:url'),
    type: metaOf(html, 'og:type') || 'website',
    img: localImg(metaOf(html, 'og:image')),
  });
}

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
const host = (u) => {
  try {
    return new URL(u).host;
  } catch {
    return u;
  }
};

const card = (c) => `
  <article class="page">
    <div class="page-head"><code>${esc(c.path)}</code><span class="badge">${esc(c.type)}</span></div>
    <div class="cards">
      <!-- WhatsApp -->
      <div class="mock wa">
        <div class="wa-bubble">
          <div class="wa-prev">
            <img src="${esc(c.img)}" alt="">
            <div class="wa-txt">
              <div class="wa-title">${esc(c.title)}</div>
              <div class="wa-desc">${esc(c.desc)}</div>
              <div class="wa-host">${esc(host(c.url))}</div>
            </div>
          </div>
          <div class="wa-link">${esc(c.url)}</div>
        </div>
        <span class="lbl">WhatsApp</span>
      </div>
      <!-- LinkedIn -->
      <div class="mock li">
        <div class="li-card">
          <img src="${esc(c.img)}" alt="">
          <div class="li-txt">
            <div class="li-title">${esc(c.title)}</div>
            <div class="li-host">${esc(host(c.url))}</div>
          </div>
        </div>
        <span class="lbl">LinkedIn</span>
      </div>
      <!-- X / Twitter -->
      <div class="mock tw">
        <div class="tw-card">
          <img src="${esc(c.img)}" alt="">
          <div class="tw-txt">
            <div class="tw-host">${esc(host(c.url))}</div>
            <div class="tw-title">${esc(c.title)}</div>
            <div class="tw-desc">${esc(c.desc)}</div>
          </div>
        </div>
        <span class="lbl">X / Twitter</span>
      </div>
    </div>
  </article>`;

const doc = `<!doctype html><html lang="es"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>OG preview</title>
<style>
  :root{font-family:system-ui,sans-serif;color:#231c15;background:#faf8f4}
  body{margin:0;padding:32px;max-width:1100px;margin-inline:auto}
  h1{font-size:22px} .hint{color:#7a7063;font-size:14px;margin-bottom:28px}
  .page{border-top:1px solid #eae1d4;padding:24px 0}
  .page-head{display:flex;gap:10px;align-items:center;margin-bottom:14px}
  code{background:#f6f1e9;padding:2px 8px;border-radius:6px;font-size:13px}
  .badge{font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#c2410c;font-weight:700}
  .cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:20px}
  .mock{display:flex;flex-direction:column;gap:8px}
  .lbl{font-size:12px;color:#7a7063}
  img{display:block;width:100%;object-fit:cover;background:#eae1d4}
  /* WhatsApp */
  .wa-bubble{background:#d9fdd3;border-radius:8px;padding:4px;max-width:340px}
  .wa-prev{background:#fff;border-radius:6px;overflow:hidden}
  .wa-prev img{aspect-ratio:1200/630}
  .wa-txt{padding:8px 10px}
  .wa-title{font-weight:600;font-size:14px;line-height:1.2}
  .wa-desc{font-size:13px;color:#555;margin-top:2px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
  .wa-host{font-size:12px;color:#8696a0;margin-top:4px}
  .wa-link{color:#027eb5;font-size:13px;padding:4px 8px 6px;word-break:break-all}
  /* LinkedIn */
  .li-card{border:1px solid #e0dfdc;border-radius:2px;overflow:hidden;max-width:360px;background:#fff}
  .li-card img{aspect-ratio:1200/627}
  .li-txt{padding:8px 12px;background:#f3f2ef}
  .li-title{font-weight:600;font-size:14px;line-height:1.3;color:#000}
  .li-host{font-size:12px;color:#666;margin-top:4px}
  /* Twitter */
  .tw-card{border:1px solid #cfd9de;border-radius:16px;overflow:hidden;max-width:360px;background:#fff}
  .tw-card img{aspect-ratio:1200/628}
  .tw-txt{padding:10px 14px}
  .tw-host{font-size:13px;color:#536471}
  .tw-title{font-size:15px;font-weight:400;color:#0f1419;margin-top:1px;line-height:1.3}
  .tw-desc{font-size:14px;color:#536471;margin-top:1px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
</style></head><body>
<h1>Preview de social cards</h1>
<p class="hint">Renderizado desde los meta tags reales de <code>dist/</code>. Imágenes servidas localmente. ${cards.length} páginas.</p>
${cards.map(card).join('')}
</body></html>`;

await writeFile(join(DIST, '_og-preview.html'), doc);
console.log(`wrote ${join(DIST, '_og-preview.html')} (${cards.length} pages)`);
