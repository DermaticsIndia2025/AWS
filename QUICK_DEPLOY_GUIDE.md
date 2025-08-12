# 🚀 Render Par Deploy Karne Ka Quick Guide

## Step 1: Final Check
```bash
# Build test kar liye
npm run build

# Agar error aaye to fix kar liye
```

## Step 2: GitHub Push
```bash
git add .
git commit -m "Ready for Render deployment"
git push origin main
```

## Step 3: Render Setup
1. **render.com** par jaaiye
2. **New + → Static Site**
3. **GitHub repository connect** kariye

## Step 4: Build Configuration
```
Build Command: npm run build
Publish Directory: dist
Node Version: 18
```

## Step 5: Environment Variable
```
Key: GEMINI_API_KEY
Value: [Apna actual API key]
```

## Step 6: Deploy!
**"Create Static Site"** par click kariye

---

## 🔧 Agar Build Fail Ho Jaye

### Common Issues:
1. **API Key missing**: Environment variable check kariye
2. **Build errors**: Local mein `npm run build` test kariye
3. **Dependencies**: `package.json` check kariye

### Solutions:
1. **Redeploy**: Settings change ke baad redeploy kariye
2. **Logs check**: Build logs mein exact error dekh sakte hain
3. **Environment**: API key correct hai ya nahi check kariye

---

## ✅ Success Indicators
- ✅ Build completes without errors
- ✅ Site URL mil jaata hai
- ✅ App load hota hai properly
- ✅ Image upload work karta hai
- ✅ AI analysis work karta hai

## 🎉 Deployment Complete!
Aapka AI Skincare Advisor live ho gaya! 🎊