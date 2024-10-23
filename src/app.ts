import { WebSocketServer } from "ws";
import { setupHandlers, sendPoint } from "./socketWorker";
import { fetchAndProcessRates } from "./fetcher";
import { AppDataSource } from "./config/data-source";
import { Asset } from "./entity/Asset";
import { ClientSubscriptions } from "./custom/types";

let clientSubscriptions: ClientSubscriptions;
let assets: Asset[];

export const initializeApp = async () => {
  try {
    assets = await AppDataSource.getRepository(Asset).find();
  } catch (error) {
    console.error("Error getting assets from DB:", error);
    process.exit(1);
  }

  const wss = new WebSocketServer({ port: process.env.SERVER_PORT });
  clientSubscriptions = setupHandlers(wss);

  await fetchAndProcessRates(assets);
  nextTick();

  console.info("WebSocket Server running on ws://localhost:8080");
};

const nextTick = async () => {
  // I make it via setTimeout, not via setInterval,
  // because one tick may take more then SERVER_FETCH_RATES_INTERVAL
  // and then we may have a race of commands.
  setTimeout(async () => {
    console.info("nextTick");
    try {
      const newPoints = await fetchAndProcessRates(assets);
      for (const [ws, assetId] of clientSubscriptions) {
        if (ws.isAlive === false) {
          ws.terminate();
          continue;
        }

        sendPoint(ws, newPoints[assetId])
          .catch((error) => {
            console.error("Error sending point: ", error);
          });

        ws.isAlive = false;
        ws.ping();
      }
    } catch (error) {
      console.error("Error fetching and processing rates:", error);
    }
    nextTick();
  }, Number(process.env.SERVER_FETCH_RATES_INTERVAL));
};
