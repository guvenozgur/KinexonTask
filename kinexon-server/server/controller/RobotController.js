"use strict"

const router = require('express').Router();
const {getReq, postReq} = require('../helper/rest');
const robotList = require('../helper/robotList')

const url = `http://127.0.0.1:8000`

module.exports = ()=>{
    router.get('/getStatus', async (req, resp)=>{
        try{
            let statusResp = await getReq(`${url}/getRobotStatus/${req.query.name}`);
            resp.status(200).json(statusResp)
        }catch(err){

        }
    })

    router.get('/getRobotInfo', async (req, resp)=>{
        try{
            let statusResp = await getReq(`${url}/getRobotInfo/${req.query.name}`);
            resp.status(200).json(statusResp)
        }catch(err){

        }
    })

    router.post('/charge', async(req, resp)=>{
        try{
            await postReq(`${url}/charge`, req.body)
            resp.status(200)
        }catch(err){

        }
    })

    router.get('/getRobotList', async(req, resp)=>{
        try{
            resp.status(200).json(robotList)
        }catch(err){

        }
    })

    return router;
}