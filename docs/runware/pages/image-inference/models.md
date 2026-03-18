---
title: Models overview
source_url: https://runware.ai/docs/en/image-inference/models
fetched_at: 2025-10-27 03:51:31
---

## [Introduction](#introduction)

A model is a **pre-trained neural network** that generates images based on the data it has been trained on. Choosing the right model is crucial as it directly **impacts the quality and style of the generated images**.

Different models **provides different advantages**. Models allow you to experiment with **different artistic styles** and leverage specialized capabilities such as ultra-realistic rendering or imaginative and dreamy creations. This flexibility ensures that you can consistently meet your application's specific goals and deliver compelling visual content.

LoRAs and ControlNet are also supported in our platform. These specialized models allow you to enhance the output of the generated images, providing **styling and control** to tailor the images to your specific needs.

**Mix and match multiple LoRAs and ControlNet models** to create unique and engaging images.

## [AIR system](#air-system)

At Runware **we don't offer a limited set of curated models**. Instead, we provide the ability to use **any model available** via the AIR ([Artificial Intelligence Resource](https://github.com/civitai/civitai/wiki/AIR-%E2%80%90-Uniform-Resource-Names-for-AI)) system. This system allows you to access a wide range of models from different providers, ensuring that you can always find the best model for your specific needs.

This list is constantly growing, so you can find the latest models available in the **Model Explorer** that you will find below.

[CivitAI](https://civitai.com/) is one of the most popular websites that uses AIR identifiers, so any model you find there can be used in our platform, just copy the AIR identifier and use it in your requests.

   ![Model metadata from CivitAI](/docs/assets/image-civitai.DVahXvGN_Z1UGefH.jpg)  

On CivitAI website, you can find the AIR identifier in the right sidebar of the model page

 

If by any chance you can't find the model you are looking for, you can always **upload your own model to our platform** and tag it with the AIR system. This way you can use it in the same way as any other model available.

## [Model Explorer](#model-explorer)

We created an interactive Model Explorer so you can search for the best model for your specific needs and get the model identifier to use in your [API requests](/docs/en/image-inference/api-reference#request-model).

Check it out [here](https://runware.ai/models).

## [Basic ControlNet models](#basic-controlnet-models)

We also provide a curated list of basic/common ControlNet models that you can use without the need to search for them in the Model Explorer.

You can use this models by specifying their AIR ID in the [model](/docs/en/image-inference/api-reference#request-controlnet-model) parameter inside a [controlNet](/docs/en/image-inference/api-reference#request-controlnet) object.

### [SD 1.5](#sd-15)

| Name | Type | Description |
| --- | --- | --- |
| civitai:38784@44716 | canny | Uses edge detection maps to control the structure of generated images |
| civitai:38784@44876 | inpaint | Controls image generation to blend seamlessly with surrounding content |
| civitai:38784@44877 | lineart | Generates images that follow the structure of line art input |
| civitai:38784@44795 | MLSD | Uses structural line detection to guide image composition |
| civitai:38784@44774 | normalBAE | Controls generation based on surface normal maps for consistent depth |

### [SDXL](#sdxl)

| Name | Type | Description |
| --- | --- | --- |
| runware:20@1 | canny | Uses edge detection maps to control the structure of generated images |

### [FLUX.1 [dev]](#flux1-dev)

| Name | Type | Description |
| --- | --- | --- |
| runware:25@1 | canny | Uses edge detection maps to control the structure of generated images |
| runware:26@1 | tile | Enables high-quality upscaling by generating tiles that maintain image consistency |
| runware:27@1 | depth | Uses depth maps to guide image generation for consistent spatial relationships |
| runware:28@1 | blur | Generates sharp, detailed images guided by blurred versions as reference |
| runware:29@1 | pose | Generates images following specific pose guidelines |
| runware:30@1 | gray | Creates colored versions of grayscale images while maintaining structure |
| runware:31@1 | low quality | Uses low quality images to guide generation of higher quality versions |

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