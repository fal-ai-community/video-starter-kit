---
title: Keeping fal API Secrets Safe | fal.ai Real-Time Models
source_url: https://docs.fal.ai/model-apis/real-time/secrets
fetched_at: 2025-10-27 03:52:35
---

[Skip to main content](#content-area)

[fal home page![light logo](https://mintcdn.com/fal-d8505a2e/_1QeqsRe91WUAOCJ/logo/light.svg?fit=max&auto=format&n=_1QeqsRe91WUAOCJ&q=85&s=04c374284984bf56c89974379f02b7a2)![dark logo](https://mintcdn.com/fal-d8505a2e/_1QeqsRe91WUAOCJ/logo/dark.svg?fit=max&auto=format&n=_1QeqsRe91WUAOCJ&q=85&s=b136c77964ac416a72cb0bcba775d7c7)](https://fal.ai/)

Search...

⌘K

Search...

Navigation

Real-Time

Keeping fal API Secrets Safe | fal.ai Real-Time Models

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

The WebSocket connection is established directly from the browser or native mobile application, making it unsafe to embed API keys and secrets directly into the client. To address this, we have developed additional tools to enable secure authentication with our servers without introducing unnecessary intermediaries between the client and our GPU servers. Instead of using traditional API keys, we recommend utilizing short-lived [JWT](https://jwt.io/) tokens for authentication.
Easiest way to communicate with fal using websockets is through our [javascript](https://github.com/fal-ai/fal-js) and [swift](https://github.com/fal-ai/fal-swift) clients and a [server proxy](/model-apis/model-endpoints/server-side).

**Server Side Proxy**Checkout our [Server Side Integration](/model-apis/model-endpoints/server-side#ready-to-use-proxy-implementations) section to learn more about using a ready made proxy with your Node.js or Next.js app or implement your own.

When `fal.realtime.connect` is invoked the fal client gets a short lived [JWT](https://jwt.io/) token through a server proxy to authenticate with fal services. This token is refreshed automatically by the client when it is needed.

Javascript

Swift

Report incorrect code

Copy

Ask AI

```
import { fal } from "@fal-ai/client";

fal.config({
  proxyUrl: "/api/fal/proxy",
});

const { send } = fal.realtime.connect("fal-ai/fast-lcm-diffusion", {
  connectionKey: "realtime-demo",
  throttleInterval: 128,
  onResult(result) {
    // display
  },
});
```

Checkout the [FalRealtimeSampleApp (swift)](https://github.com/fal-ai/fal-swift/tree/main/Sources/Samples/FalRealtimeSampleApp) and [realtime demo (js)](https://github.com/fal-ai/fal-js/blob/main/apps/demo-nextjs-app-router/app/realtime/page.tsx) for more details.

Was this page helpful?

YesNo

[Real Time Models Quickstart | fal.ai Real-Time Models

Previous](/model-apis/real-time/quickstart)[Error Reference

Next](/model-apis/errors)

⌘I