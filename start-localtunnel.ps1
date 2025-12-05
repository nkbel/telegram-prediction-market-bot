# Script to start localtunnel for Telegram WebApp
# No signup required!

Write-Host "=== Starting Localtunnel ===" -ForegroundColor Green
Write-Host ""
Write-Host "This will create a public HTTPS URL for your WebApp" -ForegroundColor Yellow
Write-Host "No signup required!" -ForegroundColor Green
Write-Host ""
Write-Host "Starting tunnel on port 5173..." -ForegroundColor Cyan
Write-Host ""

# Start localtunnel
lt --port 5173

# Note: The URL will be shown in the terminal
# It will look like: https://xxxxx.loca.lt
# Copy that URL and update your .env file

