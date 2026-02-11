---
title: FLUX Tools
source_url: https://runware.ai/docs/en/image-inference/flux-tools
fetched_at: 2025-10-27 03:51:25
---

## [Introduction](#introduction)

FLUX Tools is a suite of **specialized models designed to add control** to the base FLUX text-to-image models, enabling sophisticated modification and re-creation of real and generated images. These tools integrate seamlessly with our standard [Image Inference API](/docs/en/image-inference/api-reference) while offering expanded capabilities for specific image manipulation tasks.

The FLUX Tools suite consists of four distinct features:

- **FLUX Fill** (`runware:102@1`): State-of-the-art inpainting and outpainting capabilities for editing and expanding images.
- **FLUX Canny** (`runware:104@1`): Structural guidance based on canny edges extracted from input images.
- **FLUX Depth** (`runware:103@1`): Structural guidance based on depth maps extracted from input images.
- **FLUX Redux** (`runware:105@1`): Image variation and restyling for refining or transforming existing images.

Each tool is optimized for specific use cases while maintaining the quality and performance that FLUX models are known for.

FLUX Tools models are used through the same standard **Image Inference** task but with specific parameter combinations and restrictions. This documentation covers the unique requirements for each tool.

## [FLUX Fill: Advanced inpainting](#flux-fill-advanced-inpainting)

FLUX Fill introduces **advanced inpainting capabilities** that allow for seamless editing that integrates naturally with existing images. It also supports outpainting, enabling extension of images beyond their original borders.

Model Card

