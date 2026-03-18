@echo off
title VideoSOS - Starting

echo ========================================
echo   VideoSOS - Portable Edition
echo ========================================
echo.

REM Navigate to script directory
cd /d "%~dp0"

REM Check for portable Node.js
if not exist "node\node.exe" (
    echo ERROR: Portable Node.js not found!
    echo Make sure the node\ folder is next to this bat file.
    echo.
    pause
    exit /b 1
)

echo [OK] Portable Node.js found
node\node.exe --version
echo.

REM Add portable Node.js to PATH for this session
set "PATH=%~dp0node;%PATH%"

REM Navigate to app directory
cd app

REM Check for first run - missing node_modules
if not exist "node_modules" (
    echo First run detected.
    echo Installing dependencies... This may take 5-10 minutes.
    echo.
    call ..\node\npm.cmd install
    if errorlevel 1 (
        echo.
        echo ERROR: Failed to install dependencies
        pause
        exit /b 1
    )
    echo.
    echo [OK] Dependencies installed successfully!
    echo.
)

REM Check for production build
if not exist ".next" (
    echo Creating production build...
    echo This may take 1-2 minutes.
    echo.
    call ..\node\npm.cmd run build
    if errorlevel 1 (
        echo.
        echo ERROR: Failed to create production build
        pause
        exit /b 1
    )
    echo.
    echo [OK] Production build created successfully!
    echo.
)

echo Starting VideoSOS...
echo.
echo Application will be available at: http://127.0.0.1:3000
echo Browser will open automatically in a few seconds.
echo.
echo To stop the server:
echo   - Close this window
echo   - Or press Ctrl+C
echo.
echo ========================================
echo.

REM Open browser after a few seconds
start cmd /c "timeout /t 5 /nobreak >nul && start http://127.0.0.1:3000"

REM Start server in foreground - closing window will stop the server
echo [OK] Starting server...
echo Browser will open automatically in 5 seconds.
echo.
echo IMPORTANT: Closing this window will stop the server!
echo Press Ctrl+C to stop
echo.
echo ========================================
call ..\node\npm.cmd start
