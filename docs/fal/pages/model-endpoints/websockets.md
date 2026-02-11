---
title: HTTP over WebSockets API | fal.ai Reference
source_url: https://docs.fal.ai/model-apis/model-endpoints/websockets
fetched_at: 2025-10-27 03:52:31
---

[Skip to main content](#content-area)

[fal home page![light logo](https://mintcdn.com/fal-d8505a2e/_1QeqsRe91WUAOCJ/logo/light.svg?fit=max&auto=format&n=_1QeqsRe91WUAOCJ&q=85&s=04c374284984bf56c89974379f02b7a2)![dark logo](https://mintcdn.com/fal-d8505a2e/_1QeqsRe91WUAOCJ/logo/dark.svg?fit=max&auto=format&n=_1QeqsRe91WUAOCJ&q=85&s=b136c77964ac416a72cb0bcba775d7c7)](https://fal.ai/)

Search...

⌘K

Search...

Navigation

Models Endpoints

HTTP over WebSockets API | fal.ai Reference

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

- [WebSocket Endpoint](#websocket-endpoint)
- [Communication Protocol](#communication-protocol)
- [Example Interaction](#example-interaction)
- [Example Program](#example-program)
- [Example Program with Stream](#example-program-with-stream)

### [​](#websocket-endpoint) WebSocket Endpoint

To utilize the WebSocket functionality, use the `wss` protocol with the the `ws.fal.run` domain:

Report incorrect code

Copy

Ask AI

```
wss://ws.fal.run/{model_id}
```

### [​](#communication-protocol) Communication Protocol

Once connected, the communication follows a specific protocol with JSON messages for control flow and raw data for the actual response stream:

1. **Payload Message:** Send a JSON message containing the payload for your application. This is equivalent to the request body you would send to the HTTP endpoint.
2. **Start Metadata:** Receive a JSON message containing the HTTP response headers from your application. This allows you to understand the type and structure of the incoming response stream.
3. **Response Stream:** Receive the actual response data as a sequence of messages. These can be binary chunks for media content or a JSON object for structured data, depending on the `Content-Type` header.
4. **End Metadata:** Receive a final JSON message indicating the end of the response stream. This signals that the request has been fully processed and the next payload will be processed.

### [​](#example-interaction) Example Interaction

Here’s an example of a typical interaction with the WebSocket API:
**Client Sends (Payload Message):**

Report incorrect code

Copy

Ask AI

```
{"prompt": "generate a 10-second audio clip of a cat purring"}
```

**Server Responds (Start Metadata):**

Report incorrect code

Copy

Ask AI

```
{
  "type": "start",
  "request_id": "5d76da89-5d75-4887-a715-4302bf435614",
  "status": 200,
  "headers": {
    "Content-Type": "text/event-stream; charset=utf-8",
    "Transfer-Encoding": "chunked",
    // ...
  }
}
```

**Server Sends (Response Stream):**

Report incorrect code

Copy

Ask AI

```
<binary audio data chunk 1>
<binary audio data chunk 2>
...
<binary audio data chunk N>
```

**Server Sends (Completion Message):**

Report incorrect code

Copy

Ask AI

```
{
  "type": "end",
  "request_id": "5d76da89-5d75-4887-a715-4302bf435614",
  "status": 200,
  "time_to_first_byte_seconds": 0.577083
}
```

**Benefits of WebSockets**

- **Real-time Updates:** Ideal for applications that require immediate feedback, such as interactive AI models or live data visualization.
- **Efficient Data Transfer:** Enables streaming large data volumes without the overhead of multiple HTTP requests.
- **Persistent Connection:** Reduces latency and improves performance by maintaining an open connection throughout the interaction.

This WebSocket integration provides a powerful mechanism for building dynamic and responsive AI applications on the fal platform. By leveraging the streaming capabilities, you can unlock new possibilities for creative and interactive user experiences.

### [​](#example-program) Example Program

For instance, should you want to make fast prompts to any LLM, you can use `fal-ai/any-llm`.

Report incorrect code

Copy

Ask AI

```
import fal.apps

with fal.apps.ws("fal-ai/any-llm") as connection:
    for i in range(3):
        connection.send(
            {
                "model": "google/gemini-flash-1.5",
                "prompt": f"What is the meaning of life? Respond in {i} words.",
            }
        )

    # they should be in order
    for i in range(3):
        import json

        response = json.loads(connection.recv())
        print(response)
```

And running this program would output:

Report incorrect code

Copy

Ask AI

```
{'output': '(Silence)\n', 'partial': False, 'error': None}
{'output': 'Growth\n', 'partial': False, 'error': None}
{'output': 'Personal fulfillment.\n', 'partial': False, 'error': None}
```

### [​](#example-program-with-stream) Example Program with Stream

The `fal-ai/any-llm/stream` model is a streaming model that can generate text in real-time. Here’s an example of how you can use it:

Report incorrect code

Copy

Ask AI

```
with fal.apps.ws("fal-ai/any-llm/stream") as connection:
    # NOTE: this app responds in 'text/event-stream' format
    # For example:
    #
    #    event: event
    #    data: {"output": "Growth", "partial": true, "error": null}

    for i in range(3):
        connection.send(
            {
                "model": "google/gemini-flash-1.5",
                "prompt": f"What is the meaning of life? Respond in {i+1} words.",
            }
        )

    for i in range(3):
        for bs in connection.stream():
            lines = bs.decode().replace("\r\n", "\n").split("\n")

            event = {}
            for line in lines:
                if not line:
                    continue
                key, value = line.split(":", 1)
                event[key] = value.strip()

            print(event["data"])

        print("----")
```

And running this program would output:

Report incorrect code

Copy

Ask AI

```
{"output": "Perspective", "partial": true, "error": null}
{"output": "Perspective.\n", "partial": true, "error": null}
{"output": "Perspective.\n", "partial": true, "error": null}
{"output": "Perspective.\n", "partial": false, "error": null}
----
{"output": "Find", "partial": true, "error": null}
{"output": "Find meaning.\n", "partial": true, "error": null}
{"output": "Find meaning.\n", "partial": true, "error": null}
{"output": "Find meaning.\n", "partial": false, "error": null}
----
{"output": "Be", "partial": true, "error": null}
{"output": "Be, love, grow.\n", "partial": true, "error": null}
{"output": "Be, love, grow.\n", "partial": true, "error": null}
{"output": "Be, love, grow.\n", "partial": false, "error": null}
----
```

Was this page helpful?

YesNo

[Synchronous Requests API | fal.ai Reference

Previous](/model-apis/model-endpoints/synchronous-requests)[Server-side integration API | fal.ai Reference

Next](/model-apis/model-endpoints/server-side)

⌘I