import React, { useEffect, useState } from 'react'

function Timer() {

    const [count,setcount]=useState(0);

    useEffect(()=>{
        const intervalid=setInterval(()=>{
            setcount(count=>count+1);
        },1000);
        return ()=>{
            clearInterval(intervalid);
            console.log(count);
        }
    },[]);


  return (
    <>
    <div>
        <p >`{count}`</p>
    </div>
    </>
  )
}

export default Timer
