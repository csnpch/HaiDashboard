import { config } from "@/config";
import { regional_health } from "@/data/dict/regional_health";
import { checkProvinceBangkok, zeroPad } from "@/utils/helpers/functions";
import axios from "axios";
const BASE_ENDPOINT = `${config.HAP_ENDPOINT}/dashboard`;


const Color = async () => {
  const res = await axios.get(`${BASE_ENDPOINT}/color`);
  return res.data;
};

const Map = async (area_id = 0, indicator = "CMI", year: number) => {
  let area: string | number = area_id;
  if (area === regional_health.all.id) area = "%";
  else area = zeroPad(area);
  const res = await axios.post(`${BASE_ENDPOINT}/map`, {
    area_id: area.toString(),
    indicator: indicator,
    year: year,
  });
  return res.data;
};

const Radar = async (area_id = 0, province = "", hospital_code = "", year: number) => {
  province = checkProvinceBangkok(area_id, province);
  let area: string | number = area_id;
  if (area === regional_health.all.id) area = "%";
  else area = zeroPad(area);
  const res = await axios.post(`${BASE_ENDPOINT}/radar`, {
    area_id: area.toString(),
    province: province,
    hospital_code: hospital_code,
    year: year
  });
  return res.data;
};

const ScoreHospital = async (area_id = 0, province = "", hospital_code = "", year: number) => {
  province = checkProvinceBangkok(area_id, province);
  let area: string | number = area_id;
  if (area === regional_health.all.id) area = "%";
  else area = zeroPad(area);
  const res = await axios.post(`${BASE_ENDPOINT}/score/hospital`, {
    area_id: area.toString(),
    province: province,
    hospital_code: hospital_code,
    year: year
  });
  return res.data;
};

const AccScoreRadar = async (area_id = 0, province = "", hospital_code = "", year: number) => {
  province = checkProvinceBangkok(area_id, province);
  let area: string | number = area_id;
  if (area === regional_health.all.id) area = "%";
  else area = zeroPad(area);
  const res = await axios.post(`${BASE_ENDPOINT}/score`, {
    area_id: area.toString(),
    province: province,
    hospital_code: hospital_code,
    year: year
  });
  return res.data;
};

const Standards = async (area_id = 0, province = "", hospital_code = "", year: number) => {
  province = checkProvinceBangkok(area_id, province);
  let area: string | number = area_id;
  if (area === regional_health.all.id) area = "%";
  else area = zeroPad(area);
  const res = await axios.post(`${BASE_ENDPOINT}/standards`, {
    area_id: area.toString(),
    province: province,
    hospital_code: hospital_code,
    year: year
  });
  return res.data;
};

const StandardsHospital = async (area_id = 0, province = "", hospital_code = "") => {
  province = checkProvinceBangkok(area_id, province);
  let area: string | number = area_id;
  if (area === regional_health.all.id) area = "%";
  else area = zeroPad(area);
  const res = await axios.post(`${BASE_ENDPOINT}/standards/hospital`, {
    area_id: area.toString(),
    province: province,
    hospital_code: hospital_code,
  });
  return res.data;
}

const Indicators = async (area_id = 0, province = "", hospital_code = "", year: number) => {
  province = checkProvinceBangkok(area_id, province);
  let area: string | number = area_id;
  if (area === regional_health.all.id) area = "%";
  else area = zeroPad(area);
  const res = await axios.post(`${BASE_ENDPOINT}/indicators`, {
    area_id: area.toString(),
    province: province,
    hospital_code: hospital_code,
    year: year
  });
  return res.data;
};

const PEPS = async (area_id = 0, province = "", hospital_code = "", year: number) => {
  province = checkProvinceBangkok(area_id, province);
  let area: string | number = area_id;
  if (area === regional_health.all.id) area = "%";
  else area = zeroPad(area);
  const res = await axios.post(`${BASE_ENDPOINT}/peps`, {
    area_id: area.toString(),
    province: province,
    hospital_code: hospital_code,
    year: year
  });
  return res.data;
};
const PEPSDrillDown = async (area_id = 0, province = "", hospital_code = "", year: number) => {
  province = checkProvinceBangkok(area_id, province);
  let area: string | number = area_id;
  if (area === regional_health.all.id) area = "%";
  else area = zeroPad(area);
  const res = await axios.post(`${BASE_ENDPOINT}/hospitals/peps`, {
    area_id: area.toString(),
    province: province,
    hospital_code: hospital_code,
    year: year
  });
  return res.data;
};
const PEPSHospital = async (area_id = 0, province = "", hospital_code = "", year = new Date().getFullYear()) => {
  province = checkProvinceBangkok(area_id, province);
  let area: string | number = area_id;
  if (area === regional_health.all.id) area = "%";
  else area = zeroPad(area);
  const res = await axios.post(`${BASE_ENDPOINT}/peps/hospital`, {
    area_id: area.toString(),
    province: province,
    hospital_code: hospital_code,
    year: year
  });
  return res.data;
};

