import { WebSocket } from "ws";
import { Point } from "../entity/Point";

export type OutputPoint = {
  assetName: string;
  time: number;
  assetId: number;
  value: number;
}

export type OutputAsset = {
  id: number;
  name: string;
}

export type ClientSubscriptions = Map<WebSocket, number | null>;

export type InputMessage = {
  assetId: number;
}

export type PointByAssetId = { [key: number]: Point }

export type WsMessage = {
  action: string,
  message: object | string,
}
