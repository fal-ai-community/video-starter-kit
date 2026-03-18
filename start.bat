@echo off
chcp 65001 >nul
title VideoSOS - Запуск

echo ========================================
echo   VideoSOS - AI Video Editor
echo ========================================
echo.

REM Проверка наличия Node.js
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo ОШИБКА: Node.js не найден!
    echo.
    echo Пожалуйста, установите Node.js с https://nodejs.org/
    echo Рекомендуемая версия: v18 или выше
    echo.
    pause
    exit /b 1
)

echo Node.js найден: 
node --version
echo.

REM Проверка первого запуска - отсутствуют node_modules
if not exist "node_modules" (
    echo Первый запуск обнаружен.
    echo Установка зависимостей... Это может занять 5-10 минут.
    echo.
    call npm install
    if errorlevel 1 (
        echo.
        echo ОШИБКА: Не удалось установить зависимости
        pause
        exit /b 1
    )
    echo.
    echo Зависимости установлены успешно!
    echo.
)

REM Проверка наличия production build
if not exist ".next" (
    echo Создание production сборки...
    echo Это может занять 1-2 минуты.
    echo.
    call npm run build
    if errorlevel 1 (
        echo.
        echo ОШИБКА: Не удалось создать production сборку
        pause
        exit /b 1
    )
    echo.
    echo Production сборка создана успешно!
    echo.
)

echo Запуск VideoSOS...
echo.
echo Приложение будет доступно по адресу: http://localhost:3000
echo Браузер откроется автоматически через несколько секунд.
echo.
echo Для остановки сервера:
echo   - Используйте stop.bat
echo   - Или нажмите Ctrl+C в этом окне
echo.
echo ========================================
echo.

REM Запуск сервера в фоне и открытие браузера
start /B npm start
timeout /t 3 /nobreak >nul
start http://localhost:3000

REM Ожидание завершения (сервер работает в фоне)
echo Сервер запущен!
echo Не закрывайте это окно, пока используете приложение.
echo.
pause
