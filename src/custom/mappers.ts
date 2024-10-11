import { Asset } from "../entity/Asset";
import { Point } from "../entity/Point";
import { OutputAsset, OutputPoint } from "./types";

export const mapPointForOutput = (point: Point): OutputPoint => {
  return {
    assetName: point.asset.symbol,
    time: Math.floor(point.timestamp.getTime() / 1000),
    assetId: point.assetId,
    value: point.value,
  };
}

export const mapAssetForOutput = (asset: Asset): OutputAsset => {
  return {
    id: asset.id,
    name: asset.symbol,
  }
}
