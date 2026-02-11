---
title: Prompt Enhancer API
source_url: https://runware.ai/docs/en/tools/prompt-enhancer
fetched_at: 2025-10-27 03:51:50
---

## [Introduction](#introduction)

Prompt enhancement is a powerful tool designed to **refine and diversify** the results generated for a specific topic. By incorporating additional keywords into a given prompt, this feature aims to expand the scope and creativity of the generated images.

It's important to note that while prompt enhancement can produce varied results, it may not always maintain the exact subject focus of the original prompt and does not guarantee superior outcomes compared to the original input.

## [Request](#request)

Our API always accepts an array of objects as input, where each object represents a **specific task to be performed**. The structure of the object varies depending on the type of the task. For this section, we will focus on the parameters related to the **prompt enhancement task**.

The following JSON snippets shows the basic structure of a request object. **All properties are explained in detail in the next section**.

```
[
  {
    "taskType": "promptEnhance",
    "taskUUID": "9da1a4ad-c3de-4470-905d-5be5c042f98a",
    "prompt": "dog",
    "promptMaxLength": 64,
    "promptVersions": 4
  }
]
```

### [taskType](https://runware.ai/docs/en/tools/prompt-enhancer#request-tasktype) string required
:   The type of task to be performed. For this task, the value should be `promptEnhance`.

### [taskUUID](https://runware.ai/docs/en/tools/prompt-enhancer#request-taskuuid) string required UUID v4
:   When a task is sent to the API you must include a random UUID v4 string using the `taskUUID` parameter. This string is used to match the async responses to their corresponding tasks.

    If you send multiple tasks at the same time, the `taskUUID` will help you match the responses to the correct tasks.

    The `taskUUID` must be unique for each task you send to the API.

### [webhookURL](https://runware.ai/docs/en/tools/prompt-enhancer#request-webhookurl) string
:   Specifies a webhook URL where JSON responses will be sent via HTTP POST when generation tasks complete. For batch requests with multiple results, each completed item triggers a separate webhook call as it becomes available.

    Webhooks can be secured using standard authentication methods supported by your endpoint, such as tokens in query parameters or API keys.

    ```
    // Basic webhook endpoint
    https://api.example.com/webhooks/runware

    // With authentication token in query
    https://api.example.com/webhooks/runware?token=your_auth_token

    // With API key parameter
    https://api.example.com/webhooks/runware?apiKey=sk_live_abc123

    // With custom tracking parameters
    https://api.example.com/webhooks/runware?projectId=proj_789&userId=12345
    ```

    The webhook POST body contains the JSON response for the completed task according to your request configuration.

### [deliveryMethod](https://runware.ai/docs/en/tools/prompt-enhancer#request-deliverymethod) "sync" | "async" required Default: sync
:   Determines how the API delivers task results. Choose between immediate synchronous delivery or polling-based asynchronous delivery depending on your task requirements.

    **Sync mode (`"sync"`)**:

    Returns complete results directly in the API response when processing completes within the timeout window. For long-running tasks like video generation or model uploads, the request will timeout before completion, though the task continues processing in the background and results remain accessible through the dashboard.

    **Async mode (`"async"`)**:

    Returns an immediate acknowledgment with the task UUID, requiring you to poll for results using [getResponse](/docs/en/utilities/task-responses) once processing completes. This approach prevents timeout issues and allows your application to handle other operations while waiting.

    **Polling workflow (async)**:

    1. Submit request with `deliveryMethod: "async"`.
    2. Receive immediate response with the task UUID.
    3. Poll for completion using `getResponse` task.
    4. Retrieve final results when status shows `"success"`.

    **When to use each mode**:

    - **Sync**: Fast image generation, simple processing tasks.
    - **Async**: Video generation, model uploads, or any task that usually takes more than 60 seconds.

    Async mode is required for computationally intensive operations to avoid timeout errors.

### [includeCost](https://runware.ai/docs/en/tools/prompt-enhancer#request-includecost) boolean Default: false
:   If set to `true`, the cost to perform the task will be included in the response object.

### [prompt](https://runware.ai/docs/en/tools/prompt-enhancer#request-prompt) string required Min: 1 Max: 300
:   The prompt that you intend to enhance.

### [promptMaxLength](https://runware.ai/docs/en/tools/prompt-enhancer#request-promptmaxlength) integer required Min: 12 Max: 400
:   Represents the maximum length of the enhanced prompt that you intend to receive expressed in tokens. Approximately 100 tokens correspond to about 75 words or 500 characters.

### [promptVersions](https://runware.ai/docs/en/tools/prompt-enhancer#request-promptversions) integer required Min: 1 Max: 5
:   The number of prompt versions that will be received.

## [Response](#response)

Results will be delivered in the format below.

```
{
  "data": [
    {
      "taskType": "promptEnhance",
      "taskUUID": "9da1a4ad-c3de-4470-905d-5be5c042f98a",
      "text": "dog, ilya kuvshinov, gaston bussiere, craig mullins, simon bisley, arthur rackham",
      "cost": 0
    },
    {
      "taskType": "promptEnhance",
      "taskUUID": "9da1a4ad-c3de-4470-905d-5be5c042f98a",
      "text": "dog, ilya kuvshinov, artgerm",
      "cost": 0
    },
    {
      "taskType": "promptEnhance",
      "taskUUID": "9da1a4ad-c3de-4470-905d-5be5c042f98a",
      "text": "dog, ilya kuvshinov, gaston bussiere, craig mullins, simon bisley",
      "cost": 0
    },
    {
      "taskType": "promptEnhance",
      "taskUUID": "9da1a4ad-c3de-4470-905d-5be5c042f98a",
      "text": "dog, ilya kuvshinov, artgerm, krenz cushart, greg rutkowski, pixiv. cinematic dramatic atmosphere, sharp focus, volumetric lighting, cinematic lighting, studio quality",
      "cost": 0
    }
  ]
}
```

### [taskType](https://runware.ai/docs/en/tools/prompt-enhancer#response-tasktype) string
:   The API will return the `taskType` you sent in the request. In this case, it will be `promptEnhance`. This helps match the responses to the correct task type.

### [taskUUID](https://runware.ai/docs/en/tools/prompt-enhancer#response-taskuuid) string UUID v4
:   The API will return the `taskUUID` you sent in the request. This way you can match the responses to the correct request tasks.

### [text](https://runware.ai/docs/en/tools/prompt-enhancer#response-text) string
:   The enhanced text/prompt response.

### [cost](https://runware.ai/docs/en/tools/prompt-enhancer#response-cost) float
:   if `includeCost` is set to `true`, the response will include a `cost` field for each task object. This field indicates the cost of the request in USD.

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