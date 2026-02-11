---
title: Google
source_url: https://runware.ai/docs/en/providers/google
fetched_at: 2025-10-27 03:51:41
---

## [Introduction](#introduction)

Google's AI models are integrated into the Runware platform through our unified API, providing access to **advanced image and video generation** technology.

Through the `providerSettings.google` object, you can access Google's unique features such as **automatic prompt enhancement** and **native audio generation**, while maintaining the consistency of Runware's standard API structure. This page documents the **technical specifications, parameter requirements, and provider-specific settings** for all Google models available through our platform.

## [Rate limiting and capacity management](#rate-limiting-and-capacity-management)

Google models may experience temporary rate limiting during periods of high demand. This is due to the way Google manage capacity, and particularly affects Gemini Flash Image 2.5 ("NanoBanana") due to its popularity.

When rate limits are exceeded, you'll receive an error response similar to this:

```
{
  "code": "providerRateLimitExceeded",
  "documentation": "https://runware.ai/docs/en/providers/introduction",
  "message": "Gemini rate limit exceeded. Additional information: Rate limit exceeded. Please try your request again later.",
  "responseContent": "Rate limit exceeded. Please try your request again later.",
  "taskUUID": "266dde54-7803-41c6-a067-a82a533d4ad3"
}
```

These are typically short burst issues that last for a few minutes and then **resolve automatically**. Runware uses **Dynamic Resource Allocation** to scale capacity when demand becomes insufficient, though brief adjustment periods may occur during traffic spikes.

## [Image models](#image-models)

