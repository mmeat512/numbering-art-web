import sharp from 'sharp'
import { promises as fs } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const sizes = [72, 96, 128, 144, 152, 192, 384, 512]

const svgPath = path.join(__dirname, '../public/icons/icon.svg')
const outputDir = path.join(__dirname, '../public/icons')

async function generateIcons() {
  try {
    const svgBuffer = await fs.readFile(svgPath)

    for (const size of sizes) {
      const outputPath = path.join(outputDir, `icon-${size}x${size}.png`)

      await sharp(svgBuffer)
        .resize(size, size)
        .png()
        .toFile(outputPath)

      console.log(`Generated: icon-${size}x${size}.png`)
    }

    // Generate favicon
    const faviconPath = path.join(__dirname, '../public/favicon.ico')
    await sharp(svgBuffer)
      .resize(32, 32)
      .toFormat('png')
      .toFile(faviconPath.replace('.ico', '.png'))

    console.log('Generated: favicon.png')

    // Generate apple-touch-icon
    const appleTouchPath = path.join(outputDir, 'apple-touch-icon.png')
    await sharp(svgBuffer)
      .resize(180, 180)
      .png()
      .toFile(appleTouchPath)

    console.log('Generated: apple-touch-icon.png')

    console.log('\nAll icons generated successfully!')
  } catch (error) {
    console.error('Error generating icons:', error)
    process.exit(1)
  }
}

generateIcons()
