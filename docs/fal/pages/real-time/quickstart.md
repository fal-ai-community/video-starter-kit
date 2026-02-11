---
title: Real Time Models Quickstart | fal.ai Real-Time Models
source_url: https://docs.fal.ai/model-apis/real-time/quickstart
fetched_at: 2025-10-27 03:52:34
---

[Skip to main content](#content-area)

[fal home page![light logo](https://mintcdn.com/fal-d8505a2e/_1QeqsRe91WUAOCJ/logo/light.svg?fit=max&auto=format&n=_1QeqsRe91WUAOCJ&q=85&s=04c374284984bf56c89974379f02b7a2)![dark logo](https://mintcdn.com/fal-d8505a2e/_1QeqsRe91WUAOCJ/logo/dark.svg?fit=max&auto=format&n=_1QeqsRe91WUAOCJ&q=85&s=b136c77964ac416a72cb0bcba775d7c7)](https://fal.ai/)

Search...

⌘K

Search...

Navigation

Real-Time

Real Time Models Quickstart | fal.ai Real-Time Models

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

All our Model Endpoint’s support HTTP/REST. Additionally our real-time models support WebSockets. You can use the HTTP/REST endpoint for any real time model but if you are sending back to back requests using websockets gives the best results.

[![image-6](https://mintcdn.com/fal-d8505a2e/_1QeqsRe91WUAOCJ/images/image-6.png?fit=max&auto=format&n=_1QeqsRe91WUAOCJ&q=85&s=c4ed37d4c5ef36528cfa2b6a79eddcd9)

## fal-ai/ fast-lcm-diffusion

`text-to-image`Run SDXL at the speed of light`real-time` `lcm`](https://fal.ai/models/fal-ai/fast-lcm-diffusion)[![image-5](https://mintcdn.com/fal-d8505a2e/_1QeqsRe91WUAOCJ/images/image-5.png?fit=max&auto=format&n=_1QeqsRe91WUAOCJ&q=85&s=a5eb3affecfe0e642fd722ebf728f088)

## fal-ai/ fast-turbo-diffusion

`text-to-image`Run SDXL at the speed of light`real-time` `optimized`](https://fal.ai/models/fal-ai/fast-turbo-diffusion)

Before we proceed, you need to create your [API key](https://fal.ai/dashboard/keys).

Report incorrect code

Copy

Ask AI

```
import { fal } from "@fal-ai/client";

fal.config({
  credentials: "PASTE_YOUR_FAL_KEY_HERE",
});

const connection = fal.realtime.connect("fal-ai/fast-lcm-diffusion", {
  onResult: (result) => {
    console.log(result);
  },
  onError: (error) => {
    console.error(error);
  },
});

connection.send({
  prompt:
    "an island near sea, with seagulls, moon shining over the sea, light house, boats int he background, fish flying over the sea",
  sync_mode: true,
  image_url:
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==",
});
```

You can read more about the real time clients in our [real time client docs](/model-apis/model-endpoints) section.

**Note:**For the fastest inference speed use **512x512** input dimensions for `image_url`.

**To get the best performance from this model:**

- Make sure the image is provided as a base64 encoded data url.
- Make sure the image\_url is exactly **512x512**.
- Make sure sync\_mode is true, this will make sure you also get a base64 encoded data url back from our API.

You can also use **768x768** or **1024x1024** as your image dimensions, the inference will be faster for this configuration compared to random dimensions but wont be as fast as **512x512**.
**Video Tutorial:**
*Latent Consistency - Build a Real-Time AI Image App with WebSockets, Next.js, and fal.ai by [Nader Dabit](https://twitter.com/dabit3)*

Was this page helpful?

YesNo

[Real-Time Models | fal.ai Real-Time Models

Previous](/model-apis/real-time)[Keeping fal API Secrets Safe | fal.ai Real-Time Models

Next](/model-apis/real-time/secrets)

⌘I