# AWS Amplify Deployment Guide

## 🚀 Simple GitHub to AWS Deployment (Like Render!)

AWS Amplify me aapka React app automatically deploy ho jayega GitHub repo se. Ye Render jaisa hi simple hai!

## 📋 Prerequisites

- ✅ AWS Account
- ✅ GitHub Repository (public ya private)
- ✅ Node.js project with `package.json`
- ✅ Gemini API Key

## 🎯 Step-by-Step Deployment

### Step 1: AWS Amplify Console

1. [AWS Amplify Console](https://console.aws.amazon.com/amplify/) me jaayein
2. **"New app"** → **"Host web app"** click karein

### Step 2: Connect GitHub Repository

1. **GitHub** select karein
2. **"Connect repository"** click karein
3. **"Authorize"** karein (GitHub permission)
4. **Repository** select karein: `ai_skincare_app`
5. **Branch** select karein: `main`
6. **"Next"** click karein

### Step 3: Build Settings

1. **Build settings** automatically detect ho jayenge:
   ```
   Build commands:
   - npm install
   - npm run build
   
   Output directory: dist
   ```
2. **"Next"** click karein

### Step 4: Environment Variables

1. **"Environment variables"** section me:
   ```
   Key: GEMINI_API_KEY
   Value: AIzaSyDrL08rqCclbYV577ZwSn04..sCbchb43I,AIzaSyDGYL-Zpi6_r0...Hu8bASRqR9UuPtb6534
   ```
   
   **Multiple API Keys Support:**
   - Comma-separated keys: `key1,key2,key3`
   - Spaces allowed: `key1, key2, key3`
   - Automatic failover if one key fails
   - Better reliability and higher quotas
   
2. **"Next"** click karein

### Step 5: Deploy

1. **"Save and deploy"** click karein
2. **Wait** for build to complete (5-10 minutes)
3. **Done!** 🎉

## 🔧 Configuration Files

### amplify.yml
```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm install
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: dist
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
```

### Environment Variables
AWS Amplify Console me ye environment variables add karein:
```
GEMINI_API_KEY = your_gemini_api_key
```

## 🌐 Result

- **URL**: `https://main.abc123.amplifyapp.com`
- **Auto-deploy**: Har push par automatically deploy
- **Build logs**: Console me check kar sakte hain
- **Environment variables**: Secure way me store

## 📱 Custom Domain (Optional)

### Step 1: Add Domain
1. **Domain management** → **"Add domain"**
2. **Domain name** enter karein: `yourdomain.com`
3. **"Configure domain"** click karein

### Step 2: Configure Subdomain
1. **Subdomain**: `www` ya `app` (optional)
2. **"Save"** click karein

### Step 3: DNS Configuration
1. **DNS records** copy karein
2. **Route 53** ya aapke DNS provider me add karein
3. **Wait** for DNS propagation (24-48 hours)

## 🔄 Auto-Deploy Setup

### GitHub Push = Auto Deploy
1. **Local changes** karein
2. **Commit** karein: `git commit -m "Update app"`
3. **Push** karein: `git push origin main`
4. **AWS Amplify** automatically:
   - Code pull karega
   - Build karega
   - Deploy karega
   - URL update karega

## 📊 Monitoring & Logs

### Build Logs
1. **AWS Amplify Console** → **Your app**
2. **"Builds"** tab click karein
3. **Latest build** click karein
4. **Build logs** check karein

### App Performance
1. **"Analytics"** tab click karein
2. **Page views, sessions** check karein
3. **Performance metrics** monitor karein

## 🚨 Troubleshooting

### Build Fails
1. **Build logs** check karein
2. **Environment variables** verify karein
3. **package.json** me scripts check karein
4. **Node.js version** compatibility check karein

### Environment Variables Not Working
1. **AWS Amplify Console** → **Environment variables**
2. **Variables** verify karein
3. **Redeploy** karein

### Custom Domain Issues
1. **DNS records** verify karein
2. **SSL certificate** status check karein
3. **Wait** for DNS propagation

## 💰 Cost

- **Free Tier**: 1000 build minutes/month
- **Build minutes**: $0.01 per minute after free tier
- **Storage**: Free for static hosting
- **Bandwidth**: Free for reasonable usage

## 🔐 Security

- **Environment variables** encrypted store hote hain
- **HTTPS** automatically enabled
- **GitHub integration** secure
- **AWS IAM** permissions minimal

## 📞 Support

- **AWS Amplify Documentation**: [docs.aws.amazon.com/amplify](https://docs.aws.amazon.com/amplify/)
- **AWS Support**: Console me "Support" → "Support Center"
- **Community**: AWS Amplify Discord/Forums

## 🎉 Success!

Aapka AI Skincare app ab AWS Amplify par live hai! 

**Next steps:**
1. **Custom domain** add karein (optional)
2. **Analytics** setup karein (optional)
3. **Monitoring** setup karein (optional)
4. **Enjoy** your deployed app! 🚀

---

**Note**: Ye guide AWS Amplify Console ke latest version ke liye hai. UI changes ho sakte hain, lekin steps same rahenge.
