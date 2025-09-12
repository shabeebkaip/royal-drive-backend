# 🚀 Automatic Port Detection

Your Royal Drive Backend now includes **React-like automatic port detection**! The server will automatically find and use the next available port if the preferred port is already in use.

## ✨ **Features**

### **1. Smart Port Detection**
- **Preferred Port**: Tries to use port `3001` (from environment)
- **Auto-Increment**: If `3001` is busy, automatically tries `3002`, `3003`, etc.
- **No Crashes**: Never throws "port already in use" errors
- **Clear Messages**: Shows exactly which port is being used and why

### **2. React-like Behavior**
Just like React development server:
```bash
# React behavior:
Something is already running on port 3000.
Would you like to run the app on another port instead? (Y/n)

# Our backend behavior:
⚠️  Port 3001 is already in use.
✅ Using port 3002 instead.
🚀 Server running on port 3002
💡 Preferred port 3001 was in use, automatically switched to 3002
```

## 🔧 **Implementation**

### **Port Utilities (`src/utils/portUtils.ts`)**
```typescript
// Check if port is available
await isPortAvailable(3001) // true/false

// Find next available port
await findAvailablePort(3001) // Returns 3002 if 3001 is busy

// Get available port with messages (main function)
await getAvailablePort(3001) // React-like behavior
```

### **App Class Integration**
```typescript
public async start(): Promise<void> {
  // Find available port
  const availablePort = await getAvailablePort(env.PORT);
  
  // Start server on available port
  this.app.listen(availablePort, () => {
    console.log(`🚀 Server running on port ${availablePort}`);
    // ... other logs
  });
}
```

## 🎯 **Usage Examples**

### **Single Instance (Normal)**
```bash
pnpm run dev
```
**Output:**
```
🚀 Server running on port 3001
📱 Environment: development
🔗 API Base URL: http://localhost:3001/api/v1
```

### **Multiple Instances (Automatic Port Detection)**
**Terminal 1:**
```bash
pnpm run dev
```
**Output:**
```
🚀 Server running on port 3001
```

**Terminal 2:**
```bash
pnpm run dev
```
**Output:**
```
⚠️  Port 3001 is already in use.
✅ Using port 3002 instead.
🚀 Server running on port 3002
💡 Preferred port 3001 was in use, automatically switched to 3002
```

**Terminal 3:**
```bash
pnpm run dev
```
**Output:**
```
⚠️  Port 3001 is already in use.
✅ Using port 3003 instead.
🚀 Server running on port 3003
💡 Preferred port 3001 was in use, automatically switched to 3003
```

## 📋 **Configuration**

### **Environment Variables**
```bash
# .env
PORT=3001  # Preferred port
```

### **Port Range**
- **Default Range**: Checks ports `3001-3010` (10 attempts)
- **Configurable**: Can be adjusted in `portUtils.ts`

### **Error Handling**
If no ports are available in the range:
```
❌ Could not find an available port. 
   Please free up port 3001 or try again later.
```

## 🔍 **Benefits**

1. **🚫 No More Port Conflicts**: Never crashes due to port issues
2. **🔄 Multiple Instances**: Run multiple development servers simultaneously
3. **📱 Testing**: Test different branches/features in parallel
4. **🎯 Zero Configuration**: Works out of the box
5. **💬 Clear Feedback**: Always know which port your server is using

## 🛠️ **Development Workflow**

### **Parallel Development**
```bash
# Terminal 1: Main development
git checkout main
pnpm run dev  # Runs on 3001

# Terminal 2: Feature branch
git checkout feature/new-api
pnpm run dev  # Automatically runs on 3002

# Terminal 3: Bug fix
git checkout hotfix/urgent-fix
pnpm run dev  # Automatically runs on 3003
```

### **API Testing**
```bash
# Test main branch
curl http://localhost:3001/health

# Test feature branch  
curl http://localhost:3002/health

# Test hotfix
curl http://localhost:3003/health
```

## 🎉 **No More Port Conflicts!**

Your development experience is now seamless - the server will always find an available port and clearly communicate what's happening. No more manual port management or crashed processes! 🚀
