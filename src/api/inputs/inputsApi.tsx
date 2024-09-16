import { AxiosResponse } from "axios";
import axios from '../../axios'

interface PropsInputs {
    name: string
    content: string
    content_input_default: string
    type: string
    environment_id: number
    options: string
}


export const createInputs = async (name: string, content: string, content_input_default: string, type: string, environment_id: number, options: string): Promise<PropsInputs> => {
    const response: AxiosResponse<PropsInputs> = await axios.post('/environment/input', {
        name: name,
        content: content,
        content_input_default: content_input_default,
        type: type,
        environment_id: environment_id,
        options: options
    });


    return response.data;

}

interface PropsValuesInputs {
    id: string
    content: string
    environment_id: string | number,

}

export const updatedValuesInputs = async (id: string, content: string, environment_id: string | number): Promise<PropsValuesInputs> => {
    const response: AxiosResponse<PropsValuesInputs> = await axios.put(`/environment/input/${id}`, {
        content: content,
        environment_id: environment_id
    });

    return response.data
}

interface PropsGetInputs {
    enviroment_id: string | number 
    card: []
}


export const getAllInputsEnvironment = async (environment_id: string | number): Promise<PropsGetInputs> => {
    const response: AxiosResponse<PropsGetInputs> = await axios.get(`/input/environment/${environment_id}`, {
        withCredentials: true
    });

    console.log('get inpiut', response.data);

    return response.data;
}