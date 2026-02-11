---
title: OpenAI
source_url: https://runware.ai/docs/en/providers/openai
fetched_at: 2025-10-27 03:51:44
---

## [Introduction](#introduction)

OpenAI's AI models are integrated into the Runware platform through our unified API, providing access to **advanced video and image generation** technology across multiple generations of **Sora**, **DALL·E**, and the latest **GPT Image** models.

Through the `providerSettings.openai` object, you can access OpenAI's unique features such as **quality control**, **style selection**, and **background transparency options**, while maintaining the consistency of Runware's standard API structure. This page documents the **technical specifications, parameter requirements, and provider-specific settings** for all OpenAI models available through our platform, including **Sora 2** and **Sora 2 Pro**.

## [Image models](#image-models)

### [DALL·E 2](#dalle-2)

OpenAI's DALL·E 2 model generates photorealistic images from text prompts with support for complex compositions and foundational creative workflows.

**Model AIR ID**: `openai:2@2`.

**Supported workflows**: Text-to-image.

**Technical specifications**:

- Positive prompt: 1-1000 characters.
- Supported dimensions: 256×256, 512×512, 1024×1024.
- Quality: Standard only.

**Provider-specific settings**:

DALL·E 2 operates with fixed standard quality and does not support additional provider-specific customization options.

```
{
  "taskType": "imageInference",
  "taskUUID": "24cd5dff-cb81-4db5-8506-b72a9425f9d1",
  "model": "openai:2@2",
  "positivePrompt": "A photorealistic mountain landscape with a crystal clear lake reflecting the sunset",
  "width": 1024,
  "height": 1024
}
```

### [DALL·E 3](#dalle-3)

OpenAI's DALL·E 3 model delivers greatly improved prompt understanding and text rendering with higher coherence and better language comprehension for accurate compositions.

**Model AIR ID**: `openai:2@3`.

**Supported workflows**: Text-to-image.

**Technical specifications**:

- Positive prompt: 1-4000 characters.
- Supported dimensions: 1024×1024, 1792×1024, 1024×1792.
- Quality options: HD, standard.
- Style options: Vivid, natural.

**Provider-specific settings**:

