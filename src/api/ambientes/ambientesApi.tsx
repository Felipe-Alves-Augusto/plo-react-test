import { AxiosResponse } from "axios";
import axios from "../../axios";

interface EnvironmentCreate {
    user_id: number
    name: string
    description: string
    photo: string
    enterprise_id: number
}

export const createEnvironment = async (user_id: number, name: string, description: string, photo: string, enterprise_id: number): Promise<EnvironmentCreate> => {

    const response: AxiosResponse<EnvironmentCreate> = await axios.post('/environment', {
        user_id: user_id,
        name: name,
        description: description,
        photo: photo,
        enterprise_id: enterprise_id
    },
        {
            withCredentials: true
        }
    )

    console.log(response.data);

    return response.data;

}

interface PropsGetEnvironment {
    user_id: number
    enterprise_id: number
    environments: [];
}

///environment/user?user_id=${session?.user.id}&enterprise_id=${enterprise?.id}
export const getAllEnvironment = async (user_id: number, enterprise_id: number): Promise<PropsGetEnvironment> => {
    const response: AxiosResponse<PropsGetEnvironment> = await axios.get('/environment/user', {
        params: {
            user_id: user_id,
            enterprise_id: enterprise_id
        },
        withCredentials: true
    })

    return response.data;
} 