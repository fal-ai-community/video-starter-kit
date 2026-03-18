---
title: KlingAI provider
source_url: https://runware.ai/docs/en/providers/klingai
fetched_at: 2025-10-27 03:51:48
---

## [Introduction](#introduction)

KlingAI's AI models are integrated into the Runware platform through our unified API, providing access to **advanced video generation** across multiple model generations and quality tiers.

KlingAI offers a comprehensive range of models from cost-effective Standard versions to high-end Master tiers, each optimized for different use cases and quality requirements. This page documents the **technical specifications, parameter requirements, and model capabilities** for all KlingAI models available through our platform.

## [Video models](#video-models)

### [KlingAI 1.0 Standard](#klingai-10-standard)

KlingAI's 1.0 Standard model provides cost-effective video generation with flexible controls and cinematic motion, ideal for simple scenes and single character focus.

**Model AIR ID**: `klingai:1@1`.

**Supported workflows**: Text-to-video, image-to-video.

**Technical specifications**:

- Positive prompt: 2-2500 characters.
- Negative prompt: 2-2500 characters (optional).
- CFG Scale: 0-1 (default: 0.5).
- Supported dimensions: 1280×720 (16:9), 720×720 (1:1), 720×1280 (9:16).
- Frame rate: 30 FPS.
- Duration: 5 or 10 seconds.
- Frame images: Supports first frame for `frameImages`.
- Input image requirements: Width and height between 300-2048 pixels, 20MB file size limit.

Text-to-video

```
{
  "taskType": "videoInference",
  "taskUUID": "24cd5dff-cb81-4db5-8506-b72a9425f9d1",
  "model": "klingai:1@1",
  "positivePrompt": "A person walking through a peaceful garden with soft sunlight filtering through trees",
  "duration": 5,
  "width": 1280,
  "height": 720
}
```

 Image-to-video

```
{
  "taskType": "videoInference",
  "taskUUID": "b8c4d952-7f27-4a6e-bc9a-83f01d1c6d59",
  "model": "klingai:1@1",
  "frameImages": [
    {
      "inputImage": "c64351d5-4c59-42f7-95e1-eace013eddab",
      "frame": "first"
    }
  ],
  "duration": 10,
  "width": 720,
  "height": 720
}
```

### [KlingAI 1.0 Pro](#klingai-10-pro)

KlingAI's 1.0 Pro model builds on the Standard version with higher fidelity, better prompt adherence, and enhanced stability for complex scenes.

**Model AIR ID**: `klingai:1@2`.

**Supported workflows**: Text-to-video, image-to-video.

**Technical specifications**:

- Positive prompt: 2-2500 characters.
- Negative prompt: 2-2500 characters (optional).
- CFG Scale: 0-1 (default: 0.5).
- Supported dimensions: 1280×720 (16:9), 720×720 (1:1), 720×1280 (9:16).
- Frame rate: 30 FPS.
- Duration: 5 or 10 seconds.
- Frame images: Supports first frame for `frameImages`.
- Input image requirements: Width and height between 300-2048 pixels, 20MB file size limit.

Text-to-video

```
{
  "taskType": "videoInference",
  "taskUUID": "24cd5dff-cb81-4db5-8506-b72a9425f9d1",
  "model": "klingai:1@2",
  "positivePrompt": "A complex scene with multiple characters interacting in a bustling marketplace",
  "negativePrompt": "blurry, low quality",
  "duration": 10,
  "width": 720,
  "height": 1280
}
```

 Image-to-video

```
{
  "taskType": "videoInference",
  "taskUUID": "b8c4d952-7f27-4a6e-bc9a-83f01d1c6d59",
  "model": "klingai:1@2",
  "frameImages": [
    {
      "inputImage": "c64351d5-4c59-42f7-95e1-eace013eddab",
      "frame": "first"
    }
  ],
  "duration": 5,
  "width": 1280,
  "height": 720
}
```

### [KlingAI 1.5 Standard](#klingai-15-standard)

KlingAI's 1.5 Standard model offers upgraded visuals with crisper output and fewer artifacts compared to 1.0, providing a good balance of quality and cost.

**Model AIR ID**: `klingai:2@1`.

**Supported workflows**: Image-to-video.

**Technical specifications**:

- CFG Scale: 0-1 (default: 0.5).
- Supported dimensions: 1280×720 (16:9), 720×720 (1:1), 720×1280 (9:16).
- Frame rate: 30 FPS.
- Duration: 5 or 10 seconds.
- Frame images: Supports first frame for `frameImages`.
- Input image requirements: Width and height between 300-2048 pixels, 20MB file size limit.

