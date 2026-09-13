import json

with open('data/products.json', 'r', encoding='utf-8') as f:
    products = json.load(f)

for p in products:
    if p['id'] == 'wp-3434':
        p['price'] = 261.00
        p['originalPrice'] = 399.90
        p['discountPercentage'] = 34
        p['installments'] = '12x de R$ 25,53'
        p['rating'] = 4.9
        p['reviewCount'] = 739
        p['isFull'] = True
        p['freeShipping'] = True
        print("Valores do Alimentador Velds atualizados com sucesso para R$ 261!")

with open('data/products.json', 'w', encoding='utf-8') as f:
    json.dump(products, f, indent=2, ensure_ascii=False)
