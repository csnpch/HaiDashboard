import axios from "axios";
import { config } from "@/config";
import { IBedOccupancyRateDto, IHospitalCertificationDto, IHospitalScoreDto } from "@/interfaces/api/surveyor";
import { DataTransferObject } from "@/interfaces/api/respose";

const BASE_ENDPOINT = `${config.HAP_ENDPOINT}/surveyorys`;

const findBedOccupancyRate = async (_data: IBedOccupancyRateDto): Promise<DataTransferObject> => {
  const response = await axios.post(`${BASE_ENDPOINT}/bedOccupancyRate`, _data);
  return response.data;
};

const findHospitalScore = async (_data: IHospitalScoreDto): Promise<DataTransferObject> => {
  const response = await axios.post(`${BASE_ENDPOINT}/hospitalscore`, _data);
  return response.data;
};

const findHospitalCertification = async (_data: IHospitalCertificationDto): Promise<DataTransferObject[]> => {
  const response = await axios.post(`${BASE_ENDPOINT}/hospitalcertification`, _data);
  return response.data;
};

export const surveyorServices = {
  findBedOccupancyRate,
  findHospitalScore,
  findHospitalCertification
};
