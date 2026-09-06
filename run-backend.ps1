# Script to build and run the PahaarSaathi backend locally
# This script downloads Maven if needed and starts the Spring Boot application

$mavenVersion = "3.9.6"
$toolsDir = "C:\tools"
$backendDir = (Split-Path -Parent $MyInvocation.MyCommand.Path) + "\backend"
$mavenHome = "$toolsDir\apache-maven-$mavenVersion"
$mavenBin = "$mavenHome\bin"

Write-Host "`n" + ("="*70)
Write-Host "  PahaarSaathi Backend Startup Script"
Write-Host "="*70 + "`n"

# Check if Java is installed
Write-Host "1. Checking Java installation..."
$javaCmd = Get-Command java -ErrorAction SilentlyContinue
if ($javaCmd) {
    Write-Host "   OK: Java found`n"
} else {
    Write-Host "   ERROR: Java not found. Please install Java 21 or later.`n"
    exit 1
}

# Check if Maven is installed, if not download it
Write-Host "2. Checking Maven installation..."
$mvnCommand = "mvn"

if (-Not (Test-Path $mavenBin\mvn.cmd)) {
    Write-Host "   Maven not found locally. Downloading Maven 3.9.6..."
    
    if (-Not (Test-Path $toolsDir)) {
        New-Item -ItemType Directory -Path $toolsDir -Force | Out-Null
    }
    
    $downloadUrl = "https://archive.apache.org/dist/maven/maven-3/3.9.6/binaries/apache-maven-3.9.6-bin.zip"
    $zipPath = "$env:TEMP\maven-3.9.6-bin.zip"
    
    Write-Host "   Downloading from Apache Maven repository..."
    [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
    (New-Object System.Net.WebClient).DownloadFile($downloadUrl, $zipPath)
    Write-Host "   OK: Download complete, extracting..."
    
    Expand-Archive -Path $zipPath -DestinationPath $toolsDir -Force
    Remove-Item $zipPath -Force
    Write-Host "   OK: Maven installed`n"
}

$mvnCommand = "$mavenBin\mvn.cmd"
Write-Host "   OK: Maven ready`n"

# Build the backend
Write-Host "3. Building backend (may take 2-5 minutes)..."
Write-Host "   Running Maven build...`n"

Push-Location $backendDir
& $mvnCommand clean package -DskipTests
$buildSuccess = $?
Pop-Location

if (-Not $buildSuccess) {
    Write-Host "ERROR: Build failed. Check errors above."
    exit 1
}

Write-Host "   OK: Build successful!`n"

# Find the JAR file
$jarFile = Get-ChildItem -Path "$backendDir\target" -Filter "*.jar" | Select-Object -First 1

if (-Not $jarFile) {
    Write-Host "ERROR: JAR file not found in target directory"
    exit 1
}

Write-Host "4. Starting Spring Boot application..."
Write-Host "   JAR: $($jarFile.Name)"
Write-Host "   Profile: dev (H2 in-memory database)"
Write-Host "   Endpoint: http://localhost:8080"
Write-Host "   Swagger UI: http://localhost:8080/swagger-ui.html`n"
Write-Host "   Starting...`n"

Start-Sleep -Seconds 2

# Run the application with dev profile
& java -jar $jarFile.FullName `
    -Dspring.profiles.active=dev `
    -DJWT_SECRET="$env:JWT_SECRET" `
    -DGOOGLE_CLIENT_ID="$env:GOOGLE_CLIENT_ID"

Write-Host "`nOK: Application stopped."
