---
title: Video inference API
source_url: https://runware.ai/docs/en/video-inference/api-reference
fetched_at: 2025-10-27 03:51:54
---

## [Introduction](#introduction)

Video inference enables **video generation and transformation**. This page is the complete API reference for video inference tasks. All workflows and operations use the single `videoInference` task type, differentiated through parameter combinations.

### [Core operations](#core-operations)

- **Text-to-video**: Generate videos from text descriptions.
- **Image-to-video**: Generate videos using images to guide content or constrain specific frames.
- **Video-to-video**: Transform existing videos based on prompts.

### [Advanced features](#advanced-features)

- **Style and control**: Camera movements with cinematic lens effects, keyframe positioning.
- **Content generation**: Video extension capabilities, multi-shot storytelling with scene transitions.
- **Visual effects**: Effect templates and stylized filters.
- **Identity and character**: Character lip-sync, reference-based generation.
- **Audio**: Native audio generation with synchronized dialogue and effects.

Each feature includes detailed parameter documentation below.

Video generation uses **asynchronous processing** due to longer processing times. Setting `"deliveryMethod": "async"` queues your task and returns an immediate acknowledgment. Use the `getResponse` task to poll for status updates and retrieve the final video when processing completes.

## [Request](#request)

Our API always accepts an array of objects as input, where each object represents a **specific task to be performed**. The structure varies depending on the workflow and features used.

The following examples demonstrate how different parameter combinations create specific workflows.

Text to Video

```
{
    "taskType": "videoInference",
    "taskUUID": "24cd5dff-cb81-4db5-8506-b72a9425f9d1",
    "positivePrompt": "A cat playing with a ball of yarn, high quality, detailed",
    "model": "klingai:5@3",
    "duration": 10,
    "seed": 42,
    "numberResults": 1
  }
```

 Image to Video

```
{
    "taskType": "videoInference",
    "taskUUID": "b8c4d952-7f27-4a6e-bc9a-83f01d1c6d59",
    "positivePrompt": "smooth animation, natural movement, cinematic quality",
    "model": "klingai:3@2",
    "duration": 10,
    "width": 1920,
    "height": 1080,
    "frameImages": [ 
      { 
        "inputImage": "c64351d5-4c59-42f7-95e1-eace013eddab",
        "frame": "first"
      },
      { 
        "inputImage": "d7e8f9a0-2b5c-4e7f-a1d3-9c8b7a6e5d4f",
        "frame": "last"
      } 
    ],
    "numberResults": 1
  }
```

---

### [taskType](https://runware.ai/docs/en/video-inference/api-reference#request-tasktype) string required
:   The type of task to be performed. For this task, the value should be `videoInference`.

### [taskUUID](https://runware.ai/docs/en/video-inference/api-reference#request-taskuuid) string required UUID v4
:   When a task is sent to the API you must include a random UUID v4 string using the `taskUUID` parameter. This string is used to match the async responses to their corresponding tasks.

    If you send multiple tasks at the same time, the `taskUUID` will help you match the responses to the correct tasks.

    The `taskUUID` must be unique for each task you send to the API.

### [outputType](https://runware.ai/docs/en/video-inference/api-reference#request-outputtype) "URL" Default: URL
:   Specifies the output type in which the video is returned. Currently, only `URL` delivery is supported for video outputs.

    - `URL`: The video is returned as a URL string using the `videoURL` parameter in the response object.

### [outputFormat](https://runware.ai/docs/en/video-inference/api-reference#request-outputformat) "MP4" | "WEBM" Default: MP4
:   Specifies the format of the output video. Supported formats are: `MP4` and `WEBM`.

    - `MP4`: MPEG-4 video format, widely compatible and recommended for most use cases.
    - `WEBM`: WebM video format, optimized for web delivery and smaller file sizes.

### [outputQuality](https://runware.ai/docs/en/video-inference/api-reference#request-outputquality) integer Min: 20 Max: 99 Default: 95
:   Sets the compression quality of the output video. Higher values preserve more quality but increase file size, lower values reduce file size but decrease quality.

### [webhookURL](https://runware.ai/docs/en/video-inference/api-reference#request-webhookurl) string
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

### [deliveryMethod](https://runware.ai/docs/en/video-inference/api-reference#request-deliverymethod) "sync" | "async" required Default: async
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

### [uploadEndpoint](https://runware.ai/docs/en/video-inference/api-reference#request-uploadendpoint) string
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

### [safety](https://runware.ai/docs/en/video-inference/api-reference#request-safety) object
:   Configuration object for content safety checking to detect and filter inappropriate content in generated media.

      View example 

    ```
    {
      "taskType": "videoInference",
      "taskUUID": "a770f077-f413-47de-9dac-be0b26a35da6",
      "model": "runware:200@6",
      "positivePrompt": "A person walking in a park",
      "width": 1280,
      "height": 720,
      "safety": {
        "mode": "full"
      }
    }
    ```

       Properties
    ⁨2⁩ properties 

    `safety` » `checkContent` #### [checkContent](https://runware.ai/docs/en/video-inference/api-reference#request-safety-checkcontent) boolean Default: false
    :   Simple toggle for enabling content safety checking. When enabled, defaults to `fast` mode for optimal performance while maintaining content safety.

        This provides an easy way to enable safety checking without needing to specify detailed mode configurations.

    `safety` » `mode` #### [mode](https://runware.ai/docs/en/video-inference/api-reference#request-safety-mode) "none" | "fast" | "full" Default: none
    :   Advanced control over safety checking intensity and coverage for content moderation.

        **Available values**:

        - `none`: No content safety checking performed.
        - `fast`: Check first, middle, and last frames (video) or single check (images).
        - `full`: Check all frames in video content, adds slight processing delay.

        When both `checkContent` and `mode` are specified, the `mode` parameter takes precedence over the `checkContent` setting.

### [ttl](https://runware.ai/docs/en/video-inference/api-reference#request-ttl) integer Min: 60
:   Specifies the time-to-live (TTL) in seconds for generated content when using URL output. This determines how long the generated content will be available at the provided URL before being automatically deleted.

    This parameter only takes effect when `outputType` is set to `"URL"`. It has no effect on other output types.

