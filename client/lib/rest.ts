'use strict'

import axios from 'axios'
const options = {
	headers: {"content-type": "application/json"}
}

export async function httpGet(path: string){
    let response = await axios.get(path);  

    return response.data;
}

export async function httpPost(path: string, param: any){
    let response;
    try{
        response =await axios.post(path, {...param}, options);

    }catch(err){
        console.error(`Err: ${err}`);
    }
    return response
}