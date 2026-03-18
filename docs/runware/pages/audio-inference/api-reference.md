---
title: Audio inference API
source_url: https://runware.ai/docs/en/audio-inference/api-reference
fetched_at: 2025-10-27 03:51:22
---

## [Introduction](#introduction)

Audio inference enables **high-quality audio generation from text descriptions**. This page is the complete API reference for audio inference tasks. All workflows and operations use the single `audioInference` task type, differentiated through parameter combinations and provider-specific settings.

### [Core operations](#core-operations)

- **Text-to-audio**: Generate audio content from text descriptions.
- **Music generation**: Create musical compositions with detailed styling control.
- **Sound effects**: Generate ambient sounds, effects, and audio textures.
- **Speech synthesis**: Convert text to natural-sounding speech.

Each feature includes detailed parameter documentation below.

Audio generation may use **asynchronous processing** for longer durations or complex compositions. Setting `"deliveryMethod": "async"` queues your task and returns an immediate acknowledgment. Use the `getResponse` task to poll for status updates and retrieve the final audio when processing completes.

## [Request](#request)

Our API always accepts an array of objects as input, where each object represents a **specific task to be performed**. The structure varies depending on the workflow and features used.

The following examples demonstrate how different parameter combinations create specific workflows.

Music Generation

```
{
  "taskType": "audioInference",
  "taskUUID": "a770f077-f413-47de-9dac-be0b26a35da6",
  "model": "elevenlabs:1@1",
  "positivePrompt": "upbeat electronic dance music with synthesizers",
  "duration": 30,
  "outputFormat": "mp3",
}
```

 Sound Effects

```
{
  "taskType": "audioInference",
  "taskUUID": "b8c4d952-7f27-4a6e-bc9a-83f01d1c6d59",
  "model": "elevenlabs:1@1",
  "positivePrompt": "thunder and rain storm, natural ambient sounds",
  "negativePrompt": "music, melody, instruments",
  "duration": 15,
  "outputFormat": "wav",
  "numberResults": 2
}
```

 Custom Audio Settings

```
{
  "taskType": "audioInference",
  "taskUUID": "f3a2b8c9-1e47-4d3a-9b2f-8c7e6d5a4b3c",
  "model": "elevenlabs:1@1",
  "positivePrompt": "classical piano piece, gentle and melodic",
  "duration": 60,
  "outputType": "dataURI",
  "outputFormat": "flac",
  "audioSettings": { 
    "sampleRate": 48000,
    "bitrate": 256
  },
  "includeCost": true,
  "numberResults": 1
}
```

---

### [taskType](https://runware.ai/docs/en/audio-inference/api-reference#request-tasktype) string required
:   Specifies the AI task to perform. For audio generation, this must be set to `audioInference`.

### [taskUUID](https://runware.ai/docs/en/audio-inference/api-reference#request-taskuuid) string required UUID v4
:   When a task is sent to the API you must include a random UUID v4 string using the `taskUUID` parameter. This string is used to match the async responses to their corresponding tasks.

    If you send multiple tasks at the same time, the `taskUUID` will help you match the responses to the correct tasks.

    The `taskUUID` must be unique for each task you send to the API.

### [outputType](https://runware.ai/docs/en/audio-inference/api-reference#request-outputtype) "base64Data" | "dataURI" | "URL" Default: URL
:   Specifies the output type in which the audio is returned. Supported values are: `dataURI`, `URL`, and `base64Data`.

    - `base64Data`: The audio is returned as a base64-encoded string using the `audioBase64Data` parameter in the response object.
    - `dataURI`: The audio is returned as a data URI string using the `audioDataURI` parameter in the response object.
    - `URL`: The audio is returned as a URL string using the `audioURL` parameter in the response object.

### [outputFormat](https://runware.ai/docs/en/audio-inference/api-reference#request-outputformat) "MP3" Default: MP3
:   Specifies the format of the output audio. Supported formats are: `MP3`.

    - `MP3`: MPEG-3 audio format, widely compatible and recommended for most use cases.

### [webhookURL](https://runware.ai/docs/en/audio-inference/api-reference#request-webhookurl) string
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

