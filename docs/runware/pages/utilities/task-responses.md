---
title: Task Responses
source_url: https://runware.ai/docs/en/utilities/task-responses
fetched_at: 2025-10-27 03:51:51
---

## [Introduction](#introduction)

The `getResponse` task **retrieves responses from async operations** using their task UUID. This is essential for monitoring long-running tasks like video generation that use asynchronous processing.

Setting `"deliveryMethod": "async"` **queues your task for asynchronous processing** instead of waiting for immediate results. You receive an acknowledgment right away, then use `getResponse` to poll for status updates and retrieve the final response when ready.

### [How it works](#how-it-works)

When you call `getResponse` with a task UUID from an async operation, the system:

1. **Checks active operations**: Finds the running async task and all its generations.
2. **Returns current status**: Each generation shows "processing", "success", or "error" status.
3. **Provides responses as ready**: Completed generations include their final outputs.

This allows you to access partial results as they become available, rather than waiting for all generations to complete.

Polling best practices

Implement **exponential backoff** when polling to avoid overwhelming the API. Start with 1-2 second intervals and gradually increase delays between requests.

For tasks with predictable durations (like video generation), consider adding an **initial delay** before your first poll to reduce unnecessary requests.

## [Request](#request)

Our API always accepts an array of objects as input, where each object represents a **specific task to be performed**. The structure varies depending on the workflow and features used.

The following example shows the structure of a request object.

```
{
  "taskType": "getResponse",
  "taskUUID": "50836053-a0ee-4cf5-b9d6-ae7c5d140ada",
}
```

### [taskType](https://runware.ai/docs/en/utilities/task-responses#request-tasktype) string required
:   The type of task to be performed. For this task, the value should be `getResponse`.

### [taskUUID](https://runware.ai/docs/en/utilities/task-responses#request-taskuuid) string required UUID v4
:   When a task is sent to the API you must include a random UUID v4 string using the `taskUUID` parameter. This string is used to match the async responses to their corresponding tasks.

    If you send multiple tasks at the same time, the `taskUUID` will help you match the responses to the correct tasks.

    The `taskUUID` must be unique for each task you send to the API.

## [Response](#response)

All requests return the same response format. Processing and successful generations appear in the `data` array, while failed generations are moved to the `errors` array.

```
{
  "data": [
    // All processing inference tasks
    {
      "taskType": "videoInference",
      "taskUUID": "24cd5dff-cb81-4db5-8506-b72a9425f9d1",
      "status": "processing",
    },
    // All successful inference tasks
    {
      "taskType": "videoInference",
      "taskUUID": "24cd5dff-cb81-4db5-8506-b72a9425f9d1",
      "status": "success",
      "videoUUID": "b7db282d-2943-4f12-992f-77df3ad3ec71",
      "videoURL": "https://im.runware.ai/video/ws/0.5/vi/b7db282d-2943-4f12-992f-77df3ad3ec71.mp4",
      "cost": 0.18
    }
  ],
  "errors": [
    // All failed tasks with error info
    {
      "code": "timeoutProvider",
      "status": "error",
      "message": "The external provider did not respond within the timeout window. The request was automatically terminated.",
      "documentation": "https://runware.ai/docs/en/video-inference/api-reference",
      "taskUUID": "24cd5dff-cb81-4db5-8506-b72a9425f9d1"
    }
  ]
}
```

### [taskType](https://runware.ai/docs/en/utilities/task-responses#response-tasktype) string
:   The API will return the `taskType` you sent in the request. In this case, it will be `getResponse`. This helps match the responses to the correct task type.

### [taskUUID](https://runware.ai/docs/en/utilities/task-responses#response-taskuuid) string UUID v4
:   The API will return the `taskUUID` you sent in the request. This way you can match the responses to the correct request tasks.

### [status](https://runware.ai/docs/en/utilities/task-responses#response-status) string
:   The current status of this individual operation.

    Possible values:

    - **processing**: Operation is still processing.
    - **success**: Operation completed successfully.
    - **error**: Operation failed (item will be in errors array instead).

    Each operation within a task has its own status field to track its individual progress.

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