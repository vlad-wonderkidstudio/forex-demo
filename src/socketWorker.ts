import { WebSocket, WebSocketServer } from "ws";
import { MoreThan } from "typeorm";
import { AppDataSource } from "./config/data-source";
import { Asset } from "./entity/Asset";
import { Point } from "./entity/Point";
import { mapAssetForOutput, mapPointForOutput } from "./custom/mappers";
import { ClientSubscriptions, InputMessage, WsMessage } from "./custom/types";

export function setupHandlers(wss: WebSocketServer) {
  const clientSubscriptions: ClientSubscriptions = new Map();

  wss.on("connection", (ws: WebSocket) => {
    console.info("Client connected");
    ws.isAlive = true;

    ws.on("message", (message: string) =>
      handleClientMessage(ws, message, clientSubscriptions)
    );

    ws.on("close", () => {
      console.info("Client disconnected");
      clientSubscriptions.delete(ws);
    });

    ws.on("pong", () => {
      ws.isAlive = true;
    });
  });

  return clientSubscriptions;
}

async function handleClientMessage(
  ws: WebSocket,
  message: string,
  clientSubscriptions: ClientSubscriptions
) {
  console.info(`Received message: ${message}`);
  try {
    const data = JSON.parse(message);

    switch (data.action) {
      case "assets":
        await doAssetsAction(ws, data.message);
        break;
      case "subscribe":
        await doSubscribeAction(ws, data.message, clientSubscriptions);
        break;
    }
  } catch (error) {
    console.error("Error handling message:", error);
    ws.send(
      JSON.stringify({
        action: "error",
        message: "Error processing request",
      } satisfies WsMessage)
    );
  }
}

const doAssetsAction = async (ws: WebSocket, message?: InputMessage) => {
  const assetRepository = AppDataSource.getRepository(Asset);
  const assets = await assetRepository.find();
  ws.send(
    JSON.stringify({
      action: "assets",
      message: {
        assets: assets.map((asset) => mapAssetForOutput(asset)),
      },
    } satisfies WsMessage)
  );
};

const doSubscribeAction = async (
  ws: WebSocket,
  message: InputMessage,
  clientSubscriptions: ClientSubscriptions
) => {
  const pointRepository = AppDataSource.getRepository(Point);
  const assetId = message.assetId;
  clientSubscriptions.set(ws, assetId);

  // Fetch and send the last 30 minutes of points for this asset
  const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
  const points = await pointRepository.find({
    where: {
      assetId: assetId,
      timestamp: MoreThan(thirtyMinutesAgo),
    },
  });

  ws.send(
    JSON.stringify({
      action: "asset_history",
      message: {
        points: points.map((point) => mapPointForOutput(point)),
      },
    } satisfies WsMessage)
  );
};

export const sendPoint = async (ws: WebSocket, point: Point) => {
  ws.send(JSON.stringify({
    action: "point",
    message: mapPointForOutput(point),
  } satisfies WsMessage));
}