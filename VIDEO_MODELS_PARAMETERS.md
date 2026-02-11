# Runware Video Models - Complete Parameters Reference

Полная сводка параметров для всех видео моделей Runware на основе официальной документации.

---

## Google Veo Models

### Veo 2 (`google:3@0`)
- **Workflows**: Text-to-video, Image-to-video
- **Dimensions**: 1280×720 (16:9), 720×1280 (9:16)
- **FPS**: 24
- **Duration**: 5, 6, 7, или 8 секунд (default: 5)
- **Frame images**: First и last frame
- **Provider settings**:
  - `enhancePrompt`: boolean (default: true) - можно отключить
  - `generateAudio`: boolean - НЕ поддерживается для Veo 2

### Veo 3 (`google:3@1`)
- **Workflows**: Text-to-video, Image-to-video
- **Dimensions**: 1280×720 (16:9), 720×1280 (9:16), 1920×1080 (16:9), 1080×1920 (9:16)
- **FPS**: 24
- **Duration**: 8 секунд (фиксированная)
- **Frame images**: First frame only
- **Provider settings**:
  - `enhancePrompt`: **ВСЕГДА ВКЛЮЧЕН** - нельзя отключить
  - `generateAudio`: boolean (default: false)

### Veo 3 Fast (`google:3@1`)
- **Workflows**: Text-to-video, Image-to-video
- **Dimensions**: 1280×720 (16:9), 720×1280 (9:16), 1920×1080 (16:9), 1080×1920 (9:16)
- **FPS**: 24
- **Duration**: 8 секунд (фиксированная)
- **Frame images**: First и last frame
- **Provider settings**:
  - `enhancePrompt`: **ВСЕГДА ВКЛЮЧЕН** - нельзя отключить
  - `generateAudio`: boolean (default: false)

### Veo 3.1 (`google:3@2`)
- **Workflows**: Text-to-video, Image-to-video
- **Dimensions**: 1280×720 (16:9), 720×1280 (9:16), 1920×1080 (16:9), 1080×1920 (9:16)
- **FPS**: 24
- **Duration**: 8 секунд (фиксированная)
- **Frame images**: First и last frame
- **Reference images**: До 3 asset images или 1 style image (только 16:9, 8 сек)
- **Provider settings**:
  - `enhancePrompt`: **ВСЕГДА ВКЛЮЧЕН** - нельзя отключить
  - `generateAudio`: boolean (default: false)

### Veo 3.1 Fast (`google:3@3`)
- **Workflows**: Text-to-video, Image-to-video
- **Dimensions**: 1280×720 (16:9), 720×1280 (9:16), 1920×1080 (16:9), 1080×1920 (9:16)
- **FPS**: 24
- **Duration**: 8 секунд (фиксированная)
- **Frame images**: First и last frame
- **Provider settings**:
  - `enhancePrompt`: **ВСЕГДА ВКЛЮЧЕН** - нельзя отключить
  - `generateAudio`: boolean (default: false)

---

## KlingAI Models

### Kling 1.0 Standard (`klingai:1@1`)
- **Workflows**: Text-to-video, Image-to-video
- **Dimensions**: 1280×720 (16:9), 720×720 (1:1), 720×1280 (9:16)
- **FPS**: 30
- **Duration**: 5 или 10 секунд
- **CFG Scale**: 0-1 (default: 0.5)
- **Frame images**: First frame

### Kling 1.0 Pro (`klingai:1@2`)
- **Workflows**: Text-to-video, Image-to-video
- **Dimensions**: 1280×720 (16:9), 720×720 (1:1), 720×1280 (9:16)
- **FPS**: 30
- **Duration**: 5 или 10 секунд
- **CFG Scale**: 0-1 (default: 0.5)
- **Frame images**: First frame

### Kling 1.5 Standard (`klingai:2@1`)
- **Workflows**: Image-to-video ONLY
- **Dimensions**: 1280×720 (16:9), 720×720 (1:1), 720×1280 (9:16)
- **FPS**: 30
- **Duration**: 5 или 10 секунд
- **CFG Scale**: 0-1 (default: 0.5)
- **Frame images**: First frame

### Kling 1.5 Pro (`klingai:2@2`)
- **Workflows**: Image-to-video ONLY
- **Dimensions**: 1920×1080 (16:9), 1080×1080 (1:1), 1080×1920 (9:16)
- **FPS**: 30
- **Duration**: 5 или 10 секунд
- **CFG Scale**: 0-1 (default: 0.5)
- **Frame images**: First frame

