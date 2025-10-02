const app = require("./src/app");
const {
  app: { port },
} = require("./src/configs/config.mongo");
const PORT = port || 3000;

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

process.on("SIGINT", () => {
  server.close(() => {
    console.log("Exit server...");
  });
  process.exit(0);
});
