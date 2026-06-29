import axios from 'axios'

// instance for the api
const api = axios.create({
    baseURL: 'http://localhost:3000',
    withCredentials: true
})

export const register = async ({ username, email, password }) => {
    try {
        const response = await api.post('/api/auth/register', {
            username, email, password
        })
        return response.data
    } catch (error) {
        console.log(error);
    }
}

export const login = async ({ email, password }) => {
    try {
        const response = await api.post('/api/auth/login', {
            email, password
        })
        return response.data
    }
    catch (error) {
        throw error;
    }
}

export const logout = async () => {
    try {
        const response = await api.get('/api/auth/logout')
        return response.data
    } catch (error) {
        console.log(error);
    }
}

export const getme = async () => {
    try {
        const response = await api.get('/api/auth/get-me')
        return response.data

    } catch (error) {
        console.log(error);

    }
}

// export default { register, login, logout , getme }