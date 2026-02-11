@echo off
title VideoSOS - Update

echo ========================================
echo   VideoSOS - Update
echo ========================================
echo.

REM Navigate to script directory
cd /d "%~dp0"

REM Check for portable Node.js first
if exist "node\node.exe" (
    echo [Portable Mode] Using portable Node.js
    node\node.exe --version
    echo.

    REM Add portable Node.js to PATH for this session
    set "PATH=%~dp0node;%PATH%"
    set "PORTABLE_MODE=1"
    set "NPM_CMD=..\node\npm.cmd"

    REM Navigate to app directory
    cd app
) else (
    echo [Standard Mode] Checking for system Node.js

    REM Check for Git
    where git >nul 2>&1
    if %errorlevel% neq 0 (
        echo ERROR: Git not found!
        echo.
        echo Please install Git from https://git-scm.com/
        echo.
        pause
        exit /b 1
    )

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

    set "NPM_CMD=npm"
)

echo Step 1/4: Getting latest changes...
echo.

REM Check for .git folder
if exist ".git" (
    echo Updating via Git...
    echo.
    git pull
    if errorlevel 1 (
        echo.
        echo ERROR: Failed to run git pull
        echo You may have unsaved changes.
        echo.
        pause
        exit /b 1
    )
) else (
    echo Downloading latest version from GitHub...
    echo.

    REM Download archive
    curl -L -o temp_update.zip https://github.com/timoncool/videosos/archive/refs/heads/main.zip
    if errorlevel 1 (
        echo.
        echo ERROR: Failed to download update
        echo Check your internet connection.
        echo.
        pause
        exit /b 1
    )

    REM Extract archive
    powershell -command "Expand-Archive -Path temp_update.zip -DestinationPath temp_update -Force"
    if errorlevel 1 (
        echo.
        echo ERROR: Failed to extract archive
        del temp_update.zip
        pause
        exit /b 1
    )

    REM Copy files
    xcopy /E /Y /I temp_update\videosos-main\* .
    if errorlevel 1 (
        echo.
        echo ERROR: Failed to copy files
        del temp_update.zip
        rmdir /S /Q temp_update
        pause
        exit /b 1
    )

    REM Clean up temporary files
    del temp_update.zip
    rmdir /S /Q temp_update
    echo Update downloaded successfully
)

echo.
echo Step 2/4: Updating dependencies...
echo.
call %NPM_CMD% install
if errorlevel 1 (
    echo.
    echo ERROR: Failed to update dependencies
    pause
    exit /b 1
)

echo.
echo Step 3/4: Cleaning old build...
echo.
if exist ".next" (
    rmdir /S /Q ".next"
    echo Old build deleted
)

echo.
echo Step 4/4: Creating new production build...
echo.
call %NPM_CMD% run build
if errorlevel 1 (
    echo.
    echo ERROR: Failed to create new build
    pause
    exit /b 1
)

echo.
echo ========================================
echo Update completed successfully!
echo ========================================
echo.
echo You can now run the updated version
if defined PORTABLE_MODE (
    echo using start.bat from the parent directory
) else (
    echo using start.bat
)
echo.
pause
