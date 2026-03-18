#!/usr/bin/env python3
"""
Script to parse all model schemas from fal.ai
Fetches all models from the API and their OpenAPI schemas
"""

import json
import requests
import time
import re
import codecs
from typing import Dict, List, Any, Optional
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor, as_completed
import threading

def fetch_all_models() -> List[Dict[str, Any]]:
    """Fetch all models from fal.ai API with pagination"""
    all_models = []
    page = 1
    
    print("Fetching models from fal.ai API...")
    
    while True:
        url = f"https://fal.ai/api/models?page={page}"
        print(f"Fetching page {page}...")
        
        try:
            response = requests.get(url, timeout=30)
            response.raise_for_status()
            data = response.json()
            
            items = data.get('items', [])
            all_models.extend(items)
            
            total_pages = data.get('pages', 1)
            print(f"  Got {len(items)} models (page {page}/{total_pages})")
            
            if page >= total_pages:
                break
                
            page += 1
            time.sleep(0.5)  # Be nice to the API
            
        except Exception as e:
            print(f"Error fetching page {page}: {e}")
            break
    
    print(f"\nTotal models fetched: {len(all_models)}")
    return all_models

def fetch_openapi_schema(endpoint_id: str) -> Dict[str, Any]:
    """Fetch OpenAPI schema for a specific model"""
    url = f"https://fal.ai/api/openapi/queue/openapi.json?endpoint_id={endpoint_id}"
    
    try:
        response = requests.get(url, timeout=30)
        response.raise_for_status()
        return response.json()
    except Exception as e:
        print(f"  Error fetching schema for {endpoint_id}: {e}")
        return {}

def parse_input_schema(openapi_schema: Dict[str, Any]) -> Dict[str, Any]:
    """Extract input schema from OpenAPI spec"""
    try:
        components = openapi_schema.get('components', {})
        schemas = components.get('schemas', {})
        
        input_schema = None
        for schema_name, schema_def in schemas.items():
            if 'Input' in schema_name:
                input_schema = schema_def
                break
        
        if not input_schema:
            return {}
        
        properties = input_schema.get('properties', {})
        required = input_schema.get('required', [])
        
        parameters = {}
        for prop_name, prop_def in properties.items():
            param_info = {
                'type': prop_def.get('type'),
                'description': prop_def.get('description', ''),
                'required': prop_name in required,
            }
            
            if 'enum' in prop_def:
                param_info['enum'] = prop_def['enum']
            if 'minimum' in prop_def:
                param_info['minimum'] = prop_def['minimum']
            if 'maximum' in prop_def:
                param_info['maximum'] = prop_def['maximum']
            if 'minLength' in prop_def:
                param_info['minLength'] = prop_def['minLength']
            if 'maxLength' in prop_def:
                param_info['maxLength'] = prop_def['maxLength']
            if 'default' in prop_def:
                param_info['default'] = prop_def['default']
            if 'examples' in prop_def:
                param_info['examples'] = prop_def['examples']
            if 'items' in prop_def:
                param_info['items'] = prop_def['items']
            if 'properties' in prop_def:
                param_info['properties'] = prop_def['properties']
            
            parameters[prop_name] = param_info
        
        return parameters
    except Exception as e:
        print(f"  Error parsing input schema: {e}")
        return {}

def parse_output_schema(openapi_schema: Dict[str, Any]) -> Dict[str, Any]:
    """Extract output schema from OpenAPI spec"""
    try:
        components = openapi_schema.get('components', {})
        schemas = components.get('schemas', {})
        
        output_schema = None
        for schema_name, schema_def in schemas.items():
            if 'Output' in schema_name or 'Response' in schema_name:
                output_schema = schema_def
                break
        
        if not output_schema:
            return {}
        
        properties = output_schema.get('properties', {})
        
        outputs = {}
        for prop_name, prop_def in properties.items():
            output_info = {
                'type': prop_def.get('type'),
                'description': prop_def.get('description', ''),
            }
            
            if 'items' in prop_def:
                output_info['items'] = prop_def['items']
            if 'properties' in prop_def:
                output_info['properties'] = prop_def['properties']
            
            outputs[prop_name] = output_info
        
        return outputs
    except Exception as e:
        print(f"  Error parsing output schema: {e}")
        return {}

def extract_escaped_json_object(html: str, key: str) -> Optional[Dict[str, Any]]:
    """Extract an escaped JSON object from HTML by key using brace counting"""
    search_str = key + '\\":{' 
    idx = html.find(search_str)
    if idx == -1:
        search_str = '"' + key + '":{' 
        idx = html.find(search_str)
    
    if idx == -1:
        return None
    
    start = html.find('{', idx)
    if start == -1:
        return None
    
    depth = 0
    end = None
    for i in range(start, len(html)):
        if html[i] == '{':
            depth += 1
        elif html[i] == '}':
            depth -= 1
            if depth == 0:
                end = i + 1
                break
    
    if end is None:
        return None
    
    raw_obj = html[start:end]
    
    if '\\"' in raw_obj or '\\n' in raw_obj or '\\/' in raw_obj:
        try:
            unescaped = codecs.decode(raw_obj, 'unicode_escape')
        except Exception:
            unescaped = raw_obj.replace('\\"', '"').replace('\\/', '/')
    else:
        unescaped = raw_obj
    
    try:
        return json.loads(unescaped)
    except json.JSONDecodeError:
        return None

