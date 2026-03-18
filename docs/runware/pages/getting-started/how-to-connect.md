---
title: How to connect and authenticate
source_url: https://runware.ai/docs/en/getting-started/how-to-connect
fetched_at: 2025-10-27 03:51:26
---

## [Authentication](#authentication)

To interact with the Runware API, you need to authenticate your requests using an API key. This key is unique to your account and is used to identify you when making requests. You can create multiple keys for different projects or environments (development, production, staging) , add descriptions to them, and revoke them at any time. With the new teams feature, you can also share keys with your team members.

To create an API key, simply sign up on [Runware](https://my.runware.ai/signup) and visit the "API Keys" page. Then, click "Create Key" and fill the details for your new key.

## [HTTP (REST)](#http-rest)

We recommend using [WebSockets](#websockets) for a more efficient and faster connection. However, if you prefer to use a **simpler connection** and don't need to keep it open, you can use HTTP REST API.

The URL for the API is **`https://api.runware.ai/v1`**. All requests must be made using the `POST` method and the `Content-Type` header must be set to `application/json`.

The payload for each request is a **JSON array with one or more objects**. Each object represents a task to be executed by the API.

Authentication can be done by including the authentication object as the first element in the array, or by using the `Authorization` header with the value `Bearer <API_KEY>`.

Payload Auth

```
curl --location 'https://api.runware.ai/v1' \
     --header 'Content-Type: application/json' \
     --data-raw '[
       {
         "taskType": "authentication",
         "apiKey": "<API_KEY>"
       },
       {
         "taskType": "imageInference",
         "taskUUID": "39d7207a-87ef-4c93-8082-1431f9c1dc97",
         "positivePrompt": "a cat",
         "width": 512,
         "height": 512,
         "model": "civitai:102438@133677",
         "numberResults": 1
       }
     ]'
```

 Header Auth

```
curl --location 'https://api.runware.ai/v1' \
     --header 'Content-Type: application/json' \
     --header 'Authorization: Bearer <API_KEY>' \
     --data-raw '[
       {
         "taskType": "imageInference",
         "taskUUID": "39d7207a-87ef-4c93-8082-1431f9c1dc97",
         "positivePrompt": "a cat",
         "width": 512,
         "height": 512,
         "model": "civitai:102438@133677",
         "numberResults": 1
       }
     ]'
```

The API will return a JSON object with the `data` property. This property is an array containing all the response objects. Each object will contain the `taskType` and the `taskUUID` of the request it's responding to, as well as other properties related to the task.

```
{
  "data": [
    {
      "taskType": "imageInference",
      "taskUUID": "39d7207a-87ef-4c93-8082-1431f9c1dc97",
      "imageUUID": "b7db282d-2943-4f12-992f-77df3ad3ec71",
      "imageURL": "https://im.runware.ai/image/ws/0.5/ii/b7db282d-2943-4f12-992f-77df3ad3ec71.jpg"
    }
  ]
}
```

If there's an error, the API will not return the `data` property. Instead, it will return the `error` property, containing the error message.

## [WebSockets](#websockets)

We support WebSocket connections as they are **more efficient, faster, and less resource intensive**. We have made our WebSocket connections easy to work with, as each response contains the request ID. So it's possible to easily match **request → response**.

The API uses a bidirectional protocol that encodes all messages as **JSON objects**.

To connect you can use one of the sdks we provide [JavaScript](/docs/en/libraries/javascript), [Python](/docs/en/libraries/python) or manually.

If you prefer to connect manually (to use another language/technology), the endpoint URL is **`wss://ws-api.runware.ai/v1`**.

### [New connections](#new-connections)

#### [Request](#request)

WebSocket connections are point-to-point, so **there's no need for each request to contain an authentication header**.

Instead, the first request **must always** be an authentication request that includes the API key. This way we can identify which subsequent requests are arriving from the same user.

```
[
  {
    "taskType": "authentication",
    "apiKey": "<API_KEY>"
  }
]
```

#### [Response](#response)

After you've made the authentication request the API will return an object with the `connectionSessionUUID` parameter. This string is unique to your connection and is used to resume connections in case of disconnection (more on this later).

```
{
  "data": [
    {
      "taskType": "authentication",
      "connectionSessionUUID": "f40c2aeb-f8a7-4af7-a1ab-7594c9bf778f"
    }
  ]
}
```

In case of error you will receive an object with the error message.

```
{
  "errors": [
    {
      "code": "invalidApiKey",
      "message": "Invalid API key. Get one at https://my.runware.ai/signup",
      "parameter": "apiKey",
      "type": "string",
      "taskType": "authentication"
    }
  ]
}
```

### [Keeping connection alive](#keeping-connection-alive)

The WebSocket connection is kept open for 120 seconds **from the last message exchanged**. If you **don't send any messages for 120 seconds**, the connection will be closed automatically.

To keep the connection going, you can send a `ping` message when needed, to which we will reply with a `pong`.

```
[
  {
    "taskType": "ping",
    "ping": true
  }
]
```

```
{
  "data": [
    {
      "taskType": "ping",
      "pong": true
    }
  ]
}
```

### [Resuming connections](#resuming-connections)

If any service, server or network is unresponsive (for instance due to a restart), all the images or tasks that could not be delivered **are kept in a buffer memory for 120 seconds**. You can reconnect and have these messages delivered by including the `connectionSessionUUID` parameter in the initial authentication connection request.

```
[
  {
    "taskType": "authentication",
    "apiKey": "<API_KEY>",
    "connectionSessionUUID": "f40c2aeb-f8a7-4af7-a1ab-7594c9bf778f"
  }
]
```

This means that is not needed to make the same request again, the initial one will be delivered when reconnecting.

SDK libraries reconnects **automatically**.

Ask AI

×

Context: Full page

Include URL of the page

Copy context

AI Provider

Claude

ChatGPT

Mistral

Bing

What would you like to ask?

Ask AI

Send feedback

×

Context: Full page

Email address

Your feedback

Send Feedback

On this page

On this page