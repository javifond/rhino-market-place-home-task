#!/bin/bash

# Manual Docker build script for legacy environments
# This script builds images for Project A and Project B using standard docker build commands
# Note: I used this script to build the images when docker compose build fails due to buildx version issues
# because my Mac is old to support buildx.

set -e

echo "🚀 Building Project A..."
docker build \
  -t rhino-project-a:latest \
  --build-arg APP_NAME=project-a \
  --build-arg PORT=3000 \
  .

echo "🚀 Building Project B..."
docker build \
  -t rhino-project-b:latest \
  --build-arg APP_NAME=project-b \
  --build-arg PORT=3001 \
  .

echo "✅ Build complete!"
echo "You can now run the applications using: docker-compose up"
