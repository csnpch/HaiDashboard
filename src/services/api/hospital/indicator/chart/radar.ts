import axios from "axios";
import { config } from "@/config";
import { DataTransferObject } from "@/interfaces/api/respose";

const BASE_ENDPOINT = `${config.HAP_ENDPOINT}`;

const getRadarChart = async (_area_id: number, _indicator: string): Promise<DataTransferObject> => {
  const response = await axios.get(`${BASE_ENDPOINT}/radar`);
  return response.data;
};

export const cmiServices = {
  getRadarChart,
};
