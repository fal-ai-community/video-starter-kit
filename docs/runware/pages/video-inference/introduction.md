---
title: Introduction to video inference
source_url: https://runware.ai/docs/en/video-inference/introduction
fetched_at: 2025-10-27 03:51:53
---

## [Introduction](#introduction)

Video inference enables **video generation and transformation**. Generate videos from text descriptions, transform existing videos, or use images to guide video generation, all powered by our Sonic Inference Engine®.

For the core API parameters common to all Runware tasks, please refer to our [Getting Started Introduction](/docs/en/getting-started/introduction). That guide covers the fundamental concepts that apply across all Runware API tasks.

This page covers the common parameters and concepts shared across all **video inference operations**. Understanding these fundamentals will help you work effectively with our video generation APIs.

```
[
  {
    // Core parameters
    "taskType": "videoInference",
    "taskUUID": "24cd5dff-cb81-4db5-8506-b72a9425f9d1",
    "ttl": 3600,
    "includeCost": true,

    // Video-related parameters
    "outputType": "URL",
    "outputFormat": "mp4",
    "outputQuality": 95,
    "numberResults": 2,
    "safety": {
      "checkContent": true
    },

    // Task parameters
    "model": "klingai:5@3",
    "positivePrompt": "A cat playing with a ball of yarn, high quality, detailed",
    "duration": 10
  }
]
```

### [Video inference features](#video-inference-features)

Our API offers several core video generation approaches:

| Feature | Description | Key Parameters |
| --- | --- | --- |
| Text-to-video | Generate videos from textual descriptions. | `positivePrompt` + `duration` |
| Image-to-video | Generate videos with specific frame constraints using input images. | `frameImages` + `duration` |
| Video-to-video | Transform existing videos based on prompts. | `seedVideo` + `strength` |

All video operations use the `videoInference` task type, differentiated by the specific parameters you include.

## [Key considerations for video generation](#key-considerations-for-video-generation)

Working with video introduces several important concepts that affect how you structure requests and handle responses.

### [Asynchronous processing](#asynchronous-processing)

Video generation is computationally intensive and uses asynchronous processing. Set `"deliveryMethod": "async"` in your request to receive:

1. **Initial response**: Contains the same `taskType` and `taskUUID` you sent in the request. This acknowledges that your task has been received and queued for processing.
2. **Polling**: Use the `taskUUID` with the `getResponse` task type to check status.
3. **Completion**: The `data` and `errors` arrays are populated with results for each generation when processing completes.

For detailed information about polling with `getResponse` and handling async workflows, see our [Task Responses documentation](/docs/en/utilities/task-responses).

### [Duration, FPS, and frame relationships](#duration-fps-and-frame-relationships)

Videos are defined by three interconnected parameters that work together:

- **Duration**: How long the video will be (e.g., 5 seconds).
- **FPS**: Frame rate determining smoothness (e.g., 24 fps).
- **Total frames**: Automatically calculated as `duration × fps`.

For example: `duration: 5` + `fps: 24` = 120 total frames. Understanding this relationship is important when working with features that reference specific frame positions, such as intermediate keyframes.

### [Frame constraints](#frame-constraints)

For image-to-video workflows, the `frameImages` array controls which frames are constrained by input images. You can let the system automatically distribute images or explicitly specify frame positions:

```
  // Automatic distribution
  "frameImages": [{ "inputImage": "aac49721-1964-481a-ae78-8a4e29b91402" }],

  // Explicit frame number
  "frameImages": [{ "inputImage": "aac49721-1964-481a-ae78-8a4e29b91402", "frame": 0 }],

  // Named frame position
  "frameImages": [{ "inputImage": "aac49721-1964-481a-ae78-8a4e29b91402": "frame": "first" }]
```

How frame distribution works:

- **1 image**: Becomes the first frame.
- **2 images**: First and last frames.
- **3+ images**: First and last frames, with intermediate images evenly spaced between.

Instead of automatic distribution, you can explicitly set positions:

- `"frame": "first"` or `"frame": "last"` for named positions.
- `"frame": 0` (or any frame number) for exact positioning.

## [Common video inference parameters](#common-video-inference-parameters)

While each video operation has its specific parameters, several parameters are common across all video inference tasks.

