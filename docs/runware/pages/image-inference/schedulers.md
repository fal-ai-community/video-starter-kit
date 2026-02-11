---
title: Schedulers
source_url: https://runware.ai/docs/en/image-inference/schedulers
fetched_at: 2025-10-27 03:51:31
---

## [What schedulers do](#what-schedulers-do)

Schedulers are algorithms that control the progression of the denoising process in generative models. When generating an image, the model starts with random noise and progressively refines this noise into a coherent image. The scheduler dictates how the noise reduction happens over each iteration, impacting the quality, speed, and style of the generated image.

Although the [scheduler](/docs/en/image-inference/api-reference#request-scheduler) parameter is optional (the model's own scheduler is used by default), you can specify a different scheduler from the following tables.

## [Supported schedulers for FLUX](#supported-schedulers-for-flux)

| Scheduler | Friendly name | Description |
| --- | --- | --- |
| Euler | Euler | Basic Euler method implementation. |
| FlowMatchEulerDiscreteScheduler | FlowMatch Euler | Flow matching techniques combined with Euler's method for precision. |
| DPM++ | DPM++ | Basic implementation of the DPM++ sampling method. |
| DPM++ SDE | DPM++ SDE | Stochastic differential equations-based scheduler for high-quality images. |
| DPM++ 2M | DPM++ 2M | Enhanced DPM++ with a second-order multistep method. |
| DPM++ 2M SDE | DPM++ 2M SDE | Second-order scheduler with SDE for robust image generation. |
| DPM++ 3M | DPM++ 3M | Advanced DPM++ with a third-order multistep method. |
| Euler Beta | Euler Beta | Euler method with Beta noise scheduling. |
| Euler Exponential | Euler Exponential | Euler method with an exponential noise scheduling strategy. |
| Euler Karras | Euler Karras | Euler method with Karras noise scheduling. |
| DPM++ Beta | DPM++ Beta | DPM++ scheduler with Beta noise scheduling. |
| DPM++ Exponential | DPM++ Exponential | DPM++ scheduler with an exponential noise scheduling method. |
| DPM++ Karras | DPM++ Karras | DPM++ scheduler with Karras noise scheduling. |
| DPM++ SDE Beta | DPM++ SDE Beta | Stochastic differential equations-based scheduler with Beta noise scheduling. |
| DPM++ SDE Exponential | DPM++ SDE Exponential | Stochastic differential equations-based scheduler with exponential noise scheduling. |
| DPM++ SDE Karras | DPM++ SDE Karras | Stochastic differential equations-based scheduler with Karras noise scheduling. |
| DPM++ 2M Beta | DPM++ 2M Beta | Second-order multistep DPM++ scheduler with Beta noise scheduling. |
| DPM++ 2M Exponential | DPM++ 2M Exponential | Second-order multistep DPM++ scheduler with exponential noise scheduling. |
| DPM++ 2M Karras | DPM++ 2M Karras | Second-order multistep DPM++ scheduler with Karras noise scheduling. |
| DPM++ 2M SDE Beta | DPM++ 2M SDE Beta | Second-order multistep SDE scheduler with Beta noise scheduling. |
| DPM++ 2M SDE Exponential | DPM++ 2M SDE Exponential | Second-order multistep SDE scheduler with exponential noise scheduling. |
| DPM++ 2M SDE Karras | DPM++ 2M SDE Karras | Second-order multistep SDE scheduler with Karras noise scheduling. |
| DPM++ 3M Beta | DPM++ 3M Beta | Third-order multistep DPM++ scheduler with Beta noise scheduling. |
| DPM++ 3M Exponential | DPM++ 3M Exponential | Third-order multistep DPM++ scheduler with exponential noise scheduling. |
| DPM++ 3M Karras | DPM++ 3M Karras | Third-order multistep DPM++ scheduler with Karras noise scheduling. |

## [Supported schedulers for Stable Diffusion](#supported-schedulers-for-stable-diffusion)

| Scheduler | Friendly name | Description |
| --- | --- | --- |
| Default | Depends on model | The default scheduler used by the Stable Diffusion model. |
| DDIM | DDIM | Direct implementation of DDIM sampling method. |
| DDIMScheduler | DDIM | Accelerates denoising with fewer steps, maintaining high quality. |
| DDPMScheduler | DDPM | Standard scheduler following the original diffusion process. |
| DEISMultistepScheduler | DEIS Multistep | Efficient denoising with multiple steps for improved quality. |
| DPMSolverSinglestepScheduler | DPM-Solver Single-step | Single-step solver for direct denoising efficiency. |
| DPMSolverMultistepScheduler | DPM-Solver Multi-step | Multi-step solver enhancing denoising accuracy and stability. |
| DPMSolverMultistepInverse | DPM-Solver Multi-step Inverse | Inverse multi-step solver for reverse processes. |
| DPM++ | DPM++ | Basic implementation of DPM++ sampling method. |
| DPM++ Karras | DPM++ Karras | DPM++ scheduler with Karras noise scheduling. |
| DPM++ 2M | DPM++ 2M | Enhanced DPM++ with 2nd-order multistep method. |
| DPM++ 2M Karras | DPM++ 2M Karras | Advanced Karras scheduler with second-order method. |
| DPM++ 2M SDE Karras | DPM++ 2M SDE Karras | Combines second-order and SDE techniques for superior denoising. |
| DPM++ 2M SDE | DPM++ 2M SDE | Second-order scheduler with SDE for robust image generation. |
| DPM++ 3M | DPM++ 3M | Advanced DPM++ with 3rd-order multistep method. |
| DPM++ 3M Karras | DPM++ 3M Karras | Third-order DPM++ with Karras noise scheduling. |
| DPM++ SDE Karras | DPM++ SDE Karras | Karras method integrated with SDE for optimal denoising. |
| DPM++ SDE | DPM++ SDE | Stochastic differential equations-based scheduler for high-quality images. |
| EDMEulerScheduler | EDM Euler | Enhanced denoising with modifications to the Euler method. |
| EDMDPMSolverMultistepScheduler | EDM DPM-Solver Multi-step | EDM-enhanced multi-step solver for precision and quality. |
| Euler | Euler | Basic Euler method implementation. |
| EulerDiscreteScheduler | Euler | Utilizes Euler's method for simple and effective denoising. |
| Euler Karras | Euler Karras | Euler method with Karras noise scheduling. |
| Euler a | Euler Ancestral | Euler method with ancestral sampling variant. |
| EulerAncestralDiscreteScheduler | Euler Ancestral | Euler's method with ancestral sampling for better quality. |
| FlowMatchEulerDiscreteScheduler | FlowMatch Euler | Flow matching techniques combined with Euler's method for precision. |
| Heun | Heun | Basic implementation of Heun's method. |
| HeunDiscreteScheduler | Heun | Uses Heun's method for precise and efficient denoising. |
| Heun Karras | Heun Karras | Heun's method with Karras noise scheduling. |
| IPNDMScheduler | IPNDM | Improved pseudo numerical methods for efficient diffusion. |
| KDPM2DiscreteScheduler | KDPM2 | Second-order scheduler for refined noise reduction. |
| KDPM2AncestralDiscreteScheduler | KDPM2 Ancestral | Second-order scheduler incorporating ancestral sampling. |
| LCM | LCM | Basic implementation of Low-Complexity Method. |
| LCMScheduler | LCM | Low-complexity scheduler designed for efficient denoising with minimal computational resources. |
| LMS | LMS | Basic Linear Multi-Step method implementation. |
| LMSDiscreteScheduler | LMS | Linear multistep method for balanced speed and quality. |
| LMS Karras | LMS Karras | Linear Multi-Step method with Karras noise scheduling. |
| PNDMScheduler | PNDM | Combines numerical methods with diffusion for effective denoising. |
| TCDScheduler | TCD | Time-continuous diffusion scheduler for smooth denoising processes. |
| UniPC | UniPC | Basic Universal PC scheduler implementation. |
| UniPCMultistepScheduler | UniPC Multistep | Universal multi-step scheduler for diverse applications. |
| UniPC Karras | UniPC Karras | Universal PC scheduler with Karras noise scheduling. |
| UniPC 2M | UniPC 2M | Second-order Universal PC scheduler. |
| UniPC 2M Karras | UniPC 2M Karras | Second-order Universal PC with Karras scheduling. |
| UniPC 3M | UniPC 3M | Third-order Universal PC scheduler. |
| UniPC 3M Karras | UniPC 3M Karras | Third-order Universal PC with Karras scheduling. |

## [Extended DPM++, IPNDM, and UniPC schedulers](#extended-dpm-ipndm-and-unipc-schedulers)

Recent updates introduced new "Uniform" variants for the DPM++, IPNDM, and UniPC families.
These schedulers use different **noise weighting strategies** (such as *Uniform*, *Beta*, *Exponential*, and *Karras*) to fine-tune denoising behavior and control image sharpness, contrast, and smoothness.

| Scheduler | Friendly name | Description |
| --- | --- | --- |
| DPM++ Uniform | DPM++ Uniform | Standard DPM++ scheduler with uniform noise weighting. |
| DPM++ Uniform Beta | DPM++ Uniform Beta | Applies a Beta noise distribution for smoother tonal gradients. |
| DPM++ Uniform Exponential | DPM++ Uniform Exponential | Uses an exponential noise curve for faster denoising convergence. |
| DPM++ Uniform Karras | DPM++ Uniform Karras | Karras-style noise scaling optimized for high-frequency details. |
| DPM++ 2M Uniform | DPM++ 2M Uniform | Second-order multistep variant with uniform noise weighting. |
| DPM++ 2M SDE Uniform | DPM++ 2M SDE Uniform | Second-order SDE version using uniform noise weighting. |
| DPM++ 3M Uniform | DPM++ 3M Uniform | Third-order multistep version with uniform noise weighting. |
| DPM++ 3M SDE Uniform | DPM++ 3M SDE Uniform | Third-order SDE scheduler with uniform noise weighting. |
| IPNDM Uniform | IPNDM Uniform | Improved pseudo numerical diffusion method with uniform noise weighting. |
| IPNDM Uniform Beta | IPNDM Uniform Beta | Uses a Beta-based noise profile for stable, balanced generation. |
| IPNDM Uniform Exponential | IPNDM Uniform Exponential | Applies an exponential decay to noise scheduling. |
| IPNDM Uniform Karras | IPNDM Uniform Karras | Karras noise scaling with IPNDM’s efficient denoising core. |
| UniPC Uniform | UniPC Uniform | Universal predictor-corrector scheduler using uniform noise weighting. |
| UniPC 2M Uniform | UniPC 2M Uniform | Second-order variant for faster convergence and smooth results. |
| UniPC 3M Uniform | UniPC 3M Uniform | Third-order variant with uniform weighting for high-quality images. |
| UniPC Uniform Beta | UniPC Uniform Beta | Applies Beta weighting to balance detail and noise control. |
| UniPC Uniform Exponential | UniPC Uniform Exponential | Emphasizes early denoising with exponential noise decay. |
| UniPC Uniform Karras | UniPC Uniform Karras | Employs Karras noise scaling for crisp edges and fine textures. |

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