---
title: Lightricks
source_url: https://runware.ai/docs/en/providers/lightricks
fetched_at: 2025-10-27 03:51:41
---

## [Introduction](#introduction)

Lightricks' AI models are integrated into the Runware platform through our unified API, providing access to **advanced cinematic video generation** technology built for creators, brands, and studios. The LTX-2 model family delivers fast, efficient video generation with professional-grade motion control and lighting precision.

Through the `providerSettings.lightricks` object, you can access Lightricks' unique features such as **audio generation**, while maintaining the consistency of Runware's standard API structure. This page documents the **technical specifications, parameter requirements, and provider-specific settings** for all Lightricks models available through our platform.

`providerSettings` » `lightricks` [lightricks](https://runware.ai/docs/en/video-inference/api-reference#request-providersettings-lightricks) object
:   Configuration object for Lightricks-specific video generation settings. These parameters provide access to specialized features and controls available across Lightricks' video generation models.

      View example 

    ```
    "providerSettings": {
      "lightricks": {
        "generateAudio": true
      }
    }
    ```

       Properties
    ⁨1⁩ property 

    `providerSettings` » `lightricks` » `generateAudio` [generateAudio](https://runware.ai/docs/en/video-inference/api-reference#request-providersettings-lightricks-generateaudio) boolean Default: false
    :   Controls whether to generate synchronized audio for the video output. When enabled, the model creates audio that matches the visual content and motion in the generated video.

## [Video models](#video-models)

### [LTX-2 Pro](#ltx-2-pro)

Professional edition of LTX-2 built for cinematic video creation. It focuses on realistic motion and precise lighting control, giving creators full command over pacing and atmosphere.

**Model AIR ID**: `lightricks:2@0`.

**Supported workflows**: Text-to-video, image-to-video.

**Technical specifications**:

- Positive prompt: 2-10000 characters.
- No seed support.
- Supported dimensions:
  - **1080p**: 1920×1080 (16:9).
  - **1440p**: 2560×1440 (16:9).
  - **2160p (4K)**: 3840×2160 (16:9).
- Frame rate: 25 or 50 FPS (Default: 25).
- Duration: 6, 8 or 10 seconds (default: 6).
- Frame images: Supports first frame for `frameImages`.
- Input image requirements: Maximum 7MB file size.

**Provider-specific settings**:

Parameters supported: [`generateAudio`](/docs/en/video-inference/api-reference#request-providersettings-lightricks-generateaudio).

Text-to-video 1080p w/sound

```
{
  "taskType": "videoInference",
  "taskUUID": "f47ac10b-58cc-4372-a567-0e02b2c3d492",
  "model": "lightricks:2@0",
  "positivePrompt": "A cinematic tracking shot of a character walking through a rain-soaked city street at night, neon lights reflecting in puddles",
  "duration": 8,
  "width": 1920,
  "height": 1080,
  "providerSettings": {
    "lightricks": {
      "generateAudio": true
    }
  }
}
```

 Image-to-video 4K

```
{
  "taskType": "videoInference",
  "taskUUID": "6ba7b831-9dad-11d1-80b4-00c04fd430c8",
  "model": "lightricks:2@0",
  "frameImages": [
    {
      "inputImage": "c64351d5-4c59-42f7-95e1-eace013eddab",
      "frame": "first"
    }
  ],
  "positivePrompt": "Camera slowly pushes in as dramatic lighting illuminates the scene",
  "duration": 6,
  "width": 3840,
  "height": 1440
}
```

### [LTX-2 Fast](#ltx-2-fast)

High-speed edition of LTX-2 designed for quick cinematic generation. It renders complex motion efficiently while preserving strong visual consistency.

**Model AIR ID**: `lightricks:2@1`.

**Supported workflows**: Text-to-video, image-to-video.

**Technical specifications**:

- Positive prompt: 2-10000 characters.
- No seed support.
- Supported dimensions:
  - **1080p**: 1920×1080 (16:9).
  - **1440p**: 2560×1440 (16:9).
  - **2160p (4K)**: 3840×2160 (16:9).
- Frame rate: 25 or 50 FPS (Default: 25).
- Duration: 6, 8 or 10 seconds (default: 6).
- Frame images: Supports first frame for `frameImages`.
- Input image requirements: Maximum 7MB file size.

**Provider-specific settings**:

Parameters supported: [`generateAudio`](/docs/en/video-inference/api-reference#request-providersettings-lightricks-generateaudio).

Text-to-video 1080p w/sound

```
{
  "taskType": "videoInference",
  "taskUUID": "f47ac10b-58cc-4372-a567-0e02b2c3d493",
  "model": "lightricks:2@1",
  "positivePrompt": "Fast-paced action sequence with dynamic camera movements following a chase through urban environment",
  "duration": 6,
  "width": 1920,
  "height": 1080,
  "providerSettings": {
    "lightricks": {
      "generateAudio": true
    }
  }
}
```

 Image-to-video 4K

```
{
  "taskType": "videoInference",
  "taskUUID": "6ba7b832-9dad-11d1-80b4-00c04fd430c8",
  "model": "lightricks:2@1",
  "frameImages": [
    {
      "inputImage": "c64351d5-4c59-42f7-95e1-eace013eddab",
      "frame": "first"
    }
  ],
  "positivePrompt": "Quick zoom out revealing the full scene with smooth motion",
  "duration": 8,
  "width": 3840,
  "height": 1440
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