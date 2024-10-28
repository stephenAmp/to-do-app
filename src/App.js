import 'bootstrap' 
import { useState } from 'react';

export default function App(){
    const [ activity,setActivity ] = useState('')
    const [ submitActivity,setSubmitActivity ] = useState([])

    function handleChange(e){
        setActivity(e.target.value)

    }

    function handleReset(){
        if (activity.length | submitActivity.length > 0 ){
            setActivity('')
            setSubmitActivity('')
        }
    }

    function handleAdd(){
        if(activity){
            setSubmitActivity((prev)=>[{id:Date.now,activity:activity.trim()},...prev])
        }
        if(activity.length > 0 ){
            setActivity('')
        }
    }

    function handleReorder(){
            setSubmitActivity([...submitActivity].reverse())
    }

    function handleKey(e){
        if(e.key === 'Enter'){
            handleAdd()
        }else if(e.key === 'Escape' && activity.length > 0){
            setActivity('')
        }
        
    }
    
    return(
        <>
            <label>Activity:</label>
            <input type='text' value={activity} onKeyDown={handleKey} onChange={handleChange}/>
            <button onClick={handleAdd}>Add</button>
            <button onClick={handleReset}>Reset</button>
            <button onClick={handleReorder}>Reorder</button>
            <button>Save</button>
            {submitActivity.length > 0  ? (
                submitActivity.map((item,id)=>{
                    const listedItem = <li key={item.id}>{item.activity}</li>
                    return <ul>{listedItem}</ul>
                
                })):(
                    <p className='lead'>
                        No listed activity present 
                    </p>
                )
            }
        </>
    )
}