import { config } from '@/config';
import axios from 'axios';
import { axiosConfig } from '../configs/axiosConfig';
import { DataTransferObject } from '@/interfaces/api/respose';

const BASE_ENDPOINT = `${config.HAP_ENDPOINT}/users`


const getOwnInfo = async (): Promise<DataTransferObject> => {
    const res = await axios.get(`${BASE_ENDPOINT}/me`, await axiosConfig());
    return res.data;
}

const getAllUsers = async (page: number, limit: number): Promise<DataTransferObject> => {
    const res = await axios.get(`${BASE_ENDPOINT}/all?page=${page}&limit=${limit}`, await axiosConfig());
    return res.data;
}


export const UserServices = {
    getOwnInfo,
    getAllUsers,
}