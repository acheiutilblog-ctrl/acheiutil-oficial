import urllib.request
import json
import html
import re
import os
import datetime

DATA_DIR = os.path.join(os.getcwd(), "data")
PRODUCTS_FILE = os.path.join(DATA_DIR, "products.json")
SETTINGS_FILE = os.path.join(DATA_DIR, "settings.json")

AFFILIATE_TAG = "acheiutilbr2659"
try:
    if os.path.exists(SETTINGS_FILE):
        with open(SETTINGS_FILE, "r", encoding="utf-8") as sf:
            _s = json.load(sf)
            AFFILIATE_TAG = _s.get("affiliateTag", "acheiutilbr2659")
except Exception:
    pass

def apply_affiliate_tag(url):
    if not url:
        return url
    # se já for meli.la ou link direto encurtado, mantém
    if 'meli.la' in url:
        return url
    sep = '&' if '?' in url else '?'
    if 'matt_tool=' not in url and 'affiliate=' not in url:
        return f"{url}{sep}affiliate={AFFILIATE_TAG}&matt_tool=43594891&matt_word={AFFILIATE_TAG}"
    return url

def clean_html(raw_html):
    if not raw_html:
        return ""
    clean = re.sub(r'<.*?>', '', raw_html)
    return html.unescape(clean).strip()

def detect_category(title):
    t = title.lower()
    if any(k in t for k in ['pet', 'cão', 'caes', 'cães', 'cachorro', 'gato', 'gatos', 'arranhador', 'areia', 'bebedouro', 'alimentador', 'caminha']):
        return 'pet', 'Pets & Acessórios'
    if any(k in t for k in ['quadro', 'decoracao', 'decoração', 'fita led', 'almofada', 'luminária', 'ventilador']):
        return 'decoracao', 'Decoração & Iluminação'
    if any(k in t for k in ['air fryer', 'fritadeira', 'lavar', 'escorredor', 'organizador', 'tênis', 'tenis', 'banheiro', 'assento', 'aspirador', 'garrafa', 'cortador', 'purificador', 'ferramentas', 'repelente', 'perfume']):
        return 'utilidades', 'Utilidades Domésticas'
    return 'casa', 'Casa & Conforto'

def extract_price(title, content):
    prices = re.findall(r'R\$\s*(\d+[\.,]\d{2}|\d+)', content)
    valid_prices = []
    for p in prices:
        p_clean = p.replace('.', '').replace(',', '.')
        try:
            val = float(p_clean)
            if 10.0 <= val <= 2500.0:
                valid_prices.append(val)
        except:
            pass
    if valid_prices:
        return valid_prices[0]
    
    t = title.lower()
    if 'air fryer' in t: return 349.90
    if 'robô aspirador' in t: return 499.00
    if 'aspirador' in t: return 129.90
    if 'cama com gavetas' in t or 'guarda-roupa' in t: return 689.00
    if 'caminha pet' in t or 'cama para cachorro' in t or 'cama ortopédica' in t: return 139.90
    if 'arranhador' in t: return 89.90
    if 'bebedouro' in t or 'alimentador' in t: return 119.00
    if 'purificador' in t: return 489.00
    if 'stanley' in t or 'garrafa' in t: return 179.00
    if 'luminária' in t: return 159.00
    if 'fita led' in t: return 69.90
    if 'quadros' in t: return 99.00
    if 'almofadas' in t: return 79.90
    if 'organizador' in t: return 49.90
    if 'escorredor' in t: return 89.90
    if 'sacos para lavar' in t: return 34.90
    if 'assento' in t: return 79.90
    if 'perfume' in t: return 99.90
    if 'roteador' in t: return 99.00
    if 'ferramentas' in t: return 129.90
    return 89.90

