import "bootstrap/dist/css/bootstrap.min.css";
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

import { useState } from 'react';

export default function App(){
    const [ activity,setActivity ] = useState('')
    const [ submitActivity,setSubmitActivity ] = useState([])

    let inputBoxEmpty;

    if(activity === ''){
        inputBoxEmpty = false
    }else{
        inputBoxEmpty = true
    }
    
   

    function handleChange(e){
        setActivity(e.target.value)

    }

    function handleReset(){
        if (activity.length | submitActivity.length > 0 ){
            setActivity('')
            setSubmitActivity('')
        }
    }

    function handleClear(){
        localStorage.clear()

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

    function handleSave(){
        if(submitActivity){
            localStorage.setItem('submitActivity',JSON.stringify(submitActivity))
        }
        if(submitActivity.length === 1){
            alert('Activity has been saved successfully')
        }else{
            alert('Activities have been saved successfully')
        }
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
    <div className="container" style={{marginTop:10}}>   
        <div className="mb-3">    
            <label for='activity' className="form-label"><b>Activity</b></label>
            <input id ='activity' className = 'form-control' type='text' value={activity} onKeyDown={handleKey} onChange={handleChange}/>
        </div>
        {inputBoxEmpty ? (
            <button onClick={handleAdd}>Add</button>
        ):(
            <button disabled>Add</button>
   
        )
        }
        
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
        <button className="btn btn-success" onClick={handleReset} style={{marginRight:10}}>Reset</button>
        <button className= 'btn btn-secondary'onClick={handleReorder}>Reorder</button>
        
        {submitActivity.length > 0 ?(<button className="btn btn-primary" onClick = {handleSave} style={{marginLeft:10}}>Save</button>):(
            (<button className="btn btn-primary" disabled style={{marginLeft:10}}>Save</button>)
        )}
        <button className="btn btn-danger" onClick={handleClear} style={{marginLeft:100}}>Clear saves</button>
    </div>        
</>
    )
}