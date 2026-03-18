#!/bin/bash

# Script to upload release archive to GitHub
# Run this script after building the release

GITHUB_TOKEN="${GITHUB_TOKEN:-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}"
REPO="timoncool/videosos"
TAG="v1.0.2-portable"
ARCHIVE="videosos-v1.0.2-portable.zip"

echo "========================================="
echo "  Upload Release Archive to GitHub"
echo "========================================="
echo ""

# Check if archive exists
if [ ! -f "$ARCHIVE" ]; then
    echo "Error: Archive $ARCHIVE not found!"
    echo "Please run build-release.sh first"
    exit 1
fi

echo "Archive found: $ARCHIVE"
echo "Size: $(du -h $ARCHIVE | cut -f1)"
echo ""

# Get release ID
echo "Getting release information..."
RELEASE_ID=$(curl -s -H "Authorization: Bearer $GITHUB_TOKEN" \
  "https://api.github.com/repos/$REPO/releases/tags/$TAG" | \
  grep '"id":' | head -1 | sed 's/.*: \(.*\),/\1/')

if [ -z "$RELEASE_ID" ]; then
    echo "Error: Could not find release $TAG"
    exit 1
fi

echo "Release ID: $RELEASE_ID"
echo ""

# Upload archive
echo "Uploading archive to GitHub..."
echo "This may take several minutes..."
echo ""

RESPONSE=$(curl -X POST \
  -H "Authorization: Bearer $GITHUB_TOKEN" \
  -H "Content-Type: application/zip" \
  --data-binary @"$ARCHIVE" \
  "https://uploads.github.com/repos/$REPO/releases/$RELEASE_ID/assets?name=$ARCHIVE")

# Check if upload was successful
if echo "$RESPONSE" | grep -q '"browser_download_url"'; then
    DOWNLOAD_URL=$(echo "$RESPONSE" | grep '"browser_download_url"' | sed 's/.*: "\(.*\)".*/\1/')
    echo ""
    echo "========================================="
    echo "  Upload Successful!"
    echo "========================================="
    echo ""
    echo "Download URL: $DOWNLOAD_URL"
    echo ""
    echo "Release page: https://github.com/$REPO/releases/tag/$TAG"
else
    echo ""
    echo "========================================="
    echo "  Upload Failed"
    echo "========================================="
    echo ""
    echo "Response: $RESPONSE"
    echo ""
    echo "Please upload manually:"
    echo "1. Go to https://github.com/$REPO/releases/tag/$TAG"
    echo "2. Click 'Edit'"
    echo "3. Drag and drop $ARCHIVE"
    echo "4. Click 'Update release'"
fi
