---
title: Queue API | fal.ai Reference
source_url: https://docs.fal.ai/model-apis/model-endpoints/queue
fetched_at: 2025-10-27 03:52:28
---

[Skip to main content](#content-area)

[fal home page![light logo](https://mintcdn.com/fal-d8505a2e/_1QeqsRe91WUAOCJ/logo/light.svg?fit=max&auto=format&n=_1QeqsRe91WUAOCJ&q=85&s=04c374284984bf56c89974379f02b7a2)![dark logo](https://mintcdn.com/fal-d8505a2e/_1QeqsRe91WUAOCJ/logo/dark.svg?fit=max&auto=format&n=_1QeqsRe91WUAOCJ&q=85&s=b136c77964ac416a72cb0bcba775d7c7)](https://fal.ai/)

Search...

⌘K

Search...

Navigation

Models Endpoints

Queue API | fal.ai Reference

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

- [Queue endpoints](#queue-endpoints)
- [Submit a request](#submit-a-request)
- [Request status](#request-status)
- [Status types](#status-types)
- [Logs](#logs)
- [Streaming status](#streaming-status)
- [Cancelling a request](#cancelling-a-request)
- [Getting the response](#getting-the-response)
- [Using webhook callbacks](#using-webhook-callbacks)

It offers granular control in dealing with surges in traffic, allows you to cancel requests and monitor the current position within the queue, and removes the need to keep long running connections open.

### [​](#queue-endpoints) Queue endpoints

The queue functionality is exposed via standardized per-model paths under `https://queue.fal.run`.

| Endpoint | Method | Description |
| --- | --- | --- |
| **`https://queue.fal.run/{model_id}`** | POST | Adds a request to the queue for a top-level path |
| **`https://queue.fal.run/{model_id}/{subpath}`** | POST | Adds a request to the queue for an optional subpath |
| **`https://queue.fal.run/{model_id}/requests/{request_id}/status`** | GET | Gets the status of a request |
| **`https://queue.fal.run/{model_id}/requests/{request_id}/status/stream`** | GET | Streams the status of a request until it’s completed |
| **`https://queue.fal.run/{model_id}/requests/{request_id}`** | GET | Gets the response of a request |
| **`https://queue.fal.run/{model_id}/requests/{request_id}/cancel`** | PUT | Cancels a request that has not started processing |

Parameters:

- `model_id`: the model ID consists of a namespace and model name separated by a slash, e.g. `fal-ai/fast-sdxl`. Many models expose only a single
  top-level endpoint, so you can directly call them by `model_id`.
- `subpath`: some models expose different capabilities at different sub-paths, e.g. `fal-ai/flux/dev`. The subpath (`/dev` in this case) should be used
  when making the request, but not when getting request status or results
- `request_id` is returned after adding a request to the queue. This is the identifier you use to check the status and get results and logs

### [​](#submit-a-request) Submit a request

Here is an example of using curl to submit a request which will add it to the queue:

Report incorrect code

Copy

Ask AI

```
curl -X POST https://queue.fal.run/fal-ai/fast-sdxl \
  -H "Authorization: Key $FAL_KEY" \
  -d '{"prompt": "a cat"}'
```

Here’s an example of a response with the `request_id`:

Report incorrect code

Copy

Ask AI

```
{
  "request_id": "80e732af-660e-45cd-bd63-580e4f2a94cc",
  "response_url": "https://queue.fal.run/fal-ai/fast-sdxl/requests/80e732af-660e-45cd-bd63-580e4f2a94cc",
  "status_url": "https://queue.fal.run/fal-ai/fast-sdxl/requests/80e732af-660e-45cd-bd63-580e4f2a94cc/status",
  "cancel_url": "https://queue.fal.run/fal-ai/fast-sdxl/requests/80e732af-660e-45cd-bd63-580e4f2a94cc/cancel"
}
```

The payload helps you to keep track of your request with the `request_id`, and provides you with the necessary information to get the status of your request, cancel it or get the response once it’s ready, so you don’t have to build these endpoints yourself.

### [​](#request-status) Request status

Once you have the request id you may use this request id to get the status of the request. This endpoint will give you information about your request’s status, it’s position in the queue or the response itself if the response is ready.

Report incorrect code

Copy

Ask AI

```
curl -X GET https://queue.fal.run/fal-ai/fast-sdxl/requests/{request_id}/status
```

Here’s an example of a response with the `IN_QUEUE` status:

Report incorrect code

Copy

Ask AI

```
{
  "status": "IN_QUEUE",
  "queue_position": 0,
  "response_url": "https://queue.fal.run/fal-ai/fast-sdxl/requests/80e732af-660e-45cd-bd63-580e4f2a94cc"
}
```

#### [​](#status-types) Status types

Queue `status` can have one of the following types and their respective properties:

- **`IN_QUEUE`**:
  - `queue_position`: The current position of the task in the queue.
  - `response_url`: The URL where the response will be available once the task is processed.
- **`IN_PROGRESS`**:
  - `logs`: An array of logs related to the request. Note that it needs to be enabled, as explained in the next section.
  - `response_url`: The URL where the response will be available.
- **`COMPLETED`**:
  - `logs`: An array of logs related to the request. Note that it needs to be enabled, as explained in the next section.
  - `response_url`: The URL where the response is available.

#### [​](#logs) Logs

Logs are disabled by default. In order to enable logs for your request, you need to send the `logs=1` query parameter when getting the status of your request. For example:

Report incorrect code

Copy

Ask AI

```
curl -X GET https://queue.fal.run/fal-ai/fast-sdxl/requests/{request_id}/status?logs=1
```

When enabled, the `logs` attribute in the queue status contains an array of log entries, each represented by the `RequestLog` type. A `RequestLog` object has the following attributes:

- `message`: a string containing the log message.
- `level`: the severity of the log, it can be one of the following:
  - `STDERR` | `STDOUT` | `ERROR` | `INFO` | `WARN` | `DEBUG`
- `source`: indicates the source of the log.
- `timestamp`: a string representing the time when the log was generated.

These logs offer valuable insights into the status and progress of your queued tasks, facilitating effective monitoring and debugging.

#### [​](#streaming-status) Streaming status

If you want to keep track of the status of your request in real-time, you can use the streaming endpoint.
The response is `text/event-stream` and each event is a JSON object with the status of the request exactly as the non-stream endpoint.
This endpoint will keep the connection open until the status of the request changes to `COMPLETED`.
It supports the same `logs` query parameter as the status.

Report incorrect code

Copy

Ask AI

```
curl -X GET https://queue.fal.run/fal-ai/fast-sdxl/requests/{request_id}/status/stream
```

Here is an example of a stream of status updates:

Report incorrect code

Copy

Ask AI

```
$ curl https://queue.fal.run/fashn/tryon/requests/3e3e5b55-45fb-4e5c-b4d1-05702dffc8bf/status/stream?logs=1 --header "Authorization: Key $FAL_KEY"

data: {"status": "IN_PROGRESS", "request_id": "3e3e5b55-45fb-4e5c-b4d1-05702dffc8bf", "response_url": "https://queue.fal.run/fashn/tryon/requests/3e3e5b55-45fb-4e5c-b4d1-05702dffc8bf", "status_url": "https://queue.fal.run/fashn/tryon/requests/3e3e5b55-45fb-4e5c-b4d1-05702dffc8bf/status", "cancel_url": "https://queue.fal.run/fashn/tryon/requests/3e3e5b55-45fb-4e5c-b4d1-05702dffc8bf/cancel", "logs": [], "metrics": {}}

data: {"status": "IN_PROGRESS", "request_id": "3e3e5b55-45fb-4e5c-b4d1-05702dffc8bf", "response_url": "https://queue.fal.run/fashn/tryon/requests/3e3e5b55-45fb-4e5c-b4d1-05702dffc8bf", "status_url": "https://queue.fal.run/fashn/tryon/requests/3e3e5b55-45fb-4e5c-b4d1-05702dffc8bf/status", "cancel_url": "https://queue.fal.run/fashn/tryon/requests/3e3e5b55-45fb-4e5c-b4d1-05702dffc8bf/cancel", "logs": [{"timestamp": "2024-12-20T15:37:17.120314", "message": "INFO:TRYON:Preprocessing images...", "labels": {}}, {"timestamp": "2024-12-20T15:37:17.286519", "message": "INFO:TRYON:Running try-on model...", "labels": {}}], "metrics": {}}

data: {"status": "IN_PROGRESS", "request_id": "3e3e5b55-45fb-4e5c-b4d1-05702dffc8bf", "response_url": "https://queue.fal.run/fashn/tryon/requests/3e3e5b55-45fb-4e5c-b4d1-05702dffc8bf", "status_url": "https://queue.fal.run/fashn/tryon/requests/3e3e5b55-45fb-4e5c-b4d1-05702dffc8bf/status", "cancel_url": "https://queue.fal.run/fashn/tryon/requests/3e3e5b55-45fb-4e5c-b4d1-05702dffc8bf/cancel", "logs": [], "metrics": {}}

: ping

data: {"status": "IN_PROGRESS", "request_id": "3e3e5b55-45fb-4e5c-b4d1-05702dffc8bf", "response_url": "https://queue.fal.run/fashn/tryon/requests/3e3e5b55-45fb-4e5c-b4d1-05702dffc8bf", "status_url": "https://queue.fal.run/fashn/tryon/requests/3e3e5b55-45fb-4e5c-b4d1-05702dffc8bf/status", "cancel_url": "https://queue.fal.run/fashn/tryon/requests/3e3e5b55-45fb-4e5c-b4d1-05702dffc8bf/cancel", "logs": [], "metrics": {}}

data: {"status": "COMPLETED", "request_id": "3e3e5b55-45fb-4e5c-b4d1-05702dffc8bf", "response_url": "https://queue.fal.run/fashn/tryon/requests/3e3e5b55-45fb-4e5c-b4d1-05702dffc8bf", "status_url": "https://queue.fal.run/fashn/tryon/requests/3e3e5b55-45fb-4e5c-b4d1-05702dffc8bf/status", "cancel_url": "https://queue.fal.run/fashn/tryon/requests/3e3e5b55-45fb-4e5c-b4d1-05702dffc8bf/cancel", "logs": [{"timestamp": "2024-12-20T15:37:32.161184", "message": "INFO:TRYON:Finished running try-on model.", "labels": {}}], "metrics": {"inference_time": 17.795265674591064}}
```

### [​](#cancelling-a-request) Cancelling a request

If your request has not started processing (status is `IN_QUEUE`), you may attempt to cancel it.

Report incorrect code

Copy

Ask AI

```
curl -X PUT https://queue.fal.run/fal-ai/fast-sdxl/requests/{request_id}/cancel
```

If the request has not already started processing, you will get a `202 Accepted` response with the following body:

Report incorrect code

Copy

Ask AI

```
{
  "status": "CANCELLATION_REQUESTED"
}
```

Note that a request may still be executed after getting this response if it was very late in the queue process.
If the request is already processed, you will get a `400 Bad Request` response with this body:

Report incorrect code

Copy

Ask AI

```
{
  "status": "ALREADY_COMPLETED"
}
```

### [​](#getting-the-response) Getting the response

Once you get the `COMPLETED` status, the `response` will be available along with its `logs`.

Report incorrect code

Copy

Ask AI

```
curl -X GET https://queue.fal.run/fal-ai/fast-sdxl/requests/{request_id}
```

Here’s an example of a response with the `COMPLETED` status:

Report incorrect code

Copy

Ask AI

```
{
  "status": "COMPLETED",
  "logs": [
    {
      "message": "2020-05-04 14:00:00.000000",
      "level": "INFO",
      "source": "stdout",
      "timestamp": "2020-05-04T14:00:00.000000Z"
    }
  ],
  "response": {
    "message": "Hello World!"
  }
}
```

**A simple queue recipe**Submit your request and let our client handle the status tracking for you. The next section details how the fal client simplifies building apps with fal functions.

### [​](#using-webhook-callbacks) Using webhook callbacks

Instead of polling for the request status, you can have fal call a webhook when a request is finished. Please refer to the [Webhooks page](/model-apis/model-endpoints/webhooks).

Was this page helpful?

YesNo

[Model Endpoints API | fal.ai Reference

Previous](/model-apis/model-endpoints)[Webhooks API | fal.ai Reference

Next](/model-apis/model-endpoints/webhooks)

⌘I