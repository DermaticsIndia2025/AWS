# AI Skincare Advisor - Render Deployment Guide

## Project Overview
This is a React-based AI Skincare Advisor application built with Vite, TypeScript, and Google's Gemini AI. The app provides personalized skincare recommendations based on facial image analysis and user preferences.

## Important Files for Deployment

### 🔥 Critical Files (Must Include)
1. **package.json** - Dependencies and build scripts
2. **vite.config.ts** - Vite configuration with environment variables
3. **index.html** - Main HTML entry point with Tailwind CSS
4. **index.tsx** - React application entry point
5. **App.tsx** - Main application component
6. **tsconfig.json** - TypeScript configuration
7. **types.ts** - TypeScript type definitions
8. **services/geminiService.ts** - AI service integration
9. **productData.ts** - Product catalog data
10. **constants.ts** - Application constants

### 📁 Essential Directories
- **components/** - All React components
  - Sidebar.tsx, Header.tsx, CartDrawer.tsx
  - Step1PastProducts.tsx, Step2FaceAnalysis.tsx, Step3Goals.tsx
  - Report.tsx, Chatbot.tsx, ChatbotPage.tsx
  - StepIndicator.tsx, CameraCapture.tsx
  - common/ (Button.tsx, Card.tsx, Select.tsx, Spinner.tsx)
  - Icons.tsx
- **public/** - Static assets
  - logo.png
  - ChatGPT Image Aug 5, 2025, 12_13_55 PM.png
- **services/** - API services

### 🚫 Files to Exclude (.gitignore)
- node_modules/
- dist/
- dist-ssr/
- *.local (including .env.local)
- .DS_Store
- logs and debug files

## Render Deployment Configuration

### 1. Build Settings
```yaml
Build Command: npm run build
Publish Directory: dist
Node Version: 18 or higher
```

### 2. Environment Variables (Set in Render Dashboard)
```
GEMINI_API_KEY=your_actual_gemini_api_key_here
```

### 3. Package.json Scripts
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

## Pre-Deployment Checklist

### ✅ Required Actions
1. **Update API Key**: Replace `PLACEHOLDER_API_KEY` in .env.local with actual Gemini API key
2. **Verify Dependencies**: Ensure all dependencies in package.json are correct
3. **Test Build Locally**: Run `npm run build` to verify build works
4. **Check Image Paths**: Verify all image references in public/ directory
5. **Environment Variables**: Set GEMINI_API_KEY in Render dashboard

### ⚠️ Important Notes
- The app uses Tailwind CSS via CDN (configured in index.html)
- React and dependencies are loaded via ESM CDN (importmap in index.html)
- No separate CSS files needed - all styling is inline with Tailwind
- The app requires a valid Gemini API key to function

## File Structure for Deployment
```
ai_skincare_app/
├── package.json                 ✅ Critical
├── vite.config.ts              ✅ Critical
├── tsconfig.json               ✅ Critical
├── index.html                  ✅ Critical
├── index.tsx                   ✅ Critical
├── App.tsx                     ✅ Critical
├── types.ts                    ✅ Critical
├── constants.ts                ✅ Critical
├── productData.ts              ✅ Critical
├── global.d.ts                 ✅ Include
├── metadata.json               ✅ Include
├── README.md                   ✅ Include
├── services/
│   └── geminiService.ts        ✅ Critical
├── components/
│   ├── *.tsx files             ✅ All Critical
│   └── common/
│       └── *.tsx files         ✅ All Critical
├── public/
│   ├── logo.png                ✅ Critical
│   └── *.png files             ✅ Include all images
├── .gitignore                  ✅ Include
└── CSV files                   ✅ Include (product data)
```

## Deployment Steps

1. **Prepare Repository**
   - Ensure all critical files are committed
   - Update .env.local with actual API key (for local testing)
   - Test build locally: `npm run build`

2. **Connect to Render**
   - Connect your GitHub repository to Render
   - Select "Static Site" service type

3. **Configure Build Settings**
   - Build Command: `npm run build`
   - Publish Directory: `dist`
   - Node Version: 18+

4. **Set Environment Variables**
   - Add `GEMINI_API_KEY` in Render dashboard
   - Use your actual Gemini API key value

5. **Deploy**
   - Trigger deployment
   - Monitor build logs for any errors

## Troubleshooting

### Common Issues
1. **Build Fails**: Check if all dependencies are in package.json
2. **API Errors**: Verify GEMINI_API_KEY is set correctly in Render
3. **Image Loading**: Ensure all images are in public/ directory
4. **TypeScript Errors**: Check tsconfig.json configuration

### Performance Optimization
- Images are optimized and served from public/ directory
- Tailwind CSS loaded via CDN for faster loading
- React and dependencies loaded via ESM for better caching

## Post-Deployment
- Test all features including image upload and AI analysis
- Verify cart functionality and product recommendations
- Check responsive design on different devices
- Monitor application performance and error logs