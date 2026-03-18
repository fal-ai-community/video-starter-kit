---
title: PhotoMaker API
source_url: https://runware.ai/docs/en/image-inference/photomaker
fetched_at: 2025-10-27 03:51:30
---

## [Introduction](#introduction)

PhotoMaker is a powerful image generation technology that enables **instant subject personalization** without the need for additional training. By providing up to four reference images, you can generate new images that **maintain subject fidelity** while applying various styles and compositions. This innovative approach offers a perfect balance between preserving the subject's identity and allowing creative freedom in generating new scenarios and styles.

## [Key features](#key-features)

- **Instant Personalization**: Transform subjects into new scenes and styles within seconds, with no additional training required.
- **High Fidelity**: Maintains impressive subject consistency using up to 4 reference images.
- **Style Flexibility**: Supports various artistic styles while preserving subject identity.
- **Text Controllability**: Precise control over the final output through detailed text prompts.
- **Strength Control**: Discover the perfect balance between original subject features and creative transformation.

## [How it works](#how-it-works)

PhotoMaker leverages advanced AI technology to analyze up to four reference images of your subject, creating a comprehensive understanding of their key identifying features and characteristics. This initial analysis forms the foundation for **maintaining consistent subject appearance** throughout the generation process.

Using your provided text prompt as guidance, PhotoMaker then generates new images that seamlessly **blend the subject's identity with your desired style settings**. The strength parameter allows you to fine-tune this balance.

To achieve optimal results with PhotoMaker:

- Use up to 4 clear reference images of your subject, preferably with good lighting.
- Avoid using heavily filtered or edited images as references, as they may affect the quality of the output.
- Write specific prompts describing desired scene and composition.
- Start with `No style` for maximum subject fidelity, then experiment with different styles and strength values to find the perfect balance.

## [Request](#request)

Our API always accepts an array of objects as input, where each object represents a **specific task to be performed**. The structure of the object varies depending on the type of the task. For this section, we will focus on the parameters related to **PhotoMaker task**.

The following JSON snippets shows the basic structure of a request object. **All properties are explained in detail in the next section**.

```
[
  {
    "taskType": "photoMaker",
    "taskUUID": "string",
    "inputImages": ["string"],
    "style": "string",
    "strength": int,
    "positivePrompt": "string",
    "height": int,
    "width": int,
    "scheduler": "string",
    "steps": int,
    "CFGScale": float,
    "outputFormat": "string",
    "includeCost": boolean,
    "numberResults": int
  }
]
```

### [taskType](https://runware.ai/docs/en/image-inference/photomaker#request-tasktype) string required
:   The type of task to be performed. For this task, the value should be `photoMaker`.

### [taskUUID](https://runware.ai/docs/en/image-inference/photomaker#request-taskuuid) string required UUID v4
:   When a task is sent to the API you must include a random UUID v4 string using the `taskUUID` parameter. This string is used to match the async responses to their corresponding tasks.

    If you send multiple tasks at the same time, the `taskUUID` will help you match the responses to the correct tasks.

    The `taskUUID` must be unique for each task you send to the API.

### [outputType](https://runware.ai/docs/en/image-inference/photomaker#request-outputtype) "base64Data" | "dataURI" | "URL" Default: URL
:   Specifies the output type in which the image is returned. Supported values are: `dataURI`, `URL`, and `base64Data`.

    - `base64Data`: The image is returned as a base64-encoded string using the `imageBase64Data` parameter in the response object.
    - `dataURI`: The image is returned as a data URI string using the `imageDataURI` parameter in the response object.
    - `URL`: The image is returned as a URL string using the `imageURL` parameter in the response object.

### [outputFormat](https://runware.ai/docs/en/image-inference/photomaker#request-outputformat) "JPG" | "PNG" | "WEBP" Default: JPG
:   Specifies the format of the output image. Supported formats are: `PNG`, `JPG` and `WEBP`.

### [outputQuality](https://runware.ai/docs/en/image-inference/photomaker#request-outputquality) integer Min: 20 Max: 99 Default: 95
:   Sets the compression quality of the output image. Higher values preserve more quality but increase file size, lower values reduce file size but decrease quality.

### [webhookURL](https://runware.ai/docs/en/image-inference/photomaker#request-webhookurl) string
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

### [deliveryMethod](https://runware.ai/docs/en/image-inference/photomaker#request-deliverymethod) "sync" | "async" required Default: sync
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

### [uploadEndpoint](https://runware.ai/docs/en/image-inference/photomaker#request-uploadendpoint) string
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

