import axios from "axios";
import { config } from "@/config";
import { DataTransferObject } from "@/interfaces/api/respose";

const BASE_ENDPOINT = `${config.HAP_ENDPOINT}`;

const getEssentialStandardsForSafetyChart = async (
    _area_id: number, 
    _indicator: string
): Promise<DataTransferObject> => {
  const response = await axios.get(`${BASE_ENDPOINT}/standards`);
  return response.data;
};

export const cmiServices = {
    getEssentialStandardsForSafetyChart,
};
