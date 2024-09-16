import { AxiosResponse } from 'axios';
import axios from '../../axios';

interface PropsContactCreate {
    enterprise_id: number
    email: string
    owner: string

}   


export const createContact = async (enterprise_id: number, email: string, owner: string): Promise<PropsContactCreate> => {
    const response: AxiosResponse<PropsContactCreate> = await axios.post('/contact', {
        enterprise_id: enterprise_id,
        email: email,
        owner: owner
    });

    return response.data;
}

interface PropsGetContacts {
    enterprise_id: number,
    contacts: []
}

export const getContacts = async (enterprise_id: number): Promise<PropsGetContacts> => {
    const response: AxiosResponse<PropsGetContacts> = await axios.get(`/contacts/${enterprise_id}`, {
        withCredentials: true
    });

    return response.data;
}