### [deliveryMethod](https://runware.ai/docs/en/audio-inference/api-reference#request-deliverymethod) "sync" | "async" required Default: sync
:   Determines how the API delivers task results. Choose between immediate synchronous delivery or polling-based asynchronous delivery depending on your task requirements.

    **Sync mode (`"sync"`)**:

    Returns complete results directly in the API response when processing completes within the timeout window. For long-running tasks like audio/video generation or model uploads, the request will timeout before completion, though the task continues processing in the background and results remain accessible through the dashboard.

    **Async mode (`"async"`)**:

    Returns an immediate acknowledgment with the task UUID, requiring you to poll for results using [getResponse](/docs/en/utilities/task-responses) once processing completes. This approach prevents timeout issues and allows your application to handle other operations while waiting.

    **Polling workflow (async)**:

    1. Submit request with `deliveryMethod: "async"`.
    2. Receive immediate response with the task UUID.
    3. Poll for completion using `getResponse` task.
    4. Retrieve final results when status shows `"success"`.

    **When to use each mode**:

    - **Sync**: Short audio clips, simple processing tasks.
    - **Async**: Long-form audio generation, complex compositions, or any task that usually takes more than 60 seconds.

    Async mode is required for computationally intensive operations to avoid timeout errors.

### [uploadEndpoint](https://runware.ai/docs/en/audio-inference/api-reference#request-uploadendpoint) string
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

### [ttl](https://runware.ai/docs/en/audio-inference/api-reference#request-ttl) integer Min: 60
:   Specifies the time-to-live (TTL) in seconds for generated content when using URL output. This determines how long the generated content will be available at the provided URL before being automatically deleted.

    This parameter only takes effect when `outputType` is set to `"URL"`. It has no effect on other output types.

### [includeCost](https://runware.ai/docs/en/audio-inference/api-reference#request-includecost) boolean Default: false
:   If set to `true`, the cost to perform the task will be included in the response object.

### [positivePrompt](https://runware.ai/docs/en/audio-inference/api-reference#request-positiveprompt) string required
:   The text description that guides the audio generation process. This prompt defines what you want to hear in the generated audio content.

    The model processes this text to understand the desired audio content and creates sound that matches your description. More detailed and specific prompts typically produce better results.

    For optimal results, describe the type of audio (music, speech, sound effects), style or characteristics, and any specific elements you want to include in the generated audio.

