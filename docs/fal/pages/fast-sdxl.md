---
title: Fastest SDXL Endpoint | fal.ai Model APIs Docs
source_url: https://docs.fal.ai/model-apis/fast-sdxl
fetched_at: 2025-10-27 03:52:19
---

[Skip to main content](#content-area)

[fal home page![light logo](https://mintcdn.com/fal-d8505a2e/_1QeqsRe91WUAOCJ/logo/light.svg?fit=max&auto=format&n=_1QeqsRe91WUAOCJ&q=85&s=04c374284984bf56c89974379f02b7a2)![dark logo](https://mintcdn.com/fal-d8505a2e/_1QeqsRe91WUAOCJ/logo/dark.svg?fit=max&auto=format&n=_1QeqsRe91WUAOCJ&q=85&s=b136c77964ac416a72cb0bcba775d7c7)](https://fal.ai/)

Search...

⌘K

Search...

Navigation

Guides

Fastest SDXL Endpoint | fal.ai Model APIs Docs

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

[![image-9](https://mintcdn.com/fal-d8505a2e/_1QeqsRe91WUAOCJ/images/image-9.png?fit=max&auto=format&n=_1QeqsRe91WUAOCJ&q=85&s=8338fa5c9760a77f4d49345a5d556985)

## fal-ai/ fast-sdxl

`text-to-image`Run SDXL at the speed of light`loras` `embeddings`](https://fal.ai/models/fal-ai/fast-sdxl)

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

const result = await fal.subscribe("fal-ai/fast-sdxl", {
  input: {
    prompt:
      "photo of a rhino dressed suit and tie sitting at a table in a bar with a bar stools, award winning photography, Elke vogelsang",
  },
});
```

A typical inference takes 2.3 seconds and will cost ~$0.0025.

**Image Uploads Should Not Waste GPU Cycles**We upload the output image in a background thread so we don’t charge any GPU time for time spent on the GPU that is not directly inference.

Was this page helpful?

YesNo

[Fastest FLUX Endpoint

Previous](/model-apis/fast-flux)[Model Endpoints API | fal.ai Reference

Next](/model-apis/model-endpoints)

⌘I