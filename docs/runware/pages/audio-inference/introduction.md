---
title: Introduction to audio inference
source_url: https://runware.ai/docs/en/audio-inference/introduction
fetched_at: 2025-10-27 03:51:20
---

## [Introduction](#introduction)

Audio inference enables **audio generation and transformation**. Generate audio from text descriptions, create musical compositions, synthesize speech, or produce sound effects, all powered by our Sonic Inference Engine®.

For the core API parameters common to all Runware tasks, please refer to our [Getting Started Introduction](/docs/en/getting-started/introduction). That guide covers the fundamental concepts that apply across all Runware API tasks.

This page covers the common parameters and concepts shared across all **audio inference operations**. Understanding these fundamentals will help you work effectively with our audio generation APIs.

```
[
  {
    // Core parameters
    "taskType": "audioInference",
    "taskUUID": "24cd5dff-cb81-4db5-8506-b72a9425f9d1",
    "ttl": 3600,
    "includeCost": true,

    // Audio-related parameters
    "outputType": "URL",
    "outputFormat": "mp3",
    "numberResults": 2,

    // Task parameters
    "model": "elevenlabs:1@1",
    "positivePrompt": "Peaceful piano melody with gentle rain sounds in the background",
    "duration": 15,
    "audioSettings": {
      "sampleRate": 44100,
      "bitrate": 192
    }
  }
]
```

### [Audio inference features](#audio-inference-features)

Our API offers several core audio generation approaches:

| Feature | Description | Key Parameters |
| --- | --- | --- |
| Text-to-audio | Generate audio content from textual descriptions. | `positivePrompt` + `duration` |
| Music generation | Create structured musical compositions with detailed control over sections and styles. | `providerSettings` + `duration` |
| Speech synthesis | Convert text to natural-sounding speech with voice control. | `positivePrompt` + `model` |
| Sound effects | Generate ambient sounds, effects, and audio textures. | `positivePrompt` + `audioSettings` |

All audio operations use the `audioInference` task type, differentiated by the specific parameters you include.

## [Key considerations for audio generation](#key-considerations-for-audio-generation)

Working with audio introduces several important concepts that affect how you structure requests and handle responses.

### [Asynchronous processing](#asynchronous-processing)

Audio generation is computationally intensive and uses asynchronous processing. Set `"deliveryMethod": "async"` in your request to receive:

1. **Initial response**: Contains the same `taskType` and `taskUUID` you sent in the request. This acknowledges that your task has been received and queued for processing.
2. **Polling**: Use the `taskUUID` with the `getResponse` task type to check status.
3. **Completion**: The `data` and `errors` arrays are populated with results for each generation when processing completes.

For detailed information about polling with `getResponse` and handling async workflows, see our [Task Responses documentation](/docs/en/utilities/task-responses).

### [Audio quality settings](#audio-quality-settings)

The `audioSettings` object allows you to control technical audio parameters:

```
{
  "audioSettings": {
    "sampleRate": 44100,  // Hz - higher values capture more detail
    "bitrate": 192        // kbps - affects compression quality
  }
}
```

**Sample rate guidelines**:

- **22050 Hz**: Good for speech and basic audio.
- **44100 Hz**: CD quality, recommended for music.
- **48000 Hz**: Professional audio standard.

**Bitrate considerations**:

- Higher bitrates preserve more quality but create larger files.
- Bitrate settings apply only to compressed formats (MP3, OGG).

### [Output formats](#output-formats)

Choose the appropriate format based on your use case:

- **MP3**: Widely compatible, good compression, recommended for most applications.
- **WAV**: Uncompressed, highest quality, larger file sizes.

## [Common audio inference parameters](#common-audio-inference-parameters)

While each audio operation has its specific parameters, several parameters are common across all audio inference tasks.

