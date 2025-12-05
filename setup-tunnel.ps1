# Script to set up Cloudflare tunnel for Telegram WebApp
# This creates a public HTTPS URL for your local WebApp

Write-Host "Setting up Cloudflare tunnel for WebApp..." -ForegroundColor Green
Write-Host ""
Write-Host "This will create a public URL like: https://xxxxx.trycloudflare.com" -ForegroundColor Yellow
Write-Host ""

# Check if cloudflared is installed
$cloudflared = Get-Command cloudflared -ErrorAction SilentlyContinue

if (-not $cloudflared) {
    Write-Host "Cloudflared is not installed." -ForegroundColor Red
    Write-Host ""
    Write-Host "To install cloudflared:" -ForegroundColor Yellow
    Write-Host "1. Download from: https://github.com/cloudflare/cloudflared/releases" -ForegroundColor Cyan
    Write-Host "2. Extract cloudflared.exe to a folder in your PATH" -ForegroundColor Cyan
    Write-Host "3. Or use: winget install --id Cloudflare.cloudflared" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Alternatively, you can use ngrok:" -ForegroundColor Yellow
    Write-Host "1. Sign up at https://ngrok.com" -ForegroundColor Cyan
    Write-Host "2. Download and install ngrok" -ForegroundColor Cyan
    Write-Host "3. Run: ngrok http 5173" -ForegroundColor Cyan
    exit 1
}

Write-Host "Starting tunnel on port 5173..." -ForegroundColor Green
Write-Host "Press Ctrl+C to stop" -ForegroundColor Yellow
Write-Host ""

# Start cloudflared tunnel
cloudflared tunnel --url http://localhost:5173

