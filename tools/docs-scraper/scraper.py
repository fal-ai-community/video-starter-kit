#!/usr/bin/env python3
"""
Documentation Scraper for Runware.ai and Fal.ai
A semi-automated tool for collecting and structuring complete documentation
with support for incremental updates.
"""

import argparse
import json
import os
import re
import sys
import time
import hashlib
from pathlib import Path
from typing import Dict, List, Optional, Set, Tuple
from urllib.parse import urljoin, urlparse

import requests
import yaml
from bs4 import BeautifulSoup
from markdownify import markdownify as md


class DocsScraper:
    """Main documentation scraper class."""
    
    def __init__(self, config_path: str, repo_root: str = None):
        """Initialize scraper with configuration."""
        self.config = self._load_config(config_path)
        self.repo_root = Path(repo_root or os.getcwd())
        self.manifest_path = self.repo_root / self.config['manifest_file']
        self.manifest = self._load_manifest()
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (compatible; DocsScraper/1.0)'
        })
        
    def _load_config(self, config_path: str) -> Dict:
        """Load configuration from YAML file."""
        with open(config_path, 'r') as f:
            return yaml.safe_load(f)
    
    def _load_manifest(self) -> Dict:
        """Load manifest file or create new one."""
        if self.manifest_path.exists():
            with open(self.manifest_path, 'r') as f:
                return json.load(f)
        return {
            'urls': {},
            'last_updated': None
        }
    
    def _save_manifest(self):
        """Save manifest to file."""
        self.manifest['last_updated'] = time.strftime('%Y-%m-%d %H:%M:%S')
        self.manifest_path.parent.mkdir(parents=True, exist_ok=True)
        with open(self.manifest_path, 'w') as f:
            json.dump(self.manifest, f, indent=2)
    
    def _compute_hash(self, content: str) -> str:
        """Compute SHA256 hash of content."""
        return hashlib.sha256(content.encode()).hexdigest()
    
    def _should_update(self, url: str, etag: str = None, 
                      last_modified: str = None, content_hash: str = None) -> bool:
        """Check if URL should be updated based on manifest."""
        if url not in self.manifest['urls']:
            return True
        
        entry = self.manifest['urls'][url]
        
        if self.config.get('check_etag') and etag:
            if entry.get('etag') != etag:
                return True
        
        if self.config.get('check_last_modified') and last_modified:
            if entry.get('last_modified') != last_modified:
                return True
        
        if content_hash and entry.get('content_hash') != content_hash:
            return True
        
        return False
    
    def discover_urls(self) -> List[str]:
        """Discover all documentation URLs based on discovery method."""
        method = self.config['discovery_method']
        
        if method == 'sitemap':
            return self._discover_from_sitemap()
        elif method == 'sidebar':
            return self._discover_from_sidebar()
        else:
            raise ValueError(f"Unknown discovery method: {method}")
    
    def _discover_from_sitemap(self) -> List[str]:
        """Discover URLs from sitemap."""
        print(f"Fetching sitemap from {self.config['sitemap_url']}")
        response = self.session.get(self.config['sitemap_url'])
        response.raise_for_status()
        
        soup = BeautifulSoup(response.content, 'xml')
        urls = []
        
        for loc in soup.find_all('loc'):
            url = loc.text.strip()
            if self.config.get('locale_filter'):
                if self.config['locale_filter'] in url:
                    urls.append(url)
            else:
                urls.append(url)
        
        print(f"Found {len(urls)} URLs in sitemap")
        return urls
    
    def _discover_from_sidebar(self) -> List[str]:
        """Discover URLs from sidebar navigation."""
        print(f"Fetching sidebar from {self.config['docs_base_url']}")
        response = self.session.get(self.config['docs_base_url'])
        response.raise_for_status()
        
        soup = BeautifulSoup(response.content, 'html.parser')
        nav = soup.select_one(self.config['nav_selector'])
        
        if not nav:
            raise ValueError("Could not find navigation sidebar")
        
        urls = []
        for link in nav.find_all('a', href=True):
            href = link['href']
            if href.startswith('/'):
                url = urljoin(self.config['base_url'], href)
            elif href.startswith('http'):
                url = href
            else:
                continue
            
            if self.config.get('locale_filter'):
                if self.config['locale_filter'] in url:
                    urls.append(url)
            else:
                urls.append(url)
        
        print(f"Found {len(urls)} URLs in sidebar")
        return list(set(urls))
    
    def fetch_page(self, url: str) -> Tuple[Optional[str], Dict]:
        """Fetch page content and metadata."""
        print(f"Fetching: {url}")
        
        try:
            response = self.session.get(url, timeout=30)
            response.raise_for_status()
            
            metadata = {
                'etag': response.headers.get('ETag'),
                'last_modified': response.headers.get('Last-Modified'),
                'content_hash': self._compute_hash(response.text)
            }
            
            return response.text, metadata
        except Exception as e:
            print(f"Error fetching {url}: {e}")
            return None, {}
    
    def extract_content(self, html: str, url: str) -> Dict:
        """Extract main content from HTML."""
        soup = BeautifulSoup(html, 'html.parser')
        
        title = None
        h1 = soup.find('h1')
        if h1:
            title = h1.get_text().strip()
        else:
            title_tag = soup.find('title')
            if title_tag:
                title = title_tag.get_text().strip()
        
        content_selector = self.config.get('content_selector', 'main')
        content = soup.select_one(content_selector)
        
        if not content:
            print(f"Warning: Could not find content with selector '{content_selector}'")
            content = soup.find('body')
        
        for element in content.select('script, style, nav, header, footer, .search, button[aria-label*="Copy"]'):
            element.decompose()
        
        return {
            'title': title or 'Untitled',
            'content': content,
            'url': url
        }
    
    def convert_to_markdown(self, content_data: Dict) -> str:
        """Convert HTML content to Markdown."""
        content = content_data['content']
        
        markdown = md(str(content), heading_style='ATX', bullets='-')
        
        markdown = re.sub(r'\n{3,}', '\n\n', markdown)  # Remove excessive newlines
        markdown = markdown.strip()
        
        frontmatter = f"""---
title: {content_data['title']}
source_url: {content_data['url']}
fetched_at: {time.strftime('%Y-%m-%d %H:%M:%S')}
---

"""
        
        return frontmatter + markdown
    
    def rewrite_links(self, markdown: str, url: str) -> str:
        """Rewrite internal links to local paths."""
        return markdown
    
    def url_to_filepath(self, url: str) -> Path:
        """Convert URL to local file path."""
        parsed = urlparse(url)
        path = parsed.path
        
        if self.config.get('locale_filter'):
            path = path.replace(self.config['locale_filter'], '')
        
        path = path.strip('/')
        
        if not path:
            path = 'index'
        
        if not path.endswith('.md'):
            path = path + '.md'
        
        return self.repo_root / self.config['pages_dir'] / path
    
    def save_page(self, url: str, markdown: str):
        """Save page to file."""
        filepath = self.url_to_filepath(url)
        filepath.parent.mkdir(parents=True, exist_ok=True)
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(markdown)
        
        print(f"Saved: {filepath}")
    
    def scrape_documentation(self, force: bool = False):
        """Scrape all documentation pages."""
        urls = self.discover_urls()
        
        print(f"\nScraping {len(urls)} pages...")
        print("=" * 60)
        
        for i, url in enumerate(urls, 1):
            print(f"\n[{i}/{len(urls)}]", end=" ")
            
            html, metadata = self.fetch_page(url)
            if not html:
                continue
            
            if not force and not self._should_update(url, **metadata):
                print(f"Skipping (unchanged): {url}")
                continue
            
            content_data = self.extract_content(html, url)
            markdown = self.convert_to_markdown(content_data)
            markdown = self.rewrite_links(markdown, url)
            
            self.save_page(url, markdown)
            
            self.manifest['urls'][url] = {
                'filepath': str(self.url_to_filepath(url)),
                'title': content_data['title'],
                **metadata
            }
            
            time.sleep(0.5)
        
        self._save_manifest()
        print(f"\n{'=' * 60}")
        print(f"Scraping complete! Saved {len(urls)} pages.")
    
    def scrape_models(self):
        """Scrape model catalog."""
        print(f"\nScraping models from {self.config['models_url']}")
        print("=" * 60)
        
        response = self.session.get(self.config['models_url'])
        response.raise_for_status()
        
        soup = BeautifulSoup(response.content, 'html.parser')
        
        models = []
        
        
        print(f"Found {len(models)} models")
        
        models_file = self.repo_root / self.config['models_dir'] / f"{self.config['site_name']}-top-models.md"
        models_file.parent.mkdir(parents=True, exist_ok=True)
        
        markdown = f"""# {self.config['site_name'].title()} Top Models

Last updated: {time.strftime('%Y-%m-%d %H:%M:%S')}

This document contains the top and trending models from {self.config['site_name'].title()}.

"""
        
        for model in models:
            markdown += f"## {model.get('name', 'Unknown')}\n\n"
            markdown += f"{model.get('description', '')}\n\n"
        
        with open(models_file, 'w', encoding='utf-8') as f:
            f.write(markdown)
        
        print(f"Saved models to: {models_file}")
    
    def generate_toc(self):
        """Generate table of contents."""
        print(f"\nGenerating TOC...")
        
        toc_file = self.repo_root / self.config['toc_file']
        toc_file.parent.mkdir(parents=True, exist_ok=True)
        
        toc = f"""# {self.config['site_name'].title()} Documentation

Last updated: {time.strftime('%Y-%m-%d %H:%M:%S')}


"""
        
        for url, data in sorted(self.manifest['urls'].items()):
            title = data.get('title', 'Untitled')
            filepath = data.get('filepath', '')
            toc += f"- [{title}]({filepath})\n"
        
        with open(toc_file, 'w', encoding='utf-8') as f:
            f.write(toc)
        
        print(f"Generated TOC: {toc_file}")


