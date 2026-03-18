# Аудит видео моделей Runware

**Дата проверки:** 2025-10-28
**Проверенные файлы:**
- `/home/user/videosos/src/lib/runware-models.ts`
- Документация из `/home/user/videosos/docs/runware/pages/providers/`

---

## Критические проблемы

### 1. Google Provider - КРИТИЧЕСКАЯ ОШИБКА

#### Модель отсутствует в документации (нужно удалить):
- **google:1@0** "Veo 1" (строка 705-710 в коде)
  - Эта модель есть в коде, но отсутствует в документации
  - **Действие:** Удалить из кода или получить актуальную документацию

---

### 2. KlingAI Provider - МНОЖЕСТВЕННЫЕ КРИТИЧЕСКИЕ ОШИБКИ

#### Модели отсутствуют в документации (нужно удалить):
- **klingai:0@1** "Kling 0.9 (Text)" (строка 615-620)
- **klingai:0@2** "Kling 0.9 (Image)" (строка 606-612)
- **klingai:7@1** "Kling 2.1" (строка 504-509)
- **klingai:6@1** "Kling 2.0" (строка 512-517)

#### Модели из документации отсутствуют в коде (нужно добавить):
- **klingai:6@0** - KlingAI 2.5 Turbo Standard (Image-to-video)
  - Workflows: Image-to-video
  - Dimensions: Inferred from first frame image
  - Duration: 5 or 10 seconds
  - Frame rate: 30 FPS
  - inputAsset: ["image"]

- **klingai:6@1** - KlingAI 2.5 Turbo Pro (Text-to-video, image-to-video)
  - Workflows: Text-to-video, image-to-video
  - Dimensions: 1280×720 (16:9), 720×720 (1:1), 720×1280 (9:16)
  - Duration: 5 or 10 seconds
  - Frame rate: 30 FPS
  - Supports inputAsset: ["image"] for image-to-video

#### Неправильные названия моделей:
- **klingai:5@1** (строка 539)
  - Код: "Kling 1.6 (Text)"
  - Документация: "KlingAI 1.6 Standard"
  - Workflows: Text-to-video AND image-to-video (не только text!)

- **klingai:5@2** (строка 530)
  - Код: "Kling 1.6 Standard (Image)"
  - Документация: "KlingAI 1.6 Pro"
  - Workflows: Image-to-video only

- **klingai:5@3** (строка 521)
  - Код: "Kling 1.6 Professional (Image)"
  - Документация: "KlingAI 2.1 Master"
  - Workflows: Text-to-video AND image-to-video
  - inputAsset должен быть опциональным (только для image-to-video)

- **klingai:4@3** (строка 546)
  - Код: "Kling 1.5 Professional (Image)"
  - Документация: "KlingAI 2.0 Master"
  - Workflows: Text-to-video AND image-to-video
  - inputAsset должен быть опциональным

- **klingai:3@2** (строка 555)
  - Код: "Kling 1.5 Standard (Image)"
  - Документация: "KlingAI 1.6 Pro"
  - Workflows: Image-to-video only

- **klingai:3@1** (строка 564)
  - Код: "Kling 1.5 (Text)"
  - Документация: "KlingAI 1.6 Standard"
  - Workflows: Text-to-video AND image-to-video

- **klingai:2@2** (строка 573)
  - Код: "Kling 1.0 Pro (Image)"
  - Документация: "KlingAI 1.5 Pro"
  - Workflows: Image-to-video only

- **klingai:2@1** (строка 582)
  - Код: "Kling 1.0 Pro (Text)"
  - Документация: "KlingAI 1.5 Standard"
  - Workflows: Image-to-video only (НЕ text-to-video!)
  - inputAsset: ["image"] должен быть добавлен

- **klingai:1@2** (строка 590)
  - Код: "Kling 1.0 Standard (Image)"
  - Документация: "KlingAI 1.0 Pro"
  - Корректно

- **klingai:1@1** (строка 598)
  - Код: "Kling 1.0 Standard (Text)"
  - Документация: "KlingAI 1.0 Standard"
  - Корректно

---

### 3. MiniMax Provider - ОШИБКИ В НАЗВАНИЯХ

#### Неправильные названия:
- **minimax:2@1** (строка 489)
  - Код: "MiniMax Hailuo 01"
  - Документация: "Video-01 Director"

- **minimax:1@1** (строка 497)
  - Код: "MiniMax 01"
  - Документация: "Video-01 Base"

---

### 4. ByteDance Provider - КРИТИЧЕСКАЯ ПУТАНИЦА

