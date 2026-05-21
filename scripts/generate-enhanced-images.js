const fs = require('fs');
const path = require('path');

const figures = [
  { id: 'gandhi', initials: 'MG', name: 'Mahatma Gandhi', color: '#FF9933', accent: '#FFFFFF' },
  { id: 'tagore', initials: 'RT', name: 'Rabindranath Tagore', color: '#138808', accent: '#FFFFFF' },
  { id: 'kalam', initials: 'AK', name: 'APJ Abdul Kalam', color: '#000080', accent: '#FF9933' },
  { id: 'sen', initials: 'AS', name: 'Amartya Sen', color: '#FF9933', accent: '#138808' },
  { id: 'tata', initials: 'RT', name: 'Ratan Tata', color: '#138808', accent: '#FF9933' }
];

const outputDir = path.join(__dirname, '..', 'public', 'notable-figures');

// Ensure directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

figures.forEach(figure => {
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad-${figure.id}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${figure.color};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${adjustBrightness(figure.color, -30)};stop-opacity:1" />
    </linearGradient>
    <pattern id="pattern-${figure.id}" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
      <circle cx="20" cy="20" r="1.5" fill="${figure.accent}" opacity="0.15"/>
    </pattern>
    <radialGradient id="radial-${figure.id}" cx="50%" cy="50%" r="50%">
      <stop offset="0%" style="stop-color:${figure.accent};stop-opacity:0.1" />
      <stop offset="100%" style="stop-color:${figure.color};stop-opacity:0" />
    </radialGradient>
  </defs>
  
  <!-- Base gradient -->
  <rect width="400" height="400" fill="url(#grad-${figure.id})"/>
  
  <!-- Subtle pattern overlay -->
  <rect width="400" height="400" fill="url(#pattern-${figure.id})"/>
  
  <!-- Radial highlight -->
  <circle cx="200" cy="200" r="200" fill="url(#radial-${figure.id})"/>
  
  <!-- Decorative circle -->
  <circle cx="200" cy="200" r="140" fill="none" stroke="${figure.accent}" stroke-width="2" opacity="0.2"/>
  
  <!-- Initials -->
  <text x="200" y="200" font-family="'Noto Serif', Georgia, serif" font-size="140" font-weight="bold" 
        fill="white" text-anchor="middle" dominant-baseline="middle" 
        style="text-shadow: 0 4px 12px rgba(0,0,0,0.3);">
    ${figure.initials}
  </text>
  
  <!-- Name -->
  <text x="200" y="340" font-family="'Noto Sans', Arial, sans-serif" font-size="22" font-weight="600"
        fill="white" text-anchor="middle" opacity="0.95"
        style="text-shadow: 0 2px 8px rgba(0,0,0,0.3);">
    ${figure.name}
  </text>
</svg>`;

  const outputPath = path.join(outputDir, `${figure.id}.svg`);
  fs.writeFileSync(outputPath, svg);
  console.log(`✓ Created: ${figure.name}`);
});

function adjustBrightness(hex, percent) {
  const num = parseInt(hex.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = Math.max(0, Math.min(255, (num >> 16) + amt));
  const G = Math.max(0, Math.min(255, (num >> 8 & 0x00FF) + amt));
  const B = Math.max(0, Math.min(255, (num & 0x0000FF) + amt));
  return '#' + (0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1);
}

console.log('\n🎨 All enhanced images generated successfully!');
console.log('📍 Location: public/notable-figures/');