def extract_pricing(model_url: str) -> Optional[Dict[str, Any]]:
    """Extract pricing information from model page HTML"""
    try:
        response = requests.get(model_url, timeout=30)
        response.raise_for_status()
        html = response.text
        
        billing = extract_escaped_json_object(html, 'publicEndpointBilling')
        if not billing:
            billing = extract_escaped_json_object(html, 'endpointBilling')
        
        if billing and 'price' in billing and 'billing_unit' in billing:
            result = {
                'price': billing.get('price'),
                'billing_unit': billing.get('billing_unit'),
            }
            
            if 'provider_type' in billing:
                result['provider_type'] = billing['provider_type']
            if 'is_partner_api' in billing:
                result['is_partner_api'] = billing['is_partner_api']
            
            return result
        
        return None
    except Exception as e:
        return None

print_lock = threading.Lock()

def parse_single_model(model: Dict[str, Any], index: int, total: int) -> Optional[Dict[str, Any]]:
    """Parse a single model with its schema and pricing"""
    endpoint_id = model.get('id')
    if not endpoint_id:
        return None
    
    with print_lock:
        print(f"[{index}/{total}] Parsing {endpoint_id}...")
    
    openapi_schema = fetch_openapi_schema(endpoint_id)
    
    if not openapi_schema:
        with print_lock:
            print(f"  Skipping (no schema available)")
        return None
    
    metadata = openapi_schema.get('info', {}).get('x-fal-metadata', {})
    
    input_params = parse_input_schema(openapi_schema)
    output_params = parse_output_schema(openapi_schema)
    
    playground_url = metadata.get('playgroundUrl', '')
    pricing = None
    if playground_url:
        with print_lock:
            print(f"  Extracting pricing from {playground_url}...")
        pricing = extract_pricing(playground_url)
        if pricing:
            price = pricing.get('price')
            unit = pricing.get('billing_unit')
            with print_lock:
                print(f"  Found pricing: ${price}/{unit}")
    
    parsed_model = {
        'id': endpoint_id,
        'title': model.get('title', ''),
        'category': model.get('category', ''),
        'description': model.get('shortDescription', ''),
        'tags': model.get('tags', []),
        'thumbnailUrl': model.get('thumbnailUrl', ''),
        'playgroundUrl': playground_url,
        'documentationUrl': metadata.get('documentationUrl', ''),
        'licenseType': model.get('licenseType', ''),
        'deprecated': model.get('deprecated', False),
        'unlisted': model.get('unlisted', False),
        'pricing': pricing,
        'inputParameters': input_params,
        'outputParameters': output_params,
    }
    
    return parsed_model

def main():
    output_dir = Path(__file__).parent.parent / 'data'
    output_dir.mkdir(exist_ok=True)
    output_file = output_dir / 'fal_models_schemas.json'
    
    existing_models = []
    existing_ids = set()
    if output_file.exists():
        print("Loading existing parsed models...")
        with open(output_file, 'r', encoding='utf-8') as f:
            existing_models = json.load(f)
            existing_ids = {m['id'] for m in existing_models}
        print(f"Found {len(existing_models)} already parsed models")
    
    models = fetch_all_models()
    
    models_to_parse = [m for m in models if m.get('id') not in existing_ids]
    
    print(f"\nTotal models: {len(models)}")
    print(f"Already parsed: {len(existing_ids)}")
    print(f"Remaining to parse: {len(models_to_parse)}")
    
    if not models_to_parse:
        print("\nAll models already parsed!")
        return
    
    parsed_models = existing_models.copy()
    
    print(f"\nParsing remaining models with {10} workers...")
    
    with ThreadPoolExecutor(max_workers=10) as executor:
        future_to_model = {
            executor.submit(parse_single_model, model, len(existing_ids) + i + 1, len(models)): model
            for i, model in enumerate(models_to_parse)
        }
        
        for future in as_completed(future_to_model):
            try:
                result = future.result()
                if result:
                    parsed_models.append(result)
            except Exception as e:
                model = future_to_model[future]
                with print_lock:
                    print(f"Error parsing {model.get('id')}: {e}")
    
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(parsed_models, f, indent=2, ensure_ascii=False)
    
    print(f"\n✓ Successfully parsed {len(parsed_models)} models total")
    print(f"✓ Saved to: {output_file}")
    
    categories = {}
    for model in parsed_models:
        cat = model['category']
        categories[cat] = categories.get(cat, 0) + 1
    
    print("\nModels by category:")
    for cat, count in sorted(categories.items(), key=lambda x: -x[1]):
        print(f"  {cat}: {count}")

if __name__ == '__main__':
    main()