![Model preview](https://mim.runware.ai/r/67bdb608d78e1-768x1024.jpg)

Checkpoint • FLUX.1 [dev]runware:102@1

FLUX Dev Fill

1

- Flux
- Inpainting
- Fill

**281.1K** Inference requests last week

### [Usage](#usage)

FLUX Fill is used with the following specific configuration:

- Use base model AIR ID `runware:102@1`.
- Provide `seedImage` and `maskImage` as you would for standard inpainting.
- Unlike regular inpainting models, FLUX Fill does not support the `maskMargin` parameter for zoomed/detailed inpainting.
- The `strength` parameter is also not compatible with this model, the balance between existing and new content is controlled entirely through prompting.

```
{
  "taskType": "imageInference",
  "taskUUID": "a770f077-f413-47de-9dac-be0b26a35da6",
  "model": "runware:102@1",
  "positivePrompt": "a blue denim jacket",
  "seedImage": "59a2edc2-45e6-429f-be5f-7ded59b92046",
  "maskImage": "b6a06b3b-ce32-4884-ad93-c5eca7937ba0",
  "width": 1024,
  "height": 1024,
  "steps": 30
}
```

### [Use cases](#use-cases)

FLUX Fill excels at:

- **Object Replacement**: Replace specific objects in images while maintaining lighting and context.
- **Background Modification**: Change backgrounds while preserving the main subject.
- **Content Extension**: Expand images beyond their boundaries through outpainting.
- **Detail Enhancement**: Add or refine details within specific areas of an image.

### [Playground](#playground)

FLUX Tools - Fill

API key

[Get one!](https://my.runware.ai/keys)

 

Model

Positive Prompt

Seed Image

Mask Image

Width 1024

Height 1024

CFG Scale 10

Steps 28

Generate Images

Download All

Remove All

Cancel

Select

## [FLUX Canny/Depth: Structural conditioning](#flux-cannydepth-structural-conditioning)

Structural conditioning models use canny edge or depth detection to maintain **precise control during image inference**. By preserving the original image's structure through edge or depth maps, users can make text-guided images while keeping the core composition intact, which is particularly effective for retexturing images and style transformations.

Model Card

![Model preview](https://mim.runware.ai/r/67bdb677752c9-768x1024.jpg)

Checkpoint • FLUX.1 [dev]runware:104@1

FLUX Dev Canny

1

- Base model
- Flux
- canny2img
- controlnet
- canny

**184.4K** Inference requests last week

Model Card

![Model preview](https://mim.runware.ai/r/67bdb652885a9-768x1024.jpg)

Checkpoint • FLUX.1 [dev]runware:103@1

FLUX Dev Depth

1

- Base model
- Flux
- depth2img
- controlnet
- depth

**174.0K** Inference requests last week

FLUX Canny and Depth are **hybrid models** that combine the base FLUX image generation capabilities with embedded ControlNet functionality. Unlike standard ControlNet usage, FLUX Canny/Depth tools don't require a `controlNet` object. Instead, the guide image is provided directly in the `seedImage` parameter.

### [Usage](#usage-1)

- Use base model AIR ID `runware:104@1` for FLUX Canny or `runware:103@1` for FLUX Depth.
- Provide the structural guide image (edge map or depth map) directly in the `seedImage` parameter.
- There is no `weight` parameter for FLUX Canny/Depth. The strength of the conditioning can't be controlled.

```
{
  "taskType": "imageInference",
  "taskUUID": "a770f077-f413-47de-9dac-be0b26a35da6",
  "model": "runware:103@1",
  "positivePrompt": "a watercolor painting of a forest",
  "seedImage": "59a2edc2-45e6-429f-be5f-7ded59b92046",
  "width": 1024,
  "height": 1024,
  "steps": 30
}
```

### [Preparing guide images](#preparing-guide-images)

You can use our [ControlNet preprocessing tools](/docs/en/tools/controlnet-preprocess) to generate appropriate edge or depth maps:

- For FLUX Canny: Use the `canny` preprocessor type.
- For FLUX Depth: Use the `depth` preprocessor type.

```
{
  "taskType": "controlNetPreprocess",
  "taskUUID": "3303f1be-b3dc-41a2-94df-ead00498db57",
  "inputImage": "ff1d9a0b-b80f-4665-ae07-8055b99f4aea",
  "preProcessorType": "canny"
}
```

### [Use cases](#use-cases-1)

FLUX Canny/Depth excel at:

- **Style Transfer**: Transform image styles while maintaining structural composition and spatial relationships.
- **Content Preservation**: Generate new images that follow the exact structure of reference images.
- **Scene Retexturing**: Modify materials and textures while preserving object shapes and positions.
- **Artistic Reinterpretation**: Create artistic variants of photos with consistent structure but creative styling.
- **Consistent Series Generation**: Produce multiple variations with identical structural elements but different details.

### [Playground](#playground-1)

FLUX Tools - Canny/Depth

API key

[Get one!](https://my.runware.ai/keys)

 

Model

FLUX Canny

FLUX Depth

Positive Prompt

Seed Image

Width 1024

Height 1024

CFG Scale 10

Steps 28

Generate Images

Download All

Remove All

Cancel

Select

## [FLUX Redux: Image variation and restyling](#flux-redux-image-variation-and-restyling)

FLUX Redux is an IP-Adapter model that enables **image variation generation**. Given an input image (guide image), FLUX Redux can reproduce the image with variations, allowing refinement of existing images or creating multiple alternatives based on a single reference.

Model Card

![Model preview](https://mim.runware.ai/r/67bdb69c2c5b1-768x1024.jpg)

• FLUX.1 [dev]runware:105@1

FLUX Dev Redux

1

- Flux
- IPAdapter
- Redux
- img2img

**177.6K** Inference requests last week

### [Usage](#usage-2)

FLUX Redux requires a different approach than the other FLUX tools:

- Use iP-Adapter model AIR ID `runware:105@1`.
- Provide the input image in the `guideImage` parameter inside the `ipAdapters` object.
- Use a FLUX base model (typically FLUX dev model - `runware:101@1`) as the base model. Other FLUX models can be used as well.
- There is no `weight` parameter for FLUX Redux. The `positivePrompt` parameter doesn't have any effect on the image generation process.

To generate pure variations of the input image without any prompt guidance, use `__BLANK__` as your `positivePrompt`. This special keyword tells the model to focus exclusively on the visual information from the input image, creating variations that maintain its core characteristics without additional text influences.

```
[
  {
    "taskType": "imageInference",
    "taskUUID": "a770f077-f413-47de-9dac-be0b26a35da6",
    "model": "runware:101@1",
    "positivePrompt": "elegant portrait, detailed features",
    "width": 1024,
    "height": 1024,
    "steps": 30,
    "ipAdapters": [
      {
        "guideImage": "59a2edc2-45e6-429f-be5f-7ded59b92046",
        "model": "runware:105@1"
      }
    ]
  }
]
```

### [Use cases](#use-cases-2)

FLUX Redux excels at:

- **Image Variations**: Generate subtle alternatives of an input image while preserving key visual elements.
- **Style Adaptation**: Modify the artistic style of an image while maintaining subject recognition.
- **Visual Concept Mixing**: Combine visual concepts from the input image with new elements specified in the prompt.
- **Subject Preservation**: Ensure specific subjects or elements remain recognizable across style transformations.

## [Best practices](#best-practices)

For optimal results with FLUX Tools, consider these best practices:

- FLUX Fill performs best with clear, defined masks with slight feathering at the edges.
- For FLUX Canny, adjust the edge detection thresholds in preprocessing to control level of detail.
- Higher step counts often yield better results for complex transformations.
- Consider using a higher CFG scale when precision is required.

### [Playground](#playground-2)

FLUX Tools - Redux

API key

[Get one!](https://my.runware.ai/keys)

 

Model

Positive Prompt

IP-Adapters

Add

Model

Guide Image

Model

Guide Image

Remove

Width 1024

Height 1024

CFG Scale 10

Steps 28

Generate Images

Download All

Remove All

Cancel

Select

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