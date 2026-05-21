const fs = require('fs');
const path = require('path');

const figures = [
  { id: 'gandhi', initials: 'MG', name: 'Mahatma Gandhi', color: '#FF9933' },
  { id: 'tagore', initials: 'RT', name: 'Rabindranath Tagore', color: '#138808' },
  { id: 'kalam', initials: 'AK', name: 'APJ Abdul Kalam', color: '#000080' },
  { id: 'sen', initials: 'AS', name: 'Amartya Sen', color: '#FF9933' },
  { id: 'tata', initials: 'RT', name: 'Ratan Tata', color: '#138808' }
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
  </defs>
  <rect width="400" height="400" fill="url(#grad-${figure.id})"/>
  <text x="200" y="220" font-family="Arial, sans-serif" font-size="120" font-weight="bold" 
        fill="white" text-anchor="middle" dominant-baseline="middle">
    ${figure.initials}
  </text>
  <text x="200" y="340" font-family="Arial, sans-serif" font-size="24" 
        fill="white" text-anchor="middle" opacity="0.9">
    ${figure.name}
  </text>
</svg>`;

  const outputPath = path.join(outputDir, `${figure.id}.svg`);
  fs.writeFileSync(outputPath, svg);
  console.log(`Created: ${outputPath}`);
});

function adjustBrightness(hex, percent) {
  const num = parseInt(hex.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = Math.max(0, Math.min(255, (num >> 16) + amt));
  const G = Math.max(0, Math.min(255, (num >> 8 & 0x00FF) + amt));
  const B = Math.max(0, Math.min(255, (num & 0x0000FF) + amt));
  return '#' + (0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1);
}

console.log('✓ All placeholder images generated successfully!');
