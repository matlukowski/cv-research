#!/usr/bin/env node
import { existsSync, copyFileSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { randomBytes } from 'crypto';

const PROJECT_ROOT = join(__dirname, '..');
const ENV_TEMPLATE = join(PROJECT_ROOT, '.env.template');
const ENV_FILE = join(PROJECT_ROOT, '.env');

console.log('🚀 Starting SaaS Boilerplate Setup...\n');

// Step 1: Check if .env already exists
if (existsSync(ENV_FILE)) {
  console.log('⚠️  .env file already exists!');
  console.log('   To avoid overwriting your existing configuration, setup will stop here.');
  console.log('   If you want to start fresh, delete .env and run this script again.\n');
  process.exit(0);
}

// Step 2: Copy .env.template to .env
console.log('📝 Creating .env file from template...');
if (!existsSync(ENV_TEMPLATE)) {
  console.error('❌ Error: .env.template file not found!');
  process.exit(1);
}

copyFileSync(ENV_TEMPLATE, ENV_FILE);
console.log('✅ .env file created successfully!\n');

// Step 3: Generate random secrets (optional - for future use with custom auth)
const authSecret = randomBytes(32).toString('base64');
console.log('🔐 Generated AUTH_SECRET (for future use):');
console.log(`   ${authSecret}\n`);

// Step 4: Instructions
console.log('📋 Next Steps:\n');
console.log('1. Open .env file and fill in your API keys:');
console.log('   • NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY (from https://dashboard.clerk.com)');
console.log('   • CLERK_SECRET_KEY');
console.log('   • STRIPE_SECRET_KEY (from https://dashboard.stripe.com)');
console.log('   • STRIPE_WEBHOOK_SECRET');
console.log('   • RESEND_API_KEY (from https://resend.com/api-keys)');
console.log('   • RESEND_FROM_EMAIL (your verified domain email)\n');

console.log('2. Start the local database:');
console.log('   pnpm docker:up\n');

console.log('3. Run database migrations:');
console.log('   pnpm db:generate');
console.log('   pnpm db:migrate\n');

console.log('4. (Optional) Seed the database with example data:');
console.log('   pnpm db:seed\n');

console.log('5. Start the development server:');
console.log('   pnpm dev\n');

console.log('🎉 Setup complete! Happy coding!\n');
console.log('📚 For more information, check out:');
console.log('   • README.md - General documentation');
console.log('   • docs/features.md - Feature overview');
console.log('   • docs/deployment.md - Deployment guide');
console.log('   • LOCAL_SETUP.md - Local development guide\n');