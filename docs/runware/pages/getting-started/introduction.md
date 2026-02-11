---
title: Getting started with the Runware API
source_url: https://runware.ai/docs/en/getting-started/introduction
fetched_at: 2025-10-27 03:51:21
---

## [Introduction](#introduction)

Welcome to the **Runware platform documentation**.

We have a mission: to enable any team to launch AI media generation features with **low budgets** and **no AI expertise**.

Our custom-designed [Sonic Inference Engine®](https://runware.ai/sonic-inference-engine/) delivers high-quality media at **sub-second speeds**. We have built this unique platform from scratch, hosted on our own infrastructure powered by renewable energy. By optimizing the entire AI stack from the OS level upwards, we've achieved exceptional speeds and cost efficiency that we pass directly to you.

The gateway to our platform is the Runware API, which offers **extreme flexibility** and seamless integration into any business process. Whether you're an experienced developer or just starting out, our documentation will guide you through the process of creating stunning visual media easily.

## [API features](#api-features)

Runware offers a suite of powerful AI features through our API.

[![A floating island with waterfalls, pink trees, and a glowing 'GENERATE' button in front of a dark screen, surrounded by clouds](/docs/assets/image-txttoimg.CGagCpwP_1zh7bD.jpg)  

Text to Image

  [](/docs/assets/video-txttoimg.qm2PXcGO.mp4)](/docs/en/image-inference/text-to-image)

[![A futuristic gallery displaying large vertical screens with portraits of women, lit with colorful ambient lighting](/docs/assets/image-main.DgSEHZ9j_Z1luzUi.jpg)  

Image to Image

  [](/docs/assets/video-imgtoimg.DpROMi3_.mp4)](/docs/en/image-inference/image-to-image)

[![Whimsical landscape illustration with waterfalls, colorful flowers, and two large blank areas shaped like butterfly wings](/docs/assets/image-main.CZUHCRuK_27NGzB.jpg)  

Inpainting

  [](/docs/assets/video-inpainting.BWgWDAX7.mp4)](/docs/en/image-inference/inpainting)

[![A tabletop jigsaw puzzle seamlessly transforms into a realistic landscape with pine trees and a river extending into the distance](/docs/assets/image-main.abIG0xto_1w39I0.jpg)  

Outpainting

  [](/docs/assets/video-outpainting.Czg7mNai.mp4)](/docs/en/image-inference/outpainting)

[![Man standing on a mountaintop holding a box up toward a glowing cloud emitting vertical beams of light](/docs/assets/image-modelupload.BS2RPEcr_25q9Af.jpg)  

Model Upload

  [](/docs/assets/video-modelupload.wOBIdBzP.mp4)](/docs/en/image-inference/model-upload)

[![Hands interacting with a map on a table, connected by glowing orange paths and illuminated cubes placed at intersections](/docs/assets/image-modelsearch.qH_VdEYi_Z1I3Q02.jpg)  

Model Search

  [](/docs/assets/video-modelsearch.CWJhZqwk.mp4)](/docs/en/utilities/model-search)

[![A man on a ladder paints over a galaxy wall mural with white paint while a man in an astronaut suit stands smiling](/docs/assets/image-removebackground.BuJFf4YT_Z5pmgI.jpg)  

Background Removal

  [](/docs/assets/video-removebackground.DsFwtZxi.mp4)](/docs/en/tools/remove-background)

[![Hand holding a magnifying glass over a desert scene, making a portion of the distant landscape appear in sharper detail](/docs/assets/image-upscale.CLlKQhwh_1SzsWL.jpg)  

Upscale

  [](/docs/assets/video-upscale.LCbJGIpS.mp4)](/docs/en/tools/upscale)

[![A man stands in front of three glowing humanoid figures in a foggy, surreal environment](/docs/assets/image-controlnet.B0y952bE_1RDvfB.jpg)  

ControlNet Preprocess

  [](/docs/assets/video-controlnet.mznpGxIc.mp4)](/docs/en/tools/controlnet-preprocess)

[![A man with a glowing orange face mask and hands stands in a foggy environment with floating sparks around him](/docs/assets/image-masking.BGTPcAyj_LQx1d.jpg)  

Image Masking

  [](/docs/assets/video-masking.B3ws_tQe.mp4)](/docs/en/tools/image-masking)

[![A woman writes in a notebook while gazing at a mountainous landscape with a large pink moon and a smaller planet in the sky](/docs/assets/image-caption.G4gT2yya_Z2h2Gvh.jpg)  

Image to Text

  [](/docs/assets/video-caption.cYEW3ABq.mp4)](/docs/en/tools/caption)

[![An open book floating among pink clouds with sparkling lights bursting from its pages into the starry night sky](/docs/assets/image-promptenhancer.D6tOrLuH_ZYYCrj.jpg)  

Prompt Enhancer

  [](/docs/assets/video-promptenhancer.L3uhW1Pu.mp4)](/docs/en/tools/prompt-enhancer)

[![A UFO shines a purple light onto a field with two cows and a floating Polaroid photo of a cow](/docs/assets/image-imageupload.BBIz2Emj_Z7VaPw.jpg)  

Image Upload

  [](/docs/assets/video-imageupload.CkWLAl42.mp4)](/docs/en/utilities/image-upload)

## [Getting started](#getting-started)

To start using the Runware API:

1. [Sign up](https://my.runware.ai/signup) for a Runware account.
2. Get your API key from the dashboard.
3. Learn how to [connect and authenticate](/docs/en/getting-started/how-to-connect) with our API.
4. Try your first request using our [API Reference](/docs/en/image-inference/api-reference).

Our documentation includes detailed guides, API references, and examples to help you integrate AI media generation into your applications quickly and effectively.

## [Core API concepts](#core-api-concepts)

The Runware API follows a consistent design pattern across all our services. Understanding these core concepts will help you work effectively with any of our endpoints.

### [Task-based architecture](#task-based-architecture)

Our API is built around the concept of **tasks**. Each request represents a specific task to be performed, such as generating an image, removing a background, or uploading a file. This task-based architecture enables **consistent request structure** across different features, **asynchronous processing** for computationally intensive operations, and **efficient resource allocation** based on task requirements.

Every API call accepts an array of objects as input, where each object represents an individual **task** to be performed. You can send as many tasks as you need in a single request, and each task will be processed independently. The structure of each object varies depending on the type of task.

### [Common request parameters](#common-request-parameters)

Every API request shares these fundamental parameters:

- **taskType**: Identifies which operation to perform (e.g., `imageInference`, `imageUpload`).
- **taskUUID**: A unique identifier (UUID v4) you generate for tracking the request and matching it with responses. If a task fails or behaves unexpectedly, providing the `taskUUID` when contacting support enables us to quickly locate the request and assist you more efficiently.
- **includeCost**: Optional flag to include cost information with each response.

```
[
  {
    "taskType": "imageInference",
    "taskUUID": "a770f077-f413-47de-9dac-be0b26a35da6",
    "includeCost": true,
    // Task-specific parameters follow...
  }
]
```

### [Common response structure](#common-response-structure)

All API responses follow a consistent format. Each response contains:

- **taskType**: Echoes the type of task originally requested.
- **taskUUID**: Mirrors the unique identifier you provided, allowing easy tracking of the request.
- **cost**: Included when requested, showing the exact cost associated with the task.

Additional fields in the response vary depending on the task type, but this consistent structure makes working with different API features straightforward.

Results are delivered in the format shown below. Each message can contain **one or multiple results**, depending on the task. For example, when generating images, you might receive several images in parallel as generation times can vary across nodes and the network.

If an error occurs during processing, the response will contain an `errors` field instead of `data`, providing detailed information about what went wrong.

```
{
  "data": [
    {
      "taskType": "imageInference",
      "taskUUID": "a770f077-f413-47de-9dac-be0b26a35da6",
      "imageUUID": "77da2d99-a6d3-44d9-b8c0-ae9fb06b6200",
      "imageURL": "https://im.runware.ai/image/ws/0.5/ii/a770f077-f413-47de-9dac-be0b26a35da6.jpg",
      "cost": 0.0013
    }
  ]
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