import net from 'net';

/**
 * Check if a port is available
 */
export function isPortAvailable(port: number): Promise<boolean> {
  return new Promise((resolve) => {
    const server = net.createServer();
    
    server.listen(port, () => {
      server.once('close', () => {
        resolve(true);
      });
      server.close();
    });
    
    server.on('error', () => {
      resolve(false);
    });
  });
}

/**
 * Find next available port starting from a given port
 */
export async function findAvailablePort(startPort: number, maxAttempts: number = 10): Promise<number> {
  for (let port = startPort; port < startPort + maxAttempts; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  
  throw new Error(`No available port found in range ${startPort}-${startPort + maxAttempts - 1}`);
}

/**
 * Get available port with React-like behavior
 * Shows message when port is already in use and automatically uses next available port
 */
export async function getAvailablePort(preferredPort: number): Promise<number> {
  const isPreferredAvailable = await isPortAvailable(preferredPort);
  
  if (isPreferredAvailable) {
    return preferredPort;
  }
  
  // Port is in use, find next available
  console.log(`⚠️  Port ${preferredPort} is already in use.`);
  
  try {
    const availablePort = await findAvailablePort(preferredPort + 1);
    console.log(`✅ Using port ${availablePort} instead.`);
    return availablePort;
  } catch (error) {
    console.error(`❌ Could not find an available port. Please free up port ${preferredPort} or try again later.`);
    throw error;
  }
}
