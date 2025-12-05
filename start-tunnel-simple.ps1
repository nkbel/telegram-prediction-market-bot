# Simple script to start tunnel with better error handling

Write-Host "=== Starting Tunnel for WebApp ===" -ForegroundColor Green
Write-Host ""

# Check if WebApp is running
$webappRunning = netstat -ano | Select-String ":5173" | Select-String "LISTENING"

if (-not $webappRunning) {
    Write-Host "⚠️  WebApp server is not running on port 5173!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please start the WebApp first:" -ForegroundColor Yellow
    Write-Host "  cd webapp" -ForegroundColor Cyan
    Write-Host "  npm run dev" -ForegroundColor Cyan
    Write-Host ""
    exit 1
}

Write-Host "✅ WebApp is running on port 5173" -ForegroundColor Green
Write-Host ""
Write-Host "Starting localtunnel..." -ForegroundColor Yellow
Write-Host "This will create a public URL for your WebApp" -ForegroundColor Cyan
Write-Host ""
Write-Host "Keep this window open!" -ForegroundColor Yellow
Write-Host ""

# Start localtunnel
lt --port 5173 --subdomain $(Get-Random -Minimum 1000 -Maximum 9999)

