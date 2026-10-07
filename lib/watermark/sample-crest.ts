export const SAMPLE_INSTITUTIONAL_WATERMARK_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 240" width="1000" height="240">
  <defs>
    <filter id="crisp" x="0" y="0" width="100%" height="100%">
      <feDropShadow dx="0" dy="0" stdDeviation="0.2" flood-color="#ffffff"/>
    </filter>
  </defs>
  <g fill="#ffffff">
    <!-- Emblem / Crest Left -->
    <g transform="translate(40, 20) scale(0.95)">
      <!-- Outer Shield / Circle -->
      <path d="M100,10 C145,10 180,45 180,90 C180,145 100,195 100,195 C100,195 20,145 20,90 C20,45 55,10 100,10 Z" 
            fill="none" stroke="#ffffff" stroke-width="4.5" stroke-linecap="round"/>
      <path d="M100,22 C138,22 168,52 168,90 C168,136 100,180 100,180 C100,180 32,136 32,90 C32,52 62,22 100,22 Z" 
            fill="none" stroke="#ffffff" stroke-width="2" stroke-dasharray="4,4"/>
      
      <!-- Open Book in Center -->
      <path d="M100,108 C90,98 70,96 50,100 L50,140 C70,136 90,138 100,148 C110,138 130,136 150,140 L150,100 C130,96 110,98 100,108 Z" 
            fill="none" stroke="#ffffff" stroke-width="3.5" stroke-linejoin="round"/>
      <path d="M100,108 L100,148" stroke="#ffffff" stroke-width="3" stroke-linecap="round"/>
      <line x1="60" y1="112" x2="88" y2="110" stroke="#ffffff" stroke-width="2" stroke-linecap="round"/>
      <line x1="60" y1="122" x2="88" y2="120" stroke="#ffffff" stroke-width="2" stroke-linecap="round"/>
      <line x1="60" y1="132" x2="88" y2="130" stroke="#ffffff" stroke-width="2" stroke-linecap="round"/>
      <line x1="112" y1="110" x2="140" y2="112" stroke="#ffffff" stroke-width="2" stroke-linecap="round"/>
      <line x1="112" y1="120" x2="140" y2="122" stroke="#ffffff" stroke-width="2" stroke-linecap="round"/>
      <line x1="112" y1="130" x2="140" y2="132" stroke="#ffffff" stroke-width="2" stroke-linecap="round"/>

      <!-- Academic Star / Torch above book -->
      <path d="M100,52 L105,67 L120,68 L108,78 L112,93 L100,83 L88,93 L92,78 L80,68 L95,67 Z" 
            fill="#ffffff"/>

      <!-- Laurel Branch Leaves Left -->
      <path d="M26,95 C14,80 18,60 18,60 C18,60 30,72 26,95 Z" fill="#ffffff"/>
      <path d="M16,115 C5,102 7,85 7,85 C7,85 20,95 16,115 Z" fill="#ffffff"/>
      <path d="M25,138 C14,128 12,112 12,112 C12,112 26,120 25,138 Z" fill="#ffffff"/>

      <!-- Laurel Branch Leaves Right -->
      <path d="M174,95 C186,80 182,60 182,60 C182,60 170,72 174,95 Z" fill="#ffffff"/>
      <path d="M184,115 C195,102 193,85 193,85 C193,85 180,95 184,115 Z" fill="#ffffff"/>
      <path d="M175,138 C186,128 188,112 188,112 C188,112 174,120 175,138 Z" fill="#ffffff"/>
    </g>

    <!-- Typography -->
    <text x="250" y="98" 
          font-family="'Cinzel', 'Times New Roman', 'Georgia', serif" 
          font-size="44" 
          font-weight="700" 
          letter-spacing="6" 
          fill="#ffffff">ST. AUGUSTINE ACADEMY</text>

    <text x="252" y="142" 
          font-family="'Montserrat', 'Helvetica Neue', 'Arial', sans-serif" 
          font-size="20" 
          font-weight="500" 
          letter-spacing="9" 
          fill="#ffffff" 
          opacity="0.95">TRADITION • EXCELLENCE • INTEGRITY</text>
          
    <text x="254" y="174" 
          font-family="'Montserrat', 'Helvetica Neue', 'Arial', sans-serif" 
          font-size="14" 
          font-weight="400" 
          letter-spacing="5" 
          fill="#ffffff" 
          opacity="0.8">ESTABLISHED 1984</text>
  </g>
</svg>
`;
