---
title: Caption API
source_url: https://runware.ai/docs/en/tools/caption
fetched_at: 2025-10-27 03:51:51
---

## [Introduction](#introduction)

Image to text, also known as **image captioning**, allows you to obtain descriptive text prompts based on uploaded or previously generated images. This powerful feature allows advanced vision-language models to analyze visual content and generate accurate, detailed descriptions.

### [Core capabilities](#core-capabilities)

- **General captioning**: Generate comprehensive descriptions of any image content.
- **Content analysis**: Detect objects, scenes, activities, and composition details.
- **Age detection**: Specialized models for age estimation and demographic analysis.

Image captioning is instrumental for creating textual descriptions that can be used to generate similar images, provide accessibility descriptions, or gain detailed insights into visual content.

Different models excel at different types of analysis. **LLaVA models** provide rich, detailed descriptions, while **CLIP** offers semantic understanding, and **specialized detectors** focus on specific attributes like age estimation.

## [Request](#request)

Our API always accepts an array of objects as input, where each object represents a **specific task to be performed**. The structure varies depending on the model and analysis type used.

The following examples demonstrate different captioning workflows using various models.

General captioning

```
{
  "taskType": "caption",
  "taskUUID": "f0a5574f-d653-47f1-ab42-e2c1631f1a47",
  "inputImage": "5788104a-1ca7-4b7e-8a16-b27b57e86f87",
  "model": "runware:150@2"
}
```

 Age detection

```
{
  "taskType": "caption",
  "taskUUID": "b8c4d952-7f27-4a6e-bc9a-83f01d1c6d59",
  "inputImage": "6963a97e-f017-408b-a447-6345ec31a4f0",
  "model": "runware:152@50",
}
```

 Technical analysis

```
{
  "taskType": "caption",
  "taskUUID": "d6e8f9a0-3c5d-7e9f-a2d4-8b0c6d9e3f5a",
  "inputImage": "88eb3e0a-4db4-4c5a-9d3f-bf0ec07c7301",
  "model": "runware:152@2",
  "prompt": "Analyze the lighting, composition, and camera settings that might have been used to create this photograph"
}
```

 Content identification

```
{
  "taskType": "caption",
  "taskUUID": "e7f9a1b2-4d6e-8f0a-b3d5-9c1e7f0a2b4d",
  "inputImage": "99fc4f1b-5ec5-5d6b-ae4f-cf1fd18d8402",
  "model": "runware:151@1",
  "prompt": "List all the objects and people visible in this image, including their positions and relationships"
}
```

---

### [taskType](https://runware.ai/docs/en/tools/caption#request-tasktype) string required
:   The type of task to be performed. For this task, the value should be `caption`.

### [taskUUID](https://runware.ai/docs/en/tools/caption#request-taskuuid) string required UUID v4
:   When a task is sent to the API you must include a random UUID v4 string using the `taskUUID` parameter. This string is used to match the async responses to their corresponding tasks.

    If you send multiple tasks at the same time, the `taskUUID` will help you match the responses to the correct tasks.

    The `taskUUID` must be unique for each task you send to the API.

### [webhookURL](https://runware.ai/docs/en/tools/caption#request-webhookurl) string
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

### [deliveryMethod](https://runware.ai/docs/en/tools/caption#request-deliverymethod) "sync" | "async" required Default: sync
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

### [includeCost](https://runware.ai/docs/en/tools/caption#request-includecost) boolean Default: false
:   If set to `true`, the cost to perform the task will be included in the response object.

### [inputImage](https://runware.ai/docs/en/tools/caption#request-inputimage) string required
:   Specifies the input image to be processed. The image can be specified in one of the following formats:

    - An UUID v4 string of a [previously uploaded image](/docs/en/utilities/image-upload) or a generated image.
    - A data URI string representing the image. The data URI must be in the format `data:<mediaType>;base64,` followed by the base64-encoded image. For example: `data:image/png;base64,iVBORw0KGgo...`.
    - A base64 encoded image without the data URI prefix. For example: `iVBORw0KGgo...`.
    - A URL pointing to the image. The image must be accessible publicly.

    Supported formats are: PNG, JPG and WEBP.

### [model](https://runware.ai/docs/en/tools/caption#request-model) string required
:   We make use of the [AIR system](/docs/en/image-inference/models#air-system) to identify background removal models. This identifier is a unique string that represents a specific model.

      View generic captioning models 

    | AIR ID | Model Name |
    | --- | --- |
    | runware:150@2 | LLaVA-1.6-Mistral-7B |
    | runware:151@1 | OpenAI CLIP ViT-L/14 |
    | runware:152@1 | Qwen2.5-VL-3B-Instruct |
    | runware:152@2 | Qwen2.5-VL-7B-Instruct |

    Specialized models return specific parameters in the `structuredData` object instead of the `text` field.

      View specialized age detector models 

    | AIR ID | Model Name | Structured Data |
    | --- | --- | --- |
    | runware:153@1 | ViT Age Classifier | ageGroup, confidence |
    | runware:154@1 | Open Age Detection | ageGroup, confidence |
    | runware:152@50 | Qwen2.5-VL-7B Age Detector | ageGroup, confidence |

### [prompt](https://runware.ai/docs/en/tools/caption#request-prompt) string
:   Provides specific instructions or questions to guide the image analysis. When specified, the model will focus on answering your question or following your instructions. If no prompt is provided, the model will automatically describe the image in detail, including objects, scenes, composition, style, and other visual elements.

    **Examples**:

    - `"Describe the artistic style and color palette used in this image."`
    - `"What emotions or mood does this image convey?"`
    - `"List all the objects visible in this image."`
    - `"Analyze the lighting and composition techniques."`

## [Response](#response)

Results will be delivered in the format below.

```
{
  "data": [
    {
      "taskType": "caption",
      "taskUUID": "f0a5574f-d653-47f1-ab42-e2c1631f1a47",
      "text": "arafed troll in the jungle with a backpack and a stick, cgi animation, cinematic movie image, gremlin, pixie character, nvidia promotional image, park background, with lots of scumbling, hollywood promotional image, on island, chesley, green fog, post-nuclear",
      "cost": 0
    }
  ]
}
```

### [taskType](https://runware.ai/docs/en/tools/caption#response-tasktype) string
:   The type of task to be performed. For this task, the value should be `caption`.

### [taskUUID](https://runware.ai/docs/en/tools/caption#response-taskuuid) string UUID v4
:   The API will return the `taskUUID` you sent in the request. This way you can match the responses to the correct request tasks.

### [text](https://runware.ai/docs/en/tools/caption#response-text) string
:   The resulting text or prompt from interrogating the image.

### [structuredData](https://runware.ai/docs/en/tools/caption#response-structureddata) object
:   Contains structured, machine-readable data returned by specialized models instead of free-form text descriptions. This field is used when models perform specific analytical tasks that benefit from formatted output rather than natural language responses.

    When `structuredData` is present, the standard `text` field will be omitted from the response, as the structured format provides the analysis result. The exact structure and properties depend on the specific model and analysis type being performed.

    Always check for the presence of `structuredData` before falling back to the `text` field. Parse the structure according to the specific model's documented format.

      Age detection models 

    Return age group classifications with confidence scores.

    ```
    "structuredData": {
      "ageGroup": "13-20",
      "confidence": 79.65
    }
    ```

### [cost](https://runware.ai/docs/en/tools/caption#response-cost) float
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