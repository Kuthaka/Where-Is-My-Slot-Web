module.exports = {
  apps: [
    {
      name: "edudome-api",
      script: "dist/main.js",
      cwd: "/var/www/myapp",
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      watch: false,
      max_memory_restart: "400M",
      env: {
        NODE_ENV: "production",
        PORT: 5000,
      },
    },
  ],
};