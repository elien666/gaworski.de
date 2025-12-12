import sharp from 'sharp';
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');
const logoPath = join(rootDir, 'src', 'assets', 'logo.svg');
const publicDir = join(rootDir, 'public');

// Read the SVG
const svgBuffer = readFileSync(logoPath);

// Favicon sizes to generate
const sizes = [
  { size: 16, name: 'favicon-16x16.png' },
  { size: 32, name: 'favicon-32x32.png' },
  { size: 180, name: 'apple-touch-icon.png' },
  { size: 192, name: 'android-chrome-192x192.png' },
  { size: 512, name: 'android-chrome-512x512.png' },
];

// Generate PNG favicons
async function generateFavicons() {
  console.log('Generating favicons from logo.svg...');
  
  for (const { size, name } of sizes) {
    try {
      const buffer = await sharp(svgBuffer)
        .resize(size, size, {
          fit: 'contain',
          background: { r: 255, g: 255, b: 255, alpha: 0 }
        })
        .png()
        .toBuffer();
      
      writeFileSync(join(publicDir, name), buffer);
      console.log(`✓ Generated ${name} (${size}x${size})`);
    } catch (error) {
      console.error(`✗ Failed to generate ${name}:`, error.message);
    }
  }
  
  // Also copy the SVG as favicon.svg
  writeFileSync(join(publicDir, 'favicon.svg'), svgBuffer);
  console.log('✓ Generated favicon.svg');
  
  // Generate ICO file (16x16 and 32x32 combined)
  try {
    const ico16 = await sharp(svgBuffer)
      .resize(16, 16, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 0 }
      })
      .png()
      .toBuffer();
    
    const ico32 = await sharp(svgBuffer)
      .resize(32, 32, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 0 }
      })
      .png()
      .toBuffer();
    
    // For ICO, we'll just use the 32x32 PNG as favicon.ico
    // Most modern browsers accept PNG as ICO
    writeFileSync(join(publicDir, 'favicon.ico'), ico32);
    console.log('✓ Generated favicon.ico');
  } catch (error) {
    console.error('✗ Failed to generate favicon.ico:', error.message);
  }
  
  console.log('\n✅ All favicons generated successfully!');
}

generateFavicons().catch(console.error);

