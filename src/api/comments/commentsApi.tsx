import { AxiosResponse } from "axios"
import axios from '../../axios';


interface PropsCreateComments {
    comment: string
    name_user: string
    user_id: number
    card_id: number
    enterprise_id: number
}

export const createComments = async (comment: string, name_user:string, user_id: number, card_id: number, enterprise_id: number): Promise<PropsCreateComments> => {
    const response: AxiosResponse<PropsCreateComments> = await axios.post('/comments', {
        comment: comment,
        name_user: name_user,
        user_id: user_id,
        card_id: card_id,
        enterprise_id: enterprise_id

    });

    return response.data;
}