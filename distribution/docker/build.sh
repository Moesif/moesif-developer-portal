#!/usr/bin/env bash
PROJECT_ROOT=../../

docker build -f ./Dockerfile-dev-portal -t moesif/dev-portal $PROJECT_ROOT
docker build -f ./Dockerfile-dev-portal-api -t moesif/dev-portal-api $PROJECT_ROOT