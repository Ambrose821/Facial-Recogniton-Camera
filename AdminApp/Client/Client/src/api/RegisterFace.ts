
import type { RegisterPaylaod } from "../types"
import api from "../api"

export const registerFace = async(payload: RegisterPaylaod) =>{
    try{
    const response = await api.post("/faceid/register",payload)

    if(response.status == 200){
        return true

    }else{
        return false
    }
    console.log(response.status)
    }catch(error){
    return false
    }  
}