### Kling 1.6 Standard (`klingai:3@1`)
- **Workflows**: Text-to-video, Image-to-video
- **Dimensions**: 1280×720 (16:9), 720×720 (1:1), 720×1280 (9:16)
- **FPS**: 30 (text-to-video), 24 (image-to-video)
- **Duration**: 5 или 10 секунд
- **CFG Scale**: 0-1 (default: 0.5)
- **Frame images**: First frame

### Kling 1.6 Pro (`klingai:3@2`)
- **Workflows**: Image-to-video ONLY
- **Dimensions**: 1920×1080 (16:9), 1080×1080 (1:1), 1080×1920 (9:16)
- **FPS**: 24
- **Duration**: 5 или 10 секунд
- **CFG Scale**: 0-1 (default: 0.5)
- **Frame images**: First frame

### Kling 2.0 Master (`klingai:4@3`)
- **Workflows**: Text-to-video, Image-to-video
- **Dimensions**: 1280×720 (16:9), 720×720 (1:1), 720×1280 (9:16)
- **FPS**: 24
- **Duration**: 5 или 10 секунд
- **CFG Scale**: 0-1 (default: 0.5)
- **Frame images**: First frame

### Kling 2.1 Standard (`klingai:5@1`)
- **Workflows**: Image-to-video ONLY
- **Dimensions**: 1280×720 (16:9), 720×720 (1:1), 720×1280 (9:16)
- **FPS**: 24
- **Duration**: 5 или 10 секунд
- **CFG Scale**: 0-1 (default: 0.5)
- **Frame images**: First frame

### Kling 2.1 Pro (`klingai:5@2`)
- **Workflows**: Image-to-video ONLY
- **Dimensions**: 1920×1080 (16:9), 1080×1080 (1:1), 1080×1920 (9:16)
- **FPS**: 24
- **Duration**: 5 или 10 секунд
- **CFG Scale**: 0-1 (default: 0.5)
- **Frame images**: First и last frame

### Kling 2.1 Master (`klingai:5@3`)
- **Workflows**: Text-to-video, Image-to-video
- **Dimensions**: 1920×1080 (16:9), 1080×1080 (1:1), 1080×1920 (9:16)
- **FPS**: 24
- **Duration**: 5 или 10 секунд
- **CFG Scale**: 0-1 (default: 0.5)
- **Frame images**: First frame

### Kling 2.5 Turbo Standard (`klingai:6@0`)
- **Workflows**: Image-to-video ONLY
- **Dimensions**: Автоматически из first frame (НЕ указывать width/height)
- **FPS**: 30
- **Duration**: 5 или 10 секунд
- **CFG Scale**: 0-1 (default: 0.5)
- **Frame images**: First frame

### Kling 2.5 Turbo Pro (`klingai:6@1`)
- **Workflows**: Text-to-video, Image-to-video
- **Dimensions**: 1280×720 (16:9), 720×720 (1:1), 720×1280 (9:16)
- **FPS**: 30
- **Duration**: 5 или 10 секунд
- **CFG Scale**: 0-1 (default: 0.5)
- **Frame images**: First frame

---

## MiniMax Models

### MiniMax 01 (`minimax:1@1`)
- **Workflows**: Text-to-video, Image-to-video, Reference-to-video
- **Dimensions**: 1366×768 (фиксированная)
- **FPS**: 25
- **Duration**: 6 секунд (фиксированная)
- **Frame images**: First frame
- **Reference images**: 1 image
- **Provider settings**:
  - `promptOptimizer`: boolean (default: false)

### MiniMax Hailuo 01 Director (`minimax:2@1`)
- **Workflows**: Text-to-video, Image-to-video
- **Dimensions**: 1366×768 (фиксированная)
- **FPS**: 25
- **Duration**: 6 секунд (фиксированная)
- **Frame images**: First frame
- **Provider settings**:
  - `promptOptimizer`: boolean (default: false)

### MiniMax Hailuo 01 Live (`minimax:2@3`)
- **Workflows**: Image-to-video ONLY
- **Dimensions**: 1366×768 (фиксированная)
- **FPS**: 25
- **Duration**: 6 секунд (фиксированная)
- **Frame images**: First frame
- **Provider settings**:
  - `promptOptimizer`: boolean (default: false)

### MiniMax Hailuo 02 (`minimax:3@1`)
- **Workflows**: Text-to-video
- **Dimensions**: 1366×768 (16:9), 1920×1080 (16:9)
- **FPS**: 25
- **Duration**:
  - 6 или 10 секунд (для 1366×768, default: 6)
  - 6 секунд (для 1920×1080)