### [includeCost](https://runware.ai/docs/en/video-inference/api-reference#request-includecost) boolean Default: false
:   If set to `true`, the cost to perform the task will be included in the response object.

### [positivePrompt](https://runware.ai/docs/en/video-inference/api-reference#request-positiveprompt) string required Min: 2
:   The text description that guides the video generation process. This prompt defines what you want to see in the video, including subject matter, visual style, actions, and atmosphere.

    The model processes this text to understand the desired content and creates a video that matches your description. More detailed and specific prompts typically produce better results.

    For optimal results, describe the motion, scene composition, and visual characteristics you want to see in the generated video.

### [negativePrompt](https://runware.ai/docs/en/video-inference/api-reference#request-negativeprompt) string
:   Specifies what you want to avoid in the generated video. This parameter helps steer the generation away from undesired visual elements, styles, or characteristics.

    Common negative prompts for video include terms like "blurry", "low quality", "distorted", "static", "flickering", or specific content you want to exclude.

### [frameImages](https://runware.ai/docs/en/video-inference/api-reference#request-frameimages) object[]
:   An array of objects that define key frames to guide video generation. Each object specifies an input image and optionally its position within the video timeline.

    The `frameImages` parameter allows you to constrain specific frames within the video sequence, ensuring that particular visual content appears at designated points. This is different from `referenceImages`, which provide overall visual guidance without constraining specific timeline positions.

    When the `frame` parameter is omitted from frameImages objects, automatic distribution rules apply:

    - **1 image**: Used as the first frame.
    - **2 images**: First and last frames.
    - **3+ images**: First and last frames, with intermediate images evenly spaced between.

      View examples 

    **Single frame (automatic positioning):** When only one image is provided, it automatically becomes the first frame of the video.

    ```
    {
      "taskType": "videoInference",
      "taskUUID": "a770f077-f413-47de-9dac-be0b26a35da6",
      "positivePrompt": "a beautiful woman walking through a garden with flowers blooming",
      "model": "klingai:5@3",
      "duration": 5,
      "frameImages": [
        {
          "inputImage": "aac49721-1964-481a-ae78-8a4e29b91402"
        }
      ]
    }
    ```

    **First and last frames:** With two images, they automatically become the first and last frames of the video sequence.

    ```
    {
      "taskType": "videoInference",
      "taskUUID": "a770f077-f413-47de-9dac-be0b26a35da6",
      "positivePrompt": "cinematic shot of a cat playing with a ball of yarn, smooth motion",
      "model": "klingai:5@3",
      "duration": 5,
      "frameImages": [
        {
          "inputImage": "aac49721-1964-481a-ae78-8a4e29b91402",
          "frame": "first"
        },
        {
          "inputImage": "3ad204c3-a9de-4963-8a1a-c3911e3afafe",
          "frame": "last"
        }
      ]
    }
    ```

    **Mixed positioning:** You can combine automatic distribution with explicit frame positioning using either numeric values or named positions.

    ```
    {
      "taskType": "videoInference",
      "taskUUID": "a770f077-f413-47de-9dac-be0b26a35da6",
      "positivePrompt": "time-lapse of clouds moving across a sunset sky, natural lighting",
      "model": "klingai:5@3",
      "duration": 5,
      "frameImages": [
        {
          "inputImage": "aac49721-1964-481a-ae78-8a4e29b91402",
          "frame": 0
        },
        {
          "inputImage": "c00abf5f-6cdb-4642-a01d-1bfff7bc3cf7",
          "frame": 48
        },
        {
          "inputImage": "3ad204c3-a9de-4963-8a1a-c3911e3afafe",
          "frame": "last"
        }
      ]
    }
    ```

       Array items
    ⁨2⁩ properties each 

    `frameImages[]` » `inputImages` #### [inputImages](https://runware.ai/docs/en/video-inference/api-reference#request-frameimages-inputimages) string required
    :   Specifies the input image that will be used to constrain the video content at the specified frame position. The image can be specified in one of the following formats:

        - An UUID v4 string of a [previously uploaded image](/docs/en/utilities/image-upload) or a generated image.
        - A data URI string representing the image. The data URI must be in the format `data:<mediaType>;base64,` followed by the base64-encoded image. For example: `data:image/png;base64,iVBORw0KGgo...`.
        - A base64 encoded image without the data URI prefix. For example: `iVBORw0KGgo...`.
        - A URL pointing to the image. The image must be accessible publicly.

        Supported formats are: PNG, JPG and WEBP.

    `frameImages[]` » `frame` #### [frame](https://runware.ai/docs/en/video-inference/api-reference#request-frameimages-frame) string | integer
    :   Specifies the position of this frame constraint within the video timeline.

        **Named positions:**

        - `"first"`: Places the image at the beginning of the video.
        - `"last"`: Places the image at the end of the video.

        **Numeric positions:**

        - `0`: First frame (equivalent to "first").
        - Any positive integer: Specific frame number. Must be within the total frame count (`duration × fps`).

### [referenceImages](https://runware.ai/docs/en/video-inference/api-reference#request-referenceimages) string[]
:   An array containing reference images used to condition the generation process. These images provide visual guidance to help the model generate content that aligns with the style, composition, or characteristics of the reference materials.

    Unlike `frameImages` which constrain specific timeline positions, reference images guide the general appearance that should appear consistently across the video.

    Reference images work in combination with your text prompt to provide both textual and visual guidance for the generation process.

    Each image can be specified in one of the following formats:

    - An UUID v4 string of a [previously uploaded image](/docs/en/utilities/image-upload) or a generated image.
    - A data URI string representing the image. The data URI must be in the format `data:<mediaType>;base64,` followed by the base64-encoded image. For example: `data:image/png;base64,iVBORw0KGgo...`.
    - A base64 encoded image without the data URI prefix. For example: `iVBORw0KGgo...`.
    - A URL pointing to the image. The image must be accessible publicly.

    Supported formats are: PNG, JPG and WEBP.

      View example 

    ```
    {
      "taskType": "videoInference",
      "taskUUID": "a770f077-f413-47de-9dac-be0b26a35da6",
      "positivePrompt": "a person walking through a garden",
      "model": "minimax:1@1",
      "duration": 6,
      "width": 1366,
      "height": 768,
      "referenceImages": [
        "aac49721-1964-481a-ae78-8a4e29b91402"
      ]
    }
    ```

