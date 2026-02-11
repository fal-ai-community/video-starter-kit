---
title: Synchronous Requests API | fal.ai Reference
source_url: https://docs.fal.ai/model-apis/model-endpoints/synchronous-requests
fetched_at: 2025-10-27 03:52:29
---

[Skip to main content](#content-area)

[fal home page![light logo](https://mintcdn.com/fal-d8505a2e/_1QeqsRe91WUAOCJ/logo/light.svg?fit=max&auto=format&n=_1QeqsRe91WUAOCJ&q=85&s=04c374284984bf56c89974379f02b7a2)![dark logo](https://mintcdn.com/fal-d8505a2e/_1QeqsRe91WUAOCJ/logo/dark.svg?fit=max&auto=format&n=_1QeqsRe91WUAOCJ&q=85&s=b136c77964ac416a72cb0bcba775d7c7)](https://fal.ai/)

Search...

⌘K

Search...

Navigation

Models Endpoints

Synchronous Requests API | fal.ai Reference

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

- [Submit a request](#submit-a-request)

Synchronous endpoints are beneficial if when you know the request is quick and you are looking for minimal latency. The drawbacks are:

- You need to keep the connection open until receiving the result
- The request cannot be interrupted
- If the connection is interrupted there is not way to obtain the result
- You will be charged for the full request whether or not you were able to receive the result

The endpoint format and parameters are similar to the Queue ones:

| Endpoint | Method | Description |
| --- | --- | --- |
| **`https://fal.run/{model_id}`** | POST | Adds a request to the queue for a top-level path |
| **`https://fal.run/{model_id}/{subpath}`** | POST | Adds a request to the queue for an optional subpath |

Parameters:

- `model_id`: the model ID consists of a namespace and model name separated by a slash, e.g. `fal-ai/fast-sdxl`. Many models expose only a single
  top-level endpoint, so you can directly call them by `model_id`.
- `subpath`: some models expose different capabilities at different sub-paths, e.g. `fal-ai/flux/dev`. The subpath (`/dev` in this case) should be used

### [​](#submit-a-request) Submit a request

Here is an example of using the curl command to submit a synchronous request:

Report incorrect code

Copy

Ask AI

```
curl -X POST https://fal.run/fal-ai/fast-sdxl \
  -H "Authorization: Key $FAL_KEY" \
  -d '{"prompt": "a cat"}'
```

The response will come directly from the model:

Report incorrect code

Copy

Ask AI

```
{
  "images": [
    {
      "url": "https://v3.fal.media/files/rabbit/YYbm6L3DaXYHDL1_A4OaL.jpeg",
      "width": 1024,
      "height": 1024,
      "content_type": "image/jpeg"
    }
  ],
  "timings": {
    "inference": 2.507048434985336
  },
  "seed": 15860307465884635512,
  "has_nsfw_concepts": [
    false
  ],
  "prompt": "a cat"
}
```

Was this page helpful?

YesNo

[Webhooks API | fal.ai Reference

Previous](/model-apis/model-endpoints/webhooks)[HTTP over WebSockets API | fal.ai Reference

Next](/model-apis/model-endpoints/websockets)

⌘I