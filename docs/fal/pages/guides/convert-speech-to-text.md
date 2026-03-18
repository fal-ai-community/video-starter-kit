---
title: Convert Speech to Text Tutorial
source_url: https://docs.fal.ai/model-apis/guides/convert-speech-to-text
fetched_at: 2025-10-27 03:52:19
---

[Skip to main content](#content-area)

[fal home page![light logo](https://mintcdn.com/fal-d8505a2e/_1QeqsRe91WUAOCJ/logo/light.svg?fit=max&auto=format&n=_1QeqsRe91WUAOCJ&q=85&s=04c374284984bf56c89974379f02b7a2)![dark logo](https://mintcdn.com/fal-d8505a2e/_1QeqsRe91WUAOCJ/logo/dark.svg?fit=max&auto=format&n=_1QeqsRe91WUAOCJ&q=85&s=b136c77964ac416a72cb0bcba775d7c7)](https://fal.ai/)

Search...

⌘K

Search...

Navigation

Guides

Convert Speech to Text Tutorial

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

- [How to Convert Speeches using the fal API](#how-to-convert-speeches-using-the-fal-api)
- [How to select the model to use](#how-to-select-the-model-to-use)

## [​](#how-to-convert-speeches-using-the-fal-api) How to Convert Speeches using the fal API

To convert speeches to text using the fal API, you need to send a request to the appropriate endpoint with the desired input parameters. The API uses pre-trained models to convert speeches to text based on the provided audio file. This allows you to convert speeches to text by simply providing the audio file.
Here is an example of how to convert speeches to text using the fal API:

Report incorrect code

Copy

Ask AI

```
import { fal } from "@fal-ai/client";

const result = await fal.subscribe("fal-ai/whisper", {
  input: {
    audio_url: "https://storage.googleapis.com/falserverless/model_tests/whisper/dinner_conversation.mp3"
  },
});
```

## [​](#how-to-select-the-model-to-use) How to select the model to use

fal offers a variety of speech-to-text models. You can select the model that best fits your needs based on the quality and accuracy of the speech-to-text conversion. Here are some of the available models:

- [fal-ai/whisper](https://fal.ai/models/fal-ai/whisper): Whisper is a model for speech transcription and translation.
- [fal-ai/wizper](https://fal.ai/models/fal-ai/wizper): Wizper is Whisper v3 Large — but optimized by our inference wizards. Same WER, double the performance!

To select a model, simply specify the model ID in the subscribe method as shown in the example above. You can find more models and their descriptions in the [Text to Image Models](https://fal.ai/models?categories=text-to-image) page.

Was this page helpful?

YesNo

[Generate Videos from Image Tutorial

Previous](/model-apis/guides/generate-videos-from-image)[Custom Workflow UI Tutorial

Next](/model-apis/guides/custom-workflow-ui)

⌘I