### [safety](https://runware.ai/docs/en/image-inference/photomaker#request-safety) object
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

    `safety` » `checkContent` #### [checkContent](https://runware.ai/docs/en/image-inference/photomaker#request-safety-checkcontent) boolean Default: false
    :   Simple toggle for enabling content safety checking. When enabled, defaults to `fast` mode for optimal performance while maintaining content safety.

        This provides an easy way to enable safety checking without needing to specify detailed mode configurations.

    `safety` » `mode` #### [mode](https://runware.ai/docs/en/image-inference/photomaker#request-safety-mode) "none" | "fast" | "full" Default: none
    :   Advanced control over safety checking intensity and coverage for content moderation.

        **Available values**:

        - `none`: No content safety checking performed.
        - `fast`: Check first, middle, and last frames (video) or single check (images).
        - `full`: Check all frames in video content, adds slight processing delay.

        When both `checkContent` and `mode` are specified, the `mode` parameter takes precedence over the `checkContent` setting.

### [ttl](https://runware.ai/docs/en/audio-inference/api-reference#request-ttl) integer Min: 60
:   Specifies the time-to-live (TTL) in seconds for generated content when using URL output. This determines how long the generated content will be available at the provided URL before being automatically deleted.

    This parameter only takes effect when `outputType` is set to `"URL"`. It has no effect on other output types.

### [includeCost](https://runware.ai/docs/en/image-inference/photomaker#request-includecost) boolean Default: false
:   If set to `true`, the cost to perform the task will be included in the response object.

### [inputImages](https://runware.ai/docs/en/image-inference/photomaker#request-inputimages) string[] required Min: 1 Max: 4
:   Specifies the input images that will be used as reference for the subject. These reference images help the AI to maintain identity consistency during the generation process. Each input image must contain a single, clear face of the subject. The image can be specified in one of the following formats:

    - An UUID v4 string of a [previously uploaded image](/docs/en/utilities/image-upload) or a generated image.
    - A data URI string representing the image. The data URI must be in the format `data:<mediaType>;base64,` followed by the base64-encoded image. For example: `data:image/png;base64,iVBORw0KGgo...`.
    - A base64 encoded image without the data URI prefix. For example: `iVBORw0KGgo...`.
    - A URL pointing to the image. The image must be accessible publicly.

    Supported formats are: PNG, JPG and WEBP.

### [style](https://runware.ai/docs/en/image-inference/photomaker#request-style) string Default: No Style
:   Specifies the artistic style to be applied to the generated images. Currently supported values are:

    - `No style`: Maximizes subject fidelity while allowing creative freedom in the composition.
    - `Cinematic`: Applies a movie-like aesthetic.
    - `Disney Character`: Transforms the subject into a Disney-inspired character.
    - `Digital Art`: Creates a digital artwork style.
    - `Photographic`: Enhances photographic qualities.
    - `Fantasy art`: Applies fantasy-themed artistic elements.
    - `Neonpunk`: Creates a neon-colored cyberpunk aesthetic.
    - `Enhance`: Improves overall image quality.
    - `Comic book`: Transforms the subject into comic book style.
    - `Lowpoly`: Creates a low-polygon geometric style.
    - `Line art`: Converts the image into line drawing style.

### [strength](https://runware.ai/docs/en/image-inference/photomaker#request-strength) integer Min: 15 Max: 50 Default: 15
:   Controls the balance between preserving the subject's original features and the creative transformation specified in the prompt.

    - Lower values provide stronger subject fidelity.
    - Higher values allow more creative freedom in the transformation.

### [positivePrompt](https://runware.ai/docs/en/image-inference/photomaker#request-positiveprompt) string required
:   A positive prompt is a text instruction to guide the model on generating the image. It is usually a sentence or a paragraph that provides positive guidance for the task. This parameter is essential to shape the desired results. There is a limit of 77 tokens (approximately 60 words / 300 characters).

    The trigger word `rwre` can be included anywhere in your prompt. If not included, it will be automatically prepended to your prompt. This trigger word is required to activate PhotoMaker's specific features for personalized image generation and its position within the prompt influences the strength of its effect. Placing it at the start maximizes its impact.

    **Without trigger word**:

    ```
    # Your prompt:
    "wearing a suit, professional photo"

    # System will prepend the trigger word:
    "rwre, wearing a suit, professional photo"
    ```

    **With trigger word**:

    ```
    # Placement preserved
    "wearing a suit, rwre, professional photo"
    ```

    The length of the prompt must be between 2 and 300 characters.

