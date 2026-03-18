---
title: Fastest FLUX Endpoint
source_url: https://docs.fal.ai/model-apis/fast-flux
fetched_at: 2025-10-27 03:52:18
---

[Skip to main content](#content-area)

[fal home page![light logo](https://mintcdn.com/fal-d8505a2e/_1QeqsRe91WUAOCJ/logo/light.svg?fit=max&auto=format&n=_1QeqsRe91WUAOCJ&q=85&s=04c374284984bf56c89974379f02b7a2)![dark logo](https://mintcdn.com/fal-d8505a2e/_1QeqsRe91WUAOCJ/logo/dark.svg?fit=max&auto=format&n=_1QeqsRe91WUAOCJ&q=85&s=b136c77964ac416a72cb0bcba775d7c7)](https://fal.ai/)

Search...

⌘K

Search...

Navigation

Guides

Fastest FLUX Endpoint

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

- [Image Uploads Should Not Waste GPU Cycles](#image-uploads-should-not-waste-gpu-cycles)

[![image-7](https://mintcdn.com/fal-d8505a2e/_1QeqsRe91WUAOCJ/images/image-7.png?fit=max&auto=format&n=_1QeqsRe91WUAOCJ&q=85&s=63ca3f10d0a6a8ed0b743648881b95a1)

## fal-ai/ flux/schnell

`text-to-image`FLUX.1 [schnell] is a 12 billion parameter flow transformer that generates high-quality images from text in 1 to 4 steps, suitable for personal and commercial use.`optimized`](https://fal.ai/models/fal-ai/flux/schnell)[![image-8](https://mintcdn.com/fal-d8505a2e/_1QeqsRe91WUAOCJ/images/image-8.png?fit=max&auto=format&n=_1QeqsRe91WUAOCJ&q=85&s=77817a3db0b964ce72ac78f06b891404)

## fal-ai/ flux/dev

`text-to-image`FLUX.1 [dev] is a 12 billion parameter flow transformer that generates high-quality images from text. It is suitable for personal and commercial use.`flux`](https://fal.ai/models/fal-ai/flux/dev)

Here is a quick guide on how to use this model from an API in less than 1 minute.
Before we proceed, you need to create an [API key](https://fal.ai/dashboard/keys).
This key secret will be used to authenticate your requests to the fal API.

Report incorrect code

Copy

Ask AI

```
fal.config({
  credentials: "PASTE_YOUR_FAL_KEY_HERE",
});
```

Now you can call our Model API endpoint using the [fal js client](/model-apis/model-endpoints):

Report incorrect code

Copy

Ask AI

```
import { fal } from "@fal-ai/client";

const result = await fal.subscribe("fal-ai/flux/dev", {
  input: {
    prompt:
      "photo of a rhino dressed suit and tie sitting at a table in a bar with a bar stools, award winning photography, Elke vogelsang",
  },
});
```

**Note:**

#### [​](#image-uploads-should-not-waste-gpu-cycles) Image Uploads Should Not Waste GPU Cycles

We upload the output image in a background thread so we don’t charge any GPU
time for time spent on the GPU that is not directly inference.

Was this page helpful?

YesNo

[Using fal within an n8n workflow

Previous](/model-apis/guides/n8n)[Fastest SDXL Endpoint | fal.ai Model APIs Docs

Next](/model-apis/fast-sdxl)

⌘I