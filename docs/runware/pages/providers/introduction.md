---
title: Model providers
source_url: https://runware.ai/docs/en/providers/introduction
fetched_at: 2025-10-27 03:51:39
---

## [Introduction](#introduction)

Runware integrates with **leading AI model providers** to offer you access to the best available models for image and video generation. Rather than managing multiple APIs and different authentication systems, our **unified platform** abstracts these complexities while preserving each provider's unique capabilities.

We support models through two integration approaches: **open source models** running on our own infrastructure, and **closed source models** accessed through external provider APIs. This hybrid approach ensures you get optimal performance and pricing while accessing the latest innovations from both the open source community and commercial providers.

## [How provider integrations work](#how-provider-integrations-work)

All models, regardless of provider, use the same core API structure you're familiar with from our platform. Common parameters like `width`, `height`, `seed`, `duration`, `fps`, and `includeCost` work consistently across all providers, making it easy to switch between models or test different options.

When providers offer unique capabilities that don't fit our standard parameters, we expose them through **provider-specific settings**. These appear in a `providerSettings` object within your request, organized by provider name.

```
{
  "taskType": "videoInference",
  "model": "google:3@0",
  "positivePrompt": "a cat playing with yarn",
  "duration": 8,
  "width": 1280,
  "height": 720,
  "providerSettings": {
    "google": {
      "enhancePrompt": true,
      "generateAudio": true
    }
  }
}
```

This design preserves the simplicity of our unified API while **giving you access to provider-specific features** when you need them. You can use the same basic parameters for quick testing, then add provider settings for advanced control.

## [Provider abstractions and limitations](#provider-abstractions-and-limitations)

While our unified API normalizes most parameters across providers, each integration has specific capabilities and constraints. These may include:

- **Supported generation modes**: Not all providers support every workflow (text-to-image, image-to-video, etc).
- **Parameter ranges**: Image aspect ratios, video resolution and durations options, and other technical specifications vary.
- **Input requirements**: While formats are standardized, providers may impose different limits on resolution, file size, or other requirements depending on the model or workflow.
- **Feature availability**: Advanced capabilities like audio generation, motion controls, or style effects are provider-specific.

When switching between providers, always check the provider-specific documentation to ensure your parameters and workflows are supported.

## [Getting started](#getting-started)

Each provider page includes detailed documentation of their specific capabilities, parameter options, and usage examples. Start with the provider that best matches your immediate needs, then explore others as your requirements evolve.

For general API usage and authentication, see our [introduction](/docs/en/getting-started/introduction) page. For workflow-specific details, visit the [image inference](/docs/en/image-inference/introduction) and [video inference](/docs/en/video-inference/introduction) introduction pages.

Ask AI

×

Context: Full page

Include URL of the page

Copy context

AI Provider

Claude

ChatGPT

Mistral

Bing

What would you like to ask?

Ask AI

Send feedback

×

Context: Full page

Email address

Your feedback

Send Feedback

On this page

On this page