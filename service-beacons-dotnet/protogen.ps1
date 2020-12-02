#!/usr/bin/env pwsh

##Set-StrictMode -Version latest
$ErrorActionPreference = "Stop"

$component = Get-Content -Path "component.json" | ConvertFrom-Json

$buildImage="$($component.registry)/$($component.name):$($component.version)-$($component.build)-protogen"
$container=$component.name

# Remove build files
if (Test-Path "./src/Service/Protos") {
    Remove-Item -Recurse -Force -Path "./src/Service/Protos/*.cs"
} else {
    New-Item -ItemType Directory -Force -Path "./src/Service/Protos"
}

# Build docker image
docker build -f docker/Dockerfile.protogen -t $buildImage .

# Create and copy compiled files, then destroy
docker create --name $container $buildImage
docker cp "$($container):/app/." ./src/Service/Protos 
docker rm $container

if (!(Test-Path "./src/Service/Protos")) {
    Write-Host "protos folder doesn't exist in root dir. Build failed. Watch logs above."
    exit 1
}
