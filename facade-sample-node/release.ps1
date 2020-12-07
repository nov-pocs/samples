#!/usr/bin/env pwsh

Set-StrictMode -Version latest
$ErrorActionPreference = "Stop"

# Get component data
$component = Get-Content -Path "component.json" | ConvertFrom-Json
$package = Get-Content -Path "package.json" | ConvertFrom-Json

if ($component.version -ne $package.version) {
    throw "Versions in component.json and package.json do not match"
}

# create .npmrc with proper npm token 
if (-not (Test-Path -Path "docker/.npmrc")) {
    if ($env:NPM_TOKEN -ne $null) {
        $npmrcContent = "//registry.npmjs.org/:_authToken=$($env:NPM_TOKEN)`npackage-lock=false"
        Set-Content -Path "docker/.npmrc" -Value $npmrcContent
    } else {
        Copy-Item -Path "~/.npmrc" -Destination "docker"
    }
}

# Check if version exist on npmjs
$npmjsPackageVersions = npm view $package.name versions

if ($npmjsPackageVersions -ne $null -and $npmjsPackageVersions.Contains($package.version)) {
    Write-Host "Package already exists on npmjs, publish skipped."
} else {
    # Publish to npm repository
    npm publish
}
