#!/bin/bash

# VideoSOS Release Build Script
# Creates a portable release package for Windows

set -e

VERSION=$(node -p "require('./package.json').version")
RELEASE_NAME="videosos-v${VERSION}-portable"
BUILD_DIR="release"
APP_DIR="${BUILD_DIR}/app"
NODE_VERSION="20.18.0"

echo "========================================"
echo "  VideoSOS Release Builder v${VERSION}"
echo "========================================"
echo ""

# Step 1: Clean previous build
echo "Step 1/6: Cleaning previous build..."
rm -rf "${BUILD_DIR}"
mkdir -p "${APP_DIR}"
echo "✓ Clean complete"
echo ""

# Step 2: Copy application files
echo "Step 2/6: Copying application files..."

# Copy files excluding specific directories
find . -maxdepth 1 \( \
    -name 'node_modules' -o \
    -name '.git' -o \
    -name '.next' -o \
    -name 'release' -o \
    -name 'build-release.sh' -o \
    -name '.env*' -o \
    -name '*.log' \
    \) -prune -o -type f -exec cp {} "${APP_DIR}/" \;

# Copy directories
for dir in src public messages docker tools .github .husky; do
    if [ -d "$dir" ]; then
        cp -r "$dir" "${APP_DIR}/"
    fi
done

echo "✓ Application files copied"
echo ""

# Step 3: Copy production build
echo "Step 3/6: Copying production build..."
if [ -d ".next" ]; then
    cp -r .next "${APP_DIR}/"
    echo "✓ Production build copied"
else
    echo "⚠ Warning: .next directory not found. Run 'npm run build' first."
    exit 1
fi
echo ""

# Step 4: Copy node_modules
echo "Step 4/6: Copying dependencies..."
if [ -d "node_modules" ]; then
    cp -r node_modules "${APP_DIR}/"
    echo "✓ Dependencies copied"
else
    echo "⚠ Warning: node_modules not found. Run 'npm install' first."
    exit 1
fi
echo ""

# Step 5: Copy launcher files to release root
echo "Step 5/6: Copying launcher files..."
cp start-portable.bat "${BUILD_DIR}/start.bat"
cp update.bat "${BUILD_DIR}/"
cp README-Portable.txt "${BUILD_DIR}/"
cp INSTALL-PORTABLE.txt "${BUILD_DIR}/"
echo "✓ Launcher files copied"
echo ""

# Step 6: Done
echo "Step 6/6: Release prepared"
echo "✓ All files ready"
echo ""

# Step 7: Create README for completing the build
cat > "${BUILD_DIR}/README-BUILD.txt" << EOF
================================================================================
                   VideoSOS v${VERSION} - Build Instructions
================================================================================

To complete this portable release, you need to add portable Node.js:

STEP 1: Download Portable Node.js for Windows
----------------------------------------------
Visit: https://nodejs.org/dist/v${NODE_VERSION}/node-v${NODE_VERSION}-win-x64.zip

Or use this direct link:
https://nodejs.org/dist/v${NODE_VERSION}/node-v${NODE_VERSION}-win-x64.zip


STEP 2: Extract Node.js to this directory
------------------------------------------
1. Download the node-v${NODE_VERSION}-win-x64.zip file
2. Extract the contents
3. Rename the extracted folder to "node"
4. Move the "node" folder to: ${BUILD_DIR}/node/

The structure should be:
${BUILD_DIR}/
├── node/
│   ├── node.exe
│   ├── npm
│   ├── npm.cmd
│   └── ...
├── app/
│   └── (VideoSOS application)
├── start.bat
├── stop.bat
└── ...


STEP 3: Create Release Archive
-------------------------------
After adding the "node" folder:

1. Select all files in ${BUILD_DIR}/ directory
2. Create a ZIP archive
3. Name it: ${RELEASE_NAME}.zip

IMPORTANT: Archive should contain:
- node/ (portable Node.js)
- app/ (VideoSOS application)
- start.bat, stop.bat, update.bat
- README-Portable.txt


STEP 4: Test the Release
-------------------------
1. Extract the ZIP to a test location
2. Run start.bat
3. Verify the application opens in browser
4. Test basic functionality


STEP 5: Upload to GitHub Releases
----------------------------------
1. Go to: https://github.com/timoncool/videosos/releases
2. Click "Create a new release"
3. Tag: v${VERSION}-portable
4. Title: VideoSOS v${VERSION} Portable Edition
5. Upload: ${RELEASE_NAME}.zip
6. Publish release

================================================================================
Current Status: Node.js needs to be added manually
Size estimate: ~33 MB (after adding Node.js)
================================================================================
EOF

echo "========================================"
echo "  Build Complete!"
echo "========================================"
echo ""
echo "Output directory: ${BUILD_DIR}/"
echo "Release name: ${RELEASE_NAME}"
echo ""
echo "Next steps:"
echo "1. Read ${BUILD_DIR}/README-BUILD.txt"
echo "2. Download and add portable Node.js"
echo "3. Create ZIP archive"
echo "4. Upload to GitHub releases"
echo ""
echo "Total size (without Node.js): $(du -sh ${BUILD_DIR} | cut -f1)"
echo ""
