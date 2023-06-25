import { AuthLocalStorage } from "@/services/localStorage/auth";

export const axiosConfig = async () => {
    const token = AuthLocalStorage.getToken();
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    return config;
}