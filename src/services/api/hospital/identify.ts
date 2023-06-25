import { config } from '@/config'
import axios from 'axios'


const BASE_ENDPOINT = `${config.HAP_ENDPOINT}/applies`


const Authenticate = async (email: string, password: string) => {
    const res = await axios.post(`${BASE_ENDPOINT}/authenticate`, {
        email_address: email,
        password: password
    })
    return res.data
}


export const IdentifyServices = {
    Authenticate
}