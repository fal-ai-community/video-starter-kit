---
title: Custom Workflow UI Tutorial
source_url: https://docs.fal.ai/model-apis/guides/custom-workflow-ui
fetched_at: 2025-10-27 03:52:20
---

[Skip to main content](#content-area)

[fal home page![light logo](https://mintcdn.com/fal-d8505a2e/_1QeqsRe91WUAOCJ/logo/light.svg?fit=max&auto=format&n=_1QeqsRe91WUAOCJ&q=85&s=04c374284984bf56c89974379f02b7a2)![dark logo](https://mintcdn.com/fal-d8505a2e/_1QeqsRe91WUAOCJ/logo/dark.svg?fit=max&auto=format&n=_1QeqsRe91WUAOCJ&q=85&s=b136c77964ac416a72cb0bcba775d7c7)](https://fal.ai/)

Search...

⌘K

Search...

Navigation

Guides

Custom Workflow UI Tutorial

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

- [How to create a custom workflow UI](#how-to-create-a-custom-workflow-ui)
- [How to find model input and output fields](#how-to-find-model-input-and-output-fields)
- [How to execute a custom workflow](#how-to-execute-a-custom-workflow)

## [​](#how-to-create-a-custom-workflow-ui) How to create a custom workflow UI

If you want to create your custom workflow and execute it using the fal API, you need to create a json object that describes the workflow. You can use the following template to create your custom workflow. Basically, a workflow definition must have an input node, a fal model node, and an output node. The input node is the request to the fal API. The fal model node is the model that you want to use. You can add as many fal model nodes as you want. The output node is the response from the fal API.

Report incorrect code

Copy

Ask AI

```
{
  // Input node / Request
  "input": {
    "id": "input",
    "type": "input",
    "depends": [],
    "input": {
      "prompt": ""
    }
  },

  // A fal model node
  "node_1": {
    "id": "node_1",
    "type": "run",
    "depends": ["input"],
    // The app is the model endpoint id
    "app": "fal-ai/flux/dev",
    "input": {
      // The prompt value is coming from the Input node
      "prompt": "$input.prompt"
    }
  },

  // Another fal model node
  "node_2": {
    "id": "node_2",
    "type": "run",
    "depends": ["node_1"],
    // The app is the model endpoint id
    "app": "fal-ai/bria/background/remove",
    "input": {
      // The image_url value is coming from the "node_1" node
      "image_url": "$node_1.images.0.url"
    }
  },

  // Output node / Response
  "output": {
    "id": "output",
    "type": "display",
    "depends": ["node_2"],
    "fields": {
      "image": "$node_2.image"
    }
  }
}
```

## [​](#how-to-find-model-input-and-output-fields) How to find model input and output fields

Every fal model has input and output fields. You can find the input and output fields using the following URL:

Report incorrect code

Copy

Ask AI

```
https://fal.ai/api/openapi/queue/openapi.json?endpoint_id=[endpoint_id]
```

For example:

Report incorrect code

Copy

Ask AI

```
https://fal.ai/api/openapi/queue/openapi.json?endpoint_id=fal-ai/flux/dev
```

## [​](#how-to-execute-a-custom-workflow) How to execute a custom workflow

You can execute a custom workflow using `workflows/execute` endpoint.

Report incorrect code

Copy

Ask AI

```
const stream = await fal.stream(`workflows/execute`, {
    input: {
        // The input to the workflow
        input: {
            prompt: "A beautiful sunset over a calm ocean"
        },
        // The workflow definition
        workflow: {
          "input": {
            "id": "input",
            "type": "input",
            "depends": [],
            "input": {
              "prompt": ""
            }
          },
          "node_1": {
            "id": "node_1",
            "type": "run",
            "depends": ["input"],
            "app": "fal-ai/flux/dev",
            "input": {
              "prompt": "$input.prompt"
            }
          },
          "node_2": {
            "id": "node_2",
            "type": "run",
            "depends": ["node_1"],
            "app": "fal-ai/bria/background/remove",
            "input": {
              "image_url": "$node_1.images.0.url"
            }
          },
          "output": {
            "id": "output",
            "type": "display",
            "depends": ["node_2"],
            "fields": {
              "image": "$node_2.image"
            }
          }
        },
    },
});

stream.on("data", (event) => {
  console.log(event);
});

const result = await stream.done();
```

Was this page helpful?

YesNo

[Convert Speech to Text Tutorial

Previous](/model-apis/guides/convert-speech-to-text)[Use LLMs Tutorial

Next](/model-apis/guides/use-llms)

⌘I