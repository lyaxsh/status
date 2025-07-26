const { execSync } = require('child_process');

console.log('Setting up database schema...');

try {
  // Generate Prisma client
  console.log('Generating Prisma client...');
  execSync('npx prisma generate', { stdio: 'inherit' });
  
  // Push schema to database
  console.log('Pushing schema to database...');
  execSync('npx prisma db push', { stdio: 'inherit' });
  
  console.log('Database setup completed successfully!');
} catch (error) {
  console.error('Database setup failed:', error.message);
  process.exit(1);
} 