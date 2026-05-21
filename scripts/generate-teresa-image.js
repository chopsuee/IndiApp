const fs = require('fs');
const path = require('path');

const figure = {
  id: 'teresa',
  initials: 'MT',
  name: 'Mother Teresa',
  color: '#FFFFFF',  // White for her iconic white sari
  accent: '#000080', // Navy blue border of her sari
  textColor: '#000080' // Dark text for contrast on white
};

const outputDir = path.join(__dirname, '..', 'public', 'notable-figures');

// Ensure directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad-${figure.id}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#FFFFFF;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#E8E8E8;stop-opacity:1" />
    </linearGradient>
    <pattern id="pattern-${figure.id}" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
      <circle cx="20" cy="20" r="1.5" fill="${figure.accent}" opacity="0.1"/>
    </pattern>
    <radialGradient id="radial-${figure.id}" cx="50%" cy="50%" r="50%">
      <stop offset="0%" style="stop-color:#000080;stop-opacity:0.05" />
      <stop offset="100%" style="stop-color:#FFFFFF;stop-opacity:0" />
    </radialGradient>
  </defs>
  
  <!-- Base gradient -->
  <rect width="400" height="400" fill="url(#grad-${figure.id})"/>
  
  <!-- Subtle pattern overlay -->
  <rect width="400" height="400" fill="url(#pattern-${figure.id})"/>
  
  <!-- Radial highlight -->
  <circle cx="200" cy="200" r="200" fill="url(#radial-${figure.id})"/>
  
  <!-- Decorative circles (representing her blue-bordered sari) -->
  <circle cx="200" cy="200" r="140" fill="none" stroke="${figure.accent}" stroke-width="3" opacity="0.3"/>
  <circle cx="200" cy="200" r="150" fill="none" stroke="${figure.accent}" stroke-width="1" opacity="0.2"/>
  
  <!-- Initials -->
  <text x="200" y="200" font-family="'Noto Serif', Georgia, serif" font-size="140" font-weight="bold" 
        fill="${figure.textColor}" text-anchor="middle" dominant-baseline="middle" 
        style="text-shadow: 0 2px 8px rgba(0,0,128,0.2);">
    ${figure.initials}
  </text>
  
  <!-- Name -->
  <text x="200" y="340" font-family="'Noto Sans', Arial, sans-serif" font-size="22" font-weight="600"
        fill="${figure.textColor}" text-anchor="middle" opacity="0.9"
        style="text-shadow: 0 1px 4px rgba(0,0,128,0.1);">
    ${figure.name}
  </text>
</svg>`;

const outputPath = path.join(outputDir, `${figure.id}.svg`);
fs.writeFileSync(outputPath, svg);
console.log(`✓ Created: ${figure.name}`);
console.log('🎨 Image generated with white background (representing her iconic white sari)');
console.log('📍 Location: public/notable-figures/teresa.svg');
