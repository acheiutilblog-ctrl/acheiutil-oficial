import subprocess

svg_icon = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512" fill="none">
  <!-- Sombra sutil de fundo opcional (transparente) -->
  <defs>
    <filter id="soft-shadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#073b5c" flood-opacity="0.10" />
    </filter>
  </defs>

  <g filter="url(#soft-shadow)">
    <!-- Cabo da Lupa (45 graus inferior direito) -->
    <path 
      d="M 285 285 L 375 375" 
      stroke="#06486D" 
      stroke-width="42" 
      stroke-linecap="round" 
    />

    <!-- Aro da Lupa -->
    <circle 
      cx="210" 
      cy="210" 
      r="120" 
      stroke="#06486D" 
      stroke-width="38" 
      fill="none" 
    />

    <!-- Braço Esquerdo do Checkmark (Verde-azulado / Teal) -->
    <path 
      d="M 160 205 L 210 255" 
      stroke="#028190" 
      stroke-width="38" 
      stroke-linecap="round" 
      stroke-linejoin="round"
    />

    <!-- Braço Direito do Checkmark (Laranja vibrante saindo do aro) -->
    <path 
      d="M 205 250 L 315 140" 
      stroke="#F07A1E" 
      stroke-width="38" 
      stroke-linecap="round" 
      stroke-linejoin="round"
    />
  </g>
</svg>'''

svg_full = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 650" width="600" height="650" fill="none">
  <defs>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@800&amp;display=swap');
      .brand-text {
        font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
        font-weight: 800;
        font-size: 78px;
        fill: #06486D;
        letter-spacing: -1.5px;
      }
    </style>
    <filter id="soft-shadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="6" stdDeviation="10" flood-color="#073b5c" flood-opacity="0.08" />
    </filter>
  </defs>

  <!-- Ícone centralizado -->
  <g transform="translate(44, 20)" filter="url(#soft-shadow)">
    <!-- Cabo da Lupa -->
    <path 
      d="M 285 285 L 375 375" 
      stroke="#06486D" 
      stroke-width="42" 
      stroke-linecap="round" 
    />

    <!-- Aro da Lupa -->
    <circle 
      cx="210" 
      cy="210" 
      r="120" 
      stroke="#06486D" 
      stroke-width="38" 
      fill="none" 
    />

    <!-- Braço Esquerdo Teal -->
    <path 
      d="M 160 205 L 210 255" 
      stroke="#028190" 
      stroke-width="38" 
      stroke-linecap="round" 
      stroke-linejoin="round"
    />

    <!-- Braço Direito Laranja -->
    <path 
      d="M 205 250 L 315 140" 
      stroke="#F07A1E" 
      stroke-width="38" 
      stroke-linecap="round" 
      stroke-linejoin="round"
    />
  </g>

  <!-- Tipografia da Marca -->
  <text x="300" y="550" text-anchor="middle" class="brand-text">AcheiUtil</text>
</svg>'''

with open('public/logo-icon.svg', 'w') as f:
    f.write(svg_icon)

with open('public/logo-full.svg', 'w') as f:
    f.write(svg_full)

print("SVGs generated.")
