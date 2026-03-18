---
title: Image Upload
source_url: https://runware.ai/docs/en/utilities/image-upload
fetched_at: 2025-10-27 03:51:46
---

## [Introduction](#introduction)

Images can be uploaded to be used in other tasks like [image-to-image](/docs/en/image-inference/api-reference), [upscaling](/docs/en/tools/upscale) or [ControlNet preprocess](/docs/en/tools/controlnet-preprocess).

There are 3 things to keep in mind:

- Valid extensions are: `jpeg`, `jpg`, `png`, `webp`, `bmp` and `gif`.
- There is no limit on image size but we save them with a maximum of 2048 pixels in width or height, maintaining the original aspect ratio.
- Images are deleted 30 days after last use. As long as you continue using them, we will continue saving them indefinitely.

## [Request](#request)

Our API always accepts an array of objects as input, where each object represents a **specific task to be performed**. The structure of the object varies depending on the type of the task. For this section, we will focus on the parameters related to the **image upload task**.

The following JSON snippet shows the basic structure of a request object. **All properties are explained in detail in the next section**.

```
[
  {
    "taskType": "imageUpload",
    "taskUUID": "50836053-a0ee-4cf5-b9d6-ae7c5d140ada",
    "image": "data:image/png;base64,iVBORw0KGgo..."
  }
]
```

### [taskType](https://runware.ai/docs/en/utilities/image-upload#request-tasktype) string required
:   The type of task to be performed. For this task, the value should be `imageUpload`.

### [taskUUID](https://runware.ai/docs/en/utilities/image-upload#request-taskuuid) string required UUID v4
:   When a task is sent to the API you must include a random UUID v4 string using the `taskUUID` parameter. This string is used to match the async responses to their corresponding tasks.

    If you send multiple tasks at the same time, the `taskUUID` will help you match the responses to the correct tasks.

    The `taskUUID` must be unique for each task you send to the API.

### [image](https://runware.ai/docs/en/utilities/image-upload#request-image) string required
:   Specifies the image to be uploaded. The image can be specified in one of the following formats:

    - A data URI string representing the image. The data URI must be in the format `data:<mediaType>;base64,` followed by the base64-encoded image. For example: `data:image/png;base64,iVBORw0KGgo...`.
    - A base64 encoded image without the data URI prefix. For example: `iVBORw0KGgo...`.
    - A URL pointing to the image. The image must be accessible publicly.

    Supported formats are: PNG, JPG and WEBP.

## [Response](#response)

Results will be delivered in the format below.

```
{
  "data": {
    "taskType": "imageUpload",
    "taskUUID": "9ed8a593-5515-46f3-9cd7-81ab0508176c",
    "imageUUID": "989ba605-1449-4e1e-b462-cd83ec9c1a67"
  }
}
```

### [taskUUID](https://runware.ai/docs/en/utilities/image-upload#response-taskuuid) string UUID v4
:   The API will return the `taskUUID` you sent in the request. This way you can match the responses to the correct request tasks.

### [imageUUID](https://runware.ai/docs/en/utilities/image-upload#response-imageuuid) string UUID v4
:   A unique identifier for the uploaded image. This UUID can be used to reference the image in subsequent operations or for tracking purposes.

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