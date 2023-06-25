const key = 'token';

const saveToken = (token: string) => {
    localStorage.setItem(key, token);
}

const getToken = () => {
    return localStorage.getItem(key);
}

const removeToken = () => {
    localStorage.removeItem(key);
}




export const AuthLocalStorage = {
    saveToken,
    getToken,
    removeToken
}