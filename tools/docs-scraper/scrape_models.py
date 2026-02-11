#!/usr/bin/env python3
"""
Model catalog scraper for Runware.ai and Fal.ai
Collects top and trending models from both platforms
"""

import argparse
import json
import time
from pathlib import Path
from typing import Dict, List

import requests
from bs4 import BeautifulSoup


def scrape_runware_models() -> List[Dict]:
    """Scrape Runware.ai featured models."""
    print("Scraping Runware.ai models...")
    
    url = "https://runware.ai/models"
    response = requests.get(url, headers={
        'User-Agent': 'Mozilla/5.0 (compatible; DocsScraper/1.0)'
    })
    response.raise_for_status()
    
    soup = BeautifulSoup(response.content, 'html.parser')
    models = []
    
    model_cards = soup.find_all('div', recursive=True)
    
    for card in model_cards:
        code_tag = card.find('code')
        if not code_tag:
            continue
        
        model_id = code_tag.get_text().strip()
        if not model_id or ':' not in model_id:
            continue
        
        img = card.find('img')
        links = card.find_all('a')
        divs = card.find_all('div')
        
        name = None
        description = None
        category = None
        usage_count = None
        
        for div in divs:
            text = div.get_text().strip()
            if text and len(text) > 10 and text not in ['Checkpoint', 'LoRA', 'IP-Adapter']:
                if 'Checkpoint' in text or 'LoRA' in text:
                    parts = text.split('\n')
                    if len(parts) >= 2:
                        category_usage = parts[0]
                        if 'Checkpoint' in category_usage:
                            category = 'Checkpoint'
                            usage_count = category_usage.replace('Checkpoint', '').strip()
                        elif 'LoRA' in category_usage:
                            category = 'LoRA'
                            usage_count = category_usage.replace('LoRA', '').strip()
                        
                        rest = '\n'.join(parts[1:])
                        for i, char in enumerate(rest):
                            if char.isupper() and i > 0 and rest[i-1].islower():
                                name = rest[:i]
                                description = rest[i:]
                                break
                        if not name:
                            name = rest[:50] if len(rest) > 50 else rest
                            description = rest
        
        if model_id and name:
            models.append({
                'model_id': model_id,
                'name': name.strip(),
                'description': description.strip() if description else '',
                'category': category or 'Unknown',
                'usage_count': usage_count or '0',
                'image_url': img['src'] if img and img.get('src') else None,
                'playground_url': links[0]['href'] if links and links[0].get('href') else None
            })
    
    print(f"Found {len(models)} Runware models")
    return models


def scrape_fal_models() -> List[Dict]:
    """Scrape Fal.ai trending models."""
    print("Scraping Fal.ai models...")
    
    url = "https://fal.ai/explore/search"
    response = requests.get(url, headers={
        'User-Agent': 'Mozilla/5.0 (compatible; DocsScraper/1.0)'
    })
    response.raise_for_status()
    
    soup = BeautifulSoup(response.content, 'html.parser')
    models = []
    
    model_links = soup.find_all('a', href=lambda x: x and x.startswith('/models/'))
    
    for link in model_links:
        href = link.get('href', '')
        if not href.startswith('/models/'):
            continue
        
        model_id = href.replace('/models/', '')
        
        divs = link.find_all('div')
        name = None
        category = None
        description = None
        tags = []
        
        for div in divs:
            text = div.get_text().strip()
            
            if not name and text and '/' in text:
                name = text.split('\n')[0].strip()
            
            if 'image-to-image' in text or 'text-to-image' in text or 'image-to-video' in text:
                category = text.strip()
            
            if len(text) > 50 and not category or text == category:
                continue
            elif len(text) > 50:
                description = text
        
        small_divs = link.find_all('div', class_=lambda x: x and 'tag' in str(x).lower())
        for div in small_divs:
            tag_text = div.get_text().strip()
            if tag_text and len(tag_text) < 30:
                tags.append(tag_text)
        
        if model_id and name:
            models.append({
                'model_id': model_id,
                'name': name,
                'description': description or '',
                'category': category or 'Unknown',
                'tags': tags,
                'url': f"https://fal.ai{href}",
                'openapi_url': f"https://fal.ai/api/openapi/queue/openapi.json?endpoint_id={model_id}"
            })
    
    print(f"Found {len(models)} Fal models")
    return models


def save_models_markdown(models: List[Dict], site: str, output_dir: Path):
    """Save models to markdown file."""
    output_file = output_dir / f"{site}-top-models.md"
    output_file.parent.mkdir(parents=True, exist_ok=True)
    
    markdown = f"""# {site.title()} Top Models

Last updated: {time.strftime('%Y-%m-%d %H:%M:%S')}

This document contains the top and trending models from {site.title()}.

"""
    
    if site == 'runware':
        markdown += """## Featured Models

These are the top-tier AI models featured on Runware.ai with exceptional quality and advanced capabilities.

"""
        for model in models:
            markdown += f"""### {model['name']}

**Model ID:** `{model['model_id']}`  
**Category:** {model['category']}  
**Usage Count:** {model['usage_count']}

{model['description']}

"""
            if model.get('playground_url'):
                markdown += f"[Launch in Playground]({model['playground_url']})\n\n"
            
            markdown += "---\n\n"
    
    elif site == 'fal':
        markdown += """## Trending Models

These are the trending and popular models on Fal.ai.

**Note:** For each model, you can get the complete configuration via OpenAPI JSON:
```
https://fal.ai/api/openapi/queue/openapi.json?endpoint_id={endpoint_id}
```

This is the simplest way to get all model settings, parameters, and schemas.

"""
        for model in models:
            markdown += f"""### {model['name']}

**Model ID:** `{model['model_id']}`  
**Category:** {model['category']}

{model['description']}

"""
            if model.get('tags'):
                markdown += f"**Tags:** {', '.join(model['tags'])}\n\n"
            
            if model.get('url'):
                markdown += f"[View Model]({model['url']})  \n"
            
            if model.get('openapi_url'):
                markdown += f"[OpenAPI Schema]({model['openapi_url']})\n\n"
            
            markdown += "---\n\n"
    
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(markdown)
    
    print(f"Saved models to: {output_file}")


def main():
    """Main entry point."""
    parser = argparse.ArgumentParser(
        description='Model catalog scraper for Runware.ai and Fal.ai'
    )
    parser.add_argument(
        'site',
        choices=['runware', 'fal', 'all'],
        help='Site to scrape models from'
    )
    parser.add_argument(
        '--output-dir',
        default='/home/ubuntu/repos/videosos/docs',
        help='Output directory for model files'
    )
    
    args = parser.parse_args()
    
    output_dir = Path(args.output_dir)
    
    if args.site in ['runware', 'all']:
        models = scrape_runware_models()
        save_models_markdown(models, 'runware', output_dir / 'runware' / 'models')
    
    if args.site in ['fal', 'all']:
        models = scrape_fal_models()
        save_models_markdown(models, 'fal', output_dir / 'fal' / 'models')


if __name__ == '__main__':
    main()
