@echo off
chcp 65001 >nul
title VideoSOS - Build Release

echo ========================================
echo   VideoSOS Release Builder v1.0.3
echo ========================================
echo.

REM Navigate to script directory
cd /d "%~dp0"

REM Check for Node.js
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js not found!
    echo.
    echo Please install Node.js from https://nodejs.org/
    echo.
    pause
    exit /b 1
)

echo Node.js found:
node --version
echo.

REM Step 1: Clean previous build
echo Step 1/7: Cleaning previous build...
if exist "release" rmdir /S /Q "release"
mkdir "release\app"
echo Done
echo.

REM Step 2: Install dependencies if needed
if not exist "node_modules" (
    echo Step 2/7: Installing dependencies...
    call npm install
    if errorlevel 1 (
        echo ERROR: Failed to install dependencies
        pause
        exit /b 1
    )
) else (
    echo Step 2/7: Dependencies already installed
)
echo.

REM Step 3: Create production build
if not exist ".next" (
    echo Step 3/7: Creating production build...
    call npm run build
    if errorlevel 1 (
        echo ERROR: Failed to create build
        pause
        exit /b 1
    )
) else (
    echo Step 3/7: Production build already exists
)
echo.

REM Step 4: Copy application files
echo Step 4/7: Copying application files...
xcopy /E /I /Y src "release\app\src" >nul
xcopy /E /I /Y public "release\app\public" >nul
xcopy /E /I /Y messages "release\app\messages" >nul
xcopy /E /I /Y .husky "release\app\.husky" >nul
xcopy /E /I /Y docker "release\app\docker" >nul
xcopy /E /I /Y tools "release\app\tools" >nul

copy /Y package.json "release\app\" >nul
copy /Y package-lock.json "release\app\" >nul
copy /Y next.config.mjs "release\app\" >nul
copy /Y tsconfig.json "release\app\" >nul
copy /Y tailwind.config.ts "release\app\" >nul
copy /Y postcss.config.mjs "release\app\" >nul
copy /Y biome.json "release\app\" >nul
copy /Y i18n.ts "release\app\" >nul
copy /Y middleware.ts "release\app\" >nul
copy /Y components.json "release\app\" >nul
copy /Y .eslintrc.json "release\app\" >nul
copy /Y .editorconfig "release\app\" >nul
copy /Y LICENSE "release\app\" >nul
copy /Y README*.* "release\app\" >nul
copy /Y *.md "release\app\" >nul
copy /Y Makefile "release\app\" >nul
copy /Y docker-compose.yml "release\app\" >nul

echo Done
echo.

REM Step 5: Copy production build
echo Step 5/7: Copying production build...
xcopy /E /I /Y ".next" "release\app\.next" >nul
echo Done
echo.

REM Step 6: Download portable Node.js
echo Step 6/7: Downloading portable Node.js v20.18.0...
if not exist "release\node.zip" (
    echo This may take a few minutes...
    curl -L -o "release\node.zip" "https://nodejs.org/dist/v20.18.0/node-v20.18.0-win-x64.zip"
    if errorlevel 1 (
        echo ERROR: Failed to download Node.js
        pause
        exit /b 1
    )
)

echo Extracting Node.js...
powershell -command "Expand-Archive -Path release\node.zip -DestinationPath release -Force"
if errorlevel 1 (
    echo ERROR: Failed to extract Node.js
    del release\node.zip
    pause
    exit /b 1
)

ren "release\node-v20.18.0-win-x64" "node"
del release\node.zip
echo Done
echo.

REM Step 7: Copy launcher files
echo Step 7/7: Copying launcher files...
copy /Y start-portable.bat "release\start.bat" >nul
copy /Y update.bat "release\" >nul
copy /Y README-Portable.txt "release\" >nul
copy /Y INSTALL-PORTABLE.txt "release\" >nul
echo Done
echo.

echo ========================================
echo   Build Complete!
echo ========================================
echo.
echo Output directory: release\
echo.
echo Next steps:
echo 1. Open release folder in Windows Explorer
echo 2. Select all files (Ctrl+A)
echo 3. Right-click ^> Send to ^> Compressed (zipped) folder
echo 4. Name it: videosos-v1.0.3-portable.zip
echo 5. Upload to: https://github.com/timoncool/videosos/releases/tag/v1.0.3-portable
echo.
echo OR use PowerShell to create ZIP:
echo   Compress-Archive -Path release\* -DestinationPath videosos-v1.0.3-portable.zip
echo.
pause
