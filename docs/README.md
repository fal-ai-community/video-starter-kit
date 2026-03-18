# VideoSOS AI Platform Documentation

This directory contains complete, structured documentation for the AI platforms integrated with VideoSOS:

- **Runware.ai** - Complete API documentation and model catalog
- **Fal.ai** - Complete Model APIs documentation and trending models

## Directory Structure

```
docs/
├── README.md                    # This file
├── runware/
│   ├── TOC.md                  # Table of contents
│   ├── pages/                  # Documentation pages (44 pages)
│   │   ├── getting-started/
│   │   ├── image-inference/
│   │   ├── video-inference/
│   │   ├── audio-inference/
│   │   ├── libraries/
│   │   ├── providers/
│   │   ├── tools/
│   │   └── utilities/
│   └── models/
│       └── runware-top-models.md  # Featured models catalog (44 models)
└── fal/
    ├── TOC.md                  # Table of contents
    ├── pages/                  # Documentation pages (30 pages)
    │   ├── authentication/
    │   ├── guides/
    │   ├── integrations/
    │   ├── model-endpoints/
    │   └── real-time/
    └── models/
        └── fal-top-models.md   # Trending models catalog (11 models)
```

## Documentation Contents

### Runware.ai Documentation

Complete documentation for Runware's AI media generation API, including:

- **Getting Started** - Introduction, authentication, and connection guides
- **Image Inference** - Text-to-image, image-to-image, inpainting, outpainting, FLUX tools
- **Video Inference** - Video generation capabilities and API reference
- **Audio Inference** - Audio generation features
- **Libraries** - JavaScript, Python, ComfyUI, Vercel AI integrations
- **Providers** - Integration guides for BFL, Bria, OpenAI, ByteDance, Google, Ideogram, KlingAI, Lightricks, MiniMax, PixVerse, Sourceful, Vidu
- **Tools** - Background removal, upscaling, captioning, ControlNet preprocessing, image masking, prompt enhancement
- **Utilities** - Account management, task responses, image upload, model search

**Model Catalog:** 44 featured models including FLUX variants, Imagen, Ideogram, Qwen-Image, Seedream, and more.

### Fal.ai Documentation

Complete documentation for Fal.ai's Model APIs platform, including:

- **Introduction** - Overview of 600+ generative media models
- **Authentication** - Key-based and GitHub authentication methods
- **Guides** - Tutorials for image generation, video generation, speech-to-text, LLMs, custom workflows
- **Model Endpoints** - Queue, webhooks, synchronous requests, WebSockets, server-side integration, workflows
- **Client Libraries** - SDK documentation for various languages
- **Integrations** - Next.js and Vercel integration guides
- **Real-Time** - Real-time generation capabilities and API secrets management
- **Reference** - Error handling and FAQ

**Model Catalog:** 11 trending models including FLUX Kontext, Wan Effects, Veo 2, Kling Video, Recraft V3, and more.

## Fal.ai OpenAPI Schemas

For Fal.ai models, the **simplest way to get complete model configuration** is through OpenAPI JSON:

```
https://fal.ai/api/openapi/queue/openapi.json?endpoint_id={endpoint_id}
```

This provides:
- Complete input/output schemas
- Required and optional parameters
- Data types and validation rules
- Example requests and responses

Example for FLUX Kontext:
```
https://fal.ai/api/openapi/queue/openapi.json?endpoint_id=fal-ai/flux-pro/kontext
```

## Updating Documentation

The documentation is maintained using a semi-automated scraper system located in `tools/docs-scraper/`.

### Prerequisites

```bash
cd tools/docs-scraper
pip install -r requirements.txt
```

### Update Documentation

To update documentation when platforms release new content:

```bash
# Update Runware.ai documentation
python3 scraper.py fetch runware

# Update Fal.ai documentation
python3 scraper.py fetch fal

# Update both
python3 scraper.py fetch runware && python3 scraper.py fetch fal
```

