module.exports = {
  apps: [
    {
      name: "whereslot-api",
      cwd: "/var/www/whereslot-api/backend",
      script: "dist/src/main.js",
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      watch: false,
      env: {
        NODE_ENV: "production",
        PORT: 5000,
      },
    },
  ],
};