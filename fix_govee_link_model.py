import json

with open('data/products.json', 'r', encoding='utf-8') as f:
    products = json.load(f)

for p in products:
    if p['id'] == 'wp-3460':
        # Definir o link exatamente como o usuário enviou
        target_link = 'https://www.mercadolivre.com.br/fita-de-led-govee-rgbic-basic-wifi-bluetooth-10m-alexa-220v/up/MLBU5112892795?offer_type=BEST_INSTALLMENTS#wid=MLB5205132387&sid=search'
        p['affiliateUrl'] = target_link
        
        # Nome exato do modelo conforme o anúncio enviado
        p['specifications'] = [
            {'label': 'Modelo', 'value': 'Fita de LED Govee RGBIC Basic Wi-Fi Bluetooth 10m Alexa 220V'},
            {'label': 'Comprimento', 'value': '10 Metros'},
            {'label': 'Tecnologia', 'value': 'RGBIC (Cores simultâneas por segmento)'},
            {'label': 'Conectividade', 'value': 'Wi-Fi e Bluetooth (Govee Home App)'},
            {'label': 'Comando de Voz', 'value': 'Amazon Alexa e Google Assistant'},
            {'label': 'Voltagem', 'value': '220V'},
            {'label': 'Sincronização Musical', 'value': 'Sim, com microfone integrado'},
            {'label': 'Garantia', 'value': 'Compra Garantida Mercado Livre'}
        ]

        # Atualizar reviewContent com o link exato
        content = p.get('reviewContent', '')
        content = content.replace('https://meli.la/1MPRC88', target_link)
        content = content.replace('H618C', '')
        content = content.replace('Modelo H618C', '')
        content = content.replace('(H618C)', '')
        p['reviewContent'] = content

        print('Post wp-3460 atualizado com o link e modelo exatos!')

with open('data/products.json', 'w', encoding='utf-8') as f:
    json.dump(products, f, indent=2, ensure_ascii=False)
