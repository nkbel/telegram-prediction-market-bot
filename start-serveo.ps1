# Start Serveo tunnel (SSH-based, no signup required)

Write-Host "=== Starting Serveo Tunnel ===" -ForegroundColor Green
Write-Host ""
Write-Host "This uses SSH to create a public HTTPS URL" -ForegroundColor Yellow
Write-Host "No signup required!" -ForegroundColor Green
Write-Host ""
Write-Host "Starting tunnel..." -ForegroundColor Cyan
Write-Host "You'll see a URL like: https://random-name.serveo.net" -ForegroundColor Yellow
Write-Host "Copy that URL and update your .env file" -ForegroundColor Yellow
Write-Host ""
Write-Host "Keep this window open!" -ForegroundColor Red
Write-Host ""

ssh -R 80:localhost:5173 serveo.net

