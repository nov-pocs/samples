#!/usr/bin/env pwsh

Set-StrictMode -Version latest
$ErrorActionPreference = "Stop"

# Generate image names using the data in the "component.json" file
$component = Get-Content -Path "component.json" | ConvertFrom-Json
$rcImage="$($component.registry)/$($component.name):$($component.version)-$($component.build)-rc"
$latestImage="$($component.registry)/$($component.name):latest"

# Build docker image
docker build -f docker/Dockerfile -t $rcImage -t $latestImage .

# Set environment variables
$env:IMAGE = $rcImage

# Set docker machine ip (on windows not localhost)
if ($env:DOCKER_IP -ne $null) {
    $dockerMachineIp = $env:DOCKER_IP
} else {
    $dockerMachineIp = "localhost"
}

try {
    # Workaround to remove dangling images
    docker-compose -f ./docker/docker-compose.yml down

    docker-compose -f ./docker/docker-compose.yml up -d

    # Give the service time to start and then check that it's responding to requests
    Start-Sleep -Seconds 20
    Invoke-WebRequest -Uri "http://$($dockerMachineIp):8080/heartbeat"
    Invoke-WebRequest -Uri "http://$($dockerMachineIp):8080/$($component.test_route)" -Method Post

    Write-Host "The container was successfully built."
} finally {
    docker-compose -f ./docker/docker-compose.yml down
}
