---
title: Introduction to image inference
source_url: https://runware.ai/docs/en/image-inference/introduction
fetched_at: 2025-10-27 03:51:33
---

## [Introduction](#introduction)

Image inference refers to image generation and manipulation operations. Generate images from text descriptions, transform existing images, and perform specialized editing operations, all powered by our Sonic Inference Engine®.

For the core API parameters common to all Runware tasks, please refer to our [Getting Started Introduction](/docs/en/getting-started/introduction). That guide covers the fundamental concepts that apply across all Runware API tasks.

This page covers the common parameters and concepts shared across all **image inference operations**. Understanding these fundamentals will help you work effectively with any of our image-related APIs.

```
[
  {
    // Core parameters
    "taskType": "imageInference",
    "taskUUID": "a770f077-f413-47de-9dac-be0b26a35da6",
    "ttl": 3600,
    "includeCost": true,

    // Image-related parameters
    "outputType": "URL",
    "outputFormat": "jpg",
    "outputQuality": 95,
    "numberResults": 2,
    "safety": {
      "checkContent": true
    },

    // Task parameters
    "model": "runware:101@1",
    "positivePrompt": "a serene landscape with mountains and a lake",
    "width": 1024,
    "height": 1024
  }
]
```

### [Image inference features](#image-inference-features)

Our API offers several core image generation approaches:

| Feature | Description | Key Parameters |
| --- | --- | --- |
| Text-to-image | Generate images from textual descriptions. | `positivePrompt` |
| Image-to-image | Transform existing images guided by text prompts. | `seedImage` + `strength` |
| Inpainting | Selectively modify specific areas of an image using a mask. | `seedImage` + `maskImage` |
| Outpainting | Extend images beyond their original boundaries. | `seedImage` + `outpaint` |

These core features can be enhanced with additional technologies:

| Feature | Description | Key Parameters |
| --- | --- | --- |
| Refiner | Improve or enhance previously generated images. | `refiner` |
| VAE | Variational Autoencoders for improved image quality and details. | `vae` |
| ControlNet | Add structural guidance using reference images. | `controlNet` |
| LoRA | Apply specialized style or subject adaptation. | `lora` |
| IP-Adapter | Incorporate visual reference for style and content from existing images. | `ipAdapters` |
| Embeddings | Use custom concepts and styles across generations. | `embeddings` |
| PuLID | Advanced face identity preservation across different contexts. | `puLID` |
| ACE++ | Character-consistent image generation and editing workflows. | `acePlusPlus` |
| PhotoMaker | Create consistent character identities and styles. | `photoMaker` |

All these functionalities use the `imageInference` task type, differentiated by the specific parameters you include.

## [Common image inference parameters](#common-image-inference-parameters)

While each image inference operation has its specific parameters, several parameters are common across all image inference tasks.