KlingAI 1.5 Standard supports **image-to-video generation only** and does not support text-to-video workflows.

```
{
  "taskType": "videoInference",
  "taskUUID": "f3a2b8c9-1e47-4d3a-9b2f-8c7e6d5a4b3c",
  "model": "klingai:2@1",
  "frameImages": [
    {
      "inputImage": "c64351d5-4c59-42f7-95e1-eace013eddab",
      "frame": "first"
    }
  ],
  "duration": 5,
  "width": 1280,
  "height": 720
}
```

### [KlingAI 1.5 Pro](#klingai-15-pro)

KlingAI's 1.5 Pro model unlocks the full potential of version 1.5 with higher resolution support up to 1080p and enhanced motion controls.

**Model AIR ID**: `klingai:2@2`.

**Supported workflows**: Image-to-video.

**Technical specifications**:

- CFG Scale: 0-1 (default: 0.5).
- Supported dimensions: 1920×1080 (16:9), 1080×1080 (1:1), 1080×1920 (9:16).
- Frame rate: 30 FPS.
- Duration: 5 or 10 seconds.
- Frame images: Supports first frame for `frameImages`.
- Input image requirements: Width and height between 300-2048 pixels, 20MB file size limit.

KlingAI 1.5 Pro supports **image-to-video generation only** and does not support text-to-video workflows.

```
{
  "taskType": "videoInference",
  "taskUUID": "f3a2b8c9-1e47-4d3a-9b2f-8c7e6d5a4b3c",
  "model": "klingai:2@2",
  "frameImages": [
    {
      "inputImage": "c64351d5-4c59-42f7-95e1-eace013eddab",
      "frame": "first"
    }
  ],
  "duration": 10,
  "width": 1920,
  "height": 1080
}
```

### [KlingAI 1.6 Standard](#klingai-16-standard)

KlingAI's 1.6 Standard model provides incremental improvements in motion smoothness and prompt handling over version 1.5.

**Model AIR ID**: `klingai:3@1`.

**Supported workflows**: Text-to-video, image-to-video.

**Technical specifications**:

- Positive prompt: 2-2500 characters.
- Negative prompt: 2-2500 characters (optional).
- CFG Scale: 0-1 (default: 0.5).
- Supported dimensions: 1280×720 (16:9), 720×720 (1:1), 720×1280 (9:16).
- Frame rate: 30 FPS (text-to-video), 24 FPS (image-to-video).
- Duration: 5 or 10 seconds.
- Frame images: Supports first frame for `frameImages`.
- Input image requirements: Width and height between 300-2048 pixels, 20MB file size limit.

Text-to-video

```
{
  "taskType": "videoInference",
  "taskUUID": "24cd5dff-cb81-4db5-8506-b72a9425f9d1",
  "model": "klingai:3@1",
  "positivePrompt": "Smooth camera movement following a cyclist through a scenic mountain trail",
  "duration": 5,
  "width": 720,
  "height": 720
}
```

 Image-to-video

```
{
  "taskType": "videoInference",
  "taskUUID": "b8c4d952-7f27-4a6e-bc9a-83f01d1c6d59",
  "model": "klingai:3@1",
  "frameImages": [
    {
      "inputImage": "c64351d5-4c59-42f7-95e1-eace013eddab",
      "frame": "first"
    }
  ],
  "duration": 10,
  "width": 1280,
  "height": 720
}
```

### [KlingAI 1.6 Pro](#klingai-16-pro)

KlingAI's 1.6 Pro model builds on 1.6 capabilities with enhanced quality and 1080p resolution support.

**Model AIR ID**: `klingai:3@2`.

**Supported workflows**: Image-to-video.

**Technical specifications**:

- CFG Scale: 0-1 (default: 0.5).
- Supported dimensions: 1920×1080 (16:9), 1080×1080 (1:1), 1080×1920 (9:16).
- Frame rate: 24 FPS.
- Duration: 5 or 10 seconds.
- Frame images: Supports first frame for `frameImages`.
- Input image requirements: Width and height between 300-2048 pixels, 20MB file size limit.

KlingAI 1.6 Pro supports **image-to-video generation only** and does not support text-to-video workflows.

