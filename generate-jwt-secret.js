const crypto = require('crypto');

// Generate a secure JWT secret (256 bits = 32 bytes)
const generateJWTSecret = () => {
  return crypto.randomBytes(32).toString('base64');
};

// Generate multiple secrets for different environments
console.log('🔐 Generated JWT Secrets:');
console.log('');
console.log('Development:');
console.log('JWT_SECRET=' + generateJWTSecret());
console.log('');
console.log('Staging:');
console.log('JWT_SECRET=' + generateJWTSecret());
console.log('');
console.log('Production:');
console.log('JWT_SECRET=' + generateJWTSecret());
console.log('');
console.log('⚠️  Important: Use different secrets for each environment!');
console.log('💡 These are cryptographically secure 256-bit secrets.');
