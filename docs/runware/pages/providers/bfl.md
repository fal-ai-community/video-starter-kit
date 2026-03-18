---
title: Black Forest Labs
source_url: https://runware.ai/docs/en/providers/bfl
fetched_at: 2025-10-27 03:51:37
---

## [Introduction](#introduction)

Black Forest Labs' AI models are integrated into the Runware platform through our unified API, providing access to **advanced image generation** technology through the professional FLUX model family.

Black Forest Labs, founded by the creators of Stable Diffusion, offers commercial-grade FLUX models that deliver superior prompt adherence, visual quality, and specialized capabilities for professional workflows. Through the `providerSettings.bfl` object, you can access unique features such as **prompt upsampling**, **raw output modes**, and **adjustable safety tolerance**, while maintaining the consistency of Runware's standard API structure. This page documents the **technical specifications, parameter requirements, and provider-specific settings** for all Black Forest Labs models available through our platform.

[providerSettings](https://runware.ai/docs/en/image-inference/api-reference#request-providersettings) object
:   Contains provider-specific configuration settings that customize the behavior of different AI models and services. Each provider has its own set of parameters that control various aspects of the generation process.

    The `providerSettings` parameter is an object that contains nested objects for each supported provider.

      View example 

    ```
    {
      "taskType": "imageInference",
      "taskUUID": "991e641a-d2a8-4aa3-9883-9d6fe230fff8",
      "positivePrompt": "a beautiful landscape with mountains",
      "model": "bfl:2@2",
      "providerSettings": { 
        "bfl": { 
          "promptUpsampling": true,
          "safetyTolerance": 4,
          "raw": false
        } 
      } 
    }
    ```

       Properties
    ⁨1⁩ property 

    `providerSettings` » `bfl` [bfl](https://runware.ai/docs/en/image-inference/api-reference#request-providersettings-bfl) object
    :   Configuration object for Black Forest Labs (BFL) specific features. BFL models offer advanced prompt processing and content safety controls.

          View example 

        ```
        {
          "taskType": "imageInference",
          "taskUUID": "a770f077-f413-47de-9dac-be0b26a35da6",
          "positivePrompt": "a beautiful landscape at sunset",
          "model": "bfl:1@1",
          "width": 1024,
          "height": 1024,
          "providerSettings": {
            "bfl": {
              "promptUpsampling": true,
              "safetyTolerance": 6
            }
          }
        }
        ```

           Properties
        ⁨3⁩ properties 

        `providerSettings` » `bfl` » `promptUpsampling` [promptUpsampling](https://runware.ai/docs/en/image-inference/api-reference#request-providersettings-bfl-promptupsampling) boolean Default: false
        :   Enables automatic enhancement and expansion of the input prompt to improve generation quality and detail.

            When enabled, BFL's prompt upsampling system analyzes your text description and adds relevant details and descriptive elements that enhance the final output without changing the core intent of your prompt.

        `providerSettings` » `bfl` » `safetyTolerance` [safetyTolerance](https://runware.ai/docs/en/image-inference/api-reference#request-providersettings-bfl-safetytolerance) integer Min: 0 Max: 6 Default: 2
        :   Controls the tolerance level for input and output content moderation. Lower values apply stricter content filtering, while higher values are more permissive. Range from 0 (most strict) to 6 (least strict).

        `providerSettings` » `bfl` » `raw` [raw](https://runware.ai/docs/en/image-inference/api-reference#request-providersettings-bfl-raw) boolean Default: false
        :   Controls the level of post-processing applied to generated images.

            When enabled, the raw mode produces images that are closer to the model's direct output without additional processing layers. This can result in more natural-looking images but may sacrifice some visual polish and consistency that post-processing typically provides.

## [Image models](#image-models)

### [FLUX.1 Pro](#flux1-pro)

Black Forest Labs' FLUX.1 Pro model offers flagship performance with superior prompt adherence and visual quality for professional-grade image generation.

**Model AIR ID**: `bfl:1@1`.

**Supported workflows**: Text-to-image.

**Technical specifications**:

- Positive prompt: 2-3000 characters.
- Supported dimensions: 256-1440 pixels (width and height).
- CFG Scale: 1.5-5 (default: 2.5).
- Steps: 1-50 (default: 40).
- Interval guidance: 1-4 (default: 2).

**Provider-specific settings**:

Parameters supported: [`promptUpsampling`](/docs/en/image-inference/api-reference#request-providersettings-bfl-promptupsampling), [`safetyTolerance`](/docs/en/image-inference/api-reference#request-providersettings-bfl-safetytolerance).

```
{
  "taskType": "imageInference",
  "taskUUID": "24cd5dff-cb81-4db5-8506-b72a9425f9d1",
  "model": "bfl:1@1",
  "positivePrompt": "Professional portrait of a business executive in modern office setting",
  "width": 1024,
  "height": 1024,
  "steps": 40,
  "CFGScale": 2.5,
  "providerSettings": {
    "bfl": {
      "promptUpsampling": true,
      "interval": true
    }
  }
}
```

### [FLUX.1.1 Pro](#flux11-pro)

Black Forest Labs' FLUX.1.1 Pro model delivers enhanced image quality, improved prompt adherence, and increased output diversity with faster and more accurate results.

**Model AIR ID**: `bfl:2@1`.

**Supported workflows**: Text-to-image.

**Technical specifications**:

- Positive prompt: 2-3000 characters.
- Supported dimensions: 256-1440 pixels (width and height).

**Provider-specific settings**:

Parameters supported: [`promptUpsampling`](/docs/en/image-inference/api-reference#request-providersettings-bfl-promptupsampling), [`safetyTolerance`](/docs/en/image-inference/api-reference#request-providersettings-bfl-safetytolerance).

```
{
  "taskType": "imageInference",
  "taskUUID": "24cd5dff-cb81-4db5-8506-b72a9425f9d1",
  "model": "bfl:2@1",
  "positivePrompt": "Architectural visualization of sustainable building design with green technology integration",
  "width": 1280,
  "height": 720,
  "providerSettings": {
    "bfl": {
      "promptUpsampling": false
    }
  }
}
```

### [FLUX.1.1 Pro Ultra](#flux11-pro-ultra)

Black Forest Labs' FLUX.1.1 Pro Ultra model provides high-resolution generation up to 4 megapixels with raw mode for detailed and realistic outputs.

**Model AIR ID**: `bfl:2@2`.

**Supported workflows**: Text-to-image.

**Technical specifications**:

- Positive prompt: 2-3000 characters.
- Supported dimensions: 3136×1344 (21:9), 2752×1536 (16:9), 2368×1792 (4:3), 2496×1664 (3:2), 2048×2048 (1:1), 1664×2496 (2:3), 1792×2368 (3:4), 1536×2752 (9:16), 1344×3136 (9:21).

**Provider-specific settings**:

Parameters supported: [`promptUpsampling`](/docs/en/image-inference/api-reference#request-providersettings-bfl-promptupsampling), [`safetyTolerance`](/docs/en/image-inference/api-reference#request-providersettings-bfl-safetytolerance), [`raw`](/docs/en/image-inference/api-reference#request-providersettings-bfl-raw).

The `raw` setting generates less processed, more natural-looking images when enabled.

```
{
  "taskType": "imageInference",
  "taskUUID": "24cd5dff-cb81-4db5-8506-b72a9425f9d1",
  "model": "bfl:2@2",
  "positivePrompt": "Ultra-detailed landscape photography of mountain vista during golden hour",
  "width": 2752,
  "height": 1536,
  "providerSettings": {
    "bfl": {
      "promptUpsampling": true,
      "raw": true
    }
  }
}
```

### [FLUX.1 Fill Pro](#flux1-fill-pro)

Black Forest Labs' FLUX.1 Fill Pro model provides advanced inpainting and outpainting capabilities, enabling seamless editing and expansion of images based on text prompts.

**Model AIR ID**: `bfl:1@2`.

**Supported workflows**: Inpainting.

**Technical specifications**:

- Positive prompt: 2-3000 characters.
- Output dimensions: Automatically determined based on input image.
- CFG Scale: 1.5-100 (default: 60).
- Steps: 15-50 (default: 50).
- Seed image: Required.
- Mask image: Required.

**Provider-specific settings**:

Parameters supported: [`promptUpsampling`](/docs/en/image-inference/api-reference#request-providersettings-bfl-promptupsampling), [`safetyTolerance`](/docs/en/image-inference/api-reference#request-providersettings-bfl-safetytolerance).

```
{
  "taskType": "imageInference",
  "taskUUID": "24cd5dff-cb81-4db5-8506-b72a9425f9d1",
  "model": "bfl:1@2",
  "positivePrompt": "Modern furniture in contemporary living room setting",
  "seedImage": "c64351d5-4c59-42f7-95e1-eace013eddab",
  "maskImage": "d7e8f9a0-2b5c-4e7f-a1d3-9c8b7a6e5d4f",
  "steps": 40,
  "CFGScale": 60,
  "providerSettings": {
    "bfl": {
      "promptUpsampling": false
    }
  }
}
```

### [FLUX.1 Expand Pro](#flux1-expand-pro)

Black Forest Labs' FLUX.1 Expand Pro model specializes in outpainting, designed to extend images beyond their original borders while maintaining visual coherence and style.

**Model AIR ID**: `bfl:1@3`.

**Supported workflows**: Outpainting.

**Technical specifications**:

- Positive prompt: 2-3000 characters.
- Output dimensions: Automatically determined based on input image and expansion.
- CFG Scale: 1.5-100 (default: 60).
- Steps: 15-50 (default: 50).
- Seed image: Required.
- Outpaint directions: Required (maximum 2048 pixels per side).

**Provider-specific settings**:

Parameters supported: [`promptUpsampling`](/docs/en/image-inference/api-reference#request-providersettings-bfl-promptupsampling), [`safetyTolerance`](/docs/en/image-inference/api-reference#request-providersettings-bfl-safetytolerance).

```
{
  "taskType": "imageInference",
  "taskUUID": "24cd5dff-cb81-4db5-8506-b72a9425f9d1",
  "model": "bfl:1@3",
  "positivePrompt": "Extended natural landscape with mountains and forest",
  "seedImage": "c64351d5-4c59-42f7-95e1-eace013eddab",
  "outpaint": {
    "top": 256,
    "bottom": 256,
    "left": 512,
    "right": 512
  },
  "steps": 45,
  "CFGScale": 45,
  "providerSettings": {
    "bfl": {
      "promptUpsampling": true
    }
  }
}
```

### [FLUX.1 Canny Pro](#flux1-canny-pro)

Black Forest Labs' FLUX.1 Canny Pro model provides structural guidance based on canny edges extracted from input images, enabling precise control over image transformations.

**Model AIR ID**: `bfl:1@4`.

**Supported workflows**: Image-to-image with structural guidance.

**Technical specifications**:

- Positive prompt: 2-3000 characters.
- Output dimensions: Automatically determined based on input image.
- CFG Scale: 1-100 (default: 30).
- Steps: 15-50 (default: 50).
- Seed image: Required (preprocessed canny edge map).

**Provider-specific settings**:

Parameters supported: [`promptUpsampling`](/docs/en/image-inference/api-reference#request-providersettings-bfl-promptupsampling), [`safetyTolerance`](/docs/en/image-inference/api-reference#request-providersettings-bfl-safetytolerance).

The seed image must be preprocessed through ControlNet preprocessing to generate the appropriate canny edge map before use with this model.

```
{
  "taskType": "imageInference",
  "taskUUID": "24cd5dff-cb81-4db5-8506-b72a9425f9d1",
  "model": "bfl:1@4",
  "positivePrompt": "Futuristic architecture with sleek metallic surfaces and glass elements",
  "seedImage": "c64351d5-4c59-42f7-95e1-eace013eddab",
  "steps": 35,
  "CFGScale": 25,
  "providerSettings": {
    "bfl": {
      "promptUpsampling": false
    }
  }
}
```

### [FLUX.1 Depth Pro](#flux1-depth-pro)

Black Forest Labs' FLUX.1 Depth Pro model offers depth-aware image generation that preserves 3D relationships, allowing realistic transformations guided by depth maps.

**Model AIR ID**: `bfl:1@5`.

**Supported workflows**: Image-to-image with depth guidance.

**Technical specifications**:

- Positive prompt: 2-3000 characters.
- Output dimensions: Automatically determined based on input image.
- CFG Scale: 1-100 (default: 30).
- Steps: 15-50 (default: 50).
- Seed image: Required (preprocessed depth map).

**Provider-specific settings**:

Parameters supported: [`promptUpsampling`](/docs/en/image-inference/api-reference#request-providersettings-bfl-promptupsampling), [`safetyTolerance`](/docs/en/image-inference/api-reference#request-providersettings-bfl-safetytolerance).

The seed image must be preprocessed through ControlNet preprocessing to generate the appropriate depth map before use with this model.

```
{
  "taskType": "imageInference",
  "taskUUID": "24cd5dff-cb81-4db5-8506-b72a9425f9d1",
  "model": "bfl:1@5",
  "positivePrompt": "Realistic indoor scene with accurate spatial relationships and lighting",
  "seedImage": "c64351d5-4c59-42f7-95e1-eace013eddab",
  "steps": 40,
  "CFGScale": 35,
  "providerSettings": {
    "bfl": {
      "promptUpsampling": true
    }
  }
}
```

### [FLUX.1 Kontext [pro]](#flux1-kontext-pro)

Black Forest Labs' FLUX.1 Kontext [pro] model enables fast, iterative editing with local and full-scene changes, preserving style across multiple modifications.

**Model AIR ID**: `bfl:3@1`.

**Supported workflows**: Text-to-image, reference-to-image.

**Technical specifications**:

- Positive prompt: 2-3000 characters.
- Supported dimensions: 1568×672 (21:9), 1392×752 (16:9), 1184×880 (4:3), 1248×832 (3:2), 1024×1024 (1:1), 832×1248 (2:3), 880×1184 (3:4), 752×1392 (9:16), 672×1568 (9:21).
- Reference images: Supports `referenceImages` with 2 images.

**Provider-specific settings**:

Parameters supported: [`promptUpsampling`](/docs/en/image-inference/api-reference#request-providersettings-bfl-promptupsampling), [`safetyTolerance`](/docs/en/image-inference/api-reference#request-providersettings-bfl-safetytolerance).

```
{
  "taskType": "imageInference",
  "taskUUID": "24cd5dff-cb81-4db5-8506-b72a9425f9d1",
  "model": "bfl:3@1",
  "positivePrompt": "Transform the scene to include autumn foliage and warm lighting",
  "width": 1392,
  "height": 752,
  "providerSettings": {
    "bfl": {
      "promptUpsampling": false
    }
  }
}
```

### [FLUX.1 Kontext [max]](#flux1-kontext-max)

Black Forest Labs' FLUX.1 Kontext [max] model delivers the highest quality and prompt accuracy with faster, sharper edits and premium typography support.

**Model AIR ID**: `bfl:4@1`.

**Supported workflows**: Text-to-image, reference-to-image.

**Technical specifications**:

- Positive prompt: 2-3000 characters.
- Supported dimensions: 1568×672 (21:9), 1392×752 (16:9), 1184×880 (4:3), 1248×832 (3:2), 1024×1024 (1:1), 832×1248 (2:3), 880×1184 (3:4), 752×1392 (9:16), 672×1568 (9:21).
- Reference images: Supports `referenceImages` with 2 images.

**Provider-specific settings**:

Parameters supported: [`promptUpsampling`](/docs/en/image-inference/api-reference#request-providersettings-bfl-promptupsampling), [`safetyTolerance`](/docs/en/image-inference/api-reference#request-providersettings-bfl-safetytolerance).

```
{
  "taskType": "imageInference",
  "taskUUID": "24cd5dff-cb81-4db5-8506-b72a9425f9d1",
  "model": "bfl:4@1",
  "positivePrompt": "Professional logo design with premium typography and sophisticated branding elements",
  "width": 1024,
  "height": 1024,
  "providerSettings": {
    "bfl": {
      "promptUpsampling": true
    }
  }
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