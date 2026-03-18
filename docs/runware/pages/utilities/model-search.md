---
title: Model Search API
source_url: https://runware.ai/docs/en/utilities/model-search
fetched_at: 2025-10-27 03:51:48
---

## [Introduction](#introduction)

The Model Search API enables discovery of available models on the Runware platform, providing powerful search and filtering capabilities. Whether exploring **public models from the community** or **managing private models within your organization**, this API helps find the perfect model for any image generation task.

Models discovered through this API can be immediately used in image generation tasks **by referencing their AIR identifiers**. This enables dynamic model selection in applications and helps discover new models for specific artistic styles. For optimal search performance, consider using specific filters to narrow results and combining multiple criteria to find the most relevant models.

## [Search capabilities](#search-capabilities)

The search functionality works across model names, versions, tags, and other fields, allowing users to both **find specific models and discover related ones** that match their search terms.

Multiple filters are available to narrow down results based on technical aspects of the models such as their category, type, architecture, and specific capabilities, making it easy to find exactly what you need.

The visibility filter helps manage which models appear in the results: choose between your organization's public models, private models, or all available models including those from the community.

## [Search results](#search-results)

Search queries return **comprehensive information about matching models**. A unique AIR identifier is provided for each model, which is essential for image generation requests. The metadata includes the model's name, version and tags, while technical-related fields detail the model's category, type and architecture, along with its visibility status.

Results are returned in a **paginated format** to ensure efficient processing of large result sets. The default limit is 20 models per page, though this can be customized using the `limit` parameter. Navigation through the results is handled through the `offset` parameter, allowing you to move through the complete set of matches if needed.

## [Request](#request)

Our API always accepts an array of objects as input, where each object represents a **specific task to be performed**. The structure of the object varies depending on the type of the task. For this section, we will focus on the parameters related to the **model search task**.

The following JSON snippet shows the basic structure of a request object. **All properties are explained in detail in the next section**.

```
[
  {
    "taskType": "modelSearch",
    "taskUUID": "50836053-a0ee-4cf5-b9d6-ae7c5d140ada",
    "search": "realistic",
    "tags": "photorealistic",
    "category": "checkpoint",
    "type": "base",
    "architecture": "sdxl",
    "visibility": "all",
    "offset": 0,
    "limit": 20
  }
]
```

### [taskType](https://runware.ai/docs/en/utilities/model-search#request-tasktype) string required
:   The type of task to be performed. For this task, the value should be `modelSearch`.

### [taskUUID](https://runware.ai/docs/en/utilities/model-search#request-taskuuid) string required UUID v4
:   When a task is sent to the API you must include a random UUID v4 string using the `taskUUID` parameter. This string is used to match the async responses to their corresponding tasks.

    If you send multiple tasks at the same time, the `taskUUID` will help you match the responses to the correct tasks.

    The `taskUUID` must be unique for each task you send to the API.

### [search](https://runware.ai/docs/en/utilities/model-search#request-search) string
:   Search term to filter models. The search is performed across multiple fields with different weights:

    - Model name as exact phrase (boost: 10).
    - Model AIR identifier (with wildcard matching, boost: 5).
    - Model name (with wildcard matching, boost: 5).
    - Model version (exact word matching).
    - Model tags (exact word matching).

    The search is case-insensitive and will return models that match any of these criteria, with results ordered by relevance.

### [tags](https://runware.ai/docs/en/utilities/model-search#request-tags) string[]
:   Filter models by matching any of the provided tags in this array. Models that contain at least one of these tags will be included in the results.

### [category](https://runware.ai/docs/en/utilities/model-search#request-category) string
:   Filter models by their category.

    Possible values:

    - `checkpoint`: Base models that serve as the foundation for image generation.
    - `lora`: LoRA (Low-Rank Adaptation) models used to add specific styles or concepts.
    - `lycoris`: Alternative to LoRA models, offering different adaptation techniques.
    - `controlnet`: Models designed for guided image generation with specific conditions.
    - `vae`: Variational Autoencoders used for improving image quality and details.
    - `embeddings`: Textual embeddings used to add new concepts to the model's vocabulary.

### [type](https://runware.ai/docs/en/utilities/model-search#request-type) string
:   Filter checkpoint models by their type.

    Possible values:

    - `base`: Standard models for general image generation.
    - `inpainting`: Models for filling in or modifying parts of existing images.
    - `refiner`: Models that improve the quality and details of generated images.

    Note: This parameter is only applicable when `category` is set to `checkpoint`.

