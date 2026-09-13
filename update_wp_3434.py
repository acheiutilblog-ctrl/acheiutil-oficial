import json, re

with open('data/products.json', 'r', encoding='utf-8') as f:
    products = json.load(f)

for p in products:
    if p['id'] == 'wp-3434':
        # 1. Title, Slug & Aff Link
        p['title'] = 'Alimentador Automático Velds para Cães e Gatos: Vale a Pena?'
        p['slug'] = 'alimentador-automatico-wi-fi-velds-vale-a-pena-para-gatos-e-caes'
        p['affiliateUrl'] = 'https://meli.la/2y1uzrm'
        
        # 2. Pricing & Conditions
        p['price'] = 290.99
        p['originalPrice'] = 439.90
        p['discountPercentage'] = 33
        p['installments'] = '10x de R$ 29,10 sem juros'
        p['freeShipping'] = True
        p['isFull'] = True
        p['rating'] = 4.8
        p['reviewCount'] = 342

        # 3. Images
        p['imageUrl'] = '/products/alimentador-automatico-wifi-velds.jpg'
        p['images'] = [
            '/products/alimentador-automatico-wifi-velds.jpg',
            '/products/comedouro-automatico-Copia.jpg',
            '/products/grave-recados-Copia.jpg',
            '/products/pilha-Copia.jpg',
            '/products/sem-energia.jpg'
        ]

        # 4. Pros & Cons
        p['pros'] = [
            'Capacidade de 4 Litros que proporciona vários dias de tranquilidade e autonomia',
            'Controle preciso de refeições e horários programáveis pelo celular via Wi-Fi e Bluetooth',
            'Gravação de recado por voz que chama o pet com a voz do tutor na hora da refeição',
            'Sistema redundante de energia (tomada bivolt + compartimento para 3 pilhas D de backup)',
            'Tigela higiênica e estrutura desmontável para fácil limpeza no dia a dia',
            'Compatível com grãos de ração seca entre 2mm e 10mm'
        ]
        p['cons'] = [
            'Desenvolvido exclusivamente para ração seca (não aceita alimentos úmidos)',
            'As 3 pilhas tamanho D para proteção contra queda de energia não estão inclusas'
        ]

        # 5. Verdict
        p['verdict'] = {
            'score': 9.7,
            'badge': 'Melhor Alimentador Automático',
            'summary': 'O Comedouro Automático Inteligente Velds 4L é a melhor solução para manter a rotina alimentar de cães e gatos rigorosamente em dia, mesmo com rotina corrida, trabalho fora ou viagens curtas.',
            'recommendedFor': 'Tutores de cães e gatos que passam o dia fora, viajam ou precisam controlar as porções do pet com exatidão.',
            'notRecommendedFor': 'Cães de porte grande com alto consumo diário de ração.'
        }

        # 6. Specifications
        p['specifications'] = [
            {'label': 'Modelo', 'value': 'Comedouro Automático Velds Smart 4L com App e Programação'},
            {'label': 'Capacidade do Reservatório', 'value': '4 Litros'},
            {'label': 'Tamanho dos Grãos', 'value': 'De 2mm a 10mm (Ração Seca)'},
            {'label': 'Conectividade', 'value': 'Wi-Fi 2.4GHz e Bluetooth LE (App no Celular)'},
            {'label': 'Gravação de Voz', 'value': 'Sim, microfone e alto-falante integrados'},
            {'label': 'Alimentação', 'value': 'Fonte DC 5V 1A Bivolt + Suporte a 3 Pilhas D de backup'},
            {'label': 'Indicação', 'value': 'Gatos e Cães de Pequeno a Médio Porte'},
            {'label': 'Garantia', 'value': 'Compra Garantida Mercado Livre'}
        ]

        # 7. Update Review Content
        rc = p.get('reviewContent', '')

        # Clean artifacts
        rc = re.sub(r'^\s*<p class="[^"]*wp-block-paragraph[^"]*"></p>\s*', '', rc)
        rc = re.sub(r'(&#8220;|“|")\s*`*html\s*', '', rc, flags=re.IGNORECASE)
        rc = re.sub(r'^```html\s*', '', rc, flags=re.IGNORECASE)
        rc = re.sub(r'\s*(&#8220;?|“|")\s*$', '', rc)
        rc = re.sub(r'\s*```\s*$', '', rc)

        # Replace remote image URLs with local ones
        rc = rc.replace('https://acheiutil.com/wp-content/uploads/2026/08/comedouro-automatico-Copia.jpg', '/products/comedouro-automatico-Copia.jpg')
        rc = rc.replace('https://acheiutil.com/wp-content/uploads/2026/08/grave-recados-Copia.jpg', '/products/grave-recados-Copia.jpg')
        rc = rc.replace('https://acheiutil.com/wp-content/uploads/2026/08/pilha-Copia.jpg', '/products/pilha-Copia.jpg')
        rc = rc.replace('https://acheiutil.com/wp-content/uploads/2026/08/sem-energia.jpg', '/products/sem-energia.jpg')

        # Replace CTA section
        cta_regex = r'<div class="au-velds-cta">.*?</div>'
        new_cta = '''<div class="au-velds-cta">
    <h2>Confira o Alimentador Inteligente Velds no Mercado Livre</h2>
    <p>
      Veja avaliações verificadas de tutores de cães e gatos, fotos reais e garanta o modelo original com envio rápido e compra garantida.
    </p>
    <a href="https://meli.la/2y1uzrm" target="_blank" rel="nofollow sponsored noopener" class="au-velds-button au-ml-button">
      Consultar Preço Atual no Mercado Livre →
    </a>
  </div>'''
        rc = re.sub(cta_regex, new_cta, rc, flags=re.DOTALL)

        # Ensure any remaining links point to https://meli.la/2y1uzrm
        rc = re.sub(r'href="https://lista\.mercadolivre\.com\.br/[^"]+"', 'href="https://meli.la/2y1uzrm"', rc)
        rc = re.sub(r'href="https://www\.mercadolivre\.com\.br/[^"]+"', 'href="https://meli.la/2y1uzrm"', rc)

        # Replace CSS button styling
        rc = re.sub(r'\.au-amazon-button\s*\{[^}]*\}', '', rc)
        rc = re.sub(r'\.au-amazon-button:hover\s*\{[^}]*\}', '', rc)

        btn_css = '''
.au-velds-button {
  display: inline-block;
  padding: 15px 28px;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 800;
  text-decoration: none !important;
  transition: all 0.2s;
  cursor: pointer;
}
.au-ml-button {
  background: #ffe600;
  color: #0f172a !important;
  box-shadow: 0 4px 14px rgba(255, 230, 0, 0.4);
}
.au-ml-button:hover {
  background: #f7df00;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 230, 0, 0.5);
}'''
        if '.au-ml-button' not in rc:
            rc = rc.replace('</style>', btn_css + '\n</style>')

        # Update disclosure to remove Amazon mention
        rc = rc.replace(
            'realizadas através do link da Amazon,',
            'realizadas através do Mercado Livre,'
        )

        p['reviewContent'] = rc.strip()
        print('Post wp-3434 atualizado com sucesso!')

with open('data/products.json', 'w', encoding='utf-8') as f:
    json.dump(products, f, indent=2, ensure_ascii=False)
