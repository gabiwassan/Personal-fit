# Deployment Instructions for GitHub Pages

## 📋 Steps to Enable GitHub Pages

1. **Go to your GitHub repository settings:**
   - Navigate to https://github.com/gabiwassan/Personal-fit
   - Click on **Settings** tab
   - Click on **Pages** in the left sidebar

2. **Configure GitHub Pages:**
   - Under **Build and deployment**
   - **Source**: Select `GitHub Actions`
   - Save the configuration

3. **Trigger the deployment:**
   - The workflow will automatically run when you push to the `claude/build-plan-tracker-app-zDpap` branch
   - You can also manually trigger it from the **Actions** tab
   - Click on **Deploy to GitHub Pages** workflow
   - Click **Run workflow** button

4. **Wait for deployment:**
   - Go to the **Actions** tab to see the deployment progress
   - Wait for the workflow to complete (usually 1-2 minutes)

5. **Access your app:**
   - Once deployed, your app will be available at:
   - **https://gabiwassan.github.io/Personal-fit/**

## 🔄 Automatic Deployments

Every time you push to the `claude/build-plan-tracker-app-zDpap` branch, the app will automatically rebuild and redeploy to GitHub Pages.

## 🛠️ Manual Deployment (Alternative)

If you prefer to deploy manually without GitHub Actions:

```bash
cd plan-tracker

# Build the project
npm run build

# Deploy to gh-pages branch (requires gh-pages package)
npm install -g gh-pages
gh-pages -d dist -b gh-pages
```

Then configure GitHub Pages to deploy from the `gh-pages` branch instead of GitHub Actions.

## ✅ Verify Deployment

After deployment completes:
1. Visit https://gabiwassan.github.io/Personal-fit/
2. The app should load and work fully offline
3. You can install it as a PWA on your phone (Add to Home Screen)

## 🐛 Troubleshooting

If the deployment fails:
- Check the Actions tab for error logs
- Ensure GitHub Pages is enabled in repository settings
- Verify the workflow has proper permissions
- Make sure the branch name matches in the workflow file

## 📱 PWA Installation

Once deployed:
1. Open the app on your mobile device
2. Tap the browser menu (⋮ or ⋯)
3. Select "Add to Home Screen" or "Install"
4. The app will work offline and feel like a native app!
