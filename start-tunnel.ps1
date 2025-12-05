# Simple script to start a tunnel for Telegram WebApp
# This will help you get a public URL for your local WebApp

Write-Host "=== Telegram WebApp Tunnel Setup ===" -ForegroundColor Green
Write-Host ""

# Check for ngrok first (easier to use)
$ngrok = Get-Command ngrok -ErrorAction SilentlyContinue

if ($ngrok) {
    Write-Host "Found ngrok! Starting tunnel..." -ForegroundColor Green
    Write-Host "After ngrok starts, copy the HTTPS URL (e.g., https://xxxxx.ngrok.io)" -ForegroundColor Yellow
    Write-Host "Then update your .env file with: WEBAPP_URL=<that-url>" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Starting ngrok on port 5173..." -ForegroundColor Cyan
    Write-Host "Press Ctrl+C to stop" -ForegroundColor Yellow
    Write-Host ""
    ngrok http 5173
    exit 0
}

# Check for cloudflared
$cloudflared = Get-Command cloudflared -ErrorAction SilentlyContinue

if ($cloudflared) {
    Write-Host "Found cloudflared! Starting tunnel..." -ForegroundColor Green
    Write-Host "After cloudflared starts, copy the HTTPS URL (e.g., https://xxxxx.trycloudflare.com)" -ForegroundColor Yellow
    Write-Host "Then update your .env file with: WEBAPP_URL=<that-url>" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Starting cloudflared on port 5173..." -ForegroundColor Cyan
    Write-Host "Press Ctrl+C to stop" -ForegroundColor Yellow
    Write-Host ""
    cloudflared tunnel --url http://localhost:5173
    exit 0
}

# Neither found
Write-Host "Neither ngrok nor cloudflared found!" -ForegroundColor Red
Write-Host ""
Write-Host "=== Option 1: Install ngrok (Recommended) ===" -ForegroundColor Yellow
Write-Host "1. Sign up at: https://ngrok.com (free)" -ForegroundColor Cyan
Write-Host "2. Download from: https://ngrok.com/download" -ForegroundColor Cyan
Write-Host "3. Extract ngrok.exe to this folder or add to PATH" -ForegroundColor Cyan
Write-Host "4. Run this script again" -ForegroundColor Cyan
Write-Host ""
Write-Host "=== Option 2: Install cloudflared ===" -ForegroundColor Yellow
Write-Host "1. Download from: https://github.com/cloudflare/cloudflared/releases" -ForegroundColor Cyan
Write-Host "2. Extract cloudflared.exe to this folder" -ForegroundColor Cyan
Write-Host "3. Run this script again" -ForegroundColor Cyan
Write-Host ""
Write-Host "=== Quick Manual Setup ===" -ForegroundColor Yellow
Write-Host "If you have ngrok.exe in this folder, run:" -ForegroundColor Cyan
Write-Host "  .\ngrok.exe http 5173" -ForegroundColor White
Write-Host ""
Write-Host "If you have cloudflared.exe in this folder, run:" -ForegroundColor Cyan
Write-Host "  .\cloudflared.exe tunnel --url http://localhost:5173" -ForegroundColor White

