# Alternative Tunneling Solutions

If localtunnel gives 503 errors, try these alternatives:

## Option 1: Serveo (SSH-based, No Install Needed)

1. Open a new terminal
2. Run:
   ```powershell
   ssh -R 80:localhost:5173 serveo.net
   ```
3. You'll get a URL like: `https://random-name.serveo.net`
4. Update `.env` with that URL

**Note**: Requires SSH client (usually pre-installed on Windows 10+)

## Option 2: Localhost.run (SSH-based)

1. Open a new terminal
2. Run:
   ```powershell
   ssh -R 80:localhost:5173 ssh.localhost.run
   ```
3. Copy the HTTPS URL shown
4. Update `.env`

## Option 3: Try Different Localtunnel Server

Sometimes the default localtunnel server is overloaded. Try:
```powershell
lt --port 5173 --host https://loca.lt
```

Or try a different subdomain:
```powershell
lt --port 5173 --subdomain my-bot-123
```

## Option 4: Use VS Code Port Forwarding (If using VS Code)

1. Open VS Code
2. Press Ctrl+Shift+P
3. Type "Ports: Focus on Ports View"
4. Click "Forward a Port"
5. Enter 5173
6. Right-click the port → "Port Visibility" → "Public"
7. Copy the public URL
8. Update `.env`

## Option 5: Deploy to Vercel (Permanent Solution)

For a permanent solution, deploy the WebApp:
1. Build: `cd webapp && npm run build`
2. Deploy to Vercel (free): https://vercel.com
3. Get the deployment URL
4. Update `.env`

