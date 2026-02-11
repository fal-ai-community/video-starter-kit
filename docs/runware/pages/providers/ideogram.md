---
title: Ideogram
source_url: https://runware.ai/docs/en/providers/ideogram
fetched_at: 2025-10-27 03:51:38
---

## [Introduction](#introduction)

Ideogram's AI models are integrated into the Runware platform through our unified API, providing access to **advanced image generation** technology renowned for exceptional text layout, stylized design, and visual coherence. The platform has evolved through multiple generations, offering specialized capabilities including remix, editing, reframe, and background replacement functionality.

Through the `providerSettings.ideogram` object, you can access Ideogram's unique features such as **Magic Prompt optimization**, **style reference images**, and **advanced editing workflows**, while maintaining the consistency of Runware's standard API structure. This page documents the **technical specifications, parameter requirements, and provider-specific settings** for all Ideogram models available through our platform.

`providerSettings` » `ideogram` [ideogram](https://runware.ai/docs/en/image-inference/api-reference#request-providersettings-ideogram) object
:   Configuration object for Ideogram-specific image generation settings and controls. These parameters provide access to specialized features including rendering speed optimization, prompt enhancement, style controls, and advanced editing capabilities.

      View example 

    ```
    {
      "taskType": "imageInference",
      "taskUUID": "a770f077-f413-47de-9dac-be0b26a35da6",
      "positivePrompt": "A vintage coffee shop sign with beautiful typography",
      "model": "ideogram:4@1",
      "width": 1024,
      "height": 1024,
      "providerSettings": {
        "ideogram": {
          "renderingSpeed": "QUALITY",
          "magicPrompt": "AUTO",
          "styleType": "DESIGN"
        }
      }
    }
    ```

       Properties
    ⁨8⁩ properties 

    `providerSettings` » `ideogram` » `renderingSpeed` [renderingSpeed](https://runware.ai/docs/en/image-inference/api-reference#request-providersettings-ideogram-renderingspeed) string Default: DEFAULT
    :   Controls the rendering speed and quality balance for image generation. Higher quality settings take longer but produce more refined results.

        **Available values:**

        - `TURBO`: Fastest generation with good quality (available for all models).
        - `DEFAULT`: Balanced speed and quality (available for all models).
        - `QUALITY`: Highest quality with slower generation (3.0 models only).

    `providerSettings` » `ideogram` » `magicPrompt` [magicPrompt](https://runware.ai/docs/en/image-inference/api-reference#request-providersettings-ideogram-magicprompt) string Default: AUTO
    :   Controls automatic prompt enhancement to improve generation quality and detail.

        **Available values:**

        - `AUTO`: Automatically determines whether to enhance the prompt based on content.
        - `ON`: Always enhances the input prompt with additional descriptive details.
        - `OFF`: Uses the prompt exactly as provided without enhancement.

    `providerSettings` » `ideogram` » `styleType` [styleType](https://runware.ai/docs/en/image-inference/api-reference#request-providersettings-ideogram-styletype) string Default: AUTO
    :   Specifies the visual style and rendering approach for the generated image.

        **Available values for 3.0 models:**

        - `AUTO`: Automatically selects the most appropriate style.
        - `GENERAL`: Versatile style suitable for most content types.
        - `REALISTIC`: Photorealistic rendering with natural lighting and textures.
        - `DESIGN`: Optimized for graphic design, logos, and typography.
        - `FICTION`: Stylized rendering for fictional and fantasy content.

        **Available values for 1.0/2.0/2a models:**

        - `AUTO`: Automatically selects the most appropriate style.
        - `GENERAL`: Versatile style suitable for most content types.
        - `REALISTIC`: Photorealistic rendering with natural lighting and textures.
        - `DESIGN`: Optimized for graphic design, logos, and typography.
        - `RENDER_3D`: Three-dimensional rendering style with depth and modeling effects.
        - `ANIME`: Animated style with characteristic anime/manga visual elements.
        - `FICTION`: Stylized rendering for fictional and fantasy content.

    `providerSettings` » `ideogram` » `styleReferenceImages` [styleReferenceImages](https://runware.ai/docs/en/image-inference/api-reference#request-providersettings-ideogram-stylereferenceimages) string[] Max: 4
    :   An array of reference images used to guide the visual style and aesthetic of the generated content. These images influence the overall look, color palette, and artistic approach without directly copying content.

        Supports 1-4 reference images.

        Each image can be specified in one of the following formats:

        - An UUID v4 string of a previously uploaded image or a generated image.
        - A data URI string representing the image. The data URI must be in the format `data:<mediaType>;base64,` followed by the base64-encoded image. For example: `data:image/png;base64,iVBORw0KGgo...`.
        - A base64 encoded image without the data URI prefix. For example: `iVBORw0KGgo...`.
        - A URL pointing to the image. The image must be accessible publicly.

        Supported formats are: PNG, JPG and WEBP.

        Style reference images work in combination with the `styleType` parameter to achieve the desired aesthetic.

    `providerSettings` » `ideogram` » `remixStrength` [remixStrength](https://runware.ai/docs/en/image-inference/api-reference#request-providersettings-ideogram-remixstrength) integer Min: 1 Max: 100 Default: 50
    :   Controls the intensity of transformation when using Remix models. Higher values create more dramatic changes while lower values preserve more of the original image characteristics.

    `providerSettings` » `ideogram` » `stylePreset` [stylePreset](https://runware.ai/docs/en/image-inference/api-reference#request-providersettings-ideogram-stylepreset) string
    :   Applies a predefined artistic style preset to guide the visual aesthetic and rendering approach of the generated image.

        This parameter is only available for 3.0 models (ideogram:4@1, ideogram:4@2, ideogram:4@3, ideogram:4@4, ideogram:4@5).

        **Available values**:

        `80S_ILLUSTRATION`, `90S_NOSTALGIA`, `ABSTRACT_ORGANIC`, `ANALOG_NOSTALGIA`, `ART_BRUT`, `ART_DECO`, `ART_POSTER`, `AURA`, `AVANT_GARDE`, `BAUHAUS`, `BLUEPRINT`, `BLURRY_MOTION`, `BRIGHT_ART`, `C4D_CARTOON`, `CHILDRENS_BOOK`, `COLLAGE`, `COLORING_BOOK_I`, `COLORING_BOOK_II`, `CUBISM`, `DARK_AURA`, `DOODLE`, `DOUBLE_EXPOSURE`, `DRAMATIC_CINEMA`, `EDITORIAL`, `EMOTIONAL_MINIMAL`, `ETHEREAL_PARTY`, `EXPIRED_FILM`, `FLAT_ART`, `FLAT_VECTOR`, `FOREST_REVERIE`, `GEO_MINIMALIST`, `GLASS_PRISM`, `GOLDEN_HOUR`, `GRAFFITI_I`, `GRAFFITI_II`, `HALFTONE_PRINT`, `HIGH_CONTRAST`, `HIPPIE_ERA`, `ICONIC`, `JAPANDI_FUSION`, `JAZZY`, `LONG_EXPOSURE`, `MAGAZINE_EDITORIAL`, `MINIMAL_ILLUSTRATION`, `MIXED_MEDIA`, `MONOCHROME`, `NIGHTLIFE`, `OIL_PAINTING`, `OLD_CARTOONS`, `PAINT_GESTURE`, `POP_ART`, `RETRO_ETCHING`, `RIVIERA_POP`, `SPOTLIGHT_80S`, `STYLIZED_RED`, `SURREAL_COLLAGE`, `TRAVEL_POSTER`, `VINTAGE_GEO`, `VINTAGE_POSTER`, `WATERCOLOR`, `WEIRD`, `WOODBLOCK_PRINT`.

    `providerSettings` » `ideogram` » `styleCode` [styleCode](https://runware.ai/docs/en/image-inference/api-reference#request-providersettings-ideogram-stylecode) string
    :   An 8-character hexadecimal code that applies a specific predefined style to the generation. This provides an alternative way to control visual aesthetics beyond the standard style types.

        Available only for specific 3.0 models (ideogram:4@2, ideogram:4@3, ideogram:4@4, ideogram:4@5).

        Cannot be used together with `styleType` or `referenceImages` parameters.

    `providerSettings` » `ideogram` » `colorPalette` [colorPalette](https://runware.ai/docs/en/image-inference/api-reference#request-providersettings-ideogram-colorpalette) object
    :   Defines a color palette for generation using either preset color schemes or custom color combinations with optional weights.

        This parameter is only available for Ideogram 2.0 (`ideogram:3@1`).

        **Object properties:**

        - `name` (string, optional): Preset color palette name. Available values: `EMBER`, `FRESH`, `JUNGLE`, `MAGIC`, `MELON`, `MOSAIC`, `PASTEL`, `ULTRAMARINE`.
        - `members` (array, optional): Custom color palette with hex colors and optional weights.

        **Members array objects:**

        - `colorHex` (string, required): Hexadecimal color code (e.g., `#FF5733` or `#F73`).
        - `colorWeight` (number, optional): Color influence weight between 0.05 and 1.0. Weights should descend from highest to lowest.

        Preset palette

        ```
        "colorPalette": {
          "name": "EMBER"
        }
        ```

         Custom palette

        ```
        "colorPalette": {
          "members": [
            {
              "colorHex": "#FF5733",
              "colorWeight": 1.0
            },
            {
              "colorHex": "#C70039",
              "colorWeight": 0.7
            },
            {
              "colorHex": "#900C3F",
              "colorWeight": 0.3
            }
          ]
        }
        ```

         Custom without weights

        ```
        "colorPalette": {
          "members": [
            {
              "colorHex": "#3498DB"
            },
            {
              "colorHex": "#2ECC71"
            },
            {
              "colorHex": "#F39C12"
            }
          ]
        }
        ```

## [Image models](#image-models)

### [Ideogram 1.0](#ideogram-10)

Ideogram 1.0 is the initial release of the image generation model, known for producing bold typography, clean illustrations, and stylized compositions with strong visual clarity.

**Model AIR ID**: `ideogram:1@1`.

**Supported workflows**: Text-to-image.

**Technical specifications**:

- Positive prompt: 1-2000 characters.
- Negative prompt: 1-2000 characters (optional).
- Supported dimensions: 768×1232 (10:16), 1232×768 (16:10), 720×1280 (9:16), 1280×720 (16:9), 1152×768 (3:2), 832×1248 (2:3), 1024×768 (4:3), 768×1024 (3:4), 1024×1024 (1:1), 512×1536 (1:3), 1536×512 (3:1).

**Provider-specific settings**:

Parameters supported: [`renderingSpeed`](/docs/en/image-inference/api-reference#request-providersettings-ideogram-renderingspeed), [`magicPrompt`](/docs/en/image-inference/api-reference#request-providersettings-ideogram-magicprompt), [`styleType`](/docs/en/image-inference/api-reference#request-providersettings-ideogram-styletype), [`styleReferenceImages`](/docs/en/image-inference/api-reference#request-providersettings-ideogram-stylereferenceimages).

```
{
  "taskType": "imageInference",
  "taskUUID": "f47ac10b-58cc-4372-a567-0e02b2c3d485",
  "model": "ideogram:1@1",
  "positivePrompt": "Bold vintage coffee shop logo with clean typography",
  "width": 1024,
  "height": 1024,
  "providerSettings": {
    "ideogram": {
      "renderingSpeed": "DEFAULT",
      "magicPrompt": "AUTO",
      "styleType": "DESIGN"
    }
  }
}
```

### [Ideogram 1.0 Remix](#ideogram-10-remix)

Adds support for stylistic variations and remixing in Ideogram 1.0, allowing users to explore different looks and moods from the same base concept or input.

**Model AIR ID**: `ideogram:1@2`.

**Supported workflows**: Image-to-image.

**Technical specifications**:

- Positive prompt: 1-2000 characters.
- Negative prompt: 1-2000 characters (optional).
- Supported dimensions: 768×1232 (10:16), 1232×768 (16:10), 720×1280 (9:16), 1280×720 (16:9), 1152×768 (3:2), 832×1248 (2:3), 1024×768 (4:3), 768×1024 (3:4), 1024×1024 (1:1), 512×1536 (1:3), 1536×512 (3:1).
- Reference images: Supports `referenceImages` with 1 image (required).

**Provider-specific settings**:

Parameters supported: [`renderingSpeed`](/docs/en/image-inference/api-reference#request-providersettings-ideogram-renderingspeed), [`magicPrompt`](/docs/en/image-inference/api-reference#request-providersettings-ideogram-magicprompt), [`styleType`](/docs/en/image-inference/api-reference#request-providersettings-ideogram-styletype), [`styleReferenceImages`](/docs/en/image-inference/api-reference#request-providersettings-ideogram-stylereferenceimages), [`remixStrength`](/docs/en/image-inference/api-reference#request-providersettings-ideogram-remixstrength).

```
{
  "taskType": "imageInference",
  "taskUUID": "6ba7b824-9dad-11d1-80b4-00c04fd430c8",
  "model": "ideogram:1@2",
  "referenceImages": ["c64351d5-4c59-42f7-95e1-eace013eddab"],
  "positivePrompt": "Transform this design into a futuristic cyberpunk aesthetic",
  "width": 1024,
  "height": 1024,
  "providerSettings": {
    "ideogram": {
      "remixStrength": 75,
      "styleType": "RENDER_3D",
      "magicPrompt": "ON"
    }
  }
}
```

### [Ideogram 2a](#ideogram-2a)

Ideogram 2a improves prompt following and image structure while retaining 1.0's bold aesthetic. It enables better compositions and more refined control over layout and subjects.

**Model AIR ID**: `ideogram:2@1`.

**Supported workflows**: Text-to-image.

**Technical specifications**:

- Positive prompt: 1-2000 characters.
- Supported dimensions: 1536×512 (3:1), 1536×576 (8:3), 1472×576 (23:9), 1408×576 (22:9), 1536×640 (12:5), 1472×640 (23:10), 1408×640 (11:5), 1344×640 (21:10), 1472×704 (23:11), 1408×704 (2:1), 1344×704 (21:11), 1280×704 (20:11), 1312×736 (41:23), 1280×720 (16:9), 1344×768 (7:4), 1216×704 (19:11), 1280×768 (5:3), 1152×704 (18:11), 1232×768 (77:48), 1024×640 (8:5), 1216×768 (19:12), 1248×832 (3:2), 1216×832 (19:13), 1088×768 (17:12), 1152×832 (18:13), 1152×864 (4:3), 1088×832 (17:13), 1152×896 (9:7), 1120×896 (5:4), 1024×832 (16:13), 1088×896 (17:14), 960×832 (15:13), 1024×896 (8:7), 1088×960 (17:15), 960×896 (15:14), 1024×960 (16:15), 1024×1024 (1:1), 960×1024 (15:16), 896×960 (14:15), 960×1088 (15:17), 896×1024 (7:8), 832×960 (13:15), 896×1088 (14:17), 832×1024 (13:16), 896×1120 (4:5), 896×1152 (7:9), 832×1088 (13:17), 864×1152 (3:4), 832×1152 (13:18), 768×1088 (12:17), 832×1216 (13:19), 832×1248 (2:3), 768×1216 (12:19), 640×1024 (5:8), 768×1232 (48:77), 704×1152 (11:18), 768×1280 (3:5), 704×1216 (11:19), 768×1344 (4:7), 720×1280 (9:16), 736×1312 (23:41), 704×1280 (11:20), 704×1344 (11:21), 704×1408 (1:2), 704×1472 (11:23), 640×1344 (10:21), 640×1408 (5:11), 640×1472 (10:23), 640×1536 (5:12), 576×1408 (9:22), 576×1472 (9:23), 576×1536 (3:8), 512×1536 (1:3).

**Provider-specific settings**:

Parameters supported: [`renderingSpeed`](/docs/en/image-inference/api-reference#request-providersettings-ideogram-renderingspeed), [`magicPrompt`](/docs/en/image-inference/api-reference#request-providersettings-ideogram-magicprompt), [`styleType`](/docs/en/image-inference/api-reference#request-providersettings-ideogram-styletype), [`styleReferenceImages`](/docs/en/image-inference/api-reference#request-providersettings-ideogram-stylereferenceimages).

```
{
  "taskType": "imageInference",
  "taskUUID": "550e8400-e29b-41d4-a716-446655440006",
  "model": "ideogram:2@1",
  "positivePrompt": "Modern minimalist poster design with clean typography and geometric elements",
  "width": 1024,
  "height": 1024,
  "providerSettings": {
    "ideogram": {
      "renderingSpeed": "TURBO",
      "styleType": "DESIGN",
      "magicPrompt": "AUTO"
    }
  }
}
```

### [Ideogram 2a Remix](#ideogram-2a-remix)

Built on 2a, this remix model adds expressive reinterpretation tools, useful for generating themed variations, visual transformations, and stylized edits from base inputs.

**Model AIR ID**: `ideogram:2@2`.

**Supported workflows**: Image-to-image.

**Technical specifications**:

- Positive prompt: 1-2000 characters.
- Supported dimensions: 1536×512 (3:1), 1536×576 (8:3), 1472×576 (23:9), 1408×576 (22:9), 1536×640 (12:5), 1472×640 (23:10), 1408×640 (11:5), 1344×640 (21:10), 1472×704 (23:11), 1408×704 (2:1), 1344×704 (21:11), 1280×704 (20:11), 1312×736 (41:23), 1280×720 (16:9), 1344×768 (7:4), 1216×704 (19:11), 1280×768 (5:3), 1152×704 (18:11), 1232×768 (77:48), 1024×640 (8:5), 1216×768 (19:12), 1248×832 (3:2), 1216×832 (19:13), 1088×768 (17:12), 1152×832 (18:13), 1152×864 (4:3), 1088×832 (17:13), 1152×896 (9:7), 1120×896 (5:4), 1024×832 (16:13), 1088×896 (17:14), 960×832 (15:13), 1024×896 (8:7), 1088×960 (17:15), 960×896 (15:14), 1024×960 (16:15), 1024×1024 (1:1), 960×1024 (15:16), 896×960 (14:15), 960×1088 (15:17), 896×1024 (7:8), 832×960 (13:15), 896×1088 (14:17), 832×1024 (13:16), 896×1120 (4:5), 896×1152 (7:9), 832×1088 (13:17), 864×1152 (3:4), 832×1152 (13:18), 768×1088 (12:17), 832×1216 (13:19), 832×1248 (2:3), 768×1216 (12:19), 640×1024 (5:8), 768×1232 (48:77), 704×1152 (11:18), 768×1280 (3:5), 704×1216 (11:19), 768×1344 (4:7), 720×1280 (9:16), 736×1312 (23:41), 704×1280 (11:20), 704×1344 (11:21), 704×1408 (1:2), 704×1472 (11:23), 640×1344 (10:21), 640×1408 (5:11), 640×1472 (10:23), 640×1536 (5:12), 576×1408 (9:22), 576×1472 (9:23), 576×1536 (3:8), 512×1536 (1:3).
- Reference images: Supports `referenceImages` with 1 image (required).

**Provider-specific settings**:

Parameters supported: [`renderingSpeed`](/docs/en/image-inference/api-reference#request-providersettings-ideogram-renderingspeed), [`magicPrompt`](/docs/en/image-inference/api-reference#request-providersettings-ideogram-magicprompt), [`styleType`](/docs/en/image-inference/api-reference#request-providersettings-ideogram-styletype), [`styleReferenceImages`](/docs/en/image-inference/api-reference#request-providersettings-ideogram-stylereferenceimages), [`remixStrength`](/docs/en/image-inference/api-reference#request-providersettings-ideogram-remixstrength).

```
{
  "taskType": "imageInference",
  "taskUUID": "a770f077-f413-47de-9dac-be0b26a35da7",
  "model": "ideogram:2@2",
  "referenceImages": ["c64351d5-4c59-42f7-95e1-eace013eddab"],
  "positivePrompt": "Adapt this design for a vibrant summer theme with bright colors",
  "width": 1024,
  "height": 1024,
  "providerSettings": {
    "ideogram": {
      "renderingSpeed": "TURBO",
      "remixStrength": 60,
      "styleType": "GENERAL"
    }
  }
}
```

### [Ideogram 2.0](#ideogram-20)

Ideogram 2.0 introduces major improvements in rendering quality, text generation, and layout consistency, while keeping its bold graphic identity. Ideal for branding, posters, and other types of design work.

**Model AIR ID**: `ideogram:3@1`.

**Supported workflows**: Text-to-image.

**Technical specifications**:

- Positive prompt: 1-2000 characters.
- Negative prompt: 1-2000 characters (optional).
- Supported dimensions: 1536×512 (3:1), 1536×576 (8:3), 1472×576 (23:9), 1408×576 (22:9), 1536×640 (12:5), 1472×640 (23:10), 1408×640 (11:5), 1344×640 (21:10), 1472×704 (23:11), 1408×704 (2:1), 1344×704 (21:11), 1280×704 (20:11), 1312×736 (41:23), 1280×720 (16:9), 1344×768 (7:4), 1216×704 (19:11), 1280×768 (5:3), 1152×704 (18:11), 1232×768 (77:48), 1024×640 (8:5), 1216×768 (19:12), 1248×832 (3:2), 1216×832 (19:13), 1088×768 (17:12), 1152×832 (18:13), 1152×864 (4:3), 1088×832 (17:13), 1152×896 (9:7), 1120×896 (5:4), 1024×832 (16:13), 1088×896 (17:14), 960×832 (15:13), 1024×896 (8:7), 1088×960 (17:15), 960×896 (15:14), 1024×960 (16:15), 1024×1024 (1:1), 960×1024 (15:16), 896×960 (14:15), 960×1088 (15:17), 896×1024 (7:8), 832×960 (13:15), 896×1088 (14:17), 832×1024 (13:16), 896×1120 (4:5), 896×1152 (7:9), 832×1088 (13:17), 864×1152 (3:4), 832×1152 (13:18), 768×1088 (12:17), 832×1216 (13:19), 832×1248 (2:3), 768×1216 (12:19), 640×1024 (5:8), 768×1232 (48:77), 704×1152 (11:18), 768×1280 (3:5), 704×1216 (11:19), 768×1344 (4:7), 720×1280 (9:16), 736×1312 (23:41), 704×1280 (11:20), 704×1344 (11:21), 704×1408 (1:2), 704×1472 (11:23), 640×1344 (10:21), 640×1408 (5:11), 640×1472 (10:23), 640×1536 (5:12), 576×1408 (9:22), 576×1472 (9:23), 576×1536 (3:8), 512×1536 (1:3).

**Provider-specific settings**:

Parameters supported: [`renderingSpeed`](/docs/en/image-inference/api-reference#request-providersettings-ideogram-renderingspeed), [`magicPrompt`](/docs/en/image-inference/api-reference#request-providersettings-ideogram-magicprompt), [`styleType`](/docs/en/image-inference/api-reference#request-providersettings-ideogram-styletype), [`styleReferenceImages`](/docs/en/image-inference/api-reference#request-providersettings-ideogram-stylereferenceimages), [`colorPalette`](/docs/en/image-inference/api-reference#request-providersettings-ideogram-colorpalette).

```
{
  "taskType": "imageInference",
  "taskUUID": "f47ac10b-58cc-4372-a567-0e02b2c3d486",
  "model": "ideogram:3@1",
  "positivePrompt": "Professional brand identity poster with bold typography and consistent layout",
  "width": 1024,
  "height": 1024,
  "providerSettings": {
    "ideogram": {
      "styleType": "DESIGN",
      "magicPrompt": "ON",
      "colorPalette": {
        "name": "ULTRAMARINE"
      }
    }
  }
}
```

### [Ideogram 2.0 Remix](#ideogram-20-remix)

Remix version of Ideogram 2.0, allowing creative reinterpretations of scenes with new styles or moods based on the original input.

**Model AIR ID**: `ideogram:3@2`.

**Supported workflows**: Image-to-image.

**Technical specifications**:

- Positive prompt: 1-2000 characters.
- Negative prompt: 1-2000 characters (optional).
- Supported dimensions: 1536×512 (3:1), 1536×576 (8:3), 1472×576 (23:9), 1408×576 (22:9), 1536×640 (12:5), 1472×640 (23:10), 1408×640 (11:5), 1344×640 (21:10), 1472×704 (23:11), 1408×704 (2:1), 1344×704 (21:11), 1280×704 (20:11), 1312×736 (41:23), 1280×720 (16:9), 1344×768 (7:4), 1216×704 (19:11), 1280×768 (5:3), 1152×704 (18:11), 1232×768 (77:48), 1024×640 (8:5), 1216×768 (19:12), 1248×832 (3:2), 1216×832 (19:13), 1088×768 (17:12), 1152×832 (18:13), 1152×864 (4:3), 1088×832 (17:13), 1152×896 (9:7), 1120×896 (5:4), 1024×832 (16:13), 1088×896 (17:14), 960×832 (15:13), 1024×896 (8:7), 1088×960 (17:15), 960×896 (15:14), 1024×960 (16:15), 1024×1024 (1:1), 960×1024 (15:16), 896×960 (14:15), 960×1088 (15:17), 896×1024 (7:8), 832×960 (13:15), 896×1088 (14:17), 832×1024 (13:16), 896×1120 (4:5), 896×1152 (7:9), 832×1088 (13:17), 864×1152 (3:4), 832×1152 (13:18), 768×1088 (12:17), 832×1216 (13:19), 832×1248 (2:3), 768×1216 (12:19), 640×1024 (5:8), 768×1232 (48:77), 704×1152 (11:18), 768×1280 (3:5), 704×1216 (11:19), 768×1344 (4:7), 720×1280 (9:16), 736×1312 (23:41), 704×1280 (11:20), 704×1344 (11:21), 704×1408 (1:2), 704×1472 (11:23), 640×1344 (10:21), 640×1408 (5:11), 640×1472 (10:23), 640×1536 (5:12), 576×1408 (9:22), 576×1472 (9:23), 576×1536 (3:8), 512×1536 (1:3).
- Reference images: Supports `referenceImages` with 1 image (required).

**Provider-specific settings**:

Parameters supported: [`renderingSpeed`](/docs/en/image-inference/api-reference#request-providersettings-ideogram-renderingspeed), [`magicPrompt`](/docs/en/image-inference/api-reference#request-providersettings-ideogram-magicprompt), [`styleType`](/docs/en/image-inference/api-reference#request-providersettings-ideogram-styletype), [`styleReferenceImages`](/docs/en/image-inference/api-reference#request-providersettings-ideogram-stylereferenceimages), [`remixStrength`](/docs/en/image-inference/api-reference#request-providersettings-ideogram-remixstrength).

```
{
  "taskType": "imageInference",
  "taskUUID": "6ba7b825-9dad-11d1-80b4-00c04fd430c8",
  "model": "ideogram:3@2",
  "referenceImages": ["c64351d5-4c59-42f7-95e1-eace013eddab"],
  "positivePrompt": "Reimagine this scene with a dramatic cinematic mood and realistic lighting",
  "width": 1024,
  "height": 1024,
  "providerSettings": {
    "ideogram": {
      "styleType": "REALISTIC",
      "remixStrength": 65,
      "magicPrompt": "AUTO"
    }
  }
}
```

### [Ideogram 2.0 Edit](#ideogram-20-edit)

Supports image editing via inpainting. Replace or modify selected areas while keeping the rest untouched. Ideal for logos and text corrections.

**Model AIR ID**: `ideogram:3@3`.

**Supported workflows**: Image-to-image (Inpainting).

**Technical specifications**:

- Positive prompt: 1-2000 characters.
- Supported dimensions: 1536×512 (3:1), 1536×576 (8:3), 1472×576 (23:9), 1408×576 (22:9), 1536×640 (12:5), 1472×640 (23:10), 1408×640 (11:5), 1344×640 (21:10), 1472×704 (23:11), 1408×704 (2:1), 1344×704 (21:11), 1280×704 (20:11), 1312×736 (41:23), 1280×720 (16:9), 1344×768 (7:4), 1216×704 (19:11), 1280×768 (5:3), 1152×704 (18:11), 1232×768 (77:48), 1024×640 (8:5), 1216×768 (19:12), 1248×832 (3:2), 1216×832 (19:13), 1088×768 (17:12), 1152×832 (18:13), 1152×864 (4:3), 1088×832 (17:13), 1152×896 (9:7), 1120×896 (5:4), 1024×832 (16:13), 1088×896 (17:14), 960×832 (15:13), 1024×896 (8:7), 1088×960 (17:15), 960×896 (15:14), 1024×960 (16:15), 1024×1024 (1:1), 960×1024 (15:16), 896×960 (14:15), 960×1088 (15:17), 896×1024 (7:8), 832×960 (13:15), 896×1088 (14:17), 832×1024 (13:16), 896×1120 (4:5), 896×1152 (7:9), 832×1088 (13:17), 864×1152 (3:4), 832×1152 (13:18), 768×1088 (12:17), 832×1216 (13:19), 832×1248 (2:3), 768×1216 (12:19), 640×1024 (5:8), 768×1232 (48:77), 704×1152 (11:18), 768×1280 (3:5), 704×1216 (11:19), 768×1344 (4:7), 720×1280 (9:16), 736×1312 (23:41), 704×1280 (11:20), 704×1344 (11:21), 704×1408 (1:2), 704×1472 (11:23), 640×1344 (10:21), 640×1408 (5:11), 640×1472 (10:23), 640×1536 (5:12), 576×1408 (9:22), 576×1472 (9:23), 576×1536 (3:8), 512×1536 (1:3).
- Seed image: Required.
- Mask image: Required.

**Provider-specific settings**:

Parameters supported: [`renderingSpeed`](/docs/en/image-inference/api-reference#request-providersettings-ideogram-renderingspeed), [`magicPrompt`](/docs/en/image-inference/api-reference#request-providersettings-ideogram-magicprompt), [`styleType`](/docs/en/image-inference/api-reference#request-providersettings-ideogram-styletype), [`styleReferenceImages`](/docs/en/image-inference/api-reference#request-providersettings-ideogram-stylereferenceimages).

```
{
  "taskType": "imageInference",
  "taskUUID": "550e8400-e29b-41d4-a716-446655440007",
  "model": "ideogram:3@3",
  "seedImage": "c64351d5-4c59-42f7-95e1-eace013eddab",
  "maskImage": "d7e8f9a0-2b5c-4e7f-a1d3-9c8b7a6e5d4f",
  "positivePrompt": "Replace the text with 'FRESH COFFEE' maintaining the same typography style",
  "width": 1024,
  "height": 1024,
  "providerSettings": {
    "ideogram": {
      "styleType": "DESIGN",
      "renderingSpeed": "DEFAULT"
    }
  }
}
```

### [Ideogram 2.0 Reframe](#ideogram-20-reframe)

Expands existing images with clean outpainting. Seamlessly grows your canvas while preserving style and layout, useful for posters or larger compositions.

**Model AIR ID**: `ideogram:3@4`.

**Supported workflows**: Image-to-image (Outpainting).

**Technical specifications**:

- Positive prompt: 1-2000 characters.
- Seed image: Required.
- Supported dimensions: Automatically determined (custom width/height not supported).

**Provider-specific settings**:

Parameters supported: [`renderingSpeed`](/docs/en/image-inference/api-reference#request-providersettings-ideogram-renderingspeed), [`magicPrompt`](/docs/en/image-inference/api-reference#request-providersettings-ideogram-magicprompt), [`styleType`](/docs/en/image-inference/api-reference#request-providersettings-ideogram-styletype), [`styleReferenceImages`](/docs/en/image-inference/api-reference#request-providersettings-ideogram-stylereferenceimages).

```
{
  "taskType": "imageInference",
  "taskUUID": "a770f077-f413-47de-9dac-be0b26a35da8",
  "model": "ideogram:3@4",
  "seedImage": "c64351d5-4c59-42f7-95e1-eace013eddab",
  "positivePrompt": "Expand this poster design to include more decorative border elements",
  "providerSettings": {
    "ideogram": {
      "styleType": "DESIGN",
      "magicPrompt": "ON"
    }
  }
}
```

### [Ideogram 3.0](#ideogram-30)

Ideogram 3.0 pushes design-level generation to new heights, with sharper text rendering and better composition. It also adds greater stylistic control, perfect for graphic-driven content.

**Model AIR ID**: `ideogram:4@1`.

**Supported workflows**: Text-to-image.

**Technical specifications**:

- Positive prompt: 1-2000 characters.
- Negative prompt: 1-2000 characters (optional).
- Supported dimensions: 1536×512 (3:1), 1536×576 (8:3), 1472×576 (23:9), 1408×576 (22:9), 1536×640 (12:5), 1472×640 (23:10), 1408×640 (11:5), 1344×640 (21:10), 1472×704 (23:11), 1408×704 (2:1), 1344×704 (21:11), 1280×704 (20:11), 1312×736 (41:23), 1344×768 (7:4), 1216×704 (19:11), 1280×768 (5:3), 1152×704 (18:11), 1280×800 (8:5), 1216×768 (19:12), 1248×832 (3:2), 1216×832 (19:13), 1088×768 (17:12), 1152×832 (18:13), 1152×864 (4:3), 1088×832 (17:13), 1152×896 (9:7), 1120×896 (5:4), 1024×832 (16:13), 1088×896 (17:14), 960×832 (15:13), 1024×896 (8:7), 1088×960 (17:15), 960×896 (15:14), 1024×960 (16:15), 1024×1024 (1:1), 960×1024 (15:16), 896×960 (14:15), 960×1088 (15:17), 896×1024 (7:8), 832×960 (13:15), 896×1088 (14:17), 832×1024 (13:16), 896×1120 (4:5), 896×1152 (7:9), 832×1088 (13:17), 864×1152 (3:4), 832×1152 (13:18), 768×1088 (12:17), 832×1216 (13:19), 832×1248 (2:3), 768×1216 (12:19), 800×1280 (5:8), 704×1152 (11:18), 768×1280 (3:5), 704×1216 (11:19), 768×1344 (4:7), 736×1312 (23:41), 704×1280 (11:20), 704×1344 (11:21), 704×1408 (1:2), 704×1472 (11:23), 640×1344 (10:21), 640×1408 (5:11), 640×1472 (10:23), 640×1536 (5:12), 576×1408 (9:22), 576×1472 (9:23), 576×1536 (3:8), 512×1536 (1:3).

**Provider-specific settings**:

Parameters supported: [`renderingSpeed`](/docs/en/image-inference/api-reference#request-providersettings-ideogram-renderingspeed), [`magicPrompt`](/docs/en/image-inference/api-reference#request-providersettings-ideogram-magicprompt), [`styleType`](/docs/en/image-inference/api-reference#request-providersettings-ideogram-styletype), [`styleReferenceImages`](/docs/en/image-inference/api-reference#request-providersettings-ideogram-stylereferenceimages), [`stylePreset`](/docs/en/image-inference/api-reference#request-providersettings-ideogram-stylepreset).

```
{
  "taskType": "imageInference",
  "taskUUID": "f47ac10b-58cc-4372-a567-0e02b2c3d487",
  "model": "ideogram:4@1",
  "positivePrompt": "Sophisticated art deco poster design with elegant typography and geometric patterns",
  "width": 1024,
  "height": 1024,
  "providerSettings": {
    "ideogram": {
      "renderingSpeed": "QUALITY",
      "styleType": "DESIGN",
      "stylePreset": "ART_DECO",
      "magicPrompt": "ON"
    }
  }
}
```

### [Ideogram 3.0 Remix](#ideogram-30-remix)

Enables reinterpretation of existing designs with fresh styles or palettes, while preserving structural intent. Useful for A/B design testing or creative variation.

**Model AIR ID**: `ideogram:4@2`.

**Supported workflows**: Image-to-image.

**Technical specifications**:

- Positive prompt: 1-2000 characters.
- Negative prompt: 1-2000 characters (optional).
- Supported dimensions: 1536×512 (3:1), 1536×576 (8:3), 1472×576 (23:9), 1408×576 (22:9), 1536×640 (12:5), 1472×640 (23:10), 1408×640 (11:5), 1344×640 (21:10), 1472×704 (23:11), 1408×704 (2:1), 1344×704 (21:11), 1280×704 (20:11), 1312×736 (41:23), 1344×768 (7:4), 1216×704 (19:11), 1280×768 (5:3), 1152×704 (18:11), 1280×800 (8:5), 1216×768 (19:12), 1248×832 (3:2), 1216×832 (19:13), 1088×768 (17:12), 1152×832 (18:13), 1152×864 (4:3), 1088×832 (17:13), 1152×896 (9:7), 1120×896 (5:4), 1024×832 (16:13), 1088×896 (17:14), 960×832 (15:13), 1024×896 (8:7), 1088×960 (17:15), 960×896 (15:14), 1024×960 (16:15), 1024×1024 (1:1), 960×1024 (15:16), 896×960 (14:15), 960×1088 (15:17), 896×1024 (7:8), 832×960 (13:15), 896×1088 (14:17), 832×1024 (13:16), 896×1120 (4:5), 896×1152 (7:9), 832×1088 (13:17), 864×1152 (3:4), 832×1152 (13:18), 768×1088 (12:17), 832×1216 (13:19), 832×1248 (2:3), 768×1216 (12:19), 800×1280 (5:8), 704×1152 (11:18), 768×1280 (3:5), 704×1216 (11:19), 768×1344 (4:7), 736×1312 (23:41), 704×1280 (11:20), 704×1344 (11:21), 704×1408 (1:2), 704×1472 (11:23), 640×1344 (10:21), 640×1408 (5:11), 640×1472 (10:23), 640×1536 (5:12), 576×1408 (9:22), 576×1472 (9:23), 576×1536 (3:8), 512×1536 (1:3).
- Reference images: Supports `referenceImages` with 1 image (required).

**Provider-specific settings**:

Parameters supported: [`renderingSpeed`](/docs/en/image-inference/api-reference#request-providersettings-ideogram-renderingspeed), [`magicPrompt`](/docs/en/image-inference/api-reference#request-providersettings-ideogram-magicprompt), [`styleType`](/docs/en/image-inference/api-reference#request-providersettings-ideogram-styletype), [`styleReferenceImages`](/docs/en/image-inference/api-reference#request-providersettings-ideogram-stylereferenceimages), [`remixStrength`](/docs/en/image-inference/api-reference#request-providersettings-ideogram-remixstrength), [`styleCode`](/docs/en/image-inference/api-reference#request-providersettings-ideogram-stylecode), [`stylePreset`](/docs/en/image-inference/api-reference#request-providersettings-ideogram-stylepreset).

```
{
  "taskType": "imageInference",
  "taskUUID": "6ba7b826-9dad-11d1-80b4-00c04fd430c8",
  "model": "ideogram:4@2",
  "referenceImages": ["c64351d5-4c59-42f7-95e1-eace013eddab"],
  "positivePrompt": "Transform this into a vintage travel poster aesthetic",
  "width": 1024,
  "height": 1024,
  "providerSettings": {
    "ideogram": {
      "renderingSpeed": "QUALITY",
      "stylePreset": "TRAVEL_POSTER",
      "remixStrength": 70,
      "magicPrompt": "AUTO"
    }
  }
}
```

### [Ideogram 3.0 Edit](#ideogram-30-edit)

An inpainting model that lets you surgically edit or replace parts of an image, great for polishing visuals or fixing text without starting from scratch.

**Model AIR ID**: `ideogram:4@3`.

**Supported workflows**: Image-to-image (Inpainting).

**Technical specifications**:

- Positive prompt: 1-2000 characters.
- Supported dimensions: 1536×512 (3:1), 1536×576 (8:3), 1472×576 (23:9), 1408×576 (22:9), 1536×640 (12:5), 1472×640 (23:10), 1408×640 (11:5), 1344×640 (21:10), 1472×704 (23:11), 1408×704 (2:1), 1344×704 (21:11), 1280×704 (20:11), 1312×736 (41:23), 1344×768 (7:4), 1216×704 (19:11), 1280×768 (5:3), 1152×704 (18:11), 1280×800 (8:5), 1216×768 (19:12), 1248×832 (3:2), 1216×832 (19:13), 1088×768 (17:12), 1152×832 (18:13), 1152×864 (4:3), 1088×832 (17:13), 1152×896 (9:7), 1120×896 (5:4), 1024×832 (16:13), 1088×896 (17:14), 960×832 (15:13), 1024×896 (8:7), 1088×960 (17:15), 960×896 (15:14), 1024×960 (16:15), 1024×1024 (1:1), 960×1024 (15:16), 896×960 (14:15), 960×1088 (15:17), 896×1024 (7:8), 832×960 (13:15), 896×1088 (14:17), 832×1024 (13:16), 896×1120 (4:5), 896×1152 (7:9), 832×1088 (13:17), 864×1152 (3:4), 832×1152 (13:18), 768×1088 (12:17), 832×1216 (13:19), 832×1248 (2:3), 768×1216 (12:19), 800×1280 (5:8), 704×1152 (11:18), 768×1280 (3:5), 704×1216 (11:19), 768×1344 (4:7), 736×1312 (23:41), 704×1280 (11:20), 704×1344 (11:21), 704×1408 (1:2), 704×1472 (11:23), 640×1344 (10:21), 640×1408 (5:11), 640×1472 (10:23), 640×1536 (5:12), 576×1408 (9:22), 576×1472 (9:23), 576×1536 (3:8), 512×1536 (1:3).
- Seed image: Required.
- Mask image: Required.

**Provider-specific settings**:

Parameters supported: [`renderingSpeed`](/docs/en/image-inference/api-reference#request-providersettings-ideogram-renderingspeed), [`magicPrompt`](/docs/en/image-inference/api-reference#request-providersettings-ideogram-magicprompt), [`styleType`](/docs/en/image-inference/api-reference#request-providersettings-ideogram-styletype), [`styleReferenceImages`](/docs/en/image-inference/api-reference#request-providersettings-ideogram-stylereferenceimages), [`styleCode`](/docs/en/image-inference/api-reference#request-providersettings-ideogram-stylecode), [`stylePreset`](/docs/en/image-inference/api-reference#request-providersettings-ideogram-stylepreset).

```
{
  "taskType": "imageInference",
  "taskUUID": "550e8400-e29b-41d4-a716-446655440008",
  "model": "ideogram:4@3",
  "seedImage": "c64351d5-4c59-42f7-95e1-eace013eddab",
  "maskImage": "d7e8f9a0-2b5c-4e7f-a1d3-9c8b7a6e5d4f",
  "positivePrompt": "Replace the text with 'GRAND OPENING' using the same typographic style",
  "width": 1024,
  "height": 1024,
  "providerSettings": {
    "ideogram": {
      "renderingSpeed": "QUALITY",
      "styleType": "DESIGN",
      "stylePreset": "EDITORIAL"
    }
  }
}
```

### [Ideogram 3.0 Reframe](#ideogram-30-reframe)

Expands visuals beyond their original borders using style-consistent outpainting, perfect for adapting content to new formats or aspect ratios.

**Model AIR ID**: `ideogram:4@4`.

**Supported workflows**: Image-to-image (Outpainting).

**Technical specifications**:

- Positive prompt: 1-2000 characters.
- Seed image: Required.
- Supported dimensions: Automatically determined (custom width/height not supported).

**Provider-specific settings**:

Parameters supported: [`renderingSpeed`](/docs/en/image-inference/api-reference#request-providersettings-ideogram-renderingspeed), [`magicPrompt`](/docs/en/image-inference/api-reference#request-providersettings-ideogram-magicprompt), [`styleType`](/docs/en/image-inference/api-reference#request-providersettings-ideogram-styletype), [`styleReferenceImages`](/docs/en/image-inference/api-reference#request-providersettings-ideogram-stylereferenceimages), [`styleCode`](/docs/en/image-inference/api-reference#request-providersettings-ideogram-stylecode), [`stylePreset`](/docs/en/image-inference/api-reference#request-providersettings-ideogram-stylepreset).

```
{
  "taskType": "imageInference",
  "taskUUID": "a770f077-f413-47de-9dac-be0b26a35da9",
  "model": "ideogram:4@4",
  "seedImage": "c64351d5-4c59-42f7-95e1-eace013eddab",
  "positivePrompt": "Extend this image to create a wider cinematic composition",
  "providerSettings": {
    "ideogram": {
      "renderingSpeed": "QUALITY",
      "stylePreset": "MAGAZINE_EDITORIAL",
      "magicPrompt": "AUTO"
    }
  }
}
```

### [Ideogram 3.0 Replace Background](#ideogram-30-replace-background)

Swap out the background while keeping foreground elements intact. Useful for product mockups or design overlays.

**Model AIR ID**: `ideogram:4@5`.

**Supported workflows**: Image-to-image.

**Technical specifications**:

- Positive prompt: 1-2000 characters.
- Seed image: Required.
- Supported dimensions: Automatically determined (custom width/height not supported).

**Provider-specific settings**:

Parameters supported: [`renderingSpeed`](/docs/en/image-inference/api-reference#request-providersettings-ideogram-renderingspeed), [`magicPrompt`](/docs/en/image-inference/api-reference#request-providersettings-ideogram-magicprompt), [`styleType`](/docs/en/image-inference/api-reference#request-providersettings-ideogram-styletype), [`styleReferenceImages`](/docs/en/image-inference/api-reference#request-providersettings-ideogram-stylereferenceimages), [`styleCode`](/docs/en/image-inference/api-reference#request-providersettings-ideogram-stylecode), [`stylePreset`](/docs/en/image-inference/api-reference#request-providersettings-ideogram-stylepreset).

```
{
  "taskType": "imageInference",
  "taskUUID": "f47ac10b-58cc-4372-a567-0e02b2c3d488",
  "model": "ideogram:4@5",
  "seedImage": "c64351d5-4c59-42f7-95e1-eace013eddab",
  "positivePrompt": "Replace the background with a professional studio setting with dramatic lighting",
  "providerSettings": {
    "ideogram": {
      "renderingSpeed": "QUALITY",
      "styleType": "REALISTIC",
      "stylePreset": "DRAMATIC_CINEMA"
    }
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