---
title: Upscale API
source_url: https://runware.ai/docs/en/tools/upscale
fetched_at: 2025-10-27 03:51:54
---

## [Introduction](#introduction)

Upscaling refers to the process of **enhancing the resolution and overall quality of images**. This technique is particularly useful for improving the visual clarity and detail of lower-resolution images, making them suitable for various high-definition applications.

## [Playground](#playground)

Upscale

API key

[Get one!](https://my.runware.ai/keys)

 

Input Image

Upscale Factor

2

4

Upscale Image

Download All

Remove All

Cancel

Select

## [Request](#request)

Our API always accepts an array of objects as input, where each object represents a **specific task to be performed**. The structure of the object varies depending on the type of the task. For this section, we will focus on the parameters related to the **image upscaling task**.

The following JSON snippets shows the basic structure of a request object. **All properties are explained in detail in the next section**.

```
[
  {
    "taskType": "upscale",
    "taskUUID": "19abad0d-6ec5-40a6-b7af-203775fa5b7f",
    "inputImage": "fd613011-3872-4f37-b4aa-0d343c051a27",
    "model": "runware:501@1",
    "outputType": "URL",
    "outputFormat": "jpg",
    "upscaleFactor": 2
  }
]
```

### [taskType](https://runware.ai/docs/en/tools/upscale#request-tasktype) string required
:   The type of task to be performed. For this task, the value should be `upscale`.

### [taskUUID](https://runware.ai/docs/en/tools/upscale#request-taskuuid) string required UUID v4
:   When a task is sent to the API you must include a random UUID v4 string using the `taskUUID` parameter. This string is used to match the async responses to their corresponding tasks.

    If you send multiple tasks at the same time, the `taskUUID` will help you match the responses to the correct tasks.

    The `taskUUID` must be unique for each task you send to the API.

### [inputImage](https://runware.ai/docs/en/tools/upscale#request-inputimage) string required
:   Specifies the input image to be processed. The image can be specified in one of the following formats:

    - An UUID v4 string of a [previously uploaded image](/docs/en/utilities/image-upload) or a generated image.
    - A data URI string representing the image. The data URI must be in the format `data:<mediaType>;base64,` followed by the base64-encoded image. For example: `data:image/png;base64,iVBORw0KGgo...`.
    - A base64 encoded image without the data URI prefix. For example: `iVBORw0KGgo...`.
    - A URL pointing to the image. The image must be accessible publicly.

    Supported formats are: PNG, JPG and WEBP.

    The maximum size of the upscaled result is 4096x4096 pixels. If the combination of input size and upscale factor would exceed this limit, the input image will be automatically resized. For example, a 2048x2048 image with an `upscaleFactor` of 4 will first be reduced to 1024x1024 to ensure the final result stays within limits.

### [outputType](https://runware.ai/docs/en/tools/upscale#request-outputtype) "base64Data" | "dataURI" | "URL" Default: URL
:   Specifies the output type in which the image is returned. Supported values are: `dataURI`, `URL`, and `base64Data`.

    - `base64Data`: The image is returned as a base64-encoded string using the `imageBase64Data` parameter in the response object.
    - `dataURI`: The image is returned as a data URI string using the `imageDataURI` parameter in the response object.
    - `URL`: The image is returned as a URL string using the `imageURL` parameter in the response object.

### [outputFormat](https://runware.ai/docs/en/tools/upscale#request-outputformat) "JPG" | "PNG" | "WEBP" Default: JPG
:   Specifies the format of the output image. Supported formats are: `PNG`, `JPG` and `WEBP`.

### [outputQuality](https://runware.ai/docs/en/tools/upscale#request-outputquality) integer Min: 20 Max: 99 Default: 95
:   Sets the compression quality of the output image. Higher values preserve more quality but increase file size, lower values reduce file size but decrease quality.

### [webhookURL](https://runware.ai/docs/en/tools/upscale#request-webhookurl) string
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

### [deliveryMethod](https://runware.ai/docs/en/tools/upscale#request-deliverymethod) "sync" | "async" required Default: sync
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

### [uploadEndpoint](https://runware.ai/docs/en/tools/upscale#request-uploadendpoint) string
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

### [includeCost](https://runware.ai/docs/en/tools/upscale#request-includecost) boolean Default: false
:   If set to `true`, the cost to perform the task will be included in the response object.

### [model](https://runware.ai/docs/en/tools/upscale#request-model) string required
:   We make use of the [AIR system](/docs/en/image-inference/models#air-system) to identify background removal models. This identifier is a unique string that represents a specific model.

      View supported models 

    | AIR ID | Model Name |
    | --- | --- |
    | runware:500@1 | Clarity |
    | runware:501@1 | CCSR |
    | runware:502@1 | Stable Diffusion Latent Upscaler |
    | runware:503@1 | SwinIR |

### [upscaleFactor](https://runware.ai/docs/en/tools/upscale#request-upscalefactor) 2 | 4 required
:   This value is the level of upscaling performed.

    Each will increase the size of the image by the corresponding factor.

    For instance, an `upscaleFactor` of `2` will 2x image size.

    **Note**: Only SwinIR model supports `4x` upscaling.

### [settings](https://runware.ai/docs/en/tools/upscale#request-settings) object
:   Configuration object for upscaling models that allows fine-tuning of the generation process through various parameters.

    Creative Upscaling

    Some upscaling models use diffusion-based approaches that reimagine image details during upscaling. These creative upscalers support parameters that function identically to their image inference counterparts, allowing you to guide the generation process with prompts, control sampling steps, and adjust other generation settings. Parameter availability varies by model, check the compatibility table below.

    **Image inference parameters:**

    [`positivePrompt`](/docs/en/image-inference/api-reference#request-positiveprompt), [`negativePrompt`](/docs/en/image-inference/api-reference#request-negativeprompt), [`strength`](/docs/en/image-inference/api-reference#request-strength), [`controlNetWeight`](/docs/en/image-inference/api-reference#request-controlnet-weight), [`steps`](/docs/en/image-inference/api-reference#request-steps), [`scheduler`](/docs/en/image-inference/api-reference#request-scheduler), [`seed`](/docs/en/image-inference/api-reference#request-seed), [`CFGScale`](/docs/en/image-inference/api-reference#request-cfgscale), [`clipSkip`](/docs/en/image-inference/api-reference#request-clipskip).

      View image inference parameter compatibility 

    | Parameter | SD Latent Upscaler | CCSR | Clarity |
    | --- | --- | --- | --- |
    | positivePrompt | ✓ | ✓ | ✓ |
    | negativePrompt | ✓ | ✓ | ✓ |
    | strength | ✗ | ✗ | ✓ |
    | controlNetWeight | ✗ | ✓ | ✓ |
    | steps | ✓ | ✓ | ✓ |
    | scheduler | ✗ | ✗ | ✓ |
    | seed | ✓ | ✓ | ✓ |
    | CFGScale | ✓ | ✓ | ✓ |
    | clipSkip | ✓ | ✗ | ✗ |

      View example 

    ```
    {
      "taskType": "upscale",
      "taskUUID": "a770f077-f413-47de-9dac-be0b26a35da6",
      "inputImage": "c64351d5-4c59-42f7-95e1-eace013eddab",
      "model": "runware:500@1",
      "settings": {
        "steps": 20,
        "strength": 0.35,
        "CFGScale": 6,
        "controlNetWeight": 0.6,
        "positivePrompt": "high quality, detailed, sharp"
      }
    }
    ```

## [Response](#response)

Results will be delivered in the format below.

```
{
  "data": [
    {
      "taskType": "upscale",
      "taskUUID": "19abad0d-6ec5-40a6-b7af-203775fa5b7f",
      "imageUUID": "e0b6ed2b-311d-4abc-aa01-8f3fdbdb8860",
      "inputImageUUID": "fd613011-3872-4f37-b4aa-0d343c051a27",
      "imageURL": "https://im.runware.ai/image/ws/0.5/ii/e0b6ed2b-311d-4abc-aa01-8f3fdbdb8860.jpg",
      "cost": 0
    }
  ]
}
```

### [taskType](https://runware.ai/docs/en/tools/upscale#response-tasktype) string
:   The API will return the `taskType` you sent in the request. In this case, it will be `upscale`. This helps match the responses to the correct task type.

### [taskUUID](https://runware.ai/docs/en/tools/upscale#response-taskuuid) string UUID v4
:   The API will return the `taskUUID` you sent in the request. This way you can match the responses to the correct request tasks.

### [imageUUID](https://runware.ai/docs/en/tools/upscale#response-imageuuid) string UUID v4
:   A unique identifier for the output image. This UUID can be used to reference the image in subsequent operations or for tracking purposes.

    The `imageUUID` is different from the `taskUUID`. While `taskUUID` identifies the request, `imageUUID` identifies the specific image output.

### [imageURL](https://runware.ai/docs/en/tools/upscale#response-imageurl) string
:   If `outputType` is set to `URL`, this parameter contains the URL of the image to be downloaded.

### [imageBase64Data](https://runware.ai/docs/en/tools/upscale#response-imagebase64data) string
:   If `outputType` is set to `base64Data`, this parameter contains the base64-encoded image data.

### [imageDataURI](https://runware.ai/docs/en/tools/upscale#response-imagedatauri) string
:   If `outputType` is set to `dataURI`, this parameter contains the data URI of the image.

### [cost](https://runware.ai/docs/en/tools/upscale#response-cost) float
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