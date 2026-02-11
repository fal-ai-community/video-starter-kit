---
title: ComfyUI integration
source_url: https://runware.ai/docs/en/libraries/comfyui
fetched_at: 2025-10-27 03:51:35
---

## [Introduction](#introduction)

Runware's ComfyUI integration brings our powerful cloud infrastructure directly into ComfyUI's node-based workflow environment. This integration **eliminates the need for specific hardware** while maintaining all the flexibility and control that makes ComfyUI special.

  ![ComfyUI interface showing Runware Image Inference with model settings, prompt, and preview of a woman with vibrant hair and dark makeup](/docs/assets/image-screenshot.D-94JGV5_2b2ln9.jpg) 

ComfyUI is a powerful tool that offers a node-based interface, allowing users to visually construct complex image generation workflows by connecting different components. However, running ComfyUI locally typically requires significant computational resources, particularly a high-end GPU with substantial VRAM. Our integration solves this challenge by handling **all resource-intensive operations in the cloud**.

The Runware integration provides a comprehensive set of nodes that connect to different Runware API features, including image generation, editing, enhancement, and more. These nodes enable you to create advanced image generation workflows without worrying about hardware limitations or performance issues, while maintaining the ability to run multiple complex workflows simultaneously and with consistent performance.

## [Installation](#installation)

### [Step 1: Install ComfyUI](#step-1-install-comfyui)

First, ensure you have ComfyUI installed. You can follow the [pre-built package guide](https://docs.comfy.org/get_started/pre_package) or the [manual installation guide](https://docs.comfy.org/get_started/manual_install).

### [Step 2: Install ComfyUI-Runware](#step-2-install-comfyui-runware)

Make sure your system have Python 3.10 or higher installed.

You can install the Runware nodes for ComfyUI using two different methods:

#### [Option 1: Using ComfyUI Manager (Recommended)](#option-1-using-comfyui-manager-recommended)

If you already have the `ComfyUI-Manager` custom node installed, this is the simplest method:

1. Open ComfyUI Manager.
2. Click on "Custom Nodes Manager".
3. Search for "Runware" or "Runware.ai".
4. Click install or update.
5. Restart ComfyUI to apply the changes.

If you don't have ComfyUI Manager installed yet or are using the beta ComfyUI desktop version, follow the instructions on the [ComfyUI-Manager GitHub Repository](https://github.com/ltdrdata/ComfyUI-Manager?tab=readme-ov-file#installation).

#### [Option 2: Manual installation](#option-2-manual-installation)

If you prefer manual installation or don't have ComfyUI Manager, follow these steps:

```
cd custom_nodes
git clone https://github.com/Runware/ComfyUI-Runware.git
cd ComfyUI-Runware
pip install -r requirements.txt
```

To start ComfyUI with our nodes:

```
python main.py --front-end-version Comfy-Org/ComfyUI_frontend@latest
```

If you're running without a GPU, add the `--cpu` flag:

```
python main.py --cpu --front-end-version Comfy-Org/ComfyUI_frontend@latest
```

### [Step 3: Explore workflows](#step-3-explore-workflows)

Inside the `ComfyUI-Runware` custom node folder, you'll find a `workflows` folder with pre-made workflows to get you started. These examples demonstrate different features and capabilities of our nodes. You can load these workflows through the ComfyUI interface to explore and modify them to create your custom workflows.

They are also available in our [GitHub repository](https://github.com/Runware/ComfyUI-Runware/tree/main/workflows).

## [API key setup](#api-key-setup)

When you first run any workflow using Runware nodes, you'll be prompted to enter your API key. This one-time setup connects your workflow to our cloud infrastructure.

You can also manage your API key later through the Runware API Manager node, which allows you to update or change your credentials at any time.

## [Available nodes](#available-nodes)

Our integration provides a comprehensive set of nodes for ComfyUI that connect to different Runware API features:

### [Configuration nodes](#configuration-nodes)

- **Runware API Manager**: Set or change your API keys and adjust the max connection timeout directly in ComfyUI, no need to edit config files manually.

### [Image generation nodes](#image-generation-nodes)

- **Runware Image Inference**: Perform advanced tasks like text-to-image, inpainting, outpainting, and more.
- **Runware PhotoMaker v2**: Create consistent character identities and styles with our photomaker pipeline.
- **Runware Model**: Choose specific models to connect with image inference.
- **Runware Refiner**: Polish and enhance generated images with advanced tools.
- **Runware VAE**: Search and connect a VAE to Image inference.

### [Enhancement nodes](#enhancement-nodes)

- **Runware LoRA**: Search and select LoRAs to enhance your workflow.
- **Runware LoRA Combine**: Combine up to three LoRAs together for complex effects.
- **Runware ControlNet Preprocessor**: Prepare images before using them as guide images in ControlNet.
- **Runware ControlNet**: Guide your image generation with ControlNet and guide images.
- **Runware ControlNet Combine**: Create complex workflows using multiple ControlNets.
- **Runware Embedding**: Search and connect embeddings to image inference.
- **Runware Embedding Combine**: Combine multiple embeddings together.
- **Runware IP-Adapter**: Use reference images to guide the style and content of generated images.
- **Runware IP-Adapter Combine**: Merge multiple IP-Adapter inputs for sophisticated image conditioning.

### [Image tools nodes](#image-tools-nodes)

- **Runware Image Upscale**: Enhance image resolution up to 4x.
- **Runware Background Removal**: Effortlessly separate subjects from backgrounds.
- **Runware Image Masking**: Automatically detect and mask specific elements like faces, hands, and more.
- **Runware Image Caption**: Generate descriptive text from images for further workflow integration.

## [Support & community](#support--community)

This is the official Runware integration, maintained by Runware Inc. We're here to help you every step of the way!

Join our [Discord community](https://discord.gg/aJ4UzvBqNU) to share your creations, get help with node configurations, connect with other creators, receive updates about new features... and much more!

### [Troubleshooting](#troubleshooting)

If you encounter issues while using the Runware nodes in ComfyUI, here's a checklist of things to verify:

- Your API key is correctly entered in the API Manager node.
- Your internet connection is stable and working.
- You've installed the latest version of the ComfyUI-Runware nodes.
- ComfyUI has been restarted after installation.
- All Python dependencies were successfully installed.
- All nodes are properly connected in your workflow.
- Required input parameters have values provided.
- Model IDs and other references are correct.
- Image dimensions are within supported ranges.
- API timeout settings are appropriate for your connection speed.
- You have sufficient credits in your Runware account.
- The ComfyUI console shows no Python errors.

When troubleshooting, always check the ComfyUI console for specific error messages that can help identify the exact issue. The console will display a task UUID for any API requests. You can submit this UUID to our support team on Discord or via support page, and we will help you resolve the issue. You can also submit an issue on our [GitHub repository](https://github.com/Runware/ComfyUI-Runware).

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