[outputType](https://runware.ai/docs/en/video-inference/api-reference#request-outputtype) "URL" Default: URL
:   Specifies the output type in which the video is returned. Currently, only `URL` delivery is supported for video outputs.

    - `URL`: The video is returned as a URL string using the `videoURL` parameter in the response object.

[outputFormat](https://runware.ai/docs/en/video-inference/api-reference#request-outputformat) "MP4" | "WEBM" Default: MP4
:   Specifies the format of the output video. Supported formats are: `MP4` and `WEBM`.

    - `MP4`: MPEG-4 video format, widely compatible and recommended for most use cases.
    - `WEBM`: WebM video format, optimized for web delivery and smaller file sizes.

[outputQuality](https://runware.ai/docs/en/video-inference/api-reference#request-outputquality) integer Min: 20 Max: 99 Default: 95
:   Sets the compression quality of the output video. Higher values preserve more quality but increase file size, lower values reduce file size but decrease quality.

[uploadEndpoint](https://runware.ai/docs/en/video-inference/api-reference#request-uploadendpoint) string
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

[numberResults](https://runware.ai/docs/en/video-inference/api-reference#request-numberresults) integer Min: 1 Max: 4 Default: 1
:   Specifies how many videos to generate for the given parameters. Each video will have the same parameters but different seeds, resulting in variations of the same concept.

Here's a simple text-to-video request illustrating the common parameters:

```
[
  {
    "taskType": "videoInference",
    "taskUUID": "24cd5dff-cb81-4db5-8506-b72a9425f9d1",
    "model": "klingai:5@3",
    "positivePrompt": "A peaceful sunset over a calm lake with gentle waves",
    "duration": 10,
    "width": 1920,
    "height": 1090,
    "outputFormat": "mp4",
    "outputQuality": 95,
    "numberResults": 1,
    "includeCost": true
  }
]
```

## [Common response fields](#common-response-fields)

All video inference operations return a consistent set of fields:

[videoUUID](https://runware.ai/docs/en/video-inference/api-reference#response-videouuid) string UUID v4
:   A unique identifier for the generated video. This UUID can be used to reference the video in subsequent operations or for tracking purposes.

    The `videoUUID` is different from the `taskUUID`. While `taskUUID` identifies the generation request, `videoUUID` identifies the specific video output.

[videoURL](https://runware.ai/docs/en/video-inference/api-reference#response-videourl) string
:   If `outputType` is set to `URL`, this parameter contains the URL of the video to be downloaded.

[seed](https://runware.ai/docs/en/video-inference/api-reference#response-seed) integer
:   The seed value that was used to generate this video. This value can be used to reproduce the same video when using identical parameters in another request.

Video inference operations use **asynchronous processin**, so responses come in two stages. The initial response confirms task acceptance, while final results are retrieved through polling.

### [Initial acknowledgment](#initial-acknowledgment)

When you submit a video task, you receive immediate confirmation (or an error if the request is invalid):

```
// Success acknowledgment
{
  "data": [
    "taskType": "videoInference",
    "taskUUID": "24cd5dff-cb81-4db5-8506-b72a9425f9d1"
  ]
}

// Or error response
{
  "errors": [
    {
      "code": "unsupportedDuration",
      "message": "Invalid value for duration parameter. This duration is not supported by the model architecture.",
      "parameter": "duration",
      "type": "float",
      "documentation": "https://runware.ai/docs/en/video-inference/api-reference#request-duration",
      "taskUUID": "24cd5dff-cb81-4db5-8506-b72a9425f9d1",
      "allowedValues": [6]
    }
  ]
}
```

### [Final results](#final-results)

When processing completes, the `getResponse` task returns the full video data:

```
{
  // Successes
  "data": [
    {
      "taskType": "videoInference",
      "taskUUID": "24cd5dff-cb81-4db5-8506-b72a9425f9d1",
      "status": "success",
      "videoUUID": "b7db282d-2943-4f12-992f-77df3ad3ec71",
      "videoURL": "https://im.runware.ai/video/ws/0.5/vi/b7db282d-2943-4f12-992f-77df3ad3ec71.mp4",
      "cost": 0.18
    }
  ],
  // Errors
  "errors": [
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

For polling workflow details, see our [Task Responses documentation](/docs/en/utilities/task-responses).

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