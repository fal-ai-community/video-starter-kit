---
title: Generate Videos from Image Tutorial
source_url: https://docs.fal.ai/model-apis/guides/generate-videos-from-image
fetched_at: 2025-10-27 03:52:22
---

[Skip to main content](#content-area)

[fal home page![light logo](https://mintcdn.com/fal-d8505a2e/_1QeqsRe91WUAOCJ/logo/light.svg?fit=max&auto=format&n=_1QeqsRe91WUAOCJ&q=85&s=04c374284984bf56c89974379f02b7a2)![dark logo](https://mintcdn.com/fal-d8505a2e/_1QeqsRe91WUAOCJ/logo/dark.svg?fit=max&auto=format&n=_1QeqsRe91WUAOCJ&q=85&s=b136c77964ac416a72cb0bcba775d7c7)](https://fal.ai/)

Search...

⌘K

Search...

Navigation

Guides

Generate Videos from Image Tutorial

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

- [How to Generate Videos using the fal API](#how-to-generate-videos-using-the-fal-api)
- [How to select the model to use](#how-to-select-the-model-to-use)

## [​](#how-to-generate-videos-using-the-fal-api) How to Generate Videos using the fal API

fal offers a simple and easy-to-use API that allows you to generate videos from your images using pre-trained models. This endpoint is perfect for creating video clips from your images for various use cases such as social media, marketing, and more.
Here is an example of how to generate videos using the fal API:

Report incorrect code

Copy

Ask AI

```
import { fal } from "@fal-ai/client";

const result = await fal.subscribe("fal-ai/minimax-video/image-to-video", {
  input: {
    prompt: "A stylish woman walks down a Tokyo street filled with warm glowing neon and animated city signage.",
    image_url: "https://fal.media/files/elephant/8kkhB12hEZI2kkbU8pZPA_test.jpeg"
  },
});
```

## [​](#how-to-select-the-model-to-use) How to select the model to use

fal offers a variety of video generation models. You can select the model that best fits your needs based on the style and quality of the images you want to generate. Here are some of the available models:

- [fal-ai/minimax-video](https://fal.ai/models/fal-ai/minimax-video/image-to-video): Generate video clips from your images using MiniMax Video model.
- [fal-ai/luma-dream-machine](https://fal.ai/models/fal-ai/luma-dream-machine/image-to-video): Generate video clips from your images using Luma Dream Machine v1.5
- [fal-ai/kling-video/v1/standard](https://fal.ai/models/fal-ai/kling-video/v1/standard/image-to-video): Generate video clips from your images using Kling 1.0

To select a model, simply specify the model ID in the subscribe method as shown in the example above. You can find more models and their descriptions in the [Image to Video Models](https://fal.ai/models?categories=image-to-video) page.

Was this page helpful?

YesNo

[Generate Images from Text Tutorial

Previous](/model-apis/guides/generate-images-from-text)[Convert Speech to Text Tutorial

Next](/model-apis/guides/convert-speech-to-text)

⌘I