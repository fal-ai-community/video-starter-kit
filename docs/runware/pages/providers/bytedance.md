---
title: ByteDance
source_url: https://runware.ai/docs/en/providers/bytedance
fetched_at: 2025-10-27 03:51:36
---

## [Introduction](#introduction)

ByteDance's AI models are integrated into the Runware platform through our unified API, providing access to **advanced video generation** technology.

Through the `providerSettings.bytedance` object, you can access ByteDance's unique features such as camera movement controls, while maintaining the consistency of Runware's standard API structure. This page documents the **technical specifications, parameter requirements, and provider-specific settings** for all ByteDance models available through our platform.

## [Image models](#image-models)

`providerSettings` » `bytedance` [bytedance](https://runware.ai/docs/en/image-inference/api-reference#request-providersettings-bytedance) object
:   Configuration object for ByteDance-specific image generation settings. These parameters provide access to specialized features and controls available across ByteDance's image generation models.

      View example 

    ```
    "providerSettings": {
      "bytedance": { 
        "maxSequentialImages": 4
      } 
    }
    ```

       Properties
    ⁨1⁩ property 

    `providerSettings` » `bytedance` » `maxSequentialImages` [maxSequentialImages](https://runware.ai/docs/en/image-inference/api-reference#request-providersettings-bytedance-maxsequentialimages) integer Min: 1 Max: 15
    :   Specifies the maximum number of sequential images to generate in a single request. This parameter enables the creation of coherent image sequences, making it ideal for storyboard development or comic creation.

        The model will attempt to generate up to the specified number of images while maintaining visual consistency and thematic coherence across the sequence. Each image builds upon the previous ones to create a unified narrative flow.

        The combined total of reference images plus sequential images cannot exceed 15. For example, if you use 5 reference images, you can request a maximum of 10 sequential images.

        The model may generate fewer images than requested depending on prompt complexity and generation context. The actual number of output images is determined by the model's assessment of narrative coherence and visual quality.

### [SeedEdit 3.0](#seededit-30)

ByteDance's SeedEdit 3.0 model provides flagship image editing capabilities with advanced instruction-following and content preservation, balancing prompt fidelity with strong preservation of unedited areas.

**Model AIR ID**: `bytedance:4@1`.

**Supported workflows**: Image-to-image.

**Technical specifications**:

- Positive prompt: 2-500 characters.
- Output dimensions: Aspect ratio inherited from reference image (up to 4K resolution).
- Reference images: Supports `referenceImages` with 1 image (required).
- CFG Scale: 1-10 (default: 5.5).
- Input image requirements: Width and height between 300-6000 pixels, 10MB file size limit.

```
{
  "taskType": "imageInference",
  "taskUUID": "24cd5dff-cb81-4db5-8506-b72a9425f9d1",
  "model": "bytedance:4@1",
  "positivePrompt": "Change the lighting to warm golden hour, remove the background clutter",
  "referenceImages": [
    "c64351d5-4c59-42f7-95e1-eace013eddab"
  ],
  "CFGScale": 0.7
}
```

### [Seedream 4.0](#seedream-40)

ByteDance's Seedream 4.0 model represents a major leap in multimodal AI image generation, combining ultra-fast 2K/4K rendering with unique sequential image capabilities. The model excels at maintaining character consistency across multiple outputs while supporting complex editing operations through natural language commands, making it particularly valuable for storyboard creation and professional design workflows.

**Model AIR ID**: `bytedance:5@0`.

**Supported workflows**: Text-to-image, image-to-image.

**Technical specifications**:

- Positive prompt: 1-2000 characters.
- Reference images: Supports up to 14 images via `referenceImages`.
- Sequential images: Generates multiple related output images (configure with `maxSequentialImages`).
- Combined limit: Reference images + sequential images cannot exceed 15 total.
- Supported dimensions:
  - **1K**: 1024×1024 (1:1).
  - **2K**: 2048×2048 (1:1), 2304×1728 (4:3), 1728×2304 (3:4), 2560×1440 (16:9), 1440×2560 (9:16), 2496×1664 (3:2), 1664×2496 (2:3), 3024×1296 (21:9).
  - **4K**: 4096×4096 (1:1), 4608×3456 (4:3), 3456×4608 (3:4), 5120×2880 (16:9), 2880×5120 (9:16), 4992×3328 (3:2), 3328×4992 (2:3), 6048×2592 (21:9).

**Provider-specific settings**:

Parameters supported: [`maxSequentialImages`](/docs/en/image-inference/api-reference#request-providersettings-bytedance-maxsequentialimages).

The model may generate fewer sequential images than requested via `maxSequentialImages`. The actual number depends on the complexity of the prompt and generation context.

Sequential text to image generation

```
{
  "taskType": "imageInference",
  "taskUUID": "f47ac10b-58cc-4372-a567-0e02b2c3d483",
  "model": "bytedance:5@0",
  "positivePrompt": "A character walking through different seasons: spring, summer, autumn, winter",
  "width": 1280,
  "height": 720,
  "providerSettings": {
    "bytedance": {
      "maxSequentialImages": 4
    }
  }
}
```

 Sequential Image to image generation

```
{
  "taskType": "imageInference",
  "taskUUID": "6ba7b822-9dad-11d1-80b4-00c04fd430c8",
  "model": "bytedance:5@0",
  "referenceImages": ["c64351d5-4c59-42f7-95e1-eace013eddab"],
  "positivePrompt": "Transform this character through different emotional states",
  "width": 2048,
  "height": 2048,
  "providerSettings": {
    "bytedance": {
      "maxSequentialImages": 3
    }
  }
}
```

## [Video models](#video-models)

`providerSettings` » `bytedance` [bytedance](https://runware.ai/docs/en/video-inference/api-reference#request-providersettings-bytedance) object
:   Configuration settings specific to ByteDance's video generation models. These settings control camera behavior and movement during video generation.

      View example 

    ```
    "providerSettings": {
      "bytedance": { 
        "cameraFixed": false
      } 
    }
    ```

       Properties
    ⁨1⁩ property 

    `providerSettings` » `bytedance` » `camerafixed` [camerafixed](https://runware.ai/docs/en/video-inference/api-reference#request-providersettings-bytedance-camerafixed) boolean Default: false
    :   Controls whether the camera remains stationary during video generation. When enabled, the camera position and angle are fixed, preventing any camera movement, panning, or zooming effects.

        When disabled (default), the model can incorporate dynamic camera movements such as pans, tilts, zooms, or tracking shots to create more cinematic and engaging video content.

        This setting is useful when you need static shots or want to avoid camera motion that might distract from the main subject or action in the video.

### [Seedance 1.0 Lite](#seedance-10-lite)

ByteDance's Seedance 1.0 Lite model provides cost-effective video generation with support for multiple resolution options across various aspect ratios, supporting both text-to-video and image-to-video workflows.

**Model AIR ID**: `bytedance:1@1`.

**Supported workflows**: Text-to-video, image-to-video.

**Technical specifications**:

- Positive prompt: 2-3000 characters.
- Supported dimensions: 864×480 (16:9), 736×544 (4:3), 640×640 (1:1), 960×416 (21:9), 416×960 (9:21), 1248×704 (16:9), 1120×832 (4:3), 960×960 (1:1), 1504×640 (21:9), 640×1504 (9:21).
- Frame rate: 24 FPS.
- Duration: 5 or 10 seconds (default: 5).
- Frame images: Supports first and last frame for `frameImages`.
- Input image requirements: Width and height between 300-6000 pixels, 10MB file size limit.

When using `frameImages` (image-to-video), the `width` and `height` parameters are not supported. The output resolution is automatically determined by selecting the closest supported resolution that matches the input image's aspect ratio.

**Provider-specific parameters supported**: [`cameraFixed`](/docs/en/video-inference/api-reference#request-providersettings-bytedance-camerafixed).

Text-to-video

```
{
  "taskType": "videoInference",
  "taskUUID": "24cd5dff-cb81-4db5-8506-b72a9425f9d1",
  "model": "bytedance:1@1",
  "positivePrompt": "A serene mountain lake reflecting the sunset with gentle ripples",
  "duration": 5,
  "width": 1248,
  "height": 704
}
```

 Image-to-video

```
{
  "taskType": "videoInference",
  "taskUUID": "b8c4d952-7f27-4a6e-bc9a-83f01d1c6d59",
  "model": "bytedance:1@1",
  "frameImages": [
    {
      "inputImage": "c64351d5-4c59-42f7-95e1-eace013eddab",
      "frame": "first"
    }
  ],
  "duration": 10,
  "providerSettings": {
    "bytedance": {
      "cameraFixed": true
    }
  }
}
```

### [Seedance 1.0 Pro](#seedance-10-pro)

ByteDance's Seedance 1.0 Pro model represents the flagship professional-grade video generation solution with cinematic storytelling capabilities, multi-shot support, and high-resolution output up to 1080p.

**Model AIR ID**: `bytedance:2@1`.

**Supported workflows**: Text-to-video, image-to-video.

**Technical specifications**:

- Positive prompt: 2-3000 characters.
- Supported dimensions: 864×480 (16:9), 736×544 (4:3), 640×640 (1:1), 544×736 (3:4), 480×864 (9:16), 416×960 (9:21), 960×416 (21:9), 1920×1088 (16:9), 1664×1248 (4:3), 1440×1440 (1:1), 1248×1664 (3:4), 1088×1920 (9:16), 928×2176 (9:21), 2176×928 (21:9).
- Frame rate: 24 FPS.
- Duration: 5 or 10 seconds (default: 5).
- Frame images: Supports first and last frame for `frameImages`.
- Input image requirements: Width and height between 300-6000 pixels, 10MB file size limit.

**Provider-specific settings**:

Parameters supported: [`cameraFixed`](/docs/en/video-inference/api-reference#request-providersettings-bytedance-camerafixed).

Text-to-video

```
{
  "taskType": "videoInference",
  "taskUUID": "24cd5dff-cb81-4db5-8506-b72a9425f9d1",
  "model": "bytedance:2@1",
  "positivePrompt": "Cinematic multi-shot sequence: close-up of a coffee cup, camera pulls back to reveal a busy café, then cuts to street view through window",
  "duration": 10,
  "width": 1920,
  "height": 1088,
  "providerSettings": {
    "bytedance": {
      "cameraFixed": false
    }
  }
}
```

 Image-to-video

```
{
  "taskType": "videoInference",
  "taskUUID": "b8c4d952-7f27-4a6e-bc9a-83f01d1c6d59",
  "model": "bytedance:2@1",
  "frameImages": [
    {
      "inputImage": "c64351d5-4c59-42f7-95e1-eace013eddab",
      "frame": "first"
    }
  ],
  "duration": 5,
  "width": 1440,
  "height": 1440,
  "providerSettings": {
    "bytedance": {
      "cameraFixed": true
    }
  }
}
```

### [Seedance 1.0 Pro Fast](#seedance-10-pro-fast)

ByteDance's Seedance 1.0 Pro Fast model delivers accelerated video generation while maintaining the high visual quality and cinematic capabilities of Seedance 1.0 Pro, optimized for faster iteration and production workflows.

**Model AIR ID**: `bytedance:2@2`.

**Supported workflows**: Text-to-video, image-to-video.

**Technical specifications**:

- Positive prompt: 2-3000 characters.
- Supported dimensions: 864×480 (16:9), 736×544 (4:3), 640×640 (1:1), 544×736 (3:4), 480×864 (9:16), 416×960 (9:21), 960×416 (21:9), 1920×1088 (16:9), 1664×1248 (4:3), 1440×1440 (1:1), 1248×1664 (3:4), 1088×1920 (9:16), 928×2176 (9:21), 2176×928 (21:9).
- Frame rate: 24 FPS.
- Duration: 1.2 to 12 seconds in 0.1 second increments (default: 5).
- Frame images: Supports first frame only for `frameImages`.
- Input image requirements: Width and height between 300-6000 pixels, 10MB file size limit.

**Provider-specific settings**:

Parameters supported: [`cameraFixed`](/docs/en/video-inference/api-reference#request-providersettings-bytedance-camerafixed).

Text-to-video

```
{
  "taskType": "videoInference",
  "taskUUID": "24cd5dff-cb81-4db5-8506-b72a9425f9d2",
  "model": "bytedance:2@2",
  "positivePrompt": "Dynamic camera movement following a dancer through an energetic performance sequence",
  "duration": 8.5,
  "width": 1920,
  "height": 1088,
  "providerSettings": {
    "bytedance": {
      "cameraFixed": false
    }
  }
}
```

 Image-to-video

```
{
  "taskType": "videoInference",
  "taskUUID": "b8c4d952-7f27-4a6e-bc9a-83f01d1c6d60",
  "model": "bytedance:2@2",
  "frameImages": [
    {
      "inputImage": "c64351d5-4c59-42f7-95e1-eace013eddab",
      "frame": "first"
    }
  ],
  "duration": 6.3,
  "width": 1440,
  "height": 1440,
  "providerSettings": {
    "bytedance": {
      "cameraFixed": true
    }
  }
}
```

 Short clip generation

```
{
  "taskType": "videoInference",
  "taskUUID": "f47ac10b-58cc-4372-a567-0e02b2c3d492",
  "model": "bytedance:2@2",
  "positivePrompt": "Quick motion test: character performs a spin move",
  "duration": 2.4,
  "width": 1088,
  "height": 1920
}
```

### [OmniHuman-1](#omnihuman-1)

ByteDance's OmniHuman-1 model provides an end-to-end framework for generating realistic human videos from a single image and audio input, with exceptional emotional tone capture and lip-sync accuracy across diverse character styles including photorealistic humans, cartoons, and stylized avatars.

**Model AIR ID**: `bytedance:5@1`.

**Supported workflows**: Image-to-video with audio.

**Technical specifications**:

- Reference images: Supports `referenceImages` with 1 image (required).
- Input audios: Supports `inputAudios` with 1 audio file (required).
- Input image requirements: Width and height between 300-6000 pixels, 10MB file size limit.
- Audio input requirements: Maximum 30 seconds duration (15 seconds recommended for optimal results).

```
{
  "taskType": "videoInference",
  "taskUUID": "a770f077-f413-47de-9dac-be0b26a35da6",
  "model": "bytedance:5@1",
  "referenceImages": ["aac49721-1964-481a-ae78-8a4e29b91402"],
  "inputAudios": ["b4c57832-2075-492b-bf89-9b5e3ac02503"]
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