`providerSettings` » `google` [google](https://runware.ai/docs/en/video-inference/api-reference#request-providersettings-google) object
:   Configuration settings specific to Google's video generation models (Veo 2 and Veo 3). These settings control various aspects of the generation process including prompt enhancement and audio generation capabilities.

      View example 

    ```
    "providerSettings": {
      "google": { 
        "enhancePrompt": true,
        "generateAudio": false
      } 
    }
    ```

       Properties
    ⁨1⁩ property 

    `providerSettings` » `google` » `enhancePrompt` [enhancePrompt](https://runware.ai/docs/en/video-inference/api-reference#request-providersettings-google-enhanceprompt) boolean Default: true
    :   Controls whether the input prompt is automatically enhanced and expanded to improve generation quality. When enabled, the system optimizes the prompt for better results by adding relevant details and context.

        This setting cannot be disabled when using Veo 3 model, as prompt enhancement is always active. For Veo 2 model, this setting can be controlled and disabled if needed.

        Enhanced prompts typically result in more detailed and higher-quality video generation by providing the model with richer context and clearer instructions.

        When prompt enhancement is enabled, reproducibility is not guaranteed even when using the same seed value. The enhancement process may introduce variability that affects the deterministic nature of generation.

### [Imagen 3.0](#imagen-30)

Imagen 3.0 creates detailed, high-quality images with better lighting and fewer artifacts. It works well for both realistic scenes and stylized visuals.

**Model AIR ID**: `google:1@1`.

**Supported workflows**: Text-to-image.

**Technical specifications**:

- Positive prompt: 2-3000 characters.
- Supported dimensions: 1024×1024 (1:1), 768×1408 (9:16), 1408×768 (16:9), 896×1280 (3:4), 1280×896 (4:3).

```
{
  "taskType": "imageInference",
  "taskUUID": "24cd5dff-cb81-4db5-8506-b72a9425f9d1",
  "model": "google:1@1",
  "positivePrompt": "A detailed landscape photograph of a serene mountain lake at sunrise with mist rising from the water",
  "width": 1408,
  "height": 768
}
```

### [Imagen 3.0 Fast](#imagen-30-fast)

Imagen 3.0 Fast is a quicker version of Imagen 3, built for speed without sacrificing much quality—ideal for interactive or real-time use.

**Model AIR ID**: `google:1@2`.

**Supported workflows**: Text-to-image.

**Technical specifications**:

- Positive prompt 2-3000 characters.
- Negative prompt: 2-3000 characters (optional).
- Supported dimensions: 1024×1024 (1:1), 768×1408 (9:16), 1408×768 (16:9), 896×1280 (3:4), 1280×896 (4:3).

```
{
  "taskType": "imageInference",
  "taskUUID": "b8c4d952-7f27-4a6e-bc9a-83f01d1c6d59",
  "model": "google:1@2",
  "positivePrompt": "A modern architectural building with clean geometric lines and glass facades",
  "negativePrompt": "blurry, low quality, distorted, unrealistic",
  "width": 896,
  "height": 1280
}
```

### [Imagen 4.0 Preview](#imagen-40-preview)

Imagen 4.0 Preview improves textures, lighting, and typography—making it especially useful for design-heavy or detail-focused work.

**Model AIR ID**: `google:2@1`.

**Supported workflows**: Text-to-image.

**Technical specifications**:

- Positive prompt: 2-3000 characters.
- Supported dimensions: 1024×1024 (1:1), 768×1408 (9:16), 1408×768 (16:9), 896×1280 (3:4), 1280×896 (4:3).

```
{
  "taskType": "imageInference",
  "taskUUID": "f3a2b8c9-1e47-4d3a-9b2f-8c7e6d5a4b3c",
  "model": "google:2@1",
  "positivePrompt": "A photorealistic portrait of an elderly craftsman working with traditional woodworking tools in his workshop",
  "width": 1024,
  "height": 1024
}
```

### [Imagen 4.0 Ultra](#imagen-40-ultra)

Imagen 4.0 Ultra is Google's most advanced image model available, delivering exceptional detail, color accuracy, and prompt adherence. Ideal for demanding use cases where image quality and consistency matter most.

**Model AIR ID**: `google:2@2`.

**Supported workflows**: Text-to-image.

**Technical specifications**:

- Positive prompt: 2-3000 characters.
- Supported dimensions: 1024×1024 (1:1), 768×1408 (9:16), 1408×768 (16:9), 896×1280 (3:4), 1280×896 (4:3).

```
{
  "taskType": "imageInference",
  "taskUUID": "e4d3c2b1-5a6f-4c8e-b2d7-1f0e9d8c7b6a",
  "model": "google:2@2",
  "positivePrompt": "An ultra-detailed macro photograph of a butterfly wing showing intricate patterns and iridescent colors with perfect focus and lighting",
  "width": 1280,
  "height": 896
}
```

### [Imagen 4.0 Fast](#imagen-40-fast)

Imagen 4.0 Fast offers the speed and quality of the Imagen 4 family, optimized for quicker inference with minimal quality loss. It’s suited for fast generation tasks without giving up fine detail or lighting accuracy.

**Model AIR ID**: `google:2@3`.

**Supported workflows**: Text-to-image.

**Technical specifications**:

- Positive prompt 2-3000 characters.
- Negative prompt: 2-3000 characters (optional).
- Supported dimensions: 1024×1024 (1:1), 768×1408 (9:16), 1408×768 (16:9), 896×1280 (3:4), 1280×896 (4:3).

```
{
  "taskType": "imageInference",
  "taskUUID": "1a2b3c4d-5e6f-7a8b-9c0d-123456789abc",
  "model": "google:2@3",
  "positivePrompt": "A vibrant cityscape at golden hour with warm lighting and dynamic reflections",
  "negativePrompt": "low detail, blurry, overexposed",
  "width": 1408,
  "height": 768
}
```

### [Gemini Flash Image 2.5](#gemini-flash-image-25)

Google DeepMind's Gemini Flash Image 2.5, nicknamed "Nano Banana", represents a breakthrough in multimodal AI image generation and editing. This model specializes in rapid, interactive image workflows with sophisticated editing capabilities including prompt-based modifications, multi-image fusion, and conversational editing flows. Built with deep real-world understanding, it enables context-aware edits that go beyond simple aesthetic manipulations.

**Model AIR ID**: `google:4@1`.

**Supported workflows**: Text-to-image, image-to-image.

**Technical specifications**:

- Positive prompt 2-3000 characters.
- Reference images: Supports up to 8 images via `referenceImages`.
- Supported dimensions: :
  - Text-to-image: 1024×1024 (1:1), 1248×832 (3:2), 832×1248 (2:3), 1184×864 (4:3), 864×1184 (3:4), 1152×896 (5:4), 896×1152 (4:5), 1344×768 (16:9), 768×1344 (9:16), 1536×672 (21:9).
  - Image-to-image: Automatically matches reference image aspect ratio (width/height parameters ignored).
- Input image requirements: Width and height between 300-2048 pixels, 20MB file size limit.
- Watermarking: Includes invisible SynthID digital watermark on all generated images.

Text-to-image generation

```
{
  "taskType": "imageInference",
  "taskUUID": "f47ac10b-58cc-4372-a567-0e02b2c3d484",
  "model": "google:4@1",
  "positivePrompt": "A modern living room with minimalist furniture and natural lighting",
  "width": 1344,
  "height": 768
}
```

 Image editing

```
{
  "taskType": "imageInference",
  "taskUUID": "6ba7b823-9dad-11d1-80b4-00c04fd430c8",
  "model": "google:4@1",
  "referenceImages": ["c64351d5-4c59-42f7-95e1-eace013eddab"],
  "positivePrompt": "Remove the red stain from the carpet and blur the background"
}
```

 Multi-image fusion

```
{
  "taskType": "imageInference",
  "taskUUID": "550e8400-e29b-41d4-a716-446655440005",
  "model": "google:4@1",
  "referenceImages": [
    "c64351d5-4c59-42f7-95e1-eace013eddab",
    "d7e8f9a0-2b5c-4e7f-a1d3-9c8b7a6e5d4f",
    "454639ca-4717-4f8b-a031-b593e96b8cd4"
  ],
  "positivePrompt": "Combine these images into a cohesive outdoor scene"
}
```

## [Video models](#video-models)

`providerSettings` » `google` [google](https://runware.ai/docs/en/video-inference/api-reference#request-providersettings-google) object
:   Configuration settings specific to Google's video generation models (Veo 2 and Veo 3). These settings control various aspects of the generation process including prompt enhancement and audio generation capabilities.

      View example 

    ```
    "providerSettings": {
      "google": { 
        "enhancePrompt": true,
        "generateAudio": false
      } 
    }
    ```

       Properties
    ⁨2⁩ properties 

    `providerSettings` » `google` » `enhancePrompt` [enhancePrompt](https://runware.ai/docs/en/video-inference/api-reference#request-providersettings-google-enhanceprompt) boolean Default: true
    :   Controls whether the input prompt is automatically enhanced and expanded to improve generation quality. When enabled, the system optimizes the prompt for better results by adding relevant details and context.

        This setting cannot be disabled when using Veo 3 model, as prompt enhancement is always active. For Veo 2 model, this setting can be controlled and disabled if needed.

        Enhanced prompts typically result in more detailed and higher-quality video generation by providing the model with richer context and clearer instructions.

        When prompt enhancement is enabled, reproducibility is not guaranteed even when using the same seed value. The enhancement process may introduce variability that affects the deterministic nature of generation.

    `providerSettings` » `google` » `generateAudio` [generateAudio](https://runware.ai/docs/en/video-inference/api-reference#request-providersettings-google-generateaudio) boolean Default: false
    :   Controls whether the generated video includes audio content. When enabled, the system creates appropriate audio that matches the visual content and scene context within the video.

        This feature is only available for Veo 3 model. Audio generation is not supported in Veo 2.

        Generated audio can include ambient sounds, music, or other audio elements that enhance the video experience and provide a more immersive result.

### [Veo 2](#veo-2)

Google's Veo 2 model delivers high-realism video generation with advanced physics simulation and cinematic understanding, supporting both text-to-video and image-to-video generation with automatic prompt enhancement.

**Model AIR ID**: `google:2@0`.

**Supported workflows**: Text-to-video, image-to-video.

**Technical specifications**:

- Positive prompt: 2-3000 characters.
- Supported dimensions: 1280×720 (16:9), 720×1280 (9:16).
- Frame rate: 24 FPS.
- Duration: 5, 6, 7, or 8 seconds (default: 5).
- Frame images: Supports first and last frame for `frameImages`.
- Input image requirements: Width and height between 300-2048 pixels, 20MB file size limit.

**Provider-specific parameters supported**: [`enhancePrompt`](/docs/en/video-inference/api-reference#request-providersettings-google-enhanceprompt).

Text-to-video

```
{
  "taskType": "videoInference",
  "taskUUID": "24cd5dff-cb81-4db5-8506-b72a9425f9d1",
  "model": "google:2@0",
  "positivePrompt": "A close-up shot of rain drops on a window",
  "duration": 6,
  "width": 1280,
  "height": 720
}
```

 Image-to-video

```
{
  "taskType": "videoInference",
  "taskUUID": "b8c4d952-7f27-4a6e-bc9a-83f01d1c6d59",
  "model": "google:2@0",
  "frameImages": [
    {
      "inputImage": "c64351d5-4c59-42f7-95e1-eace013eddab",
      "frame": "first"
    }
  ],
  "duration": 8,
  "width": 720,
  "height": 1280,
  "providerSettings": {
    "google": {
      "enhancePrompt": false
    }
  }
}
```

### [Veo 3](#veo-3)

Google's Veo 3 model represents Google's latest video generation technology, featuring native audio generation that creates synchronized dialogue, music, and sound effects alongside high-fidelity video content.

**Model AIR ID**: `google:3@0`.

**Supported workflows**: Text-to-video, image-to-video.

**Technical specifications**:

- Positive prompt: 2-3000 characters.
- Supported dimensions: 1280×720 (16:9), 720×1280 (9:16), 1920×1080 (16:9), 1080×1920 (9:16).
- Frame rate: 24 FPS.
- Duration: 8 seconds.
- Frame images: Supports first frame for `frameImages`.
- Input image requirements: Width and height between 300-2048 pixels, 20MB file size limit.

**Provider-specific parameters supported**: [`generateAudio`](/docs/en/video-inference/api-reference#request-providersettings-google-generateaudio).

In Veo 3, `enhancePrompt` is **always enabled and cannot be disabled**.

Video with audio

```
{
  "taskType": "videoInference",
  "taskUUID": "f3a2b8c9-1e47-4d3a-9b2f-8c7e6d5a4b3c",
  "model": "google:3@0",
  "positivePrompt": "Ocean waves crashing against rocky cliffs during a storm",
  "duration": 8,
  "width": 1280,
  "height": 720,
  "providerSettings": {
    "google": {
      "generateAudio": true
    }
  }
}
```

 Video without audio

```
{
  "taskType": "videoInference",
  "taskUUID": "e4d3c2b1-5a6f-4c8e-b2d7-1f0e9d8c7b6a",
  "model": "google:3@0",
  "positivePrompt": "A time-lapse of clouds moving across a mountain landscape",
  "duration": 8,
  "width": 1280,
  "height": 720,
  "providerSettings": {
    "google": {
      "generateAudio": false
    }
  }
}
```

### [Veo 3 Fast](#veo-3-fast)

Google's Veo 3 Fast model represents a faster and more cost-effective variant of Veo 3, optimized for speed and affordability while maintaining native audio generation capabilities.

**Model AIR ID**: `google:3@1`.

**Supported workflows**: Text-to-video, image-to-video.

**Technical specifications**:

- Positive prompt: 2-3000 characters.
- Supported dimensions: 1280×720 (16:9), 720×1280 (9:16), 1920×1080 (16:9), 1080×1920 (9:16).
- Frame rate: 24 FPS.
- Duration: 8 seconds.
- Frame images: Supports first and last frame for `frameImages`.
- Input image requirements: Width and height between 300-2048 pixels, 20MB file size limit.

**Provider-specific parameters supported**: [`generateAudio`](/docs/en/video-inference/api-reference#request-providersettings-google-generateaudio).

In Veo 3, `enhancePrompt` is **always enabled and cannot be disabled**.

Video with audio

```
{
  "taskType": "videoInference",
  "taskUUID": "f3a2b8c9-1e47-4d3a-9b2f-8c7e6d5a4b3c",
  "model": "google:3@1",
  "positivePrompt": "Fast-paced street scene with cars and pedestrians, urban ambient sounds",
  "duration": 8,
  "width": 1280,
  "height": 720,
  "providerSettings": {
    "google": {
      "generateAudio": true
    }
  }
}
```

 Video without audio

```
{
  "taskType": "videoInference",
  "taskUUID": "e4d3c2b1-5a6f-4c8e-b2d7-1f0e9d8c7b6a",
  "model": "google:3@1",
  "positivePrompt": "Quick animation of clouds forming and dispersing over a landscape",
  "duration": 8,
  "width": 1280,
  "height": 720,
  "providerSettings": {
    "google": {
      "generateAudio": false
    }
  }
}
```

### [Veo 3.1](#veo-31)

Google's newest Veo model for cinematic video generation, capable of turning images or text into realistic, story-driven scenes with natural sound and smooth motion.

**Model AIR ID**: `google:3@2`.

**Supported workflows**: Text-to-video, image-to-video.

**Technical specifications**:

- Positive prompt: 2-3000 characters.
- Supported dimensions: 1280×720 (16:9), 720×1280 (9:16), 1920×1080 (16:9), 1080×1920 (9:16).
- Frame rate: 24 FPS.
- Duration: 8 seconds.
- Frame images: Supports first and last frame for `frameImages`.
- Reference images: Supports `inputs.references` with typed image roles (`asset` or `style`).
- Input image requirements: Width and height between 300-2048 pixels, 20MB file size limit.

**Provider-specific parameters supported**: [`generateAudio`](/docs/en/video-inference/api-reference#request-providersettings-google-generateaudio).

**Reference image constraints**: When using reference images, only 16:9 aspect ratio (1280×720 or 720×1280) and 8-second duration are supported. You can use up to 3 `asset` images or 1 `style` image, but cannot mix image types. Reference images cannot be used together with frame images.

In Veo 3.1, `enhancePrompt` is **always enabled and cannot be disabled**.

Text-to-video with audio

```
{
  "taskType": "videoInference",
  "taskUUID": "f3a2b8c9-1e47-4d3a-9b2f-8c7e6d5a4b3d",
  "model": "google:3@2",
  "positivePrompt": "Cinematic shot of a person walking through a rain-soaked city street at night",
  "duration": 8,
  "width": 1280,
  "height": 720,
  "providerSettings": {
    "google": {
      "generateAudio": true
    }
  }
}
```

 Reference-to-video (asset)

```
{
  "taskType": "videoInference",
  "taskUUID": "e4d3c2b1-5a6f-4c8e-b2d7-1f0e9d8c7b6b",
  "model": "google:3@2",
  "positivePrompt": "Animate this product with smooth 360-degree rotation",
  "duration": 8,
  "width": 1280,
  "height": 720,
  "inputs": {
    "references": [
      { "image": "c64351d5-4c59-42f7-95e1-eace013eddab", "type": "asset" }
    ]
  }
}
```

 Reference-to-video (style)

```
{
  "taskType": "videoInference",
  "taskUUID": "a1b2c3d4-5e6f-7g8h-9i0j-1k2l3m4n5o6p",
  "model": "google:3@2",
  "positivePrompt": "A landscape scene with mountains and lakes",
  "duration": 8,
  "width": 1280,
  "height": 720,
  "inputs": {
    "references": [
      { "image": "d7e8f9a0-2b5c-4e7f-a1d3-9c8b7a6e5d4f", "type": "style" }
    ]
  }
}
```

 Image-to-video (first/last frame)

```
{
  "taskType": "videoInference",
  "taskUUID": "b2c3d4e5-6f7g-8h9i-0j1k-2l3m4n5o6p7q",
  "model": "google:3@2",
  "frameImages": [
    {
      "inputImage": "c64351d5-4c59-42f7-95e1-eace013eddab",
      "frame": "first"
    },
    {
      "inputImage": "d7e8f9a0-2b5c-4e7f-a1d3-9c8b7a6e5d4f",
      "frame": "last"
    }
  ],
  "positivePrompt": "Smooth transition between the two scenes",
  "duration": 8,
  "width": 1280,
  "height": 720
}
```

### [Veo 3.1 Fast](#veo-31-fast)

Optimized variant of Veo 3.1 for high-speed generation, balancing cinematic quality with ultra-low latency and rapid creative iteration.

**Model AIR ID**: `google:3@3`.

**Supported workflows**: Text-to-video, image-to-video.

**Technical specifications**:

- Positive prompt: 2-3000 characters.
- Supported dimensions: 1280×720 (16:9), 720×1280 (9:16), 1920×1080 (16:9), 1080×1920 (9:16).
- Frame rate: 24 FPS.
- Duration: 8 seconds.
- Frame images: Supports first and last frame for `frameImages`.
- Input image requirements: Width and height between 300-2048 pixels, 20MB file size limit.

**Provider-specific parameters supported**: [`generateAudio`](/docs/en/video-inference/api-reference#request-providersettings-google-generateaudio).

In Veo 3.1, `enhancePrompt` is **always enabled and cannot be disabled**.

Text-to-video with audio

```
{
  "taskType": "videoInference",
  "taskUUID": "f3a2b8c9-1e47-4d3a-9b2f-8c7e6d5a4b3e",
  "model": "google:3@3",
  "positivePrompt": "Quick cut of a bustling marketplace with vendors and shoppers",
  "duration": 8,
  "width": 1280,
  "height": 720,
  "providerSettings": {
    "google": {
      "generateAudio": true
    }
  }
}
```

 Image-to-video (first/last frame)

```
{
  "taskType": "videoInference",
  "taskUUID": "e4d3c2b1-5a6f-4c8e-b2d7-1f0e9d8c7b6c",
  "model": "google:3@3",
  "frameImages": [
    {
      "inputImage": "c64351d5-4c59-42f7-95e1-eace013eddab",
      "frame": "first"
    },
    {
      "inputImage": "d7e8f9a0-2b5c-4e7f-a1d3-9c8b7a6e5d4f",
      "frame": "last"
    }
  ],
  "positivePrompt": "Fast-paced animation between the two frames",
  "duration": 8,
  "width": 720,
  "height": 1280
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