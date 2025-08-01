# Building IMS Desktop App

## Automatic Builds (Recommended)

### GitHub Actions Setup
1. **Push your code to GitHub** (if not already there)
2. **GitHub Actions will automatically build** for Mac and Windows
3. **Download installers** from the Actions tab or Releases

### What Gets Built:
- **Mac**: `IMS_x.x.x_aarch64.dmg` (Apple Silicon) and `IMS_x.x.x_x64.dmg` (Intel Mac)
- **Windows**: `IMS_x.x.x_x64_en-US.msi` (Windows installer)
- **Linux**: `IMS_x.x.x_amd64.AppImage` (Linux AppImage)

## Manual Local Builds

### Mac (your current setup):
```bash
npm run tauri:build
```
Output: `src-tauri/target/release/bundle/dmg/IMS_0.0.0_aarch64.dmg`

### Windows (requires Windows machine):
```bash
npm install
npm run tauri:build
```
Output: `src-tauri/target/release/bundle/msi/IMS_0.0.0_x64_en-US.msi`

## Distribution for Testing

### Via Google Drive/Dropbox:
1. Upload the `.dmg` (Mac) and `.msi` (Windows) files
2. Share the download link with testers
3. **Mac**: Double-click `.dmg`, drag to Applications
4. **Windows**: Double-click `.msi` to install

### File Sizes:
- Mac DMG: ~15-25MB
- Windows MSI: ~15-25MB
- Much smaller than Electron apps (150MB+)

## Chromebook Compatibility
- **Windows on Chromebook**: Use the Windows `.msi` installer
- **Linux on Chromebook**: Use the Linux `.AppImage` file
- **Chrome OS only**: Consider PWA version instead

## Code Signing (Production)
- **Mac**: Apple Developer certificate ($99/year)
- **Windows**: Code signing certificate (~$200/year)
- Without signing: Users get security warnings but can still install
