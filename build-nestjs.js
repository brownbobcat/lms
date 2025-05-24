const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Building NestJS backend directly...');

// Create dist directory
const distPath = path.join(__dirname, 'dist/apps/lms-backend');
fs.mkdirSync(distPath, { recursive: true });

// Run TypeScript compiler with proper rootDir
try {
  console.log('Compiling TypeScript...');

  // Create a temporary tsconfig that sets the rootDir correctly
  const tempTsConfig = {
    extends: './apps/lms-backend/tsconfig.app.json',
    compilerOptions: {
      outDir: './dist/apps/lms-backend',
      rootDir: './apps/lms-backend/src',
    },
    include: ['apps/lms-backend/src/**/*'],
    exclude: ['node_modules', 'dist', 'test', '**/*spec.ts'],
  };

  fs.writeFileSync(
    'tsconfig.build.temp.json',
    JSON.stringify(tempTsConfig, null, 2)
  );

  execSync('npx tsc -p tsconfig.build.temp.json', {
    stdio: 'inherit',
  });

  // Clean up temp file
  fs.unlinkSync('tsconfig.build.temp.json');

  // Copy assets if they exist
  const assetsPath = path.join(__dirname, 'apps/lms-backend/src/assets');
  if (fs.existsSync(assetsPath)) {
    console.log('Copying assets...');
    execSync(`cp -r ${assetsPath} ${distPath}/assets`, { stdio: 'inherit' });
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

  // List all files in the dist directory
  console.log('\nFiles in dist directory:');
  execSync(`find ${distPath} -type f -name "*.js" | head -20`, {
    stdio: 'inherit',
  });

  // Check if main.js exists
  const mainPath = path.join(distPath, 'main.js');
  if (fs.existsSync(mainPath)) {
    console.log('\n✓ main.js found at:', mainPath);
  } else {
    console.log('\n✗ main.js NOT found at expected location');

    // Find where main.js actually is
    try {
      const findResult = execSync(`find ${distPath} -name "main.js"`, {
        encoding: 'utf8',
      });
      if (findResult) {
        console.log('Found main.js at:', findResult.trim());
      }
    } catch (e) {
      /* empty */
    }
  }
} catch (error) {
  console.error('Build failed:', error);
  process.exit(1);
}