### [referenceVideos](https://runware.ai/docs/en/video-inference/api-reference#request-referencevideos) string[]
:   An array containing reference videos used to influence the generation process. These videos provide visual and motion guidance to help the model generate content that aligns with the style, movement patterns, or characteristics of the reference materials.

    Unlike `frameImages` which define specific timeline positions, reference videos guide the general appearance and motion dynamics that should influence the output without rigidly constraining it.

    Reference videos work in combination with your text prompt and other inputs to provide comprehensive guidance for the generation process.

    Each video can be specified in one of the following formats:

    - An UUID v4 string of a previously uploaded video or a generated video.
    - A data URI string representing the video. The data URI must be in the format `data:<mediaType>;base64,` followed by the base64-encoded video. For example: `data:video/mp4;base64,AAAAIGZ0eXB...`.
    - A base64 encoded video without the data URI prefix. For example: `AAAAIGZ0eXB...`.
    - A URL pointing to the video. The video must be accessible publicly.

    Supported formats are: MP4, MOV and WEBM.

      View example 

    ```
    {
      "taskType": "videoInference",
      "taskUUID": "a770f077-f413-47de-9dac-be0b26a35da6",
      "model": "pixverse:lipsync@1",
      "referenceVideos": [
        "c64351d5-4c59-42f7-95e1-eace013eddab"
      ],
      "inputAudios": [
        "b4c57832-2075-492b-bf89-9b5e3ac02503"
      ]
    }
    ```

### [inputAudios](https://runware.ai/docs/en/video-inference/api-reference#request-inputaudios) string[]
:   An array containing audio files used to drive video generation for models that support audio input. These audio files provide temporal guidance to help the model generate content that synchronizes with the audio, such as lip-sync or audio-driven character animation.

    Audio files work in combination with your text prompt and reference images to provide both auditory and visual guidance for the generation process.

    Each audio can be specified in one of the following formats:

    - An UUID v4 string of a previously uploaded audio or a generated audio.
    - A data URI string representing the audio. The data URI must be in the format `data:<mediaType>;base64,` followed by the base64-encoded audio. For example: `data:audio/wav;base64,UklGRnoG...`.
    - A base64 encoded audio without the data URI prefix. For example: `UklGRnoG...`.
    - A URL pointing to the audio file. The audio must be accessible publicly.

    Supported formats are: MP3, WAV and FLAC.

      View example 

    ```
    {
      "taskType": "videoInference",
      "taskUUID": "a770f077-f413-47de-9dac-be0b26a35da6",
      "model": "bytedance:5@1",
      "referenceImages": ["aac49721-1964-481a-ae78-8a4e29b91402"],
      "inputAudios": ["b4c57832-2075-492b-bf89-9b5e3ac02503"]
    }
    ```

### [width](https://runware.ai/docs/en/video-inference/api-reference#request-width) integer Min: 256 Max: 1920
:   The width of the generated video in pixels. Must be a multiple of 8 for compatibility with video encoding standards.

    Higher resolutions produce more detailed videos but require significantly more processing time and computational resources. Consider your intended use case and quality requirements when selecting dimensions.

    Work within your model's supported resolution range for optimal results. Some models may have specific aspect ratio recommendations.

### [height](https://runware.ai/docs/en/video-inference/api-reference#request-height) integer Min: 256 Max: 1080
:   The height of the generated video in pixels. Must be a multiple of 8 for compatibility with video encoding standards.

    Higher resolutions produce more detailed videos but require significantly more processing time and computational resources. Consider your intended use case and quality requirements when selecting dimensions.

    Work within your model's supported resolution range for optimal results. Some models may have specific aspect ratio recommendations.

### [model](https://runware.ai/docs/en/video-inference/api-reference#request-model) string required
:   The AI model to use for video generation. Different models excel at different types of content, styles, and quality levels.

    Models are identified by their AIR (Artificial Intelligence Resource) identifier in the format `provider:id@version`. Use the [Model Search](/docs/en/utilities/model-search) utility to discover available video models and their capabilities.

    Choose models based on your desired output quality and supported features like resolution or duration limits.

### [duration](https://runware.ai/docs/en/video-inference/api-reference#request-duration) float required Min: 1 Max: 10
:   The length of the generated video in seconds. This parameter directly affects the total number of frames produced based on the specified frame rate.

    Total frames are calculated as `duration × fps`. For example, a 5-second video at 24 fps will contain 120 frames.

    Longer durations require significantly more processing time and computational resources. Consider your specific use case when choosing duration length.

### [fps](https://runware.ai/docs/en/video-inference/api-reference#request-fps) integer Min: 15 Max: 60 Default: 24
:   The frame rate (frames per second) of the generated video. Higher frame rates create smoother motion but require more processing time and result in larger file sizes.

    Common frame rates:

    - **24 fps**: Standard cinematic frame rate, natural motion feel.
    - **30 fps**: Common for web video, smooth motion.
    - **60 fps**: High frame rate, very smooth motion for action content.

    Note that using the same duration with higher frame rates creates smoother motion by generating more intermediate frames. The frame rate combines with duration to determine total frame count: `duration × fps = total frames`.

### [steps](https://runware.ai/docs/en/video-inference/api-reference#request-steps) integer Min: 10 Max: 50
:   The number of denoising steps the model performs during video generation. More steps typically result in higher quality output but require longer processing time.

    Each step refines the entire sequence, improving temporal consistency and visual quality. Higher step counts are particularly important for achieving smooth motion and reducing visual artifacts.

    Most video models work well with 20-40 steps. Values below 20 may produce lower quality results, while values above 40 provide diminishing returns for most use cases.