Parameters supported: [`quality`](/docs/en/image-inference/api-reference#request-providersettings-openai-quality), [`style`](/docs/en/image-inference/api-reference#request-providersettings-openai-style).

HD quality

```
{
  "taskType": "imageInference",
  "taskUUID": "24cd5dff-cb81-4db5-8506-b72a9425f9d1",
  "model": "openai:2@3",
  "positivePrompt": "A detailed architectural illustration of a futuristic city with flying vehicles and green energy systems",
  "width": 1792,
  "height": 1024,
  "providerSettings": {
    "openai": {
      "quality": "hd",
      "style": "vivid"
    }
  }
}
```

 Natural style

```
{
  "taskType": "imageInference",
  "taskUUID": "b8c4d952-7f27-4a6e-bc9a-83f01d1c6d59",
  "model": "openai:2@3",
  "positivePrompt": "A realistic portrait of an elderly craftsman working with traditional woodworking tools",
  "width": 1024,
  "height": 1792,
  "providerSettings": {
    "openai": {
      "quality": "standard",
      "style": "natural"
    }
  }
}
```

### [GPT Image 1](#gpt-image-1)

OpenAI's GPT Image 1 model leverages GPT-4o architecture to deliver high-fidelity images with enhanced prompt following, superior text rendering, and advanced multimodal capabilities, including precise inpainting and image editing.

**Model AIR ID**: `openai:1@1`.

**Supported workflows**: Text-to-image.

**Technical specifications**:

- Positive prompt: 1-32000 characters.
- Supported dimensions: 1024×1024, 1536×1024, 1024×1536.
- Quality options: Auto (default), high, medium, low.
- Background options: Transparent, opaque.

GPT Image 1's extended prompt support (up to 32,000 characters) enables highly detailed descriptions and complex scene compositions that benefit from the model's advanced language understanding capabilities.

**Provider-specific settings**:

Parameters supported: [`quality`](/docs/en/image-inference/api-reference#request-providersettings-openai-quality), [`background`](/docs/en/image-inference/api-reference#request-providersettings-openai-background).

High quality

```
{
  "taskType": "imageInference",
  "taskUUID": "24cd5dff-cb81-4db5-8506-b72a9425f9d1",
  "model": "openai:1@1",
  "positivePrompt": "A professional product photograph of a minimalist watch on a clean white surface with subtle reflections and precise typography showing the brand name",
  "width": 1536,
  "height": 1024,
  "providerSettings": {
    "openai": {
      "quality": "high",
      "background": "opaque"
    }
  }
}
```

 Transparent background

```
{
  "taskType": "imageInference",
  "taskUUID": "b8c4d952-7f27-4a6e-bc9a-83f01d1c6d59",
  "model": "openai:1@1",
  "positivePrompt": "A detailed icon illustration of a smartphone with clean lines and modern design elements, suitable for app interface design",
  "width": 1024,
  "height": 1024,
  "providerSettings": {
    "openai": {
      "quality": "auto",
      "background": "transparent"
    }
  }
}
```

## [Video models](#video-models)

### [Sora 2](#sora-2)

OpenAI's next-generation video generation model, delivering more accurate physics simulation with synchronized dialogue and high-fidelity visuals.

**Model AIR ID**: `openai:3@1`.

**Supported workflows**: Text-to-video, image-to-video.

**Technical specifications**:

- Positive prompt: 1-4000 characters.
- Frame images: Supports first frame for `frameImages`.
- Supported dimensions: 1280×720 (16:9), 720×1280 (9:16).
- Duration: 4, 8, or 12 seconds.
- Input image requirements: Width and height between 300-2048 pixels, 20MB file size limit.

Text-to-video

```
{
  "taskType": "videoInference",
  "taskUUID": "f47ac10b-58cc-4372-a567-0e02b2c3d492",
  "model": "openai:3@1",
  "positivePrompt": "A person walking down a busy city street at sunset, realistic physics and natural movement",
  "duration": 8,
  "width": 1280,
  "height": 720
}
```

 Image-to-video

```
{
  "taskType": "videoInference",
  "taskUUID": "6ba7b831-9dad-11d1-80b4-00c04fd430c8",
  "model": "openai:3@1",
  "frameImages": ["c64351d5-4c59-42f7-95e1-eace013eddab"],
  "positivePrompt": "The scene comes alive with natural movement and realistic physics",
  "duration": 12,
  "width": 720,
  "height": 1280
}
```

### [Sora 2 Pro](#sora-2-pro)

Higher-quality variant of Sora 2 with additional resolution options, refined control, and better consistency for demanding professional use cases.

**Model AIR ID**: `openai:3@2`.

**Supported workflows**: Text-to-video, image-to-video.

**Technical specifications**:

- Positive prompt: 1-4000 characters.
- Frame images: Supports first frame for `frameImages`.
- Supported dimensions: 1280×720 (16:9), 720×1280 (9:16), 1792×1024 (7:4), 1024×1792 (4:7).
- Duration: 4, 8, or 12 seconds.
- Input image requirements: Width and height between 300-2048 pixels, 20MB file size limit.

Text-to-video

```
{
  "taskType": "videoInference",
  "taskUUID": "f47ac10b-58cc-4372-a567-0e02b2c3d493",
  "model": "openai:3@2",
  "positivePrompt": "Cinematic aerial shot of a coastal landscape with waves crashing against cliffs, photorealistic detail",
  "duration": 12,
  "width": 1792,
  "height": 1024
}
```

 Image-to-video

```
{
  "taskType": "videoInference",
  "taskUUID": "6ba7b832-9dad-11d1-80b4-00c04fd430c8",
  "model": "openai:3@2",
  "frameImages": ["c64351d5-4c59-42f7-95e1-eace013eddab"],
  "positivePrompt": "Smooth camera movement revealing the scene with cinematic quality",
  "duration": 8,
  "width": 1024,
  "height": 1792
}
```

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