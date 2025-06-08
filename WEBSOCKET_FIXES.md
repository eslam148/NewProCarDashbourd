# WebSocket Connection Issues - Solutions

## Problem Description
WebSocket connection errors in Angular development server:
```
WebSocket connection to 'ws://localhost:4200/' failed
```

## Solutions

### 1. Quick Fix - Restart Development Server
```bash
# Stop current server (Ctrl+C)
# Then restart with stable options
npm run start:stable
```

### 2. Alternative Start Commands

#### Standard Start (Default)
```bash
npm start
# or
ng serve -o
```

#### Stable Start (Recommended for WebSocket issues)
```bash
npm run start:stable
# or
ng serve -o --disable-host-check --poll=2000
```

#### No HMR Start (If HMR causes issues)
```bash
npm run start:no-hmr
# or
ng serve -o --no-hmr --disable-host-check
```

#### Debug Start (Full debugging options)
```bash
npm run start:debug
# or
ng serve -o --host 0.0.0.0 --disable-host-check --poll=2000 --no-hmr
```

### 3. Browser Solutions

#### Clear Browser Cache
1. Open Developer Tools (F12)
2. Right-click refresh button
3. Select "Empty Cache and Hard Reload"

#### Disable Browser Extensions
- Temporarily disable ad blockers
- Disable VPN extensions
- Disable security extensions that might block WebSocket

### 4. Network Solutions

#### Check Firewall
- Allow Angular CLI through Windows Firewall
- Allow port 4200 in firewall settings

#### Check Antivirus
- Add Angular project folder to antivirus exclusions
- Temporarily disable real-time protection

### 5. Angular CLI Solutions

#### Update Angular CLI
```bash
npm install -g @angular/cli@latest
```

#### Clear Angular Cache
```bash
ng cache clean
```

#### Reinstall Node Modules
```bash
rm -rf node_modules package-lock.json
npm install
```

### 6. Advanced Solutions

#### Use Different Port
```bash
ng serve --port 4201
```

#### Use Different Host
```bash
ng serve --host 127.0.0.1
```

#### Disable WebSocket Completely
```bash
ng serve --live-reload=false
```

## Prevention Tips

1. **Use Stable Scripts**: Always use `npm run start:stable` for development
2. **Regular Updates**: Keep Angular CLI and dependencies updated
3. **Clean Environment**: Regularly clear cache and reinstall dependencies
4. **Network Stability**: Ensure stable internet connection
5. **Resource Management**: Close unnecessary applications to free up ports

## Troubleshooting Steps

1. **Check if port 4200 is in use**:
   ```bash
   netstat -ano | findstr :4200
   ```

2. **Kill process using port 4200**:
   ```bash
   taskkill /PID <PID_NUMBER> /F
   ```

3. **Check Node.js version**:
   ```bash
   node --version
   npm --version
   ```

4. **Verify Angular CLI version**:
   ```bash
   ng version
   ```

## Notes

- WebSocket errors don't affect application functionality
- They only impact hot module replacement (HMR) and live reload
- The application will still work normally in the browser
- Manual refresh is needed when WebSocket fails

## Contact

If issues persist, check:
- Angular CLI GitHub issues
- Stack Overflow for similar problems
- Angular Discord community
