import json, re

with open('data/products.json', 'r', encoding='utf-8') as f:
    products = json.load(f)

for p in products:
    if p['id'] == 'wp-3475':
        # 1. Title & Slug
        p['title'] = 'Câmera Pet com IA: Vale a Pena? O Que Avaliar Antes de Comprar em 2026'
        p['slug'] = 'cameras-pet-com-ia-a-tecnologia-que-esta-mudando-a-vida-de-milhares-de-tutores'
        
        # 2. Affiliate URL & Pricing
        p['affiliateUrl'] = 'https://meli.la/2oyHyRX'
        p['price'] = 332.00
        p['originalPrice'] = 399.00
        p['discountPercentage'] = 17
        p['installments'] = 'em até 10x ou 12x no cartão'
        p['freeShipping'] = True
        p['isFull'] = True
        if 'officialStore' in p:
            del p['officialStore']

        # 3. Image
        p['images'] = ['/products/camera-pet-ia-anker-eufy-e220.png']
        p['imageUrl'] = '/products/camera-pet-ia-anker-eufy-e220.png'

        # 4. Subtitle & Summary
        p['subtitle'] = 'Análise completa da Câmera de Segurança Anker Eufy E220 2K Wi-Fi 360° com Inteligência Artificial para Pets. Descubra se vale a pena, como funciona o rastreamento automático e onde comprar com segurança.'
        p['summary'] = 'Análise detalhada da Câmera de Segurança Anker Eufy E220 2K (3MP) Wi-Fi Interna 360° com Inteligência Artificial para Pets, áudio bidirecional e visão noturna. Descubra se vale a pena comprar e como acompanhar seu pet à distância sem mensalidades.'

        # 5. Pros & Cons
        p['pros'] = [
            'Resolução 2K (3MP) com imagem cristalina e visão noturna infravermelha nítida até 10 metros',
            'Rastreamento inteligente 360° (pan e tilt) que acompanha o movimento do cão ou gato pela casa',
            'Inteligência Artificial no próprio aparelho: identifica humanos e pets sem custos adicionais de assinatura',
            'Áudio bidirecional em tempo real para ouvir e conversar com o pet pelo celular',
            'Armazenamento local em cartão microSD (até 128GB) sem mensalidades obrigatórias de nuvem',
            'Compatível com assistentes de voz (Alexa, Google Assistant e Apple HomeKit)'
        ]
        p['cons'] = [
            'Projetada exclusivamente para uso interno (não possui proteção contra chuva ou intempéries)',
            'Funciona ligada na tomada (não utiliza bateria interna recarregável)'
        ]

        # 6. Verdict
        p['verdict'] = {
            'score': 9.7,
            'badge': 'Melhor Câmera Pet com IA',
            'summary': 'A Câmera Anker Eufy E220 2K é a referência em monitoramento pet inteligente: oferece rastreamento 360°, inteligência artificial local que realmente diferencia pets de humanos e gravação sem mensalidades.',
            'recommendedFor': 'Tutores que passam períodos fora e querem ver, ouvir e interagir com seus cães e gatos com alta definição e segurança.',
            'notRecommendedFor': 'Quem precisa monitorar áreas externas abertas sujeitas à chuva.'
        }

        # 7. Specifications
        p['specifications'] = [
            {'label': 'Modelo', 'value': 'Anker Eufy E220 2K 3MP Wi-Fi 360°'},
            {'label': 'Resolução de Vídeo', 'value': '2K (2560 x 1440) Ultra HD'},
            {'label': 'Cobertura e Rotação', 'value': '360° Horizontal e 96° Vertical'},
            {'label': 'Recursos de IA', 'value': 'Detecção inteligente de Humanos, Pets e Choro'},
            {'label': 'Áudio', 'value': 'Bidirecional (fala e escuta em tempo real)'},
            {'label': 'Visão Noturna', 'value': 'Infravermelho com alcance de até 10 metros'},
            {'label': 'Armazenamento', 'value': 'MicroSD local (até 128GB), RTSP/NAS ou Nuvem'},
            {'label': 'Garantia', 'value': 'Compra Garantida Mercado Livre'}
        ]

        # 8. ReviewContent updates:
        content = p.get('reviewContent', '')

        # Replace CTA section: remove Amazon button, keep single ML button with new URL
        cta_regex = r'<div class="au-camera-cta">.*?</div>'
        new_cta = '''<div class="au-camera-cta">
    <h2>Confira o modelo em destaque no Mercado Livre</h2>
    <p>
      Compare recursos, avaliações de compradores e garanta o melhor preço com segurança e envio rápido.
    </p>
    <a href="https://meli.la/2oyHyRX" target="_blank" rel="nofollow sponsored noopener" class="au-camera-button au-ml-button">
      Consultar Preço Atual no Mercado Livre →
    </a>
  </div>'''

        content = re.sub(cta_regex, new_cta, content, flags=re.DOTALL)

        # Remove au-amazon-button styles in CSS
        content = re.sub(r'\.au-amazon-button\s*\{[^}]*\}', '', content)
        content = re.sub(r'\.au-amazon-button:hover\s*\{[^}]*\}', '', content)

        # Style au-ml-button nicely
        content = content.replace(
            '.au-ml-button {  background: #ffe600;}',
            '.au-ml-button {  background: #ffe600; color: #1e293b !important; font-weight: 800; box-shadow: 0 4px 14px rgba(255, 230, 0, 0.35); transition: all 0.2s; }'
        )
        content = content.replace(
            '.au-ml-button:hover {  background: #e6cf00;}',
            '.au-ml-button:hover {  background: #f7df00; transform: translateY(-2px); box-shadow: 0 6px 20px rgba(255, 230, 0, 0.45); }'
        )

        # Update disclosure to remove Amazon mention
        content = content.replace(
            'Amazon e do Mercado Livre, sem custo adicional para você.',
            'Mercado Livre, sem custo adicional para você.'
        )

        # Also mention the featured model in the text
        if 'Anker Eufy E220' not in content:
            content = content.replace(
                '<h2>O que torna uma câmera pet com IA diferente?</h2>',
                '<h2>Modelo em Destaque: Câmera Anker Eufy E220 2K 360° com IA</h2>\n  <p>Entre os modelos mais bem avaliados no mercado, a <strong>Câmera de Segurança Anker Eufy E220 2K (3MP)</strong> destaca-se por reunir inteligência artificial integrada (capaz de diferenciar humanos e animais), rastreamento automático motorizado de 360 graus e imagem nítida com visão noturna, tudo sem exigir o pagamento de assinaturas mensais obrigatórias.</p>\n  <h2>O que torna uma câmera pet com IA diferente?</h2>'
            )

        p['reviewContent'] = content
        print('Successfully updated wp-3475!')

with open('data/products.json', 'w', encoding='utf-8') as f:
    json.dump(products, f, indent=2, ensure_ascii=False)
