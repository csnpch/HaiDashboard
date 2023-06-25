import axios from 'axios'
import { config } from '@/config'
import { DataTransferObject } from '@/interfaces/api/respose'


const BASE_ENDPOINT = `${config.HAP_ENDPOINT}/hospitals`


const findHospitalByHcode = async (hcode: string): Promise<DataTransferObject> => {

    const response = await axios.get(`${BASE_ENDPOINT}/${hcode}`)
    return response.data

}


export const HospitalServices = {
    findHospitalByHcode,
}