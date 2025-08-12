# AI Skincare Advisor - Render Deployment Script
# PowerShell script for Windows deployment preparation

Write-Host "🚀 AI Skincare Advisor - Render Deployment Preparation" -ForegroundColor Cyan
Write-Host "======================================================" -ForegroundColor Cyan

# Function to check if a file exists
function Test-FileExists {
    param([string]$FilePath)
    return Test-Path $FilePath
}

# Function to display status
function Write-Status {
    param([string]$Message, [string]$Status)
    $color = if ($Status -eq "OK") { "Green" } elseif ($Status -eq "WARNING") { "Yellow" } else { "Red" }
    Write-Host "  $Status $Message" -ForegroundColor $color
}

# Check Node.js installation
Write-Host "`n🔍 Checking Prerequisites..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Status "Node.js version: $nodeVersion" "OK"
} catch {
    Write-Status "Node.js not found. Please install Node.js 18+" "ERROR"
    exit 1
}

try {
    $npmVersion = npm --version
    Write-Status "npm version: $npmVersion" "OK"
} catch {
    Write-Status "npm not found" "ERROR"
    exit 1
}

# Check critical files
Write-Host "`n📁 Checking Critical Files..." -ForegroundColor Yellow

$criticalFiles = @(
    "package.json",
    "vite.config.ts",
    "tsconfig.json",
    "index.html",
    "index.tsx",
    "App.tsx",
    "types.ts",
    "services/geminiService.ts",
    "productData.ts",
    "index.css"
)

$missingFiles = @()
foreach ($file in $criticalFiles) {
    if (Test-FileExists $file) {
        Write-Status $file "OK"
    } else {
        Write-Status $file "MISSING"
        $missingFiles += $file
    }
}

if ($missingFiles.Count -gt 0) {
    Write-Host "`n❌ Missing critical files. Cannot proceed with deployment." -ForegroundColor Red
    exit 1
}

# Check environment variables
Write-Host "`n🔧 Checking Environment Configuration..." -ForegroundColor Yellow

if (Test-FileExists ".env.local") {
    $envContent = Get-Content ".env.local" -Raw
    if ($envContent -match "PLACEHOLDER_API_KEY") {
        Write-Status ".env.local contains placeholder API key" "WARNING"
        Write-Host "    📝 Remember to set real GEMINI_API_KEY in Render dashboard" -ForegroundColor Yellow
    } elseif ($envContent -match "GEMINI_API_KEY=") {
        Write-Status ".env.local has GEMINI_API_KEY configured" "OK"
    }
} else {
    Write-Status ".env.local file not found" "WARNING"
    Write-Host "    📝 Make sure to set GEMINI_API_KEY in Render dashboard" -ForegroundColor Yellow
}

# Install dependencies
Write-Host "`n📦 Installing Dependencies..." -ForegroundColor Yellow
try {
    npm install
    Write-Status "Dependencies installed successfully" "OK"
} catch {
    Write-Status "Failed to install dependencies" "ERROR"
    exit 1
}

# Test build
Write-Host "`n🔨 Testing Build Process..." -ForegroundColor Yellow
try {
    npm run build
    Write-Status "Build completed successfully" "OK"
    
    # Check if dist folder was created
    if (Test-Path "dist") {
        $distFiles = Get-ChildItem "dist" -Recurse | Measure-Object
        Write-Status "Generated $($distFiles.Count) files in dist folder" "OK"
    } else {
        Write-Status "dist folder not created" "ERROR"
        exit 1
    }
} catch {
    Write-Status "Build failed" "ERROR"
    Write-Host "    Please check the error messages above and fix any issues" -ForegroundColor Red
    exit 1
}

# Generate deployment summary
Write-Host "`n📋 DEPLOYMENT SUMMARY" -ForegroundColor Cyan
Write-Host "=====================" -ForegroundColor Cyan

Write-Host "✅ All critical files present" -ForegroundColor Green
Write-Host "✅ Dependencies installed" -ForegroundColor Green
Write-Host "✅ Build process successful" -ForegroundColor Green
Write-Host "✅ Ready for Render deployment" -ForegroundColor Green

Write-Host "`n🚀 RENDER DEPLOYMENT STEPS" -ForegroundColor Cyan
Write-Host "===========================" -ForegroundColor Cyan

Write-Host "1. 📂 Push your code to GitHub repository" -ForegroundColor White
Write-Host "2. 🌐 Go to https://render.com and create new Static Site" -ForegroundColor White
Write-Host "3. 🔗 Connect your GitHub repository" -ForegroundColor White
Write-Host "4. ⚙️  Configure build settings:" -ForegroundColor White
Write-Host "   - Build Command: npm run build" -ForegroundColor Gray
Write-Host "   - Publish Directory: dist" -ForegroundColor Gray
Write-Host "   - Node Version: 18" -ForegroundColor Gray
Write-Host "5. 🔑 Set environment variable:" -ForegroundColor White
Write-Host "   - GEMINI_API_KEY: [Your actual Gemini API key]" -ForegroundColor Gray
Write-Host "6. 🚀 Deploy!" -ForegroundColor White

Write-Host "`n📝 IMPORTANT NOTES" -ForegroundColor Yellow
Write-Host "==================" -ForegroundColor Yellow
Write-Host "• Make sure to set your real GEMINI_API_KEY in Render dashboard" -ForegroundColor White
Write-Host "• The app uses Tailwind CSS via CDN (no additional CSS build needed)" -ForegroundColor White
Write-Host "• All images are in the public/ directory and will be served correctly" -ForegroundColor White
Write-Host "• The app is a Single Page Application (SPA) with client-side routing" -ForegroundColor White

Write-Host "`n🎉 Deployment preparation complete!" -ForegroundColor Green
Write-Host "Your app is ready to be deployed to Render." -ForegroundColor Green