#!/usr/bin/env node

/**
 * Deployment Readiness Checker for AI Skincare Advisor
 * This script checks if all critical files are present before deployment
 */

const fs = require('fs');
const path = require('path');

// Define critical files that must exist for deployment
const criticalFiles = [
  'package.json',
  'vite.config.ts',
  'tsconfig.json',
  'index.html',
  'index.tsx',
  'App.tsx',
  'types.ts',
  'services/geminiService.ts',
  'productData.ts'
];

const essentialFiles = [
  'components/Sidebar.tsx',
  'components/Header.tsx',
  'components/CartDrawer.tsx',
  'components/Step1PastProducts.tsx',
  'components/Step2FaceAnalysis.tsx',
  'components/Step3Goals.tsx',
  'components/Report.tsx',
  'components/ChatbotPage.tsx',
  'components/StepIndicator.tsx',
  'components/Icons.tsx',
  'components/common/Button.tsx',
  'components/common/Card.tsx',
  'components/common/Select.tsx',
  'components/common/Spinner.tsx',
  'public/logo.png'
];

const optionalFiles = [
  'constants.ts',
  'global.d.ts',
  'metadata.json',
  'README.md',
  '.gitignore'
];

function checkFile(filePath) {
  try {
    return fs.existsSync(filePath);
  } catch (error) {
    return false;
  }
}

function checkFiles(fileList, category) {
  console.log(`\n🔍 Checking ${category} files:`);
  let allPresent = true;
  let presentCount = 0;

  fileList.forEach(file => {
    const exists = checkFile(file);
    const status = exists ? '✅' : '❌';
    console.log(`  ${status} ${file}`);
    
    if (exists) {
      presentCount++;
    } else if (category === 'Critical') {
      allPresent = false;
    }
  });

  console.log(`  📊 ${presentCount}/${fileList.length} files present`);
  return { allPresent, presentCount, total: fileList.length };
}

function checkEnvironmentVariables() {
  console.log('\n🔧 Environment Variables Check:');
  
  // Check if .env.local exists and has content
  if (checkFile('.env.local')) {
    try {
      const envContent = fs.readFileSync('.env.local', 'utf8');
      if (envContent.includes('PLACEHOLDER_API_KEY')) {
        console.log('  ⚠️  .env.local contains placeholder API key');
        console.log('  📝 Remember to set real GEMINI_API_KEY in Render dashboard');
      } else if (envContent.includes('GEMINI_API_KEY=')) {
        console.log('  ✅ .env.local has GEMINI_API_KEY (for local testing)');
        console.log('  📝 Make sure to set the same key in Render dashboard');
      }
    } catch (error) {
      console.log('  ❌ Could not read .env.local file');
    }
  } else {
    console.log('  ❌ .env.local file not found');
  }
}

function checkPackageJson() {
  console.log('\n📦 Package.json Check:');
  
  if (!checkFile('package.json')) {
    console.log('  ❌ package.json not found');
    return false;
  }

  try {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    
    // Check scripts
    if (packageJson.scripts && packageJson.scripts.build) {
      console.log('  ✅ Build script found:', packageJson.scripts.build);
    } else {
      console.log('  ❌ Build script missing');
      return false;
    }

    // Check dependencies
    const requiredDeps = ['react', 'react-dom', '@google/genai'];
    const missingDeps = requiredDeps.filter(dep => 
      !packageJson.dependencies || !packageJson.dependencies[dep]
    );

    if (missingDeps.length === 0) {
      console.log('  ✅ All required dependencies present');
    } else {
      console.log('  ❌ Missing dependencies:', missingDeps.join(', '));
      return false;
    }

    return true;
  } catch (error) {
    console.log('  ❌ Could not parse package.json');
    return false;
  }
}

function generateDeploymentSummary(results) {
  console.log('\n📋 DEPLOYMENT READINESS SUMMARY');
  console.log('================================');
  
  const totalFiles = results.critical.total + results.essential.total + results.optional.total;
  const totalPresent = results.critical.presentCount + results.essential.presentCount + results.optional.presentCount;
  
  console.log(`📊 Overall: ${totalPresent}/${totalFiles} files present`);
  
  if (results.critical.allPresent && results.packageJsonOk) {
    console.log('🟢 READY FOR DEPLOYMENT');
    console.log('   All critical files are present');
    console.log('   Package.json is properly configured');
  } else {
    console.log('🔴 NOT READY FOR DEPLOYMENT');
    if (!results.critical.allPresent) {
      console.log('   ❌ Missing critical files');
    }
    if (!results.packageJsonOk) {
      console.log('   ❌ Package.json issues');
    }
  }

  console.log('\n📝 Next Steps:');
  console.log('1. Fix any missing critical files');
  console.log('2. Set GEMINI_API_KEY in Render dashboard');
  console.log('3. Configure Render build settings:');
  console.log('   - Build Command: npm run build');
  console.log('   - Publish Directory: dist');
  console.log('   - Node Version: 18+');
}

// Main execution
console.log('🚀 AI Skincare Advisor - Deployment Readiness Check');
console.log('==================================================');

const results = {
  critical: checkFiles(criticalFiles, 'Critical'),
  essential: checkFiles(essentialFiles, 'Essential'),
  optional: checkFiles(optionalFiles, 'Optional'),
  packageJsonOk: checkPackageJson()
};

checkEnvironmentVariables();
generateDeploymentSummary(results);

// Exit with appropriate code
process.exit(results.critical.allPresent && results.packageJsonOk ? 0 : 1);