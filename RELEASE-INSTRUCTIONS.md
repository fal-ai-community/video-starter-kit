# Инструкция по созданию релиза VideoSOS v1.0.2

## Проблема
Архив релиза создан на сервере, но не может быть автоматически загружен на GitHub из-за ограничений API токена.

## Решение
Пересоберите релиз локально и загрузите вручную.

---

## Шаг 1: Клонируйте репозиторий

```bash
git clone https://github.com/timoncool/videosos.git
cd videosos
git checkout main
```

## Шаг 2: Установите зависимости

```bash
npm install
```

## Шаг 3: Создайте production build

```bash
npm run build
```

## Шаг 4: Запустите скрипт сборки релиза

```bash
chmod +x build-release.sh
./build-release.sh
```

Скрипт автоматически:
- Скопирует все файлы приложения
- Скопирует production build (.next)
- Скопирует зависимости (node_modules)
- Скачает портативный Node.js v20.18.0 для Windows
- Создаст архив

## Шаг 5: Создайте ZIP архив

```bash
cd release
zip -r ../videosos-v1.0.2-portable.zip .
cd ..
```

Или для лучшего сжатия:

```bash
cd release
zip -9 -r ../videosos-v1.0.2-portable.zip .
cd ..
```

## Шаг 6: Загрузите архив на GitHub

### Вариант A: Через веб-интерфейс

1. Перейдите на https://github.com/timoncool/videosos/releases/tag/v1.0.2-portable
2. Нажмите **"Edit"** (справа вверху)
3. Перетащите файл `videosos-v1.0.2-portable.zip` в секцию **"Attach binaries"**
4. Подождите загрузки (может занять несколько минут для 291 MB)
5. Нажмите **"Update release"**

### Вариант B: Через gh CLI

```bash
gh release upload v1.0.2-portable videosos-v1.0.2-portable.zip --repo timoncool/videosos
```

### Вариант C: Через API

```bash
# Получите ID релиза
RELEASE_ID=$(curl -s -H "Authorization: Bearer YOUR_TOKEN" \
  "https://api.github.com/repos/timoncool/videosos/releases/tags/v1.0.2-portable" | \
  grep '"id":' | head -1 | sed 's/.*: \(.*\),/\1/')

# Загрузите архив
curl -X POST \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/zip" \
  --data-binary @videosos-v1.0.2-portable.zip \
  "https://uploads.github.com/repos/timoncool/videosos/releases/$RELEASE_ID/assets?name=videosos-v1.0.2-portable.zip"
```

---

## Быстрый старт (если у вас уже есть готовый билд)

Если у вас уже запущен `build-release.sh` и есть директория `release/`:

```bash
cd release
zip -9 -r ../videosos-v1.0.2-portable.zip .
cd ..

# Загрузите через браузер на:
# https://github.com/timoncool/videosos/releases/tag/v1.0.2-portable
```

---

## Что уже сделано

✅ Версия обновлена до 1.0.2 в package.json
✅ Скрипт build-release.sh создан и протестирован
✅ Production build создан
✅ Тег v1.0.2-portable создан
✅ Релиз создан на GitHub
✅ .gitignore обновлен

## Что осталось

❌ Загрузить архив videosos-v1.0.2-portable.zip в релиз

---

## Альтернатива: Использовать GitHub Actions

Можно настроить GitHub Actions для автоматической сборки релизов. Пример workflow:

```yaml
name: Build Release
on:
  push:
    tags:
      - 'v*-portable'

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm install
      - run: npm run build
      - run: ./build-release.sh
      - run: cd release && zip -9 -r ../videosos-${{ github.ref_name }}.zip .
      - uses: softprops/action-gh-release@v1
        with:
          files: videosos-${{ github.ref_name }}.zip
```

---

## Проверка релиза

После загрузки архива проверьте:

1. Размер архива примерно 291 MB
2. В архиве есть:
   - `node/` (портативный Node.js)
   - `app/` (приложение с .next и node_modules)
   - `start.bat`, `stop.bat`, `update.bat`
   - `README-Portable.txt`, `INSTALL-PORTABLE.txt`

3. Тестовая распаковка и запуск:
   ```
   unzip videosos-v1.0.2-portable.zip -d test
   cd test
   # На Windows: запустить start.bat
   # Должен открыться браузер на localhost:3000
   ```

---

## Поддержка

- GitHub Issues: https://github.com/timoncool/videosos/issues
- Telegram: https://t.me/nerual_dreming
