import { AxiosResponse } from "axios"
import axios from '../../axios'

axios.defaults.withCredentials = true;

interface Enterprise {
    name: string
    user_id: number
    description: string
    photo: string
    links: string
}

interface PropsGetEnterprises {
    id: number,
    enterprises: []
}

export const createEnterprise = async (name: string, user_id: number, description: string, photo: string, links: string): Promise<Enterprise> => {


    const response: AxiosResponse<Enterprise> = await axios.post('/enterprise', {
        name: name,
        user_id: user_id,
        description: description,
        photo: photo,
        links: links
    }, {
        withCredentials: true
    })

    console.log(response.data);

    return response.data;

}

export const getEnterprises = async (id:number): Promise<PropsGetEnterprises> => {
    const response: AxiosResponse<PropsGetEnterprises> = await axios.get(`/enterprise/user`, {
        params: {
            user_id: id
        },
        withCredentials: true,
    });

    return response.data;

}