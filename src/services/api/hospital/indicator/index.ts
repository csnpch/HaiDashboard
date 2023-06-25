import axios from "axios";
import { config } from "@/config";
import { DataTransferObject } from "@/interfaces/api/respose";

const BASE_ENDPOINT = `${config.HAP_ENDPOINT}`;

const getHospitalIndicators = async (_area_id: number, _indicator: string): Promise<DataTransferObject> => {
  const response = await axios.get(`${BASE_ENDPOINT}/indicators`);
  return response.data;
};

const getProvinceIndicators = async (_province_id: number, _indicator: string): Promise<DataTransferObject> => {
    const response = await axios.get(`${BASE_ENDPOINT}/province`);
    return response.data;
};

const getDataHospitalAndIndicators = async (_area_id: number, _indicator: string): Promise<DataTransferObject> => {
    const response = await axios.get(`${BASE_ENDPOINT}/hospital`);
    return response.data;
};


export const cmiServices = {
  getHospitalIndicators,
  getProvinceIndicators,
  getDataHospitalAndIndicators
};