- **Frame images**: First frame
- **Provider settings**:
  - `promptOptimizer`: boolean (default: false)

---

## OpenAI Models

### Sora 2 (`openai:3@1`)
- **Workflows**: Text-to-video, Image-to-video
- **Dimensions**: 1280×720 (16:9), 720×1280 (9:16)
- **FPS**: Автоматически
- **Duration**: 4, 8, или 12 секунд
- **Frame images**: First frame

### Sora 2 Pro (`openai:3@2`)
- **Workflows**: Text-to-video, Image-to-video
- **Dimensions**: 1280×720 (16:9), 720×1280 (9:16), 1792×1024 (7:4), 1024×1792 (4:7)
- **FPS**: Автоматически
- **Duration**: 4, 8, или 12 секунд
- **Frame images**: First frame

---

## ByteDance Models

### Seedance 1.0 Lite (`bytedance:1@1`)
- **Workflows**: Text-to-video, Image-to-video
- **Dimensions**: 864×480, 736×544, 640×640, 960×416, 416×960, 1248×704, 1120×832, 960×960, 1504×640, 640×1504
- **FPS**: 24
- **Duration**: 5 или 10 секунд (default: 5)
- **Frame images**: First и last frame
- **Provider settings**:
  - `cameraFixed`: boolean (default: false)

### Seedance 1.0 Pro (`bytedance:2@1`)
- **Workflows**: Text-to-video, Image-to-video
- **Dimensions**: 864×480, 736×544, 640×640, 544×736, 480×864, 416×960, 960×416, 1920×1088, 1664×1248, 1440×1440, 1248×1664, 1088×1920, 928×2176, 2176×928
- **FPS**: 24
- **Duration**: 5 или 10 секунд (default: 5)
- **Frame images**: First и last frame
- **Provider settings**:
  - `cameraFixed`: boolean (default: false)

### Seedance 1.0 Pro Fast (`bytedance:2@2`)
- **Workflows**: Text-to-video, Image-to-video
- **Dimensions**: (те же что и Pro)
- **FPS**: 24
- **Duration**: 1.2 - 12 секунд с шагом 0.1 (default: 5)
- **Frame images**: First frame only
- **Provider settings**:
  - `cameraFixed`: boolean (default: false)

### OmniHuman-1 (`bytedance:5@1`)
- **Workflows**: Image + Audio to Video
- **Reference images**: 1 image (required)
- **Input audios**: 1 audio (required, max 30 сек)
- **Dimensions**: Автоматически
- **FPS**: Автоматически
- **Duration**: Автоматически (по аудио)

---

## PixVerse Models

### PixVerse v3.5 (`pixverse:1@1`)
- **Workflows**: Text-to-video, Image-to-video
- **Dimensions**: 360p, 540p, 720p, 1080p (все aspect ratios)
- **FPS**: 16 или 24 (default: 16)
- **Duration**: 5 или 8 секунд (default: 5)
- **Frame images**: First и last frame
- **Provider settings**:
  - `style`: anime, 3d_animation, clay, comic, cyberpunk
  - `effect`: 20 effects (skeleton dance, jiggle jiggle, etc)
  - `motionMode`: normal, fast (default: normal)

### PixVerse v4 (`pixverse:1@2`)
- **Workflows**: Text-to-video, Image-to-video
- **Dimensions**: 360p, 540p, 720p, 1080p (все aspect ratios)
- **FPS**: 16 или 24 (default: 16)
- **Duration**: 5 или 8 секунд (default: 5)
- **Frame images**: First и last frame
- **Provider settings**:
  - `style`: anime, 3d_animation, clay, comic, cyberpunk
  - `effect`: 20 effects
  - `cameraMovement`: 21 camera movements (crane_up, zoom_in, hitchcock, etc)
  - `motionMode`: normal, fast (default: normal)

### PixVerse v4.5 (`pixverse:1@3`)
- **Workflows**: Text-to-video, Image-to-video
- **Dimensions**: 360p, 540p, 720p, 1080p (все aspect ratios)
- **FPS**: 16 или 24 (default: 16)
- **Duration**: 5 или 8 секунд (default: 5)
- **Frame images**: First и last frame
- **Provider settings**: (те же что v4)

### PixVerse v5 (`pixverse:1@5`)
- **Workflows**: Text-to-video, Image-to-video
- **Dimensions**: 360p, 540p, 720p, 1080p (все aspect ratios)
- **FPS**: 16 или 24 (default: 16)
- **Duration**: 5 или 8 секунд (default: 5)
- **Frame images**: First и last frame
- **Provider settings**:
  - `style`: anime, 3d_animation, clay, comic, cyberpunk
  - `effect`: 20 effects
  - `motionMode`: normal, fast (default: normal)
  - ⚠️ НЕТ cameraMovement

