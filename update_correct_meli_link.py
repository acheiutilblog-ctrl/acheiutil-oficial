import json, re

with open('data/products.json', 'r', encoding='utf-8') as f:
    products = json.load(f)

for p in products:
    if p['id'] == 'wp-3460':
        # 1. Update affiliateUrl
        p['affiliateUrl'] = 'https://meli.la/12YpT12'
        p['price'] = 407.99
        p['originalPrice'] = 407.99
        p['discountPercentage'] = 0
        p['installments'] = '8x de R$ 51,00 sem juros'
        p['freeShipping'] = True

        # 2. Update all links in reviewContent
        rc = p.get('reviewContent', '')
        rc = re.sub(r'href="https://meli\.la/[^"]+"', 'href="https://meli.la/12YpT12"', rc)
        rc = re.sub(r'href="https://www\.mercadolivre\.com\.br/[^"]+"', 'href="https://meli.la/12YpT12"', rc)
        rc = re.sub(r'href="https://lista\.mercadolivre\.com\.br/[^"]+"', 'href="https://meli.la/12YpT12"', rc)
        p['reviewContent'] = rc

        print("Atualizado com sucesso!")
        print("Novo link:", p['affiliateUrl'])
        print("Preço mantido em:", p['price'])
        print("Parcelas:", p['installments'])

with open('data/products.json', 'w', encoding='utf-8') as f:
    json.dump(products, f, indent=2, ensure_ascii=False)
