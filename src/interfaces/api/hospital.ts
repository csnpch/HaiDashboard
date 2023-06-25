export interface CheckNullInterface {
  Float64: number,
  Valid: boolean
}


export interface hospitalInterface {
    hospital_code: string,
    hospital_name_th: string,
    group_name: string|null,
    enrollment_name: string,
    changwat_name: string,
    amphoe_name: string,
    area_name: string,
    ha_certified_date: string|null,
    ha_expire_date: string|null,
    ha_statuses_name: string,
    actual_size: number|null,
}

export interface hospitalIndicators {
    indicator_code: string,
    indicator_name_th: string,
    hospital_code: string,
    hospital_name_th: string,
    district_name: string,
    province_name: string,
    total_bed_in_service: number,
}

export interface IDeadRateDto {
  hospital_code: string;
  province: string;
  region: string; // ถ้าต้องการ ทั้งหมดภายในภาค ให้ใช้ % ถ้าต้องการภาคกลางให้ส่ง %กลาง
  district: string;
}

export interface IInfectiousDto {
  hospital_code: string;
  province: string;
  region: string; // ถ้าต้องการ ทั้งหมดภายในภาค ให้ใช้ % ถ้าต้องการภาคกลางให้ส่ง %กลาง
  district: string;
}


// cmi:
// /cmis/<zone>,
// /cmis/<zone>/provinces

// incident:
// /incidents/<year>/<zone>
// /incidents/<year>/<zone>/provinces

// /environments/<year>/<zone>
// /environments/<year>/<zone>/provinces

// /occupies/<year>/<zone>
// /occupies/<year>/<zone>/provinces


export interface ICMIsDrillDown {
  hospital_code: number,
  service_zone_code: string,
  hospital_name: string,
  accreditation_status: string,
  organization_level: string,
  cmi: number,
  total_bed: number,
  bed_occupy_rate: number,
  cmi_color: string,
  province_name: string,
}


export interface IIncidentsDrillDown {
  hospital_code: number,
  hospital_name: string,
  accreditation_status: string,
  organization_level: string,
  death_rate: number,
  ii_1_rsq: number,
  incident_rate: number,
  color: string,
  province_name: string
}


export interface IEnvironmentsDrillDown {
  hospital_code: number,
  hospital_name: string,
  accreditation_status: string,
  organization_level: string,
  environment_percentage: CheckNullInterface
  ii_3_env: number,
  infection_rate: number,
  province_name: string,
  color: string,
}


export interface IOccupiesDrillDown {
  hospital_code: number,
  hospital_name: string,
  accreditation_status: string,
  organization_level: string,
  occupy_bed_rate: CheckNullInterface,
  e_up_percent: CheckNullInterface,
  ratio_per_person: number,
  province_name: string,
  color: string,
}


export interface IInfectionsDrillDown {
  hospital_code: number,
  hospital_name: string,
  accreditation_status: string,
  organization_level: string,
  infection_rate: CheckNullInterface,
  ii_4_pcd: number,
  G0002: number,
  color: string,
  province_name: string
}


export interface IAccreditationDrillDown {
  hospital_code: number,
  hospital_name: string,
  accreditation_status: string,
  organization_level: string,
  score: CheckNullInterface,
  incident_rate: number,
  occupy_bed_rate: number,
  color: string,
  province_name: string
}

export interface IMortalitiesDrillDown {
  hospital_code: number,
  hospital_name: string,
  accreditation_status: string,
  organization_level: string,
  death_rate: number,
  g00007: number,
  g00009: number,
  color: string,
  province_name: string,
}

export interface IPePsDrillDown {
  hospital_code: number,
  hospital_name: string,
  accreditation_status: string,
  organization_level: string,
  province_name: string,
  nurses: number,
  peps: {
    Valid: boolean;
    Float64: number;
  },
  i_3_pcm: {
    Valid: boolean;
    Float64: number;
  };
  color: string,
}