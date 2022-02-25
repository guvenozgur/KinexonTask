import {httpGet, httpPost} from './rest'

const url = `http://127.0.0.1:9000`

export async function getAllRobotIds() {
    return await httpGet(`${url}/getRobotList`)
}

export async function getRobotData(id: string) {
    return await httpGet(`${url}/getRobotInfo?name=${id}`)
}

export async function changeRobotChargingState(newState: boolean, robotId: string){
    return await httpPost(`${url}/charge`, {charging: newState, name: robotId})
}

export async function getRobotInfo(id: string) {
    let response = await httpGet(`${url}/getRobotStatus/${id}`)
    return response
}



