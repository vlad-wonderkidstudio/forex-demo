import { initializeApp } from "./app";
import { AppDataSource } from "./config/data-source";

// Initialize the database and then start the WebSocket server
AppDataSource
  .initialize()
  .then(() => {
    initializeApp();
  })
  .catch((err) => {
    console.error("Error during Data Source initialization:", err)
  })