[outputType](https://runware.ai/docs/en/audio-inference/api-reference#request-outputtype) "base64Data" | "dataURI" | "URL" Default: URL
:   Specifies the output type in which the audio is returned. Supported values are: `dataURI`, `URL`, and `base64Data`.

    - `base64Data`: The audio is returned as a base64-encoded string using the `audioBase64Data` parameter in the response object.
    - `dataURI`: The audio is returned as a data URI string using the `audioDataURI` parameter in the response object.
    - `URL`: The audio is returned as a URL string using the `audioURL` parameter in the response object.

[outputFormat](https://runware.ai/docs/en/audio-inference/api-reference#request-outputformat) "MP3" Default: MP3
:   Specifies the format of the output audio. Supported formats are: `MP3`.

    - `MP3`: MPEG-3 audio format, widely compatible and recommended for most use cases.

[uploadEndpoint](https://runware.ai/docs/en/audio-inference/api-reference#request-uploadendpoint) string
:   Specifies a URL where the generated content will be automatically uploaded using the HTTP PUT method. The raw binary data of the media file is sent directly as the request body. For secure uploads to cloud storage, use presigned URLs that include temporary authentication credentials.

    **Common use cases:**

    - **Cloud storage**: Upload directly to S3 buckets, Google Cloud Storage, or Azure Blob Storage using presigned URLs.
    - **CDN integration**: Upload to content delivery networks for immediate distribution.

    ```
    // S3 presigned URL for secure upload
    https://your-bucket.s3.amazonaws.com/generated/audio.mp3?X-Amz-Signature=abc123&X-Amz-Expires=3600

    // Google Cloud Storage presigned URL
    https://storage.googleapis.com/your-bucket/audio.wav?X-Goog-Signature=xyz789

    // Custom storage endpoint
    https://storage.example.com/uploads/generated-audio.flac
    ```

    The content data will be sent as the request body to the specified URL when generation is complete.

[numberResults](https://runware.ai/docs/en/audio-inference/api-reference#request-numberresults) integer Min: 1 Max: 3 Default: 1
:   Specifies how many audio files to generate for the given parameters. Each audio file will have the same parameters but different seeds, resulting in variations of the same concept.

Here's a simple text-to-audio request illustrating the common parameters:

```
[
  {
    "taskType": "audioInference",
    "taskUUID": "24cd5dff-cb81-4db5-8506-b72a9425f9d1",
    "model": "elevenlabs:1@1",
    "positivePrompt": "Gentle acoustic guitar melody with soft nature sounds",
    "duration": 12,
    "outputFormat": "mp3",
    "audioSettings": {
      "sampleRate": 44100,
      "bitrate": 192
    },
    "numberResults": 1,
    "includeCost": true
  }
]
```

## [Common response fields](#common-response-fields)

All audio inference operations return a consistent set of fields:

[audioUUID](https://runware.ai/docs/en/audio-inference/api-reference#response-audiouuid) string UUID v4
:   A unique identifier for the generated audio. This UUID can be used to reference the audio in subsequent operations or for tracking purposes.

    The `audioUUID` is different from the `taskUUID`. While `taskUUID` identifies the generation request, `audioUUID` identifies the specific audio output.

[audioURL](https://runware.ai/docs/en/audio-inference/api-reference#response-audiourl) string
:   If `outputType` is set to `URL`, this parameter contains the URL of the audio to be downloaded.

The response format depends on your `deliveryMethod` setting.

### [Synchronous delivery](#synchronous-delivery)

When using sync mode, you receive the complete audio results directly in the API response:

```
{
  "data": [
    {
      "taskType": "audioInference",
      "taskUUID": "24cd5dff-cb81-4db5-8506-b72a9425f9d1",
      "audioUUID": "b7db282d-2943-4f12-992f-77df3ad3ec71",
      "audioURL": "https://am.runware.ai/audio/ws/0.5/ai/b7db282d-2943-4f12-992f-77df3ad3ec71.mp3",
      "cost": 0.08
    }
  ]
}
```

### [Asynchronous delivery](#asynchronous-delivery)

When you submit an audio task with async delivery, you receive immediate confirmation (or an error if the request is invalid):

Success

```
{
  "data": [
    {
      "taskType": "audioInference",
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
      "message": "Invalid value for duration parameter. This duration exceeds the maximum supported by the model.",
      "parameter": "duration",
      "type": "float",
      "documentation": "https://runware.ai/docs/en/audio-inference/api-reference#request-duration",
      "taskUUID": "24cd5dff-cb81-4db5-8506-b72a9425f9d1"
    }
  ]
}
```

#### [Final results](#final-results)

When processing completes, the `getResponse` task returns the full audio data:

Success

```
{
  "data": [
    {
      "taskType": "audioInference",
      "taskUUID": "24cd5dff-cb81-4db5-8506-b72a9425f9d1",
      "status": "success",
      "audioUUID": "b7db282d-2943-4f12-992f-77df3ad3ec71",
      "audioURL": "https://am.runware.ai/audio/ws/0.5/ai/b7db282d-2943-4f12-992f-77df3ad3ec71.mp3",
      "cost": 0.08
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
      "documentation": "https://runware.ai/docs/en/audio-inference/api-reference",
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