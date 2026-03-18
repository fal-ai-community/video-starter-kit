---
title: Remove Background API
source_url: https://runware.ai/docs/en/tools/remove-background
fetched_at: 2025-10-27 03:51:55
---

## [Introduction](#introduction)

Background removal is a powerful image processing technique used to **isolate subjects from their backgrounds**, resulting in images with transparent backgrounds. This capability is essential for enhancing product images, creating professional portraits, or integrating subjects into various design compositions seamlessly.

Remember that the `outputFormat` parameter only supports PNG format for images with transparency. For all other formats, the transparency will be removed.

## [Playground](#playground)

Background Removal

API key

[Get one!](https://my.runware.ai/keys)

 

Input Image

Model

RemBG 1.4  Bria RMBG 2.0  BiRefNet v1 Base  BiRefNet v1 Base - COD  BiRefNet Dis  BiRefNet General  BiRefNet General Resolution 512x512 FP16  BiRefNet HRSOD DHU  BiRefNet Massive TR DIS5K TR TES  BiRefNet Matting  BiRefNet Portrait

Remove Background

Download All

Remove All

Cancel

Select

## [Request](#request)

Our API always accepts an array of objects as input, where each object represents a **specific task to be performed**. The structure of the object varies depending on the type of the task. For this section, we will focus on the parameters related to the **background removal task**.

The following JSON snippets shows the basic structure of a request object. **All properties are explained in detail in the next section**.

```
[
  {
    "taskType": "removeBackground",
    "taskUUID": "19abad0d-6ec5-40a6-b7af-203775fa5b7f",
    "inputImage": "fd613011-3872-4f37-b4aa-0d343c051a27",
    "outputType": "URL",
    "outputFormat": "jpg",
    "model": "runware:109@1",
    "settings": {
      "rgba": [255, 255, 255, 0],
      "postProcessMask": true,
      "returnOnlyMask": false,
      "alphaMatting": true,
      "alphaMattingForegroundThreshold": 240,
      "alphaMattingBackgroundThreshold": 10,
      "alphaMattingErodeSize": 10
    }
  }
]
```

### [taskType](https://runware.ai/docs/en/tools/remove-background#request-tasktype) string required
:   The type of task to be performed. For this task, the value should be `removeBackground`.

### [taskUUID](https://runware.ai/docs/en/tools/remove-background#request-taskuuid) string required UUID v4
:   When a task is sent to the API you must include a random UUID v4 string using the `taskUUID` parameter. This string is used to match the async responses to their corresponding tasks.

    If you send multiple tasks at the same time, the `taskUUID` will help you match the responses to the correct tasks.

    The `taskUUID` must be unique for each task you send to the API.

### [inputImage](https://runware.ai/docs/en/tools/remove-background#request-inputimage) string required
:   Specifies the input image to be processed. The image can be specified in one of the following formats:

    - An UUID v4 string of a [previously uploaded image](/docs/en/utilities/image-upload) or a generated image.
    - A data URI string representing the image. The data URI must be in the format `data:<mediaType>;base64,` followed by the base64-encoded image. For example: `data:image/png;base64,iVBORw0KGgo...`.
    - A base64 encoded image without the data URI prefix. For example: `iVBORw0KGgo...`.
    - A URL pointing to the image. The image must be accessible publicly.

    Supported formats are: PNG, JPG and WEBP.

### [outputType](https://runware.ai/docs/en/tools/remove-background#request-outputtype) "base64Data" | "dataURI" | "URL" Default: URL
:   Specifies the output type in which the image is returned. Supported values are: `dataURI`, `URL`, and `base64Data`.

    - `base64Data`: The image is returned as a base64-encoded string using the `imageBase64Data` parameter in the response object.
    - `dataURI`: The image is returned as a data URI string using the `imageDataURI` parameter in the response object.
    - `URL`: The image is returned as a URL string using the `imageURL` parameter in the response object.

### [outputFormat](https://runware.ai/docs/en/tools/remove-background#request-outputformat) "JPG" | "PNG" | "WEBP" Default: PNG
:   Specifies the format of the output image. Supported formats are: `PNG`, `JPG` and `WEBP`.

### [outputQuality](https://runware.ai/docs/en/tools/remove-background#request-outputquality) integer Min: 20 Max: 99 Default: 95
:   Sets the compression quality of the output image. Higher values preserve more quality but increase file size, lower values reduce file size but decrease quality.

### [webhookURL](https://runware.ai/docs/en/tools/remove-background#request-webhookurl) string
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

### [deliveryMethod](https://runware.ai/docs/en/tools/remove-background#request-deliverymethod) "sync" | "async" required Default: sync
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

### [uploadEndpoint](https://runware.ai/docs/en/tools/remove-background#request-uploadendpoint) string
:   Specifies a URL where the generated content will be automatically uploaded using the HTTP PUT method. The raw binary data of the media file is sent directly as the request body. For secure uploads to cloud storage, use presigned URLs that include temporary authentication credentials.

    **Common use cases:**

    - **Cloud storage**: Upload directly to S3 buckets, Google Cloud Storage, or Azure Blob Storage using presigned URLs.
    - **CDN integration**: Upload to content delivery networks for immediate distribution.

    ```
    // S3 presigned URL for secure upload
    https://your-bucket.s3.amazonaws.com/generated/content.mp4?X-Amz-Signature=abc123&X-Amz-Expires=3600

    // Google Cloud Storage presigned URL
    https://storage.googleapis.com/your-bucket/content.jpg?X-Goog-Signature=xyz789

    // Custom storage endpoint
    https://storage.example.com/uploads/generated-image.jpg
    ```

    The content data will be sent as the request body to the specified URL when generation is complete.

### [ttl](https://runware.ai/docs/en/audio-inference/api-reference#request-ttl) integer Min: 60
:   Specifies the time-to-live (TTL) in seconds for generated content when using URL output. This determines how long the generated content will be available at the provided URL before being automatically deleted.

    This parameter only takes effect when `outputType` is set to `"URL"`. It has no effect on other output types.

### [includeCost](https://runware.ai/docs/en/tools/remove-background#request-includecost) boolean Default: false
:   If set to `true`, the cost to perform the task will be included in the response object.

### [model](https://runware.ai/docs/en/tools/remove-background#request-model) string required
:   We make use of the [AIR system](/docs/en/image-inference/models#air-system) to identify background removal models. This identifier is a unique string that represents a specific model.

      View supported models 

    | AIR ID | Model Name |
    | --- | --- |
    | runware:109@1 | RemBG 1.4 |
    | runware:110@1 | Bria RMBG 2.0 |
    | runware:112@1 | BiRefNet v1 Base |
    | runware:112@2 | BiRefNet v1 Base - COD |
    | runware:112@3 | BiRefNet Dis |
    | runware:112@5 | BiRefNet General |
    | runware:112@6 | BiRefNet General Resolution 512x512 FP16 |
    | runware:112@7 | BiRefNet HRSOD DHU |
    | runware:112@8 | BiRefNet Massive TR DIS5K TR TES |
    | runware:112@9 | BiRefNet Matting |
    | runware:112@10 | BiRefNet Portrait |

### [settings](https://runware.ai/docs/en/tools/remove-background#request-settings) object
:   An object that contains all background removal configuration options.

    Currently only RemBG 1.4 model (`runware:109@1`) supports the `settings` object.

      View example 

    ```
    {
      "taskType": "removeBackground",
      "taskUUID": "19abad0d-6ec5-40a6-b7af-203775fa5b7f",
      "inputImage": "fd613011-3872-4f37-b4aa-0d343c051a27",
      "outputType": "URL",
      "outputFormat": "jpg",
      "model": "runware:109@1",
      "settings": { 
        "rgba": [255, 255, 255, 0],
        "postProcessMask": true,
        "returnOnlyMask": false,
        "alphaMatting": true,
        "alphaMattingForegroundThreshold": 240,
        "alphaMattingBackgroundThreshold": 10,
        "alphaMattingErodeSize": 10
      } 
    }
    ```

       Properties
    ⁨7⁩ properties 

    `settings` » `rgba` #### [rgba](https://runware.ai/docs/en/tools/remove-background#request-settings-rgba) [integer, integer, integer, float]
    :   An array representing the `[red, green, blue, alpha]` values that define the color of the removed background. The alpha channel controls transparency.

    `settings` » `postProcessMask` #### [postProcessMask](https://runware.ai/docs/en/tools/remove-background#request-settings-postprocessmask) boolean Default: false
    :   Flag indicating whether to post-process the mask. Controls whether the mask should undergo additional post-processing. This step can improve the accuracy and quality of the background removal mask.

    `settings` » `returnOnlyMask` #### [returnOnlyMask](https://runware.ai/docs/en/tools/remove-background#request-settings-returnonlymask) boolean Default: false
    :   Flag indicating whether to return only the mask. The mask is the opposite of the image background removal.

    `settings` » `alphaMatting` #### [alphaMatting](https://runware.ai/docs/en/tools/remove-background#request-settings-alphamatting) boolean Default: false
    :   Flag indicating whether to use alpha matting. Alpha matting is a post-processing technique that enhances the quality of the output by refining the edges of the foreground object.

    `settings` » `alphaMattingForegroundThreshold` #### [alphaMattingForegroundThreshold](https://runware.ai/docs/en/tools/remove-background#request-settings-alphamattingforegroundthreshold) integer Min: 1 Max: 255 Default: 240
    :   Threshold value used in alpha matting to distinguish the foreground from the background. Adjusting this parameter affects the sharpness and accuracy of the foreground object edges.

    `settings` » `alphaMattingBackgroundThreshold` #### [alphaMattingBackgroundThreshold](https://runware.ai/docs/en/tools/remove-background#request-settings-alphamattingbackgroundthreshold) integer Min: 1 Max: 255 Default: 10
    :   Threshold value used in alpha matting to refine the background areas. It influences how aggressively the algorithm removes the background while preserving image details. The higher the value, the more computation is needed and therefore the more expensive the operation is.

    `settings` » `alphaMattingErodeSize` #### [alphaMattingErodeSize](https://runware.ai/docs/en/tools/remove-background#request-settings-alphamattingerodesize) integer Min: 1 Max: 255 Default: 10
    :   Specifies the size of the erosion operation used in alpha matting. Erosion helps in smoothing the edges of the foreground object for a cleaner removal of the background.

## [Response](#response)

Results will be delivered in the format below.

```
{
  "data": [
    {
      "taskType": "removeBackground",
      "taskUUID": "19abad0d-6ec5-40a6-b7af-203775fa5b7f",
      "imageUUID": "aa418b0f-4b83-4c3d-96c5-30abf4699a4d",
      "inputImageUUID": "fd613011-3872-4f37-b4aa-0d343c051a27",
      "imageURL": "https://im.runware.ai/image/ii/aa418b0f-4b83-4c3d-96c5-30abf4699a4d.jpg",
      "cost": 0006
    }
  ]
}
```

### [taskType](https://runware.ai/docs/en/tools/remove-background#response-tasktype) string
:   The API will return the `taskType` you sent in the request. In this case, it will be `removeBackground`. This helps match the responses to the correct task type.

### [taskUUID](https://runware.ai/docs/en/tools/remove-background#response-taskuuid) string UUID v4
:   The API will return the `taskUUID` you sent in the request. This way you can match the responses to the correct request tasks.

### [imageUUID](https://runware.ai/docs/en/tools/remove-background#response-imageuuid) string UUID v4
:   A unique identifier for the output image. This UUID can be used to reference the image in subsequent operations or for tracking purposes.

    The `imageUUID` is different from the `taskUUID`. While `taskUUID` identifies the request, `imageUUID` identifies the specific image output.

### [imageURL](https://runware.ai/docs/en/tools/remove-background#response-imageurl) string
:   If `outputType` is set to `URL`, this parameter contains the URL of the image to be downloaded.

### [imageBase64Data](https://runware.ai/docs/en/tools/remove-background#response-imagebase64data) string
:   If `outputType` is set to `base64Data`, this parameter contains the base64-encoded image data.

### [imageDataURI](https://runware.ai/docs/en/tools/remove-background#response-imagedatauri) string
:   If `outputType` is set to `dataURI`, this parameter contains the data URI of the image.

### [cost](https://runware.ai/docs/en/tools/remove-background#response-cost) float
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