The scraper uses incremental updates by default, only fetching changed pages. To force update all pages:

```bash
python3 scraper.py fetch runware --force
python3 scraper.py fetch fal --force
```

### Update Model Catalogs

To update the model catalogs when new models are released:

```bash
# Update Runware.ai models
python3 scrape_models.py runware

# Update Fal.ai models
python3 scrape_models.py fal

# Update both
python3 scrape_models.py all
```

### Generate Table of Contents

After updating documentation, regenerate the TOC files:

```bash
# Generate Runware TOC
python3 scraper.py toc runware

# Generate Fal TOC
python3 scraper.py toc fal
```

### Complete Update Workflow

To perform a complete documentation update:

```bash
cd tools/docs-scraper

# 1. Update all documentation
python3 scraper.py fetch runware
python3 scraper.py fetch fal

# 2. Update model catalogs
python3 scrape_models.py all

# 3. Regenerate TOCs
python3 scraper.py toc runware
python3 scraper.py toc fal

# 4. Commit changes
cd ../..
git add docs/
git commit -m "Update AI platform documentation"
```

## Scraper Configuration

The scraper system is configured via YAML files in `tools/docs-scraper/`:

- `config_runware.yml` - Runware.ai scraper configuration
- `config_fal.yml` - Fal.ai scraper configuration

Configuration includes:
- Site URLs and sitemaps
- Content selectors for HTML parsing
- Discovery methods (sitemap, sidebar, BFS)
- Output paths and file structure
- Incremental update settings (ETag, Last-Modified, content hashing)

## Manifest Files

The scraper maintains manifest files to track scraped pages and enable incremental updates:

- `tools/docs-scraper/manifest_runware.json` - Runware.ai page tracking
- `tools/docs-scraper/manifest_fal.json` - Fal.ai page tracking

Manifests store:
- URL to file path mappings
- Page titles
- ETags and Last-Modified headers
- Content hashes for change detection
- Last update timestamps

## Documentation Format

All documentation pages are stored as Markdown files with YAML frontmatter:

```markdown
---
title: Page Title
source_url: https://original-url.com/page
fetched_at: 2025-10-27 03:51:21
---

# Page Content

Documentation content in Markdown format...
```

This format preserves:
- Original page titles
- Source URLs for reference
- Fetch timestamps for tracking
- Clean, readable Markdown content
- Code blocks with syntax highlighting
- Tables, lists, and formatting

## Usage in VideoSOS

This documentation serves as a local reference for:

1. **Model Selection** - Browse available models and their capabilities
2. **API Integration** - Reference API endpoints and parameters
3. **Feature Implementation** - Understand how to use specific features
4. **Troubleshooting** - Look up error codes and solutions
5. **Updates** - Track new models and features as they're released

The documentation is particularly useful when:
- Adding new AI models to VideoSOS
- Implementing new generation features
- Debugging API integration issues
- Understanding model parameters and options
- Keeping VideoSOS up-to-date with latest AI capabilities

## Maintenance Schedule

Recommended update frequency:

- **Weekly** - Check for new trending models on Fal.ai
- **Bi-weekly** - Update Runware.ai featured models
- **Monthly** - Full documentation refresh for both platforms
- **As needed** - When major platform updates are announced

## Notes

- All documentation is fetched directly from official sources
- Links to external resources are preserved
- Code examples are included with proper syntax highlighting
- Images and assets reference original URLs
- The scraper respects rate limits and robots.txt
- Incremental updates minimize bandwidth and processing time

## Support

For issues with the documentation scraper or updates:

1. Check the manifest files for error messages
2. Verify configuration files are correct
3. Ensure network connectivity to platform sites
4. Review scraper logs for specific errors
5. Test with `--force` flag to bypass incremental updates

## License

This documentation is collected from publicly available sources:
- Runware.ai documentation: https://runware.ai/docs
- Fal.ai documentation: https://docs.fal.ai

Please refer to the original platforms for their respective terms of service and licensing.
