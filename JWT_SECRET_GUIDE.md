# JWT Secret Management Guide

## 🔐 What is a JWT Secret?

A JWT (JSON Web Token) secret is a cryptographic key used to:
- **Sign** JWT tokens when they're created
- **Verify** JWT tokens when they're received
- Ensure tokens haven't been tampered with

## 🚨 Security Requirements

### Minimum Requirements:
- **Length**: At least 32 characters (256 bits)
- **Randomness**: Cryptographically secure random bytes
- **Uniqueness**: Different secrets for each environment
- **Secrecy**: Never expose in code or logs

## 🛠️ How to Generate Secure JWT Secrets

### Method 1: Node.js Crypto (Recommended)
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```
**Output example:** `kQdXxGf8Pz7RtVwN2mYcE5nL9sA1bC3dF6hJ8kM0pQ4=`

### Method 2: OpenSSL
```bash
openssl rand -base64 32
```

### Method 3: Using our generator script
```bash
node generate-jwt-secret.js
```

### Method 4: Python
```python
import secrets
import base64
print(base64.b64encode(secrets.token_bytes(32)).decode())
```

## 📋 Implementation Steps

### 1. Generate a New Secret
Run this command in your terminal:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### 2. Update Your .env File
Replace your current JWT_SECRET with the generated one:
```env
JWT_SECRET=your_generated_secret_here_32_chars_minimum
```

### 3. Verify the Setup
Start your server - it will validate the secret length:
```bash
pnpm dev
```

## 🌍 Environment-Specific Secrets

### Development (.env)
```env
JWT_SECRET=dev_secret_kQdXxGf8Pz7RtVwN2mYcE5nL9sA1bC3dF6hJ8kM0pQ4=
```

### Staging (.env.staging)
```env
JWT_SECRET=staging_secret_mN8pL5sB2cV9xR4tY7uI0oP3qW6eE1zA8dG5hK2jF6mS=
```

### Production (.env.production)
```env
JWT_SECRET=prod_secret_XyZ9aB8cD7eF6gH5iJ4kL3mN2oP1qR0sT9uV8wX7yZ6=
```

## ⚠️ Security Best Practices

### ✅ DO:
- Use cryptographically secure random generation
- Store secrets in environment variables
- Use different secrets per environment
- Rotate secrets periodically
- Use minimum 32 characters
- Keep secrets confidential

### ❌ DON'T:
- Use predictable patterns or words
- Commit secrets to version control
- Share secrets in plain text
- Reuse secrets across environments
- Use short or weak secrets
- Log secrets in application logs

## 🔄 Secret Rotation

When rotating JWT secrets:
1. Generate new secret
2. Update environment variable
3. Restart application
4. **Note**: Existing tokens will become invalid

## 🐛 Troubleshooting

### Error: "JWT_SECRET must be at least 32 characters"
**Solution**: Generate a new secret using the methods above.

### Error: "Invalid or expired token"
**Possible causes**:
- Secret was changed (tokens signed with old secret become invalid)
- Token actually expired
- Token was tampered with

### Error: "JsonWebTokenError"
**Solution**: Check if JWT_SECRET is properly set in environment.

## 📚 Additional Resources

- [JWT.io - JWT Debugger](https://jwt.io/)
- [OWASP JWT Security Guidelines](https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_for_Java_Cheat_Sheet.html)
- [Node.js Crypto Documentation](https://nodejs.org/api/crypto.html)
