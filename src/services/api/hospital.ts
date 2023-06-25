import axios from 'axios'
import { axiosConfig } from './configs/axiosConfig'
import { DataTransferObject } from '@/interfaces/api/respose'
import { config } from '@/config';
import { IDeadRateDto, IInfectiousDto } from '@/interfaces/api/hospital';

const BASE_ENDPOINT = `${config.HAP_ENDPOINT}/hospitals`;


const getData = async (hcode: string): Promise<DataTransferObject> => {
    const response = await axios.get(`${BASE_ENDPOINT}/${hcode}`, await axiosConfig())
    return response.data
}

const getIndicators = async (): Promise<DataTransferObject> => {
    const response = await axios.get(`${BASE_ENDPOINT}/indicators/codes/all`, await axiosConfig())
    return response.data
}

const getKPIInfectious = async (_data: IInfectiousDto): Promise<DataTransferObject> => {
    const response = await axios.post(`${BASE_ENDPOINT}/kpi/infectious`, _data)
    return response.data
}

const getKPIDeadRate = async (_data: IDeadRateDto): Promise<DataTransferObject> => {
    const response = await axios.post(`${BASE_ENDPOINT}/kpi/deathrate`, _data)
    return response.data
}


export const HospitalServices = {
    getData,
    getIndicators,
    getKPIDeadRate,
    getKPIInfectious
}