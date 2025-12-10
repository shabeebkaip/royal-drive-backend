export default {
  apps: [{
    name: 'royal-drive-backend',
    script: 'node_modules/tsx/dist/cli.mjs',
    args: 'src/index.ts',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3001
    },
    error_file: '~/.pm2/logs/royal-drive-backend-error.log',
    out_file: '~/.pm2/logs/royal-drive-backend-out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    kill_timeout: 5000
  }]
};
