export interface IInfoHospital {
  hospital_code: number,
  hospital_name: string,
  province_name: string,
  website: string,
  expertise: string,
  patient_group: string,
  population: number,
  out_patient: number,
  in_patient: number,
  organization_group_name: string,
  organization_level: string,
  organization_region_name: string,
  organization_service_zone_name: string,
  accreditation_status_name: string
}


export interface IMapModel {
  hospital_code: string;
  hospital_name: string;
  province_name: string;
  service_zone: string;
  ha_level: string;
  accreditation_status_name: string;
  bed: number;
  occupy_bed_rate: number;
  cmi: number
  value: number;
  color: string;
}
// ha_level, cmi, bed, occupy_bed_rate, cmi

export interface IRadarModel {
  CMI: number
  DeadRate: number
}

export interface IColorModel {
  id: number;
  min_value: number;
  max_value: number;
  color: string;
}

export interface IAccScoreRadarModel {
  count: number;
  average: number;
  iv_average: number;
  data: {
    key: string;
    value: number;
  }[]
}

export interface IScoreHospitalModel {
  HospitalName: string;
  i_1_lrd: number;
  i_2_stg: number;
  i_3_pcm: number;
  i_4_kam: number;
  i_5_wkf: number;
  i_6_opt: number;
  ii_1_rsq:number;
  ii_2_pfg:number;
  ii_3_env:number;
  ii_4_ic:number;
  ii_5_mrs:number;
  ii_6_mms:number;
  ii_7_din:number;
  ii_8_dhs:number;
  ii_9_com:number;
  iii_1_acn:number;
  iii_2_asm:number;
  iii_3_pln:number;
  iii_4_pcd:number;
  iii_5_imp:number;
  iv_1_hcr: number;
  iv_2_cfr: number;
  iv_3_wfr: number;
  iv_4_ldr: number;
  iv_5_wpr: number;
  iv_6_fnr: number;
  i_average: number;
  iv_average: number;
}

export interface IPEPSModel {
  title: string;
  size?: number;
  value?: number;
  children?: IPEPSModel[];
}

export interface IPEPSHospitalModel {
  hospital_name: string;
  avg: number;
  pe: number;
  ps: number;
}
export interface IStandardsModel {
  count: number;
  risk_group: string
  risk_name: string,
  risk_code: string,
  e_up_value: number,
  a_i_value: number,
  e_up_edited_value: number,
  a_i_edited_value: number
}

export interface IStandardsHospitalModel {
  hospital_name: string;
  risk_group: string;
  risk_name: string;
  risk_code: string;
  e_up_value: number;
  a_i_value: number;
  e_up_edited_value: number;
  a_i_edited_value: number;
}

export interface IIndicatorsModel {
  [x: string]: any;
  motolty_model: IMotoltyModel[];
  ps_and_qc_model: IPSANDQCModel[];
  infection_model: IInfectionModel[];
  HPH_model: IHPHModel[];
}

export interface IMotoltyModel {
  hospital_name: string;
  province_name: string;
  total: number;
  DC0401: number;
  CM0203: number;
  CO0105: number;
  DN0101: number;
  DR0403: number;
  DN0302: number;
  DH0101: number;
  DR0101: number;
  CM0101: number;
  DR0201: number;
  CI0101: number;
  DG0202: number;
}


export interface SubIndicatorsModelMainFiled {
  hospital_name: string;
  province_name: string;
  total: {
    Valid: boolean;
    Float64: number;
  };
}

export interface IPSANDQCModel {
  hospital_name: string;
  province_name: string;
  total: number;
  CM0107: number;
  DG0201: number;
  CO0107: number;
  CG0101: number;
  SM0102: number;
  CA0101: number;
  SM0103: number;
  CE0103: number;
}

export interface IInfectionModel {
  hospital_name: string;
  province_name: string;
  total: number;
  DH0203: number;
  DO0304: number;
  SI0301: number;
  DO0205: number;
  SI0101: number;
  SI0201: number;
  CM0117: number;
}

export interface IHPHModel {
  hospital_name: string;
  province_name: string;
  total: number;
  HE0103: number;
  AA0105: number;
  HH0102: number;
  HE0102: number;
  DC0201: number;
  DC0108: number;
  AA0104: number;
}

export interface IPopulation {
  lstrLevel: number;
  lsregion: number;
  lscc: number;
  lsccDesc: string;
  lsrcode: string;
  lsrcodeDesc: string;
  lsaa: number;
  lsaaDesc: string;
  lstt: number;
  lsttDesc: string;
  lsmm: number;
  lsmmDesc: string;
  lsyymm: number;
  lssumtotMale: number;
  lssumtotFemale: number;
  lssumtotTot: number;
}

export interface IPersonnel {
  nurses: number;
  doctors: number;
}

export interface IPEPSHospital {
  avg: number
  pe: number
  ps: number
  hospital: string
}

export interface IStandardsHospital {
  hospital_name: string;
  risk_group: string;
  risk_name: string;
  risk_code: string;
  e_up_value: number;
  a_i_value: number;
  e_up_edited_value: number;
  a_i_edited_value: number;
  }