### [architecture](https://runware.ai/docs/en/utilities/model-search#request-architecture) string
:   Filter models by their architecture.

    Possible values:

    - `flux1s`: FLUX.1 [schnell]
    - `flux1d`: FLUX.1 [dev]
    - `fluxpro`: FLUX.1 [pro]
    - `fluxultra`: FLUX.1 [ultra]
    - `fluxkontextdev`: FLUX.1 Kontext [dev]
    - `fluxkontextpro`: FLUX.1 Kontext [pro]
    - `fluxkontextmax`: FLUX.1 Kontext [max]
    - `imagen3`: Imagen 3
    - `imagen3fast`: Imagen 3 Fast
    - `imagen4preview`: Imagen 4 Preview
    - `imagen4ultra`: Imagen 4 Ultra
    - `imagen4fast`: Imagen 4 Fast
    - `gemini_2_5_flash_image`: Gemini Flash Image 2.5
    - `hidreamfast`: HiDream-I1 Fast
    - `hidreamdev`: HiDream-I1 Dev
    - `hidreamfull`: HiDream-I1 Full
    - `qwen_image`: Qwen-Image
    - `qwen_image_edit`: Qwen-Image-Edit
    - `flex_1_alpha`: Flex.1‑alpha
    - `ideogram1`: Ideogram 1.0
    - `ideogram2a`: Ideogram 2a
    - `ideogram2`: Ideogram 2.0
    - `ideogram3`: Ideogram 3.0
    - `sd1x`: SD 1.5
    - `sdhyper`: SD 1.5 Hyper
    - `sd1xlcm`: SD 1.5 LCM
    - `sdxl`: SDXL 1.0
    - `sdxllcm`: SDXL 1.0 LCM
    - `sdxldistilled`: SDXL Distilled
    - `sdxlhyper`: SDXL Hyper
    - `sdxllightning`: SDXL Lightning
    - `sdxlturbo`: SDXL Turbo
    - `sd3`: SD 3
    - `pony`: Pony

### [conditioning](https://runware.ai/docs/en/utilities/model-search#request-conditioning) string
:   Filter ControlNet models by their conditioning type.

    Possible values:

    - `blur`: Uses blurred images to guide the generation.
    - `canny`: Follows edge detection maps as reference.
    - `depth`: Creates images based on depth map information.
    - `gray`: Takes grayscale images as input reference.
    - `hed`: Works with holistic edge detection patterns.
    - `inpaint`: Uses masks to control generation areas.
    - `inpaintdepth`: Combines both masks and depth information.
    - `lineart`: Takes line art as reference input.
    - `lowquality`: References low quality images for generation.
    - `normal`: Works with normal map information.
    - `openmlsd`: Guided by line segment detection.
    - `openpose`: Creates images following human pose guides.
    - `outfit`: Works with clothing and outfit patterns.
    - `pix2pix`: Takes reference images as guidance.
    - `qrcode`: Uses QR codes as structural reference.
    - `scribble`: Follows simple sketches or scribbles.
    - `seg`: Based on segmentation map guides.
    - `shuffle`: Works with rearranged content as reference.
    - `sketch`: Uses sketch drawings as guidance.
    - `softedge`: Follows soft edge detection patterns.
    - `tile`: Based on tiling and pattern references.

### [visibility](https://runware.ai/docs/en/utilities/model-search#request-visibility) string Default: all
:   Filter models by their visibility status and ownership:

    - `public`: Show only your organization's public models.
    - `private`: Show only your organization's private models.
    - `all`: Show both community models and all your organization's models (public and private).