const Personnel = async (area_id = 0, province = "", hospital_code = "") => {
  province = checkProvinceBangkok(area_id, province);
  let area: string | number = area_id;
  if (area === regional_health.all.id) area = "%";
  else area = zeroPad(area);
  const res = await axios.post(`${BASE_ENDPOINT}/personnel`, {
    area_id: area.toString(),
    province: province,
    hospital_code: hospital_code,
  });
  return res.data;
};

const Population = async () => {
  const res = await axios.get(`${BASE_ENDPOINT}/population`);
  return res.data;
};


const HospitalsWithCMIs = async (area_id: number, province_name: string) => {
  // https://hai-dashboard.proen.app.ruk-com.cloud/v1/prototype/dashboard/hospitals/cmis/9/provinces
  const res = await axios.post(`${BASE_ENDPOINT}/hospitals/cmis/${area_id}/provinces`, {
    province_name: province_name
  });
  return res.data;
}


const HospitalsWithIncidents = async (year: number, area_id: number, province_name: string) => {
  // https://hai-dashboard.proen.app.ruk-com.cloud/v1/prototype/dashboard/hospitals/incidents/2023/9/provinces
  if (province_name === "กรุงเทพฯ") province_name = 'กรุงเทพ'
  
  const res = await axios.post(`${BASE_ENDPOINT}/hospitals/incidents/${year}/${area_id}/provinces`, {
    province_name: province_name
  });
  return res.data;
}


const HospitalsWithEnvironments = async (year: number, area_id: number, province_name: string) => {
  if (province_name === "กรุงเทพฯ") province_name = 'กรุงเทพ'
  // https://hai-dashboard.proen.app.ruk-com.cloud/v1/prototype/dashboard/hospitals/environments/2023/9/provinces
  const res = await axios.post(`${BASE_ENDPOINT}/hospitals/environments/${year}/${area_id}/provinces`, {
    province_name: province_name
  });
  return res.data;
}


const HospitalsWithOccupies = async (year: number, area_id: number, province_name: string) => {
  if (province_name === "กรุงเทพฯ") province_name = 'กรุงเทพ'
  // https://hai-dashboard.proen.app.ruk-com.cloud/v1/prototype/dashboard/hospitals/occupies/2023/9/provinces
  const res = await axios.post(`${BASE_ENDPOINT}/hospitals/occupies/${year}/${area_id}/provinces`, {
    province_name: province_name
  });
  return res.data;
}


const HospitalsWithInfections = async (year: number, area_id: number, province_name: string) => {
  if (province_name === "กรุงเทพฯ") province_name = 'กรุงเทพ'
  // https://hai-dashboard.proen.app.ruk-com.cloud/v1/prototype/dashboard/hospitals/infections/2023/9/provinces
  const res = await axios.post(`${BASE_ENDPOINT}/hospitals/infections/${year}/${area_id}/provinces`, {
    province_name: province_name
  });
  return res.data;
}

const HospitalsWithMortalities = async (year: number, area_id: number, province_name: string) => {
  if (province_name === "กรุงเทพฯ") province_name = 'กรุงเทพ'
  // https://hai-dashboard.proen.app.ruk-com.cloud/v1/prototype/dashboard/hospitals/mortalities/2023/9/provinces
  const res = await axios.post(`${BASE_ENDPOINT}/hospitals/mortalities/${year}/${area_id}/provinces`, {
    province_name: province_name
  });
  return res.data;
}

const HospitalsWithAccreditations = async (area_id: number, province_name: string) => {
  if (province_name === "กรุงเทพฯ") province_name = 'กรุงเทพ'
  // https://hai-dashboard.proen.app.ruk-com.cloud/v1/prototype/dashboard/hospitals/infections/2023/9/provinces
  const res = await axios.post(`${BASE_ENDPOINT}/hospitals/accreditations/${area_id}/provinces`, {
    province_name: province_name
  });
  return res.data;
}


const HospitalInfo = async (hospital_code: string) => {
  const res = await axios.get(`${BASE_ENDPOINT}/hospitals/${hospital_code}`);
  return res.data; 
}



export const XverServices = {
  Color,
  PEPS,
  Indicators,
  PEPSHospital,
  Radar,
  AccScoreRadar,
  Standards,
  StandardsHospital,
  Map,
  ScoreHospital,
  Personnel,
  HospitalInfo,
  Population,
  // for service in right container on map checked
  HospitalsWithCMIs,
  HospitalsWithIncidents,
  HospitalsWithEnvironments,
  HospitalsWithOccupies,
  HospitalsWithInfections,
  PEPSDrillDown,
  HospitalsWithAccreditations,
  HospitalsWithMortalities
};