### [model](https://runware.ai/docs/en/audio-inference/api-reference#request-model) string required
:   The AI model to use for audio generation. Different models excel at different types of content, from music composition to sound effects and speech synthesis.

    Models are identified by their [AIR](/docs/en/image-inference/models#air-system) (Artificial Intelligence Resource) identifier in the format `provider:id@version`. You can find the AIR identifier of the model you want to use in our [Model Explorer](https://my.runware.ai/models/all), which is a tool that allows you to search for models based on their characteristics, powered by the [Model Search](/docs/en/utilities/model-search) API task.

    Choose models based on your desired output type (music, speech, sound effects) and supported features like duration limits or audio quality.

### [duration](https://runware.ai/docs/en/audio-inference/api-reference#request-duration) float required Min: 10 Max: 300
:   The length of the generated audio in seconds. This parameter directly affects the complexity and detail of the generated content.

    Longer durations allow for more complex musical compositions, extended sound effects, or detailed speech synthesis, but require significantly more processing time and computational resources.

### [numberResults](https://runware.ai/docs/en/audio-inference/api-reference#request-numberresults) integer Min: 1 Max: 3 Default: 1
:   Specifies how many audio files to generate for the given parameters. Each audio file will have the same parameters but different seeds, resulting in variations of the same concept.

### [audioSettings](https://runware.ai/docs/en/audio-inference/api-reference#request-audiosettings) object
:   Advanced audio configuration settings that control the technical quality and characteristics of the generated audio output. This object allows you to specify detailed audio parameters for professional or specialized use cases.

      View example 

    ```
    {
      "taskType": "audioInference",
      "taskUUID": "991e641a-d2a8-4aa3-9883-9d6fe230fff8",
      "positivePrompt": "upbeat electronic music with synthesizers",
      "model": "elevenlabs:1@1",
      "duration": 30,
      "audioSettings": { 
        "sampleRate": 44100,
        "bitrate": 192
      } 
    }
    ```

       Properties
    ⁨2⁩ properties 

    `audioSettings` » `sampleRate` #### [sampleRate](https://runware.ai/docs/en/audio-inference/api-reference#request-audiosettings-samplerate) integer Min: 8000 Max: 48000 Default: 44100
    :   The sample rate of the generated audio in Hz (samples per second). Higher sample rates capture more audio detail and frequency range but result in larger file sizes.

        Common sample rates:

        - **8000 Hz**: Telephone quality, suitable for basic speech.
        - **22050 Hz**: Radio quality, adequate for most speech applications.
        - **44100 Hz**: CD quality, standard for music and high-quality audio.
        - **48000 Hz**: Professional audio standard, used in video production.

        Choose based on your quality requirements and file size constraints. For music generation, 44100 Hz or higher is recommended.

    `audioSettings` » `bitrate` #### [bitrate](https://runware.ai/docs/en/audio-inference/api-reference#request-audiosettings-bitrate) integer Min: 32 Max: 320 Default: 128
    :   The bitrate of the generated audio in kbps (kilobits per second). Higher bitrates preserve more audio quality but create larger files.

        Common bitrates:

        - **64 kbps**: Low quality, suitable for voice or simple audio.
        - **128 kbps**: Standard quality, good balance of size and quality.
        - **192 kbps**: High quality, suitable for music with good compression.
        - **320 kbps**: Maximum quality, near-lossless compression for critical listening.

        Note that bitrate settings are only applicable to compressed formats like MP3 and OGG. Specifying bitrate with uncompressed formats like WAV will result in an error.

### [providerSettings](https://runware.ai/docs/en/audio-inference/api-reference#request-providersettings) object
:   Contains provider-specific configuration settings that customize the behavior of different AI models and services. Each provider has its own set of parameters that control various aspects of the generation process.

    The `providerSettings` parameter is an object that contains nested objects for each supported provider.

      Properties
    ⁨1⁩ property 

    `providerSettings` » `elevenlabs` #### [elevenlabs](https://runware.ai/docs/en/audio-inference/api-reference#request-providersettings-elevenlabs) object
    :   Configuration object for ElevenLabs specific features and settings. ElevenLabs offers advanced music composition capabilities with detailed control over musical structure and style.

          View example 

        ```
        "providerSettings": {
          "elevenlabs": { 
            "music": { 
              "compositionPlan": { 
                "positiveGlobalStyles": ["jazz", "smooth"],
                "negativeGlobalStyles": ["heavy", "distorted"],
                "sections": [ 
                  { 
                    "sectionName": "verse",
                    "positiveLocalStyles": ["piano"],
                    "negativeLocalStyles": ["drums"],
                    "duration": 10,
                    "lines": ["Smooth jazz melody flowing"] 
                  } 
                ] 
              } 
            } 
          } 
        }
        ```

           Properties
        ⁨1⁩ property 

        `providerSettings` » `elevenlabs` » `music` ##### [music](https://runware.ai/docs/en/audio-inference/api-reference#request-providersettings-elevenlabs-music) object
        :   Configuration object for ElevenLabs music generation features. This object provides detailed control over musical composition through structured planning with global styles, sections, and timing.

            When using the `music` object, the root-level `positivePrompt` parameter is not used for music generation. All musical direction comes from the structured music configuration.

            The `music` parameter is an object that contains properties defining the composition structure. You can find the properties of the music object below:

            - `positiveGlobalStyles` (array of strings, required): The styles that should be present in the entire song.
            - `negativeGlobalStyles` (array of strings, required): The styles that should not be present in the entire song.
            - `sections` (array of objects, required): The sections of the song, each containing section-specific styling and content.

            Each section object contains:

            - `sectionName` (string, required): The name of the section (1-100 characters).
            - `positiveLocalStyles` (array of strings, required): The styles that should be present in this section.
            - `negativeLocalStyles` (array of strings, required): The styles that should not be present in this section.
            - `duration` (integer, required): The duration of the section in seconds (3-120s).
            - `lines` (array of strings, required): The lyrics of the section.

              View example 

            ```
            "music": {
              "positiveGlobalStyles": ["rock", "energetic"],
              "negativeGlobalStyles": ["slow", "quiet"],
              "sections": [
                {
                  "sectionName": "intro",
                  "positiveLocalStyles": ["guitar", "buildup"],
                  "negativeLocalStyles": ["vocals"],
                  "duration": 5,
                  "lines": []
                },
                {
                  "sectionName": "chorus",
                  "positiveLocalStyles": ["vocals", "powerful"],
                  "negativeLocalStyles": ["quiet"],
                  "duration": 15,
                  "lines": ["We are the champions of the world"]
                }
              ]
            }
            ```

## [Response](#response)

Audio inference operations return results either synchronously or asynchronously depending on the `deliveryMethod` parameter and processing complexity.

For synchronous operations, results are returned immediately:

```
{
  "data": [
    {
      "taskType": "audioInference",
      "taskUUID": "a770f077-f413-47de-9dac-be0b26a35da6",
      "audioUUID": "77da2d99-a6d3-44d9-b8c0-ae9fb06b6200",
      "audioURL": "https://am.runware.ai/audio/ws/0.5/ai/a770f077-f413-47de-9dac-be0b26a35da6.mp3",
      "cost": 0.045
    }
  ]
}
```

For asynchronous operations, you'll need to use the [`getResponse`](/docs/en/utilities/task-responses) task to poll for results:

Processing

```
{
  "data": [
    {
      "taskType": "audioInference",
      "taskUUID": "a770f077-f413-47de-9dac-be0b26a35da6",
      "status": "processing"
    }
  ]
}
```

 Success

```
{
  "data": [
    {
      "taskType": "audioInference",
      "taskUUID": "a770f077-f413-47de-9dac-be0b26a35da6",
      "status": "success",
      "audioUUID": "77da2d99-a6d3-44d9-b8c0-ae9fb06b6200",
      "audioURL": "https://am.runware.ai/audio/ws/0.5/ai/a770f077-f413-47de-9dac-be0b26a35da6.mp3",
      "cost": 0.045
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
      "taskUUID": "a770f077-f413-47de-9dac-be0b26a35da6"
      "status": "error",
      "message": "The external provider did not respond within the timeout window. The request was automatically terminated.",
      "documentation": "https://runware.ai/docs/en/audio-inference/api-reference",
    }
  ]
}
```

---

### [taskType](https://runware.ai/docs/en/audio-inference/api-reference#response-tasktype) string
:   The API will return the `taskType` you sent in the request. In this case, it will be `audioInference`. This helps match the responses to the correct task type.

### [taskUUID](https://runware.ai/docs/en/audio-inference/api-reference#response-taskuuid) string UUID v4
:   The API will return the `taskUUID` you sent in the request. This way you can match the responses to the correct request tasks.

### [audioUUID](https://runware.ai/docs/en/audio-inference/api-reference#response-audiouuid) string UUID v4
:   A unique identifier for the generated audio. This UUID can be used to reference the audio in subsequent operations or for tracking purposes.

    The `audioUUID` is different from the `taskUUID`. While `taskUUID` identifies the generation request, `audioUUID` identifies the specific audio output.

### [audioURL](https://runware.ai/docs/en/audio-inference/api-reference#response-audiourl) string
:   If `outputType` is set to `URL`, this parameter contains the URL of the audio to be downloaded.

### [audioBase64Data](https://runware.ai/docs/en/audio-inference/api-reference#response-audiobase64data) string
:   If `outputType` is set to `base64Data`, this parameter contains the base64-encoded audio data.

### [audioDataURI](https://runware.ai/docs/en/audio-inference/api-reference#response-audiodatauri) string
:   If `outputType` is set to `dataURI`, this parameter contains the data URI of the audio.

### [cost](https://runware.ai/docs/en/audio-inference/api-reference#response-cost) float
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