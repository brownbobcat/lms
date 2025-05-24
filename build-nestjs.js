const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Building NestJS backend directly...');

// Create dist directory
const distPath = path.join(__dirname, 'dist/apps/lms-backend');
fs.mkdirSync(distPath, { recursive: true });

// Run TypeScript compiler directly
try {
  console.log('Compiling TypeScript...');
  execSync(
    'npx tsc -p apps/lms-backend/tsconfig.app.json --outDir dist/apps/lms-backend',
    {
      stdio: 'inherit',
    }
  );

  // Copy assets if they exist
  const assetsPath = path.join(__dirname, 'apps/lms-backend/src/assets');
  if (fs.existsSync(assetsPath)) {
    console.log('Copying assets...');
    execSync(`cp -r ${assetsPath} ${distPath}/`, { stdio: 'inherit' });
  }

  // Create a minimal package.json for the dist folder
  const packageJson = {
    name: 'lms-backend',
    version: '1.0.0',
    main: 'main.js',
    dependencies: {
      '@nestjs/common': '*',
      '@nestjs/core': '*',
      '@nestjs/platform-express': '*',
      'reflect-metadata': '*',
      rxjs: '*',
    },
  };

  // Copy actual dependencies from root package.json
  try {
    const rootPackage = require('./package.json');
    if (rootPackage.dependencies) {
      Object.keys(rootPackage.dependencies).forEach((dep) => {
        if (
          dep.includes('nest') ||
          dep.includes('typeorm') ||
          dep.includes('class-')
        ) {
          packageJson.dependencies[dep] = rootPackage.dependencies[dep];
        }
      });
    }
  } catch (e) {
    console.log('Could not read root package.json, using defaults');
  }

  fs.writeFileSync(
    path.join(distPath, 'package.json'),
    JSON.stringify(packageJson, null, 2)
  );

  console.log('Build completed successfully!');
  console.log(`Output directory: ${distPath}`);
} catch (error) {
  console.error('Build failed:', error);
  process.exit(1);
}
