import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import path from "node:path"
import { fileURLToPath } from "node:url"

import pngToIco from "png-to-ico"
import sharp from "sharp"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const publicDir = path.join(root, "public")
const iconsDir = path.join(publicDir, "icons")

const BACKGROUND = "#09090b"
const STAR = "#f5f5f5"

// Same star mark as src/components/app-logo.tsx.
const STAR_PATHS = [
  "M72.88 10.09A3.44 3.44 0 0 1 79.14 10.09L90.82 35.65A1.41 1.41 0 0 0 91.52 36.34L117.08 48.03A3.44 3.44 0 0 1 117.08 54.28L91.52 65.97A1.41 1.41 0 0 0 90.82 66.67L79.14 92.23A3.44 3.44 0 0 1 72.88 92.23L61.19 66.67A1.41 1.41 0 0 0 60.5 65.97L34.94 54.28A3.44 3.44 0 0 1 34.94 48.03L60.5 36.34A1.41 1.41 0 0 0 61.19 35.65Z",
  "M31.22 72.84A1.93 1.93 0 0 1 34.73 72.84L41.29 87.19A0.79 0.79 0 0 0 41.68 87.58L56.04 94.14A1.93 1.93 0 0 1 56.04 97.65L41.68 104.22A0.79 0.79 0 0 0 41.29 104.61L34.73 118.96A1.93 1.93 0 0 1 31.22 118.96L24.66 104.61A0.79 0.79 0 0 0 24.27 104.22L9.92 97.65A1.93 1.93 0 0 1 9.92 94.14L24.27 87.58A0.79 0.79 0 0 0 24.66 87.19Z",
]

const TARGETS = [
  { file: "favicon-96x96.png", size: 96, scale: 0.82 },
  { file: "apple-touch-icon.png", size: 180, scale: 0.82 },
  { file: "icons/icon-192.png", size: 192, scale: 0.82 },
  { file: "icons/icon-512.png", size: 512, scale: 0.82 },
  { file: "icons/icon-maskable-192.png", size: 192, scale: 0.7 },
  { file: "icons/icon-maskable-512.png", size: 512, scale: 0.7 },
]

const ICO_SIZES = [16, 32, 48]

function paths() {
  return STAR_PATHS.map((d) => `<path d="${d}"/>`).join("")
}

function iconSvg(size, scale) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" width="${size}" height="${size}"><rect width="128" height="128" fill="${BACKGROUND}"/><g fill="${STAR}" transform="translate(64 64) scale(${scale}) translate(-64 -64)">${paths()}</g></svg>`
}

// `currentColor` lets the browser tab follow the OS theme.
const adaptiveFaviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
  <style>
    :root {
      color: #262626;
    }

    @media (prefers-color-scheme: dark) {
      :root {
        color: #f5f5f5;
      }
    }
  </style>
  <g fill="currentColor">${paths()}</g>
</svg>
`

async function renderPng(size, scale) {
  return sharp(Buffer.from(iconSvg(size, scale)))
    .flatten({ background: BACKGROUND })
    .png({ compressionLevel: 9 })
    .toBuffer()
}

async function main() {
  await mkdir(iconsDir, { recursive: true })
  await writeFile(path.join(publicDir, "favicon.svg"), adaptiveFaviconSvg)

  for (const { file, size, scale } of TARGETS) {
    const output = path.join(publicDir, file)
    await writeFile(output, await renderPng(size, scale))
    await verifyPng(output, size)
    console.log(`wrote ${path.relative(root, output)} (${size}x${size})`)
  }

  const tempDir = await mkdtemp(path.join(tmpdir(), "chat-icons-"))
  try {
    const icoSources = []
    for (const size of ICO_SIZES) {
      const file = path.join(tempDir, `favicon-${size}.png`)
      await writeFile(file, await renderPng(size, 0.82))
      icoSources.push(file)
    }

    const ico = await pngToIco(icoSources)
    const icoPath = path.join(publicDir, "favicon.ico")
    await writeFile(icoPath, ico)
    await verifyIco(icoPath, ICO_SIZES)
    console.log(`wrote ${path.relative(root, icoPath)} (${ICO_SIZES.join("/")})`)
  } finally {
    await rm(tempDir, { recursive: true, force: true })
  }
}

async function verifyPng(file, size) {
  const metadata = await sharp(file).metadata()
  if (metadata.width !== size || metadata.height !== size) {
    throw new Error(`${file} is ${metadata.width}x${metadata.height}, expected ${size}x${size}`)
  }
}

async function verifyIco(file, sizes) {
  const buffer = await readFile(file)
  const count = buffer.readUInt16LE(4)
  const entries = Array.from({ length: count }, (_, index) => {
    const width = buffer.readUInt8(6 + index * 16)
    return width === 0 ? 256 : width
  })

  if (entries.join(",") !== sizes.join(",")) {
    throw new Error(`${file} contains ${entries.join("/")}, expected ${sizes.join("/")}`)
  }
}

await main()