### [negativePrompt](https://runware.ai/docs/en/image-inference/api-reference#request-negativeprompt) string
:   A negative prompt is a text instruction to guide the model on generating the image. It is usually a sentence or a paragraph that provides negative guidance for the task. This parameter helps to avoid certain undesired results.

    For example, if the negative prompt is "red dragon, cup", the model will follow the positive prompt but will avoid generating an image of a red dragon or including a cup. The more detailed the prompt, the more accurate the results.

    The length of the prompt must be between 2 and 3000 characters.

      Learn more ⁨1⁩ resource 

    - [Text to image: Turning words into pictures with AI](https://runware.ai/docs/en/image-inference/text-to-image#prompts-guiding-the-generation)

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

### [model](https://runware.ai/docs/en/image-inference/photomaker#request-model) string required
:   We make use of the [AIR](/docs/en/image-inference/models#air-system) (Artificial Intelligence Resource) system to identify models. This identifier is a unique string that represents a specific model.

    You can find models in our [Model Explorer](https://my.runware.ai/models/all) which is a tool that allows you to search for models based on their characteristics.

    PhotoMaker requires SDXL-based models.

      View recommended models 

    | AIR ID | Name | Version |
    | --- | --- | --- |
    | civitai:139562@344487 | RealVisXL | V4.0 (BakedVAE) |
    | civitai:101055@128078 | SDXL | v1.0 VAE fix |
    | civitai:112902@126688 | DreamShaper XL | alpha2 (xl1.0) |
    | civitai:133005@288982 | Juggernaut XL | V 8 + RunDiffusion |
    | civitai:133005@782002 | Juggernaut XL | Jugg\_XI\_by\_RunDiffusion |
    | civitai:133005@456194 | Juggernaut XL | Jugg\_X\_by RunDiffusion |
    | civitai:133005@240840 | Juggernaut XL | V 7 + RunDiffusion |
    | civitai:133005@198530 | Juggernaut XL | Version 6 + RunDiffusion |
    | civitai:133005@348913 | Juggernaut XL | V9 + RunDiffusionPhoto 2 |
    | civitai:152525@293240 | Realism Engine SDXL | v3.0 VAE |
    | civitai:133005@471120 | Juggernaut XL | Jugg\_X\_RunDiffusion\_Hyper |

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

### [numberResults](https://runware.ai/docs/en/image-inference/api-reference#request-numberresults) integer Min: 1 Max: 20 Default: 1
:   Specifies how many images to generate for the given parameters. Each image will have the same parameters but different seeds, resulting in variations of the same concept.

## [Response](#response)

Results will be delivered in the format below. It's possible to receive one or multiple images per message. This is due to the fact that images are generated in parallel, and generation time varies across nodes or the network.

```
{
  "data": [
    {
      "taskType": "photoMaker",
      "taskUUID": "a770f077-f413-47de-9dac-be0b26a35da6",
      "imageUUID": "77da2d99-a6d3-44d9-b8c0-ae9fb06b6200",
      "imageURL": "https://im.runware.ai/image/ws/0.5/ii/a770f077-f413-47de-9dac-be0b26a35da6.jpg",
      "seed": 7532114250969985124,
      "cost": 0.0013
    }
  ]
}
```

### [taskType](https://runware.ai/docs/en/image-inference/photomaker#response-tasktype) string
:   The API will return the `taskType` you sent in the request. In this case, it will be `photoMaker`. This helps match the responses to the correct task type.

### [taskUUID](https://runware.ai/docs/en/image-inference/photomaker#response-taskuuid) string UUID v4
:   The API will return the `taskUUID` you sent in the request. This way you can match the responses to the correct request tasks.

### [inputImagesUUID](https://runware.ai/docs/en/image-inference/photomaker#response-inputimagesuuid) string[] UUID v4
:   An array containing the unique identifiers of the original images used as input for the PhotoMaker task.

### [imageUUID](https://runware.ai/docs/en/image-inference/photomaker#response-imageuuid) string UUID v4
:   A unique identifier for the output image. This UUID can be used to reference the image in subsequent operations or for tracking purposes.

    The `imageUUID` is different from the `taskUUID`. While `taskUUID` identifies the request, `imageUUID` identifies the specific image output.

### [imageURL](https://runware.ai/docs/en/image-inference/photomaker#response-imageurl) string
:   If `outputType` is set to `URL`, this parameter contains the URL of the image to be downloaded.

### [imageBase64Data](https://runware.ai/docs/en/image-inference/photomaker#response-imagebase64data) string
:   If `outputType` is set to `base64Data`, this parameter contains the base64-encoded image data.

### [imageDataURI](https://runware.ai/docs/en/image-inference/photomaker#response-imagedatauri) string
:   If `outputType` is set to `dataURI`, this parameter contains the data URI of the image.

### [seed](https://runware.ai/docs/en/image-inference/photomaker#response-seed) integer
:   The seed value used for generating the image. Even when not specified in the request (random seed), this value is returned to allow reproducing the same image in future requests.

    If multiple images were generated (`numberResults` > 1), each image will have its own seed value, incremented by 1 from the initial seed.

### [NSFWContent](https://runware.ai/docs/en/image-inference/photomaker#response-nsfwcontent) boolean
:   If [safety](#request-safety) parameter is used, `NSFWContent` is included informing if the image has been flagged as potentially sensitive content.

    - `true` indicates the image has been flagged (is a sensitive image).
    - `false` indicates the image has not been flagged.

    The filter occasionally returns false positives and very rarely false negatives.

### [cost](https://runware.ai/docs/en/image-inference/photomaker#response-cost) float
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