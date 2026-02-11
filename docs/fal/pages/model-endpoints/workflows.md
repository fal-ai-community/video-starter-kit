---
title: Workflow endpoints API | fal.ai Reference
source_url: https://docs.fal.ai/model-apis/model-endpoints/workflows
fetched_at: 2025-10-27 03:52:32
---

[Skip to main content](#content-area)

[fal home page![light logo](https://mintcdn.com/fal-d8505a2e/_1QeqsRe91WUAOCJ/logo/light.svg?fit=max&auto=format&n=_1QeqsRe91WUAOCJ&q=85&s=04c374284984bf56c89974379f02b7a2)![dark logo](https://mintcdn.com/fal-d8505a2e/_1QeqsRe91WUAOCJ/logo/dark.svg?fit=max&auto=format&n=_1QeqsRe91WUAOCJ&q=85&s=b136c77964ac416a72cb0bcba775d7c7)](https://fal.ai/)

Search...

⌘K

Search...

Navigation

Models Endpoints

Workflow endpoints API | fal.ai Reference

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

- [Workflow as an API](#workflow-as-an-api)
- [Workflow events](#workflow-events)
- [The submit event](#the-submit-event)
- [The completion event](#the-completion-event)
- [The output event](#the-output-event)
- [The error event](#the-error-event)
- [Example](#example)
- [Type definitions](#type-definitions)

## [​](#workflow-as-an-api) Workflow as an API

Workflow APIs work the same way as other model endpoints, you can simply send a request and get a response back. However, it is common for workflows to contain multiple steps and produce intermediate results, as each step contains their own response that could be relevant in your use-case.
Therefore, workflows benefit from the **streaming** feature, which allows you to get partial results as they are being generated.

## [​](#workflow-events) Workflow events

The workflow API will trigger a few events during its execution, these events can be used to monitor the progress of the workflow and get intermediate results. Below are the events that you can expect from a workflow stream:

### [​](#the-submit-event) The `submit` event

This events is triggered every time a new step has been submitted to execution. It contains the `app_id`, `request_id` and the `node_id`.

Report incorrect code

Copy

Ask AI

```
{
  "type": "submit",
  "node_id": "stable_diffusion_xl",
  "app_id": "fal-ai/fast-sdxl",
  "request_id": "d778bdf4-0275-47c2-9f23-16c27041cbeb"
}
```

### [​](#the-completion-event) The `completion` event

This event is triggered upon the completion of a specific step.

Report incorrect code

Copy

Ask AI

```
{
  "type": "completion",
  "node_id": "stable_diffusion_xl",
  "output": {
    "images": [
      {
        "url": "https://fal.media/result.jpeg",
        "width": 1024,
        "height": 1024,
        "content_type": "image/jpeg"
      }
    ],
    "timings": { "inference": 2.1733 },
    "seed": 6252023,
    "has_nsfw_concepts": [false],
    "prompt": "a cute puppy"
  }
}
```

### [​](#the-output-event) The `output` event

The `output` event means that the workflow has completed and the final result is ready.

Report incorrect code

Copy

Ask AI

```
{
  "type": "output",
  "output": {
    "images": [
      {
        "url": "https://fal.media/result.jpeg",
        "width": 1024,
        "height": 1024,
        "content_type": "image/jpeg"
      }
    ]
  }
}
```

### [​](#the-error-event) The `error` event

The `error` event is triggered when an error occurs during the execution of a step. The `error` object contains the `error.status` with the HTTP status code, an error `message` as well as `error.body` with the underlying error serialized.

Report incorrect code

Copy

Ask AI

```
{
  "type": "error",
  "node_id": "stable_diffusion_xl",
  "message": "Error while fetching the result of the request d778bdf4-0275-47c2-9f23-16c27041cbeb",
  "error": {
    "status": 422,
    "body": {
      "detail": [
        {
          "loc": ["body", "num_images"],
          "msg": "ensure this value is less than or equal to 8",
          "type": "value_error.number.not_le",
          "ctx": { "limit_value": 8 }
        }
      ]
    }
  }
}
```

## [​](#example) Example

A cool and simple example of the power of workflows is `workflows/fal-ai/sdxl-sticker`, which consists of three steps:

1

Generates an image using `fal-ai/fast-sdxl`.

2

Remove the background of the image using `fal-ai/imageutils/rembg`.

3

Converts the image to a sticker using `fal-ai/face-to-sticker`.

What could be a tedious process of running and coordinating three different models is now a single endpoint that you can call with a single request.

- Javascript
- python
- python (async)
- Swift

Report incorrect code

Copy

Ask AI

```
import { fal } from "@fal-ai/client";

const stream = await fal.stream("workflows/fal-ai/sdxl-sticker", {
input: {
  prompt: "a face of a cute puppy, in the style of pixar animation",
},
});

for await (const event of stream) {
console.log("partial", event);
}

const result = await stream.done();

console.log("final result", result);
```

## [​](#type-definitions) Type definitions

Below are the type definition in TypeScript of events that you can expect from a workflow stream:

Report incorrect code

Copy

Ask AI

```
type WorkflowBaseEvent = {
  type: "submit" | "completion" | "error" | "output";
  node_id: string;
};

export type WorkflowSubmitEvent = WorkflowBaseEvent & {
  type: "submit";
  app_id: string;
  request_id: string;
};

export type WorkflowCompletionEvent<Output = any> = WorkflowBaseEvent & {
  type: "completion";
  app_id: string;
  output: Output;
};

export type WorkflowDoneEvent<Output = any> = WorkflowBaseEvent & {
  type: "output";
  output: Output;
};

export type WorkflowErrorEvent = WorkflowBaseEvent & {
  type: "error";
  message: string;
  error: any;
};
```

Was this page helpful?

YesNo

[Server-side integration API | fal.ai Reference

Previous](/model-apis/model-endpoints/server-side)[Client Libraries

Next](/model-apis/client)

⌘I