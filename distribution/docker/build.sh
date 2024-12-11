#!/usr/bin/env bash

# Define the VERSION variable
VERSION="SET_ME"  # Change this to your desired version

# Validate the VERSION string is semver-like
if [[ ! $VERSION =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
    echo "Error: VERSION must be in the format X.Y.Z (e.g., 1.0.0)"
    exit 1
fi

# Create a major version variable
MAJOR_VERSION="${VERSION%%.*}.x"

# Project Root used for Docker context
PROJECT_ROOT=../../

DEV_PORTAL_IMAGE_NAME="moesif/dev-portal"
DEV_PORTAL_API_IMAGE_NAME="moesif/dev-portal-api"

docker buildx build --platform linux/amd64 -f ./Dockerfile-dev-portal \
    -t "${DEV_PORTAL_IMAGE_NAME}:${VERSION}" \
    -t "${DEV_PORTAL_IMAGE_NAME}:${MAJOR_VERSION}" \
    -t "${DEV_PORTAL_IMAGE_NAME}" \
    $PROJECT_ROOT --push

docker buildx build --platform linux/amd64 -f ./Dockerfile-dev-portal-api \
    -t "${DEV_PORTAL_API_IMAGE_NAME}:${VERSION}" \
    -t "${DEV_PORTAL_API_IMAGE_NAME}:${MAJOR_VERSION}" \
    -t "${DEV_PORTAL_API_IMAGE_NAME}" \
    $PROJECT_ROOT --push