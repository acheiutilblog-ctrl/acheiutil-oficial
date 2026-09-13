import json, re

with open('data/products.json', 'r', encoding='utf-8') as f:
    products = json.load(f)

for p in products:
    if p['id'] == 'wp-3460':
        # 1. Price according to the image: R$ 407,99 / 8x R$ 51 sem juros
        p['price'] = 407.99
        p['originalPrice'] = 407.99
        p['discountPercentage'] = 0
        p['installments'] = '8x de R$ 51,00 sem juros'
        p['freeShipping'] = True
        p['isFull'] = False

        # 2. Affiliate link: https://meli.la/1MPRC88
        p['affiliateUrl'] = 'https://meli.la/1MPRC88'

        # 3. Clean html txt from reviewContent
        rc = p.get('reviewContent', '')
        
        # Remove empty paragraph at start
        rc = re.sub(r'^\s*<p class="has-medium-font-size wp-block-paragraph"></p>\s*', '', rc)
        
        # Remove &#8220;`html or “`html or ```html
        rc = re.sub(r'(&#8220;|“|")\s*`*html\s*', '', rc, flags=re.IGNORECASE)
        rc = re.sub(r'^```html\s*', '', rc, flags=re.IGNORECASE)
        
        # Remove trailing &#8220 or “ or ```
        rc = re.sub(r'\s*(&#8220;|“|")\s*$', '', rc)
        rc = re.sub(r'\s*```\s*$', '', rc)

        # Ensure CTA link is the affiliate link: https://meli.la/1MPRC88
        rc = re.sub(r'href="https://www\.mercadolivre\.com\.br/[^"]+"', 'href="https://meli.la/1MPRC88"', rc)
        rc = re.sub(r'href="https://lista\.mercadolivre\.com\.br/[^"]+"', 'href="https://meli.la/1MPRC88"', rc)
        
        p['reviewContent'] = rc
        print("wp-3460 atualizado com sucesso!")
        print("Preço:", p['price'])
        print("Parcelamento:", p['installments'])
        print("Link:", p['affiliateUrl'])
        print("Início do reviewContent:", repr(p['reviewContent'][:150]))
        print("Fim do reviewContent:", repr(p['reviewContent'][-100:]))

with open('data/products.json', 'w', encoding='utf-8') as f:
    json.dump(products, f, indent=2, ensure_ascii=False)
