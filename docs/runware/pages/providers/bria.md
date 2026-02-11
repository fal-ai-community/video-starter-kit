---
title: Bria
source_url: https://runware.ai/docs/en/providers/bria
fetched_at: 2025-10-27 03:51:40
---

## [Introduction](#introduction)

Bria's AI models are integrated into the Runware platform through our unified API, providing access to **commercial-ready generative AI** trained exclusively on licensed data. Bria specializes in enterprise-safe AI solutions with built-in content moderation, IP protection, and transparency controls designed for professional production environments.

Through the `providerSettings.bria` object, you can access Bria's unique features such as **prompt enhancement**, **content moderation** or **IP signal detection**, while maintaining the consistency of Runware's standard API structure. This page documents the **technical specifications, parameter requirements, and provider-specific settings** for all Bria models available through our platform.

## [Image models](#image-models)

`providerSettings` » `bria` [bria](https://runware.ai/docs/en/image-inference/api-reference#request-providersettings-bria) object
:   Configuration object for Bria-specific features and controls. Bria models offer enterprise-safe AI with built-in content moderation, IP protection, and licensed training data for commercial use.

      View example 

    ```
    {
      "taskType": "imageInference",
      "taskUUID": "a770f077-f413-47de-9dac-be0b26a35da6",
      "positivePrompt": "Professional product photography",
      "model": "bria:10@1",
      "width": 1024,
      "height": 1024,
      "providerSettings": {
        "bria": {
          "promptEnhancement": true,
          "enhanceImage": true,
          "contentModeration": true,
          "ipSignal": true
        }
      }
    }
    ```

       Properties
    ⁨6⁩ properties 

    `providerSettings` » `bria` » `promptEnhancement` [promptEnhancement](https://runware.ai/docs/en/image-inference/api-reference#request-providersettings-bria-promptenhancement) boolean Default: false
    :   Enhances the input prompt with descriptive variations and additional details for more creative and varied outputs. When enabled, the system expands the prompt while maintaining the original intent.

    `providerSettings` » `bria` » `medium` [medium](https://runware.ai/docs/en/image-inference/api-reference#request-providersettings-bria-medium) "photography" | "art"
    :   Specifies the artistic medium or style category for generation, influencing the overall aesthetic and rendering approach.

        **Available values:**

        - `photography`: Optimizes for photorealistic imagery with natural lighting and textures.
        - `art`: Optimizes for artistic interpretations with stylized rendering and creative expression.

    `providerSettings` » `bria` » `enhanceImage` [enhanceImage](https://runware.ai/docs/en/image-inference/api-reference#request-providersettings-bria-enhanceimage) boolean Default: false
    :   Generates images with richer details and sharper textures by applying additional enhancement processing to the output. This improves overall visual quality and clarity.

    `providerSettings` » `bria` » `promptContentModeration` [promptContentModeration](https://runware.ai/docs/en/image-inference/api-reference#request-providersettings-bria-promptcontentmoderation) boolean Default: true
    :   Scans the input prompt for NSFW or restricted terms before generation begins. When enabled, requests with flagged content are rejected before processing to ensure safe commercial use.

    `providerSettings` » `bria` » `contentModeration` [contentModeration](https://runware.ai/docs/en/image-inference/api-reference#request-providersettings-bria-contentmoderation) boolean Default: true
    :   Applies content moderation to both input visuals and generated outputs, ensuring all content meets safety standards for commercial use. Flagged content results in request rejection.

    `providerSettings` » `bria` » `ipSignal` [ipSignal](https://runware.ai/docs/en/image-inference/api-reference#request-providersettings-bria-ipsignal) boolean Default: false
    :   Flags potential intellectual property-related content in the prompt or generated output. When enabled, helps identify potential IP conflicts before commercial use.

### [Bria 3.2](#bria-32)

Commercial-ready text-to-image model with improved aesthetics, strong prompt alignment, and superior short-text rendering, trained exclusively on licensed data for safe commercial use.

**Model AIR ID**: `bria:10@1`.

**Supported workflows**: Text-to-image.

**Technical specifications**:

- Positive prompt: 2-3000 characters.
- Negative prompt: 2-3000 characters (optional).
- Supported dimensions: 1024×1024 (1:1), 832×1216 (2:3), 1216×832 (3:2), 896×1152 (3:4), 1152×896 (4:3), 896×1088 (4:5), 1088×896 (5:4), 768×1344 (9:16), 1344×768 (16:9).
- Steps: 4-10 (default: 8).
- ControlNet models: Supports Bria ControlNet via [`controlnet`](/docs/en/image-inference/api-reference#request-controlnet) parameter. Available models: `bria:10@10` (Canny), `bria:10@11` (Depth), `bria:10@12` (Recoloring), `bria:10@13` (Color Grid).
- IP Adapter: Supports Bria IP Adapter via [`ipAdapter`](/docs/en/image-inference/api-reference#request-ipadapter) parameter. Available models: `bria:10@20` (Regular), `bria:10@21` (Style).

**Provider-specific settings**:

Parameters supported: [`promptEnhancement`](/docs/en/image-inference/api-reference#request-providersettings-bria-promptenhancement), [`enhanceImage`](/docs/en/image-inference/api-reference#request-providersettings-bria-enhanceimage), [`medium`](/docs/en/image-inference/api-reference#request-providersettings-bria-medium), [`promptContentModeration`](/docs/en/image-inference/api-reference#request-providersettings-bria-promptcontentmoderation), [`contentModeration`](/docs/en/image-inference/api-reference#request-providersettings-bria-contentmoderation), [`ipSignal`](/docs/en/image-inference/api-reference#request-providersettings-bria-ipsignal).

Text-to-image

```
{
  "taskType": "imageInference",
  "taskUUID": "f47ac10b-58cc-4372-a567-0e02b2c3d492",
  "model": "bria:10@1",
  "positivePrompt": "Professional product photography of a luxury watch on marble surface",
  "width": 1024,
  "height": 1024,
  "steps": 8,
  "providerSettings": {
    "bria": {
      "promptEnhancement": true,
      "enhanceImage": true,
      "medium": "photography",
      "contentModeration": true
    }
  }
}
```

 With ControlNet Canny

```
{
  "taskType": "imageInference",
  "taskUUID": "6ba7b831-9dad-11d1-80b4-00c04fd430c8",
  "model": "bria:10@1",
  "positivePrompt": "Modern architectural building with clean lines",
  "width": 1152,
  "height": 896,
  "controlnet": [
    {
      "model": "bria:10@10",
      "weight": 0.8,
      "guideImage": "c64351d5-4c59-42f7-95e1-eace013eddab"
    }
  ],
  "providerSettings": {
    "bria": {
      "contentModeration": true
    }
  }
}
```

 With style IP Adapter

```
{
  "taskType": "imageInference",
  "taskUUID": "550e8400-e29b-41d4-a716-446655440012",
  "model": "bria:10@1",
  "positivePrompt": "Portrait in the same style and lighting",
  "width": 1024,
  "height": 1024,
  "ipAdapters": [
    {
      "model": "bria:10@21",
      "weight": 0.75,
      "guideImage": "c64351d5-4c59-42f7-95e1-eace013eddab"
    }
  ],
  "providerSettings": {
    "bria": {
      "ipSignal": true,
      "contentModeration": true
    }
  }
}
```

## [Background removal models](#background-removal-models)

### [Bria Video Background Removal](#bria-video-background-removal)

Removes complex or moving video backgrounds in real time, isolating subjects with clean alpha channels for seamless compositing and transparency effects.

**Model AIR ID**: `bria:51@1`.

**Supported workflows**: Background removal.

**Technical specifications**:

- Input video: Supports `inputs.video` (required).
- Input video requirements: Maximum duration 30 seconds, maximum resolution 16000×16000 pixels.
- Background color: Configurable via [`settings.rgba`](/docs/en/tools/remove-background#request-settings-rgba) parameter. Accepts RGBA color arrays (default: `[0, 0, 0, 0]` for transparent). Common presets: Black `[0, 0, 0, 1]`, White `[255, 255, 255, 1]`, Gray `[128, 128, 128, 1]`, Red `[255, 0, 0, 1]`, Green `[0, 255, 0, 1]`, Blue `[0, 0, 255, 1]`, Yellow `[255, 255, 0, 1]`, Cyan `[0, 255, 255, 1]`, Magenta `[255, 0, 255, 1]`, Orange `[255, 165, 0, 1]`.

Transparent background

```
{
  "taskType": "removeBackground",
  "taskUUID": "f47ac10b-58cc-4372-a567-0e02b2c3d494",
  "model": "bria:51@1",
  "inputMedia": "c64351d5-4c59-42f7-95e1-eace013eddab"
}
```

 Solid color background

```
{
  "taskType": "removeBackground",
  "taskUUID": "6ba7b833-9dad-11d1-80b4-00c04fd430c8",
  "model": "bria:51@1",
  "inputMedia": "c64351d5-4c59-42f7-95e1-eace013eddab",
  "settings": {
    "rgba": [0, 255, 0, 1],
  }
}
```

## [Upscaling models](#upscaling-models)

`providerSettings` » `bria` [bria](https://runware.ai/docs/en/tools/upscale#request-providersettings-bria) object
:   Configuration object for Bria-specific upscaling settings. These parameters control how Bria upscaling models handle transparency and image processing.

      View example 

    ```
    {
      "taskType": "upscale",
      "taskUUID": "a770f077-f413-47de-9dac-be0b26a35da6",
      "inputs": {
        "image": "c64351d5-4c59-42f7-95e1-eace013eddab",
      },
      "model": "bria:52@1",
      "upscaleFactor": 4,
      "providerSettings": {
        "bria": {
          "preserveAlpha": true
        }
      }
    }
    ```

       Properties
    ⁨1⁩ property 

    `providerSettings` » `bria` » `preserveAlpha` [preserveAlpha](https://runware.ai/docs/en/tools/upscale#request-providersettings-bria-preservealpha) boolean Default: true
    :   Controls whether to preserve the original transparency (alpha channel) of the input image during upscaling. When disabled, the output becomes fully opaque.

        This parameter only takes effect when the input image contains an alpha channel. Images without transparency are unaffected by this setting.

### [Bria Image Increase Resolution](#bria-image-increase-resolution)

Specialized upscaling model that enhances image resolution 2× or 4× while preserving original detail and integrity with support for alpha channel preservation.

**Model AIR ID**: `bria:52@1`.

**Supported workflows**: Image upscaling.

**Technical specifications**:

- Input image: Supports `inputs.image` (required).
- Upscale factor: 2 or 4 (default: 2).
- Maximum output resolution: 8192×8192 pixels.
- Input image requirements: Width and height between 300-2048 pixels, 20MB file size limit.

**Provider-specific settings**:

Parameters supported: [`preserveAlpha`](/docs/en/tools/upscale#request-providersettings-bria-preservealpha).

2× upscaling

```
{
  "taskType": "upscale",
  "taskUUID": "f47ac10b-58cc-4372-a567-0e02b2c3d493",
  "model": "bria:52@1",
  "inputImage": "c64351d5-4c59-42f7-95e1-eace013eddab",
  "upscaleFactor": 2
}
```

 4× upscaling preserving alpha channel

```
{
  "taskType": "upscale",
  "taskUUID": "6ba7b832-9dad-11d1-80b4-00c04fd430c8",
  "model": "bria:52@1",
  "inputImage": "c64351d5-4c59-42f7-95e1-eace013eddab",
  "upscaleFactor": 4,
  "providerSettings": {
    "bria": {
      "preserveAlpha": true
    }
  }
}
```

### [Bria Video Increase Resolution](#bria-video-increase-resolution)

Upscales video resolution by 2× or 4× while preserving detail and quality, supporting multiple output formats and codecs for professional video workflows.

**Model AIR ID**: `bria:50@1`.

**Supported workflows**: Video upscaling.

**Technical specifications**:

- Input video: Supports `inputs.image` (required).
- Upscale factor: 2 or 4 (default: 2).
- Maximum output resolution: 7680×4320 (8K).
- Input video requirements: Maximum 30 seconds duration.

2× upscaling

```
{
  "taskType": "upscale",
  "taskUUID": "f47ac10b-58cc-4372-a567-0e02b2c3d495",
  "model": "bria:50@1",
  "inputMedia": "https://example.com/video.mp4",
  "upscaleFactor": 2
}
```

 4× upscaling

```
{
  "taskType": "upscale",
  "taskUUID": "6ba7b834-9dad-11d1-80b4-00c04fd430c8",
  "model": "bria:50@1",
  "inputMedia": "https://example.com/video.mp4",
  "upscaleFactor": 4
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