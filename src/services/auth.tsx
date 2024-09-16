import { AxiosResponse } from 'axios';
import axios from '../axios';

interface AuthResponse {
    email: string,
    passoword: string
}

axios.defaults.withCredentials = true;

export const login = async (email: string, password: string): Promise<AuthResponse> => {
    const response: AxiosResponse<AuthResponse> = await axios.post('/auth', {
        email,
        password,
       
    },
        {
            withCredentials: true
        }
    );

    

    return response.data;
}