### [seed](https://runware.ai/docs/en/video-inference/api-reference#request-seed) integer Min: 1 Max: 9223372036854776000 Default: Random
:   A seed is a value used to randomize the video generation. If you want to make videos reproducible (generate the same video multiple times), you can use the same seed value.

    **Note**: Random seeds are generated as 32-bit values for platform compatibility, but you can specify any value if your platform supports it (JavaScript safely supports up to 53-bit integers).

### [CFGScale](https://runware.ai/docs/en/video-inference/api-reference#request-cfgscale) float Min: 0 Max: 50
:   Controls how closely the video generation follows your prompt. Higher values make the model adhere more strictly to your text description, while lower values allow more creative freedom. `CFGScale` affects both visual content and temporal consistency.

    Recommended range is 6.0-10.0 for most video models. Values above 12 may cause over-guidance artifacts or unnatural motion patterns.

### [speech](https://runware.ai/docs/en/video-inference/api-reference#request-speech) object
:   Configuration object for text-to-speech generation. This parameter allows you to generate audio from text input.

    ```
    "speech": {
      "voice": "Emily",
      "text": "Hello, this is a sample text for speech synthesis."
    }
    ```

      Properties
    ⁨2⁩ properties 

    `speech` » `voice` #### [voice](https://runware.ai/docs/en/video-inference/api-reference#request-speech-voice) string Default: auto
    :   Specifies the voice identifier to use for text-to-speech synthesis. Each voice has distinct characteristics and is suitable for different types of content.

        When using `auto`, the system automatically selects the most suitable voice based on the content and context.

          View PixVerse LipSync voices 

        | Voice ID | Voice Name |
        | --- | --- |
        | `1` | Emily |
        | `2` | James |
        | `3` | Isabella |
        | `4` | Liam |
        | `5` | Chloe |
        | `6` | Adrian |
        | `7` | Harper |
        | `8` | Ava |
        | `9` | Sophia |
        | `10` | Julia |
        | `11` | Mason |
        | `12` | Jack |
        | `13` | Oliver |
        | `14` | Ethan |
        | `auto` | Auto (automatic selection) |

    `speech` » `text` #### [text](https://runware.ai/docs/en/video-inference/api-reference#request-speech-text) string Min: 1 Max: 200
    :   The text content to be converted to speech. This text will be synthesized using the specified voice and used as audio input for the generation process.

        The text should be clear and well-formatted for optimal speech synthesis quality. Punctuation and capitalization will affect the natural flow and emphasis of the generated speech.

### [numberResults](https://runware.ai/docs/en/video-inference/api-reference#request-numberresults) integer Min: 1 Max: 4 Default: 1
:   Specifies how many videos to generate for the given parameters. Each video will have the same parameters but different seeds, resulting in variations of the same concept.

### [acceleration](https://runware.ai/docs/en/video-inference/api-reference#request-acceleration) "none" | "low" | "medium" | "high" Default: none
:   Applies optimized acceleration presets that automatically configure multiple generation parameters for the best speed and quality balance. This parameter serves as an abstraction layer that intelligently adjusts `acceleratorOptions`, `steps`, `scheduler`, and other underlying settings.

    **Available values**:

    - `none`: No acceleration applied, uses default parameter values.
    - `low`: Minimal acceleration with optimized settings for lowest quality loss.
    - `medium`: Balanced acceleration preset with moderate speed improvements.
    - `high`: Maximum acceleration with caching and aggressive optimizations for fastest generation.

    Acceleration presets serve as a base configuration that can be overridden. You can still manually specify `scheduler`, `steps`, `acceleratorOptions`, and other parameters to customize the preset's default values.

    When overriding individual parameters on top of acceleration presets, results may be unexpected since the preset's optimized parameter combinations are designed to work together. Manual overrides may interfere with the preset's performance optimizations.

### [advancedFeatures](https://runware.ai/docs/en/video-inference/api-reference#request-advancedfeatures) object
:   A container for specialized features that extend the functionality of the generation process. This object groups advanced capabilities that enhance specific aspects of the generation pipeline.

      Properties
    ⁨1⁩ property 

    `advancedFeatures` » `watermark` #### [watermark](https://runware.ai/docs/en/video-inference/api-reference#request-advancedfeatures-watermark) object
    :   Configuration object for adding watermarks to generated videos. Watermarks can be applied using either text or image content with customizable positioning and appearance.

        You must provide either `text` or `image` content for the watermark, but not both. Providing neither or both will result in an error.

        Image can be specified in one of the following formats:

        - An UUID v4 string of a previously uploaded image or a generated image.
        - A data URI string representing the image. The data URI must be in the format `data:<mediaType>;base64,` followed by the base64-encoded image. For example: `data:image/png;base64,iVBORw0KGgo...`.
        - A base64 encoded image without the data URI prefix. For example: `iVBORw0KGgo...`.
        - A URL pointing to the image. The image must be accessible publicly.

        Supported formats are: PNG, JPG, and WEBP.

        **Object properties:**

        - `text` (string): Text content for the watermark (2-32 characters).
        - `image` (string): Image to use as watermark. Supported dimensions: 64×64 to 384×384 pixels.
        - `displayPosition` (string): Watermark position on video. Supported values: `top-left`, `top-center`, `top-right`, `center-left`, `center-center`, `center-right`, `bottom-left`, `bottom-center`, `bottom-right`.
        - `tiled` (boolean): Distributes watermark across video at -45 degree angle.
        - `opacity` (number): Watermark opacity (0.1-1.0).
        - `fontColor` (string): Text color in hex format (default: `#ffffff`).
        - `bgColor` (string): Background color in hex format (default: transparent).

        Text watermark

        ```
        "advancedFeatures": {
          "watermark": {
            "text": "© 2025 Company",
            "displayPosition": "bottom-right",
            "opacity": 0.6,
            "fontColor": "#ffffff",
            "bgColor": "#000000"
          }
        }
        ```

         Image watermark

        ```
        "advancedFeatures": {
          "watermark": {
            "image": "c64351d5-4c59-42f7-95e1-eace013eddab",
            "displayPosition": "top-left",
            "opacity": 0.6
          }
        }
        ```

         Tiled watermark

        ```
        "advancedFeatures": {
          "watermark": {
            "text": "PREVIEW",
            "tiled": true,
            "opacity": 0.4,
            "fontColor": "#cccccc"
          }
        }
        ```

