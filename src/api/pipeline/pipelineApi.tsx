import { AxiosResponse } from "axios"
import axios from '../../axios';
interface PropsPipeline {
    environment_id: string | undefined
    pipelines: []
}


export const getPipelineEnvironment = async (environment_id: string | undefined): Promise<PropsPipeline> => {

    const response: AxiosResponse<PropsPipeline> = await axios.get(`/pipeline/environment/${environment_id}`, {
        withCredentials: true
    });

   

    return response.data;

}


interface PropsPipelineUpdate {
    id: string
    name: string
    sort: number
    environment_id: number
}

export const updatedPipelineEnvironment = async (id: string, name: string, sort: number, environment_id: number): Promise<PropsPipelineUpdate> => {

    const response: AxiosResponse<PropsPipelineUpdate> = await axios.put(`/pipeline/${id}`, {
        name: name,
        sort: sort,
        environment_id: environment_id
    });

    return response.data;

}


interface PropsPipelinePost {
    name: string
    environment_id: string | undefined
}

export const createPipelineEnvironment = async (name: string, environment_id: string | undefined): Promise<PropsPipelinePost> => {
    const response: AxiosResponse<PropsPipelinePost> = await axios.post('/pipeline', {
        name: name,
        environment_id: environment_id
    });

    return response.data;
}