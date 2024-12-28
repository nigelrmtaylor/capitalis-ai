import sharp from 'sharp';
import { promises as fs } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Define all required sizes for both PWA and Apple devices
const sizes = {
  // Standard PWA sizes
  pwa: [72, 96, 128, 144, 152, 192, 384, 512],
  // Apple specific sizes
  apple: [
    { size: 180, name: 'apple-touch-icon.png' },  // Default Apple touch icon
    { size: 152, name: 'apple-touch-icon-152x152.png' },  // iPad
    { size: 167, name: 'apple-touch-icon-167x167.png' },  // iPad Pro
    { size: 180, name: 'apple-touch-icon-180x180.png' },  // iPhone
    { size: 120, name: 'apple-touch-icon-120x120.png' },  // iPhone
    // Splash screens
    { size: 2048, name: 'apple-splash-2048x2732.png' },  // 12.9" iPad Pro
    { size: 1668, name: 'apple-splash-1668x2224.png' },  // 10.5" iPad Pro
    { size: 1536, name: 'apple-splash-1536x2048.png' },  // iPad Mini/Air
    { size: 1125, name: 'apple-splash-1125x2436.png' },  // iPhone X
    { size: 1242, name: 'apple-splash-1242x2208.png' },  // iPhone 6+/7+/8+
    { size: 750, name: 'apple-splash-750x1334.png' },    // iPhone 6/7/8
  ]
};

async function generateIcons() {
  const inputSvg = join(__dirname, '../public/icon-source.svg');
  const outputDir = join(__dirname, '../public/icons');

  // Ensure the output directory exists
  await fs.mkdir(outputDir, { recursive: true });

  // Generate standard PWA icons
  for (const size of sizes.pwa) {
    await sharp(inputSvg)
      .resize(size, size)
      .png()
      .toFile(join(outputDir, `icon-${size}x${size}.png`));
    console.log(`Generated PWA icon: ${size}x${size}`);
  }

  // Generate Apple specific icons
  for (const { size, name } of sizes.apple) {
    await sharp(inputSvg)
      .resize(size, size)
      .png()
      .toFile(join(outputDir, name));
    console.log(`Generated Apple icon: ${name}`);
  }

  // Copy the original SVG to the icons directory
  await fs.copyFile(
    inputSvg,
    join(outputDir, 'icon.svg')
  );
  console.log('Copied original SVG to icons directory');
}

generateIcons().catch(console.error);
