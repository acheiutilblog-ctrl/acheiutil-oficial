import json

with open('data/products.json', 'r', encoding='utf-8') as f:
    products = json.load(f)

for p in products:
    if p['id'] == 'wp-3475':
        # PRESERVAR TOTALMENTE O LINK DE AFILIADO
        assert p['affiliateUrl'] == 'https://meli.la/2oyHyRX', f"Link inesperado: {p['affiliateUrl']}"
        
        # Corrigir somente os valores conforme o print do Mercado Livre:
        p['price'] = 369.00
        p['originalPrice'] = 879.00
        p['discountPercentage'] = 58
        p['installments'] = '7x de R$ 52,71 sem juros'
        p['rating'] = 4.9
        p['reviewCount'] = 170
        print("Valores corrigidos mantendo exatamente o link de afiliado:", p['affiliateUrl'])

with open('data/products.json', 'w', encoding='utf-8') as f:
    json.dump(products, f, indent=2, ensure_ascii=False)
