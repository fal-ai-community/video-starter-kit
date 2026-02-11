---
title: MiniMax
source_url: https://runware.ai/docs/en/providers/minimax
fetched_at: 2025-10-27 03:51:42
---

## [Introduction](#introduction)

MiniMax's AI models are integrated into the Runware platform through our unified API, providing access to **advanced video generation** technology with specialized capabilities for different creative workflows.

Through the `providerSettings.minimax` object, you can access MiniMax's unique features such as **prompt optimization**, while maintaining the consistency of Runware's standard API structure. This page documents the **technical specifications, parameter requirements, and provider-specific settings** for all MiniMax models available through our platform.

`providerSettings` » `minimax` [minimax](https://runware.ai/docs/en/video-inference/api-reference#request-providersettings-minimax) object
:   Configuration settings specific to MiniMax's video generation models. These settings control prompt processing and optimization features.

      View example 

    ```
    "providerSettings": {
      "miniMax": { 
        "promptOptimizer": false
      } 
    }
    ```

       Properties
    ⁨1⁩ property 

    `providerSettings` » `minimax` » `promptoptimizer` [promptoptimizer](https://runware.ai/docs/en/video-inference/api-reference#request-providersettings-minimax-promptoptimizer) boolean Default: false
    :   Controls whether the input prompt is automatically optimized and refined to improve generation quality. When enabled, the system analyzes and enhances the prompt by adding relevant details, improving clarity, and optimizing structure for better video generation results.

        The prompt optimizer can help transform simple or basic prompts into more detailed and effective instructions, potentially leading to higher-quality video outputs with better adherence to the intended creative vision.

        When disabled, the original prompt is used as-is without any modifications or enhancements.

        When prompt enhancement is enabled, reproducibility is not guaranteed even when using the same seed value. The enhancement process may introduce variability that affects the deterministic nature of generation.

## [Video models](#video-models)

### [Video-01 Base](#video-01-base)

MiniMax's Video-01 Base model provides foundational video generation with cinematic motion control, supporting text-to-video, image-to-video, and reference-to-video workflows.

**Model AIR ID**: `minimax:1@1`.

**Supported workflows**: Text-to-video, image-to-video, reference-to-video.

**Technical specifications**:

- Positive prompt: 2-2000 characters (optional when using `frameImages`).
- Supported dimensions: 1366×768 (768p).
- Frame rate: 25 FPS.
- Duration: 6 seconds.
- Frame images: Supports first frame for `frameImages`.
- Reference images: Supports `referenceImages` with 1 image.
- Input image requirements: Width and height between 300-2048 pixels, 20MB file size limit.

**Provider-specific parameters supported**: [`promptOptimizer`](/docs/en/video-inference/api-reference#request-providersettings-minimax-promptoptimizer).

Text-to-video

```
{
  "taskType": "videoInference",
  "taskUUID": "24cd5dff-cb81-4db5-8506-b72a9425f9d1",
  "model": "minimax:1@1",
  "positivePrompt": "A cinematic tracking shot following a car driving through a mountain road at sunset",
  "duration": 6,
  "width": 1366,
  "height": 768,
  "providerSettings": {
    "minimax": {
      "promptOptimizer": true
    }
  }
}
```

 Image-to-video

```
{
  "taskType": "videoInference",
  "taskUUID": "b8c4d952-7f27-4a6e-bc9a-83f01d1c6d59",
  "model": "minimax:1@1",
  "frameImages": [
    {
      "inputImage": "c64351d5-4c59-42f7-95e1-eace013eddab",
      "frame": "first"
    }
  ],
  "duration": 6,
  "width": 1366,
  "height": 768
}
```

### [Video-01 Live](#video-01-live)

MiniMax's Video-01 Live model specializes in bringing static illustrations to life with vivid, expressive character animations optimized for 2D artwork and avatar creation.

**Model AIR ID**: `minimax:2@3`.

**Supported workflows**: Image-to-video.

**Technical specifications**:

- Positive prompt: 2-2000 characters (optional).
- Supported dimensions: 1366×768 (768p).
- Frame rate: 25 FPS.
- Duration: 6 seconds.
- Frame images: Supports first frame for `frameImages`.
- Input image requirements: Width and height between 300-2048 pixels, 20MB file size limit.

Video-01 Live is optimized specifically for image-to-video workflows and does not support text-to-video generation.

**Provider-specific parameters supported**: [`promptOptimizer`](/docs/en/video-inference/api-reference#request-providersettings-minimax-promptoptimizer).

```
{
  "taskType": "videoInference",
  "taskUUID": "f3a2b8c9-1e47-4d3a-9b2f-8c7e6d5a4b3c",
  "model": "minimax:2@3",
  "frameImages": [
    {
      "inputImage": "c64351d5-4c59-42f7-95e1-eace013eddab",
      "frame": "first"
    }
  ],
  "duration": 6,
  "width": 1366,
  "height": 768
}
```

### [Video-01 Director](#video-01-director)

MiniMax's Video-01 Director model provides enhanced cinematic control with precise filmmaking capabilities, offering reduced randomness and granular camera movement control for professional storytelling.

**Model AIR ID**: `minimax:2@1`.

**Supported workflows**: Text-to-video, image-to-video.

**Technical specifications**:

- Positive prompt: 2-2000 characters (optional when using `frameImages`).
- Supported dimensions: 1366×768 (768p).
- Frame rate: 25 FPS.
- Duration: 6 seconds.
- Frame images: Supports first frame for `frameImages`.
- Input image requirements: Width and height between 300-2048 pixels, 20MB file size limit.

**Provider-specific parameters supported**: [`promptOptimizer`](/docs/en/video-inference/api-reference#request-providersettings-minimax-promptoptimizer).

Text-to-video

```
{
  "taskType": "videoInference",
  "taskUUID": "24cd5dff-cb81-4db5-8506-b72a9425f9d1",
  "model": "minimax:2@1",
  "positivePrompt": "Professional push-in shot of a coffee cup on a wooden table, shallow depth of field, warm lighting",
  "duration": 6,
  "width": 1366,
  "height": 768,
  "providerSettings": {
    "minimax": {
      "promptOptimizer": true
    }
  }
}
```

 Image-to-video

```
{
  "taskType": "videoInference",
  "taskUUID": "b8c4d952-7f27-4a6e-bc9a-83f01d1c6d59",
  "model": "minimax:2@1",
  "frameImages": [
    {
      "inputImage": "c64351d5-4c59-42f7-95e1-eace013eddab",
      "frame": "first"
    }
  ],
  "positivePrompt": "Slow tilt shot revealing the scene with cinematic precision",
  "duration": 6,
  "width": 1366,
  "height": 768
}
```

### [Hailuo 02](#hailuo-02)

MiniMax's Hailuo 02 model represents next-generation video generation technology with advanced physics simulation, professional camera controls, and support for multiple resolutions and durations.

**Model AIR ID**: `minimax:3@1`.

**Supported workflows**: Text-to-video.

**Technical specifications**:

- Positive prompt: 2-2000 characters.
- Supported dimensions: 1366×768 (16:9), 1920×1080 (16:9).
- Frame rate: 25 FPS.
- Duration: 6 or 10 seconds (1366×768, default: 6), 6 seconds (1920×1080).
- Frame images: Supports first frame for `frameImages`.

**Provider-specific parameters supported**: [`promptOptimizer`](/docs/en/video-inference/api-reference#request-providersettings-minimax-promptoptimizer).

768p generation

```
{
  "taskType": "videoInference",
  "taskUUID": "24cd5dff-cb81-4db5-8506-b72a9425f9d1",
  "model": "minimax:3@1",
  "positivePrompt": "Realistic water physics simulation showing a stone dropping into a calm pond with ripple effects",
  "duration": 10,
  "width": 1366,
  "height": 768,
  "providerSettings": {
    "minimax": {
      "promptOptimizer": true
    }
  }
}
```

 1080p generation

```
{
  "taskType": "videoInference",
  "taskUUID": "e4d3c2b1-5a6f-4c8e-b2d7-1f0e9d8c7b6a",
  "model": "minimax:3@1",
  "positivePrompt": "Professional tracking shot of a character walking through a bustling marketplace with dynamic lighting",
  "duration": 6,
  "width": 1920,
  "height": 1080,
  "providerSettings": {
    "minimax": {
      "promptOptimizer": true
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