#### Полностью неправильные ID и названия:
- **bytedance:1@1** (строка 640-646)
  - Код: "OmniHuman" с inputAsset: ["image", "audio"]
  - Документация: **bytedance:1@1** - это "Seedance 1.0 Lite" (Text/Image-to-video)
  - Реальный OmniHuman - это **bytedance:5@1**!

- **bytedance:2@1** (строка 631-637)
  - Код: "SeedEdit Video" с inputAsset: ["video"]
  - Документация: **bytedance:2@1** - это "Seedance 1.0 Pro" (Text/Image-to-video)
  - Модель НЕ использует video как input!

- **bytedance:5@1** (строка 623-628)
  - Код: "Seedream Video"
  - Документация: **bytedance:5@1** - это "OmniHuman-1"
  - Должен иметь inputAsset: ["image", "audio"] для referenceImages и inputAudios

#### Модели из документации отсутствуют в коде:
- **bytedance:2@2** - Seedance 1.0 Pro Fast
  - Workflows: Text-to-video, image-to-video
  - Duration: 1.2 to 12 seconds in 0.1 second increments
  - Frame images: Supports first frame only
  - Должен иметь inputAsset: ["image"] для image-to-video

---

### 5. PixVerse Provider - ОШИБКИ В ВЕРСИЯХ

#### Неправильные версии:
- **pixverse:1@3** (строка 748)
  - Код: "PixVerse V3"
  - Документация: "PixVerse v4.5"

- **pixverse:1@2** (строка 756)
  - Код: "PixVerse V2"
  - Документация: "PixVerse v4"

#### Модели корректные:
- pixverse:1@1 - PixVerse v3.5 ✓
- pixverse:1@5 - PixVerse V5 ✓
- pixverse:lipsync@1 - PixVerse Lipsync ✓

---

### 6. Vidu Provider - МНОЖЕСТВЕННЫЕ ОШИБКИ

#### Неправильные названия:
- **vidu:1@0** (строка 804-809)
  - Код: "Vidu Legacy"
  - Документация: "Vidu Q1 Classic"

- **vidu:1@1** (строка 773-777)
  - Код: "Vidu 1.0"
  - Документация: "Vidu Q1"

#### Модель отсутствует в документации (нужно удалить):
- **vidu:3@0** (строка 780-785)
  - Код: "Vidu 3.0"
  - Документация: Такой модели нет в документации

#### Модели из документации отсутствуют в коде (нужно добавить):
- **vidu:3@1** - Vidu Q2 Pro
  - Workflows: Text-to-video, first/last frame to video, reference-to-video
  - Dimensions: 640×352 to 1920×1080 (multiple aspect ratios)
  - Duration: 1-8 seconds
  - Frame rate: 24 FPS
  - Reference images: Supports up to 7 images

- **vidu:3@2** - Vidu Q2 Turbo
  - Workflows: Text-to-video, first/last frame to video, reference-to-video
  - Dimensions: 640×352 to 1920×1080 (multiple aspect ratios)
  - Duration: 1-8 seconds
  - Frame rate: 24 FPS
  - Reference images: Supports up to 7 images

---

### 7. OpenAI Provider - ВСЕ КОРРЕКТНО ✓

Все модели OpenAI правильные:
- openai:3@1 - Sora 2 ✓
- openai:3@2 - Sora 2 Pro ✓

---

## Проблемы с параметрами

### Отсутствующие inputAsset параметры:

1. **klingai:2@1** - должен иметь `inputAsset: ["image"]` (Image-to-video only)
2. **klingai:5@1** - должен иметь опциональный inputAsset для image-to-video workflow
3. **klingai:3@1** - должен иметь опциональный inputAsset для image-to-video workflow
4. **klingai:4@3** - должен иметь опциональный inputAsset для image-to-video workflow
5. **klingai:5@3** - должен иметь опциональный inputAsset для image-to-video workflow

### Неправильные inputAsset параметры:

1. **bytedance:1@1** - в коде указан inputAsset: ["image", "audio"], но это модель Seedance 1.0 Lite (text/image-to-video), нужен inputAsset: ["image"] для image-to-video
2. **bytedance:2@1** - в коде указан inputAsset: ["video"], но это Seedance 1.0 Pro (text/image-to-video), нужен inputAsset: ["image"]
3. **bytedance:5@1** - указано без inputAsset, но это OmniHuman-1, нужен специальный формат с referenceImages и inputAudios

---

## Сводная статистика

### По провайдерам:
- **Google**: 1 модель для удаления
- **KlingAI**: 4 модели для удаления, 2 для добавления, 10+ названий для исправления
- **MiniMax**: 2 названия для исправления
- **ByteDance**: 3 полностью неправильных модели, 1 для добавления
- **PixVerse**: 2 названия версий для исправления
- **Vidu**: 2 названия для исправления, 1 для удаления, 2 для добавления
- **OpenAI**: Все корректно ✓

