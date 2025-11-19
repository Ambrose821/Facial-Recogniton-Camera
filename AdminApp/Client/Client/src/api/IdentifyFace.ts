import api from "../api"
export const identify = async (imgUrl: string) =>{

    const response = await api.post('/faceid/identify',{img:imgUrl})

    return response.data



}