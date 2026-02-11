---
title: Server-side integration API | fal.ai Reference
source_url: https://docs.fal.ai/model-apis/model-endpoints/server-side
fetched_at: 2025-10-27 03:52:29
---

[Skip to main content](#content-area)

[fal home page![light logo](https://mintcdn.com/fal-d8505a2e/_1QeqsRe91WUAOCJ/logo/light.svg?fit=max&auto=format&n=_1QeqsRe91WUAOCJ&q=85&s=04c374284984bf56c89974379f02b7a2)![dark logo](https://mintcdn.com/fal-d8505a2e/_1QeqsRe91WUAOCJ/logo/dark.svg?fit=max&auto=format&n=_1QeqsRe91WUAOCJ&q=85&s=b136c77964ac416a72cb0bcba775d7c7)](https://fal.ai/)

Search...

⌘K

Search...

Navigation

Models Endpoints

Server-side integration API | fal.ai Reference

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

- [Ready-to-use proxy implementations](#ready-to-use-proxy-implementations)
- [The proxy formula](#the-proxy-formula)
- [Configure the client](#configure-the-client)
- [Example implementation](#example-implementation)

Therefore, we implemented the client libraries to support a proxy mode, which allows you to use the client libraries in the client, while keeping the API Keys in your own server-side code.

## [​](#ready-to-use-proxy-implementations) Ready-to-use proxy implementations

We provide ready-to-use proxy implementations for the following languages/frameworks:

- [Node.js with Next.js](/model-apis/integrations/nextjs): a Next.js API route handler that can be used in any Next.js app. It supports both Page and App routers. We use it ourselves in all of our apps in production.
- [Node.js with Express](https://github.com/fal-ai/serverless-js/tree/main/apps/demo-express-app): an Express route handler that can be used in any Express app. You can also implement custom logic and compose together with your own handlers.

That’s it for now, but we are looking out for our community needs and will add more implementations in the future. If you have any requests, join our community in our [Discord server](https://discord.gg/fal-ai).

## [​](#the-proxy-formula) The proxy formula

In case fal doesn’t provide a plug-and-play proxy implementation for your language/framework, you can use the following formula to implement your own proxy:

1. Provide a single endpoint that will ingest all requests from the client (e.g. `/api/fal/proxy` is commonly used as the default route path).
2. The endpoint must support both `GET` and `POST` requests. When an unsupported HTTP method is used, the proxy must return status code `405`, Method Not Allowed.
3. The URL the proxy needs to call is provided by the `x-fal-target-url` header. If the header is missing, the proxy must return status code `400`, Bad Request. In case it doesn’t point to a valid URL, or the URL’s domain is not `*.fal.ai` or `*.fal.run`, the proxy must return status code `412`, Precondition Failed.
4. The request body, when present, is always in the JSON format - i.e. `content-type` header is `application/json`. Any other type of content must be rejected with status code `415`, Unsupported Media Type.
5. The proxy must add the `authorization` header in the format of `Key <your-api-key>` to the request it sends to the target URL. Your API key should be resolved from the environment variable `FAL_KEY`.
6. The response from the target URL will always be in the JSON format, the proxy must return the same response to the client.
7. The proxy must return the same HTTP status code as the target URL.
8. The proxy must return the same headers as the target URL, except for the `content-length` and `content-encoding` headers, which should be set by the your own server/framework automatically.

**Use the power of LLMs**The formula above was written in a way that should be easy to follow, including by LLMs. Try using ChatGPT or Co-pilot with the formula above and your should get a good starting point for your own implementation. Let us know if you try that!

## [​](#configure-the-client) Configure the client

To use the proxy, you need to configure the client to use the proxy endpoint. You can do that by setting the `proxyUrl` option in the client configuration:

Report incorrect code

Copy

Ask AI

```
import { fal } from "@fal-ai/client";

fal.config({
  proxyUrl: "/api/fal/proxy",
});
```

## [​](#example-implementation) Example implementation

You can find a reference implementation of the proxy formula using TypeScript, which supports both Express and Next.js, in [serverless-js/libs/proxy/src/index.ts](https://github.com/fal-ai/serverless-js/blob/main/libs/proxy/src/index.ts).

Was this page helpful?

YesNo

[HTTP over WebSockets API | fal.ai Reference

Previous](/model-apis/model-endpoints/websockets)[Workflow endpoints API | fal.ai Reference

Next](/model-apis/model-endpoints/workflows)

⌘I