### [limit](https://runware.ai/docs/en/utilities/model-search#request-limit) integer Min: 1 Max: 100 Default: 20
:   Maximum number of items to return in a single request. Used for pagination in combination with [offset](/docs/en/utilities/model-search#request-offset).

### [offset](https://runware.ai/docs/en/utilities/model-search#request-offset) integer Min: 0 Default: 0
:   Number of items to skip in the result set. Used for pagination in combination with [limit](/docs/en/utilities/model-search#request-limit).

## [Response](#response)

Results will be delivered in the format below.

```
{
  "data": [
    {
      "results": [
        {
          "name": "Promissing_Realistic_XL",
          "air": "civitai:305149@392545",
          "tags": [
            "photorealistic",
            "base model",
            "sci-fi",
            "photo",
            "woman",
            "fantasy",
            "photorealism",
            "rpg",
            "general use",
            "close up",
            "close up shot",
            "promissing_realistic_xl"
          ],
          "heroImage": "https://mim.runware.ai/r/66a70a0bb7c38-450x450.jpg",
          "category": "checkpoint",
          "private": false,
          "comment": "",
          "version": "v22",
          "architecture": "sdxl",
          "type": "base",
          "defaultWidth": 1024,
          "defaultHeight": 1024,
          "defaultSteps": 20,
          "defaultScheduler": "Default",
          "defaultCFG": 7.5
        },
      ],
      "taskUUID": "50836053-a0ee-4cf5-b9d6-ae7c5d140ada",
      "taskType": "modelSearch",
      "totalResults": 2
      }
    }
  ]
}
```

### [taskType](https://runware.ai/docs/en/utilities/model-search#response-tasktype) string
:   The API will return the `taskType` you sent in the request. In this case, it will be `modelSearch`. This helps match the responses to the correct task type.

### [taskUUID](https://runware.ai/docs/en/utilities/model-search#response-taskuuid) string UUID v4
:   The API will return the `taskUUID` you sent in the request. This way you can match the responses to the correct request tasks.

### [totalResults](https://runware.ai/docs/en/utilities/model-search#response-totalresults) integer
:   The total number of models that match your search criteria, including those beyond the current page limit.

    Use this value in combination with [offset](#request-offset) and [limit](#request-limit) parameters to implement pagination.

### [results](https://runware.ai/docs/en/utilities/model-search#response-results) object[]
:   An array containing the matching models for your search. Each object in the array includes the model's metadata such as AIR identifier, name, tags, preview image, default parameters and others.

    For detailed information about each field in the results object, check the parameters below.

      Array items
    ⁨18⁩ properties each 

    ### [air](https://runware.ai/docs/en/utilities/model-search#response-air) string
    :   We make use of the [AIR](/docs/en/image-inference/models#air-system) (Artificial Intelligence Resource) system to identify models. This identifier is a unique string that represents a specific model.

        You can use the AIR identifier to reference this model in other API calls, such as image generation requests.

    ### [name](https://runware.ai/docs/en/utilities/model-search#response-name) string
    :   The display name of the model.

    ### [version](https://runware.ai/docs/en/utilities/model-search#response-version) string
    :   The version label of the model.

    ### [category](https://runware.ai/docs/en/utilities/model-search#response-category) string
    :   The category of the model. See [possible values](#request-category).

    ### [architecture](https://runware.ai/docs/en/utilities/model-search#response-architecture) string
    :   The architecture of the model. See [possible values](#request-architecture).

    ### [type](https://runware.ai/docs/en/utilities/model-search#response-type) string
    :   The type of checkpoint model. See [possible values](#request-type).

        Note: This parameter is only returned when the model's category is `checkpoint`.

    ### [tags](https://runware.ai/docs/en/utilities/model-search#response-tags) string[]
    :   Array of tags associated with the model.

    ### [heroImage](https://runware.ai/docs/en/utilities/model-search#response-heroimage) string
    :   URL of the model's preview image.

    ### [private](https://runware.ai/docs/en/utilities/model-search#response-private) boolean
    :   Indicates whether this is a private model (`true`) or a public one (`false`).

    ### [comment](https://runware.ai/docs/en/utilities/model-search#response-comment) string
    :   Additional notes or comments about the model.

    ### [defaultWidth](https://runware.ai/docs/en/utilities/model-search#response-defaultwidth) integer
    :   The recommended width for image generation with this model.

        Note: This parameter is only returned when the model's category is `checkpoint`.

    ### [defaultHeight](https://runware.ai/docs/en/utilities/model-search#response-defaultheight) integer
    :   The recommended height for image generation with this model.

        Note: This parameter is only returned when the model's category is `checkpoint`.

    ### [defaultSteps](https://runware.ai/docs/en/utilities/model-search#response-defaultsteps) integer
    :   The default number of steps to use with this model when not specified during inference.

        Note: This parameter is only returned when the model's category is `checkpoint`.

    ### [defaultScheduler](https://runware.ai/docs/en/utilities/model-search#response-defaultscheduler) string
    :   The default scheduler to use with this model when not specified during inference.

        Note: This parameter is only returned when the model's category is `checkpoint`.

    ### [defaultCFG](https://runware.ai/docs/en/utilities/model-search#response-defaultcfg) float
    :   The default CFG (Classifier Free Guidance) scale to use with this model when not specified during inference.

        Note: This parameter is only returned when the model's category is `checkpoint`.

    ### [defaultStrength](https://runware.ai/docs/en/utilities/model-search#response-defaultstrength) float
    :   The default strength value to use with this inpainting model when not specified during inference.

        Note: This parameter is only returned when the model's category is `checkpoint` and type is `inpainting`.

    ### [positiveTriggerWords](https://runware.ai/docs/en/utilities/model-search#response-positivetriggerwords) string
    :   A comma-separated list of words or phrases that should be included in the positive prompt when using this model. These terms help encourage desired characteristics or features that the model should generate.

        Note: This parameter is only applicable when [category](#request-category) is set to `checkpoint`, `lora`, `lycoris` or `embeddings`.

    ### [conditioning](https://runware.ai/docs/en/utilities/model-search#response-conditioning) string
    :   The conditioning type of the ControlNet model. See [possible values](#request-conditioning).

        Note: This parameter is only returned when the model's category is `controlnet`.

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