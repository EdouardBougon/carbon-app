import axios from 'axios';
import { SimulatorInput, SimulatorResult } from 'libs/queries/extApi/simulator';

export const AVAILABLE_CURRENCIES = [
  'USD',
  'EUR',
  'JPY',
  'GBP',
  'AUD',
  'CAD',
  'CHF',
  'CNY',
  'ETH',
] as const;

export type FiatSymbol = (typeof AVAILABLE_CURRENCIES)[number];

export type FiatPriceDict = {
  [k in FiatSymbol]: number;
};

export type RoiRow = {
  ROI: string;
  id: string;
};

let BASE_URL = '/api/';

if (import.meta.env.VITE_DEV_MODE) {
  BASE_URL = 'https://app.carbondefi.xyz/api/';
}

const carbonApiAxios = axios.create({
  baseURL: BASE_URL,
});

const newApiAxios = axios.create({
  baseURL: 'https://api.carbondefi.xyz/v1/',
});

const carbonApi = {
  getCheck: async (): Promise<boolean> => {
    if (import.meta.env.VITE_DEV_MODE) {
      return false;
    }
    const { data } = await carbonApiAxios.get<boolean>('/check');
    return data;
  },
  getMarketRate: async (
    address: string,
    convert: readonly FiatSymbol[]
  ): Promise<FiatPriceDict> => {
    const {
      data: { data },
    } = await newApiAxios.get<{ data: FiatPriceDict }>(`market-rate`, {
      params: { address, convert: convert.join(',') },
    });
    return data;
  },
  getRoi: async (): Promise<RoiRow[]> => {
    const { data } = await newApiAxios.get<RoiRow[]>('roi');
    return data;
  },
  getSimulator: async (params: SimulatorInput): Promise<SimulatorResult> => {
    const { data } = await newApiAxios.get<SimulatorResult>(
      'simulate-create-strategy',
      {
        params,
      }
    );
    return data;
  },
};

export { carbonApiAxios, carbonApi };
