#!/usr/bin/env node

/**
 * Build Verification Script for AI Skincare Advisor
 * Verifies that the build output is correct and ready for deployment
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 AI Skincare Advisor - Build Verification');
console.log('===========================================');

// Check if dist directory exists
if (!fs.existsSync('dist')) {
    console.log('❌ dist directory not found. Run "npm run build" first.');
    process.exit(1);
}

console.log('✅ dist directory found');

// Check for essential files in dist
const requiredFiles = [
    'index.html',
    'assets'  // Vite creates an assets directory
];

const missingFiles = [];
requiredFiles.forEach(file => {
    const filePath = path.join('dist', file);
    if (fs.existsSync(filePath)) {
        console.log(`✅ ${file} found`);
    } else {
        console.log(`❌ ${file} missing`);
        missingFiles.push(file);
    }
});

// Check index.html content
try {
    const indexHtml = fs.readFileSync('dist/index.html', 'utf8');
    
    // Check for essential elements
    const checks = [
        { name: 'DOCTYPE declaration', pattern: /<!DOCTYPE html>/i },
        { name: 'Root div', pattern: /<div id="root">/i },
        { name: 'Tailwind CSS', pattern: /tailwindcss\.com/i },
        { name: 'React imports', pattern: /react@/i },
        { name: 'Module script', pattern: /type="module"/i }
    ];

    console.log('\n📄 Checking index.html content:');
    checks.forEach(check => {
        if (check.pattern.test(indexHtml)) {
            console.log(`✅ ${check.name} found`);
        } else {
            console.log(`⚠️  ${check.name} not found`);
        }
    });

} catch (error) {
    console.log('❌ Could not read index.html');
    missingFiles.push('index.html content');
}

// Check assets directory
if (fs.existsSync('dist/assets')) {
    const assets = fs.readdirSync('dist/assets');
    console.log(`\n📦 Assets directory contains ${assets.length} files:`);
    
    const jsFiles = assets.filter(f => f.endsWith('.js'));
    const cssFiles = assets.filter(f => f.endsWith('.css'));
    
    console.log(`   📄 JavaScript files: ${jsFiles.length}`);
    console.log(`   🎨 CSS files: ${cssFiles.length}`);
    
    if (jsFiles.length === 0) {
        console.log('⚠️  No JavaScript files found in assets');
    }
} else {
    console.log('⚠️  Assets directory not found');
}

// Check for public assets
const publicAssets = ['logo.png'];
console.log('\n🖼️  Checking public assets:');
publicAssets.forEach(asset => {
    const assetPath = path.join('dist', asset);
    if (fs.existsSync(assetPath)) {
        console.log(`✅ ${asset} found`);
    } else {
        console.log(`⚠️  ${asset} not found`);
    }
});

// Calculate total size
function getDirectorySize(dirPath) {
    let totalSize = 0;
    
    function calculateSize(currentPath) {
        const stats = fs.statSync(currentPath);
        if (stats.isDirectory()) {
            const files = fs.readdirSync(currentPath);
            files.forEach(file => {
                calculateSize(path.join(currentPath, file));
            });
        } else {
            totalSize += stats.size;
        }
    }
    
    calculateSize(dirPath);
    return totalSize;
}

const totalSize = getDirectorySize('dist');
const sizeInMB = (totalSize / (1024 * 1024)).toFixed(2);

console.log(`\n📊 Build Statistics:`);
console.log(`   📁 Total size: ${sizeInMB} MB`);
console.log(`   📄 Total files: ${getAllFiles('dist').length}`);

function getAllFiles(dirPath, arrayOfFiles = []) {
    const files = fs.readdirSync(dirPath);
    
    files.forEach(file => {
        const fullPath = path.join(dirPath, file);
        if (fs.statSync(fullPath).isDirectory()) {
            arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
        } else {
            arrayOfFiles.push(fullPath);
        }
    });
    
    return arrayOfFiles;
}

// Final verdict
console.log('\n🎯 Build Verification Summary:');
if (missingFiles.length === 0) {
    console.log('✅ Build verification passed!');
    console.log('🚀 Your app is ready for deployment to Render.');
    
    console.log('\n📋 Next steps:');
    console.log('1. Push your code to GitHub');
    console.log('2. Create a new Static Site on Render');
    console.log('3. Set build command: npm run build');
    console.log('4. Set publish directory: dist');
    console.log('5. Add GEMINI_API_KEY environment variable');
    console.log('6. Deploy!');
    
    process.exit(0);
} else {
    console.log('❌ Build verification failed!');
    console.log('Missing or problematic files:');
    missingFiles.forEach(file => console.log(`   - ${file}`));
    console.log('\nPlease fix these issues before deploying.');
    process.exit(1);
}