def main():
    """Main entry point."""
    parser = argparse.ArgumentParser(
        description='Documentation scraper for Runware.ai and Fal.ai'
    )
    parser.add_argument(
        'command',
        choices=['fetch', 'models', 'toc', 'all'],
        help='Command to execute'
    )
    parser.add_argument(
        'site',
        choices=['runware', 'fal'],
        help='Site to scrape'
    )
    parser.add_argument(
        '--force',
        action='store_true',
        help='Force update all pages'
    )
    parser.add_argument(
        '--repo-root',
        default='/home/ubuntu/repos/videosos',
        help='Repository root path'
    )
    
    args = parser.parse_args()
    
    config_file = f"config_{args.site}.yml"
    config_path = Path(__file__).parent / config_file
    
    if not config_path.exists():
        print(f"Error: Configuration file not found: {config_path}")
        sys.exit(1)
    
    scraper = DocsScraper(str(config_path), args.repo_root)
    
    if args.command == 'fetch':
        scraper.scrape_documentation(force=args.force)
    elif args.command == 'models':
        scraper.scrape_models()
    elif args.command == 'toc':
        scraper.generate_toc()
    elif args.command == 'all':
        scraper.scrape_documentation(force=args.force)
        scraper.scrape_models()
        scraper.generate_toc()


if __name__ == '__main__':
    main()
