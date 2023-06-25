import axios from 'axios'
import { axiosConfig } from './configs/axiosConfig'
import { DataTransferObject } from '@/interfaces/api/respose'

const baseURL = `http://localhost:1747/v1/prototype/concepts`



const getKPIs = async (
    page?: number,
    limit?: number
): Promise<DataTransferObject> => {

    const response = await axios.get(`${baseURL}/cauti/all?limit=${limit || 10}&page=${page || 1}`, await axiosConfig())
    return response.data

}


const getKPIByCode = async (
    api_code: string, 
    page?: number, 
    limit?: number 
): Promise<DataTransferObject> => {
    const response = await axios.get(`${baseURL}/specify/${api_code}?limit=${limit || 10}&page=${page || 1}`, await axiosConfig())
    return response.data
}



export const conceptServices = {
    getKPIs,
    getKPIByCode,
}
