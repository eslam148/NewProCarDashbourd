const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

// Check if ImageMagick is installed
exec('magick -version', (error) => {
  if (error) {
    console.error('ImageMagick is required but not found.');
    console.error('Please install ImageMagick: https://imagemagick.org/script/download.php');
    console.error('Or run: npm install -g imagemagick');
    return;
  }

  const svgPath = path.join(__dirname, 'src', 'assets', 'images', 'icons', 'favicon.svg');
  const iconsDir = path.join(__dirname, 'src', 'assets', 'images', 'icons');

  // Ensure the directory exists
  if (!fs.existsSync(iconsDir)) {
    fs.mkdirSync(iconsDir, { recursive: true });
  }

  // Generate different sizes
  const sizes = [16, 32, 48, 64, 72, 96, 120, 128, 144, 152, 180, 192, 384, 512];

  sizes.forEach(size => {
    const outputPath = path.join(iconsDir, `favicon-${size}x${size}.png`);
    const command = `magick convert -background none -size ${size}x${size} ${svgPath} ${outputPath}`;

    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error generating ${size}x${size} icon:`, stderr);
        return;
      }
      console.log(`Generated ${size}x${size} icon`);
    });
  });

  // Create favicon.ico (multi-size icon)
  const sizes16_32_48 = [16, 32, 48].map(size =>
    path.join(iconsDir, `favicon-${size}x${size}.png`)
  );

  const command = `magick convert ${sizes16_32_48.join(' ')} ${path.join(iconsDir, 'favicon.ico')}`;

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error('Error generating favicon.ico:', stderr);
      return;
    }
    console.log('Generated favicon.ico');
  });

  // Create specific named icons for HTML references
  const specialIcons = [
    { size: 16, name: 'favicon-16x16.png' },
    { size: 32, name: 'favicon-32x32.png' },
    { size: 180, name: 'apple-touch-icon.png' },
    { size: 192, name: 'android-chrome-192x192.png' },
    { size: 512, name: 'android-chrome-512x512.png' }
  ];

  specialIcons.forEach(icon => {
    const sourcePath = path.join(iconsDir, `favicon-${icon.size}x${icon.size}.png`);
    const targetPath = path.join(iconsDir, icon.name);

    if (fs.existsSync(sourcePath)) {
      fs.copyFile(sourcePath, targetPath, (err) => {
        if (err) {
          console.error(`Error copying to ${icon.name}:`, err);
          return;
        }
        console.log(`Generated ${icon.name}`);
      });
    }
  });
});
