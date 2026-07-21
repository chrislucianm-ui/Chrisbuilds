const fs = require('fs');
const { PNG } = require('pngjs');

const inputPath = 'C:\\Users\\Lenovo\\.gemini\\antigravity\\brain\\26eaec93-2b50-4f82-bf70-1b016d745011\\hero_mascot_transparent_1784625739711.png';
const outputPath = 'C:\\Users\\Lenovo\\.gemini\\antigravity\\scratch\\chrisbuilds-portfolio\\public\\hero-character.png';

const buffer = fs.readFileSync(inputPath);
const png = PNG.sync.read(buffer);

for (let y = 0; y < png.height; y++) {
  for (let x = 0; x < png.width; x++) {
    const idx = (png.width * y + x) << 2;
    const r = png.data[idx];
    const g = png.data[idx + 1];
    const b = png.data[idx + 2];

    // Detect dark background pixels
    if (r < 22 && g < 22 && b < 22) {
      const brightness = (r + g + b) / 3;
      if (brightness < 12) {
        png.data[idx + 3] = 0; // 100% Transparent alpha
      } else {
        const alpha = Math.min(255, Math.max(0, Math.floor(((brightness - 12) / 10) * 255)));
        png.data[idx + 3] = alpha;
      }
    }
  }
}

const options = { colorType: 6 };
const bufferOut = PNG.sync.write(png, options);
fs.writeFileSync(outputPath, bufferOut);
console.log('Transparent PNG generated successfully!');
