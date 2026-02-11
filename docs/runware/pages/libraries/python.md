---
title: Python library
source_url: https://runware.ai/docs/en/libraries/python
fetched_at: 2025-10-27 03:51:32
---

## [Introduction](#introduction)

The Runware Python SDK provides a **WebSocket-based interface** built for Python applications that need AI-powered media processing. Using Python's async/await patterns, the SDK handles connection management, authentication, and error recovery while exposing Runware's capabilities through a clean, Pythonic API.

The SDK is designed for server-side applications where you need reliable AI integration. You can use it to build web APIs or handle batch processing jobs, with support for both image and video workflows. The setup is straightforward and handles the complexity for you.

The SDK automatically handles **asynchronous operations** for tasks that require longer processing times, such as video generation. You don't need to manage polling or status checking manually, the SDK handles all the complexity behind the scenes.

## [Key SDK benefits](#key-sdk-benefits)

### [Built for Python](#built-for-python)

The SDK uses **async/await patterns** that integrate naturally with modern Python frameworks like FastAPI and asyncio-based applications. Your applications stay responsive even during intensive AI operations thanks to the asynchronous architecture.

**Comprehensive type hints** provide better IDE support, enable static analysis with tools like mypy, and help catch errors before they reach production.

The API follows **Python conventions** for method naming and error handling, so it feels natural if you're already comfortable with Python development.

### [Performance advantages](#performance-advantages)

**Persistent WebSocket connections** eliminate the connection overhead that occurs with traditional HTTP requests. This provides measurable performance improvements when you're doing multiple operations or batch processing.

**Concurrent operations** work seamlessly with Python's asyncio, letting you handle multiple requests simultaneously without blocking your application.

### [When to use the Python SDK](#when-to-use-the-python-sdk)

Choose the Python SDK for **server-side applications** that need reliable AI integration. It's especially effective for web APIs, batch processing systems, and applications where you need robust error handling and automatic retry logic.

Source: <https://github.com/Runware/sdk-python>

## [Installation](#installation)

Install the SDK using pip:

```
pip install runware
```

## [Basic setup](#basic-setup)

The Python SDK supports both environment variable and direct API key configuration. For security best practices, use environment variables:

```
export RUNWARE_API_KEY="your-api-key-here"
```

Then initialize and use the SDK:

```
import asyncio
from runware import Runware, IImageInference

async def main():
    # SDK reads RUNWARE_API_KEY automatically
    runware = Runware()
    await runware.connect()

    request = IImageInference(
        positivePrompt="A serene mountain landscape at sunset",
        model="runware:101@1",
        width=1024,
        height=1024
    )

    images = await runware.imageInference(requestImage=request)
    print(f"Generated image: {images[0].imageURL}")

if __name__ == "__main__":
    asyncio.run(main())
```

The SDK automatically handles **connection establishment, authentication, and response parsing**, allowing you to focus on your application logic.

## [Connection management](#connection-management)

### [Automatic connection handling](#automatic-connection-handling)

The Python SDK requires explicit connection establishment but handles reconnection automatically:

```
from runware import Runware

async def main():
    runware = Runware(api_key="your-api-key-here")

    # Establish connection before making requests
    await runware.connect()

    # Perform operations - connection maintained automatically
    request = IImageInference(
        positivePrompt="A bustling city street at night",
        model="runware:101@1",
        width=1024,
        height=1024
    )

    images = await runware.imageInference(requestImage=request)

    # Connection cleanup (optional - handled automatically)
    await runware.disconnect()
```

### [Connection configuration](#connection-configuration)

For applications with specific requirements, customize connection behavior:

```
runware = Runware(
    api_key="your-api-key-here",
    timeout=120,  # Custom timeout for operations
    max_retries=5,  # Retry attempts for failed requests
    retry_delay=2.0  # Delay between retries in seconds
)
```

**Connection lifecycle** is managed explicitly in Python, giving you control over when connections are established and terminated. This is particularly useful in **server applications** where you want to maintain connections across multiple requests.

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
import asyncio
from runware import Runware, IVideoInference

async def main():
    runware = Runware()
    await runware.connect()

    request = IVideoInference(
        positivePrompt="A serene mountain landscape at sunset",
        model="klingai:5@3",
        duration=10
    )

    # This call handles all async complexity internally
    videos = await runware.videoInference(requestVideo=request)
    print(f"Generated video: {videos[0].videoURL}")

