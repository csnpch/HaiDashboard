import axios from "axios";

import { axiosConfig } from "@/services/api/configs/axiosConfig";
import { DataTransferObject } from "@/interfaces/api/respose";
import { Role } from "@/interfaces/type/types";
import { config } from "@/config";

const BASE_ENDPOINT = `${config.HAP_ENDPOINT}/moderators/invite`;

const getAllInvites = async (): Promise<DataTransferObject> => {
    const res = await axios.get(`${BASE_ENDPOINT}s/all`, await axiosConfig());
    return res.data;
}

const createInvite = async (email_address: string, role_name: Role): Promise<DataTransferObject> => {
    const res = await axios.post(BASE_ENDPOINT, { email_address, role_name }, await axiosConfig());
    return res.data;
}

const deleteInvite = async (code: string): Promise<DataTransferObject> => {
    const res = await axios.delete(`${BASE_ENDPOINT}s/delete?code=${code}`, await axiosConfig());
    return res.data;
}

export const InviteServices = {
    getAllInvites,
    createInvite,
    deleteInvite,
}