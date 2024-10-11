import { AppDataSource } from "./config/data-source";
import { browserHttpHeaders } from "./custom/consts";
import { Asset } from "./entity/Asset";
import { Point } from "./entity/Point";
import axios, { AxiosRequestConfig } from 'axios';
import { PointByAssetId } from "./custom/types";

export async function fetchAndProcessRates(neededAssets: Asset[]): Promise<PointByAssetId> {
  const pointsByAssetId: PointByAssetId = {};
  try {
    const pointRepository = AppDataSource.getRepository(Point);

    const assetsList = [];
    const assetsBySymbol: { [key: string]: Asset } = {};

    neededAssets.forEach(el => {
      assetsBySymbol[el.symbol] = el;
      assetsList.push(el.symbol);
    });

    const url = process.env.SERVER_FETCH_DATA_URL;
    const config: AxiosRequestConfig = { headers: browserHttpHeaders };
    const response = await axios.get<string>(url, config);

    const regex = /null\((.*)\);/g;
    const matches = regex.exec(response?.data);
    const jsonString = matches[1];
    const parsedObject = JSON.parse(jsonString);

    parsedObject.Rates.forEach((rate) => {
      if (assetsList.includes(rate.Symbol)) {
        const value = (Number(rate.Bid) + Number(rate.Ask)) / 2;
        const assetId = assetsBySymbol[rate.Symbol].id;
        const point = pointRepository.create({
          assetId,
          timestamp: new Date(),
          value
        });
        pointsByAssetId[assetId] = {
          ...point,
          asset: assetsBySymbol[rate.Symbol]
        };
        pointRepository.save(point);
      }
    });
  } catch (error) {
    console.error("Error fetching rates:", error);
  }

  return pointsByAssetId;
}
