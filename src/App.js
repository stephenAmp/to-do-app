import "bootstrap/dist/css/bootstrap.min.css";
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import 'bootstrap-icons/font/bootstrap-icons.css';
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
                setSubmitActivity(prev =>
                    prev.map(item => (item.id === editId ? {...item,activity:activity.trim()}:item))
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
        setSubmitActivity(submitActivity.filter(item => item.id !== id))
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
                    <i class="bi bi-check-circle" style={{fontSize:'2em',color:'green'}}></i>
                    <p>Activity list saved successfully</p>
                    <button className='btn-close-modal' onClick ={closeSaveModal}>
                        <i className="bi bi-x-lg"></i> Close
                    </button>    
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
            <i class="bi bi-exclamation-circle" style={{fontSize:'2em',color:"red"}}></i>
                <p>Are you sure you want to clear saved activities?</p>
                <div className="modal-btns">
                    <button className="btn-yes" onClick={handleClearYes}>Yes</button>
                    <button className="btn-no" onClick={handleClearNo}>No</button>
                </div>
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
            <label for='activity' className="form-label"><h3>Activity</h3></label>
            <input id ='activity' className = 'form-control' type='text' value={activity} onKeyDown={handleKey} onChange={handleChange}/>
        </div>
        {inputBoxEmpty ? (
            <button className='add-button' onClick={handleAdd}><i className="bi bi-plus-circle"></i> Add</button>
        ):(
            <button className="add-button" disabled><i className="bi bi-plus-circle"></i> Add</button>
   
        )
        }
        
        {submitActivity.length > 0  ? (
            submitActivity.map((item,id)=>{
                const listedItem = 
                <li key={item.id}>
                    {item.id}: {item.activity}
                    <div className="action-btns">
                        <button style={{marginLeft:5}}className="btn btn-primary"onClick={()=>{handleDelete(item.id)}}><i class="bi bi-trash3"> Delete</i></button>
                        <button style={{marginLeft:2}} className ='btn btn-success' onClick={()=>{handleEdit(item.id,item.activity)}}><i class="bi bi-pencil-square"> Edit</i></button>
                    </div>
                </li>
                return <ul>{listedItem}</ul>
                
                })):(
                    <div>
                        <i>No listed activity present</i>
                    </div>
                )
            }
                    <div className="button-group">
                        <button className="btn-reset" onClick={handleReset}><i className="bi bi-arrow-counterclockwise"></i> Reset</button>
                        <button className= 'btn-reorder'onClick={handleReorder}> <i className="bi bi-arrow-repeat"></i> Reorder</button>
        
                        {submitActivity.length > 0 ? (<button className="btn-save" onClick ={handleSave}>
                        <i className="bi bi-save"></i> Save
                        </button>):(
                        (<button className="btn-save" disabled><i className="bi bi-save"></i> Save
                        </button>)
                        )}
                        <button className="btn-clear-saved" onClick={handleClear}><i className="bi bi-x-circle"></i> Clear Saves</button>
                    </div>
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
                    <button className="btn-load" onClick={handleLoad}>
                        <i className="bi bi-arrow-down-circle"></i> Load
                    </button>
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