### PixVerse LipSync (`pixverse:lipsync@1`)
- **Workflows**: Video + Audio to Video
- **Reference videos**: 1 video (max 30 сек, 20MB)
- **Input audios**: 1 audio (max 30 сек) ИЛИ Text-to-speech
- **Speech voices**: Emily, James, Isabella, Liam, Chloe, Adrian, Harper, Ava, Sophia, Julia, Mason, Jack, Oliver, Ethan, auto

---

## Vidu Models

### Vidu 1.0 (Q1 Classic) (`vidu:1@0`)
- **Workflows**: First и last frame to video
- **Dimensions**: 1920×1080 (фиксированная)
- **FPS**: 24
- **Duration**: 5 секунд (фиксированная)
- **Frame images**: First и last frame (required)
- **Provider settings**:
  - `movementAmplitude`: auto, small, medium, large (default: auto)

### Vidu Q1 (`vidu:1@1`)
- **Workflows**: Text-to-video, Image-to-video
- **Dimensions**: 1920×1080 (16:9), 1080×1080 (1:1), 1080×1920 (9:16)
- **FPS**: 24
- **Duration**: 5 секунд (фиксированная)
- **Frame images**: First и last frame
- **Provider settings**:
  - `movementAmplitude`: auto, small, medium, large (default: auto)
  - `bgm`: boolean (default: false) - только для 4-сек видео
  - `style`: general, anime (default: general) - только для text-to-video

### Vidu 1.5 (`vidu:1@5`)
- **Workflows**: Text-to-video, Image-to-video, Reference-to-video
- **Dimensions**: 1920×1080, 1080×1080, 1080×1920, 1280×720, 720×720, 720×1280, 640×360, 360×360, 360×640
- **FPS**: 24
- **Duration**: 4 секунды (все разрешения), 8 секунд (только 720p)
- **Frame images**: First и last frame
- **Reference images**: 1 image
- **Provider settings**:
  - `movementAmplitude`: auto, small, medium, large (default: auto)
  - `bgm`: boolean (default: false) - только для 4-сек видео
  - `style`: general, anime (default: general) - только для text-to-video

### Vidu 2.0 (`vidu:2@0`)
- **Workflows**: Image-to-video, Reference-to-video
- **Dimensions**: (те же что 1.5)
- **FPS**: 24
- **Duration**: 4 секунды (все разрешения), 8 секунд (только 720p)
- **Frame images**: First и last frame
- **Reference images**: 1 image
- **Provider settings**:
  - `movementAmplitude`: auto, small, medium, large (default: auto)
  - `bgm`: boolean (default: false) - только для 4-сек видео

### Vidu Q2 Turbo (`vidu:3@2`)
- **Workflows**: Text-to-video, First/last frame to video, Reference-to-video
- **Dimensions**: 360p, 540p, 720p, 1080p (разные aspect ratios)
- **FPS**: 24
- **Duration**: 1-8 секунд (default: 5)
- **Frame images**: First и last frame (автоматическое разрешение)
- **Reference images**: До 7 images
- **Provider settings**:
  - `movementAmplitude`: auto, small, medium, large (default: auto)
  - `bgm`: boolean (default: false)

### Vidu Q2 Pro (`vidu:3@1`)
- **Workflows**: Text-to-video, First/last frame to video, Reference-to-video
- **Dimensions**: (те же что Q2 Turbo)
- **FPS**: 24
- **Duration**: 1-8 секунд (default: 5)
- **Frame images**: First и last frame (автоматическое разрешение)
- **Reference images**: До 7 images
- **Provider settings**:
  - `movementAmplitude`: auto, small, medium, large (default: auto)
  - `bgm`: boolean (default: false)

---

## Общие обязательные параметры для всех моделей

```json
{
  "taskType": "videoInference",
  "model": "...",
  "positivePrompt": "...",
  "duration": 4,
  "fps": 24,
  "width": 1280,
  "height": 720,
  "outputFormat": "mp4",
  "outputType": "URL",
  "numberResults": 1,
  "includeCost": true,
  "outputQuality": 99,
  "deliveryMethod": "async"
}
```

⚠️ **ВАЖНО**:
- Для некоторых моделей width/height игнорируются (auto-inference from frame)
- Проверяйте поддерживаемые dimensions для каждой модели
- `providerSettings` обязателен для Google/MiniMax/Vidu/PixVerse/ByteDance моделей
