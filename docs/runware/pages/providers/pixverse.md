---
title: PixVerse
source_url: https://runware.ai/docs/en/providers/pixverse
fetched_at: 2025-10-27 03:51:45
---

## [Introduction](#introduction)

PixVerse's AI models are integrated into the Runware platform through our unified API, providing access to **advanced video generation** technology with specialized capabilities for stylistic effects and cinematic camera controls.

Through the `providerSettings.pixverse` object, you can access PixVerse's unique features such as **20+ stylized effects**, **professional camera movements**, and **motion mode controls**, while maintaining the consistency of Runware's standard API structure. This page documents the **technical specifications, parameter requirements, and provider-specific settings** for all PixVerse models available through our platform.

`providerSettings` » `pixverse` [pixverse](https://runware.ai/docs/en/video-inference/api-reference#request-providersettings-pixverse) object
:   Configuration object for PixVerse-specific features and effects. PixVerse offers unique capabilities like viral effects, camera movements, and artistic styles that enhance video generation.

    The `effect` and `cameraMovement` parameters are mutually exclusive. You can use one or the other, but not both in the same request.

      View example 

    ```
    {
      "taskType": "videoInference",
      "taskUUID": "a770f077-f413-47de-9dac-be0b26a35da6",
      "positivePrompt": "a person dancing energetically",
      "model": "pixverse:1@3",
      "duration": 8,
      "width": 1080,
      "height": 1920,
      "providerSettings": {
        "pixverse": {
          "style": "anime",
          "effect": "jiggle jiggle",
          "motionMode": "fast",
          "watermark": false
        }
      }
    }
    ```

       Properties
    ⁨6⁩ properties 

    `providerSettings` » `pixverse` » `style` [style](https://runware.ai/docs/en/video-inference/api-reference#request-providersettings-pixverse-style) string
    :   Applies artistic styling to the generated video. PixVerse supports various visual aesthetics that transform the overall look and feel of the content.

        Available styles:

        - `anime`: Japanese animation aesthetic with characteristic visual elements.
        - `3d_animation`: Three-dimensional animated style with depth and volume.
        - `clay`: Stop-motion clay animation appearance.
        - `comic`: Comic book or graphic novel visual style.
        - `cyberpunk`: Futuristic, neon-lit dystopian aesthetic.

        The style parameter affects the entire video generation process, influencing color palettes, rendering techniques, and visual characteristics to match the selected aesthetic.

    `providerSettings` » `pixverse` » `effect` [effect](https://runware.ai/docs/en/video-inference/api-reference#request-providersettings-pixverse-effect) string
    :   Applies special viral effects and templates to the video content. PixVerse offers 20 unique effects designed for social media and creative content.

        Available effects:

        - `bikini up`: Body transformation effect.
        - `the tigers touch`: Animal-themed transformation.
        - `jiggle jiggle`: Rhythmic movement effect.
        - `hug your love`: Romantic interaction template.
        - `kiss me ai`: Kiss interaction effect.
        - `subject 3 fever`: Energetic movement template.
        - `fin-tastic mermaid`: Mermaid transformation.
        - `lets ymca`: Dance movement template.
        - `skeleton dance`: Spooky dance effect.
        - `kungfu club`: Martial arts action template.
        - `boom drop`: Explosive impact effect.
        - `vroom vroom step`: Vehicle-themed movement.
        - `creepy devil smile`: Horror-themed facial effect.
        - `pubg winner hit`: Gaming victory celebration.
        - `360 microwave`: Spinning rotation effect.
        - `eye zoom challenge`: Close-up eye effect.
        - `muscle surge`: Body enhancement effect.
        - `punch face`: Impact reaction template.
        - `balloon belly`: Body inflation effect.
        - `kiss kiss`: Multiple kiss interaction.

        Cannot be used simultaneously with `cameraMovement` parameter.

    `providerSettings` » `pixverse` » `cameraMovement` [cameraMovement](https://runware.ai/docs/en/video-inference/api-reference#request-providersettings-pixverse-cameramovement) string
    :   Camera movements add professional cinematography techniques to your video content, making it more engaging and visually dynamic. PixVerse offers 21 cinematic camera movement options to enhance your videos with smooth, professional-looking motion.

        **Model compatibility**: Available on PixVerse v4 and v4.5 models. Not supported on v3.5.

        Available camera movements:

        - `horizontal_left`: Smooth horizontal movement to the left.
        - `horizontal_right`: Smooth horizontal movement to the right.
        - `vertical_up`: Vertical movement upward.
        - `vertical_down`: Vertical movement downward.
        - `zoom_in`: Gradual zoom into the subject.
        - `zoom_out`: Gradual zoom away from the subject.
        - `auto_camera`: Automatic camera movement based on scene content.
        - `crane_up`: Upward crane shot movement.
        - `quickly_zoom_in`: Fast zoom into the subject.
        - `quickly_zoom_out`: Fast zoom away from the subject.
        - `smooth_zoom_in`: Gentle, smooth zoom into the subject.
        - `camera_rotation`: Rotating camera movement around the axis.
        - `robo_arm`: Mechanical, precise camera movement.
        - `super_dolly_out`: Dramatic outward dolly movement.
        - `whip_pan`: Quick, dynamic pan movement.
        - `hitchcock`: Classic Hitchcock-style dolly zoom effect.
        - `left_follow`: Camera follows subject moving left.
        - `right_follow`: Camera follows subject moving right.
        - `pan_left`: Horizontal pan to the left.
        - `pan_right`: Horizontal pan to the right.
        - `fix_bg`: Fixed background with foreground movement.

        Cannot be used simultaneously with `effect` parameter.

    `providerSettings` » `pixverse` » `motionmode` [motionmode](https://runware.ai/docs/en/video-inference/api-reference#request-providersettings-pixverse-motionmode) string Default: normal
    :   Controls the intensity and speed of motion in the generated video.

        Available modes:

        - `normal` Standard motion intensity and pacing.
        - `fast` Increased motion speed and intensity.

        The `fast` motion mode automatically reverts to `normal` when duration is set to 8 seconds or when resolution is set to 1080p.

    `providerSettings` » `pixverse` » `soundEffectSwitch` [soundEffectSwitch](https://runware.ai/docs/en/video-inference/api-reference#request-providersettings-pixverse-soundeffectswitch) boolean Default: false
    :   Controls whether to generate background sound or music for the video.

        - **true**: Generate audio content alongside the video.
        - **false**: Create video without sound.

        When enabled, PixVerse will automatically add appropriate background audio that matches the visual content and enhances the overall viewing experience.

    `providerSettings` » `pixverse` » `soundEffectContent` [soundEffectContent](https://runware.ai/docs/en/video-inference/api-reference#request-providersettings-pixverse-soundeffectcontent) string Min: 2 Max: 2048
    :   Describes the specific type of sound effect or audio content to generate. This parameter works in conjunction with `soundEffectSwitch` to provide precise audio control.

        Provide descriptive text about the desired audio, such as "explosion", "footsteps", "ocean waves", "upbeat music", or "dramatic orchestral score". The more specific the description, the better the audio generation will match your vision.

        If left empty while `soundEffectSwitch` is enabled, the system will generate random sound effects that complement the visual content.

## [Video models](#video-models)

### [PixVerse v3.5](#pixverse-v35)

PixVerse's v3.5 model provides foundational video generation with stylization capabilities across multiple visual genres including anime, cartoon, 3D, and film styles.

**Model AIR ID**: `pixverse:1@1`.

**Supported workflows**: Text-to-video, image-to-video.

**Technical specifications**:

- Positive prompt: 2-2048 characters.
- Negative prompt: 2-2048 characters (optional).
- Supported dimensions:
  - **360p**: 640×360 (16:9), 480×360 (4:3), 360×360 (1:1), 270×360 (3:4), 360×640 (9:16).
  - **540p**: 960×540 (16:9), 720×540 (4:3), 540×540 (1:1), 405×540 (3:4), 540×960 (9:16).
  - **720p**: 1280×720 (16:9), 960×720 (4:3), 720×720 (1:1), 540×720 (3:4), 720×1280 (9:16).
  - **1080p**: 1920×1080 (16:9), 1440×1080 (4:3), 1080×1080 (1:1), 810×1080 (3:4), 1080×1920 (9:16).
- Frame rate: 16 FPS or 24 FPS (default: 16 FPS).
- Duration: 5 or 8 seconds (default: 5).
- Frame images: Supports first and last frame for `frameImages`.
- Input image requirements: Width and height between 300-4000 pixels, 20MB file size limit.

**Provider-specific settings**:

Parameters supported: [`style`](/docs/en/video-inference/api-reference#request-providersettings-pixverse-style), [`effect`](/docs/en/video-inference/api-reference#request-providersettings-pixverse-effect), [`motionMode`](/docs/en/video-inference/api-reference#request-providersettings-pixverse-motionmode).

Text-to-video

```
{
  "taskType": "videoInference",
  "taskUUID": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
  "model": "pixverse:1@1",
  "positivePrompt": "A colorful anime character dancing in a magical forest with sparkling lights",
  "duration": 5,
  "width": 1280,
  "height": 720,
  "providerSettings": {
    "pixverse": {
      "style": "anime"
    }
  }
}
```

 Image-to-video (start frame)

```
{
  "taskType": "videoInference",
  "taskUUID": "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
  "model": "pixverse:1@1",
  "frameImages": [
    {
      "inputImage": "c64351d5-4c59-42f7-95e1-eace013eddab",
      "frame": "first"
    }
  ],
  "positivePrompt": "The character starts moving and exploring the scene",
  "duration": 8,
  "width": 540,
  "height": 540,
  "providerSettings": {
    "pixverse": {
      "motionMode": "normal"
    }
  }
}
```

 Image-to-video (start/end frames)

```
{
  "taskType": "videoInference",
  "taskUUID": "550e8400-e29b-41d4-a716-446655440000",
  "model": "pixverse:1@1",
  "frameImages": [
    {
      "inputImage": "c64351d5-4c59-42f7-95e1-eace013eddab",
      "frame": "first"
    },
    {
      "inputImage": "d7e8f9a0-2b5c-4e7f-a1d3-9c8b7a6e5d4f",
      "frame": "last"
    }
  ],
  "positivePrompt": "Smooth transition between the two scenes",
  "duration": 5,
  "width": 202,
  "height": 360,
  "providerSettings": {
    "pixverse": {
      "style": "clay"
    }
  }
}
```

 Skeleton dance effect

```
{
  "taskType": "videoInference",
  "taskUUID": "6ba7b811-9dad-11d1-80b4-00c04fd430c8",
  "model": "pixverse:1@1",
  "positivePrompt": "A spooky character performing an energetic dance routine",
  "duration": 5,
  "width": 720,
  "height": 720,
  "providerSettings": {
    "pixverse": {
      "style": "comic",
      "effect": "skeleton dance",
      "motionMode": "fast"
    }
  }
}
```

 Fast motion mode

```
{
  "taskType": "videoInference",
  "taskUUID": "6ba7b812-9dad-11d1-80b4-00c04fd430c8",
  "model": "pixverse:1@1",
  "positivePrompt": "A cyberpunk motorcycle racing through neon-lit streets",
  "duration": 5,
  "width": 960,
  "height": 540,
  "providerSettings": {
    "pixverse": {
      "style": "cyberpunk",
      "motionMode": "fast"
    }
  }
}
```

### [PixVerse v4](#pixverse-v4)

PixVerse's v4 model builds on v3.5 with enhanced realism, smooth motion capabilities, and professional camera movement controls for richer storytelling.

**Model AIR ID**: `pixverse:1@2`.

**Supported workflows**: Text-to-video, image-to-video.

**Technical specifications**:

- Positive prompt: 2-2048 characters.
- Negative prompt: 2-2048 characters (optional).
- Supported dimensions:
  - **360p**: 640×360 (16:9), 480×360 (4:3), 360×360 (1:1), 360×480 (3:4), 360×640 (9:16).
  - **540p**: 960×540 (16:9), 720×540 (4:3), 540×540 (1:1), 540×720 (3:4), 540×960 (9:16).
  - **720p**: 1280×720 (16:9), 960×720 (4:3), 720×720 (1:1), 720×960 (3:4), 720×1280 (9:16).
  - **1080p**: 1920×1080 (16:9), 1440×1080 (4:3), 1080×1080 (1:1), 1080×1440 (3:4), 1080×1920 (9:16).
- Frame rate: 16 FPS or 24 FPS (default: 16 FPS).
- Duration: 5 or 8 seconds (default: 5).
- Frame images: Supports first and last frame for `frameImages`.
- Input image requirements: Width and height between 300-4000 pixels, 20MB file size limit.

**Provider-specific settings**:

Parameters supported: [`style`](/docs/en/video-inference/api-reference#request-providersettings-pixverse-style), [`effect`](/docs/en/video-inference/api-reference#request-providersettings-pixverse-effect), [`cameraMovement`](/docs/en/video-inference/api-reference#request-providersettings-pixverse-cameramovement), [`motionMode`](/docs/en/video-inference/api-reference#request-providersettings-pixverse-motionmode).

Text-to-video

```
{
  "taskType": "videoInference",
  "taskUUID": "f47ac10b-58cc-4372-a567-0e02b2c3d480",
  "model": "pixverse:1@2",
  "positivePrompt": "A majestic dragon soaring through mountain peaks at golden hour",
  "duration": 8,
  "width": 1920,
  "height": 1080,
  "providerSettings": {
    "pixverse": {
      "style": "3d_animation",
      "motionMode": "normal"
    }
  }
}
```

 Image-to-video (start frame)

```
{
  "taskType": "videoInference",
  "taskUUID": "6ba7b813-9dad-11d1-80b4-00c04fd430c8",
  "model": "pixverse:1@2",
  "frameImages": [
    {
      "inputImage": "c64351d5-4c59-42f7-95e1-eace013eddab",
      "frame": "first"
    }
  ],
  "positivePrompt": "The scene comes alive with gentle movement and atmosphere",
  "duration": 5,
  "width": 960,
  "height": 720,
  "providerSettings": {
    "pixverse": {
      "style": "clay",
      "motionMode": "fast"
    }
  }
}
```

 Image-to-video (start/end frames)

```
{
  "taskType": "videoInference",
  "taskUUID": "550e8400-e29b-41d4-a716-446655440001",
  "model": "pixverse:1@2",
  "frameImages": [
    {
      "inputImage": "c64351d5-4c59-42f7-95e1-eace013eddab",
      "frame": "first"
    },
    {
      "inputImage": "d7e8f9a0-2b5c-4e7f-a1d3-9c8b7a6e5d4f",
      "frame": "last"
    }
  ],
  "positivePrompt": "Cinematic transition between the two moments",
  "duration": 8,
  "width": 405,
  "height": 540,
  "providerSettings": {
    "pixverse": {
      "style": "comic"
    }
  }
}
```

 Jiggle jiggle effect

```
{
  "taskType": "videoInference",
  "taskUUID": "6ba7b814-9dad-11d1-80b4-00c04fd430c8",
  "model": "pixverse:1@2",
  "positivePrompt": "A cheerful character with bouncy, rhythmic movements",
  "duration": 5,
  "width": 360,
  "height": 360,
  "providerSettings": {
    "pixverse": {
      "style": "anime",
      "effect": "jiggle jiggle"
    }
  }
}
```

 Crane up camera movement

```
{
  "taskType": "videoInference",
  "taskUUID": "6ba7b815-9dad-11d1-80b4-00c04fd430c8",
  "model": "pixverse:1@2",
  "positivePrompt": "A cinematic establishing shot of a futuristic cityscape at sunset",
  "duration": 8,
  "width": 1280,
  "height": 720,
  "providerSettings": {
    "pixverse": {
      "style": "cyberpunk",
      "cameraMovement": "crane_u"
    }
  }
}
```

### [PixVerse v4.5](#pixverse-v45)

PixVerse's v4.5 model represents the flagship release with extended cinematic controls, multi-image fusion capabilities, and physics-aware motion for high-end video production.

**Model AIR ID**: `pixverse:1@3`.

**Supported workflows**: Text-to-video, image-to-video.

**Technical specifications**:

- Positive prompt: 2-2048 characters.
- Negative prompt: 2-2048 characters (optional).
- Supported dimensions:
  - **360p**: 640×360 (16:9), 480×360 (4:3), 360×360 (1:1), 360×480 (3:4), 360×640 (9:16).
  - **540p**: 960×540 (16:9), 720×540 (4:3), 540×540 (1:1), 540×720 (3:4), 540×960 (9:16).
  - **720p**: 1280×720 (16:9), 960×720 (4:3), 720×720 (1:1), 720×960 (3:4), 720×1280 (9:16).
  - **1080p**: 1920×1080 (16:9), 1440×1080 (4:3), 1080×1080 (1:1), 1080×1440 (3:4), 1080×1920 (9:16).
- Frame rate: 16 FPS or 24 FPS (default: 16 FPS).
- Duration: 5 or 8 seconds (default: 5).
- Frame images: Supports first and last frame for `frameImages`.
- Input image requirements: Width and height between 300-4000 pixels, 20MB file size limit.

**Provider-specific settings**:

Parameters supported: [`style`](/docs/en/video-inference/api-reference#request-providersettings-pixverse-style), [`effect`](/docs/en/video-inference/api-reference#request-providersettings-pixverse-effect), [`cameraMovement`](/docs/en/video-inference/api-reference#request-providersettings-pixverse-cameramovement), [`motionMode`](/docs/en/video-inference/api-reference#request-providersettings-pixverse-motionmode).

Text-to-video

```
{
  "taskType": "videoInference",
  "taskUUID": "f47ac10b-58cc-4372-a567-0e02b2c3d481",
  "model": "pixverse:1@3",
  "positivePrompt": "An epic space battle scene with detailed starships and laser effects",
  "duration": 5,
  "width": 1920,
  "height": 1080,
  "providerSettings": {
    "pixverse": {
      "style": "3d_animation",
      "motionMode": "fast"
    }
  }
}
```

 Image-to-video (start frame)

```
{
  "taskType": "videoInference",
  "taskUUID": "6ba7b816-9dad-11d1-80b4-00c04fd430c8",
  "model": "pixverse:1@3",
  "frameImages": [
    {
      "inputImage": "c64351d5-4c59-42f7-95e1-eace013eddab",
      "frame": "first"
    }
  ],
  "positivePrompt": "The portrait subject begins to smile and look around naturally",
  "duration": 8,
  "width": 607,
  "height": 1080,
  "providerSettings": {
    "pixverse": {
      "style": "comic"
    }
  }
}
```

 Image-to-video (start/end frames)

```
{
  "taskType": "videoInference",
  "taskUUID": "550e8400-e29b-41d4-a716-446655440002",
  "model": "pixverse:1@3",
  "frameImages": [
    {
      "inputImage": "c64351d5-4c59-42f7-95e1-eace013eddab",
      "frame": "first"
    },
    {
      "inputImage": "d7e8f9a0-2b5c-4e7f-a1d3-9c8b7a6e5d4f",
      "frame": "last"
    }
  ],
  "positivePrompt": "Seamless morphing transition with realistic physics",
  "duration": 5,
  "width": 720,
  "height": 720,
  "providerSettings": {
    "pixverse": {
      "style": "clay",
      "motionMode": "normal"
    }
  }
}
```

 Boom drop effect

```
{
  "taskType": "videoInference",
  "taskUUID": "6ba7b817-9dad-11d1-80b4-00c04fd430c8",
  "model": "pixverse:1@3",
  "positivePrompt": "A character performing an explosive dance move with energy effects",
  "duration": 5,
  "width": 480,
  "height": 360,
  "providerSettings": {
    "pixverse": {
      "style": "anime",
      "effect": "boom drop"
    }
  }
}
```

 Hitchcock camera movement

```
{
  "taskType": "videoInference",
  "taskUUID": "6ba7b818-9dad-11d1-80b4-00c04fd430c8",
  "model": "pixverse:1@3",
  "positivePrompt": "A dramatic close-up of a character's face revealing a shocking truth",
  "duration": 8,
  "width": 1280,
  "height": 720,
  "providerSettings": {
    "pixverse": {
      "style": "comic",
      "cameraMovement": "hitchcoc"
    }
  }
}
```

### [PixVerse v5](#pixverse-v5)

PixVerse's v5 model delivers the latest advancements in AI video generation, maintaining all the sophisticated features of v4.5 while offering enhanced performance and improved motion quality for professional video production workflows.

**Model AIR ID**: `pixverse:1@5`.

**Supported workflows**: Text-to-video, image-to-video.

**Technical specifications**:

- Positive prompt: 2-2048 characters.
- Negative prompt: 2-2048 characters (optional).
- Supported dimensions:
  - **360p**: 640×360 (16:9), 480×360 (4:3), 360×360 (1:1), 360×480 (3:4), 360×640 (9:16).
  - **540p**: 960×540 (16:9), 720×540 (4:3), 540×540 (1:1), 540×720 (3:4), 540×960 (9:16).
  - **720p**: 1280×720 (16:9), 960×720 (4:3), 720×720 (1:1), 720×960 (3:4), 720×1280 (9:16).
  - **1080p**: 1920×1080 (16:9), 1440×1080 (4:3), 1080×1080 (1:1), 1080×1440 (3:4), 1080×1920 (9:16).
- Frame rate: 16 FPS or 24 FPS (default: 16 FPS).
- Duration: 5 or 8 seconds (default: 5).
- Frame images: Supports first and last frame for `frameImages`.
- Input image requirements: Width and height between 300-4000 pixels, 20MB file size limit.

**Provider-specific settings**:

Parameters supported: [`style`](/docs/en/video-inference/api-reference#request-providersettings-pixverse-style), [`effect`](/docs/en/video-inference/api-reference#request-providersettings-pixverse-effect), [`motionMode`](/docs/en/video-inference/api-reference#request-providersettings-pixverse-motionmode).

Text-to-video

```
{
  "taskType": "videoInference",
  "taskUUID": "f47ac10b-58cc-4372-a567-0e02b2c3d482",
  "model": "pixverse:1@5",
  "positivePrompt": "A photorealistic underwater scene with colorful coral reefs and tropical fish swimming gracefully",
  "duration": 8,
  "width": 1920,
  "height": 1080,
  "providerSettings": {
    "pixverse": {
      "style": "3d_animation",
      "motionMode": "normal"
    }
  }
}
```

 Image-to-video (start frame)

```
{
  "taskType": "videoInference",
  "taskUUID": "6ba7b819-9dad-11d1-80b4-00c04fd430c8",
  "model": "pixverse:1@5",
  "frameImages": [
    {
      "inputImage": "c64351d5-4c59-42f7-95e1-eace013eddab",
      "frame": "first"
    }
  ],
  "positivePrompt": "The landscape transforms with dynamic weather changes and atmospheric effects",
  "duration": 5,
  "width": 1280,
  "height": 720,
  "providerSettings": {
    "pixverse": {
      "style": "clay",
      "motionMode": "fast"
    }
  }
}
```

 Image-to-video (start/end frames)

```
{
  "taskType": "videoInference",
  "taskUUID": "550e8400-e29b-41d4-a716-446655440003",
  "model": "pixverse:1@5",
  "frameImages": [
    {
      "inputImage": "c64351d5-4c59-42f7-95e1-eace013eddab",
      "frame": "first"
    },
    {
      "inputImage": "d7e8f9a0-2b5c-4e7f-a1d3-9c8b7a6e5d4f",
      "frame": "last"
    }
  ],
  "positivePrompt": "Fluid transformation with enhanced physics and natural motion flow",
  "duration": 8,
  "width": 960,
  "height": 540,
  "providerSettings": {
    "pixverse": {
      "style": "comic"
    }
  }
}
```

 360 microwave effect

```
{
  "taskType": "videoInference",
  "taskUUID": "6ba7b820-9dad-11d1-80b4-00c04fd430c8",
  "model": "pixverse:1@5",
  "positivePrompt": "A character spinning dramatically with swirling motion effects",
  "duration": 5,
  "width": 540,
  "height": 540,
  "providerSettings": {
    "pixverse": {
      "style": "anime",
      "effect": "360 microwave"
    }
  }
}
```

 Push in camera movement

```
{
  "taskType": "videoInference",
  "taskUUID": "6ba7b821-9dad-11d1-80b4-00c04fd430c8",
  "model": "pixverse:1@5",
  "positivePrompt": "A dramatic reveal of an ancient temple hidden in misty mountains",
  "duration": 8,
  "width": 1920,
  "height": 1080,
  "providerSettings": {
    "pixverse": {
      "style": "cyberpunk",
      "cameraMovement": "zoom_i"
    }
  }
}
```

### [PixVerse LipSync](#pixverse-lipsync)

PixVerse's LipSync model generates realistic lip synchronization from audio for characters and videos, ensuring smooth mouth movements and natural facial expressions that match the audio input. This specialized model transforms existing videos by animating lip regions to create seamless audio-visual alignment.

**Model AIR ID**: `pixverse:lipsync@1`.

**Supported workflows**: Video-to-video.

**Technical specifications**:

- Reference videos: Supports up to 1 video via `referenceVideos`.
- Audio input: Supports up to 1 audio file via `inputAudios`.
- Text-to-speech: Alternative audio input via `speech.voice` and `speech.text` (maximum 200 characters).
- Available voices: `Emily`, `James`, `Isabella`, `Liam`, `Chloe`, `Adrian`, `Harper`, `Ava`, `Sophia`, `Julia`, `Mason`, `Jack`, `Oliver`, `Ethan`, or `auto` (automatic speaker selection).
- Input video requirements: Maximum 30 seconds duration, 20MB file size limit.
- Audio input requirements: Maximum 30 seconds duration.

LipSync with audio file

```
{
  "taskType": "videoInference",
  "taskUUID": "f47ac10b-58cc-4372-a567-0e02b2c3d490",
  "model": "pixverse:lipsync@1",
  "referenceVideos": ["c64351d5-4c59-42f7-95e1-eace013eddab"],
  "inputAudios": ["b4c57832-2075-492b-bf89-9b5e3ac02503"]
}
```

 LipSync with text-to-speech

```
{
  "taskType": "videoInference",
  "taskUUID": "6ba7b827-9dad-11d1-80b4-00c04fd430c8",
  "model": "pixverse:lipsync@1",
  "referenceVideos": ["c64351d5-4c59-42f7-95e1-eace013eddab"],
  "speech": {
    "voice": "2",
    "text": "Hello, welcome to our presentation about artificial intelligence and video generation technology."
  }
}
```

 LipSync with auto voice selection

```
{
  "taskType": "videoInference",
  "taskUUID": "550e8400-e29b-41d4-a716-446655440009",
  "model": "pixverse:lipsync@1",
  "referenceVideos": ["c64351d5-4c59-42f7-95e1-eace013eddab"],
  "speech": {
    "voice": "auto",
    "text": "The system will automatically select the most suitable voice for this character."
  }
}
```

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