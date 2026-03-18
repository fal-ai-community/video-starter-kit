---
title: Add fal.ai to your Next.js app Integration
source_url: https://docs.fal.ai/model-apis/integrations/nextjs
fetched_at: 2025-10-27 03:52:25
---

[Skip to main content](#content-area)

[fal home page![light logo](https://mintcdn.com/fal-d8505a2e/_1QeqsRe91WUAOCJ/logo/light.svg?fit=max&auto=format&n=_1QeqsRe91WUAOCJ&q=85&s=04c374284984bf56c89974379f02b7a2)![dark logo](https://mintcdn.com/fal-d8505a2e/_1QeqsRe91WUAOCJ/logo/dark.svg?fit=max&auto=format&n=_1QeqsRe91WUAOCJ&q=85&s=b136c77964ac416a72cb0bcba775d7c7)](https://fal.ai/)

Search...

⌘K

Search...

Navigation

Integrations

Add fal.ai to your Next.js app Integration

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

- [You will learn how to:](#you-will-learn-how-to%3A)
- [Prerequisites](#prerequisites)
- [1. Install the fal.ai libraries](#1-install-the-fal-ai-libraries)
- [2. Setup the proxy](#2-setup-the-proxy)
- [2.1. Page Router](#2-1-page-router)
- [2.2. App Router](#2-2-app-router)
- [2.3. Setup the API Key](#2-3-setup-the-api-key)
- [2.4. Custom proxy logic](#2-4-custom-proxy-logic)
- [3. Configure the client](#3-configure-the-client)
- [4. Generate an image](#4-generate-an-image)
- [What’s next?](#what%E2%80%99s-next%3F)

## [​](#you-will-learn-how-to%3A) You will learn how to:

1

Install the fal.ai libraries

2

Add a server proxy to protect your credentials

3

Generate an image using SDXL

## [​](#prerequisites) Prerequisites

1. Have an existing Next.js app or create a new one using `npx create-next-app`
2. Have a [fal.ai](https://fal.ai) account
3. Have an API Key. You can [create one here](https://fal.ai/dashboard/keys)

## [​](#1-install-the-fal-ai-libraries) 1. Install the fal.ai libraries

Using your favorite package manager, install both the `@fal-ai/client` and `@fal-ai/server-proxy` libraries.

npm

yarn

pnpm

Report incorrect code

Copy

Ask AI

```
npm install @fal-ai/client @fal-ai/server-proxy
```

## [​](#2-setup-the-proxy) 2. Setup the proxy

The proxy will protect your API Key and prevent it from being exposed to the client. Usually app implementation have to handle that integration themselves, but in order to make the integration as smooth as possible, we provide a drop-in proxy implementation that can be integrated with either the **Page Router** or the **App Router**.

### [​](#2-1-page-router) 2.1. Page Router

If you are using the **Page Router** (i.e. `src/pages/_app.js`), create an API handler in `src/pages/api/fal/proxy.js` (or `.ts` in case of TypeScript), and re-export the built-in proxy handler:

Report incorrect code

Copy

Ask AI

```
export { handler as default } from "@fal-ai/server-proxy/nextjs";
```

### [​](#2-2-app-router) 2.2. App Router

If you are using the **App Router** (i.e. `src/app/page.jsx`) create a route handler in `src/app/api/fal/proxy/route.js` (or `.ts` in case of TypeScript), and re-export the route handler:

Report incorrect code

Copy

Ask AI

```
import { route } from "@fal-ai/server-proxy/nextjs";

export const { GET, POST } = route;
```

### [​](#2-3-setup-the-api-key) 2.3. Setup the API Key

Make sure you have your API Key available as an environment variable. You can setup in your `.env.local` file for development and also in your hosting provider for production, such as [Vercel](https://vercel.com/docs/projects/environment-variables).

Report incorrect code

Copy

Ask AI

```
FAL_KEY="key_id:key_secret"
```

### [​](#2-4-custom-proxy-logic) 2.4. Custom proxy logic

It’s common for applications to execute custom logic before or after the proxy handler. For example, you may want to add a custom header to the request, or log the request and response, or apply some rate limit. The good news is that the proxy implementation is simply a standard Next.js API/route handler function, which means you can compose it with other handlers.
For example, let’s assume you want to add some analytics and apply some rate limit to the proxy handler:

Report incorrect code

Copy

Ask AI

```
import { route } from "@fal-ai/server-proxy/nextjs";

// Let's add some custom logic to POST requests - i.e. when the request is
// submitted for processing
export const POST = (req) => {
  // Add some analytics
  analytics.track("fal.ai request", {
    targetUrl: req.headers["x-fal-target-url"],
    userId: req.user.id,
  });

  // Apply some rate limit
  if (rateLimiter.shouldLimit(req)) {
    res.status(429).json({ error: "Too many requests" });
  }

  // If everything passed your custom logic, now execute the proxy handler
  return route.POST(req);
};

// For GET requests we will just use the built-in proxy handler
// But you could also add some custom logic here if you need
export const GET = route.GET;
```

Note that the URL that will be forwarded to server is available as a header named `x-fal-target-url`. Also, keep in mind the example above is just an example, `rateLimiter` and `analytics` are just placeholders.
The example above used the app router, but the same logic can be applied to the page router and its `handler` function.

## [​](#3-configure-the-client) 3. Configure the client

On your main file (i.e. `src/pages/_app.jsx` or `src/app/page.jsx`), configure the client to use the proxy:

Report incorrect code

Copy

Ask AI

```
import { fal } from "@fal-ai/client";

fal.config({
  proxyUrl: "/api/fal/proxy",
});
```

**Protect your API Key**Although the client can be configured with credentials, use that only for rapid prototyping. We recommend you always use the proxy to avoid exposing your API Key in the client before you deploy your web application. See the [server-side guide](/model-apis/model-endpoints/server-side) for more details.

## [​](#4-generate-an-image) 4. Generate an image

Now that the client is configured, you can generate an image using `fal.subscribe` and pass the model id and the input parameters:

Report incorrect code

Copy

Ask AI

```
const result = await fal.subscribe("fal-ai/flux/dev", {
  input: {
    prompt,
    image_size: "square_hd",
  },
  pollInterval: 5000,
  logs: true,
  onQueueUpdate(update) {
    console.log("queue update", update);
  },
});

const imageUrl = result.images[0].url;
```

See more about Flux Dev used in this example on [fal.ai/models/fal-ai/flux/dev](https://fal.ai/models/fal-ai/flux/dev).

## [​](#what%E2%80%99s-next%3F) What’s next?

Image generation is just one of the many cool things you can do with fal. Make sure you:

- Check our demo application at [github.com/fal-ai/serverless-js/apps/demo-nextjs-app-router](https://github.com/fal-ai/fal-js/tree/main/apps/demo-nextjs-app-router)
- Check all the available [Model APIs](https://fal.ai/models)
- Learn how to write your own model APIs on [Introduction to serverless functions](/serverless)
- Read more about function endpoints on [private serverless models](/serverless)
- Check the next page to learn how to [deploy your app to Vercel](/model-apis/integrations/vercel)

Was this page helpful?

YesNo

[GitHub Authentication Authentication

Previous](/model-apis/authentication/github)[Add fal.ai to your Next.js app Integration

Next](/model-apis/integrations/vercel)

⌘I