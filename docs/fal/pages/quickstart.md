---
title: Quickstart
source_url: https://docs.fal.ai/model-apis/quickstart
fetched_at: 2025-10-27 03:52:33
---

[Skip to main content](#content-area)

[fal home page![light logo](https://mintcdn.com/fal-d8505a2e/_1QeqsRe91WUAOCJ/logo/light.svg?fit=max&auto=format&n=_1QeqsRe91WUAOCJ&q=85&s=04c374284984bf56c89974379f02b7a2)![dark logo](https://mintcdn.com/fal-d8505a2e/_1QeqsRe91WUAOCJ/logo/dark.svg?fit=max&auto=format&n=_1QeqsRe91WUAOCJ&q=85&s=b136c77964ac416a72cb0bcba775d7c7)](https://fal.ai/)

Search...

⌘K

Search...

Navigation

Quickstart

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

Before we proceed, you need to create an [API key](https://fal.ai/dashboard/keys).
This key will be used to authenticate your requests to the fal API.

Javascript

Python

Report incorrect code

Copy

Ask AI

```
npm install --save @fal-ai/client
```

Javascript

Python

Report incorrect code

Copy

Ask AI

```
fal.config({
  credentials: "PASTE_YOUR_FAL_KEY_HERE",
});
```

Now you can call our Model API endpoint using the fal [client](/model-apis/model-endpoints):

Javascript

Python

Report incorrect code

Copy

Ask AI

```
import { fal } from "@fal-ai/client";

const result = await fal.subscribe("fal-ai/flux/dev", {
  input: {
    prompt:
      "Photo of a rhino dressed suit and tie sitting at a table in a bar with a bar stools, award winning photography, Elke vogelsang",
  },
});
```

We have made other popular models such as Flux Realism, Flux Lora Training SDXL Finetunes, Stable Video Diffusion, ControlNets, Whisper and more available as ready-to-use APIs so that you can easily integrate them into your applications.

[![image-1](https://mintcdn.com/fal-d8505a2e/_1QeqsRe91WUAOCJ/images/model-apis/image-1.png?fit=max&auto=format&n=_1QeqsRe91WUAOCJ&q=85&s=acb6c6d26e96bc2b2d1f091cf53749db)

## fal-ai/flux/schnell

`text-to-image`FLUX.1 [schnell] is a 12 billion parameter flow transformer that generates high-quality images from text in 1 to 4 steps, suitable for personal and commercial use.`optimized`](https://fal.ai/models/fal-ai/flux/schnell)[![image-2](https://mintcdn.com/fal-d8505a2e/_1QeqsRe91WUAOCJ/images/model-apis/image-2.png?fit=max&auto=format&n=_1QeqsRe91WUAOCJ&q=85&s=c83d4264197702aeb7b6cea96de61110)

## fal-ai/ flux-pro/v1.1-ultra

`text-to-image`FLUX1.1 [pro] ultra is the newest version of FLUX1.1 [pro], maintaining professional-grade image quality while delivering up to 2K resolution with improved photo realism.`flux` `2k` `realism`](https://fal.ai/models/fal-ai/flux-pro/v1.1-ultra)

Check out our [Model Playgrounds](https://fal.ai/models) to tinker with these models and let us know on our [Discord](https://discord.gg/fal-ai) if you want to see other ones listed.
Once you find a model that you want to use, you can grab its URL from the “API” tab. The API tab provides some important information about the model including its source code and examples of how you can call it.

Was this page helpful?

YesNo

[Connect fal to Cursor

Previous](/model-apis/mcp)[Generate Images from Text Tutorial

Next](/model-apis/guides/generate-images-from-text)

⌘I