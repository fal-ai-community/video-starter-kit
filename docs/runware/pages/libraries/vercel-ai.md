---
title: Vercel AI SDK integration
source_url: https://runware.ai/docs/en/libraries/vercel-ai
fetched_at: 2025-10-27 03:51:34
---

## [Introduction](#introduction)

The Runware provider for Vercel AI SDK allows you to integrate Runware's image generation capabilities directly into applications built with the Vercel AI SDK. This integration provides a **standardized interface** that follows Vercel's conventions while maintaining **full access to Runware's advanced features** and flexible API.

Source code: <https://github.com/Runware/ai-sdk-provider>

## [Installation](#installation)

Install the provider package alongside the Vercel AI SDK:

```
npm install @runware/ai-sdk-provider ai@^4.3.16
```

## [Basic setup](#basic-setup)

Before you start generating images, you'll need to configure your API key. The simplest approach is to set it as an environment variable, which **keeps your credentials secure** and makes deployment easier:

```
export RUNWARE_API_KEY="your-api-key-here"
```

For advanced configuration options like setting the API key in code or custom connection settings, see the [custom provider configuration](#custom-provider-configuration) section below.

Once your API key is configured, you can generate your first image with just a few lines of code:

```
import { runware } from '@runware/ai-sdk-provider';
import { experimental_generateImage as generateImage } from 'ai';

const { image } = await generateImage({
  model: runware.image('runware:101@1'),
  prompt: 'A serene mountain landscape at sunset',
  size: '1024x1024',
});

console.log('Generated image:', image.url);
```

That's it! Your first AI-generated image is ready. The provider **handles all the API communication, authentication, and response formatting automatically**.

## [Key integration concepts](#key-integration-concepts)

### [Model selection with AIR IDs](#model-selection-with-air-ids)

Runware uses the AIR ID system to identify models across different sources. When working with the Vercel AI SDK provider, you'll specify models using this standardized format:

```
// High-quality generation with FLUX.1 Dev
const fluxDev = runware.image('runware:101@1');

// Ultra-fast generation with FLUX.1 Schnell
const fluxSchnell = runware.image('runware:100@1');

// Community models from Civitai
const civitaiModel = runware.image('civitai:133005@782002');

// Your own fine-tuned models
const customModel = runware.image('custom:your-model@1');
```

Each model offers different strengths and characteristics. You can explore the full catalog and find the perfect model for your use case in the [Model Explorer](https://my.runware.ai/models/all).

### [Accessing advanced features](#accessing-advanced-features)

While the Vercel AI SDK provides a clean, standardized interface, Runware's API offers extensive customization options. You can access these advanced features through the `providerOptions.runware` object:

```
const { image } = await generateImage({
  model: runware.image('runware:101@1'),
  prompt: 'A cyberpunk cityscape with neon lights',
  size: '1024x1024',
  providerOptions: {
    runware: {
      steps: 30,                     // Higher steps for better quality
      CFGScale: 7.5,                 // How closely to follow the prompt
      scheduler: 'DPM++ 2M',         // Sampling algorithm
      seed: 42,                      // For reproducible results
    },
  },
});
```

This approach gives you the best of both worlds: the simplicity and consistency of the Vercel AI SDK with **full access to Runware's powerful features**. For a complete list of available parameters and their effects, see our [API Reference](/docs/en/image-inference/api-reference).

## [Common usage patterns](#common-usage-patterns)

### [Image transformation](#image-transformation)

Transform existing images while preserving their basic structure. This technique is perfect for style transfer or enhancement:

```
const { image } = await generateImage({
  model: runware.image('runware:97@2'), // HiDream Dev
  prompt: 'vibrant cyberpunk style with neon lighting',
  size: '1024x1024',
  providerOptions: {
    runware: {
      seedImage: 'image-uuid-or-url',   // Accepts UUID, URL, or Base64
      strength: 0.7,                    // Controls transformation intensity
      steps: 20,
    },
  },
});
```

The `strength` parameter is crucial here. Lower values (0.1-0.4) preserve more of the original image structure, while higher values (0.7-1.0) allow more dramatic transformations. Start with 0.6 to 0.8 for most use cases.

### [Batch generation](#batch-generation)

Generate multiple variations of the same concept in a single request. This is particularly useful for giving users choices or A/B testing different approaches:

```
// Configure the model to allow multiple images
// Note: This model configuration pattern is specific to the Vercel AI SDK
const model = runware.image('runware:100@1', {
  maxImagesPerCall: 4,
  outputFormat: 'webp',
});

const { images } = await generateImage({
  model,
  prompt: 'A friendly AI assistant robot in a modern office',
  n: 4,                              // Generate 4 variations
  size: '1024x1024',
  providerOptions: {
    runware: {
      steps: 4,                      // Schnell model works well with fewer steps
    },
  },
});

// Process each generated variation
images.forEach((img, index) => {
  console.log(`Variation ${index + 1}:`, img.url);
});
```

Runware excels at batch generation, supporting **up to 20 images in a single request without any speed penalties**.

### [Precise editing with inpainting](#precise-editing-with-inpainting)

Inpainting allows you to selectively replace parts of an image while keeping the rest intact. It's like intelligent content-aware fill, but guided by AI and your specific prompts:

```
const { image } = await generateImage({
  model: runware.image('runware:102@1'), // FLUX.1 Fill - specialized for inpainting
  prompt: 'A beautiful zen garden with cherry blossoms and stone lanterns',
  size: '1024x1024',
  providerOptions: {
    runware: {
      seedImage: 'base-image-uuid',        // Your source image
      maskImage: 'mask-image-uuid',        // Black/white mask defining edit areas
      steps: 25,
    },
  },
});
```

To use inpainting effectively, create masks using any image editor where **white pixels indicate areas to regenerate and black pixels are preserved**. This technique is powerful for removing unwanted objects, changing backgrounds, or adding new elements to existing images.

## [Configuration options](#configuration-options)

### [Default provider](#default-provider)

The simplest setup uses environment variables for configuration, which works great for most applications:

```
import { runware } from '@runware/ai-sdk-provider';
// Automatically uses RUNWARE_API_KEY from environment
```

This default provider handles authentication automatically and connects to Runware's standard API endpoint.

### [Custom provider configuration](#custom-provider-configuration)

For more complex applications, you might need custom configuration. The provider supports additional options for flexibility, such as API proxying or custom authentication flows:

```
import { createRunware } from '@runware/ai-sdk-provider';

const runware = createRunware({
  apiKey: 'your-specific-api-key',         // Override environment variable
  baseURL: 'https://your-proxy.com/v1',    // Custom endpoint for proxying
  headers: {
    'X-Proxy-Auth': 'token',               // Additional headers as needed
  }
});
```

### [Model configuration](#model-configuration)

The Vercel AI SDK allows you to configure models with default parameters, which is different from Runware's native SDKs but provides a convenient way to avoid repeating common settings. These defaults apply to every generation with that model instance:

```
const highQualityModel = runware.image('runware:101@1', {
  outputFormat: 'png',       // Always use PNG for this model
  outputQuality: 95,         // High quality
  checkNSFW: true,           // Enable content filtering
  steps: 30,                 // Default to high quality
  scheduler: 'DPM++ 2M',     // Preferred scheduler
});

// Now every generation with this model uses these defaults
const { image } = await generateImage({
  model: highQualityModel,
  prompt: 'A stunning landscape photography',
  size: '1024x1024',
  // Configuration is already applied
});
```

This pattern is especially useful when you have different quality tiers or specific use cases in your application. Note that this model configuration approach is specific to the Vercel AI SDK integration.

## [Error handling](#error-handling)

Robust error handling is essential for production applications. The provider includes descriptive error messages to help you debug issues quickly and provide meaningful feedback to users:

```
try {
  const { image } = await generateImage({
    model: runware.image('runware:101@1'),
    prompt: 'A detailed architectural rendering',
    size: '1024x1024',
  });

  // Success - use the generated image
  console.log('Generated successfully:', image.url);

} catch (error) {
  if (error.name === 'RunwareAPIError') {
    // API-specific errors with detailed information
    console.error('Runware API Error:', error.message);
    console.error('Status Code:', error.status);
  } else {
    // Network errors, timeout, or other issues
    console.error('Request failed:', error.message);
  }
}
```

Common error scenarios include insufficient credits, invalid model IDs, unsupported parameter combinations, or network connectivity issues. The provider surfaces these clearly so your application can respond appropriately and provide good user experience.

## [TypeScript support](#typescript-support)

The provider includes comprehensive TypeScript definitions for all APIs, model configurations, and response types. Your IDE will provide autocomplete and type checking for the entire feature set.

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