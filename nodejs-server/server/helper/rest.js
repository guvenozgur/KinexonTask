const axios = require('axios')


module.exports.getReq = async (url)=>{
    let resp = await axios.get(url);
    return resp.data;
}

module.exports.postReq = async (url, param) => {
    let resp = await axios.post(url, param);
}