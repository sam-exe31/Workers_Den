import React, { useEffect, useState } from 'react'
import Timer from './Timer';

function Day1() {

  const [counter,setcounter]=useState(0);
  const [isvisible,setisvisible]=useState(false);
  const [text,setText]=useState('');
  const [users,setusers]=useState([]);
  const [show,setshow]=useState(false);
  const [loading,setloading]=useState(false);
  const [buttonvis,setbuttonvis]=useState(true);
  const [timerdis,settimerdis]=useState(true);

  function goup(){
    setcounter(counter+1);
  }
  function godown(){
    if(counter<=-5){
      console.log(counter);
      setcounter(counter);
    }
    else{
    setcounter(counter-1);
    }
    // setcounter(counter-1);
  }


  function togglebar(){
      setisvisible(!isvisible);
  }

  function wordlimit(e){
    let word=e.target.value;
    let len=word.length;
    if(len>20){
      setText(word.substring(0,20));
      alert("only 20 char allowed")
    }
    else{
      setText(word);
    }

  }

  useEffect(()=>{
      fetch("https://jsonplaceholder.typicode.com/posts")
      .then(e=>e.json())
      .then(use=>setusers(use))
    },[])

    function handlefetch(){
      setbuttonvis(false);
      setloading(true);
      setTimeout(() => {
        setloading(false);
        setshow(true);
      }, 1000);
      setTimeout(() => {
        setshow(false);
        setbuttonvis(true);
      }, 8000);
      
    }

  return (
    < >
    <p className='flex justify-center bg-slate-500 font-bold text-lg'>DAY 1</p>
    <div>
      <div className='p-4'>
        {`count ${counter}`}
      </div>
        <div  className='flex '>
    <div className='bg-blue-400 inline-block rounded-md mr-4 p-2'>
      <button onClick={()=>{goup()}}>{`count +1`}</button>
    </div>
    <div className='bg-blue-400 inline-block rounded-md mr-4 p-2 hover:shrink-4'>
      <button onClick={()=>{godown()}}>{`count -1`}</button>
    </div>
    <div className='bg-red-500 inline-block rounded-md mr-4 p-2 hover:shrink-4'>
      <button onClick={()=>{setcounter(0)}}>Reset</button>
    </div>
    </div>

    {/* making and hiding the toggle bar  */}

    <div className='pt-4 flex pb-4'>
      <div>
        <button className='inline-block bg-slate-400 p-2 rounded-full' onClick={()=>togglebar()}>open-list</button>
      </div>
      {isvisible && <ul className=''><ol className='bg-green-400 rounded-md m-2 '>cleaning</ol> <ol className='bg-purple-400 rounded-md m-2 '>sweeping</ol> <ol className='bg-pink-400 rounded-md m-2' >catering</ol></ul> }
    </div>
    </div>
    

    <div className='pb-4'>
      <div className='flex'>
        value limiter :<input type="text" value={text} placeholder='type here'  className='bg-slate-300  text-black placeholder-slate-600 rounded-md p-1'  onChange={e=>wordlimit(e)} />
        <div className='pl-2'>{`word count:${text?text.length:0}`}</div>
      </div>
    </div>


    <div>
          <p className='flex justify-center bg-slate-500 font-bold text-lg'>DAY 2</p>

      <div>
        {/* making only first 5 names to be typed */}
          <ul>
            {users.slice(0,5).map((user)=>{
              return <p key={user.id}>{user.title}</p>
            })};
          </ul>
      </div>
    </div>

    <div>

      {buttonvis &&<button className='bg-slate-400 shadow-md animate-bounce border-l-orange-400' onClick={()=>{handlefetch()}}>fetch details</button>}
      {loading && <p className='animate-pulse text-red-600'>Loading...</p>}
      {show && <ul>{users.slice(5,10).map((user)=>{
        return <ol className='bg-slate-400 p-3'>{user.id}</ol>
      })}</ul>}
    </div>

    <div>
      <button className='bg-slate-400 rounded-md'onClick={()=>{settimerdis(prev=>!prev)}}>{timerdis ? 'Hide Timer' : 'Show Timer'}</button>
      {timerdis && <Timer/>}
    </div>

  <div className='pt-4'>
          <p className='flex justify-center bg-slate-500 font-bold text-lg'>DAY 3</p>
  </div>
      <div>
        
      </div>
    </>
  )
}

export default Day1
