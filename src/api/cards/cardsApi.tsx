import { AxiosResponse } from "axios"
import axios from '../../axios';

interface PropsCardOrder {
    pipeline_id: string
    to_position: number | undefined
    card_id: string;
}

export const updateCardOrder = async (pipeline_id: string, to_position: number |undefined, card_id: string): Promise<PropsCardOrder> => {

    const response: AxiosResponse<PropsCardOrder> = await axios.put(`/card/order/${card_id}`, {
        pipeline_id: pipeline_id,
        to_position: to_position
    });

    return response.data;
}

interface PropsCreateCards {
    title: string
    email: string
    description: string
    user_id: number
    pipeline_id: number
}

export const createCards = async (title: string, email: string, description: string, user_id: number, pipeline_id: number): Promise<PropsCreateCards> => {

    const response: AxiosResponse<PropsCreateCards> = await axios.post('/card', {
        title: title,
        email: email,
        description: description,
        user_id: user_id,
        pipeline_id: pipeline_id

    });

    return response.data;

}