[outputType](https://runware.ai/docs/en/image-inference/api-reference#request-outputtype) "base64Data" | "dataURI" | "URL" Default: URL
:   Specifies the output type in which the image is returned. Supported values are: `dataURI`, `URL`, and `base64Data`.

    - `base64Data`: The image is returned as a base64-encoded string using the `imageBase64Data` parameter in the response object.
    - `dataURI`: The image is returned as a data URI string using the `imageDataURI` parameter in the response object.
    - `URL`: The image is returned as a URL string using the `imageURL` parameter in the response object.

[outputFormat](https://runware.ai/docs/en/image-inference/api-reference#request-outputformat) "JPG" | "PNG" | "WEBP" Default: JPG
:   Specifies the format of the output image. Supported formats are: `PNG`, `JPG` and `WEBP`.

[outputQuality](https://runware.ai/docs/en/image-inference/api-reference#request-outputquality) integer Min: 20 Max: 99 Default: 95
:   Sets the compression quality of the output image. Higher values preserve more quality but increase file size, lower values reduce file size but decrease quality.

[uploadEndpoint](https://runware.ai/docs/en/image-inference/api-reference#request-uploadendpoint) string
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

[safety](https://runware.ai/docs/en/image-inference/api-reference#request-safety) object
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

[numberResults](https://runware.ai/docs/en/image-inference/api-reference#request-numberresults) integer Min: 1 Max: 20 Default: 1
:   Specifies how many images to generate for the given parameters. Each image will have the same parameters but different seeds, resulting in variations of the same concept.

Here's a simple text-to-image request illustrating the common parameters:

```
[
  {
    "taskType": "imageInference",
    "taskUUID": "a770f077-f413-47de-9dac-be0b26a35da6",
    "model": "runware:101@1",
    "positivePrompt": "a serene landscape with mountains and a lake",
    "width": 1024,
    "height": 1024,
    "outputType": "URL",
    "outputFormat": "jpg",
    "outputQuality": 95,
    "numberResults": 2,
    "safety": {
      "checkContent": true
    },
    "includeCost": true
  }
]
```

## [Common response fields](#common-response-fields)

All image inference operations return a consistent set of fields:

[imageUUID](https://runware.ai/docs/en/image-inference/api-reference#response-imageuuid) string UUID v4
:   A unique identifier for the output image. This UUID can be used to reference the image in subsequent operations or for tracking purposes.

    The `imageUUID` is different from the `taskUUID`. While `taskUUID` identifies the request, `imageUUID` identifies the specific image output.

[imageURL](https://runware.ai/docs/en/image-inference/api-reference#response-imageurl) string
:   If `outputType` is set to `URL`, this parameter contains the URL of the image to be downloaded.

[imageBase64Data](https://runware.ai/docs/en/image-inference/api-reference#response-imagebase64data) string
:   If `outputType` is set to `base64Data`, this parameter contains the base64-encoded image data.

[imageDataURI](https://runware.ai/docs/en/image-inference/api-reference#response-imagedatauri) string
:   If `outputType` is set to `dataURI`, this parameter contains the data URI of the image.

[seed](https://runware.ai/docs/en/image-inference/api-reference#response-seed) integer
:   The seed value that was used to generate this image. This value can be used to reproduce the same image when using identical parameters in another request.

[NSFWContent](https://runware.ai/docs/en/image-inference/api-reference#response-nsfwcontent) boolean
:   If [safety](#request-safety) parameter is used, `NSFWContent` is included informing if the image has been flagged as potentially sensitive content.

    - `true` indicates the image has been flagged (is a sensitive image).
    - `false` indicates the image has not been flagged.

    The filter occasionally returns false positives and very rarely false negatives.

Here’s the response to the previous request, illustrating the common parameters:

```
{
  "data": [
    {
      "taskType": "imageInference",
      "imageUUID": "97ae27b6-1d52-4815-a5d6-301428d668b1",
      "taskUUID": "a770f077-f413-47de-9dac-be0b26a35da6",
      "NSFWContent": false,
      "cost": 0.0027,
      "seed": 3614157524222286418,
      "imageURL": "https://im.runware.ai/image/ws/2/ii/97ae27b6-1d52-4815-a5d6-301428d668b1.jpg"
    },
    {
      "taskType": "imageInference",
      "imageUUID": "a70ec6e4-8845-45b3-9993-bd02a6d7f88e",
      "taskUUID": "a770f077-f413-47de-9dac-be0b26a35da6",
      "NSFWContent": false,
      "cost": 0.0027,
      "seed": 3614157524222286419,
      "imageURL": "https://im.runware.ai/image/ws/2/ii/a70ec6e4-8845-45b3-9993-bd02a6d7f88e.jpg"
    }
  ]
}
```

## [Specialized guides](#specialized-guides)

For detailed information about specific image inference operations, see these dedicated guides:

- [Text-to-image guide](/docs/en/image-inference/text-to-image): Creating images from text descriptions.
- [Image-to-image guide](/docs/en/image-inference/image-to-image): Transforming existing images.
- [Inpainting guide](/docs/en/image-inference/inpainting): Selectively editing image regions.
- [Outpainting guide](/docs/en/image-inference/outpainting): Extending image boundaries.

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