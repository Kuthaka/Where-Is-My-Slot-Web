module.exports = {
  apps: [
    {
      name: "whereslot-api",
      script: "dist/src/main.js",
      cwd: "/var/www/whereslot-api",
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