---
title: Add fal.ai to your Next.js app Integration
source_url: https://docs.fal.ai/model-apis/integrations/vercel
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
- [Vercel official integration](#vercel-official-integration)
- [Manual setup](#manual-setup)

## [​](#you-will-learn-how-to%3A) You will learn how to:

- Connect a Next.js app deployed on Vercel to fal.ai

## [​](#prerequisites) Prerequisites

1

A [fal.ai](https://fal.ai) account

2

A [Vercel account](https://vercel.com)

3

A Next.js app. Check the [Next.js guide](/model-apis/integrations/nextjs) if you don’t have one yet.

4

App deployed on Vercel. Run `npx vercel` in your app directory to deploy it in case you haven’t done it yet.

## [​](#vercel-official-integration) Vercel official integration

The recommended way to add fal.ai to your app deployed on Vercel is to use the official integration. You can find it in the [Vercel marketplace](https://vercel.com/integrations/fal).
Click on **Add integration** and follow the steps. After you’re done, re-deploy your app and you’re good to go!

![Vercel integration](https://integrations-og-image.vercel.sh/api/og/fal?42673700034a7509d66487f3ed68a2bd)

## [​](#manual-setup) Manual setup

You can also manually add fal credentials to your Vercel environment manually.

1

Go to your [fal.ai dashboard](https://fal.ai/dashboard/keys), create an **API-scoped** key and copy it. Make sure you create an alias do identify which app is using it.

2

Go to your app settings in Vercel and add a new environment variable called `FAL_KEY` with the value of the key you just copied. You can choose other names, but keep in mind that the default convention of fal-provided libraries is `FAL_KEY`.

3

Re-deploy your app and you’re good to go!

Was this page helpful?

YesNo

[Add fal.ai to your Next.js app Integration

Previous](/model-apis/integrations/nextjs)[Real-Time Models | fal.ai Real-Time Models

Next](/model-apis/real-time)

⌘I