export default {
    apps: [
      {
        name: "soap-api", // Name of the app in PM2
        script: "src/server.ts", // Entry file for your project
        interpreter: "npx ts-node", // Ensures TypeScript execution
        instances: 1, // Run a single instance
        watch: true, // Restart on file changes
        env: {
          NODE_ENV: "development",
          PORT: 5000
        },
        env_production: {
          NODE_ENV: "production",
          PORT: 5000
        }
      }
    ]
  };
  