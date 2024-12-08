#!/bin/bash

# Set variables
IMAGE_NAME="nigelrmtaylor/capitalis-graphql"
TAG="master"

# Build the Docker image
echo "Building Docker image: ${IMAGE_NAME}:${TAG}"
docker build -t ${IMAGE_NAME}:${TAG} .

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "Build successful!"
    
    # Push to Docker Hub
    echo "Pushing to Docker Hub..."
    docker push ${IMAGE_NAME}:${TAG}
    
    if [ $? -eq 0 ]; then
        echo "Push successful!"
        echo "Image available at: ${IMAGE_NAME}:${TAG}"
    else
        echo "Error: Failed to push image to Docker Hub"
        exit 1
    fi
else
    echo "Error: Docker build failed"
    exit 1
fi
