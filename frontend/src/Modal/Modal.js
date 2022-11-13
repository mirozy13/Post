import React, {useEffect, useState} from 'react'
import './Modal.css';
import axios from "axios";
import {useParams} from "react-router-dom";


const Modal = (props)=>{
    let { id } = useParams();
    const [title, setTitle] = useState(props.postObject.title);
    const [text, setText] = useState(props.postObject.postText);

    if(!props.show){
        return null
    }
    const changePost = () => {
        props.updatePost(title, text);
        axios.put(
                `http://localhost:3001/posts/edit`,
                {
                    New_title: title,
                    New_text: text,
                    id: id
                },
            {
                headers: { accessToken: localStorage.getItem("accessToken") },
        })
        setTitle('')
        setText('')
    };


    return (
        <div className='modal' onClick={props.onClose}>
        <div className='modal-content' onClick={e=>e.stopPropagation()}>
            <div className='modal-header'>
               <h4 className='modal-title'> Enter New Title</h4>
            </div>
            <div className='modal-body'>
                <input
                    autocomplete = "off"
                    id="inputCreatePost"
                    name="title"
                    placeholder="(Ex.Title..."
                    value = {title}
                    onChange={e => setTitle(e.target.value)}
                />
                <input
                    autoComplete="off"
                    id="inputCreatePost"
                    name="body"
                    placeholder="(Ex.Body..."
                    value={text}
                    onChange={e => setText(e.target.value)}
                />
            </div>
            <div className='modal-footer'>
                <button onClick={props.onClose} className='button'>Cancel</button>
                <button onClick={changePost} className='button'>Ok</button>
            </div>
        </div>
        </div>
    )
}
export default Modal