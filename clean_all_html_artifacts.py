import json, re

with open('data/products.json', 'r', encoding='utf-8') as f:
    products = json.load(f)

cleaned_count = 0
for p in products:
    rc = p.get('reviewContent', '')
    original_rc = rc
    
    # Clean leading empty paragraph
    rc = re.sub(r'^\s*<p class="[^"]*wp-block-paragraph[^"]*"></p>\s*', '', rc)
    
    # Clean &#8220;`html or ```html or “`html
    rc = re.sub(r'(&#8220;|“|")\s*`*html\s*', '', rc, flags=re.IGNORECASE)
    rc = re.sub(r'^```html\s*', '', rc, flags=re.IGNORECASE)
    
    # Clean trailing &#8220; or &#8220 or ```
    rc = re.sub(r'\s*(&#8220;?|“|")\s*$', '', rc)
    rc = re.sub(r'\s*```\s*$', '', rc)
    
    if rc != original_rc:
        p['reviewContent'] = rc.strip()
        cleaned_count += 1

print(f'Cleaned {cleaned_count} posts!')

with open('data/products.json', 'w', encoding='utf-8') as f:
    json.dump(products, f, indent=2, ensure_ascii=False)
