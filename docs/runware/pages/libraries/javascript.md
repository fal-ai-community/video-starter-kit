---
title: JavaScript library
source_url: https://runware.ai/docs/en/libraries/javascript
fetched_at: 2025-10-27 03:51:39
---

## [Introduction](#introduction)

The Runware JavaScript SDK provides a **high-performance WebSocket-based interface** built for modern web applications requiring AI-powered media processing. Unlike traditional REST APIs that require establishing new connections for each request, the SDK maintains **persistent connections** that improve performance for applications requiring multiple operations or real-time feedback.

The SDK handles all the complexity of **connection management, authentication, and error recovery** while exposing Runware's complete feature set through an intuitive Promise-based API.

**Asynchronous operations** for tasks that require longer processing times, such as video generation, are handled automatically. You don't need to manage polling or status checking manually, all the complexity is managed behind the scenes.

## [Key SDK benefits](#key-sdk-benefits)

### [Performance advantages](#performance-advantages)

**Reduced latency** is achieved by eliminating the connection establishment overhead that occurs with each HTTP request. In applications performing multiple operations, this can significantly reduce total processing time compared to REST-based approaches.

**Progressive result delivery** allows your application to display completed results immediately as they finish, rather than waiting for entire batches. This creates a more responsive user experience, particularly valuable when generating multiple variations or conducting iterative workflows.

### [Reliability features](#reliability-features)

**Automatic resilience** ensures your application remains functional even when network conditions change. The SDK detects connection issues and re-establishes connectivity transparently, queuing operations during brief disconnections and resuming when connectivity returns.

**Concurrent operation efficiency** leverages the persistent connection to handle multiple simultaneous requests without connection overhead. This makes the SDK particularly effective for applications that need to perform different types of operations simultaneously.

### [When to choose the JavaScript SDK](#when-to-choose-the-javascript-sdk)

The JavaScript SDK is optimal for applications that prioritize **performance and real-time feedback**. Consider this SDK when your application needs to perform multiple operations frequently, provide immediate user feedback during processing, or integrate AI capabilities as a core interactive feature rather than an occasional utility.

Source: <https://github.com/Runware/sdk-js>

## [Installation](#installation)

Install the SDK using your preferred package manager:

```
npm install @runware/sdk-js
```

Or using Yarn:

```
yarn add @runware/sdk-js
```

## [Basic setup](#basic-setup)

