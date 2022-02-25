/* eslint-disable react-hooks/exhaustive-deps */
import Layout from '../../components/layout'
import {getRobotData, changeRobotChargingState, getRobotInfo, getAllRobotIds} from '../../lib/robots'
import Head from 'next/head'
import { GetStaticProps, GetStaticPaths } from 'next'
import { w3cwebsocket as W3CWebSocket } from "websocket";
import React, { useState, useEffect, useRef } from 'react';

import Button from '@mui/material/Button';
import LinearProgress, { LinearProgressProps } from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';


import styles from './robot.module.css'





export default function DeviceMonitor ({
    selectedRobot
}: {
    selectedRobot: {
    name:string,
    soc: number,
    charging:boolean
    }
}){


    const socket = useRef(null);
    const [soc, setSoc] =useState({
        charging: selectedRobot.charging,
        name: selectedRobot.name,
        currentStatus: selectedRobot.soc
    });

    const [socketIsReady, setSocketReadyState] = React.useState(false);
    const [timerCounter, setTimerCounter] = React.useState(0);
/*
    React.useEffect(() => {
      const timer = setInterval(() => {
        setProgress((prevProgress) => (prevProgress >= 100 ? 10 : prevProgress + 10));
      }, 800);
      return () => {
        clearInterval(timer);
      };
    }, []);
*/

    useEffect(()=>{
      socket.current = new W3CWebSocket(`ws://127.0.0.1:9000/`, 'echo-protocol');

      socket.current.onopen = () => {
        console.log('Socket is ready to use!');
        setSocketReadyState(true)
      };

      socket.current.onmessage = (message: any) => {
        let msg = JSON.parse(message.data)
        setSoc({charging:msg.isCharging, currentStatus: msg.currentState, name: selectedRobot.name})
      };

      socket.current.onerror = (err)=>{
        console.log(`>>>err:${JSON.stringify(err)}`);
      }

      socket.current.onclose = ((msg)=>{5
        console.log(">>> Socket closed: ",msg);
        setSocketReadyState(false)
      })
      
      return () => {
        console.log(">>> Socket closing...")
        socket.current.close()
        console.log(">>> Socket closed...")
      }

    }, [])

    useEffect(()=>{

      if (!socket.current || !socketIsReady) return;

      const timer = setInterval(()=>{
        socket.current.send(selectedRobot.name)
        let tempCounter = timerCounter + 1;
        setTimerCounter(tempCounter)
      }, 1000)

      return ()=>{
        clearInterval(timer)
      }
    })
    

    const disableCharcing = async ()=> {
      await changeRobotChargingState(false, selectedRobot.name)
    }

    const enableCharcing = async ()=> {
      await changeRobotChargingState(true, selectedRobot.name)
    }
    
    const getRobotStatus = async ()=> {
      let currentSoc = await getRobotInfo(selectedRobot.name)
      setSoc({charging:currentSoc.isCharging, currentStatus: currentSoc.currentState, name: selectedRobot.name})
    }
    

    return(
        <Layout>
            <Head>
                <title>Monitoring</title>
            </Head>
            <div className={styles.main}>
              <Typography  mt={5}>State: {soc.charging?'Charging':'Not Charging'}</Typography>
              <div className={styles.button}>
                {soc.charging ?
                  <Button variant="outlined" onClick={disableCharcing} >Diasable Charging</Button>
                 :<Button variant="contained" onClick={enableCharcing} >Enable Charging</Button>
                }
               
                
              </div>
              
              <Box sx={{ width: '100%' }}>
                  <LinearProgressWithLabel value={soc.currentStatus} />
                  {/*timerCounter*/}
              </Box>
            </div>
        </Layout>
        
    )
}

// To return posiible static values for id
export const getStaticPaths: GetStaticPaths = async () => {
    let paths = await getAllRobotIds();
    
    paths = paths.map(robot =>   ({params: {id: robot.id}}) );
    
    return {
      paths,
      fallback: false
    }
  }


  // To fetch necessary data for the post with a given id 
export const getStaticProps: GetStaticProps = async ({params}) => {
    const selectedRobot = await getRobotData(params?.id as string)
    console.log(`robot data:${JSON.stringify(selectedRobot)}`);
    return {
        props: {
            selectedRobot
        }
    }
}


function LinearProgressWithLabel(props: LinearProgressProps & { value: number }) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Box sx={{ width: '100%', mr: 1 }}>
          <LinearProgress variant="determinate" {...props} />
        </Box>
        <Box sx={{ minWidth: 35 }}>
          <Typography variant="body2" color="text.secondary">{`${Math.round(
            props.value,
          )}%`}</Typography>
        </Box>
      </Box>
    );
  }

