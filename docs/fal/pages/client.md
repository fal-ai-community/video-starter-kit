---
title: Client Libraries
source_url: https://docs.fal.ai/model-apis/client
fetched_at: 2025-10-27 03:52:15
---

[Skip to main content](#content-area)

[fal home page![light logo](https://mintcdn.com/fal-d8505a2e/_1QeqsRe91WUAOCJ/logo/light.svg?fit=max&auto=format&n=_1QeqsRe91WUAOCJ&q=85&s=04c374284984bf56c89974379f02b7a2)![dark logo](https://mintcdn.com/fal-d8505a2e/_1QeqsRe91WUAOCJ/logo/dark.svg?fit=max&auto=format&n=_1QeqsRe91WUAOCJ&q=85&s=b136c77964ac416a72cb0bcba775d7c7)](https://fal.ai/)

Search...

⌘K

Search...

Navigation

Client Libraries

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

- [Introduction](#introduction)
- [Supported Languages](#supported-languages)
- [Installation](#installation)
- [Features](#features)
- [1. Call an endpoint](#1-call-an-endpoint)
- [2. Queue Management](#2-queue-management)
- [Submit a Request](#submit-a-request)
- [Check Request Status](#check-request-status)
- [Retrieve Request Result](#retrieve-request-result)
- [3. File Uploads](#3-file-uploads)
- [4. Streaming](#4-streaming)
- [5. Realtime Communication](#5-realtime-communication)
- [6. Run](#6-run)
- [API References](#api-references)
- [Examples](#examples)
- [Migration Guide](#migration-guide)
- [JavaScript: Migrating from serverless-client to client](#javascript%3A-migrating-from-serverless-client-to-client)
- [Support](#support)

## [​](#introduction) Introduction

fal provides official client libraries for multiple programming languages, offering a seamless interface to interact with our platform.

## [​](#supported-languages) Supported Languages

We officially support the following languages:

## JavaScript/TypeScript

## Python

## Swift (iOS)

## Java

## Kotlin

## Dart (Flutter)

**Don’t see your language?**We are working on adding support for more languages. Reach out on our [Discord Community](https://discord.gg/fal-ai) and let us know which language you would like to see next.In the meantime, you can use the [REST API directly](/model-apis/model-endpoints).

## [​](#installation) Installation

First, add the client as a dependency in your project:

npm

yarn

pnpm

bun

pip

Flutter

Swift Package

Gradle (Java)

Maven (Java)

Gradle (Kotlin)

Maven (Kotlin)

Report incorrect code

Copy

Ask AI

```
npm install --save @fal-ai/client
```

**Java Async Support**If your code relies on asynchronous operations via `CompletableFuture` or `Future`, you can use the `ai.fal.client:fal-client-async` artifact instead, which contains the necessary APIs for asynchronous programming.

## [​](#features) Features

### [​](#1-call-an-endpoint) 1. Call an endpoint

Endpoints requests are managed by a queue system. This allows fal to provide a reliable and scalable service.
The `subscribe` method allows you to submit a request to the queue and wait for the result.

JavaScript/TypeScript

Python

Python (async)

Swift

Java

Kotlin

Dart (Flutter)

Report incorrect code

Copy

Ask AI

```
import { fal } from "@fal-ai/client";

const result = await fal.subscribe("fal-ai/flux/dev", {
  input: {
    prompt: "a cat",
    seed: 6252023,
    image_size: "landscape_4_3",
    num_images: 4,
  },
  logs: true,
  onQueueUpdate: (update) => {
    if (update.status === "IN_PROGRESS") {
      update.logs.map((log) => log.message).forEach(console.log);
    }
  },
});

console.log(result.data);
console.log(result.requestId);
```

### [​](#2-queue-management) 2. Queue Management

You can manage the queue using the following methods:

#### [​](#submit-a-request) Submit a Request

Submit a request to the queue using the `queue.submit` method.

JavaScript/TypeScript

Python

Python (async)

Swift

Java

Kotlin

Dart (Flutter)

Report incorrect code

Copy

Ask AI

```
import { fal } from "@fal-ai/client";

const { request_id } = await fal.queue.submit("fal-ai/flux/dev", {
  input: {
    prompt: "a cat",
    seed: 6252023,
    image_size: "landscape_4_3",
    num_images: 4,
  },
  webhookUrl: "https://optional.webhook.url/for/results",
});
```

This is useful when you want to submit a request to the queue and retrieve the result later. You can save the `request_id` and use it to retrieve the result later.

**Webhooks**For long-running requests, such as **training jobs**, you can use webhooks to receive the result asynchronously. You can specify the webhook URL when submitting a request.

#### [​](#check-request-status) Check Request Status

Retrieve the status of a specific request in the queue:

JavaScript/TypeScript

Python

Python (async)

Swift

Java

Kotlin

Dart (Flutter)

Report incorrect code

Copy

Ask AI

```
import { fal } from "@fal-ai/client";

const status = await fal.queue.status("fal-ai/flux/dev", {
  requestId: "764cabcf-b745-4b3e-ae38-1200304cf45b",
  logs: true,
});
```

#### [​](#retrieve-request-result) Retrieve Request Result

Get the result of a specific request from the queue:

JavaScript/TypeScript

Python

Python (async)

Swift

Java

Kotlin

Dart (Flutter)

Report incorrect code

Copy

Ask AI

```
import { fal } from "@fal-ai/client";

const result = await fal.queue.result("fal-ai/flux/dev", {
  requestId: "764cabcf-b745-4b3e-ae38-1200304cf45b",
});

console.log(result.data);
console.log(result.requestId);
```

### [​](#3-file-uploads) 3. File Uploads

Some endpoints require files as input. However, since the endpoints run asynchronously, processed by the queue, you will need to provide URLs to the files instead of the actual file content.
Luckily, the client library provides a way to upload files to the server and get a URL to use in the request.

JavaScript/TypeScript

Python

Python (async)

Swift

Java

Kotlin

Dart (Flutter)

Report incorrect code

Copy

Ask AI

```
import { fal } from "@fal-ai/client";

const file = new File(["Hello, World!"], "hello.txt", { type: "text/plain" });
const url = await fal.storage.upload(file);
```

### [​](#4-streaming) 4. Streaming

Some endpoints support streaming:

JavaScript/TypeScript

Python

Python (async)

Swift

Java

Kotlin

Dart (Flutter)

Report incorrect code

Copy

Ask AI

```
import { fal } from "@fal-ai/client";

const stream = await fal.stream("fal-ai/flux/dev", {
  input: {
    prompt: "a cat",
    seed: 6252023,
    image_size: "landscape_4_3",
    num_images: 4,
  },
});

for await (const event of stream) {
  console.log(event);
}

const result = await stream.done();
```

### [​](#5-realtime-communication) 5. Realtime Communication

For the endpoints that support real-time inference via WebSockets, you can use the realtime client that abstracts the WebSocket connection, re-connection, serialization, and provides a simple interface to interact with the endpoint:

JavaScript/TypeScript

Python

Python (async)

Swift

Java

Kotlin

Dart (Flutter)

Report incorrect code

Copy

Ask AI

```
import { fal } from "@fal-ai/client";

const connection = fal.realtime.connect("fal-ai/flux/dev", {
  onResult: (result) => {
    console.log(result);
  },
  onError: (error) => {
    console.error(error);
  },
});

connection.send({
  prompt: "a cat",
  seed: 6252023,
  image_size: "landscape_4_3",
  num_images: 4,
});
```

### [​](#6-run) 6. Run

The endpoints can also be called directly instead of using the queue system.

**Prefer the queue**We **do not recommend** this use most use cases as it will block the client
until the response is received. Moreover, if the connection is closed before
the response is received, the request will be lost.

JavaScript/TypeScript

Python

Python (async)

Swift

Java

Kotlin

Dart (Flutter)

Report incorrect code

Copy

Ask AI

```
import { fal } from "@fal-ai/client";

const result = await fal.run("fal-ai/flux/dev", {
  input: {
    prompt: "a cat",
    seed: 6252023,
    image_size: "landscape_4_3",
    num_images: 4,
  },
});

console.log(result.data);
console.log(result.requestId);
```

## [​](#api-references) API References

For a complete list of available methods and their parameters, please refer to the language-specific API Reference documentation:

- [JavaScript/TypeScript API Reference](https://fal-ai.github.io/fal-js/reference)
- [Python API Reference](https://fal-ai.github.io/fal/client)
- [Swift (iOS) API Reference](https://swiftpackageindex.com/fal-ai/fal-swift/documentation/falclient)
- [Java API Reference](https://fal-ai.github.io/fal-java/fal-client/index.html)
- [Kotlin API Reference](https://fal-ai.github.io/fal-java/fal-client-kotlin/fal-client-kotlin/ai.fal.client.kt/index.html)
- [Dart (Flutter) API Reference](https://pub.dev/documentation/fal_client/latest)

## [​](#examples) Examples

Check out some of the examples below to see real-world use cases of the client libraries:

- **JavaScript**: See `fal.realtime` in action with SDXL Lightning: <https://github.com/fal-ai/sdxl-lightning-demo-app>
- **Dart (Flutter)**: Simple Flutter app using fal image inference: <https://pub.dev/packages/fal_client/example>

## [​](#migration-guide) Migration Guide

### [​](#javascript%3A-migrating-from-serverless-client-to-client) JavaScript: Migrating from `serverless-client` to `client`

As fal no longer uses “serverless” as part of the AI provider branding, we also made sure that’s reflected in our libraries. However, that’s not the only thing that changed in the new client. There was lot’s of improvements that happened thanks to our community feedback.
So, if you were using the `@fal-ai/serverless-client` package, you can upgrade to the new `@fal-ai/client` package by following these steps:

1

Remove the `@fal-ai/serverless-client` package from your project:

Report incorrect code

Copy

Ask AI

```
npm uninstall @fal-ai/serverless-client
```

2

Install the new `@fal-ai/client` package:

Report incorrect code

Copy

Ask AI

```
npm install --save @fal-ai/client
```

3

Update your imports:

Report incorrect code

Copy

Ask AI

```
import * as fal from "@fal-ai/serverless-client"; 
import { fal } from "@fal-ai/client";
```

4

Now APIs return a `Result<Output>` type that contains the `data` which is the API output and the `requestId`. This is a breaking change from the previous version, that allows us to return extra data to the caller without future breaking changes.

Report incorrect code

Copy

Ask AI

```
const data = fal.subscribe(endpointId, { input }); 
const { data, requestId } = fal.subscribe(endpointId, { input });
```

**Note**The `fal` object is now a named export from the package that represents a singleton instance of the `FalClient` and was added to make it as easy as possible to migrate from the old singleton-only client. However, starting in `1.0.0` you can create multiple instances of the `FalClient` with the `createFalClient` function.

## [​](#support) Support

If you encounter any issues or have questions, please:

- Visit the respective GitHub repositories:
  - [JavaScript/TypeScript](https://github.com/fal-ai/fal-js)
  - [Python](https://github.com/fal-ai/fal)
  - [Swift](https://github.com/fal-ai/fal-swift)
  - [Java/Kotlin](https://github.com/fal-ai/fal-java)
  - [Dart (Flutter)](https://github.com/fal-ai/fal-dart)
- Join our [Discord Community](https://discord.gg/fal-ai)

Was this page helpful?

YesNo

[Workflow endpoints API | fal.ai Reference

Previous](/model-apis/model-endpoints/workflows)[Authentication Authentication | fal.ai Model APIs Docs

Next](/model-apis/authentication)

⌘I