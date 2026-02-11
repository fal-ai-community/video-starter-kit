---
title: Image Inference API
source_url: https://runware.ai/docs/en/image-inference/api-reference
fetched_at: 2025-10-27 03:51:24
---

## [Introduction](#introduction)

Image inference is a powerful feature that allows you to **generate images from text prompts** or **transform existing images** according to your needs. This page is the complete API reference for image inference tasks. All workflows and operations use the single `imageInference` task type, differentiated through parameter combinations.

### [Core operations](#core-operations)

- **Text-to-image**: Generate images from text descriptions ([full guide](/docs/en/image-inference/text-to-image)).
- **Image-to-image**: Transform existing images based on prompts ([full guide](/docs/en/image-inference/image-to-image)).
- **Inpainting**: Edit specific areas within images ([full guide](/docs/en/image-inference/inpainting)).
- **Outpainting**: Extend images beyond original boundaries ([full guide](/docs/en/image-inference/outpainting)).

### [Advanced features](#advanced-features)

Additional parameters enable specialized capabilities:

- **Style and control**: ControlNet, LoRA, IP-Adapters, Embeddings.
- **Quality enhancement**: Refiners, VAE.
- **Identity**: PuLID, ACE++, PhotoMaker.
- **Performance and other**: Accelerator options, Advanced features.

Each feature includes detailed parameter documentation below.

## [Request](#request)

Our API always accepts an array of objects as input, where each object represents a **specific task to be performed**. The structure varies depending on the workflow and features used.

The following examples demonstrate how different parameter combinations create specific workflows.

Text to Image

```
{
  "taskType": "imageInference",
  "taskUUID": "a770f077-f413-47de-9dac-be0b26a35da6",
  "outputType": "URL",
  "outputFormat": "jpg",
  "positivePrompt": "a serene mountain landscape with a crystal-clear lake reflecting the sky",
  "height": 1024,
  "width": 1024,
  "model": "runware:101@1",
  "steps": 30,
  "CFGScale": 7.5,
  "numberResults": 4
}
```

 Image to Image

```
{
  "taskType": "imageInference",
  "taskUUID": "b8c4d952-7f27-4a6e-bc9a-83f01d1c6d59",
  "positivePrompt": "a watercolor painting style, soft brushstrokes, artistic interpretation",
  "seedImage": "c64351d5-4c59-42f7-95e1-eace013eddab",
  "model": "civitai:139562@297320",
  "height": 1024,
  "width": 1024,
  "strength": 0.7,
  "numberResults": 1
}
```

 Inpainting

```
{
  "taskType": "imageInference",
  "taskUUID": "f3a2b8c9-1e47-4d3a-9b2f-8c7e6d5a4b3c",
  "positivePrompt": "a red leather sofa, modern furniture, well-lit room",
  "seedImage": "c64351d5-4c59-42f7-95e1-eace013eddab",
  "maskImage": "d7e8f9a0-2b5c-4e7f-a1d3-9c8b7a6e5d4f",
  "model": "civitai:139562@297320",
  "height": 1024,
  "width": 1024,
  "strength": 0.8,
  "numberResults": 1
}
```

 Outpainting

```
{
  "taskType": "imageInference",
  "taskUUID": "e4d3c2b1-5a6f-4c8e-b2d7-1f0e9d8c7b6a",
  "positivePrompt": "forest",
  "seedImage": "c64351d5-4c59-42f7-95e1-eace013eddab",
  "outpaint": { 
    "top": 128,
    "bottom": 128,
    "left": 64,
    "right": 64
  },
  "model": "civitai:139562@297320",
  "height": 1024,
  "width": 1152,
  "numberResults": 1
}
```

 Refiner

```
{
  "taskType": "imageInference",
  "taskUUID": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "positivePrompt": "a highly detailed portrait of a wise old wizard with a long beard",
  "model": "civitai:139562@297320",
  "refiner": { 
    "model": "civitai:101055@128080",
    "startStep": 30
  },
  "height": 1024,
  "width": 1024,
  "steps": 35,
  "CFGScale": 8.0,
  "numberResults": 1
}
```

 Embeddings

```
{
  "taskType": "imageInference",
  "taskUUID": "9876543210-abcd-ef12-3456-789012345678",
  "positivePrompt": "a fantasy castle in the MyStyle aesthetic, dramatic lighting, epiCPhoto",
  "model": "civitai:25694@143906",
  "height": 512,
  "width": 512,
  "embeddings": [ 
    { 
      "model": "civitai:195911@220262",
      "weight": 0.8
    }
  ],
  "numberResults": 1
}
```

 ControlNet

```
{
  "taskType": "imageInference",
  "taskUUID": "12345678-9abc-def0-1234-56789abcdef0",
  "positivePrompt": "a photorealistic portrait of a young woman, professional lighting",
  "model": "runware:101@1",
  "height": 1024,
  "width": 1024,
  "controlNet": [ 
    { 
      "model": "runware:25@1",
      "guideImage": "9d7271cb-1be3-4607-88af-d039d771e5aa",
      "weight": 0.8,
      "startStep": 0,
      "endStep": 10,
      "controlMode": "balanced"
    }
  ],
  "numberResults": 1
}
```

 LoRA

```
{
  "taskType": "imageInference",
  "taskUUID": "fedcba09-8765-4321-0fed-cba987654321",
  "positivePrompt": "a steampunk airship flying through cloudy skies, Victorian aesthetic",
  "model": "runware:101@1",
  "height": 1024,
  "width": 1024,
  "lora": [ 
    { 
      "model": "civitai:652699@993999",
      "weight": 0.95
    }
  ],
  "numberResults": 1
}
```

 IPAdapters

```
{
  "taskType": "imageInference",
  "taskUUID": "abcdef12-3456-7890-abcd-ef1234567890",
  "positivePrompt": "__BLANK__",
  "model": "runware:101@1",
  "height": 1024,
  "width": 1024,
  "ipAdapters": [ 
    { 
      "model": "runware:105@1",
      "guideImage": "6963a97e-f017-408b-a447-6345ec31a4f0"
    }
  ],
  "numberResults": 1
}
```

---

### [taskType](https://runware.ai/docs/en/image-inference/api-reference#request-tasktype) string required
:   The type of task to be performed. For this task, the value should be `imageInference`.

### [taskUUID](https://runware.ai/docs/en/image-inference/api-reference#request-taskuuid) string required UUID v4
:   When a task is sent to the API you must include a random UUID v4 string using the `taskUUID` parameter. This string is used to match the async responses to their corresponding tasks.

    If you send multiple tasks at the same time, the `taskUUID` will help you match the responses to the correct tasks.

    The `taskUUID` must be unique for each task you send to the API.

### [outputType](https://runware.ai/docs/en/image-inference/api-reference#request-outputtype) "base64Data" | "dataURI" | "URL" Default: URL
:   Specifies the output type in which the image is returned. Supported values are: `dataURI`, `URL`, and `base64Data`.

    - `base64Data`: The image is returned as a base64-encoded string using the `imageBase64Data` parameter in the response object.
    - `dataURI`: The image is returned as a data URI string using the `imageDataURI` parameter in the response object.
    - `URL`: The image is returned as a URL string using the `imageURL` parameter in the response object.

### [outputFormat](https://runware.ai/docs/en/image-inference/api-reference#request-outputformat) "JPG" | "PNG" | "WEBP" Default: JPG
:   Specifies the format of the output image. Supported formats are: `PNG`, `JPG` and `WEBP`.

### [outputQuality](https://runware.ai/docs/en/image-inference/api-reference#request-outputquality) integer Min: 20 Max: 99 Default: 95
:   Sets the compression quality of the output image. Higher values preserve more quality but increase file size, lower values reduce file size but decrease quality.

### [webhookURL](https://runware.ai/docs/en/image-inference/api-reference#request-webhookurl) string
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

### [deliveryMethod](https://runware.ai/docs/en/image-inference/api-reference#request-deliverymethod) "sync" | "async" required Default: sync
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

### [uploadEndpoint](https://runware.ai/docs/en/image-inference/api-reference#request-uploadendpoint) string
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

### [safety](https://runware.ai/docs/en/image-inference/api-reference#request-safety) object
:   Configuration object for content safety checking to detect and filter inappropriate content in generated media.

      View example 

    ```
    {
      "taskType": "imageInference",
      "taskUUID": "a770f077-f413-47de-9dac-be0b26a35da6",
      "model": "runware:101@1",
      "positivePrompt": "A person walking in a park",
      "width": 1024,
      "height": 1024,
      "safety": {
        "checkContent": true
      }
    }
    ```

       Properties
    ⁨2⁩ properties 

    `safety` » `checkContent` #### [checkContent](https://runware.ai/docs/en/image-inference/api-reference#request-safety-checkcontent) boolean Default: false
    :   Simple toggle for enabling content safety checking. When enabled, defaults to `fast` mode for optimal performance while maintaining content safety.

        This provides an easy way to enable safety checking without needing to specify detailed mode configurations.

    `safety` » `mode` #### [mode](https://runware.ai/docs/en/image-inference/api-reference#request-safety-mode) "none" | "fast" | "full" Default: none
    :   Advanced control over safety checking intensity and coverage for content moderation.

        **Available values**:

        - `none`: No content safety checking performed.
        - `fast`: Check first, middle, and last frames (video) or single check (images).
        - `full`: Check all frames in video content, adds slight processing delay.

        When both `checkContent` and `mode` are specified, the `mode` parameter takes precedence over the `checkContent` setting.

### [ttl](https://runware.ai/docs/en/audio-inference/api-reference#request-ttl) integer Min: 60
:   Specifies the time-to-live (TTL) in seconds for generated content when using URL output. This determines how long the generated content will be available at the provided URL before being automatically deleted.

    This parameter only takes effect when `outputType` is set to `"URL"`. It has no effect on other output types.

### [includeCost](https://runware.ai/docs/en/image-inference/api-reference#request-includecost) boolean Default: false
:   If set to `true`, the cost to perform the task will be included in the response object.