```
{
  "taskType": "videoInference",
  "taskUUID": "f3a2b8c9-1e47-4d3a-9b2f-8c7e6d5a4b3c",
  "model": "klingai:3@2",
  "frameImages": [
    {
      "inputImage": "c64351d5-4c59-42f7-95e1-eace013eddab",
      "frame": "first"
    }
  ],
  "duration": 5,
  "width": 1080,
  "height": 1920
}
```

### [KlingAI 2.0 Master](#klingai-20-master)

KlingAI's 2.0 Master model targets cinematic realism with high-end motion fidelity and strong prompt responsiveness for production-quality output.

**Model AIR ID**: `klingai:4@3`.

**Supported workflows**: Text-to-video, image-to-video.

**Technical specifications**:

- Positive prompt: 2-2500 characters.
- Negative prompt: 2-2500 characters (optional).
- CFG Scale: 0-1 (default: 0.5).
- Supported dimensions: 1280×720 (16:9), 720×720 (1:1), 720×1280 (9:16).
- Frame rate: 24 FPS.
- Duration: 5 or 10 seconds.
- Frame images: Supports first frame for `frameImages`.
- Input image requirements: Width and height between 300-2048 pixels, 20MB file size limit.

Text-to-video

```
{
  "taskType": "videoInference",
  "taskUUID": "24cd5dff-cb81-4db5-8506-b72a9425f9d1",
  "model": "klingai:4@3",
  "positivePrompt": "Cinematic close-up of rain drops falling on a leaf with shallow depth of field",
  "negativePrompt": "blurry, unrealistic, low quality",
  "duration": 5,
  "width": 1280,
  "height": 720
}
```

 Image-to-video

```
{
  "taskType": "videoInference",
  "taskUUID": "b8c4d952-7f27-4a6e-bc9a-83f01d1c6d59",
  "model": "klingai:4@3",
  "frameImages": [
    {
      "inputImage": "c64351d5-4c59-42f7-95e1-eace013eddab",
      "frame": "first"
    }
  ],
  "duration": 10,
  "width": 720,
  "height": 1280
}
```

### [KlingAI 2.1 Standard](#klingai-21-standard)

KlingAI's 2.1 Standard model refines the 2.0 generation with smoother animations while maintaining cost-effective access to advanced features.

**Model AIR ID**: `klingai:5@1`.

**Supported workflows**: Image-to-video.

**Technical specifications**:

- CFG Scale: 0-1 (default: 0.5).
- Supported dimensions: 1280×720 (16:9), 720×720 (1:1), 720×1280 (9:16).
- Frame rate: 24 FPS.
- Duration: 5 or 10 seconds.
- Frame images: Supports first frame for `frameImages`.
- Input image requirements: Width and height between 300-2048 pixels, 20MB file size limit.

KlingAI 2.1 Standard supports **image-to-video generation only** and does not support text-to-video workflows.

```
{
  "taskType": "videoInference",
  "taskUUID": "f3a2b8c9-1e47-4d3a-9b2f-8c7e6d5a4b3c",
  "model": "klingai:5@1",
  "frameImages": [
    {
      "inputImage": "c64351d5-4c59-42f7-95e1-eace013eddab",
      "frame": "first"
    }
  ],
  "duration": 10,
  "width": 720,
  "height": 720
}
```

### [KlingAI 2.1 Pro](#klingai-21-pro)

KlingAI's 2.1 Pro model unlocks higher frame fidelity and Full HD output, providing a middle ground between Standard and Master tiers.

**Model AIR ID**: `klingai:5@2`.

**Supported workflows**: Image-to-video.

**Technical specifications**:

- CFG Scale: 0-1 (default: 0.5).
- Supported dimensions: 1920×1080 (16:9), 1080×1080 (1:1), 1080×1920 (9:16).
- Frame rate: 24 FPS.
- Duration: 5 or 10 seconds.
- Frame images: Supports first and last frame for `frameImages`.
- Input image requirements: Width and height between 300-2048 pixels, 20MB file size limit.

KlingAI 2.1 Pro supports **image-to-video generation only** and does not support text-to-video workflows.

```
{
  "taskType": "videoInference",
  "taskUUID": "f3a2b8c9-1e47-4d3a-9b2f-8c7e6d5a4b3c",
  "model": "klingai:5@2",
  "frameImages": [
    {
      "inputImage": "c64351d5-4c59-42f7-95e1-eace013eddab",
      "frame": "first"
    }
  ],
  "duration": 5,
  "width": 1920,
  "height": 1080
}
```

### [KlingAI 2.1 Master](#klingai-21-master)