if __name__ == "__main__":
    asyncio.run(main())
```

The `videoInference` method appears to work like any other async function, but internally manages the **submission, polling, and result retrieval** workflow automatically.

### [Handling long operations](#handling-long-operations)

For operations that may take several minutes, configure appropriate timeouts and retry behavior. See [Configuration options](#configuration-options) for detailed setup:

```
# Configure timeouts for long-running operations
runware = Runware(
    timeout=600,  # 10 minutes for complex video generation
    max_retries=3,
    retry_delay=2.0
)

await runware.connect()

# SDK handles extended processing time automatically
request = IVideoInference(
    positivePrompt="Complex cinematic sequence with multiple scenes",
    model="google:3@0",
    duration=8,
    width=1280,
    height=720
)

videos = await runware.videoInference(requestVideo=request)
```

**Timeout configuration** is particularly important for video operations, which can take significantly longer than image generation depending on duration and complexity.

## [Concurrent operations](#concurrent-operations)

The SDK's async design excels at handling **multiple simultaneous operations**:

```
import asyncio
from runware import Runware, IImageInference, IImageUpscale, IImageBackgroundRemoval

async def main():
    runware = Runware()
    await runware.connect()

    # Execute multiple operations concurrently
    results = await asyncio.gather(
        runware.imageInference(requestImage=IImageInference(
            positivePrompt="Abstract digital art",
            model="runware:101@1",
            width=1024,
            height=1024
        )),
        runware.imageUpscale(upscaleGanPayload=IImageUpscale(
            inputImage="existing-image-uuid",
            upscaleFactor=4
        )),

        runware.imageBackgroundRemoval(removeImageBackgroundPayload=IImageBackgroundRemoval(
            image_initiator="portrait-path.jpg"
        ))
    )

    generated_images, upscaled_image, background_removed = results
```

This concurrent execution pattern is particularly powerful for **batch processing**, **workflow automation**, and **applications that need to perform multiple operations** on the same or different inputs simultaneously.

### [Long-running concurrent operations](#long-running-concurrent-operations)

The same concurrent patterns work efficiently for **multiple long-running operations** like video generation:

```
import asyncio

async def generate_multiple_videos():
    runware = Runware()
    await runware.connect()

    # Start multiple video generations concurrently
    video_tasks = [
        runware.videoInference(requestVideo=IVideoInference(
            positivePrompt="Ocean waves at sunset",
            model="klingai:5@3",
            duration=10
        )),
        runware.videoInference(requestVideo=IVideoInference(
            positivePrompt="City traffic time-lapse",
            model="klingai:5@3",
            duration=10
        )),
        runware.videoInference(requestVideo=IVideoInference(
            positivePrompt="Forest in autumn",
            model="klingai:5@3",
            duration=10
        ))
    ]

    # All operations process simultaneously
    results = await asyncio.gather(*video_tasks)

    for i, videos in enumerate(results):
        print(f"Video {i+1}: {videos[0].videoURL}")
```

Each operation polls independently, maximizing **throughput for batch processing** scenarios.

## [Error handling](#error-handling)

The SDK provides comprehensive error handling with detailed information for debugging and user feedback:

```
from runware import Runware

async def main():
    runware = Runware()
    await runware.connect()

    try:
        request = IImageInference(
            positivePrompt="A detailed architectural rendering",
            model="runware:101@1",
            width=1024,
            height=1024
        )
        images = await runware.imageInference(requestImage=request)
        print(f"Success: {len(images)} images generated")

    except Exception as e:
        # Error information available for debugging and user feedback
        print(f"Generation failed: {e}")
        # Handle the error appropriately for your application
```

### [Batch operation error handling](#batch-operation-error-handling)

When processing multiple operations, handle partial failures gracefully:

```
async def process_batch(image_requests):
    runware = Runware()
    await runware.connect()

    results = []
    for i, request in enumerate(image_requests):
        try:
            images = await runware.imageInference(requestImage=request)
            results.append({"index": i, "success": True, "images": images})
        except Exception as e:
            results.append({"index": i, "success": False, "error": str(e)})

    return results
```

## [Integration patterns](#integration-patterns)

### [FastAPI integration](#fastapi-integration)

The SDK integrates seamlessly with FastAPI for building AI-powered web APIs:

```
from fastapi import FastAPI, HTTPException
from runware import Runware, IImageInference
import asyncio

