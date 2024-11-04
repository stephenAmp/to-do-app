import "bootstrap/dist/css/bootstrap.min.css";
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import './App.css';
import Dialog from './components/Dialog'

import { useState } from 'react';

export default function App(){
    const [ activity,setActivity ] = useState('');
    const [ submitActivity,setSubmitActivity ] = useState([]);
    const [ load,setLoad ] = useState([]);
    const [ isSaveModalOpened, setIsSaveModalOpened ] = useState(false);
    const [ isClearModalOpened, setIsClearModalOpened ] = useState(false);
    const [ editId,setEditId ] = useState(null)

    const now = new Date();
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
            setSubmitActivity([])
        }
    }


    function handleClear(){
        setIsClearModalOpened(!isClearModalOpened)

    }

    const handleClearYes=()=>{
        localStorage.clear()
        setLoad([])
        setIsClearModalOpened(false)
    }

    const handleClearNo = ()=>{
        setIsClearModalOpened(false)
    }

    function handleAdd(){
        if(activity){
            if(editId){
                setSubmitActivity((prev)=>
                    prev.map((item)=>(item.id === editId ? {...item,activity:activity.trim()}:item))
                );
                setEditId(null)
            }else{
            setSubmitActivity((prev)=>[{id:now.toLocaleString(),activity:activity.trim()},...prev])
            }
        }
        if(activity.length > 0 ){
            setActivity('')
        }
    }

    function handleDelete(id){
        setSubmitActivity(submitActivity.filter((item) =>item.id !== id))
    }

    function handleEdit(id,currentActivity){
        setEditId(id)
        setActivity(currentActivity)
    }
    function handleReorder(){
            setSubmitActivity([...submitActivity].reverse())
    }

    function handleSave(){
        if(submitActivity){
            localStorage.setItem('submitActivity',JSON.stringify(submitActivity))
        }
        setIsSaveModalOpened(!isSaveModalOpened);
    }

    function handleLoad(){
        const savedActivity = localStorage.getItem('submitActivity')
        if(savedActivity){
            setLoad(JSON.parse(savedActivity))
        }   
    }

    const SaveModal=()=>{
        return(
            <>
                <Dialog>
                    <icon></icon>
                    <h3>Activity list saved successfully</h3>
                    <button className='close-btn' onClick ={closeSaveModal}>Close</button>    
                </Dialog>
            </>
        )
    }

    const closeSaveModal = ()=>{
        setIsSaveModalOpened(false)
    }

    const ClearModal = ()=>{
        return(
            <>
            <Dialog>
                <icon></icon>
                <h3>Are you sure you want to clear saved activities?</h3>
                <button onClick={handleClearYes}>Yes</button>
                <button onClick={handleClearNo}>No</button>
            </Dialog>
            </>
        )
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
                const listedItem = 
                <li key={item.id}>
                    {item.id}: {item.activity}
                    <button onClick={()=>{handleDelete(item.id)}}>Delete</button>
                    <button onClick={()=>{handleEdit(item.id,item.activity)}}>Edit</button>
                </li>
                return <ul>{listedItem}</ul>
                
                })):(
                    <div>
                        <i>No listed activity present</i>
                    </div>
                )
            }
                    
                    <button className=" m-1 btn btn-success" onClick={handleReset} >Reset</button>
                    <button className= 'btn btn-secondary'onClick={handleReorder}>Reorder</button>
        
                    {submitActivity.length > 0 ? (<button className="btn btn-primary" onClick = {handleSave} style={{marginLeft:10}}>Save</button>):(
                    (<button className="btn btn-primary" disabled style={{marginLeft:10}}>Save</button>)
                    )}
                    <button className="btn btn-danger" onClick={handleClear} style={{marginLeft:100}}>Clear saves</button>

                    {load.length > 0 ? (
                        load.map((item,index)=>{
                            const loadedItems = <li key={item.id}>{item.id}: {item.activity}</li>
                            return(
                            <ul>{loadedItems}</ul>
                            )
                        })
                    ):(<div>
                            <i>Click load button to load previously saved activities</i>
                        </div>)}
                    <button className="btn btn-info" onClick={handleLoad}>Load</button>
                    {isSaveModalOpened && 
                        (<SaveModal/>)
                    }
                    {isClearModalOpened && 
                        (<ClearModal/>)
                    }
    </div>        
</>
    )
}