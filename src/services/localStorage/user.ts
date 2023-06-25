const key = {
    email: 'email',
}

const saveEmail = (token: string) => {
    localStorage.setItem(key.email, token);
}

const getEmail = () => {
    return localStorage.getItem(key.email);
}

const removeEmail = () => {
    localStorage.removeItem(key.email);
}


export const UserLocalStorage = {
    saveEmail,
    getEmail,
    removeEmail
}