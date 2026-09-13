import json, re

with open('data/products.json', 'r', encoding='utf-8') as f:
    products = json.load(f)

for p in products:
    if p['id'] == 'wp-3460':
        # 1. Title & Slug
        p['title'] = 'Fita LED RGBIC: Vale a Pena? Como Escolher e Usar na Decoração'
        p['slug'] = 'fita-led-inteligente-rgbic-o-segredo-para-transformar-qualquer-ambiente'
        
        # 2. Affiliate URL & Pricing
        p['affiliateUrl'] = 'https://meli.la/1MPRC88'
        p['price'] = 249.00
        p['originalPrice'] = 319.00
        p['discountPercentage'] = 22
        p['installments'] = 'em até 10x ou 12x no cartão'
        p['freeShipping'] = True
        p['isFull'] = True
        if 'officialStore' in p:
            del p['officialStore']

        # 3. Image
        p['images'] = ['/products/fita-led-inteligente-rgbic.jpg']
        p['imageUrl'] = '/products/fita-led-inteligente-rgbic.jpg'

        # 4. Subtitle & Summary
        p['subtitle'] = 'Análise completa da Fita de LED Govee RGBIC Basic Wi-Fi Bluetooth 10m compatível com Alexa. Descubra se vale a pena, como funciona o controle por segmentos e onde comprar com segurança.'
        p['summary'] = 'Descubra se a Fita de LED Govee RGBIC Basic de 10m vale a pena. Com tecnologia RGBIC para múltiplas cores simultâneas, controle por voz com Alexa/Google Home, sincronização musical e app Govee Home.'

        # 5. Pros & Cons
        p['pros'] = [
            'Tecnologia RGBIC avançada: exibe diversas cores simultaneamente em degradê na mesma fita',
            'Comprimento generoso de 10 metros, ideal para salas, quartos, sancas e setups gamer',
            'Conectividade dupla Wi-Fi e Bluetooth com aplicativo Govee Home repleto de cenas e efeitos',
            'Compatível com comando de voz via Alexa e Google Assistant',
            'Sincronização com música e áudio ambiente com 11 modos dinâmicos de captação',
            'Fita adesiva resistente de fácil fixação em superfícies lisas'
        ]
        p['cons'] = [
            'Como toda fita RGBIC com chips integrados, não deve ser cortada aleatoriamente para não queimar segmentos',
            'Desenvolvida para uso em ambientes internos (não é à prova d\'água para áreas externas)'
        ]

        # 6. Verdict
        p['verdict'] = {
            'score': 9.6,
            'badge': 'Melhor Fita LED Inteligente',
            'summary': 'A Govee RGBIC Basic 10m é a melhor escolha de iluminação inteligente decorativa: entrega cores vibrantes, efeitos dinâmicos que o RGB comum não consegue fazer e excelente integração com Alexa.',
            'recommendedFor': 'Quem deseja transformar quartos, salas, estantes ou escritórios com iluminação moderna de alta qualidade controlada pelo celular ou por voz.',
            'notRecommendedFor': 'Quem busca iluminação para fachadas externas ou áreas expostas à chuva.'
        }

        # 7. Specifications
        p['specifications'] = [
            {'label': 'Modelo', 'value': 'Govee RGBIC Basic Wi-Fi + Bluetooth 10m'},
            {'label': 'Comprimento', 'value': '10 Metros'},
            {'label': 'Tecnologia de Iluminação', 'value': 'RGBIC (Controle individual de segmentos e cores)'},
            {'label': 'Conectividade', 'value': 'Wi-Fi 2.4GHz e Bluetooth (App Govee Home)'},
            {'label': 'Comando de Voz', 'value': 'Compatível com Amazon Alexa e Google Assistant'},
            {'label': 'Sincronização Musical', 'value': 'Sim, microfone embutido com 11 modos de ritmo'},
            {'label': 'Cenas Pré-definidas', 'value': 'Mais de 64 modos dinâmicos'},
            {'label': 'Voltagem / Alimentação', 'value': 'Adaptador de energia 24V incluso'},
            {'label': 'Garantia', 'value': 'Compra Garantida Mercado Livre'}
        ]

        # 8. ReviewContent updates
        content = p.get('reviewContent', '')

        # Add reference to the featured Govee model in the text
        if 'Govee RGBIC' not in content:
            content = content.replace(
                '<h2>O que significa RGBIC?</h2>',
                '<h2>Modelo em Destaque: Fita LED Govee RGBIC Basic 10m Wi-Fi</h2>\n  <p>Entre as melhores fitas do mercado, a <strong>Fita de LED Govee RGBIC Basic 10m</strong> é a principal referência mundial em iluminação inteligente. Ela reúne controle segmentado de cores, conectividade Wi-Fi e Bluetooth, sincronização musical e compatibilidade nativa com <strong>Alexa e Google Assistant</strong>, permitindo transformar qualquer sala, quarto ou setup com comandos de voz e dezenas de cenas dinâmicas.</p>\n  <h2>O que significa RGBIC?</h2>'
            )

        # Replace CTA section: clean button to Mercado Livre with new URL and no price
        cta_regex = r'<div class="au-rgbic-cta">.*?</div>'
        new_cta = '''<div class="au-rgbic-cta">
    <h2>Confira o modelo Govee RGBIC no Mercado Livre</h2>
    <p>
      Veja avaliações de quem comprou, tire dúvidas e garanta o modelo original de 10 metros com envio rápido e compra garantida.
    </p>
    <a href="https://meli.la/1MPRC88" target="_blank" rel="nofollow sponsored noopener" class="au-rgbic-button au-ml-button">
      Consultar Preço Atual no Mercado Livre →
    </a>
  </div>'''

        content = re.sub(cta_regex, new_cta, content, flags=re.DOTALL)

        # Update CSS button styles
        content = re.sub(r'\.au-amazon-button\s*\{[^}]*\}', '', content)
        content = re.sub(r'\.au-amazon-button:hover\s*\{[^}]*\}', '', content)

        btn_css = '''
.au-rgbic-button {
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
        if '.au-ml-button' not in content:
            content = content.replace('</style>', btn_css + '\n</style>')

        # Update disclosure to remove Amazon mention
        content = content.replace(
            'realizadas através do link da Amazon,',
            'realizadas através do Mercado Livre,'
        )

        p['reviewContent'] = content
        print('Successfully updated wp-3460!')

with open('data/products.json', 'w', encoding='utf-8') as f:
    json.dump(products, f, indent=2, ensure_ascii=False)
