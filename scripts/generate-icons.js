/**
 * Generate PWA icons from SVG template.
 * Run: node scripts/generate-icons.js
 * Requires: sharp (npm install -D sharp)
 */
const fs = require('fs')
const path = require('path')

async function generate() {
  let sharp
  try {
    sharp = require('sharp')
  } catch {
    console.log('sharp not installed, generating SVG placeholders instead')
    generateSvgPlaceholders()
    return
  }

  const sizes = [72, 96, 128, 144, 152, 192, 384, 512]
  const outDir = path.join(__dirname, '..', 'public', 'icons')

  const svg = buildSvg(512)

  for (const size of sizes) {
    await sharp(Buffer.from(svg))
      .resize(size, size)
      .png()
      .toFile(path.join(outDir, `icon-${size}.png`))
    console.log(`✓ icon-${size}.png`)
  }

  // Apple touch icon
  await sharp(Buffer.from(svg))
    .resize(180, 180)
    .png()
    .toFile(path.join(outDir, '..', 'apple-touch-icon.png'))
  console.log('✓ apple-touch-icon.png')

  // Favicon
  await sharp(Buffer.from(svg))
    .resize(32, 32)
    .png()
    .toFile(path.join(outDir, '..', 'favicon.png'))
  console.log('✓ favicon.png')
}

function buildSvg(size) {
  const r = size * 0.18 // corner radius
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" rx="${r}" fill="#162459"/>
  <text x="50%" y="58%" text-anchor="middle" dominant-baseline="central"
    font-family="system-ui, -apple-system, sans-serif" font-weight="900"
    font-size="${size * 0.45}" fill="#FFFFFF" letter-spacing="-0.02em">V</text>
  <circle cx="${size * 0.72}" cy="${size * 0.28}" r="${size * 0.08}" fill="#4caf50"/>
</svg>`
}

function generateSvgPlaceholders() {
  const outDir = path.join(__dirname, '..', 'public', 'icons')
  const sizes = [72, 96, 128, 144, 152, 192, 384, 512]

  for (const size of sizes) {
    fs.writeFileSync(path.join(outDir, `icon-${size}.svg`), buildSvg(size))
    console.log(`✓ icon-${size}.svg (placeholder)`)
  }
  console.log('\nInstall sharp for PNG generation: npm install -D sharp && node scripts/generate-icons.js')
}

generate().catch(console.error)
