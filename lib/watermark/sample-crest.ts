/**
 * Default Markaan theme institutional watermark SVG.
 * Recreated Markaan emblem by Ahsan Raza.
 */
export const SAMPLE_INSTITUTIONAL_WATERMARK_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 240" width="1000" height="240">
  <defs>
    <!-- Crisp drop shadow filter -->
    <filter id="crisp-shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="1" dy="2" stdDeviation="3" flood-color="#000000" flood-opacity="0.35"/>
    </filter>
  </defs>

  <g fill="#ffffff" filter="url(#crisp-shadow)">
    <!-- Recreated Markaan Emblem Vector -->
    <g transform="translate(45, 20) scale(0.42)">
      <!-- Left Circle Arc Segment -->
      <path d="M 230 40 C 130 50 50 135 45 240 C 40 345 120 440 230 455 L 230 405 C 150 395 85 320 90 240 C 95 160 160 85 230 80 Z" fill="#ffffff"/>
      
      <!-- Top Forward Arrow Chevron -->
      <path d="M 245 45 L 360 45 L 470 240 L 360 435 L 245 435 L 350 240 Z" fill="#ffffff"/>

      <!-- Diagonal Slanted Stripe 1 -->
      <polygon points="120,165 260,115 315,145 175,195" fill="#ffffff"/>

      <!-- Diagonal Slanted Stripe 2 (Center Bar) -->
      <polygon points="105,275 320,195 350,225 135,305" fill="#ffffff"/>

      <!-- Diagonal Slanted Stripe 3 (Bottom Arm) -->
      <polygon points="125,370 270,315 295,345 150,400" fill="#ffffff"/>
      <polygon points="270,315 305,315 305,420 270,420" fill="#ffffff"/>
    </g>

    <!-- Typography -->
    <!-- Primary Brand Title: MARKAAN -->
    <text x="275" y="105" 
          font-family="'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" 
          font-size="52" 
          font-weight="800" 
          letter-spacing="10" 
          fill="#ffffff">MARKAAN</text>

    <!-- Creator Tag: BY AHSAN RAZA -->
    <text x="278" y="148" 
          font-family="'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" 
          font-size="20" 
          font-weight="600" 
          letter-spacing="8" 
          fill="#ffffff" 
          opacity="0.95">BY AHSAN RAZA</text>
          
    <!-- Professional Watermark Tag -->
    <text x="280" y="178" 
          font-family="'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" 
          font-size="13" 
          font-weight="500" 
          letter-spacing="5" 
          fill="#ffffff" 
          opacity="0.8">PROFESSIONAL BULK WATERMARK STUDIO</text>
  </g>
</svg>
`;
