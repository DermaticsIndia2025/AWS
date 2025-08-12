# Important Files for Render Deployment

## 🔴 CRITICAL FILES (Must Include - App Won't Work Without These)

### Configuration Files
- `package.json` - Dependencies, scripts, project metadata
- `vite.config.ts` - Build configuration, environment variables setup
- `tsconfig.json` - TypeScript compiler configuration
- `index.html` - Main HTML entry point with Tailwind CSS and importmap
- `.gitignore` - Specifies files to exclude from version control

### Core Application Files
- `index.tsx` - React application entry point
- `App.tsx` - Main application component with routing logic
- `types.ts` - TypeScript type definitions for the entire app
- `constants.ts` - Application constants
- `global.d.ts` - Global TypeScript declarations

### Data Files
- `productData.ts` - Complete product catalog (generated from CSV)
- `dermaticsindia_all_products_with_variant_ids.csv` - Raw product data
- `dermatics_all_products_final.csv` - Processed product data
- `metadata.json` - Application metadata

### AI Service
- `services/geminiService.ts` - Google Gemini AI integration for image analysis and recommendations

## 🟡 ESSENTIAL COMPONENTS (Required for Full Functionality)

### Main Components
- `components/Sidebar.tsx` - Navigation sidebar with logo and cart
- `components/Header.tsx` - Mobile header with menu toggle
- `components/CartDrawer.tsx` - Shopping cart functionality
- `components/StepIndicator.tsx` - Progress indicator

### Step Components (Core User Journey)
- `components/Step1PastProducts.tsx` - Past products input
- `components/Step2FaceAnalysis.tsx` - Image upload and analysis
- `components/Step3Goals.tsx` - Skincare goals selection
- `components/Report.tsx` - AI recommendations display

### Chat Components
- `components/Chatbot.tsx` - Chat interface component
- `components/ChatbotPage.tsx` - Full chat page
- `components/CameraCapture.tsx` - Camera functionality for image capture

### Common UI Components
- `components/common/Button.tsx` - Reusable button component
- `components/common/Card.tsx` - Card layout component
- `components/common/Select.tsx` - Dropdown select component
- `components/common/Spinner.tsx` - Loading spinner component
- `components/Icons.tsx` - SVG icon components

## 🟢 STATIC ASSETS (Important for UI/UX)

### Images
- `public/logo.png` - Company logo
- `public/ChatGPT Image Aug 5, 2025, 12_13_55 PM.png` - AI advisor illustration
- `logo.png` - Root level logo (backup)

### Other Assets
- `public/test.txt` - Test file (can be excluded)

## 🔵 DOCUMENTATION (Recommended)
- `README.md` - Project documentation
- `DEPLOYMENT_GUIDE.md` - Deployment instructions (newly created)
- `IMPORTANT_FILES_LIST.md` - This file

## ❌ FILES TO EXCLUDE (Don't Deploy These)

### Environment & Local Files
- `.env.local` - Contains placeholder API key (set real key in Render dashboard)
- `node_modules/` - Dependencies (installed during build)
- `dist/` - Build output (generated during deployment)
- `dist-ssr/` - SSR build output

### Development Files
- `.vscode/` - VS Code settings
- `.idea/` - IntelliJ settings
- `*.log` - Log files
- `.DS_Store` - macOS system files

### Hidden Directories
- `.zencoder/` - Development tool files

## 📋 DEPLOYMENT PRIORITY CHECKLIST

### Phase 1: Core Functionality (Must Have)
- [ ] package.json
- [ ] vite.config.ts
- [ ] tsconfig.json
- [ ] index.html
- [ ] index.tsx
- [ ] App.tsx
- [ ] types.ts
- [ ] services/geminiService.ts
- [ ] productData.ts

### Phase 2: User Interface (Essential)
- [ ] All components/*.tsx files
- [ ] All components/common/*.tsx files
- [ ] public/logo.png
- [ ] public/*.png images

### Phase 3: Data & Configuration (Important)
- [ ] constants.ts
- [ ] global.d.ts
- [ ] metadata.json
- [ ] CSV data files
- [ ] .gitignore

### Phase 4: Documentation (Recommended)
- [ ] README.md
- [ ] DEPLOYMENT_GUIDE.md

## 🚀 RENDER DEPLOYMENT SETTINGS

```yaml
Service Type: Static Site
Build Command: npm run build
Publish Directory: dist
Node Version: 18+
Environment Variables:
  GEMINI_API_KEY: [Your actual Gemini API key]
```

## 📊 File Count Summary
- **Critical Files**: 11 files
- **Essential Components**: 15 files
- **Static Assets**: 3 files
- **Documentation**: 3 files
- **Total Important Files**: ~32 files

## ⚠️ IMPORTANT NOTES

1. **API Key**: The `.env.local` file contains a placeholder. Set the real `GEMINI_API_KEY` in Render's environment variables.

2. **No CSS Files**: The app uses Tailwind CSS via CDN (configured in index.html), so no separate CSS files are needed.

3. **ESM Imports**: React and dependencies are loaded via importmap in index.html, not traditional npm packages.

4. **Image References**: All images are referenced from the public/ directory and must be included.

5. **TypeScript**: The app is fully TypeScript-based, so all .tsx and .ts files are essential.

6. **Product Data**: The app relies on the product catalog in productData.ts, which is generated from CSV files.

This list ensures you have all necessary files for a successful Render deployment while excluding unnecessary development files.