### Всего проблем:
- Моделей для удаления: **6**
- Моделей для добавления: **5**
- Неправильных названий: **17**
- Неправильных параметров: **8**
- **ВСЕГО: 36 проблем**

---

## Рекомендации по исправлению

### Приоритет 1 - КРИТИЧЕСКИЕ (исправить немедленно):
1. Исправить полную путаницу с ByteDance моделями (bytedance:1@1, 2@1, 5@1)
2. Удалить несуществующие модели (google:1@0, klingai:0@1, 0@2, 6@1, 7@1, vidu:3@0)
3. Добавить недостающие модели (klingai:6@0, 6@1, bytedance:2@2, vidu:3@1, 3@2)

### Приоритет 2 - ВАЖНЫЕ:
4. Исправить все названия KlingAI моделей на соответствие документации
5. Исправить названия PixVerse версий (V3→v4.5, V2→v4)
6. Исправить названия Vidu моделей (Legacy→Q1 Classic, 1.0→Q1)

### Приоритет 3 - СРЕДНИЕ:
7. Исправить названия MiniMax моделей
8. Добавить правильные inputAsset параметры для всех моделей

---

## Детальный план действий

### Шаг 1: Удалить несуществующие модели
```typescript
// Удалить эти строки из RUNWARE_ENDPOINTS:
- google:1@0 (строка 705-710)
- klingai:0@1 (строка 615-620)
- klingai:0@2 (строка 606-612)
- klingai:7@1 (строка 504-509)
- klingai:6@1 (строка 512-517)
- vidu:3@0 (строка 780-785)
```

### Шаг 2: Исправить ByteDance модели
```typescript
// bytedance:1@1 - изменить на:
{
  provider: "runware",
  endpointId: "bytedance:1@1",
  label: "Seedance 1.0 Lite",
  description: "Cost-effective video generation from ByteDance",
  popularity: 4,
  category: "video",
  inputAsset: ["image"], // для image-to-video workflow
}

// bytedance:2@1 - изменить на:
{
  provider: "runware",
  endpointId: "bytedance:2@1",
  label: "Seedance 1.0 Pro",
  description: "Professional-grade video generation from ByteDance",
  popularity: 4,
  category: "video",
  inputAsset: ["image"], // для image-to-video workflow
}

// bytedance:5@1 - изменить на:
{
  provider: "runware",
  endpointId: "bytedance:5@1",
  label: "OmniHuman-1",
  description: "Human animation from image and audio",
  popularity: 3,
  category: "video",
  // Эта модель использует referenceImages и inputAudios, не frameImages
}
```

### Шаг 3: Добавить недостающие модели
```typescript
// Добавить bytedance:2@2:
{
  provider: "runware",
  endpointId: "bytedance:2@2",
  label: "Seedance 1.0 Pro Fast",
  description: "Accelerated professional video generation",
  popularity: 4,
  category: "video",
  inputAsset: ["image"],
}

// Добавить klingai:6@0:
{
  provider: "runware",
  endpointId: "klingai:6@0",
  label: "KlingAI 2.5 Turbo Standard",
  description: "Efficient cinematic image-to-video generation",
  popularity: 5,
  category: "video",
  inputAsset: ["image"],
}

// Добавить klingai:6@1:
{
  provider: "runware",
  endpointId: "klingai:6@1",
  label: "KlingAI 2.5 Turbo Pro",
  description: "Next-level creativity with turbocharged motion",
  popularity: 5,
  category: "video",
  // inputAsset опционален для text-to-video
}

// Добавить vidu:3@1:
{
  provider: "runware",
  endpointId: "vidu:3@1",
  label: "Vidu Q2 Pro",
  description: "Extremely high-quality video generation with delicate motion",
  popularity: 5,
  category: "video",
}

// Добавить vidu:3@2:
{
  provider: "runware",
  endpointId: "vidu:3@2",
  label: "Vidu Q2 Turbo",
  description: "High-quality video with extremely fast generation speed",
  popularity: 5,
  category: "video",
}
```

### Шаг 4: Исправить названия всех моделей
См. детальный список выше в разделах по каждому провайдеру.

---

## Заключение

Обнаружено **36 критических проблем** в конфигурации видео моделей Runware. Большинство проблем связаны с неправильными названиями моделей и несоответствием endpoint ID между кодом и документацией. Особенно критична ситуация с ByteDance моделями, где произошла полная путаница ID и функциональности.

**Следующие шаги:**
1. Создать резервную копию текущего файла
2. Применить исправления по приоритетам
3. Протестировать каждую измененную модель
4. Обновить документацию при необходимости
