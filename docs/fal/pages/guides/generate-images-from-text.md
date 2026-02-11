---
title: Generate Images from Text Tutorial
source_url: https://docs.fal.ai/model-apis/guides/generate-images-from-text
fetched_at: 2025-10-27 03:52:21
---

[Skip to main content](#content-area)

[fal home page![light logo](https://mintcdn.com/fal-d8505a2e/_1QeqsRe91WUAOCJ/logo/light.svg?fit=max&auto=format&n=_1QeqsRe91WUAOCJ&q=85&s=04c374284984bf56c89974379f02b7a2)![dark logo](https://mintcdn.com/fal-d8505a2e/_1QeqsRe91WUAOCJ/logo/dark.svg?fit=max&auto=format&n=_1QeqsRe91WUAOCJ&q=85&s=b136c77964ac416a72cb0bcba775d7c7)](https://fal.ai/)

Search...

⌘K

Search...

Navigation

Guides

Generate Images from Text Tutorial

[![https://mintlify-assets.b-cdn.net/fal-home.svg](https://mintlify-assets.b-cdn.net/fal-home.svg)Home](/)[![https://mintlify-assets.b-cdn.net/model-fal-logo.svg](https://mintlify-assets.b-cdn.net/model-fal-logo.svg)Model APIs](/model-apis)[![https://mintlify-assets.b-cdn.net/server-logo.svg](https://mintlify-assets.b-cdn.net/server-logo.svg)Serverless](/serverless)[![https://mintlify-assets.b-cdn.net/compute-logo.svg](https://mintlify-assets.b-cdn.net/compute-logo.svg)Compute](/compute)

- [Status](https://status.fal.ai/)
- [Community](https://discord.gg/fal-ai)
- [Blog](https://blog.fal.ai/)

- [Introduction](/model-apis)

- [Connect to Cursor](/model-apis/mcp)

- [Quickstart](/model-apis/quickstart)

##### Guides

- [Generate Images from Text Tutorial](/model-apis/guides/generate-images-from-text)
- [Generate Videos from Image Tutorial](/model-apis/guides/generate-videos-from-image)
- [Convert Speech to Text](/model-apis/guides/convert-speech-to-text)
- [Custom Workflow UI](/model-apis/guides/custom-workflow-ui)
- [Use LLMs](/model-apis/guides/use-llms)
- [Using fal within an n8n workflow](/model-apis/guides/n8n)
- [Fastest FLUX in the Planet](/model-apis/fast-flux)
- [Fastest SDXL in the Planet](/model-apis/fast-sdxl)

##### Models Endpoints

- [Introduction](/model-apis/model-endpoints)
- [Queue](/model-apis/model-endpoints/queue)
- [Webhooks](/model-apis/model-endpoints/webhooks)
- [Synchronous Requests](/model-apis/model-endpoints/synchronous-requests)
- [HTTP over WebSockets](/model-apis/model-endpoints/websockets)
- [Server-side integration](/model-apis/model-endpoints/server-side)
- [Workflows](/model-apis/model-endpoints/workflows)

- [Client Libraries](/model-apis/client)

##### Authentication

- [Authentication](/model-apis/authentication)
- [Key-based](/model-apis/authentication/key-based)
- [GitHub](/model-apis/authentication/github)

##### Integrations

- [Next.js](/model-apis/integrations/nextjs)
- [Vercel](/model-apis/integrations/vercel)

##### Real-Time

- [Introduction](/model-apis/real-time)
- [Quickstart](/model-apis/real-time/quickstart)
- [Keeping fal API Secrets Safe](/model-apis/real-time/secrets)

##### Reference

- [Errors](/model-apis/errors)

##### Help & Support

- [FAQ](/model-apis/faq)
- [Support | fal.ai Model APIs Docs](/model-apis/support)

On this page

- [How to Generate Images using the fal API](#how-to-generate-images-using-the-fal-api)
- [How to select the model to use](#how-to-select-the-model-to-use)

## [​](#how-to-generate-images-using-the-fal-api) How to Generate Images using the fal API

To generate images using the fal API, you need to send a request to the appropriate endpoint with the desired input parameters. The API uses pre-trained models to generate images based on the provided text prompt. This allows you to create images by simply describing what you want in natural language.
Here’s an example of how to generate an image using the fal API from text:

Report incorrect code

Copy

Ask AI

```
import { fal } from "@fal-ai/client";

const result = await fal.subscribe("fal-ai/flux/dev", {
  input: {
    prompt: "a face of a cute puppy, in the style of pixar animation",
  },
});
```

## [​](#how-to-select-the-model-to-use) How to select the model to use

fal offers a variety of image generation models. You can select the model that best fits your needs based on the style and quality of the images you want to generate. Here are some of the available models:

- [fal-ai/flux/dev](https://fal.ai/models/fal-ai/flux/dev): FLUX.1 [dev] is a 12 billion parameter flow transformer that generates high-quality images from text. It is suitable for personal and commercial use.
- [fal-ai/recraft-v3](https://fal.ai/models/fal-ai/recraft-v3): Recraft V3 is a text-to-image model with the ability to generate long texts, vector art, images in brand style, and much more. As of today, it is SOTA in image generation, proven by Hugging Face’s industry-leading Text-to-Image Benchmark by Artificial Analysis.
- [fal-ai/stable-diffusion-v35-large](https://fal.ai/models/fal-ai/stable-diffusion-v35-large): Stable Diffusion 3.5 Large is a Multimodal Diffusion Transformer (MMDiT) text-to-image model that features improved performance in image quality, typography, complex prompt understanding, and resource-efficiency.

To select a model, simply specify the model ID in the subscribe method as shown in the example above. You can find more models and their descriptions in the [Text to Image Models](https://fal.ai/models?categories=text-to-image) page.

Was this page helpful?

YesNo

[Quickstart

Previous](/model-apis/quickstart)[Generate Videos from Image Tutorial

Next](/model-apis/guides/generate-videos-from-image)

⌘I