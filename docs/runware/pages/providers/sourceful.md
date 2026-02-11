---
title: Sourceful
source_url: https://runware.ai/docs/en/providers/sourceful
fetched_at: 2025-10-27 03:51:43
---

## [Introduction](#introduction)

Sourceful is a technology company that provides a full-stack platform for branded packaging design, sourcing, and supply chain management with AI-enabled workflows. Through their platform, brands can generate packaging concepts in seconds, refine designs with human artworkers, access a vetted global supplier network for production, and track sustainability metrics throughout the process.

Sourceful's Riverflow AI models represent a key component of their design capabilities, now available through Runware's unified API. Riverflow achieves state-of-the-art performance in global image editing benchmarks, bringing the same design-grade precision used for print-ready packaging to developers and platforms worldwide. The models excel at complex retouching, object replacement, color correction, lighting adjustment, and text refinement with millimeter-level accuracy required for professional design work.

## [Image models](#image-models)

### [Riverflow 1 Mini](#riverflow-1-mini)

A fast and cost-efficient image editing model that delivers performance close to Riverflow 1 across most tasks, optimized for speed and accessibility.

**Model AIR ID**: `sourceful:1@0`.

**Supported workflows**: Image-to-image editing.

**Technical specifications**:

- Positive prompt: Required.
- Reference images: Supports `inputs.references` with 1-10 images.
- Supported dimensions: 1024×1024 (1:1), 1152×864 (4:3), 864×1152 (3:4), 1280×720 (16:9), 720×1280 (9:16), 1248×832 (3:2), 832×1248 (2:3), 1512×648 (21:9), 648×1512 (9:21), 1152×896 (5:4), 896×1152 (4:5).
- Input image requirements: Width and height between 300-2048 pixels, 20MB file size limit.

Basic editing

```
{
  "taskType": "imageInference",
  "taskUUID": "f47ac10b-58cc-4372-a567-0e02b2c3d489",
  "model": "sourceful:1@0",
  "positivePrompt": "Remove the coffee stain from the packaging design",
  "width": 1024,
  "height": 1024,
  "inputs": {
    "references": ["c64351d5-4c59-42f7-95e1-eace013eddab"]
  }
}
```

 Multi-image editing

```
{
  "taskType": "imageInference",
  "taskUUID": "6ba7b828-9dad-11d1-80b4-00c04fd430c8",
  "model": "sourceful:1@0",
  "positivePrompt": "Change the product color to midnight blue while maintaining all other design elements",
  "width": 1280,
  "height": 720,
  "inputs": {
    "references": [
      "c64351d5-4c59-42f7-95e1-eace013eddab",
      "d7e8f9a0-2b5c-4e7f-a1d3-9c8b7a6e5d4f"
    ]
  }
}
```

### [Riverflow 1](#riverflow-1)

A versatile daily image editing model supporting up to 10 input images with precise visual edits across 11 aspect ratios and transparent backgrounds. Achieves state-of-the-art performance in global benchmarks.

**Model AIR ID**: `sourceful:1@1`.

**Supported workflows**: Image-to-image editing.

**Technical specifications**:

- Positive prompt: Required.
- Reference images: Supports `inputs.references` with 1-10 images.
- Supported dimensions: 1024×1024 (1:1), 1152×864 (4:3), 864×1152 (3:4), 1280×720 (16:9), 720×1280 (9:16), 1248×832 (3:2), 832×1248 (2:3), 1512×648 (21:9), 648×1512 (9:21), 1152×896 (5:4), 896×1152 (4:5).
- Input image requirements: Width and height between 300-2048 pixels, 20MB file size limit.

Text refinement

```
{
  "taskType": "imageInference",
  "taskUUID": "f47ac10b-58cc-4372-a567-0e02b2c3d490",
  "model": "sourceful:1@1",
  "positivePrompt": "Change the text from 'ORGANIC COFFEE' to 'PREMIUM BLEND' maintaining the same typography style",
  "width": 1024,
  "height": 1024,
  "inputs": {
    "references": ["c64351d5-4c59-42f7-95e1-eace013eddab"]
  }
}
```

 Object replacement

```
{
  "taskType": "imageInference",
  "taskUUID": "6ba7b829-9dad-11d1-80b4-00c04fd430c8",
  "model": "sourceful:1@1",
  "positivePrompt": "Replace the glass bottle with an aluminum can while keeping the label design identical",
  "width": 1184,
  "height": 880,
  "inputs": {
    "references": ["c64351d5-4c59-42f7-95e1-eace013eddab"]
  }
}
```

 Imperfection removal

```
{
  "taskType": "imageInference",
  "taskUUID": "550e8400-e29b-41d4-a716-446655440010",
  "model": "sourceful:1@1",
  "positivePrompt": "Remove scratches and water drops without altering any other part of the packaging",
  "width": 1280,
  "height": 720,
  "inputs": {
    "references": ["c64351d5-4c59-42f7-95e1-eace013eddab"]
  }
}
```

### [Riverflow 1 Pro](#riverflow-1-pro)

An advanced image editing model offering superior quality, stability, and accuracy while requiring fewer edit iterations. Designed for professional workflows demanding the highest level of precision.

**Model AIR ID**: `sourceful:1@2`.

**Supported workflows**: Image-to-image editing.

**Technical specifications**:

- Positive prompt: Required.
- Reference images: Supports `inputs.references` with 1-10 images.
- Supported dimensions: 1024×1024 (1:1), 1152×864 (4:3), 864×1152 (3:4), 1280×720 (16:9), 720×1280 (9:16), 1248×832 (3:2), 832×1248 (2:3), 1512×648 (21:9), 648×1512 (9:21), 1152×896 (5:4), 896×1152 (4:5).
- Input image requirements: Width and height between 300-2048 pixels, 20MB file size limit.

This model is currently in early-access status. [Contact support](https://runware.ai/contact) for access details.

High-precision editing

```
{
  "taskType": "imageInference",
  "taskUUID": "f47ac10b-58cc-4372-a567-0e02b2c3d491",
  "model": "sourceful:1@2",
  "positivePrompt": "Adjust lighting to create a soft, warm ambiance while preserving all product details and colors",
  "width": 1024,
  "height": 1024,
  "inputs": {
    "references": ["c64351d5-4c59-42f7-95e1-eace013eddab"]
  }
}
```

 Complex multi-step edits

```
{
  "taskType": "imageInference",
  "taskUUID": "6ba7b830-9dad-11d1-80b4-00c04fd430c8",
  "model": "sourceful:1@2",
  "positivePrompt": "Place product inside tissue paper and add a decorative sticker that wraps around both sides as a closure",
  "width": 1280,
  "height": 720,
  "inputs": {
    "references": [
      "c64351d5-4c59-42f7-95e1-eace013eddab",
      "d7e8f9a0-2b5c-4e7f-a1d3-9c8b7a6e5d4f",
      "e8f9a0b1-3c6d-4f8a-b2e4-0d1c2b3a4c5d"
    ]
  }
}
```

 Color correction

```
{
  "taskType": "imageInference",
  "taskUUID": "550e8400-e29b-41d4-a716-446655440011",
  "model": "sourceful:1@2",
  "positivePrompt": "Correct color balance and enhance image clarity while maintaining print-ready standards",
  "width": 1024,
  "height": 1024,
  "inputs": {
    "references": ["c64351d5-4c59-42f7-95e1-eace013eddab"]
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