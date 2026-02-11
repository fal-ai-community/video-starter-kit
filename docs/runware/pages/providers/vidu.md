---
title: Vidu
source_url: https://runware.ai/docs/en/providers/vidu
fetched_at: 2025-10-27 03:51:45
---

## [Introduction](#introduction)

Vidu's AI models are integrated into the Runware platform through our unified API, providing access to **advanced video generation** with specialized capabilities for different creative workflows and quality requirements.

Through the `providerSettings.vidu` object, you can access Vidu's unique features such as **movement amplitude control**, **background music generation**, and **style selection**, while maintaining the consistency of Runware's standard API structure. This page documents the **technical specifications, parameter requirements, and provider-specific settings** for all Vidu models available through our platform.

`providerSettings` » `vidu` [vidu](https://runware.ai/docs/en/video-inference/api-reference#request-providersettings-vidu) object
:   Configuration settings specific to Vidu's video generation models. These settings control movement dynamics, background music generation, and visual styles for video content.

      View example 

    ```
    "providerSettings": {
      "vidu": { 
        "movementAmplitude": "medium",
        "bgm": true,
        "style": "anime"
      } 
    }
    ```

       Properties
    ⁨3⁩ properties 

    `providerSettings` » `vidu` » `movementamplitude` [movementamplitude](https://runware.ai/docs/en/video-inference/api-reference#request-providersettings-vidu-movementamplitude) string Default: auto
    :   Controls the intensity and scale of movement within the generated video content. This parameter affects how dynamic or subtle the motion appears in the final output.

        **Available values:**

        - `auto`: Automatically determines the appropriate movement level based on the content and prompt.
        - `small`: Minimal movement with subtle animations and gentle transitions.
        - `medium`: Moderate movement with balanced dynamics.
        - `large`: High movement with pronounced animations and dramatic motion.

        The movement amplitude affects elements such as camera motion, object movement, and overall scene dynamics throughout the video.

    `providerSettings` » `vidu` » `bgm` [bgm](https://runware.ai/docs/en/video-inference/api-reference#request-providersettings-vidu-bgm) boolean Default: false
    :   Controls whether background music is generated and included in the video content. When enabled, the model creates appropriate background music that complements the visual content and enhances the overall viewing experience.

        Background music generation is only supported for 4-second videos. This feature is not available for longer video durations.

        The generated background music is designed to match the mood, pace, and style of the video content automatically.

    `providerSettings` » `vidu` » `style` [style](https://runware.ai/docs/en/video-inference/api-reference#request-providersettings-vidu-style) string Default: general
    :   Specifies the visual style and artistic approach for the generated video content. This parameter influences the overall aesthetic and rendering style of the output.

        **Available values:**

        - `general`: Standard photorealistic style suitable for most content types.
        - `anime`: Animated style with characteristic anime/manga visual elements and aesthetics.

        Style selection is only supported for text-to-video generation. This parameter is not available for other video generation modes.

## [Video models](#video-models)

### [Vidu 1.5](#vidu-15)

Vidu's 1.5 model offers enhanced visual quality and comprehensive workflow support across multiple resolution options for versatile content creation.

**Model AIR ID**: `vidu:1@5`.

**Supported workflows**: Text-to-video, image-to-video, reference-to-video.

**Technical specifications**:

- Positive prompt: 2-3000 characters (required for text-to-video and reference-to-video, optional for image-to-video).
- Supported dimensions: 1920×1080 (16:9), 1080×1080 (1:1), 1080×1920 (9:16), 1280×720 (16:9), 720×720 (1:1), 720×1280 (9:16), 640×360 (16:9), 360×360 (1:1), 360×640 (9:16).
- Frame rate: 24 FPS.
- Duration: 4 seconds (all resolutions), 8 seconds (720p only).
- Frame images: Supports first and last frame for `frameImages`.
- Reference images: Supports single image for reference-to-video.
- Input image requirements: Width and height between 300-2048 pixels, 20MB file size limit.

**Provider-specific settings**:

Parameters supported: [`movementAmplitude`](/docs/en/video-inference/api-reference#request-providersettings-vidu-movementamplitude), [`bgm`](/docs/en/video-inference/api-reference#request-providersettings-vidu-bgm), [`style`](/docs/en/video-inference/api-reference#request-providersettings-vidu-style).

Text-to-video

```
{
  "taskType": "videoInference",
  "taskUUID": "24cd5dff-cb81-4db5-8506-b72a9425f9d1",
  "model": "vidu:1@5",
  "positivePrompt": "Anime-style character walking through a magical forest with glowing particles",
  "duration": 4,
  "width": 1920,
  "height": 1080,
  "providerSettings": {
    "vidu": {
      "movementAmplitude": "medium",
      "bgm": true,
      "style": "anime"
    }
  }
}
```

 Reference-to-video

```
{
  "taskType": "videoInference",
  "taskUUID": "b8c4d952-7f27-4a6e-bc9a-83f01d1c6d59",
  "model": "vidu:1@5",
  "positivePrompt": "Dynamic camera movement showcasing the architectural details",
  "referenceImages": [
    "c64351d5-4c59-42f7-95e1-eace013eddab"
  ],
  "duration": 8,
  "width": 1280,
  "height": 720,
  "providerSettings": {
    "vidu": {
      "movementAmplitude": "large"
    }
  }
}
```

### [Vidu 2.0](#vidu-20)

Vidu's 2.0 model delivers advanced image-based video generation with enhanced lighting, emotion dynamics, and automatic frame interpolation for polished visual content.

**Model AIR ID**: `vidu:2@0`.

**Supported workflows**: Image-to-video, reference-to-video.

**Technical specifications**:

- Positive prompt: 2-3000 characters (required for reference-to-video, optional for other workflows).
- Supported dimensions: 1920×1080 (16:9), 1080×1080 (1:1), 1080×1920 (9:16), 1280×720 (16:9), 720×720 (1:1), 720×1280 (9:16), 640×360 (16:9), 360×360 (1:1), 360×640 (9:16).
- Frame rate: 24 FPS.
- Duration: 4 seconds (all resolutions), 8 seconds (720p only).
- Frame images: Supports first and last frame for `frameImages`.
- Reference images: Supports single image for reference-to-video.
- Input image requirements: Width and height between 300-2048 pixels, 20MB file size limit.

**Provider-specific settings**:

Parameters supported: [`movementAmplitude`](/docs/en/video-inference/api-reference#request-providersettings-vidu-movementamplitude), [`bgm`](/docs/en/video-inference/api-reference#request-providersettings-vidu-bgm).

Image-to-video

```
{
  "taskType": "videoInference",
  "taskUUID": "24cd5dff-cb81-4db5-8506-b72a9425f9d1",
  "model": "vidu:2@0",
  "frameImages": [
    {
      "inputImage": "c64351d5-4c59-42f7-95e1-eace013eddab",
      "frame": "first"
    }
  ],
  "duration": 4,
  "width": 1920,
  "height": 1080,
  "providerSettings": {
    "vidu": {
      "movementAmplitude": "medium",
      "bgm": true
    }
  }
}
```

 Reference-to-video

```
{
  "taskType": "videoInference",
  "taskUUID": "b8c4d952-7f27-4a6e-bc9a-83f01d1c6d59",
  "model": "vidu:2@0",
  "positivePrompt": "Cinematic lighting with enhanced emotion and scene depth",
  "referenceImages": [
    "c64351d5-4c59-42f7-95e1-eace013eddab"
  ],
  "duration": 4,
  "width": 640,
  "height": 360,
  "providerSettings": {
    "vidu": {
      "movementAmplitude": "small",
      "bgm": true
    }
  }
}
```

### [Vidu Q1 Classic](#vidu-q1-classic)

Vidu's Q1 Classic model provides fast video generation with first and last frame control, optimized for quick prototyping and structured video creation.

**Model AIR ID**: `vidu:1@0`.

**Supported workflows**: First and last frame to video.

**Technical specifications**:

- Supported dimensions: 1920×1080 (16:9).
- Frame rate: 24 FPS.
- Duration: 5 seconds.
- Frame images: Supports first and last frame for `frameImages`.
- Input image requirements: Width and height between 300-2048 pixels, 20MB file size limit.

**Provider-specific settings**:

Parameters supported: [`movementAmplitude`](/docs/en/video-inference/api-reference#request-providersettings-vidu-movementamplitude).

```
{
  "taskType": "videoInference",
  "taskUUID": "24cd5dff-cb81-4db5-8506-b72a9425f9d1",
  "model": "vidu:1@0",
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
  "duration": 5,
  "width": 1920,
  "height": 1080,
  "providerSettings": {
    "vidu": {
      "movementAmplitude": "medium"
    }
  }
}
```

### [Vidu Q1](#vidu-q1)

Vidu's Q1 model represents the latest generation with professional-quality output, multi-reference support, and built-in AI audio capabilities for industry-standard content creation.

**Model AIR ID**: `vidu:1@1`.

**Supported workflows**: Text-to-video, image-to-video.

**Technical specifications**:

- Positive prompt: 2-3000 characters (required for text-to-video, optional for other workflows).
- Supported dimensions: 1920×1080 (16:9), 1080×1080 (1:1), 1080×1920 (9:16).
- Frame rate: 24 FPS.
- Duration: 5 seconds.
- Frame images: Supports first and last frame for `frameImages`.
- Input image requirements: Width and height between 300-2048 pixels, 20MB file size limit.

**Provider-specific settings**:

Parameters supported: [`movementAmplitude`](/docs/en/video-inference/api-reference#request-providersettings-vidu-movementamplitude), [`bgm`](/docs/en/video-inference/api-reference#request-providersettings-vidu-bgm), [`style`](/docs/en/video-inference/api-reference#request-providersettings-vidu-style).

Text-to-video

```
{
  "taskType": "videoInference",
  "taskUUID": "24cd5dff-cb81-4db5-8506-b72a9425f9d1",
  "model": "vidu:1@1",
  "positivePrompt": "A peaceful garden scene with butterflies flying among colorful flowers",
  "duration": 5,
  "width": 1920,
  "height": 1080,
  "providerSettings": {
    "vidu": {
      "movementAmplitude": "small",
      "style": "general"
    }
  }
}
```

 Image-to-video

```
{
  "taskType": "videoInference",
  "taskUUID": "b8c4d952-7f27-4a6e-bc9a-83f01d1c6d59",
  "model": "vidu:1@1",
  "frameImages": [
    {
      "inputImage": "c64351d5-4c59-42f7-95e1-eace013eddab",
      "frame": "first"
    }
  ],
  "duration": 5,
  "width": 1080,
  "height": 1080,
  "providerSettings": {
    "vidu": {
      "movementAmplitude": "large"
    }
  }
}
```

### [Vidu Q2 Turbo](#vidu-q2-turbo)

Vidu's Q2 Turbo model delivers high-quality video generation with extremely fast generation speed, maintaining stable large-scale movements and camera operations. Optimized for scenarios requiring both quality and speed.

**Model AIR ID**: `vidu:3@2`.

**Supported workflows**: Text to video, first/last frame to video, reference to video.

**Technical specifications**:

- Positive prompt: 2-3000 characters (required for text-to-video, optional for image-to-video).
- Supported dimensions:
  - **360p**: 640×352 (16:9), 544×400 (4:3), 480×480 (1:1), 400×544 (3:4), 352×640 (9:16).
  - **540p**: 960×528 (16:9), 816×608 (4:3), 720×720 (1:1), 608×816 (3:4), 528×960 (9:16).
  - **720p**: 1280×720 (16:9), 1104×816 (4:3), 960×960 (1:1), 816×1104 (3:4), 720×1280 (9:16).
  - **1080p**: 1920×1080 (16:9), 1674×1238 (4:3), 1440×1440 (1:1), 1238×1674 (3:4), 1080×1920 (9:16).
- Frame rate: 24 FPS.
- Duration: 1-8 second (Default: 5).
- Frame images: Supports first and last frame for `frameImages`.
- Reference images: Supports `referenceImages` with 7 images.
- Input image requirements: Width and height between 300-2048 pixels, 20MB file size limit.

When using `frameImages`, the output dimensions are automatically inferred from the first frame image. The `width` and `height` parameters should not be specified.

**Provider-specific settings**:

Parameters supported: [`movementAmplitude`](/docs/en/video-inference/api-reference#request-providersettings-vidu-movementamplitude), [`bgm`](/docs/en/video-inference/api-reference#request-providersettings-vidu-bgm).

Text-to-video

```
{
  "taskType": "videoInference",
  "taskUUID": "f47ac10b-58cc-4372-a567-0e02b2c3d492",
  "model": "vidu:3@2",
  "positivePrompt": "A woman walks through a bustling marketplace, camera follows her movements smoothly",
  "duration": 5,
  "width": 1920,
  "height": 1080,
  "providerSettings": {
    "vidu": {
      "movementAmplitude": "large"
    }
  }
}
```

 Image-to-video (single frame)

```
{
  "taskType": "videoInference",
  "taskUUID": "6ba7b831-9dad-11d1-80b4-00c04fd430c8",
  "model": "vidu:3@2",
  "frameImages": [
    {
      "inputImage": "c64351d5-4c59-42f7-95e1-eace013eddab",
      "frame": "first"
    }
  ],
  "positivePrompt": "Character showing excitement and joy with animated movements",
  "duration": 3,
  "width": 1280,
  "height": 720,
  "providerSettings": {
    "vidu": {
      "movementAmplitude": "medium"
    }
  }
}
```

 Image-to-video (first and last frames)

```
{
  "taskType": "videoInference",
  "taskUUID": "550e8400-e29b-41d4-a716-446655440012",
  "model": "vidu:3@2",
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
  "positivePrompt": "Smooth camera transition between the two scenes",
  "duration": 8,
  "width": 1280,
  "height": 720,
  "providerSettings": {
    "vidu": {
      "movementAmplitude": "large"
    }
  }
}
```

### [Vidu Q2 Pro](#vidu-q2-pro)

Vidu's Q2 Pro model delivers extremely high-quality video generation with more delicate motion portrayal, maintaining exceptional output quality even under large-scale movements and camera operations. Ideal for professional film and television production.

**Model AIR ID**: `vidu:3@1`.

**Supported workflows**: Text to video, first/last frame to video, reference to video.

**Technical specifications**:

- Positive prompt: 2-3000 characters (required for text-to-video, optional for image-to-video).
- Supported dimensions:
  - **360p**: 640×352 (16:9), 544×400 (4:3), 480×480 (1:1), 400×544 (3:4), 352×640 (9:16).
  - **540p**: 960×528 (16:9), 816×608 (4:3), 720×720 (1:1), 608×816 (3:4), 528×960 (9:16).
  - **720p**: 1280×720 (16:9), 1104×816 (4:3), 960×960 (1:1), 816×1104 (3:4), 720×1280 (9:16).
  - **1080p**: 1920×1080 (16:9), 1674×1238 (4:3), 1440×1440 (1:1), 1238×1674 (3:4), 1080×1920 (9:16).
- Frame rate: 24 FPS.
- Duration: 1-8 second (Default: 5).
- Frame images: Supports first and last frame for `frameImages`.
- Reference images: Supports `referenceImages` with 7 images.
- Input image requirements: Width and height between 300-2048 pixels, 20MB file size limit.

When using `frameImages`, the output dimensions are automatically inferred from the first frame image. The `width` and `height` parameters should not be specified.

**Provider-specific settings**:

Parameters supported: [`movementAmplitude`](/docs/en/video-inference/api-reference#request-providersettings-vidu-movementamplitude), [`bgm`](/docs/en/video-inference/api-reference#request-providersettings-vidu-bgm).

Text-to-video

```
{
  "taskType": "videoInference",
  "taskUUID": "f47ac10b-58cc-4372-a567-0e02b2c3d493",
  "model": "vidu:3@1",
  "positivePrompt": "Cinematic crane shot revealing an ancient temple in misty mountains with dramatic lighting",
  "duration": 8,
  "width": 1920,
  "height": 1080,
  "providerSettings": {
    "vidu": {
      "movementAmplitude": "large",
      "bgm": true
    }
  }
}
```

 Image-to-video (emotional portrayal)

```
{
  "taskType": "videoInference",
  "taskUUID": "6ba7b832-9dad-11d1-80b4-00c04fd430c8",
  "model": "vidu:3@1",
  "frameImages": [
    {
      "inputImage": "c64351d5-4c59-42f7-95e1-eace013eddab",
      "frame": "first"
    }
  ],
  "positivePrompt": "Character expressing deep emotion with subtle facial expressions and natural movements",
  "duration": 5
  "providerSettings": {
    "vidu": {
      "movementAmplitude": "small"
    }
  }
}
```

 Image-to-video (action sequence)

```
{
  "taskType": "videoInference",
  "taskUUID": "550e8400-e29b-41d4-a716-446655440013",
  "model": "vidu:3@1",
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
  "positivePrompt": "Character performs complex action sequence with precise motion control",
  "duration": 8
  "providerSettings": {
    "vidu": {
      "movementAmplitude": "large",
      "bgm": true
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