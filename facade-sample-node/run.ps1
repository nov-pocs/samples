#!/usr/bin/env pwsh

Set-StrictMode -Version latest
$ErrorActionPreference = "Stop"

# Get component data and set necessary variables
$component = Get-Content -Path "component.json" | ConvertFrom-Json
$stageImage="$($component.registry)/$($component.name):$($component.version)-$($component.build)-rc"

# Set environment variables
$env:IMAGE = $stageImage

# Workaround to remove dangling images
docker-compose -f ./docker/docker-compose.yml down
docker-compose -f ./docker/docker-compose.yml up
