# Script to test and help set up ngrok

Write-Host "=== Ngrok Troubleshooting ===" -ForegroundColor Green
Write-Host ""

# Check if ngrok.exe exists in current folder
if (Test-Path ".\ngrok.exe") {
    Write-Host "✅ Found ngrok.exe in current folder" -ForegroundColor Green
    Write-Host ""
    Write-Host "Trying to run ngrok..." -ForegroundColor Yellow
    Write-Host ""
    
    # Try to get ngrok version
    try {
        $version = & .\ngrok.exe version 2>&1
        Write-Host "Ngrok version info:" -ForegroundColor Cyan
        Write-Host $version
        Write-Host ""
        Write-Host "✅ Ngrok is working! You can now run:" -ForegroundColor Green
        Write-Host "   .\ngrok.exe http 5173" -ForegroundColor Yellow
    } catch {
        Write-Host "❌ Error running ngrok: $_" -ForegroundColor Red
        Write-Host ""
        Write-Host "Possible issues:" -ForegroundColor Yellow
        Write-Host "1. ngrok.exe might be corrupted - try downloading again" -ForegroundColor Cyan
        Write-Host "2. Windows might be blocking it - check Windows Defender" -ForegroundColor Cyan
        Write-Host "3. Try right-clicking ngrok.exe -> Properties -> Unblock" -ForegroundColor Cyan
    }
} else {
    Write-Host "❌ ngrok.exe not found in current folder" -ForegroundColor Red
    Write-Host ""
    Write-Host "Download ngrok:" -ForegroundColor Yellow
    Write-Host "1. Go to: https://ngrok.com/download" -ForegroundColor Cyan
    Write-Host "2. Download Windows version" -ForegroundColor Cyan
    Write-Host "3. Extract ngrok.exe to this folder:" -ForegroundColor Cyan
    Write-Host "   $PWD" -ForegroundColor White
    Write-Host ""
    Write-Host "Or use PowerShell to download:" -ForegroundColor Yellow
    Write-Host "   Invoke-WebRequest -Uri 'https://bin.equinox.io/c/bNyj1mQVY4c/ngrok-v3-stable-windows-amd64.zip' -OutFile 'ngrok.zip'" -ForegroundColor Cyan
    Write-Host "   Expand-Archive -Path 'ngrok.zip' -DestinationPath '.'" -ForegroundColor Cyan
    Write-Host "   Remove-Item 'ngrok.zip'" -ForegroundColor Cyan
}

Write-Host ""