app = FastAPI()
runware = Runware()

@app.on_event("startup")
async def startup():
    await runware.connect()

@app.on_event("shutdown")
async def shutdown():
    await runware.disconnect()

@app.post("/generate-image")
async def generate_image(prompt: str):
    try:
        request = IImageInference(
            positivePrompt=prompt,
            model="runware:101@1",
            width=1024,
            height=1024
        )
        images = await runware.imageInference(requestImage=request)
        return {"image_url": images[0].imageURL}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
```

### [Batch processing workflows](#batch-processing-workflows)

For processing large datasets or multiple files:

```
import asyncio
from pathlib import Path
from runware import Runware, IImageBackgroundRemoval

async def process_images_batch(image_folder: Path, batch_size: int = 10):
    runware = Runware()
    await runware.connect()

    image_files = list(image_folder.glob("*.jpg"))

    for i in range(0, len(image_files), batch_size):
        batch = image_files[i:i + batch_size]

        # Process batch concurrently
        tasks = [
            runware.imageBackgroundRemoval(
                removeImageBackgroundPayload=IImageBackgroundRemoval(
                    image_initiator=str(img)
                )
            ) for img in batch
        ]

        results = await asyncio.gather(*tasks, return_exceptions=True)

        # Handle results and errors
        for j, result in enumerate(results):
            if isinstance(result, Exception):
                print(f"Failed to process {batch[j]}: {result}")
            else:
                print(f"Processed {batch[j]}: {result[0].imageURL}")
```

## [Configuration options](#configuration-options)

### [Environment-based configuration](#environment-based-configuration)

The recommended approach for production applications:

```
import os
from runware import Runware

# Reads from RUNWARE_API_KEY environment variable
runware = Runware()

# Or explicitly specify environment variable name
runware = Runware(api_key=os.getenv("CUSTOM_API_KEY_NAME"))
```

### [Programmatic configuration](#programmatic-configuration)

For applications requiring dynamic configuration:

```
runware = Runware(
    api_key="your-api-key-here",
    timeout=180,           # 3 minutes timeout for complex operations
    max_retries=3,         # Retry attempts for failed operations
    retry_delay=1.5,       # Delay between retries
    base_url="wss://custom-endpoint.com/v1"  # Custom endpoint
)
```

**Timeout configuration** is particularly important for applications processing high-resolution images or using complex models that may require extended processing time.

**Retry configuration** allows you to balance between reliability and responsiveness, with higher retry counts improving success rates in unstable network conditions.

## [Type safety and IDE support](#type-safety-and-ide-support)

The SDK provides comprehensive type hints for better development experience:

```
from runware import (
    Runware,
    IImageInference,
    IImageUpscale
)
from typing import List

async def generate_and_upscale(prompt: str) -> List[str]:
    runware = Runware()
    await runware.connect()

    # Type-safe request construction
    request: IImageInference = IImageInference(
        positivePrompt=prompt,
        model="runware:101@1",
        width=512,
        height=512
    )
    images = await runware.imageInference(requestImage=request)

    # Upscale the first image
    upscale_request: IImageUpscale = IImageUpscale(
        inputImage=images[0].imageURL,
        upscaleFactor=2
    )
    upscaled = await runware.imageUpscale(upscaleGanPayload=upscale_request)

    return [upscaled[0].imageURL]
```

Type hints enable **static analysis with mypy**, **better IDE autocompletion**, and **reduced runtime errors** in production applications.

## [Best practices](#best-practices)

### [Connection lifecycle management](#connection-lifecycle-management)

**Establish connections early** in your application lifecycle, particularly in web applications where you'll handle multiple requests. Reuse connections across requests rather than establishing new ones for each operation.

**Handle connection cleanup** properly in long-running applications to prevent resource leaks, especially important in server environments.

### [Error resilience](#error-resilience)

**Implement comprehensive error handling** that distinguishes between recoverable and non-recoverable errors. Use the SDK's built-in retry mechanisms for transient failures.

**Log errors with context** including task UUIDs for debugging and monitoring in production environments.

### [Performance optimization](#performance-optimization)

**Use concurrent operations** with `asyncio.gather()` when processing multiple independent requests to maximize throughput.

**Configure appropriate timeouts** based on your operation types and infrastructure requirements.

**Batch operations** when possible to reduce connection overhead and improve overall system efficiency.

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