Get your API key from the [Runware dashboard](https://my.runware.ai) and initialize the SDK directly:

```
import { Runware } from "@runware/sdk-js";

const runware = new Runware({ apiKey: "your-api-key-here" });

const images = await runware.requestImages({
  positivePrompt: "A serene mountain landscape at sunset",
  model: "runware:101@1",
  width: 1024,
  height: 1024,
});

console.log('Generated image:', images[0].imageURL);
```

The SDK automatically handles **connection establishment, authentication, and response formatting**, allowing you to focus on your application logic rather than infrastructure concerns.

## [Initialization patterns](#initialization-patterns)

### [Synchronous initialization](#synchronous-initialization)

The standard pattern creates the SDK instance immediately and establishes connections on-demand:

```
import { Runware } from "@runware/sdk-js";

const runware = new Runware({
  apiKey: "your-api-key-here",
  shouldReconnect: true,
  globalMaxRetries: 3,
});

// Connection established automatically on first request
const images = await runware.requestImages({
  positivePrompt: "A bustling city street at night",
  model: "runware:101@1",
  width: 1024,
  height: 1024,
});
```

This approach is **ideal for most applications** because it's simple and the connection is established when needed.

### [Asynchronous initialization](#asynchronous-initialization)

For applications requiring **guaranteed connection readiness** before proceeding:

```
const runware = await Runware.initialize({
  apiKey: "your-api-key-here",
  timeoutDuration: 60000,
});

// Connection is established and ready
const images = await runware.requestImages({
  positivePrompt: "Professional headshot portrait",
  model: "runware:101@1",
  width: 1024,
  height: 1024,
});

// Clean shutdown when application terminates
await runware.disconnect();
```

This pattern is useful when you need to **ensure connection establishment** before performing operations, such as in server applications or when you want to handle connection errors upfront.

### [Manual connection control](#manual-connection-control)

For applications requiring **explicit connection lifecycle management**:

```
const runware = new Runware({ apiKey: "your-api-key-here" });

// Explicitly ensure connection is ready
await runware.ensureConnection();

// Perform operations with guaranteed connection
const images = await runware.requestImages({
  positivePrompt: "Professional headshot portrait",
  model: "runware:101@1",
  width: 1024,
  height: 1024,
});

// Clean shutdown when application terminates
await runware.disconnect();
```

The `ensureConnection()` method guarantees that the WebSocket connection is established before proceeding, while `disconnect()` provides clean connection termination.

## [Progressive result delivery](#progressive-result-delivery)

One of the SDK's most powerful features is **progressive result delivery**, which allows you to receive completed images immediately as they finish generating rather than waiting for entire batches:

```
const images = await runware.requestImages({
  positivePrompt: "A collection of architectural sketches",
  model: "runware:101@1",
  width: 1024,
  height: 1024,
  numberResults: 5,
  onPartialImages: (partialImages, error) => {
    if (error) {
      console.error('Generation error:', error);
      return;
    }

    // Update UI immediately as each image completes
    partialImages.forEach((image, index) => {
      displayImage(image.imageURL);
      updateProgress(partialImages.length, 5);
    });
  },
});

console.log('All images completed');
```

The progressive delivery pattern enables user experiences where users **can see completed results immediately** rather than waiting for entire batches to finish.

The `onPartialImages` callback receives arrays of completed images as they become available.

## [Asynchronous operations](#asynchronous-operations)

Some operations like video generation require **extended processing time** and use asynchronous workflows. The SDK handles all the complexity automatically, including polling for status updates and retrieving final results when ready.

### [Understanding async processing](#understanding-async-processing)

When you call methods for long-running operations, the SDK:

1. **Submits your request** and receives an immediate task acknowledgment.
2. **Polls for status updates** automatically.
3. **Returns the final results** once processing completes.

This happens transparently, you use the same async/await patterns regardless of operation duration.

### [Video generation example](#video-generation-example)

Video operations demonstrate the async processing workflow:

```
import { Runware } from '@runware/sdk-js';

async function generateVideo() {
  const runware = new Runware({
    apiKey: process.env.RUNWARE_API_KEY
  });

  await runware.connect();

  const payload = {
    positivePrompt: "A serene mountain landscape at sunset",
    model: "klingai:5@3",
    duration: 10,
    width: 1920,
    height: 1080
  };

  // This call handles all async complexity internally
  const response = await runware.videoInference(payload);
  console.log(`Generated video: ${response[0].videoURL}`);
}

generateVideo();
```

The `videoInference` method appears to work like any other async function, but internally manages the **submission, polling, and result retrieval** workflow automatically.

### [Handling long operations](#handling-long-operations)

For operations that may take several minutes, configure appropriate timeouts and retry behavior. See [Configuration options](#configuration-options) for detailed setup:

```
// Configure timeouts for long-running operations
const runware = new Runware({
    apiKey: process.env.RUNWARE_API_KEY,
    timeout: 600000,  // 10 minutes for complex video generation
    maxRetries: 3,
    retryDelay: 2000
});

await runware.connect();

// SDK handles extended processing time automatically
const payload = {
    positivePrompt: "Complex cinematic sequence with multiple scenes",
    model: "google:3@0",
    duration: 8,
    width: 1280,
    height: 720
};

const response = await runware.videoInference(payload);
```

**Timeout configuration** is particularly important for video operations, which can take significantly longer than image generation depending on duration and complexity.

## [Concurrent operations](#concurrent-operations)

The SDK's WebSocket architecture excels at **handling multiple simultaneous operations** without the connection overhead typical of HTTP-based approaches:

```
const runware = new Runware({ apiKey: "your-api-key-here" });

// Execute completely different operations simultaneously
const [
  generatedImages,
  upscaledImage,
  backgroundRemoved,
  imageCaption,
] = await Promise.all([
  runware.requestImages({
    positivePrompt: "Abstract digital art",
    numberResults: 3,
    width: 1024,
    height: 1024,
  }),
  runware.upscaleGan({
    inputImage: "some-uuid",
    upscaleFactor: 4,
  }),
  runware.removeImageBackground({
    inputImage: "some-uuid",
  }),
  runware.requestImageToText({
    inputImage: "some-uuid",
  }),
]);
```

This concurrent execution capability is particularly powerful for **workflow automation** or **batch processing**.

### [Long-running concurrent operations](#long-running-concurrent-operations)

The same concurrent patterns work efficiently for **multiple long-running operations** like video generation:

```
async function generateMultipleVideos() {
  const runware = new Runware({
    apiKey: process.env.RUNWARE_API_KEY
  });

  await runware.connect();

  // Start multiple video generations concurrently
  const videoTasks = [
    runware.videoInference({
      positivePrompt: "Ocean waves at sunset",
      model: "klingai:5@3",
      duration: 10
    }),
    runware.videoInference({
      positivePrompt: "City traffic time-lapse",
      model: "klingai:5@3",
      duration: 10
    }),
    runware.videoInference({
      positivePrompt: "Forest in autumn",
      model: "klingai:5@3",
      duration: 10
    })
  ];

  // All operations process simultaneously
  const results = await Promise.all(videoTasks);

  results.forEach((videos, index) => {
    console.log(`Video ${index + 1}: ${videos[0].videoURL}`);
  });
}
```

Each operation polls independently, maximizing **throughput for batch processing** scenarios.

## [Configuration options](#configuration-options)

The SDK accepts several configuration options that control connection behavior and default settings:

```
const runware = new Runware({
  apiKey: "your-api-key-here",

  // Connection management
  shouldReconnect: true,        // Enable automatic reconnection (default: true)
  globalMaxRetries: 3,          // Default retry attempts for all requests (default: 2)
  timeoutDuration: 90000,       // Timeout in milliseconds (default: 60000)

  // Custom WebSocket endpoint (optional)
  url: "wss://custom-endpoint.com/v1",
});
```

The **shouldReconnect** option enables automatic reconnection when WebSocket connections are lost, which is essential for maintaining reliability in web applications where network conditions can vary.

**globalMaxRetries** sets the default number of retry attempts for all requests. Individual requests can override this setting using their own `retry` parameter.

**timeoutDuration** controls how long the SDK waits for responses before timing out operations. This is particularly important for complex generations that may take longer to complete.

## [Error handling](#error-handling)

The SDK provides error information to help you handle failures appropriately:

```
try {
  const images = await runware.requestImages({
    positivePrompt: "A detailed architectural rendering",
    model: "runware:101@1",
    width: 1024,
    height: 1024,
    steps: 50,
  });

  // Process successful results
  console.log('Generated images:', images);

} catch (error) {
  // Error information available for debugging and user feedback
  console.error('Generation failed:', {
    message: error.message,
    taskUUID: error.taskUUID
  });

  // Handle the error appropriately for your application
  showErrorMessage(error.message);
}
```

When using progressive result delivery, errors can occur during the generation process:

```
const images = await runware.requestImages({
  positivePrompt: "A series of landscape photographs",
  numberResults: 8,
  width: 1024,
  height: 1024,
  onPartialImages: (partialImages, error) => {
    if (error) {
      console.error('Generation error:', error);

      // Some images may have succeeded before the error
      if (partialImages.length > 0) {
        console.log(`Partial success: ${partialImages.length} images completed`);
        processPartialResults(partialImages);
      }
      return;
    }

    // Normal progress
    updateProgressBar(partialImages.length, 8);
    displayResults(partialImages);
  }
});
```

The `onPartialImages` callback receives both successful partial results and any errors that occur, allowing you to handle partial successes gracefully.

## [Per-request configuration](#per-request-configuration)

Individual requests can override global SDK settings for specific needs:

```
const images = await runware.requestImages({
  positivePrompt: "Ultra-detailed fantasy artwork",
  model: "runware:101@1",
  width: 1024,
  height: 1024,

  // Override global settings for this specific request
  retry: 5,                     // More retries for important operations
  includeCost: true,            // Include cost information in response

  onPartialImages: (partial) => {
    // Custom progress handling for this specific request
    updateSpecializedUI(partial);
  },
});
```

The `retry` parameter allows you to specify different retry behavior for individual requests, while `includeCost` adds cost information to the response when needed. Each request can also have its own `onPartialImages` callback for customized progress handling.

## [TypeScript support](#typescript-support)

The SDK includes **TypeScript definitions** that provide compile-time type checking and IntelliSense support:

```
import {
  Runware,
  IImageInference,
  IImage,
  IError,
  ETaskType,
} from "@runware/sdk-js";

const runware = new Runware({ apiKey: "your-api-key-here" });

// Type-safe request parameters
const requestParams: IImageInference = {
  positivePrompt: "A professional product photograph",
  model: "runware:101@1",
  width: 1024,
  height: 1024,
  steps: 30,
};

// Fully typed responses
const images: IImage[] = await runware.requestImages(requestParams);

// Type-safe error handling
const handleStreamingError = (
  partialImages: IImage[],
  error: IError | null
) => {
  if (error) {
    console.error(`Task ${error.taskUUID} failed: ${error.message}`);
  }
};
```

TypeScript support extends to **all SDK methods, configuration options, and response types**, enabling better development experience and reduced runtime errors in production applications.

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