### [acceleratorOptions](https://runware.ai/docs/en/video-inference/api-reference#request-acceleratoroptions) object
:   Advanced caching mechanisms to significantly speed up generation by reducing redundant computation. This object allows you to enable and configure acceleration technologies for your specific model architecture.

    These caching methods will not perform well with stochastic schedulers (those with `SDE` or `Ancestral` in the name). The random noise added by these schedulers prevents the cache from working effectively. For best results, use deterministic schedulers like `Euler` or `DDIM`.

      Properties
    ⁨9⁩ properties 

    `acceleratorOptions` » `teaCache` #### [teaCache](https://runware.ai/docs/en/video-inference/api-reference#request-acceleratoroptions-teacache) boolean Default: false
    :   Enables or disables the TeaCache feature, which accelerates generation by reusing past computations.

        TeaCache is specifically designed for transformer-based models such as Flux and SD 3, and does not work with UNet models like SDXL or SD 1.5.

        This feature is particularly effective for iterative editing and prompt refinement workflows.

          View example 

        ```
        "acceleratorOptions": {
          "teaCache": true,
          "teaCacheDistance": 0.6
        }
        ```

    `acceleratorOptions` » `teaCacheDistance` #### [teaCacheDistance](https://runware.ai/docs/en/video-inference/api-reference#request-acceleratoroptions-teacachedistance) float Min: 0 Max: 1 Default: 0.5
    :   Controls the aggressiveness of the TeaCache feature. Values range from 0.0 (most conservative) to 1.0 (most aggressive).

        Lower values prioritize quality by being more selective about which computations to reuse, while higher values prioritize speed by reusing more computations.

        Example: A value of 0.1 is very conservative, maintaining high quality with modest speed improvements, while 0.6 is more aggressive, yielding greater speed gains with potential minor quality trade-offs.

    `acceleratorOptions` » `fbCache` #### [fbCache](https://runware.ai/docs/en/video-inference/api-reference#request-acceleratoroptions-fbcache) boolean Default: false
    :   Enables or disables the First Block Cache (FBCache) feature, which accelerates generation by caching the first transformer block's output and reusing it when changes between timesteps are minimal. This optimization can provide significant speed improvements for transformer-based models.

          View example 

        ```
        "acceleratorOptions": {
          "fbCache": true,
          "fbCacheThreshold": 0.25
        }
        ```

    `acceleratorOptions` » `fbCacheThreshold` #### [fbCacheThreshold](https://runware.ai/docs/en/video-inference/api-reference#request-acceleratoroptions-fbcachethreshold) float Min: 0 Max: 1 Default: 0.25
    :   Controls the sensitivity threshold for determining when to reuse cached computations. Lower values are more conservative and prioritize quality, while higher values are more aggressive and prioritize speed.

    `acceleratorOptions` » `cacheStartStep` #### [cacheStartStep](https://runware.ai/docs/en/video-inference/api-reference#request-acceleratoroptions-cachestartstep) integer Min: 0 Max: {steps}
    :   Alternative parameters: `acceleratorOptions.cacheStartStepPercentage`.

        Specifies the inference step number at which caching mechanisms should begin. This allows fine control over when acceleration features activate during the generation process.

        It can take values from `0` (first step) to the number of [steps](#request-steps) specified.

    `acceleratorOptions` » `cacheStartStepPercentage` #### [cacheStartStepPercentage](https://runware.ai/docs/en/video-inference/api-reference#request-acceleratoroptions-cachestartsteppercentage) integer Min: 0 Max: 99
    :   Alternative parameters: `acceleratorOptions.cacheStartStep`.

        Specifies the percentage of total inference steps at which caching mechanisms should begin. This provides a relative way to control when acceleration features activate, independent of the total step count.

        It can take values from `0` to `99`.

    `acceleratorOptions` » `cacheEndStep` #### [cacheEndStep](https://runware.ai/docs/en/video-inference/api-reference#request-acceleratoroptions-cacheendstep) integer Min: {cacheStartStep + 1} Max: {steps}
    :   Alternative parameters: `acceleratorOptions.cacheEndStepPercentage`.

        Specifies the inference step number at which caching mechanisms should stop.

        It can take values higher than [cacheStartStep](#request-acceleratoroptions-cachestartstep) and less than or equal to the number of [steps](#request-steps) specified.

    `acceleratorOptions` » `cacheEndStepPercentage` #### [cacheEndStepPercentage](https://runware.ai/docs/en/video-inference/api-reference#request-acceleratoroptions-cacheendsteppercentage) integer Min: {cacheStartStepPercentage + 1} Max: 100
    :   Alternative parameters: `acceleratorOptions.cacheEndStep`.

        Specifies the percentage of total inference steps at which caching mechanisms should stop.

        It can take values higher than [cacheStartStepPercentage](#request-acceleratoroptions-cachestartsteppercentage) and lower than or equal to `100`.

    `acceleratorOptions` » `cacheMaxConsecutiveSteps` #### [cacheMaxConsecutiveSteps](https://runware.ai/docs/en/video-inference/api-reference#request-acceleratoroptions-cachemaxconsecutivesteps) integer Min: 1 Max: 5 Default: 3
    :   Limits the maximum number of consecutive steps that can use cached computations before forcing a fresh computation. This prevents quality degradation that can occur from extended cache reuse and ensures periodic refresh of the generation process.

### [lora](https://runware.ai/docs/en/video-inference/api-reference#request-lora) object[]
:   With LoRA (Low-Rank Adaptation), you can adapt a model to specific styles or features by emphasizing particular aspects of the data. This technique enhances the quality and relevance of generated content and can be especially useful when the output needs to adhere to a specific artistic style or follow particular guidelines.

    Multiple LoRA models can be used simultaneously to achieve different adaptation goals.

    The `lora` parameter is an array of objects. Each object contains properties that define the configuration for a specific LoRA model.

      View example 

    ```
    {
      "taskType": "videoInference",
      "taskUUID": "string",
      "positivePrompt": "string",
      "model": "string",
      "duration": int,
      "width": int,
      "height": int,
      "lora": [ 
        { 
          "model": "string",
          "weight": float 
        } 
      ] 
    }
    ```

       Array items
    ⁨3⁩ properties each 

    `lora[]` » `model` #### [model](https://runware.ai/docs/en/video-inference/api-reference#request-lora-model) string required
    :   We make use of the [AIR system](https://github.com/civitai/civitai/wiki/AIR-%E2%80%90-Uniform-Resource-Names-for-AI) to identify LoRA models. This identifier is a unique string that represents a specific model.

        You can find the AIR identifier of the LoRA model you want to use in our [Model Explorer](https://my.runware.ai/models/all), which is a tool that allows you to search for models based on their characteristics.

        More information about the AIR system can be found in the [Models page](/docs/en/image-inference/models).

        Example: `civitai:132942@146296`.

    `lora[]` » `weight` #### [weight](https://runware.ai/docs/en/video-inference/api-reference#request-lora-weight) float Min: -4 Max: 4 Default: 1
    :   Defines the strength or influence of the LoRA model in the generation process. The value can range from -4 (negative influence) to +4 (maximum influence).

        Multiple LoRAs can be used simultaneously with different weights to achieve complex adaptations.

          View example 

        ```
        "lora": [
          { "model": "runware:13090@1", "weight": 1.5 },
          { "model": "runware:6638@1", "weight": 0.8 }
        ]
        ```

    `lora[]` » `transformer` #### [transformer](https://runware.ai/docs/en/video-inference/api-reference#request-lora-transformer) "high" | "low" | "both" Default: both
    :   Controls which transformer stages the LoRA adaptation is applied to in dual-expert video models. Some video models use separate high-noise and low-noise processing stages, and LoRAs can be selectively applied to optimize their effectiveness.

        **Available values**:

        - `high`: Apply LoRA only to the high-noise processing stage (coarse structure and early generation steps).
        - `low`: Apply LoRA only to the low-noise processing stage (fine details and later generation steps).
        - `both`: Apply LoRA to both high-noise and low-noise stages for full coverage.

        Different LoRAs may perform optimally on different transformer stages. Some LoRAs are specifically trained for low-noise detail work, while others affect overall structure better when applied to high-noise stages. When in doubt, `both` provides comprehensive coverage but may require careful weight balancing.

        Applying LoRAs to incompatible transformer stages may result in reduced effectiveness or visual artifacts. Consider the LoRA's intended purpose when selecting the transformer stage.

### [providerSettings](https://runware.ai/docs/en/video-inference/api-reference#request-providersettings) object
:   Contains provider-specific configuration settings that customize the behavior of different AI models and services. Each provider has its own set of parameters that control various aspects of the generation process.

    The `providerSettings` parameter is an object that contains nested objects for each supported provider.

      Properties
    ⁨5⁩ properties 

    `providerSettings` » `google` #### [google](https://runware.ai/docs/en/video-inference/api-reference#request-providersettings-google) object
    :   Configuration settings specific to Google's video generation models (Veo 2 and Veo 3). These settings control various aspects of the generation process including prompt enhancement and audio generation capabilities.

          View example 

        ```
        "providerSettings": {
          "google": { 
            "enhancePrompt": true,
            "generateAudio": false
          } 
        }
        ```

           Properties
        ⁨2⁩ properties 

        `providerSettings` » `google` » `enhancePrompt` ##### [enhancePrompt](https://runware.ai/docs/en/video-inference/api-reference#request-providersettings-google-enhanceprompt) boolean Default: true
        :   Controls whether the input prompt is automatically enhanced and expanded to improve generation quality. When enabled, the system optimizes the prompt for better results by adding relevant details and context.

            This setting cannot be disabled when using Veo 3 model, as prompt enhancement is always active. For Veo 2 model, this setting can be controlled and disabled if needed.

            Enhanced prompts typically result in more detailed and higher-quality video generation by providing the model with richer context and clearer instructions.

            When prompt enhancement is enabled, reproducibility is not guaranteed even when using the same seed value. The enhancement process may introduce variability that affects the deterministic nature of generation.

        `providerSettings` » `google` » `generateAudio` ##### [generateAudio](https://runware.ai/docs/en/video-inference/api-reference#request-providersettings-google-generateaudio) boolean Default: false
        :   Controls whether the generated video includes audio content. When enabled, the system creates appropriate audio that matches the visual content and scene context within the video.

            This feature is only available for Veo 3 model. Audio generation is not supported in Veo 2.

            Generated audio can include ambient sounds, music, or other audio elements that enhance the video experience and provide a more immersive result.

    `providerSettings` » `bytedance` #### [bytedance](https://runware.ai/docs/en/video-inference/api-reference#request-providersettings-bytedance) object
    :   Configuration settings specific to ByteDance's video generation models. These settings control camera behavior and movement during video generation.

          View example 

        ```
        "providerSettings": {
          "bytedance": { 
            "cameraFixed": false
          } 
        }
        ```

           Properties
        ⁨1⁩ property 

        `providerSettings` » `bytedance` » `cameraFixed` ##### [cameraFixed](https://runware.ai/docs/en/video-inference/api-reference#request-providersettings-bytedance-camerafixed) boolean Default: false
        :   Controls whether the camera remains stationary during video generation. When enabled, the camera position and angle are fixed, preventing any camera movement, panning, or zooming effects.

            When disabled (default), the model can incorporate dynamic camera movements such as pans, tilts, zooms, or tracking shots to create more cinematic and engaging video content.

            This setting is useful when you need static shots or want to avoid camera motion that might distract from the main subject or action in the video.

    `providerSettings` » `minimax` #### [minimax](https://runware.ai/docs/en/video-inference/api-reference#request-providersettings-minimax) object
    :   Configuration settings specific to MiniMax's video generation models. These settings control prompt processing and optimization features.

          View example 

        ```
        "providerSettings": {
          "miniMax": { 
            "promptOptimizer": false
          } 
        }
        ```

           Properties
        ⁨1⁩ property 

        `providerSettings` » `minimax` » `promptOptimizer` ##### [promptOptimizer](https://runware.ai/docs/en/video-inference/api-reference#request-providersettings-minimax-promptoptimizer) boolean Default: false
        :   Controls whether the input prompt is automatically optimized and refined to improve generation quality. When enabled, the system analyzes and enhances the prompt by adding relevant details, improving clarity, and optimizing structure for better video generation results.

            The prompt optimizer can help transform simple or basic prompts into more detailed and effective instructions, potentially leading to higher-quality video outputs with better adherence to the intended creative vision.

            When disabled, the original prompt is used as-is without any modifications or enhancements.

            When prompt enhancement is enabled, reproducibility is not guaranteed even when using the same seed value. The enhancement process may introduce variability that affects the deterministic nature of generation.

    `providerSettings` » `pixverse` #### [pixverse](https://runware.ai/docs/en/video-inference/api-reference#request-providersettings-pixverse) object
    :   Configuration object for PixVerse-specific features and effects. PixVerse offers unique capabilities like viral effects, camera movements, and artistic styles that enhance video generation.

        The `effect` and `cameraMovement` parameters are mutually exclusive. You can use one or the other, but not both in the same request.

          View example 

        ```
        {
          "taskType": "videoInference",
          "taskUUID": "a770f077-f413-47de-9dac-be0b26a35da6",
          "positivePrompt": "a person dancing energetically",
          "model": "pixverse:1@3",
          "duration": 8,
          "width": 1080,
          "height": 1920,
          "providerSettings": {
            "pixverse": {
              "style": "anime",
              "effect": "jiggle jiggle",
              "motionMode": "fast",
              "watermark": false
            }
          }
        }
        ```

           Properties
        ⁨6⁩ properties 

        `providerSettings` » `pixverse` » `style` ##### [style](https://runware.ai/docs/en/video-inference/api-reference#request-providersettings-pixverse-style) string
        :   Applies artistic styling to the generated video. PixVerse supports various visual aesthetics that transform the overall look and feel of the content.

            Available styles:

            - `anime`: Japanese animation aesthetic with characteristic visual elements.
            - `3d_animation`: Three-dimensional animated style with depth and volume.
            - `clay`: Stop-motion clay animation appearance.
            - `comic`: Comic book or graphic novel visual style.
            - `cyberpunk`: Futuristic, neon-lit dystopian aesthetic.

            The style parameter affects the entire video generation process, influencing color palettes, rendering techniques, and visual characteristics to match the selected aesthetic.

        `providerSettings` » `pixverse` » `effect` ##### [effect](https://runware.ai/docs/en/video-inference/api-reference#request-providersettings-pixverse-effect) string
        :   Applies special viral effects and templates to the video content. PixVerse offers 20 unique effects designed for social media and creative content.

            Available effects:

            - `bikini up`: Body transformation effect.
            - `the tigers touch`: Animal-themed transformation.
            - `jiggle jiggle`: Rhythmic movement effect.
            - `hug your love`: Romantic interaction template.
            - `kiss me ai`: Kiss interaction effect.
            - `subject 3 fever`: Energetic movement template.
            - `fin-tastic mermaid`: Mermaid transformation.
            - `lets ymca`: Dance movement template.
            - `skeleton dance`: Spooky dance effect.
            - `kungfu club`: Martial arts action template.
            - `boom drop`: Explosive impact effect.
            - `vroom vroom step`: Vehicle-themed movement.
            - `creepy devil smile`: Horror-themed facial effect.
            - `pubg winner hit`: Gaming victory celebration.
            - `360 microwave`: Spinning rotation effect.
            - `eye zoom challenge`: Close-up eye effect.
            - `muscle surge`: Body enhancement effect.
            - `punch face`: Impact reaction template.
            - `balloon belly`: Body inflation effect.
            - `kiss kiss`: Multiple kiss interaction.

            Cannot be used simultaneously with `cameraMovement` parameter.

        `providerSettings` » `pixverse` » `cameraMovement` ##### [cameraMovement](https://runware.ai/docs/en/video-inference/api-reference#request-providersettings-pixverse-cameramovement) string
        :   Camera movements add professional cinematography techniques to your video content, making it more engaging and visually dynamic. PixVerse offers 21 cinematic camera movement options to enhance your videos with smooth, professional-looking motion.

            **Model compatibility**: Available on PixVerse v4 and v4.5 models. Not supported on v3.5.

            Available camera movements:

            - `horizontal_left`: Smooth horizontal movement to the left.
            - `horizontal_right`: Smooth horizontal movement to the right.
            - `vertical_up`: Vertical movement upward.
            - `vertical_down`: Vertical movement downward.
            - `zoom_in`: Gradual zoom into the subject.
            - `zoom_out`: Gradual zoom away from the subject.
            - `auto_camera`: Automatic camera movement based on scene content.
            - `crane_up`: Upward crane shot movement.
            - `quickly_zoom_in`: Fast zoom into the subject.
            - `quickly_zoom_out`: Fast zoom away from the subject.
            - `smooth_zoom_in`: Gentle, smooth zoom into the subject.
            - `camera_rotation`: Rotating camera movement around the axis.
            - `robo_arm`: Mechanical, precise camera movement.
            - `super_dolly_out`: Dramatic outward dolly movement.
            - `whip_pan`: Quick, dynamic pan movement.
            - `hitchcock`: Classic Hitchcock-style dolly zoom effect.
            - `left_follow`: Camera follows subject moving left.
            - `right_follow`: Camera follows subject moving right.
            - `pan_left`: Horizontal pan to the left.
            - `pan_right`: Horizontal pan to the right.
            - `fix_bg`: Fixed background with foreground movement.

            Cannot be used simultaneously with `effect` parameter.

        `providerSettings` » `pixverse` » `motionmode` ##### [motionmode](https://runware.ai/docs/en/video-inference/api-reference#request-providersettings-pixverse-motionmode) string Default: normal
        :   Controls the intensity and speed of motion in the generated video.

            Available modes:

            - `normal` Standard motion intensity and pacing.
            - `fast` Increased motion speed and intensity.

            The `fast` motion mode automatically reverts to `normal` when duration is set to 8 seconds or when resolution is set to 1080p.

        `providerSettings` » `pixverse` » `soundEffectSwitch` ##### [soundEffectSwitch](https://runware.ai/docs/en/video-inference/api-reference#request-providersettings-pixverse-soundeffectswitch) boolean Default: false
        :   Controls whether to generate background sound or music for the video.

            - **true**: Generate audio content alongside the video.
            - **false**: Create video without sound.

            When enabled, PixVerse will automatically add appropriate background audio that matches the visual content and enhances the overall viewing experience.

        `providerSettings` » `pixverse` » `soundEffectContent` ##### [soundEffectContent](https://runware.ai/docs/en/video-inference/api-reference#request-providersettings-pixverse-soundeffectcontent) string Min: 2 Max: 2048
        :   Describes the specific type of sound effect or audio content to generate. This parameter works in conjunction with `soundEffectSwitch` to provide precise audio control.

            Provide descriptive text about the desired audio, such as "explosion", "footsteps", "ocean waves", "upbeat music", or "dramatic orchestral score". The more specific the description, the better the audio generation will match your vision.

            If left empty while `soundEffectSwitch` is enabled, the system will generate random sound effects that complement the visual content.

    `providerSettings` » `vidu` #### [vidu](https://runware.ai/docs/en/video-inference/api-reference#request-providersettings-vidu) object
    :   Configuration settings specific to Vidu's video generation models. These settings control movement dynamics, background music generation, and visual styles for video content.

          View example 

        ```
        "providerSettings": {
          "vidu": { 
            "movementAmplitude": "medium",
            "bgm": true,
            "style": "anime"
          } 
        }
        ```

           Properties
        ⁨3⁩ properties 

        `providerSettings` » `vidu` » `movementamplitude` ##### [movementamplitude](https://runware.ai/docs/en/video-inference/api-reference#request-providersettings-vidu-movementamplitude) string Default: auto
        :   Controls the intensity and scale of movement within the generated video content. This parameter affects how dynamic or subtle the motion appears in the final output.

            **Available values:**

            - `auto`: Automatically determines the appropriate movement level based on the content and prompt.
            - `small`: Minimal movement with subtle animations and gentle transitions.
            - `medium`: Moderate movement with balanced dynamics.
            - `large`: High movement with pronounced animations and dramatic motion.

            The movement amplitude affects elements such as camera motion, object movement, and overall scene dynamics throughout the video.

        `providerSettings` » `vidu` » `bgm` ##### [bgm](https://runware.ai/docs/en/video-inference/api-reference#request-providersettings-vidu-bgm) boolean Default: false
        :   Controls whether background music is generated and included in the video content. When enabled, the model creates appropriate background music that complements the visual content and enhances the overall viewing experience.

            Background music generation is only supported for 4-second videos. This feature is not available for longer video durations.

            The generated background music is designed to match the mood, pace, and style of the video content automatically.

        `providerSettings` » `vidu` » `style` ##### [style](https://runware.ai/docs/en/video-inference/api-reference#request-providersettings-vidu-style) string Default: general
        :   Specifies the visual style and artistic approach for the generated video content. This parameter influences the overall aesthetic and rendering style of the output.

            **Available values:**

            - `general`: Standard photorealistic style suitable for most content types.
            - `anime`: Animated style with characteristic anime/manga visual elements and aesthetics.

            Style selection is only supported for text-to-video generation. This parameter is not available for other video generation modes.

## [Response](#response)

Video inference operations require polling to retrieve results due to asynchronous processing. You'll need to use the [`getResponse`](/docs/en/utilities/task-responses) task to check status and retrieve the final video.

When you submit a video task, you receive immediate confirmation that your request was accepted and processing has started, or an error response if validation fails.

Success

```
{
  "data": [
    {
      "taskType": "videoInference",
      "taskUUID": "24cd5dff-cb81-4db5-8506-b72a9425f9d1"
    }
  ]
}
```

 Error

```
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

To retrieve the actual video results, use the [`getResponse`](/docs/en/utilities/task-responses) task with the returned `taskUUID`. The response format depends on the current processing status:

Processing

```
{
  "data": [
    {
      "taskType": "videoInference",
      "taskUUID": "24cd5dff-cb81-4db5-8506-b72a9425f9d1",
      "status": "processing",
    }
  ]
}
```

 Success

```
{
  "data": [
    {
      "taskType": "videoInference",
      "taskUUID": "24cd5dff-cb81-4db5-8506-b72a9425f9d1",
      "status": "success",
      "videoUUID": "b7db282d-2943-4f12-992f-77df3ad3ec71",
      "videoURL": "https://im.runware.ai/video/ws/0.5/vi/b7db282d-2943-4f12-992f-77df3ad3ec71.mp4",
      "cost": 0.18
    }
  ]
}
```

 Error

```
{
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

---

### [taskType](https://runware.ai/docs/en/video-inference/api-reference#response-tasktype) string
:   The API will return the `taskType` you sent in the request. In this case, it will be `videoInference`. This helps match the responses to the correct task type.

### [taskUUID](https://runware.ai/docs/en/video-inference/api-reference#response-taskuuid) string UUID v4
:   The API will return the `taskUUID` you sent in the request. This way you can match the responses to the correct request tasks.

### [videoUUID](https://runware.ai/docs/en/video-inference/api-reference#response-videouuid) string UUID v4
:   A unique identifier for the generated video. This UUID can be used to reference the video in subsequent operations or for tracking purposes.

    The `videoUUID` is different from the `taskUUID`. While `taskUUID` identifies the generation request, `videoUUID` identifies the specific video output.

### [videoURL](https://runware.ai/docs/en/video-inference/api-reference#response-videourl) string
:   If `outputType` is set to `URL`, this parameter contains the URL of the video to be downloaded.

### [seed](https://runware.ai/docs/en/video-inference/api-reference#response-seed) integer
:   The seed value that was used to generate this video. This value can be used to reproduce the same video when using identical parameters in another request.

### [cost](https://runware.ai/docs/en/video-inference/api-reference#response-cost) float
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