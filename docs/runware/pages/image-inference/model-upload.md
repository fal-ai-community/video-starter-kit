---
title: Model Upload API
source_url: https://runware.ai/docs/en/image-inference/model-upload
fetched_at: 2025-10-27 03:51:27
---

## [Introduction](#introduction)

The Model Upload API enables you to integrate your **custom models** into the Runware platform, expanding the capabilities of your image generation pipeline. This feature is particularly valuable for teams that have **developed or fine-tuned their own models** and want to seamlessly incorporate them into their workflow.

## [Key features](#key-features)

- **Custom Model Integration**: Upload your own base checkpoints, LoRAs, ControlNet models or any other type of image generation models.
- **AIR System Integration**: Automatically assign [AIR identifiers](/docs/en/image-inference/models#air-system) to your uploaded models for easy reference and management.
- **Visibility Control**: Choose between public models accessible to all users or private models limited to your team/organization.
- **Version Management**: Support for multiple versions of the same model with different weights or distinct configurations.
- **Automatic Optimization**: Models are automatically optimized for our Sonic Inference Engine® upon upload. This optimization enhances speed and efficiency without compromising the model's output quality or results.
- **Enhanced Organization**: Add descriptions, comments, and tags to make your models easily discoverable and manageable.

## [Model categories and formats](#model-categories-and-formats)

Our platform supports various types of models to suit different needs:

- **Base checkpoint models**: We support multiple architectures including Stable Diffusion (1.x, 2.x, XL, 3.x), FLUX, and other cutting-edge image generation architectures.
- **LoRA Models**: Low-Rank Adaptation models for style and concept fine-tuning.
- **ControlNet Models**: Specialized models for controlled image generation.

## [Storage and availability](#storage-and-availability)

Once uploaded to our platform, **models are immediately processed and optimized by our infrastructure**. They are then **distributed across our global network of servers** to ensure optimal performance and low-latency access from any location. Our system automatically handles backups and maintains **high availability** through redundant storage.

Inference requests are automatically routed to the nearest available server. If a model hasn't been used recently, the initial requests may take slightly longer while the model is loaded into memory. Once loaded, subsequent requests will deliver optimal performance.

## [Privacy and security](#privacy-and-security)

We prioritize the protection of your intellectual property through robust security measures. All models are stored using **enterprise-grade encryption** to ensure data safety.

Access to models is strictly controlled through your API keys, and you have **complete control over model visibility**.

You can choose to make your models public, making them accessible to all platform users, or keep them private, **restricting access to only your team or organization**.

## [Storage Pricing (Beta)](#storage-pricing-beta)

Model upload features are currently in Beta and completely free of charge. During this period, there are no costs associated with uploading or storing models.

After the Beta period, storage will be charged at **$0.05 per GB per month**, with storage **rounded up to the nearest GB**. These charges will be calculated daily and deducted from your account credits.

Please note that we will not retroactively charge for any storage used during the Beta period.

### [Daily Cost Calculation](#daily-cost-calculation)

Storage costs are calculated daily using this formula:

```
Daily Cost = (Rounded Storage in GB) * $0.05 / 30 (days)
```

For example:

- 200 MB (rounds to 1 GB) = $0.0017 per day.
- 2.3 GB (rounds to 3 GB) = $0.0050 per day.
- 9.7 GB (rounds to 10 GB) = $0.0167 per day.
- 10.4 GB (rounds to 11 GB) = $0.0183 per day.

All storage charges appear as detailed line items on the Usage page, such as "Daily model storage (1 GB)".

### [Account Policies](#account-policies)

A positive credit balance is required to upload new models. Uploads will be restricted if the account balance is insufficient to cover storage charges.

Unpaid storage charges exceeding 90 days may result in model deletion. This action would only be performed manually if necessary and would always be preceded by email notifications.

## [Request](#request)

Our API always accepts an array of objects as input, where each object represents a **specific task to be performed**. The structure of the object varies depending on the type of the task. For this section, we will focus on the parameters related to **model upload task**.

The following JSON snippets shows the basic structure of a request object, with the specific properties for each model category highlighted in the code block. **All properties are explained in detail in the next section**.

Upload Checkpoint

```
[
  {
    "taskType": "modelUpload",
    "taskUUID": "string",
    "category": "checkpoint",
    "type": "string",
    "architecture": "string",
    "format": "string",
    "air": "string",
    "uniqueIdentifier": "string",
    "name": "string",
    "version": "string",
    "downloadURL": "string",
    "defaultScheduler": "string",
    "defaultSteps": int,
    "defaultCFG": float,
    "defaultStrength": float,
    "private": boolean,
    "heroImageURL": "string",
    "tags": ["string"],
    "shortDescription": "string",
    "comment": "string"
  }
]
```

 Upload LoRA

```
[
  {
    "taskType": "modelUpload",
    "taskUUID": "string",
    "category": "lora",
    "architecture": "string",
    "format": "string",
    "air": "string",
    "uniqueIdentifier": "string",
    "name": "string",
    "version": "string",
    "downloadURL": "string",
    "defaultWeight": float,
    "private": boolean,
    "heroImageURL": "string",
    "tags": ["string"],
    "positiveTriggerWords": "string",
    "shortDescription": "string",
    "comment": "string"
  }
]
```

 Upload ControlNet

```
[
  {
    "taskType": "modelUpload",
    "taskUUID": "string",
    "category": "controlnet",
    "architecture": "string",
    "conditioning": "string",
    "format": "string",
    "air": "string",
    "uniqueIdentifier": "string",
    "name": "string",
    "version": "string",
    "downloadUrl": "string",
    "private": boolean,
    "heroImageUrl": "string",
    "tags": ["string"],
    "shortDescription": "string",
    "comment": "string"
  }
]
```

### [taskType](https://runware.ai/docs/en/image-inference/model-upload#request-tasktype) string required
:   The type of task to be performed. For this task, the value should be `modelUpload`.

### [taskUUID](https://runware.ai/docs/en/image-inference/model-upload#request-taskuuid) string required UUID v4
:   When a task is sent to the API you must include a random UUID v4 string using the `taskUUID` parameter. This string is used to match the async responses to their corresponding tasks.

    If you send multiple tasks at the same time, the `taskUUID` will help you match the responses to the correct tasks.

    The `taskUUID` must be unique for each task you send to the API.

### [webhookURL](https://runware.ai/docs/en/image-inference/model-upload#request-webhookurl) string
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

### [deliveryMethod](https://runware.ai/docs/en/image-inference/model-upload#request-deliverymethod) "sync" | "async" required Default: sync
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

### [category](https://runware.ai/docs/en/image-inference/model-upload#request-category) string required
:   Specifies the type of model being uploaded. Currently supported values are:

    - `checkpoint`: Base models (also known as checkpoints) that serve as the foundation for image generation.
    - `lora`: LoRA (Low-Rank Adaptation) models used to add specific styles, concepts, or characteristics to the generated images.
    - `lycoris`: Alternative to LoRA models, offering different adaptation techniques.
    - `controlnet`: ControlNet models for guided image generation.
    - `vae`: Variational Autoencoders used for improving image quality and details.
    - `embeddings`: Textual embeddings used to add new concepts to the model's vocabulary.

    Depending on the type of model selected, different optional parameters can be used in the request.

### [type](https://runware.ai/docs/en/image-inference/model-upload#request-type) string required
:   This parameter has different possible values depending on the selected [category](#request-category).

    When `category` is set to `checkpoint`, this parameter specifies the category of the model. Possible values:

    - `base`: Standard models for general image generation.
    - `inpainting`: Models specifically trained for filling in or modifying parts of existing images.
    - `refiner`: Models that improve the quality and details of generated images.

    When `category` is set to `embeddings`, this parameter specifies the type of embeddings. Possible values:

    - `positive`: Embeddings that enhance or add certain features.
    - `negative`: Embeddings that suppress or remove certain features.

    Note: This parameter is only required when `category` is set to either `checkpoint` or `embeddings`.

### [architecture](https://runware.ai/docs/en/image-inference/model-upload#request-architecture) string required
:   Specifies the architecture of the model.

      View supported architectures 

    ```
    flux1s
    flux1d
    fluxkontextdev
    hidreamdev
    hidreamfull
    qwen_image
    sd1x
    sdhyper
    sd1xlcm
    sdxl
    sdxllcm
    sdxldistilled
    sdxlhyper
    sdxllightning
    sdxlturbo
    sd3
    pony
    illustrious
    ```

### [conditioning](https://runware.ai/docs/en/image-inference/model-upload#request-conditioning) string
:   This parameter is only applicable when [category](#request-category) is set to `controlnet`.

    Specifies the type of conditioning that the ControlNet model applies. This determines what kind of control the model will have over the image generation process.

      View supported values 

    ```
    blur
    canny
    depth
    gray
    hed
    inpaint
    inpaintdepth
    lineart
    lowquality
    normal
    openmlsd
    openpose
    outfit
    pix2pix
    qrcode
    scrible
    seg
    shuffle
    sketch
    softedge
    tile
    ```

### [format](https://runware.ai/docs/en/image-inference/model-upload#request-format) string required
:   Specifies the format of the model file. Currently supported values are:

    - `safetensors`: A secure format for storing model weights.

### [air](https://runware.ai/docs/en/image-inference/model-upload#request-air) string required
:   We make use of the [AIR](/docs/en/image-inference/models#air-system) (Artificial Intelligence Resource) system to identify models. The AIR system provides a standardized way to identify and reference AI models within our platform. This identifier will be used when you want to reference this model in other API calls.

    The identifier follows the format `source:id@version` (e.g., `runware:100@1`, `mycompany:123@2`).

    Components:

    - `source`: Your source/provider identifier. Must be created first in the dashboard.
    - `id`: A unique numeric identifier for the model.
    - `version`: Version number of the model.

    When uploading a new model version, use the same `id` with an incremented `version` number.

    To update a model's metadata, use the same AIR identifier and the new values will replace the existing ones. Note that the model [type](#request-type) cannot be changed in updates.

### [uniqueIdentifier](https://runware.ai/docs/en/image-inference/model-upload#request-uniqueidentifier) string required
:   A unique identifier that represents the model file content, typically a hash or checksum string. This identifier is used to determine if a model needs to be re-downloaded during updates.

    When updating a model:

    - If the `uniqueIdentifier` remains the same, the system will reuse the existing model file.
    - If the `uniqueIdentifier` changes, the system will download the model file again from the provided URL.

    This helps optimize storage and bandwidth usage by avoiding unnecessary downloads of identical model files.

### [name](https://runware.ai/docs/en/image-inference/model-upload#request-name) string required
:   The display name of the model.

    The name will be used in the Model Explorer within your dashboard to identify your model in a human-readable format.

### [version](https://runware.ai/docs/en/image-inference/model-upload#request-version) string required
:   A descriptive label for this version of the model. This can help track different iterations or variants of your model.

    The version label will be displayed in the Model Explorer within your dashboard to help differentiate between different versions of the same model.

### [downloadURL](https://runware.ai/docs/en/image-inference/model-upload#request-downloadurl) string required
:   URL where the model file can be downloaded from. The URL must be publicly accessible and return the model file directly.

### [defaultSteps](https://runware.ai/docs/en/image-inference/model-upload#request-defaultsteps) integer Min: 1 Max: 100 Default: 20
:   Note: This parameter is only applicable when [category](#request-category) is set to `checkpoint`.

    Sets the default number of inference steps for this model.

    This value serves only as a default - users can override it by specifying a different number of steps during image inference.

    If not specified, the system default value of 20 steps will be used.

### [defaultScheduler](https://runware.ai/docs/en/image-inference/model-upload#request-defaultscheduler) string Default: Model's scheduler
:   Note: This parameter is only applicable when [category](#request-category) is set to `checkpoint`.

    Sets the default scheduler to be used with this model.

    The list of available schedulers can be found in the [schedulers](/docs/en/image-inference/schedulers) page.

    This value serves only as a default - users can override it by specifying a different scheduler during image inference.

    If not specified, the model will use the scheduler it was trained with.

### [defaultCFG](https://runware.ai/docs/en/image-inference/model-upload#request-defaultcfg) float Min: 0 Max: 30 Default: 7
:   Note: This parameter is only applicable when [category](#request-category) is set to `checkpoint`.

    Sets the default guidance scale (CFG Scale) for this model. Guidance scale represents how closely the generated images will adhere to the prompt. Higher values result in images that more closely follow the prompt, while lower values allow more creative freedom.

    This value serves only as a default - users can override it by specifying a different guidance scale during image inference.

    If not specified, the system default value of 7.0 will be used.

### [defaultStrength](https://runware.ai/docs/en/image-inference/model-upload#request-defaultstrength) float Min: 0 Max: 1 Default: 0.8
:   Note: This parameter is only applicable when [category](#request-category) is set to `checkpoint`.

    Sets the default strength value for image-to-image tasks.

    This value serves only as a default - users can override it by specifying a different strength during image inference.

    If not specified, the system default value of 0.8 will be used.

### [defaultWeight](https://runware.ai/docs/en/image-inference/model-upload#request-defaultweight) float Min: -4 Max: 4 Default: 1
:   Note: This parameter is only applicable when [category](#request-category) is set to `lora`.

    Sets the default weight for the LoRA model.

    Note that the effective strength of the weight depends on how the LoRA was trained. Higher values don't always mean better results - they can introduce unwanted artifacts or distortions.

    If not specified, the system default value of 1.0 will be used.

    This value serves only as a default - users can override it by specifying a different weight during image inference.

### [private](https://runware.ai/docs/en/image-inference/model-upload#request-private) boolean Default: true
:   Determines the visibility of the model in the Model Explorer:

    - `true`: The model will only be visible to members of your team or organization.
    - `false`: The model will be visible to everyone (public).

    This setting, as many others, can be changed later by updating the model metadata.

### [heroImageURL](https://runware.ai/docs/en/image-inference/model-upload#request-heroimageurl) string
:   URL for the preview image that will be displayed in the Model Explorer. This image should represent the model's capabilities or style. The URL must be publicly accessible.

### [tags](https://runware.ai/docs/en/image-inference/model-upload#request-tags) string[]
:   An array of strings that set the tags for the model. Tags help with model organization, discoverability, and filtering in the Model Explorer, both for public and private models. You can include up to 100 unique tags per model, with each tag limited to a maximum of 400 characters.

### [positiveTriggerWords](https://runware.ai/docs/en/image-inference/model-upload#request-positivetriggerwords) string[]
:   Note: This parameter is only applicable when [category](#request-category) is set to `checkpoint`, `lora`, `lycoris` or `embeddings`.

    An array of words or phrases that need to be included in the prompt to properly activate this model during image generation. These words help users understand what terms they should include in their prompts to effectively utilize the model.

### [negativeTriggerWords](https://runware.ai/docs/en/image-inference/model-upload#request-negativetriggerwords) string
:   A comma-separated list of words or phrases that should be included in the positive prompt when using this model. These terms help prevent unwanted characteristics or artifacts that the model might otherwise generate.

    Note: This parameter is only applicable when [category](#request-category) is set to `checkpoint`, `lora`, `lycoris` or `embeddings`.

### [shortDescription](https://runware.ai/docs/en/image-inference/model-upload#request-shortdescription) string
:   A brief description of the model that will be displayed in the Model Explorer. This should explain the model's purpose, effects, or unique characteristics. A good description helps users understand the model's capabilities and intended use cases at a glance.

    The description must be between 2 and 40000 characters in length.

### [comment](https://runware.ai/docs/en/image-inference/model-upload#request-comment) string
:   An optional field for adding internal notes or comments about the model. This can be used for tracking development notes, usage instructions, or any other internal information.

    The comment must be between 2 and 1000 characters in length.

## [Response](#response)

The API **streams a sequence of messages**, each one notifying you when a specific processing phase has been completed successfully. Every message maintains the same structure but indicates which stage of the upload process has just finished.

The model upload process generates notifications for these sequential phases:

1. **Validation**: Confirms that model parameters and configuration have been successfully verified.
2. **Download**: Indicates that the model has been fully retrieved from the provided URL.
3. **Optimization**: Notifies that performance optimization processing has been completed.
4. **Storage**: Confirms successful upload to our distributed storage system.
5. **Ready**: Final notification that the model is deployed and available for use.

Below are the messages you'll receive as each phase completes:

Validation

```
{
  "data": [
    {
      "taskType": "modelUpload",
      "taskUUID": "b92ea202-349f-4560-adae-abb55a8146ee",
      "status": "validated",
      "message": "Model parameters and configuration validated.",
      "air": "runware:2@1"
    }
  ]
}
```

 Download

```
{
  "data": [
    {
      "taskType": "modelUpload",
      "taskUUID": "b92ea202-349f-4560-adae-abb55a8146ee",
      "status": "downloaded",
      "message": "Model downloaded from provider.",
      "air": "runware:2@1"
    }
  ]
}
```

 Optimization

```
{
  "data": [
    {
      "taskType": "modelUpload",
      "taskUUID": "b92ea202-349f-4560-adae-abb55a8146ee",
      "status": "optimized",
      "message": "Model optimized for deployment.",
      "air": "runware:2@1"
    }
  ]
}
```

 Storage

```
{
  "data": [
    {
      "taskType": "modelUpload",
      "taskUUID": "b92ea202-349f-4560-adae-abb55a8146ee",
      "status": "stored",
      "message": "Model uploaded to secure storage.",
      "air": "runware:2@1"
    }
  ]
}
```

 Ready

```
{
  "data": [
    {
      "taskType": "modelUpload",
      "taskUUID": "b92ea202-349f-4560-adae-abb55a8146ee",
      "status": "ready",
      "message": "Model successfully deployed and ready for use.",
      "air": "runware:2@1"
    }
  ]
}
```

### [taskType](https://runware.ai/docs/en/image-inference/model-upload#response-tasktype) string
:   The API will return the `taskType` you sent in the request. In this case, it will be `modelUpload`. This helps match the responses to the correct task type.

### [taskUUID](https://runware.ai/docs/en/image-inference/model-upload#response-taskuuid) string UUID v4
:   The API will return the `taskUUID` you sent in the request. This way you can match the responses to the correct request tasks.

### [status](https://runware.ai/docs/en/image-inference/model-upload#response-status) string
:   Represents which phase has been completed successfully in the model upload process. The status values indicate:

    - `validated`: Initial validation of model parameters and configuration.
    - `downloaded`: Model file successfully downloaded from the provided URL.
    - `optimized`: Model processed and optimized for deployment.
    - `stored`: Model securely stored in our infrastructure.
    - `ready`: Model fully deployed and available for use.

### [message](https://runware.ai/docs/en/image-inference/model-upload#response-message) string
:   A human-readable description of which phase has been completed successfully in the model upload process:

    - `"Model parameters and configuration validated."`
    - `"Model downloaded from provider."`
    - `"Model optimized for deployment."`
    - `"Model uploaded to secure storage."`
    - `"Model successfully deployed and ready for use."`

### [air](https://runware.ai/docs/en/image-inference/model-upload#response-air) string
:   The AIR identifier of the model being processed, which remains consistent throughout all phase updates to track the model's progress.

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