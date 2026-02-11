@echo off
chcp 65001 >nul
title VideoSOS - Create ZIP Archive

echo ========================================
echo   Creating Release Archive
echo ========================================
echo.

REM Navigate to script directory
cd /d "%~dp0"

REM Check if release folder exists
if not exist "release" (
    echo ERROR: release folder not found!
    echo Please run build-release.bat first
    pause
    exit /b 1
)

REM Delete old archive if exists
if exist "videosos-v1.0.3-portable.zip" (
    echo Deleting old archive...
    del "videosos-v1.0.3-portable.zip"
)

echo Creating ZIP archive...
echo This may take a minute...
echo.

REM Create ZIP using PowerShell
powershell -command "Compress-Archive -Path release\* -DestinationPath videosos-v1.0.3-portable.zip -CompressionLevel Optimal"

if errorlevel 1 (
    echo ERROR: Failed to create archive
    pause
    exit /b 1
)

echo.
echo ========================================
echo   Archive Created Successfully!
echo ========================================
echo.

REM Show file size
for %%A in (videosos-v1.0.3-portable.zip) do echo Archive size: %%~zA bytes (~70 MB)
echo.
echo File: videosos-v1.0.3-portable.zip
echo.
echo Next steps:
echo 1. Go to: https://github.com/timoncool/videosos/releases/tag/v1.0.3-portable
echo 2. Click "Edit" button
echo 3. Drag and drop videosos-v1.0.3-portable.zip to "Attach binaries"
echo 4. Click "Update release"
echo.
pause