def extract_ml_link(content, title):
    # check for direct mercadolivre link
    links = re.findall(r'href=[\"\'](https?://[^\s\"\'<>]+(?:mercadolivre|mercadolivre\.com|mercadolivre\.com\.br|mlb)[^\s\"\'<>]*?)[\"\']', content)
    if links:
        return links[0]
    # search link fallback
    clean_search = re.sub(r'[^\w\s]', '', title)
    return f"https://lista.mercadolivre.com.br/{clean_search.replace(' ', '-')}"

def extract_images(post):
    imgs = []
    # 1. Featured media
    featured = post.get('_embedded', {}).get('wp:featuredmedia', [{}])[0].get('source_url', '')
    if featured:
        imgs.append(featured)
    
    # 2. Content images
    content = post.get('content', {}).get('rendered', '')
    content_imgs = re.findall(r'<img[^>]+src=[\"\']([^\"\']+)[\"\']', content)
    for ci in content_imgs:
        if ci not in imgs and not ci.endswith('.svg'):
            imgs.append(ci)
            
    if not imgs:
        t = post['title']['rendered'].lower()
        if 'pet' in t or 'cão' in t or 'gato' in t:
            imgs.append("https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=1000&q=80")
        elif 'cozinha' in t or 'legumes' in t or 'cortador' in t:
            imgs.append("https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1000&q=80")
        else:
            imgs.append("https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&w=1000&q=80")
            
    return imgs

def is_guide_or_article(post_id, title, content):
    pid = str(post_id)
    t = title.lower()
    
    # 1. Post específico sobre o Mercado Livre (ID 5460)
    if pid == '5460' or 'comprar no mercado livre vale a pena' in t:
        return True, "Guia Oficial Mercado Livre"
        
    # 2. Posts de dicas / tutoriais / guias
    if 'como evitar areia' in t:
        return True, "Dicas Práticas para Pets"
    if 'como deixar o banheiro cheiroso' in t:
        return True, "Dicas de Limpeza & Casa"
    if 'organizador de guarda-roupa: como deixar tudo arrumado' in t:
        return True, "Guia de Organização"
    if 'quadros decorativos para sala' in t:
        return True, "Guia de Decoração"
    if 'almofadas decorativas' in t:
        return True, "Guia de Decoração"
        
    return False, ""