KlingAI's 2.1 Master model represents the peak of the KlingAI stack with Full HD image-to-video, ultra-fluid motion, and exceptional prompt precision for VFX-grade output.

**Model AIR ID**: `klingai:5@3`.

**Supported workflows**: Text-to-video, image-to-video.

**Technical specifications**:

- Positive prompt: 2-2500 characters.
- Negative prompt: 2-2500 characters (optional).
- CFG Scale: 0-1 (default: 0.5).
- Supported dimensions: 1920×1080 (16:9), 1080×1080 (1:1), 1080×1920 (9:16).
- Frame rate: 24 FPS.
- Duration: 5 or 10 seconds.
- Frame images: Supports first frame for `frameImages`.
- Input image requirements: Width and height between 300-2048 pixels, 20MB file size limit.

Text-to-video

```
{
  "taskType": "videoInference",
  "taskUUID": "24cd5dff-cb81-4db5-8506-b72a9425f9d1",
  "model": "klingai:5@3",
  "positivePrompt": "Cinematic aerial shot of waves crashing against dramatic cliffs during golden hour",
  "negativePrompt": "blurry, low quality, distorted",
  "duration": 10
}
```

 Image-to-video

```
{
  "taskType": "videoInference",
  "taskUUID": "b8c4d952-7f27-4a6e-bc9a-83f01d1c6d59",
  "model": "klingai:5@3",
  "frameImages": [
    {
      "inputImage": "c64351d5-4c59-42f7-95e1-eace013eddab",
      "frame": "first"
    }
  ],
  "duration": 5,
  "width": 1080,
  "height": 1080
}
```

### [KlingAI 2.5 Turbo Standard](#klingai-25-turbo-standard)

Efficient edition of the 2.5 Turbo series designed for smooth, cinematic image-to-video generation. Delivers videos with strong motion control and dynamic composition, optimized for fast creative workflows.

**Model AIR ID**: `klingai:6@0`.

**Supported workflows**: Image-to-video.

**Technical specifications**:

- Positive prompt: 2-2500 characters.
- Negative prompt: 2-2500 characters (optional).
- CFG Scale: 0-1 (default: 0.5).
- Frame rate: 30 FPS.
- Duration: 5 or 10 seconds.
- Frame images: Supports first frame for `frameImages`.
- Input image requirements: Width and height between 300-2048 pixels, 20MB file size limit.

The output dimensions are automatically inferred from the first frame image. The `width` and `height` parameters should not be specified.

Image-to-video

```
{
  "taskType": "videoInference",
  "taskUUID": "b8c4d952-7f27-4a6e-bc9a-83f01d1c6d61",
  "model": "klingai:6@0",
  "frameImages": [
    {
      "inputImage": "c64351d5-4c59-42f7-95e1-eace013eddab",
      "frame": "first"
    }
  ],
  "duration": 10
}
```

### [KlingAI 2.5 Turbo Pro](#klingai-25-turbo-pro)

KlingAI's 2.5 Turbo Pro model delivers next-level creativity with turbocharged motion and cinematic visuals, featuring precise prompt adherence for both text-to-video and image-to-video workflows. This model combines enhanced motion fluidity with professional-grade cinematic capabilities.

**Model AIR ID**: `klingai:6@1`.

**Supported workflows**: Text-to-video, image-to-video.

**Technical specifications**:

- Positive prompt: 2-2500 characters.
- Negative prompt: 2-2500 characters (optional).
- CFG Scale: 0-1 (default: 0.5).
- Supported dimensions: 1280×720 (16:9), 720×720 (1:1), 720×1280 (9:16).
- Frame rate: 30 FPS.
- Duration: 5 or 10 seconds.
- Frame images: Supports first frame for `frameImages`.
- Input image requirements: Width and height between 300-2048 pixels, 20MB file size limit.

Text-to-video

```
{
  "taskType": "videoInference",
  "taskUUID": "24cd5dff-cb81-4db5-8506-b72a9425f9d2",
  "model": "klingai:6@1",
  "positivePrompt": "Cinematic aerial drone shot following a motorcycle racing through winding mountain roads at golden hour",
  "duration": 10,
  "width": 1280,
  "height": 720
}
```

 Image-to-video

```
{
  "taskType": "videoInference",
  "taskUUID": "b8c4d952-7f27-4a6e-bc9a-83f01d1c6d60",
  "model": "klingai:6@1",
  "frameImages": [
    {
      "inputImage": "c64351d5-4c59-42f7-95e1-eace013eddab",
      "frame": "first"
    }
  ],
  "duration": 5,
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