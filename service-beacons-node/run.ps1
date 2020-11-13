#!/usr/bin/env pwsh

##Set-StrictMode -Version latest
$ErrorActionPreference = "Stop"

$component = Get-Content -Path "component.json" | ConvertFrom-Json
$image="$($component.registry)/$($component.name):$($component.version)-$($component.build)-rc"

# Set environment variables
$env:IMAGE = $image

docker-compose -f ./docker/docker-compose.yml up
docker-compose -f ./docker/docker-compose.yml down
