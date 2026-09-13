import json, re

with open('data/products.json', 'r', encoding='utf-8') as f:
    products = json.load(f)

for p in products:
    if p['id'] == 'wp-3389':
        # 1. Title, Slug & Aff Link
        p['title'] = 'Bebedouro Automático para Pets: Vale a Pena? Veja os Benefícios'
        p['slug'] = 'bebedouro-automatico-para-pets-vale-a-pena-ter-em-casa'
        p['affiliateUrl'] = 'https://meli.la/2Kanz5J'
        
        # 2. Pricing & Conditions
        p['price'] = 338.89
        p['originalPrice'] = 399.00
        p['discountPercentage'] = 15
        p['installments'] = '12x de R$ 33,15'
        p['freeShipping'] = True
        p['isFull'] = True
        p['rating'] = 5.0
        p['reviewCount'] = 148

        # 3. Images
        p['imageUrl'] = '/products/bebedouro-para-caes-e-gatos.jpg'
        p['images'] = [
            '/products/bebedouro-para-caes-e-gatos.jpg',
            '/products/praticidade.jpg',
            '/products/agua-pura.jpg',
            '/products/inteligente-e-silenciosa.jpg',
            '/products/montagem.jpg'
        ]

        # 4. Pros & Cons
        p['pros'] = [
            'Capacidade de 3 Litros que fornece água fresca e oxigenada por até 14 dias sem reabastecer',
            'Bomba d\'água ultrassilenciosa (menos de 40 dB) que não espanta os pets nem incomoda à noite',
            'Dupla filtragem com carvão ativado e esponja de retenção que remove pelos, poeira e odores',
            'Dois modos de fluxo de água (efeito torneira e chafariz) que estimulam o instinto natural do animal a beber mais',
            'Visor transparente de nível com indicador luminoso para monitoramento prático do reservatório',
            'Fácil montagem e higienização com peças removíveis e materiais atóxicos livres de BPA'
        ]
        p['cons'] = [
            'Requer higienização periódica e substituição dos filtros para manter a qualidade da água',
            'Acompanha cabo USB, necessitando de um adaptador de tomada padrão de 5V'
        ]

        # 5. Verdict
        p['verdict'] = {
            'score': 9.8,
            'badge': 'Melhor Bebedouro Inteligente',
            'summary': 'O Bebedouro Automático Inteligente Newpet 3L é a melhor recomendação para garantir hidratação contínua com água corrente e filtrada, prevenindo problemas renais frequentes em cães e gatos.',
            'recommendedFor': 'Tutores de gatos e cães de pequeno a médio porte que buscam incentivar a hidratação diária de forma limpa e silenciosa.',
            'notRecommendedFor': 'Cães de porte grande com alta ingestão diária de água.'
        }

        # 6. Specifications
        p['specifications'] = [
            {'label': 'Modelo', 'value': 'Newpet Bebedouro Inteligente 3L para Gatos e Cães'},
            {'label': 'Capacidade do Reservatório', 'value': '3 Litros'},
            {'label': 'Nível de Ruído', 'value': 'Ultrassilencioso (Abaixo de 40 dB)'},
            {'label': 'Modos de Fluxo', 'value': '2 modos (Efeito Torneira e Fonte Chafariz)'},
            {'label': 'Sistema de Filtragem', 'value': 'Carvão Ativado + Esponja de Alta Densidade'},
            {'label': 'Alimentação', 'value': 'USB 5V com baixo consumo de energia'},
            {'label': 'Indicação', 'value': 'Gatos e Cães de Pequeno e Médio Porte'},
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
        rc = rc.replace('https://acheiutil.com/wp-content/uploads/2026/08/praticidade.jpg', '/products/praticidade.jpg')
        rc = rc.replace('https://acheiutil.com/wp-content/uploads/2026/08/agua-pura.jpg', '/products/agua-pura.jpg')
        rc = rc.replace('https://acheiutil.com/wp-content/uploads/2026/08/inteligente-e-silenciosa.jpg', '/products/inteligente-e-silenciosa.jpg')
        rc = rc.replace('https://acheiutil.com/wp-content/uploads/2026/08/montagem.jpg', '/products/montagem.jpg')

        # Replace CTA section
        cta_regex = r'<div class="au-bebedouro-cta">.*?</div>'
        new_cta = '''<div class="au-bebedouro-cta">
    <h2>Confira o Bebedouro Inteligente Newpet 3L no Mercado Livre</h2>
    <p>
      Veja o preço atual, avaliações de outros tutores, opções de cores e garanta o modelo original com frete rápido e garantia de compra do Mercado Livre.
    </p>
    <div class="au-bebedouro-buttons">
      <a href="https://meli.la/2Kanz5J" target="_blank" rel="nofollow sponsored noopener" class="au-mercado-button">
        Consultar Preço Atual no Mercado Livre →
      </a>
    </div>
    <p style="margin-top:20px; margin-bottom:0; font-size:14px; color:#64748b;">
      ⚡ Compra protegida pelo Mercado Livre com entrega rápida e devolução grátis.
    </p>
  </div>'''
        rc = re.sub(cta_regex, new_cta, rc, flags=re.DOTALL)

        # Replace any remaining affiliate links with https://meli.la/2Kanz5J
        rc = re.sub(r'href="https://lista\.mercadolivre\.com\.br/[^"]+"', 'href="https://meli.la/2Kanz5J"', rc)
        rc = re.sub(r'href="https://meli\.la/[^"]+"', 'href="https://meli.la/2Kanz5J"', rc)
        rc = re.sub(r'href="https://www\.mercadolivre\.com\.br/[^"]+"', 'href="https://meli.la/2Kanz5J"', rc)

        # Adjust CTA styling in css block
        rc = re.sub(r'\.au-amazon-button\s*\{[^}]*\}', '', rc)
        rc = re.sub(r'\.au-amazon-button:hover\s*\{[^}]*\}', '', rc)

        btn_css = '''
.au-mercado-button {
  display: inline-block;
  padding: 15px 28px;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 800;
  text-decoration: none !important;
  transition: all 0.2s;
  background: #ffe600;
  color: #0f172a !important;
  box-shadow: 0 4px 14px rgba(255, 230, 0, 0.4);
}
.au-mercado-button:hover {
  background: #f7df00;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 230, 0, 0.5);
}'''
        if '.au-mercado-button:hover' not in rc:
            rc = rc.replace('</style>', btn_css + '\n</style>')

        # Update disclosure text
        rc = rc.replace('link da Amazon', 'link do Mercado Livre')
        rc = rc.replace('links da Amazon', 'links do Mercado Livre')

        p['reviewContent'] = rc.strip()
        print('Post wp-3389 atualizado com sucesso!')

with open('data/products.json', 'w', encoding='utf-8') as f:
    json.dump(products, f, indent=2, ensure_ascii=False)
