// Genera public/og-default.png (1200x630) para previews sociales
// (WhatsApp, LinkedIn, Twitter). Estilo editorial, tokens de global.css.
// Uso: node scripts/gen-og.mjs public/og-default.png
import sharp from 'sharp';

const out = process.argv[2] ?? 'public/og-default.png';

const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <rect width="1200" height="630" fill="#faf8f4"/>
  <rect x="0" y="0" width="1200" height="14" fill="#c2410c"/>
  <rect x="0" y="616" width="1200" height="14" fill="#eae1d4"/>

  <!-- kicker -->
  <text x="90" y="180" font-family="Instrument Sans, DejaVu Sans, sans-serif"
        font-size="30" letter-spacing="6" font-weight="600" fill="#c2410c">PORTFOLIO</text>

  <!-- name -->
  <text x="88" y="310" font-family="Newsreader, Georgia, serif"
        font-size="118" font-weight="600" fill="#231c15">Javier Navarrete</text>

  <!-- role -->
  <text x="90" y="380" font-family="Instrument Sans, DejaVu Sans, sans-serif"
        font-size="42" font-weight="500" fill="#7a7063">Data Engineer</text>

  <!-- lead -->
  <text x="90" y="470" font-family="Instrument Sans, DejaVu Sans, sans-serif"
        font-size="30" font-weight="400" fill="#231c15">Pipelines de datos confiables y escalables.</text>
  <text x="90" y="512" font-family="Instrument Sans, DejaVu Sans, sans-serif"
        font-size="30" font-weight="400" fill="#231c15">Del dato crudo a decisiones que el negocio usa.</text>

  <!-- url -->
  <text x="90" y="580" font-family="Instrument Sans, DejaVu Sans, sans-serif"
        font-size="26" font-weight="600" letter-spacing="1" fill="#7a7063">jotanavarrete.github.io</text>

  <!-- accent dot -->
  <circle cx="1090" cy="150" r="60" fill="#f6e6da"/>
  <circle cx="1090" cy="150" r="22" fill="#c2410c"/>
</svg>`;

await sharp(Buffer.from(svg)).png().toFile(out);
console.log('wrote', out);
