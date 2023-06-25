export interface IBedOccupancyRateDto {
  hospital_code: string;
  province: string;
  region: string; // ถ้าต้องการ ทั้งหมดภายในภาค ให้ใช้ % ถ้าต้องการภาคกลางให้ส่ง %กลาง
  district: string;
}

export interface IHospitalScoreDto {
  hospital_code: string;
  province: string;
  region: string; // ถ้าต้องการ ทั้งหมดภายในภาค ให้ใช้ % ถ้าต้องการภาคกลางให้ส่ง %กลาง
  district: string;
}

export interface IHospitalCertificationDto {
  hospital_code: string;
  province: string;
  region: string; // ถ้าต้องการ ทั้งหมดภายในภาค ให้ใช้ % ถ้าต้องการภาคกลางให้ส่ง %กลาง
  district: string;
}

export interface IHospitalCertificationModel {
  hospital_code: string;
  organization_name: string;
  license_date_ha: string; // ออกให้เมื่อ
  expire_date_ha: string; // วันหมดอายุ ให้เอา สองค่านี้มาเทียบกันเองว่า หมดอายุหรือยัง
}