### [positivePrompt](https://runware.ai/docs/en/image-inference/api-reference#request-positiveprompt) string required
:   A positive prompt is a text instruction to guide the model on generating the image. It is usually a sentence or a paragraph that provides positive guidance for the task. This parameter is essential to shape the desired results.

    For example, if the positive prompt is "dragon drinking coffee", the model will generate an image of a dragon drinking coffee. The more detailed the prompt, the more accurate the results.

    If you wish to generate an image without any prompt guidance, you can use the special token `__BLANK__`. This tells the system to generate an image without text-based instructions.

    The length of the prompt must be between 2 and 3000 characters.

      Learn more ⁨2⁩ resources 

    - [Text to image: Turning words into pictures with AI](https://runware.ai/docs/en/image-inference/text-to-image#prompts-guiding-the-generation)

      GUIDE
    - [Outpainting: Expanding image boundaries](https://runware.ai/docs/en/image-inference/outpainting#other-critical-parameters)

      GUIDE

### [negativePrompt](https://runware.ai/docs/en/image-inference/api-reference#request-negativeprompt) string
:   A negative prompt is a text instruction to guide the model on generating the image. It is usually a sentence or a paragraph that provides negative guidance for the task. This parameter helps to avoid certain undesired results.

    For example, if the negative prompt is "red dragon, cup", the model will follow the positive prompt but will avoid generating an image of a red dragon or including a cup. The more detailed the prompt, the more accurate the results.

    The length of the prompt must be between 2 and 3000 characters.

      Learn more ⁨1⁩ resource 

    - [Text to image: Turning words into pictures with AI](https://runware.ai/docs/en/image-inference/text-to-image#prompts-guiding-the-generation)

      GUIDE

### [seedImage](https://runware.ai/docs/en/image-inference/api-reference#request-seedimage) string required
:   When doing image-to-image, inpainting or outpainting, this parameter is required.

    Specifies the seed image to be used for the diffusion process. The image can be specified in one of the following formats:

    - An UUID v4 string of a [previously uploaded image](/docs/en/utilities/image-upload) or a [generated image](/docs/en/image-inference/api-reference).
    - A data URI string representing the image. The data URI must be in the format `data:<mediaType>;base64,` followed by the base64-encoded image. For example: `data:image/png;base64,iVBORw0KGgo...`.
    - A base64 encoded image without the data URI prefix. For example: `iVBORw0KGgo...`.
    - A URL pointing to the image. The image must be accessible publicly.

    Supported formats are: PNG, JPG and WEBP.

      Learn more ⁨3⁩ resources 

    - [Image-to-image: The art of AI-powered image transformation](https://runware.ai/docs/en/image-inference/image-to-image#seed-image-the-foundation)

      GUIDE
    - [Inpainting: Selective image editing](https://runware.ai/docs/en/image-inference/inpainting#seed-and-mask-image-the-foundation)

      GUIDE
    - [Outpainting: Expanding image boundaries](https://runware.ai/docs/en/image-inference/outpainting#seed-image-the-starting-point)

      GUIDE

### [maskImage](https://runware.ai/docs/en/image-inference/api-reference#request-maskimage) string required
:   When doing inpainting, this parameter is required.

    Specifies the mask image to be used for the inpainting process. The image can be specified in one of the following formats:

    - An UUID v4 string of a [previously uploaded image](/docs/en/utilities/image-upload) or a [generated image](/docs/en/image-inference/api-reference).
    - A data URI string representing the image. The data URI must be in the format `data:<mediaType>;base64,` followed by the base64-encoded image. For example: `data:image/png;base64,iVBORw0KGgo...`.
    - A base64 encoded image without the data URI prefix. For example: `iVBORw0KGgo...`.
    - A URL pointing to the image. The image must be accessible publicly.

    Supported formats are: PNG, JPG and WEBP.

      Learn more ⁨1⁩ resource 

    - [Inpainting: Selective image editing](https://runware.ai/docs/en/image-inference/inpainting#seed-and-mask-image-the-foundation)

      GUIDE

### [maskMargin](https://runware.ai/docs/en/image-inference/api-reference#request-maskmargin) integer Min: 32 Max: 128
:   Adds extra context pixels around the masked region during inpainting. When this parameter is present, the model will zoom into the masked area, considering these additional pixels to create more coherent and well-integrated details.

    This parameter is particularly effective when used with masks generated by the [Image Masking](/docs/en/tools/image-masking) API, enabling enhanced detail generation while maintaining natural integration with the surrounding image.

      Learn more ⁨1⁩ resource 

    - [Inpainting: Selective image editing](https://runware.ai/docs/en/image-inference/inpainting#mask-margin-enhancing-detail)

      GUIDE

### [strength](https://runware.ai/docs/en/image-inference/api-reference#request-strength) float Min: 0 Max: 1 Default: 0.8
:   When doing image-to-image or inpainting, this parameter is used to determine the influence of the `seedImage` image in the generated output. A lower value results in more influence from the original image, while a higher value allows more creative deviation.

      Learn more ⁨3⁩ resources 

    - [Image-to-image: The art of AI-powered image transformation](https://runware.ai/docs/en/image-inference/image-to-image#strength-the-transformation-intensity)

      GUIDE
    - [Inpainting: Selective image editing](https://runware.ai/docs/en/image-inference/inpainting#strength-controlling-transformation-intensity)

      GUIDE
    - [Outpainting: Expanding image boundaries](https://runware.ai/docs/en/image-inference/outpainting#strength-understanding-the-critical-threshold)

      GUIDE

### [referenceImages](https://runware.ai/docs/en/image-inference/api-reference#request-referenceimages) string[]
:   An array containing reference images used to condition the generation process. These images provide visual guidance to help the model generate content that aligns with the style, composition, or characteristics of the reference materials.

    This parameter is particularly useful with edit models like FLUX.1 Kontext, where reference images can guide the generation toward specific visual attributes or maintain consistency with existing content. Each image can be specified in one of the following formats:

    - An UUID v4 string of a [previously uploaded image](/docs/en/utilities/image-upload) or a generated image.
    - A data URI string representing the image. The data URI must be in the format `data:<mediaType>;base64,` followed by the base64-encoded image. For example: `data:image/png;base64,iVBORw0KGgo...`.
    - A base64 encoded image without the data URI prefix. For example: `iVBORw0KGgo...`.
    - A URL pointing to the image. The image must be accessible publicly.

    Supported formats are: PNG, JPG and WEBP.

      View model compatibility 

    | Model Architecture | Max Images |
    | --- | --- |
    | FLUX.1 Kontext | 2 |
    | Ace++ | 1 |
    | Other models | Not supported |

      View example 

    ```
    {
      "taskType": "imageInference",
      "taskUUID": "a770f077-f413-47de-9dac-be0b26a35da6",
      "positivePrompt": "the same person as a chef in a restaurant kitchen",
      "model": "runware:106@1",
      "width": 1024,
      "height": 1024,
      "referenceImages": [
        "bb5d8e32-2f85-4b9c-c1e4-9f6e20a5d3b8"
      ]
    }
    ```

### [outpaint](https://runware.ai/docs/en/image-inference/api-reference#request-outpaint) object
:   Extends the image boundaries in specified directions. When using `outpaint`, you must provide the final dimensions using `width` and `height` parameters, which should account for the original image size plus the total extension (seedImage dimensions + top + bottom, left + right).

      View example 

    ```
    {
      "taskType": "imageInference",
      "taskUUID": "d06e972d-dbfe-47d5-955f-c26e00ce4959",
      "positivePrompt": "a beautiful landscape with mountains and trees",
      "negativePrompt": "blurry, bad quality",
      "seedImage": "59a2edc2-45e6-429f-be5f-7ded59b92046",
      "model": "civitai:4201@130090",
      "height": 1024,
      "width": 768,
      "steps": 20,
      "strength": 0.7,
      "outpaint": { 
        "top": 256,
        "right": 128,
        "bottom": 256,
        "left": 128,
        "blur": 16
      } 
    }
    ```

      Learn more ⁨1⁩ resource 

    - [Outpainting: Expanding image boundaries](https://runware.ai/docs/en/image-inference/outpainting#outpaint-defining-the-expansion)

      GUIDE

       Properties
    ⁨5⁩ properties 

    `outpaint` » `top` #### [top](https://runware.ai/docs/en/image-inference/api-reference#request-outpaint-top) integer Min: 0
    :   Number of pixels to extend at the top of the image. Must be a multiple of 64.

    `outpaint` » `right` #### [right](https://runware.ai/docs/en/image-inference/api-reference#request-outpaint-right) integer Min: 0
    :   Number of pixels to extend at the right side of the image. Must be a multiple of 64.

    `outpaint` » `bottom` #### [bottom](https://runware.ai/docs/en/image-inference/api-reference#request-outpaint-bottom) integer Min: 0
    :   Number of pixels to extend at the bottom of the image. Must be a multiple of 64.

    `outpaint` » `left` #### [left](https://runware.ai/docs/en/image-inference/api-reference#request-outpaint-left) integer Min: 0
    :   Number of pixels to extend at the left side of the image. Must be a multiple of 64.

    `outpaint` » `blur` #### [blur](https://runware.ai/docs/en/image-inference/api-reference#request-outpaint-blur) integer Min: 0 Max: 32 Default: 0
    :   The amount of blur to apply at the boundaries between the original image and the extended areas, measured in pixels.

          Learn more ⁨1⁩ resource 

        - [Outpainting: Expanding image boundaries](https://runware.ai/docs/en/image-inference/outpainting#outpaint-defining-the-expansion)

          GUIDE

### [height](https://runware.ai/docs/en/image-inference/api-reference#request-height) integer required Min: 128 Max: 2048
:   Used to define the height dimension of the generated image. Certain models perform better with specific dimensions.

    The value must be divisible by 64, eg: 128...512, 576, 640...2048.

      Learn more ⁨2⁩ resources 

    - [Inpainting: Selective image editing](https://runware.ai/docs/en/image-inference/image-to-image#dimensions-changing-aspect-ratio)

      GUIDE
    - [Image-to-image: The art of AI-powered image transformation](https://runware.ai/docs/en/image-inference/outpainting#dimensions-critical-for-outpainting)

      GUIDE

### [width](https://runware.ai/docs/en/image-inference/api-reference#request-width) integer required Min: 128 Max: 2048
:   Used to define the width dimension of the generated image. Certain models perform better with specific dimensions.

    The value must be divisible by 64, eg: 128...512, 576, 640...2048.

      Learn more ⁨2⁩ resources 

    - [Image-to-image: The art of AI-powered image transformation](https://runware.ai/docs/en/image-inference/image-to-image#dimensions-changing-aspect-ratio)

      GUIDE
    - [Outpainting: Expanding image boundaries](https://runware.ai/docs/en/image-inference/outpainting#dimensions-critical-for-outpainting)

      GUIDE

### [model](https://runware.ai/docs/en/image-inference/api-reference#request-model) string required
:   We make use of the [AIR](/docs/en/image-inference/models#air-system) (Artificial Intelligence Resource) system to identify models. This identifier is a unique string that represents a specific model.

    You can find the AIR identifier of the model you want to use in our [Model Explorer](https://my.runware.ai/models/all), which is a tool that allows you to search for models based on their characteristics.

      Learn more ⁨3⁩ resources 

    - [Text to image: Turning words into pictures with AI](https://runware.ai/docs/en/image-inference/text-to-image#model-selection-the-foundation-of-generation)

      GUIDE
    - [Inpainting: Selective image editing](https://runware.ai/docs/en/image-inference/inpainting#model-specialized-inpainting-models)

      GUIDE
    - [Outpainting: Expanding image boundaries](https://runware.ai/docs/en/image-inference/outpainting#other-critical-parameters)

      GUIDE

### [vae](https://runware.ai/docs/en/image-inference/api-reference#request-vae) string
:   We make use of the [AIR](/docs/en/image-inference/models#air-system) (Artificial Intelligence Resource) system to identify VAE models. This identifier is a unique string that represents a specific model.

    The VAE (Variational Autoencoder) can be specified to override the default one included with the base model, which can help improve the quality of generated images.

    You can find the AIR identifier of the VAE model you want to use in our [Model Explorer](https://my.runware.ai/models/all), which is a tool that allows you to search for models based on their characteristics.

      Learn more ⁨1⁩ resource 

    - [Text to image: Turning words into pictures with AI](https://runware.ai/docs/en/image-inference/text-to-image#vae-visual-decoder)

      GUIDE

### [steps](https://runware.ai/docs/en/image-inference/api-reference#request-steps) integer Min: 1 Max: 100 Default: 20
:   The number of steps is the number of iterations the model will perform to generate the image. The higher the number of steps, the more detailed the image will be. However, increasing the number of steps will also increase the time it takes to generate the image and may not always result in a better image (some [schedulers](#request-scheduler) work differently).

    When using your own models you can specify a new default value for the number of steps.

      Learn more ⁨1⁩ resource 

    - [Text to image: Turning words into pictures with AI](https://runware.ai/docs/en/image-inference/text-to-image#steps-trading-quality-for-speed)

      GUIDE

### [scheduler](https://runware.ai/docs/en/image-inference/api-reference#request-scheduler) string Default: Model's scheduler
:   An scheduler is a component that manages the inference process. Different schedulers can be used to achieve different results like more detailed images, faster inference, or more accurate results.

    The default scheduler is the one that the model was trained with, but you can choose a different one to get different results.

    Schedulers are explained in more detail in the [Schedulers page](/docs/en/image-inference/schedulers).

      Learn more ⁨2⁩ resources 

    - [Text to image: Turning words into pictures with AI](https://runware.ai/docs/en/image-inference/text-to-image#scheduler-the-algorithmic-path-to-your-image)

      GUIDE
    - [Outpainting: Expanding image boundaries](https://runware.ai/docs/en/image-inference/outpainting#other-critical-parameters)

      GUIDE

### [seed](https://runware.ai/docs/en/image-inference/api-reference#request-seed) integer Min: 1 Max: 9223372036854776000 Default: Random
:   A seed is a value used to randomize the image generation. If you want to make images reproducible (generate the same image multiple times), you can use the same seed value.

    **Note**: Random seeds are generated as 32-bit values for platform compatibility, but you can specify any value if your platform supports it (JavaScript safely supports up to 53-bit integers).

      Learn more ⁨1⁩ resource 

    - [Text to image: Turning words into pictures with AI](https://runware.ai/docs/en/image-inference/text-to-image#seed-controlling-randomness-deterministically)

      GUIDE

### [CFGScale](https://runware.ai/docs/en/image-inference/api-reference#request-cfgscale) float Min: 0 Max: 50 Default: 7
:   Guidance scale represents how closely the images will resemble the prompt or how much freedom the AI model has. Higher values are closer to the prompt. Low values may reduce the quality of the results.

      Learn more ⁨1⁩ resource 

    - [Text to image: Turning words into pictures with AI](https://runware.ai/docs/en/image-inference/text-to-image#cfg-scale-balancing-creativity-and-control)

      GUIDE

### [clipSkip](https://runware.ai/docs/en/image-inference/api-reference#request-clipskip) integer Min: 0 Max: 2
:   Defines additional layer skips during prompt processing in the CLIP model. Some models already skip layers by default, this parameter adds extra skips on top of those. Different values affect how your prompt is interpreted, which can lead to variations in the generated image.

      Learn more ⁨2⁩ resources 

    - [Text to image: Turning words into pictures with AI](https://runware.ai/docs/en/image-inference/text-to-image#clip-skip-adjusting-text-interpretation)

      GUIDE
    - [How to create stickers with AI: complete workflow with specialized LoRAs](https://runware.ai/blog/how-to-create-stickers-with-ai-complete-workflow-with-specialized-loras#clip-skip)

      ARTICLE

### [promptWeighting](https://runware.ai/docs/en/image-inference/api-reference#request-promptweighting) string
:   Defines the syntax to be used for prompt weighting.

    Prompt weighting allows you to adjust how strongly different parts of your prompt influence the generated image. Choose between `compel` notation with advanced weighting operations or `sdEmbeds` for simple emphasis adjustments.

      View Compel syntax 

    Adds 0.2 seconds to image inference time and incurs additional costs.

    When `compel` syntax is selected, you can use the following notation in prompts:

    **Weighting**

    Syntax: `+` `-` `(word)0.9`

    Increase or decrease the attention given to specific words or phrases.

    Examples:

    - Single words: `small+ dog, pixar style`
    - Multiple words: `small dog, (pixar style)-`
    - Multiple symbols for more effect: `small+++ dog, pixar style`
    - Nested weighting: `(small+ dog)++, pixar style`
    - Explicit weight percentage: `small dog, (pixar)1.2 style`

    **Blend**

    Syntax: `.blend()`

    Merge multiple conditioning prompts.

    Example: `("small dog", "robot").blend(1, 0.8)`

    **Conjunction**

    Syntax: `.and()`

    Break a prompt into multiple clauses and pass them separately.

    Example: `("small dog", "pixar style").and()`

      View sdEmbeds syntax 

    When `sdEmbeds` syntax is selected, you can use the following notation in prompts:

    **Weighting**

    Syntax: `(text)` `(text:number)` `[text]`

    Use parentheses `()` to increase attention, square brackets `[]` to decrease it. Add a number after the text to specify a custom multiplier.

    Examples:

    - Single words: `(small) dog, pixar style`
    - Multiple words: `small dog, [pixar style]`
    - Higher emphasis: `(small:2.5) dog, pixar style`
    - Combined emphasis: `(small dog:1.5), pixar style`

### [numberResults](https://runware.ai/docs/en/image-inference/api-reference#request-numberresults) integer Min: 1 Max: 20 Default: 1
:   Specifies how many images to generate for the given parameters. Each image will have the same parameters but different seeds, resulting in variations of the same concept.

### [acceleration](https://runware.ai/docs/en/image-inference/api-reference#request-acceleration) "none" | "low" | "medium" | "high" Default: none
:   Applies optimized acceleration presets that automatically configure multiple generation parameters for the best speed and quality balance. This parameter serves as an abstraction layer that intelligently adjusts `acceleratorOptions`, `steps`, `scheduler`, and other underlying settings.

    **Available values**:

    - `none`: No acceleration applied, uses default parameter values.
    - `low`: Minimal acceleration with optimized settings for lowest quality loss.
    - `medium`: Balanced acceleration preset with moderate speed improvements.
    - `high`: Maximum acceleration with caching and aggressive optimizations for fastest generation.

    Acceleration presets serve as a base configuration that can be overridden. You can still manually specify `scheduler`, `steps`, `acceleratorOptions`, and other parameters to customize the preset's default values.

    When overriding individual parameters on top of acceleration presets, results may be unexpected since the preset's optimized parameter combinations are designed to work together. Manual overrides may interfere with the preset's performance optimizations.

### [advancedFeatures](https://runware.ai/docs/en/image-inference/api-reference#request-advancedfeatures) object
:   A container for specialized features that extend the functionality of the generation process. This object groups advanced capabilities that enhance specific aspects of the generation pipeline.

      Properties
    ⁨1⁩ property 

    `advancedFeatures` » `layerDiffuse` #### [layerDiffuse](https://runware.ai/docs/en/image-inference/api-reference#request-advancedfeatures-layerdiffuse) boolean Default: false
    :   Enables LayerDiffuse technology, which allows for the direct generation of images with transparency (alpha channels).

        When enabled, this feature applies the necessary LoRA and VAE components to produce high-quality transparent images without requiring post-processing background removal.

        This is particularly useful for creating product images, overlays, composites, and other content that requires transparency. The output must be in a format that supports transparency, such as PNG.

        Note: This feature is only available for the FLUX model architecture. It automatically applies the equivalent of:

        ```
          "lora": [{ "model": "runware:120@2" }],
          "vae": "runware:120@4"
        ```

          View example 

        ```
        {
          "taskType": "imageInference",
          "taskUUID": "991e641a-d2a8-4aa3-9883-9d6fe230fff8",
          "outputFormat": "png",
          "positivePrompt": "a crystal glass",
          "height": 1024,
          "width": 1024,
          "advancedFeatures": {
            "layerDiffuse": true
          },
          "model": "runware:101@1"
        }
        ```

          Learn more ⁨1⁩ resource 

        - [Introducing LayerDiffuse: Generate images with built-in transparency in one step](https://runware.ai/blog/introducing-layerdiffuse-generate-images-with-built-in-transparency-in-one-step)

          ARTICLE

### [acceleratorOptions](https://runware.ai/docs/en/image-inference/api-reference#request-acceleratoroptions) object
:   Advanced caching mechanisms to significantly speed up generation by reducing redundant computation. This object allows you to enable and configure acceleration technologies for your specific model architecture.

    These caching methods will not perform well with stochastic schedulers (those with `SDE` or `Ancestral` in the name). The random noise added by these schedulers prevents the cache from working effectively. For best results, use deterministic schedulers like `Euler` or `DDIM`.

      Properties
    ⁨10⁩ properties 

    `acceleratorOptions` » `teaCache` #### [teaCache](https://runware.ai/docs/en/image-inference/api-reference#request-acceleratoroptions-teacache) boolean Default: false
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

    `acceleratorOptions` » `teaCacheDistance` #### [teaCacheDistance](https://runware.ai/docs/en/image-inference/api-reference#request-acceleratoroptions-teacachedistance) float Min: 0 Max: 1 Default: 0.5
    :   Controls the aggressiveness of the TeaCache feature. Values range from 0.0 (most conservative) to 1.0 (most aggressive).

        Lower values prioritize quality by being more selective about which computations to reuse, while higher values prioritize speed by reusing more computations.

        Example: A value of 0.1 is very conservative, maintaining high quality with modest speed improvements, while 0.6 is more aggressive, yielding greater speed gains with potential minor quality trade-offs.

    `acceleratorOptions` » `deepCache` #### [deepCache](https://runware.ai/docs/en/image-inference/api-reference#request-acceleratoroptions-deepcache) boolean Default: false
    :   Enables or disables the DeepCache feature, which speeds up diffusion-based image generation by caching internal feature maps from the neural network.

        DeepCache is designed for UNet-based models like SDXL and SD 1.5, and is not applicable to transformer-based models like Flux and SD 3.

        DeepCache can provide significant performance improvements for high-throughput scenarios or when generating multiple similar images.

          View example 

        ```
        "acceleratorOptions": {
          "deepCache": true,
          "deepCacheInterval": 3,
          "deepCacheBranchId": 0
        }
        ```

    `acceleratorOptions` » `deepCacheInterval` #### [deepCacheInterval](https://runware.ai/docs/en/image-inference/api-reference#request-acceleratoroptions-deepcacheinterval) integer Min: 1 Default: 3
    :   Represents the frequency of feature caching, specified as the number of steps between each cache operation.

        A larger interval value will make inference faster but may impact quality. A smaller interval prioritizes quality over speed.

    `acceleratorOptions` » `deepCacheBranchId` #### [deepCacheBranchId](https://runware.ai/docs/en/image-inference/api-reference#request-acceleratoroptions-deepcachebranchid) integer Min: 0 Default: 0
    :   Determines which branch of the network (ordered from the shallowest to the deepest layer) is responsible for executing the caching processes.

        Lower branch IDs (e.g., 0) result in more aggressive caching for faster generation, while higher branch IDs produce more conservative caching with potentially higher quality results.

    `acceleratorOptions` » `cacheStartStep` #### [cacheStartStep](https://runware.ai/docs/en/image-inference/api-reference#request-acceleratoroptions-cachestartstep) integer Min: 0 Max: {steps}
    :   Alternative parameters: `acceleratorOptions.cacheStartStepPercentage`.

        Specifies the inference step number at which caching mechanisms should begin. This allows fine control over when acceleration features activate during the generation process.

        It can take values from `0` (first step) to the number of [steps](#request-steps) specified.

    `acceleratorOptions` » `cacheStartStepPercentage` #### [cacheStartStepPercentage](https://runware.ai/docs/en/image-inference/api-reference#request-acceleratoroptions-cachestartsteppercentage) integer Min: 0 Max: 99
    :   Alternative parameters: `acceleratorOptions.cacheStartStep`.

        Specifies the percentage of total inference steps at which caching mechanisms should begin. This provides a relative way to control when acceleration features activate, independent of the total step count.

        It can take values from `0` to `99`.

    `acceleratorOptions` » `cacheEndStep` #### [cacheEndStep](https://runware.ai/docs/en/image-inference/api-reference#request-acceleratoroptions-cacheendstep) integer Min: {cacheStartStep + 1} Max: {steps}
    :   Alternative parameters: `acceleratorOptions.cacheEndStepPercentage`.

        Specifies the inference step number at which caching mechanisms should stop.

        It can take values higher than [cacheStartStep](#request-acceleratoroptions-cachestartstep) and less than or equal to the number of [steps](#request-steps) specified.

    `acceleratorOptions` » `cacheEndStepPercentage` #### [cacheEndStepPercentage](https://runware.ai/docs/en/image-inference/api-reference#request-acceleratoroptions-cacheendsteppercentage) integer Min: {cacheStartStepPercentage + 1} Max: 100
    :   Alternative parameters: `acceleratorOptions.cacheEndStep`.

        Specifies the percentage of total inference steps at which caching mechanisms should stop.

        It can take values higher than [cacheStartStepPercentage](#request-acceleratoroptions-cachestartsteppercentage) and lower than or equal to `100`.

    `acceleratorOptions` » `cacheMaxConsecutiveSteps` #### [cacheMaxConsecutiveSteps](https://runware.ai/docs/en/image-inference/api-reference#request-acceleratoroptions-cachemaxconsecutivesteps) integer Min: 1 Max: 5 Default: 3
    :   Limits the maximum number of consecutive steps that can use cached computations before forcing a fresh computation. This prevents quality degradation that can occur from extended cache reuse and ensures periodic refresh of the generation process.

### [puLID](https://runware.ai/docs/en/image-inference/api-reference#request-pulid) object
:   PuLID (Pure and Lightning ID Customization) enables fast and high-quality identity customization for text-to-image generation. This object allows you to configure settings for transferring facial characteristics from a reference image to generated images with high fidelity.

      View example 

    ```
    {
      "taskType": "imageInference",
      "taskUUID": "991e641a-d2a8-4aa3-9883-9d6fe230fff8",
      "positivePrompt": "portrait, color, cinematic, in garden, soft light, detailed face",
      "height": 1024,
      "width": 1024,
      "model": "runware:101@1",
      "puLID": { 
        "inputImages": ["59a2edc2-45e6-429f-be5f-7ded59b92046"],
        "idWeight": 1,
        "trueCFGScale": 1.5,
        "CFGStartStep": 3
      } 
    }
    ```

       Properties
    ⁨5⁩ properties 

    `puLID` » `inputImages` #### [inputImages](https://runware.ai/docs/en/image-inference/api-reference#request-pulid-inputimages) string[] required Min: 1 Max: 1
    :   An array containing the reference image used for identity customization. The reference image provides the facial characteristics that will be preserved and integrated into the generated images.

        Currently, only a single image is supported, so the array should contain exactly one element with a clear, high-quality face that will serve as the identity source.

        The image can be specified in one of the following formats:

        - An UUID v4 string of a [previously uploaded image](/docs/en/utilities/image-upload) or a [generated image](/docs/en/image-inference/api-reference).
        - A data URI string representing the image. The data URI must be in the format `data:<mediaType>;base64,` followed by the base64-encoded image. For example: `data:image/png;base64,iVBORw0KGgo...`.
        - A base64 encoded image without the data URI prefix. For example: `iVBORw0KGgo...`.
        - A URL pointing to the image. The image must be accessible publicly.

        Supported formats are: PNG, JPG and WEBP.

    `puLID` » `idWeight` #### [idWeight](https://runware.ai/docs/en/image-inference/api-reference#request-pulid-idweight) integer Min: 0 Max: 3 Default: 1
    :   Controls the strength of identity preservation in the generated image. Higher values create outputs that more closely resemble the facial characteristics of the input image, while lower values allow for more creative interpretation while still maintaining some identity features.

    `puLID` » `trueCFGScale` #### [trueCFGScale](https://runware.ai/docs/en/image-inference/api-reference#request-pulid-truecfgscale) float Min: 0 Max: 10
    :   Controls the guidance scale specifically for PuLID's identity embedding process. This parameter modifies how closely the generated image follows the identity characteristics from the reference image while balancing prompt adherence.

        Higher values result in stronger identity preservation and more faithful reproduction of facial features from the reference image. Lower values allow for more creative interpretation while still maintaining recognizable identity features.

        This parameter works in conjunction with the main [CFGScale](/docs/en/image-inference/api-reference#request-cfgscale) parameter but specifically targets the identity embedding component of the generation process.

    `puLID` » `CFGStartStep` #### [CFGStartStep](https://runware.ai/docs/en/image-inference/api-reference#request-pulid-cfgstartstep) integer Min: 0 Max: 10
    :   Alternative parameters: `puLID.CFGstartStepPercentage`.

        Controls when identity features begin to influence the image generation process.

        Lower values apply identity features earlier in the generation process, resulting in stronger resemblance to the reference face but with less creative freedom in composition and style. Higher values do the opposite.

        For photorealistic images, starting as early as possible typically works best. For stylized images (cartoon, anime, etc.), starting a bit later can provide better results.

    `puLID` » `CFGStartStepPercentage` #### [CFGStartStepPercentage](https://runware.ai/docs/en/image-inference/api-reference#request-pulid-cfgstartsteppercentage) integer Min: 0 Max: 100
    :   Alternative parameters: `puLID.CFGstartStep`.

        Determines at what percentage of the total generation steps the identity features begin to influence the image.

        Lower percentages apply identity features earlier in the generation process, creating stronger resemblance to the reference face but with less creative freedom in composition and style. Higher percentages do the opposite.

        For photorealistic images, starting as early as possible typically works best. For stylized images (cartoon, anime, etc.), starting a bit later can provide better results.

### [acePlusPlus](https://runware.ai/docs/en/image-inference/api-reference#request-aceplusplus) object
:   ACE++ is an advanced framework for character-consistent image generation and editing. It supports two distinct workflows: creating new images guided by a reference image, and editing existing images with precise control over specific regions.

    Note: When using the `acePlusPlus` object, you must set the [model](/docs/en/image-inference/api-reference#request-model) parameter to `runware:102@1` (FLUX Fill).

    The [referenceImages](/docs/en/image-inference/api-reference#request-referenceimages) parameter is required when using ACE++ and must be specified at the root level of the request, outside of the `acePlusPlus` object.

      View examples 

    **Creation Workflow:** Generate new images that maintain the style, identity, or characteristics from a reference image. The model extracts visual features from the reference image and combines them with the text prompt to condition the generation process.

    ```
    {
      "taskType": "imageInference",
      "taskUUID": "991e641a-d2a8-4aa3-9883-9d6fe230fff8",
      "positivePrompt": "photo of man wearing a suit",
      "height": 1024,
      "width": 1024,
      "model": "runware:102@1",
      "referenceImages": ["59a2edc2-45e6-429f-be5f-7ded59b92046"],
      "acePlusPlus": {
        "type": "portrait",
        "repaintingScale": 0.5
      }
    }
    ```

    **Editing Workflow:** Modify specific regions of an existing image using guidance from a reference image. Uses an input mask to define the exact area to be edited while preserving the rest of the image unchanged.

    ```
    {
      "taskType": "imageInference",
      "taskUUID": "991e641a-d2a8-4aa3-9883-9d6fe230fff8",
      "positivePrompt": "photo of man wearing a white t-shirt",
      "height": 1024,
      "width": 1024,
      "model": "runware:102@1",
      "referenceImages": ["59a2edc2-45e6-429f-be5f-7ded59b92046"],
      "acePlusPlus": {
        "type": "local_editing",
        "inputImages": ["59a2edc2-45e6-429f-be5f-7ded59b92046"],
        "inputMasks": ["90422a52-f186-4bf4-a73b-0a46016a8330"],
        "repaintingScale": 0.7
      }
    }
    ```

       Properties
    ⁨4⁩ properties 

    `acePlusPlus` » `type` #### [type](https://runware.ai/docs/en/image-inference/api-reference#request-aceplusplus-type) string required Default: portrait
    :   Specifies the nature of the image processing task, which determines the appropriate model configuration and LoRA weights to use within the ACE++ framework.

        **Available task types:**

        - `portrait`: Ensures consistency in facial features across different images, maintaining identity and expression. Ideal for generating consistent character appearances in various settings.
        - `subject`: Maintains consistency of specific subjects (objects, logos, etc.) across different scenes or contexts. Perfect for placing logos consistently on various products or backgrounds.
        - `local_editing`: Facilitates localized editing of images, allowing modification of specific regions while preserving the overall structure. Used for targeted edits like changing object colors or altering facial features.

        Each task type automatically applies the corresponding specialized LoRA model optimized for that specific use case.

    `acePlusPlus` » `inputImages` #### [inputImages](https://runware.ai/docs/en/image-inference/api-reference#request-aceplusplus-inputimages) string[] Max: 1
    :   An array containing the reference image(s) used for character identity. Each input image must contain a single, clear face of the subject.

        Currently, only a single image is supported, so the array should contain exactly one element.

        This reference images provides the character identity (face, style, etc.) that will be preserved during generation or editing.

        The images can be specified in one of the following formats:

        - An UUID v4 string of a [previously uploaded image](/docs/en/utilities/image-upload) or a [generated image](/docs/en/image-inference/api-reference).
        - A data URI string representing the image. The data URI must be in the format `data:<mediaType>;base64,` followed by the base64-encoded image. For example: `data:image/png;base64,iVBORw0KGgo...`.
        - A base64 encoded image without the data URI prefix. For example: `iVBORw0KGgo...`.
        - A URL pointing to the image. The image must be accessible publicly.

        Supported formats are: PNG, JPG and WEBP.

    `acePlusPlus` » `inputMasks` #### [inputMasks](https://runware.ai/docs/en/image-inference/api-reference#request-aceplusplus-inputmasks) string[] Max: 1
    :   An array containing the mask image(s) used for selective editing.

        Currently, only a single mask is supported, so if provided, the array should contain exactly one element.

        This parameter is used only in editing operations. The mask specifies which areas of the image should be edited based on the prompt, while preserving the rest of the image. The mask image can be specified in the same formats as `inputImages`.

        The mask should be a black and white image where white (255) represents the areas to be edited and black (0) represents the areas to be preserved.

        The mask images can be specified in one of the following formats:

        - An UUID v4 string of a [previously uploaded image](/docs/en/utilities/image-upload) or a [generated image](/docs/en/image-inference/api-reference).
        - A data URI string representing the image. The data URI must be in the format `data:<mediaType>;base64,` followed by the base64-encoded image. For example: `data:image/png;base64,iVBORw0KGgo...`.
        - A base64 encoded image without the data URI prefix. For example: `iVBORw0KGgo...`.
        - A URL pointing to the image. The image must be accessible publicly.

        Supported formats are: PNG, JPG and WEBP.

    `acePlusPlus` » `repaintingScale` #### [repaintingScale](https://runware.ai/docs/en/image-inference/api-reference#request-aceplusplus-repaintingscale) float Min: 0 Max: 1 Default: 0
    :   Controls the balance between preserving the original character identity and following the prompt instructions.

        A value of 0.0 gives maximum priority to character identity preservation, while a value of 1.0 gives maximum priority to following the prompt instructions.

        For subtle changes while maintaining strong character resemblance, use lower values.

### [refiner](https://runware.ai/docs/en/image-inference/api-reference#request-refiner) object
:   Refiner models help create higher quality image outputs by incorporating specialized models designed to enhance image details and overall coherence. This can be particularly useful when you need results with superior quality, photorealism, or specific aesthetic refinements. Note that refiner models are only SDXL based.

    The `refiner` parameter is an object that contains properties defining how the refinement process should be configured. You can find the properties of the refiner object below.

      View example 

    ```
    {
      "taskType": "imageInference",
      "taskUUID": "a1b3c3d4-e5f6-7890-abcd-ef1234567890",
      "positivePrompt": "a highly detailed portrait of a wise old wizard with a long beard",
      "model": "civitai:139562@297320",
      "height": 1024,
      "width": 1024,
      "steps": 40,
      "refiner": { 
        "model": "civitai:101055@128080",
        "startStep": 30
      } 
    }
    ```

      Learn more ⁨1⁩ resource 

    - [Text to image: Turning words into pictures with AI](https://runware.ai/docs/en/image-inference/text-to-image#refiner-two-stage-generation)

      GUIDE

       Properties
    ⁨3⁩ properties 

    `refiner` » `model` #### [model](https://runware.ai/docs/en/image-inference/api-reference#request-refiner-model) string required
    :   We make use of the [AIR system](https://github.com/civitai/civitai/wiki/AIR-%E2%80%90-Uniform-Resource-Names-for-AI) to identify refiner models. This identifier is a unique string that represents a specific model. Note that refiner models are only SDXL based.

        You can find the AIR identifier of the refiner model you want to use in our [Model Explorer](https://my.runware.ai/models/all), which is a tool that allows you to search for models based on their characteristics.

        The official SDXL refiner model is `civitai:101055@128080`.

        More information about the AIR system can be found in the [Models page](/docs/en/image-inference/models).

    `refiner` » `startStep` #### [startStep](https://runware.ai/docs/en/image-inference/api-reference#request-refiner-startstep) integer Min: 2 Max: {steps}
    :   Alternative parameters: `refiner.startStepPercentage`.

        Represents the step number at which the refinement process begins. The initial model will generate the image up to this step, after which the refiner model takes over to enhance the result.

        It can take values from `2` (second step) to the number of [steps](#request-steps) specified.

    `refiner` » `startStepPercentage` #### [startStepPercentage](https://runware.ai/docs/en/image-inference/api-reference#request-refiner-startsteppercentage) integer Min: 1 Max: 99
    :   Alternative parameters: `refiner.startStep`.

        Represents the percentage of total steps at which the refinement process begins. The initial model will generate the image up to this percentage of steps before the refiner takes over.

        It can take values from `1` to `99`.

### [embeddings](https://runware.ai/docs/en/image-inference/api-reference#request-embeddings) object[]
:   Embeddings (or Textual Inversion) can be used to add specific concepts or styles to your generations. Multiple embeddings can be used at the same time.

    The `embeddings` parameter is an array of objects. Each object contains properties that define which embedding model to use. You can find the properties of the embeddings object below.

      View example 

    ```
    {
      "taskType": "imageInference",
      "taskUUID": "string",
      "positivePrompt": "string",
      "model": "string",
      "height": int,
      "width": int,
      "numberResults": int,
      "embeddings": [ 
        { 
          "model": "string",
        },
        { 
          "model": "string",
        } 
      ] 
    }
    ```

      Learn more ⁨1⁩ resource 

    - [Text to image: Turning words into pictures with AI](https://runware.ai/docs/en/image-inference/text-to-image#embeddings-custom-concepts)

      GUIDE

       Array items
    ⁨2⁩ properties each 

    `embeddings[]` » `model` #### [model](https://runware.ai/docs/en/image-inference/api-reference#request-embeddings-model) string required
    :   We make use of the [AIR system](/docs/en/image-inference/models#air-system) to identify embeddings models. This identifier is a unique string that represents a specific model.

        You can find the AIR identifier of the embeddings model you want to use in our [Model Explorer](https://my.runware.ai/models/all), which is a tool that allows you to search for models based on their characteristics.

    `embeddings[]` » `weight` #### [weight](https://runware.ai/docs/en/image-inference/api-reference#request-embeddings-weight) float Min: -4 Max: 4 Default: 1
    :   Defines the strength or influence of the embeddings model in the generation process. The value can range from -4 (negative influence) to +4 (maximum influence).

        It is possible to use multiple embeddings at the same time.

        Example:

        ```
        "embeddings": [
          { "model": "civitai:1044536@1172007", "weight": 1.5 },
          { "model": "civitai:993446@1113094", "weight": 0.8 }
        ]
        ```

### [controlNet](https://runware.ai/docs/en/image-inference/api-reference#request-controlnet) object[]
:   With ControlNet, you can provide a guide image to help the model generate images that align with the desired structure. This guide image can be generated with our [ControlNet preprocessing tool](/docs/en/tools/controlnet-preprocess), extracting guidance information from an input image. The guide image can be in the form of an edge map, a pose, a depth estimation or any other type of control image that guides the generation process via the ControlNet model.

    Multiple ControlNet models can be used at the same time to provide different types of guidance information to the model.

    The `controlNet` parameter is an array of objects. Each object contains properties that define the configuration for a specific ControlNet model. You can find the properties of the ControlNet object below.

      View example 

    ```
    {
      "taskType": "imageInference",
      "taskUUID": "string",
      "positivePrompt": "string",
      "model": "string",
      "height": int,
      "width": int,
      "numberResults": int,
      "controlNet": [ 
        { 
          "model": "string",
          "guideImage": "string",
          "weight": float,
          "startStep": int,
          "endStep": int,
          "controlMode": "string"
        },
        { 
          "model": "string",
          "guideImage": "string",
          "weight": float,
          "startStep": int,
          "endStep": int,
          "controlMode": "string"
        } 
      ] 
    }
    ```

      Learn more ⁨2⁩ resources 

    - [Creating consistent gaming assets with ControlNet Canny](https://runware.ai/blog/creating-consistent-gaming-assets-with-controlnet-canny#controlnet-and-edge-detection)

      ARTICLE
    - [Text to image: Turning words into pictures with AI](https://runware.ai/docs/en/image-inference/text-to-image#controlnet-structural-guidance)

      GUIDE

       Array items
    ⁨8⁩ properties each 

    `controlNet[]` » `model` #### [model](https://runware.ai/docs/en/image-inference/api-reference#request-controlnet-model) string required
    :   For basic/common ControlNet models, you can check the list of available models [here](/docs/en/image-inference/models#basic-controlnet-models).

        For custom or specific ControlNet models, we make use of the [AIR system](https://github.com/civitai/civitai/wiki/AIR-%E2%80%90-Uniform-Resource-Names-for-AI) to identify ControlNet models. This identifier is a unique string that represents a specific model.

        You can find the AIR identifier of the ControlNet model you want to use in our [Model Explorer](https://my.runware.ai/models/all), which is a tool that allows you to search for models based on their characteristics.

        More information about the AIR system can be found in the [Models page](/docs/en/image-inference/models).

    `controlNet[]` » `guideImage` #### [guideImage](https://runware.ai/docs/en/image-inference/api-reference#request-controlnet-guideimage) string required
    :   Specifies the preprocessed image to be used as guide to control the image generation process. The image can be specified in one of the following formats:

        - An UUID v4 string of a [previously uploaded image](/docs/en/utilities/image-upload) or a [generated image](/docs/en/image-inference/api-reference).
        - A data URI string representing the image. The data URI must be in the format `data:<mediaType>;base64,` followed by the base64-encoded image. For example: `data:image/png;base64,iVBORw0KGgo...`.
        - A base64 encoded image without the data URI prefix. For example: `iVBORw0KGgo...`.
        - A URL pointing to the image. The image must be accessible publicly.

        Supported formats are: PNG, JPG and WEBP.

    `controlNet[]` » `weight` #### [weight](https://runware.ai/docs/en/image-inference/api-reference#request-controlnet-weight) float Min: 0 Max: 1 Default: 1
    :   Represents the strength or influence of this ControlNet model in the generation process. A value of 0 means no influence, while 1 means maximum influence.

    `controlNet[]` » `startStep` #### [startStep](https://runware.ai/docs/en/image-inference/api-reference#request-controlnet-startstep) integer Min: 1 Max: {steps}
    :   Alternative parameters: `controlNet.startStepPercentage`.

        Represents the step number at which the ControlNet model starts to control the inference process.

        It can take values from `1` (first step) to the number of [steps](#request-steps) specified.

          Learn more ⁨1⁩ resource 

        - [Creating consistent gaming assets with ControlNet Canny](https://runware.ai/blog/creating-consistent-gaming-assets-with-controlnet-canny#controlnet-parameters)

          ARTICLE

    `controlNet[]` » `startStepPercentage` #### [startStepPercentage](https://runware.ai/docs/en/image-inference/api-reference#request-controlnet-startsteppercentage) integer Min: 0 Max: 99
    :   Alternative parameters: `controlNet.startStep`.

        Represents the percentage of steps at which the ControlNet model starts to control the inference process.

        It can take values from `0` to `99`.

          Learn more ⁨1⁩ resource 

        - [Creating consistent gaming assets with ControlNet Canny](https://runware.ai/blog/creating-consistent-gaming-assets-with-controlnet-canny#controlnet-parameters)

          ARTICLE

    `controlNet[]` » `endStep` #### [endStep](https://runware.ai/docs/en/image-inference/api-reference#request-controlnet-endstep) integer Min: {startStep + 1} Max: {steps}
    :   Alternative parameters: `controlNet.endStepPercentage`.

        Represents the step number at which the ControlNet preprocessor ends to control the inference process.

        It can take values higher than [startStep](#request-controlnet-startstep) and less than or equal to the number of [steps](#request-steps) specified.

          Learn more ⁨1⁩ resource 

        - [Creating consistent gaming assets with ControlNet Canny](https://runware.ai/blog/creating-consistent-gaming-assets-with-controlnet-canny#controlnet-parameters)

          ARTICLE

    `controlNet[]` » `endStepPercentage` #### [endStepPercentage](https://runware.ai/docs/en/image-inference/api-reference#request-controlnet-endsteppercentage) integer Min: {startStepPercentage + 1} Max: 100
    :   Alternative parameters: `controlNet.endStep`.

        Represents the percentage of steps at which the ControlNet model ends to control the inference process.

        It can take values higher than [startStepPercentage](#request-controlnet-startsteppercentage) and lower than or equal to `100`.

          Learn more ⁨1⁩ resource 

        - [Creating consistent gaming assets with ControlNet Canny](https://runware.ai/blog/creating-consistent-gaming-assets-with-controlnet-canny#controlnet-parameters)

          ARTICLE

    `controlNet[]` » `controlMode` #### [controlMode](https://runware.ai/docs/en/image-inference/api-reference#request-controlnet-controlmode) string
    :   This parameter has 3 options: `prompt`, `controlnet` and `balanced`.

        - `prompt`: Prompt is more important in guiding image generation.
        - `controlnet`: ControlNet is more important in guiding image generation.
        - `balanced`: Balanced operation of prompt and ControlNet.

### [lora](https://runware.ai/docs/en/image-inference/api-reference#request-lora) object[]
:   With LoRA (Low-Rank Adaptation), you can adapt a model to specific styles or features by emphasizing particular aspects of the data. This technique enhances the quality and relevance of generated content and can be especially useful when the output needs to adhere to a specific artistic style or follow particular guidelines.

    Multiple LoRA models can be used simultaneously to achieve different adaptation goals.

    The `lora` parameter is an array of objects. Each object contains properties that define the configuration for a specific LoRA model.

      View example 

    ```
    {
      "taskType": "imageInference",
      "taskUUID": "string",
      "positivePrompt": "string",
      "model": "string",
      "height": int,
      "width": int,
      "lora": [ 
        { 
          "model": "string",
          "weight": float 
        } 
      ] 
    }
    ```

      Learn more ⁨1⁩ resource 

    - [Text to image: Turning words into pictures with AI](https://runware.ai/docs/en/image-inference/text-to-image#loras-style-and-subject-adapters)

      GUIDE

       Array items
    ⁨2⁩ properties each 

    `lora[]` » `model` #### [model](https://runware.ai/docs/en/image-inference/api-reference#request-lora-model) string required
    :   We make use of the [AIR system](https://github.com/civitai/civitai/wiki/AIR-%E2%80%90-Uniform-Resource-Names-for-AI) to identify LoRA models. This identifier is a unique string that represents a specific model.

        You can find the AIR identifier of the LoRA model you want to use in our [Model Explorer](https://my.runware.ai/models/all), which is a tool that allows you to search for models based on their characteristics.

        More information about the AIR system can be found in the [Models page](/docs/en/image-inference/models).

        Example: `civitai:132942@146296`.

    `lora[]` » `weight` #### [weight](https://runware.ai/docs/en/image-inference/api-reference#request-lora-weight) float Min: -4 Max: 4 Default: 1
    :   Defines the strength or influence of the LoRA model in the generation process. The value can range from -4 (negative influence) to +4 (maximum influence).

        Multiple LoRAs can be used simultaneously with different weights to achieve complex adaptations.

          View example 

        ```
        "lora": [
          { "model": "runware:13090@1", "weight": 1.5 },
          { "model": "runware:6638@1", "weight": 0.8 }
        ]
        ```

### [ipAdapters](https://runware.ai/docs/en/image-inference/api-reference#request-ipadapters) object[]
:   IP-Adapters enable image-prompted generation, allowing you to use reference images to guide the style and content of your generations. Multiple IP Adapters can be used simultaneously.

    The `ipAdapters` parameter is an array of objects. Each object contains properties that define which IP-Adapter model to use and how it should influence the generation. You can find the properties of the IP-Adapter object below.

      View example 

    ```
    {
      "taskType": "imageInference",
      "taskUUID": "string",
      "positivePrompt": "string",
      "model": "string",
      "height": int,
      "width": int,
      "numberResults": int,
      "ipAdapters": [ 
        { 
          "model": "string",
          "guideImage": "string",
          "weight": "float",
        },
        { 
          "model": "string",
          "guideImage": "string",
          "weight": "float",
        } 
      ] 
    }
    ```

      Learn more ⁨1⁩ resource 

    - [Image-to-image: The art of AI-powered image transformation](https://runware.ai/docs/en/image-inference/image-to-image#ip-adapters-reference-based-generation)

      GUIDE

       Array items
    ⁨3⁩ properties each 

    `ipAdapters[]` » `model` #### [model](https://runware.ai/docs/en/image-inference/api-reference#request-ipadapters-model) string required
    :   We make use of the [AIR system](/docs/en/image-inference/models#air-system) to identify IP-Adapter models. This identifier is a unique string that represents a specific model.

          Supported models list 

        | AIR ID | Model Name |
        | --- | --- |
        | runware:55@1 | IP Adapter SDXL |
        | runware:55@2 | IP Adapter SDXL Plus |
        | runware:55@3 | IP Adapter SDXL Plus Face |
        | runware:55@4 | IP Adapter SDXL Vit-H |
        | runware:55@5 | IP Adapter SD 1.5 |
        | runware:55@6 | IP Adapter SD 1.5 Plus |
        | runware:55@7 | IP Adapter SD 1.5 Light |
        | runware:55@8 | IP Adapter SD 1.5 Plus Face |
        | runware:55@10 | IP Adapter SD 1.5 Vit-G |

    `ipAdapters[]` » `guideImage` #### [guideImage](https://runware.ai/docs/en/image-inference/api-reference#request-ipadapters-guideimage) string required
    :   Specifies the reference image that will guide the generation process. The image can be specified in one of the following formats:

        - An UUID v4 string of a [previously uploaded image](/docs/en/utilities/image-upload) or a [generated image](/docs/en/image-inference/api-reference).
        - A data URI string representing the image. The data URI must be in the format `data:<mediaType>;base64,` followed by the base64-encoded image. For example: `data:image/png;base64,iVBORw0KGgo...`.
        - A base64 encoded image without the data URI prefix. For example: `iVBORw0KGgo...`.
        - A URL pointing to the image. The image must be accessible publicly.

        Supported formats are: PNG, JPG and WEBP.

    `ipAdapters[]` » `weight` #### [weight](https://runware.ai/docs/en/image-inference/api-reference#request-ipadapters-weight) float Min: 0 Max: 1 Default: 1
    :   Represents the strength or influence of this IP-Adapter in the generation process. A value of 0 means no influence, while 1 means maximum influence.

### [providerSettings](https://runware.ai/docs/en/image-inference/api-reference#request-providersettings) object
:   Contains provider-specific configuration settings that customize the behavior of different AI models and services. Each provider has its own set of parameters that control various aspects of the generation process.

    The `providerSettings` parameter is an object that contains nested objects for each supported provider.

      View example 

    ```
    {
      "taskType": "imageInference",
      "taskUUID": "991e641a-d2a8-4aa3-9883-9d6fe230fff8",
      "positivePrompt": "a beautiful landscape with mountains",
      "model": "bfl:2@2",
      "providerSettings": { 
        "bfl": { 
          "promptUpsampling": true,
          "safetyTolerance": 4,
          "raw": false
        } 
      } 
    }
    ```

       Properties
    ⁨4⁩ properties 

    `providerSettings` » `bfl` #### [bfl](https://runware.ai/docs/en/image-inference/api-reference#request-providersettings-bfl) object
    :   Configuration object for Black Forest Labs (BFL) specific features. BFL models offer advanced prompt processing and content safety controls.

          View example 

        ```
        {
          "taskType": "imageInference",
          "taskUUID": "a770f077-f413-47de-9dac-be0b26a35da6",
          "positivePrompt": "a beautiful landscape at sunset",
          "model": "bfl:1@1",
          "width": 1024,
          "height": 1024,
          "providerSettings": {
            "bfl": {
              "promptUpsampling": true,
              "safetyTolerance": 6
            }
          }
        }
        ```

           Properties
        ⁨3⁩ properties 

        `providerSettings` » `bfl` » `promptUpsampling` ##### [promptUpsampling](https://runware.ai/docs/en/image-inference/api-reference#request-providersettings-bfl-promptupsampling) boolean Default: false
        :   Enables automatic enhancement and expansion of the input prompt to improve generation quality and detail.

            When enabled, BFL's prompt upsampling system analyzes your text description and adds relevant details and descriptive elements that enhance the final output without changing the core intent of your prompt.

        `providerSettings` » `bfl` » `safetyTolerance` ##### [safetyTolerance](https://runware.ai/docs/en/image-inference/api-reference#request-providersettings-bfl-safetytolerance) integer Min: 0 Max: 6 Default: 2
        :   Controls the tolerance level for input and output content moderation. Lower values apply stricter content filtering, while higher values are more permissive. Range from 0 (most strict) to 6 (least strict).

        `providerSettings` » `bfl` » `raw` ##### [raw](https://runware.ai/docs/en/image-inference/api-reference#request-providersettings-bfl-raw) boolean Default: false
        :   Controls the level of post-processing applied to generated images.

            When enabled, the raw mode produces images that are closer to the model's direct output without additional processing layers. This can result in more natural-looking images but may sacrifice some visual polish and consistency that post-processing typically provides.

    `providerSettings` » `bytedance` #### [bytedance](https://runware.ai/docs/en/image-inference/api-reference#request-providersettings-bytedance) object
    :   Configuration object for ByteDance-specific image generation settings. These parameters provide access to specialized features and controls available across ByteDance's image generation models.

          View example 

        ```
        "providerSettings": {
          "bytedance": { 
            "maxSequentialImages": 4
          } 
        }
        ```

           Properties
        ⁨1⁩ property 

        `providerSettings` » `bytedance` » `maxSequentialImages` ##### [maxSequentialImages](https://runware.ai/docs/en/image-inference/api-reference#request-providersettings-bytedance-maxsequentialimages) integer Min: 1 Max: 15
        :   Specifies the maximum number of sequential images to generate in a single request. This parameter enables the creation of coherent image sequences, making it ideal for storyboard development or comic creation.

            The model will attempt to generate up to the specified number of images while maintaining visual consistency and thematic coherence across the sequence. Each image builds upon the previous ones to create a unified narrative flow.

            The combined total of reference images plus sequential images cannot exceed 15. For example, if you use 5 reference images, you can request a maximum of 10 sequential images.

            The model may generate fewer images than requested depending on prompt complexity and generation context. The actual number of output images is determined by the model's assessment of narrative coherence and visual quality.

    `providerSettings` » `ideogram` #### [ideogram](https://runware.ai/docs/en/image-inference/api-reference#request-providersettings-ideogram) object
    :   Configuration object for Ideogram-specific image generation settings and controls. These parameters provide access to specialized features including rendering speed optimization, prompt enhancement, style controls, and advanced editing capabilities.

          View example 

        ```
        {
          "taskType": "imageInference",
          "taskUUID": "a770f077-f413-47de-9dac-be0b26a35da6",
          "positivePrompt": "A vintage coffee shop sign with beautiful typography",
          "model": "ideogram:4@1",
          "width": 1024,
          "height": 1024,
          "providerSettings": {
            "ideogram": {
              "renderingSpeed": "QUALITY",
              "magicPrompt": "AUTO",
              "styleType": "DESIGN"
            }
          }
        }
        ```

           Properties
        ⁨8⁩ properties 

        `providerSettings` » `ideogram` » `renderingSpeed` ##### [renderingSpeed](https://runware.ai/docs/en/image-inference/api-reference#request-providersettings-ideogram-renderingspeed) string Default: DEFAULT
        :   Controls the rendering speed and quality balance for image generation. Higher quality settings take longer but produce more refined results.

            **Available values:**

            - `TURBO`: Fastest generation with good quality (available for all models).
            - `DEFAULT`: Balanced speed and quality (available for all models).
            - `QUALITY`: Highest quality with slower generation (3.0 models only).

        `providerSettings` » `ideogram` » `magicPrompt` ##### [magicPrompt](https://runware.ai/docs/en/image-inference/api-reference#request-providersettings-ideogram-magicprompt) string Default: AUTO
        :   Controls automatic prompt enhancement to improve generation quality and detail.

            **Available values:**

            - `AUTO`: Automatically determines whether to enhance the prompt based on content.
            - `ON`: Always enhances the input prompt with additional descriptive details.
            - `OFF`: Uses the prompt exactly as provided without enhancement.

        `providerSettings` » `ideogram` » `styleType` ##### [styleType](https://runware.ai/docs/en/image-inference/api-reference#request-providersettings-ideogram-styletype) string Default: AUTO
        :   Specifies the visual style and rendering approach for the generated image.

            **Available values for 3.0 models:**

            - `AUTO`: Automatically selects the most appropriate style.
            - `GENERAL`: Versatile style suitable for most content types.
            - `REALISTIC`: Photorealistic rendering with natural lighting and textures.
            - `DESIGN`: Optimized for graphic design, logos, and typography.
            - `FICTION`: Stylized rendering for fictional and fantasy content.

            **Available values for 1.0/2.0/2a models:**

            - `AUTO`: Automatically selects the most appropriate style.
            - `GENERAL`: Versatile style suitable for most content types.
            - `REALISTIC`: Photorealistic rendering with natural lighting and textures.
            - `DESIGN`: Optimized for graphic design, logos, and typography.
            - `RENDER_3D`: Three-dimensional rendering style with depth and modeling effects.
            - `ANIME`: Animated style with characteristic anime/manga visual elements.
            - `FICTION`: Stylized rendering for fictional and fantasy content.

        `providerSettings` » `ideogram` » `styleReferenceImages` ##### [styleReferenceImages](https://runware.ai/docs/en/image-inference/api-reference#request-providersettings-ideogram-stylereferenceimages) string[] Max: 4
        :   An array of reference images used to guide the visual style and aesthetic of the generated content. These images influence the overall look, color palette, and artistic approach without directly copying content.

            Supports 1-4 reference images.

            Each image can be specified in one of the following formats:

            - An UUID v4 string of a previously uploaded image or a generated image.
            - A data URI string representing the image. The data URI must be in the format `data:<mediaType>;base64,` followed by the base64-encoded image. For example: `data:image/png;base64,iVBORw0KGgo...`.
            - A base64 encoded image without the data URI prefix. For example: `iVBORw0KGgo...`.
            - A URL pointing to the image. The image must be accessible publicly.

            Supported formats are: PNG, JPG and WEBP.

            Style reference images work in combination with the `styleType` parameter to achieve the desired aesthetic.

        `providerSettings` » `ideogram` » `remixStrength` ##### [remixStrength](https://runware.ai/docs/en/image-inference/api-reference#request-providersettings-ideogram-remixstrength) integer Min: 1 Max: 100 Default: 50
        :   Controls the intensity of transformation when using Remix models. Higher values create more dramatic changes while lower values preserve more of the original image characteristics.

        `providerSettings` » `ideogram` » `stylePreset` ##### [stylePreset](https://runware.ai/docs/en/image-inference/api-reference#request-providersettings-ideogram-stylepreset) string
        :   Applies a predefined artistic style preset to guide the visual aesthetic and rendering approach of the generated image.

            This parameter is only available for 3.0 models (ideogram:4@1, ideogram:4@2, ideogram:4@3, ideogram:4@4, ideogram:4@5).

            **Available values**:

            `80S_ILLUSTRATION`, `90S_NOSTALGIA`, `ABSTRACT_ORGANIC`, `ANALOG_NOSTALGIA`, `ART_BRUT`, `ART_DECO`, `ART_POSTER`, `AURA`, `AVANT_GARDE`, `BAUHAUS`, `BLUEPRINT`, `BLURRY_MOTION`, `BRIGHT_ART`, `C4D_CARTOON`, `CHILDRENS_BOOK`, `COLLAGE`, `COLORING_BOOK_I`, `COLORING_BOOK_II`, `CUBISM`, `DARK_AURA`, `DOODLE`, `DOUBLE_EXPOSURE`, `DRAMATIC_CINEMA`, `EDITORIAL`, `EMOTIONAL_MINIMAL`, `ETHEREAL_PARTY`, `EXPIRED_FILM`, `FLAT_ART`, `FLAT_VECTOR`, `FOREST_REVERIE`, `GEO_MINIMALIST`, `GLASS_PRISM`, `GOLDEN_HOUR`, `GRAFFITI_I`, `GRAFFITI_II`, `HALFTONE_PRINT`, `HIGH_CONTRAST`, `HIPPIE_ERA`, `ICONIC`, `JAPANDI_FUSION`, `JAZZY`, `LONG_EXPOSURE`, `MAGAZINE_EDITORIAL`, `MINIMAL_ILLUSTRATION`, `MIXED_MEDIA`, `MONOCHROME`, `NIGHTLIFE`, `OIL_PAINTING`, `OLD_CARTOONS`, `PAINT_GESTURE`, `POP_ART`, `RETRO_ETCHING`, `RIVIERA_POP`, `SPOTLIGHT_80S`, `STYLIZED_RED`, `SURREAL_COLLAGE`, `TRAVEL_POSTER`, `VINTAGE_GEO`, `VINTAGE_POSTER`, `WATERCOLOR`, `WEIRD`, `WOODBLOCK_PRINT`.

        `providerSettings` » `ideogram` » `styleCode` ##### [styleCode](https://runware.ai/docs/en/image-inference/api-reference#request-providersettings-ideogram-stylecode) string
        :   An 8-character hexadecimal code that applies a specific predefined style to the generation. This provides an alternative way to control visual aesthetics beyond the standard style types.

            Available only for specific 3.0 models (ideogram:4@2, ideogram:4@3, ideogram:4@4, ideogram:4@5).

            Cannot be used together with `styleType` or `referenceImages` parameters.

        `providerSettings` » `ideogram` » `colorPalette` ##### [colorPalette](https://runware.ai/docs/en/image-inference/api-reference#request-providersettings-ideogram-colorpalette) object
        :   Defines a color palette for generation using either preset color schemes or custom color combinations with optional weights.

            This parameter is only available for Ideogram 2.0 (`ideogram:3@1`).

            **Object properties:**

            - `name` (string, optional): Preset color palette name. Available values: `EMBER`, `FRESH`, `JUNGLE`, `MAGIC`, `MELON`, `MOSAIC`, `PASTEL`, `ULTRAMARINE`.
            - `members` (array, optional): Custom color palette with hex colors and optional weights.

            **Members array objects:**

            - `colorHex` (string, required): Hexadecimal color code (e.g., `#FF5733` or `#F73`).
            - `colorWeight` (number, optional): Color influence weight between 0.05 and 1.0. Weights should descend from highest to lowest.

            Preset palette

            ```
            "colorPalette": {
              "name": "EMBER"
            }
            ```

             Custom palette

            ```
            "colorPalette": {
              "members": [
                {
                  "colorHex": "#FF5733",
                  "colorWeight": 1.0
                },
                {
                  "colorHex": "#C70039",
                  "colorWeight": 0.7
                },
                {
                  "colorHex": "#900C3F",
                  "colorWeight": 0.3
                }
              ]
            }
            ```

             Custom without weights

            ```
            "colorPalette": {
              "members": [
                {
                  "colorHex": "#3498DB"
                },
                {
                  "colorHex": "#2ECC71"
                },
                {
                  "colorHex": "#F39C12"
                }
              ]
            }
            ```

    `providerSettings` » `bria` [bria](https://runware.ai/docs/en/image-inference/api-reference#request-providersettings-bria) object
    :   Configuration object for Bria-specific features and controls. Bria models offer enterprise-safe AI with built-in content moderation, IP protection, and licensed training data for commercial use.

          View example 

        ```
        {
          "taskType": "imageInference",
          "taskUUID": "a770f077-f413-47de-9dac-be0b26a35da6",
          "positivePrompt": "Professional product photography",
          "model": "bria:10@1",
          "width": 1024,
          "height": 1024,
          "providerSettings": {
            "bria": {
              "promptEnhancement": true,
              "enhanceImage": true,
              "contentModeration": true,
              "ipSignal": true
            }
          }
        }
        ```

           Properties
        ⁨6⁩ properties 

        `providerSettings` » `bria` » `promptEnhancement` [promptEnhancement](https://runware.ai/docs/en/image-inference/api-reference#request-providersettings-bria-promptenhancement) boolean Default: false
        :   Enhances the input prompt with descriptive variations and additional details for more creative and varied outputs. When enabled, the system expands the prompt while maintaining the original intent.

        `providerSettings` » `bria` » `medium` [medium](https://runware.ai/docs/en/image-inference/api-reference#request-providersettings-bria-medium) "photography" | "art"
        :   Specifies the artistic medium or style category for generation, influencing the overall aesthetic and rendering approach.

            **Available values:**

            - `photography`: Optimizes for photorealistic imagery with natural lighting and textures.
            - `art`: Optimizes for artistic interpretations with stylized rendering and creative expression.

        `providerSettings` » `bria` » `enhanceImage` [enhanceImage](https://runware.ai/docs/en/image-inference/api-reference#request-providersettings-bria-enhanceimage) boolean Default: false
        :   Generates images with richer details and sharper textures by applying additional enhancement processing to the output. This improves overall visual quality and clarity.

        `providerSettings` » `bria` » `promptContentModeration` [promptContentModeration](https://runware.ai/docs/en/image-inference/api-reference#request-providersettings-bria-promptcontentmoderation) boolean Default: true
        :   Scans the input prompt for NSFW or restricted terms before generation begins. When enabled, requests with flagged content are rejected before processing to ensure safe commercial use.

        `providerSettings` » `bria` » `contentModeration` [contentModeration](https://runware.ai/docs/en/image-inference/api-reference#request-providersettings-bria-contentmoderation) boolean Default: true
        :   Applies content moderation to both input visuals and generated outputs, ensuring all content meets safety standards for commercial use. Flagged content results in request rejection.

        `providerSettings` » `bria` » `ipSignal` [ipSignal](https://runware.ai/docs/en/image-inference/api-reference#request-providersettings-bria-ipsignal) boolean Default: false
        :   Flags potential intellectual property-related content in the prompt or generated output. When enabled, helps identify potential IP conflicts before commercial use.

## [Response](#response)

All inference operations return a consistent response format. Results arrive as they complete due to parallel processing.

```
{
  "data": [
    {
      "taskType": "imageInference",
      "taskUUID": "a770f077-f413-47de-9dac-be0b26a35da6",
      "imageUUID": "77da2d99-a6d3-44d9-b8c0-ae9fb06b6200",
      "imageURL": "https://im.runware.ai/image/ws/0.5/ii/a770f077-f413-47de-9dac-be0b26a35da6.jpg",
      "cost": 0.0013
    }
  ]
}
```

---

### [taskType](https://runware.ai/docs/en/image-inference/api-reference#response-tasktype) string
:   The API will return the `taskType` you sent in the request. In this case, it will be `imageInference`. This helps match the responses to the correct task type.

### [taskUUID](https://runware.ai/docs/en/image-inference/api-reference#response-taskuuid) string UUID v4
:   The API will return the `taskUUID` you sent in the request. This way you can match the responses to the correct request tasks.

### [imageUUID](https://runware.ai/docs/en/image-inference/api-reference#response-imageuuid) string UUID v4
:   A unique identifier for the output image. This UUID can be used to reference the image in subsequent operations or for tracking purposes.

    The `imageUUID` is different from the `taskUUID`. While `taskUUID` identifies the request, `imageUUID` identifies the specific image output.

### [imageURL](https://runware.ai/docs/en/image-inference/api-reference#response-imageurl) string
:   If `outputType` is set to `URL`, this parameter contains the URL of the image to be downloaded.

### [imageBase64Data](https://runware.ai/docs/en/image-inference/api-reference#response-imagebase64data) string
:   If `outputType` is set to `base64Data`, this parameter contains the base64-encoded image data.

### [imageDataURI](https://runware.ai/docs/en/image-inference/api-reference#response-imagedatauri) string
:   If `outputType` is set to `dataURI`, this parameter contains the data URI of the image.

### [seed](https://runware.ai/docs/en/image-inference/api-reference#response-seed) integer
:   The seed value that was used to generate this image. This value can be used to reproduce the same image when using identical parameters in another request.

### [NSFWContent](https://runware.ai/docs/en/image-inference/api-reference#response-nsfwcontent) boolean
:   If [safety](#request-safety) parameter is used, `NSFWContent` is included informing if the image has been flagged as potentially sensitive content.

    - `true` indicates the image has been flagged (is a sensitive image).
    - `false` indicates the image has not been flagged.

    The filter occasionally returns false positives and very rarely false negatives.

### [cost](https://runware.ai/docs/en/image-inference/api-reference#response-cost) float
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