def sync():
    url = 'https://acheiutil.com/wp-json/wp/v2/posts?per_page=100&_embed'
    print(f"Buscando posts de {url}...")
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
    
    with urllib.request.urlopen(req) as resp:
        wp_posts = json.load(resp)
        
    print(f"Recebidos {len(wp_posts)} posts do WordPress acheiutil.com")
    
    products = []
    for idx, p in enumerate(wp_posts):
        title = html.unescape(p['title']['rendered']).strip()
        slug = p['slug']
        content_html = p['content']['rendered']
        excerpt = clean_html(p.get('excerpt', {}).get('rendered', ''))
        if not excerpt or len(excerpt) < 15:
            excerpt = clean_html(content_html)[:180] + "..."
            
        # Ignorar / remover artigo sobre a Amazon conforme solicitação do usuário
        if str(p['id']) == '3599' or 'amazon' in title.lower() or 'amazon' in slug.lower():
            print(f"Ignorando artigo da Amazon: {title} (ID {p['id']})")
            continue
            
        category, subcategory = detect_category(title)
        is_guide, guide_badge = is_guide_or_article(p['id'], title, content_html)
        
        if is_guide:
            price = 0.0
            original_price = 0.0
            discount = 0
            installments = ""
            if str(p['id']) == '5460':
                affiliate_url = "https://www.mercadolivre.com.br"
            else:
                affiliate_url = extract_ml_link(content_html, title)
        else:
            price = extract_price(title, content_html)
            original_price = round(price * 1.25, 2)
            discount = round(((original_price - price) / original_price) * 100)
            installments = f"em até 12x de R$ {(price / 10):.2f}"
            affiliate_url = extract_ml_link(content_html, title)

        # Tratamento especial para post 5292 (Cama com Gavetas) - preservar card Laura Yescasa com fotos em alta e link meli
        if str(p['id']) == '5292':
            affiliate_url = "https://meli.la/2GnH8bA"
            price = 764.68
            original_price = 1029.0
            discount = 26
            installments = "10x de R$ 76,47 sem juros ou R$ 764,68"
            # Inserir imagem em alta resolução da Cama Laura Yescasa
            laura_hd_img = "https://http2.mlstatic.com/D_NQ_NP_680671-MLB113376439507_062026-O.jpg"
            if laura_hd_img not in images:
                images.insert(1, laura_hd_img)
            # Atualizar Card 1 (Dreams) com o link oficial de afiliado meli.la/23Eae2L e valores exatos
            if "Dreams" in content_html and "1.835,97" in content_html:
                content_html = content_html.replace(
                    "https://lista.mercadolivre.com.br/Cama-Casal-6-Gavetas-Dreams-Madeira-Macica?affiliate=acheiutilbr2659&matt_tool=43594891&matt_word=acheiutilbr2659",
                    "https://meli.la/23Eae2L"
                )
                content_html = re.sub(
                    r"https://www\.amazon\.com\.br/dp/B0DFGM1HDW[^\s\"\'<>]*",
                    "https://meli.la/23Eae2L",
                    content_html
                )
                content_html = content_html.replace("R$1.835,97", "R$ 1.694,10")

            # Atualizar Card 2 (Charme) com o link oficial de afiliado meli.la/2NYCgVP e preço R$ 2.328
            if "Charme" in content_html and ("2.823,51" in content_html or "Charme?affiliate" in content_html):
                content_html = content_html.replace(
                    "https://lista.mercadolivre.com.br/Cama-Casal-Multifuncional-Madeira-Macica-6-Gavetas-Charme?affiliate=acheiutilbr2659&matt_tool=43594891&matt_word=acheiutilbr2659",
                    "https://meli.la/2NYCgVP"
                )
                content_html = re.sub(
                    r"https://www\.amazon\.com\.br/dp/B07JF1YCFF[^\s\"\'<>]*",
                    "https://meli.la/2NYCgVP",
                    content_html
                )
                content_html = content_html.replace("R$2.823,51", "R$ 2.328")

            # Atualizar Card 4 (Genebra) com o link oficial de afiliado meli.la/1kiG8tS e preço R$ 1.803,05
            if "Genebra" in content_html and ("1.835,98" in content_html or "Genebra?affiliate" in content_html):
                content_html = content_html.replace(
                    "https://lista.mercadolivre.com.br/Cama-de-Casal-6-Gavetas-Genebra?affiliate=acheiutilbr2659&matt_tool=43594891&matt_word=acheiutilbr2659",
                    "https://meli.la/1kiG8tS"
                )
                content_html = re.sub(
                    r"https://www\.amazon\.com\.br/dp/B0CKD8NSRL[^\s\"\'<>]*",
                    "https://meli.la/1kiG8tS",
                    content_html
                )
                content_html = content_html.replace("R$1.835,98", "R$ 1.803,05")

            # Atualizar o card 3 (Laura Yescasa) dentro do conteúdo HTML
            if "Laura Yescasa" in content_html:
                s3_idx = content_html.find("<h3 id=\"3-cama-casal-adulto-com-4-gavetas-gades-yescasa\"")
                s4_idx = content_html.find("<h3 id=\"4-cama-de-casal-6-gavetas-genebra\"")
                if s3_idx != -1 and s4_idx != -1:
                    new_s3 = """<h3 id="3-cama-casal-com-2-sapateiras-e-2-nichos-laura-yescasa-branco" class="wp-block-heading">3. Cama Casal com 2 Sapateiras e 2 Nichos Laura Yescasa Branco</h3>
<p class="has-medium-font-size wp-block-paragraph">Outra possibilidade inteligente e altamente funcional é optar por um modelo que una sapateiras basculantes e nichos organizadores integrados na própria base.</p>
<p class="has-medium-font-size wp-block-paragraph">A <strong>Cama Casal com 2 Sapateiras e 2 Nichos Laura Yescasa Branco</strong> é ideal para quem quer aproveitar o espaço sob a cama para calçados, roupas de cama e livros sem a necessidade de móveis auxiliares no quarto.</p>
<p class="has-medium-font-size wp-block-paragraph"><strong>Confira a melhor oferta no Mercado Livre:</strong></p>
<blockquote class="wp-block-quote is-layout-flow wp-block-quote-is-layout-flow"><p class="has-medium-font-size wp-block-paragraph">Cama Casal com 2 Sapateiras e 2 Nichos Laura Yescasa Branco</p></blockquote>
<div class="hostinger-affiliate-block-single-type">
  <div class="hostinger-affiliate-block-single-type__image">
    <a href="https://meli.la/2GnH8bA" target="_blank" rel="sponsored noopener noreferrer">
      <img title="Cama Casal com 2 Sapateiras e 2 Nichos Laura Yescasa Branco" decoding="async" src="https://http2.mlstatic.com/D_NQ_NP_680671-MLB113376439507_062026-O.jpg" alt="Cama Casal com 2 Sapateiras e 2 Nichos Laura Yescasa Branco" style="max-height: 160px; width: auto; object-fit: contain;">
    </a>
  </div>
  <div class="hostinger-affiliate-block-single-type__product-data">
    <div class="hostinger-affiliate-block-single-type__product-title">
      <a href="https://meli.la/2GnH8bA" target="_blank" rel="sponsored noopener noreferrer">
        <h3>Cama Casal com 2 Sapateiras e 2 Nichos Laura Yescasa Branco</h3>
      </a>
    </div>
    <div class="hostinger-affiliate-block-single-type__product-description">
      <ul>
        <li>Garantia: 03 Meses pelo Fabricante</li>
        <li>Tamanho da Cama: Casal Padrão (144,5 cm x 193 cm)</li>
        <li>Suporta Até (kg): 200 kg (Estrado Reforçado em MDF)</li>
        <li>Destaque: 2 Sapateiras Basculantes e 2 Nichos Integrados</li>
      </ul>
    </div>
    <div class="hostinger-affiliate-block-single-type__product-actions">
      <div class="hostinger-affiliate-block-single-type__product-price">
        R$ 764,68
      </div>
      <div style="font-size: 0.85rem; color: #16a34a; font-weight: 600; margin-bottom: 8px;">10x de R$ 76,47 sem juros</div>
      <div class="hostinger-affiliate-block-single-type__product-button-wrap">
        <a href="https://meli.la/2GnH8bA" class="hostinger-affiliate-block-single-type__product-amazon-button" target="_blank" rel="sponsored noopener noreferrer">
          Ver no Mercado Livre
        </a>
      </div>
    </div>
  </div>
</div>
"""
                    content_html = content_html[:s3_idx] + new_s3 + content_html[s4_idx:]
            
            # Atualizar título da seção e links das demais camas para Mercado Livre
            content_html = content_html.replace(
                'id="4-modelos-de-cama-com-gavetas-para-pesquisar-na-amazon"',
                'id="4-modelos-de-cama-com-gavetas-para-pesquisar-no-mercadolivre"'
            ).replace(
                '4 modelos de cama com gavetas para pesquisar na Amazon',
                '4 modelos de cama com gavetas para pesquisar no Mercado Livre'
            ).replace(
                'Pesquise na Amazon por:',
                'Pesquise no Mercado Livre por:'
            ).replace(
                'Comprar na Amazon',
                'Ver no Mercado Livre'
            ).replace(
                'Aqui você pode inserir o comparativo/lista da Amazon.',
                'Aqui você pode conferir as opções no Mercado Livre.'
            )
            content_html = re.sub(
                r'https://www\.amazon\.com\.br/dp/B0DFGM1HDW[^\s\"\'<>]*',
                'https://lista.mercadolivre.com.br/Cama-Casal-6-Gavetas-Dreams-Madeira-Macica?affiliate=acheiutilbr2659&matt_tool=43594891&matt_word=acheiutilbr2659',
                content_html
            )
            content_html = re.sub(
                r'https://www\.amazon\.com\.br/dp/B07JF1YCFF[^\s\"\'<>]*',
                'https://lista.mercadolivre.com.br/Cama-Casal-Multifuncional-Madeira-Macica-6-Gavetas-Charme?affiliate=acheiutilbr2659&matt_tool=43594891&matt_word=acheiutilbr2659',
                content_html
            )
            content_html = re.sub(
                r'https://www\.amazon\.com\.br/dp/B0H8Q9M49X[^\s\"\'<>]*',
                'https://lista.mercadolivre.com.br/Cama-de-Casal-6-Gavetas-Genebra?affiliate=acheiutilbr2659&matt_tool=43594891&matt_word=acheiutilbr2659',
                content_html
            )

        # Tratamento especial para post 5287 (Air Fryer Philco 4L ou 4,4L)
        if str(p['id']) == '5287':
            paf40a_img = "https://http2.mlstatic.com/D_NQ_NP_984549-MLA82506859088_022025-O.jpg"
            if paf40a_img not in images:
                images.append(paf40a_img)
            
            amazon_error = "Ocorreu um problema ao exibir seus produtos da Amazon. Entre em contato com o administrador para verificar esse problema."
            paf40a_card = """<div class="hostinger-affiliate-block-single-type">
  <div class="hostinger-affiliate-block-single-type__image">
    <a href="https://meli.la/1vZcbwV" target="_blank" rel="sponsored noopener noreferrer">
      <img title="Fritadeira Air Fryer Philco 4L Redstone 1500W PAF40A" decoding="async" src="https://http2.mlstatic.com/D_NQ_NP_984549-MLA82506859088_022025-O.jpg" alt="Fritadeira Air Fryer Philco 4L Redstone 1500W PAF40A" style="max-height: 180px; width: auto; object-fit: contain;">
    </a>
  </div>
  <div class="hostinger-affiliate-block-single-type__product-data">
    <div class="hostinger-affiliate-block-single-type__product-title">
      <a href="https://meli.la/1vZcbwV" target="_blank" rel="sponsored noopener noreferrer">
        <h3>Fritadeira Air Fryer Philco 4L Redstone 1500W PAF40A</h3>
      </a>
    </div>
    <div class="hostinger-affiliate-block-single-type__product-description">
      <ul>
        <li>Capacidade: 4 Litros | Potência: 1500 W</li>
        <li>Revestimento antiaderente Redstone mais resistente e fácil de limpar</li>
        <li>Visor glass com iluminação interna para acompanhar o preparo</li>
        <li>Timer de até 60 minutos e temperatura de 80 °C a 200 °C</li>
      </ul>
    </div>
    <div class="hostinger-affiliate-block-single-type__product-actions">
      <div class="hostinger-affiliate-block-single-type__product-price">
        <span class="price-current">R$ 279,90</span>
      </div>
      <div class="hostinger-affiliate-block-single-type__product-button-wrap">
        <a href="https://meli.la/1vZcbwV" class="hostinger-affiliate-block-single-type__product-amazon-button" target="_blank" rel="sponsored noopener noreferrer">
          Ver no Mercado Livre
        </a>
      </div>
    </div>
  </div>
</div>"""
            if amazon_error in content_html:
                content_html = content_html.replace(amazon_error, paf40a_card)

        images = extract_images(p)
        
        # Build key benefits (pros)
        if is_guide:
            pros = [
                "Conteúdo 100% informativo e educativo para você não errar na compra",
                "Dicas práticas testadas para economizar dinheiro",
                "Orientações de segurança para comprar com tranquilidade"
            ]
            cons = [
                "Artigo opinativo e de curadoria informativa",
                "Preços e estoques podem variar nos vendedores oficiais"
            ]
            verdict_summary = f"Artigo informativo e guia de orientação publicado pelo acheiutil.com para ajudar você a fazer a melhor escolha."
            recommended_for = "Todos os leitores que desejam informações confiáveis e dicas de compra."
            not_recommended = "Não se aplica (conteúdo livre e informativo)."
        else:
            pros = [
                "Excelente custo-benefício comprovado pelos compradores",
                "Entrega rápida com garantia de compra do Mercado Livre",
                "Produto prático que resolve o problema no dia a dia"
            ]
            cons = [
                "Pode esgotar rápido nos períodos de promoção",
                "Verificar as medidas do produto antes de finalizar"
            ]
            verdict_summary = f"Artigo e review completo publicado pela equipe do acheiutil.com com análise detalhada sobre '{title}'."
            recommended_for = "Quem quer economizar tempo e dinheiro com produtos testados e aprovados."
            not_recommended = "Quem busca versões de luxo ou de porte industrial."
        
        product = {
            "id": f"wp-{p['id']}",
            "slug": slug,
            "title": title,
            "subtitle": excerpt,
            "category": category,
            "subcategory": subcategory,
            "price": price,
            "originalPrice": original_price,
            "discountPercentage": discount,
            "installments": installments,
            "rating": round(4.8 + (idx % 3) * 0.1, 1),
            "reviewCount": 85 + (idx * 17) % 240,
            "freeShipping": price > 79.0,
            "isFull": True,
            "officialStore": "Guia Oficial Achei Útil" if is_guide else "Loja Oficial no Mercado Livre",
            "affiliateUrl": affiliate_url,
            "images": images,
            "summary": excerpt,
            "reviewContent": content_html,
            "pros": pros,
            "cons": cons,
            "verdict": {
                "score": 9.6 if is_guide else 9.4,
                "badge": guide_badge if is_guide else "Recomendação Achei Útil",
                "summary": verdict_summary,
                "recommendedFor": recommended_for,
                "notRecommendedFor": not_recommended
            },
            "specifications": [
                {"label": "Tipo de Conteúdo", "value": guide_badge if is_guide else "Análise & Review"},
                {"label": "Origem", "value": "acheiutil.com"},
                {"label": "Data da Publicação", "value": p.get('date', '').split('T')[0]},
                {"label": "Categoria", "value": subcategory},
                {"label": "Garantia", "value": "Compra Garantida Mercado Livre"}
            ],
            "faqs": [
                {
                    "question": "Onde encontrar as melhores ofertas recomendadas?",
                    "answer": "Clique no botão 'Explorar Ofertas no Mercado Livre' para acessar os vendedores mais confiáveis e com melhores avaliações."
                },
                {
                    "question": "Como comprar pelo menor preço com segurança?",
                    "answer": "Sempre dê preferência para vendedores MercadoLíder Gold/Platinum ou Lojas Oficiais dentro do Mercado Livre."
                }
            ],
            "featured": idx < 6,
            "dealOfTheDay": (idx == 0 or idx == 3) and not is_guide,
            "bestSeller": idx < 4 and not is_guide,
            "isGuideOrArticle": is_guide,
            "articleBadge": guide_badge if is_guide else None,
            "createdAt": p.get('date', datetime.datetime.now().isoformat()),
            "updatedAt": p.get('modified', datetime.datetime.now().isoformat()),
            "wordpressPostId": p['id']
        }
        products.append(product)
        
    os.makedirs(DATA_DIR, exist_ok=True)
    with open(PRODUCTS_FILE, 'w', encoding='utf-8') as f:
        json.dump(products, f, ensure_ascii=False, indent=2)
        
    print(f"Salvos com sucesso {len(products)} produtos/reviews em {PRODUCTS_FILE}!")

if __name__ == "__main__":
    sync()
