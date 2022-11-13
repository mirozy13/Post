import React, { useEffect, useState,useContext } from "react";
import { useParams,useHistory } from "react-router-dom";
import axios from "axios";
import './Post.css';
import { AuthContext } from "../helpers/AuthContext";
import Modal from '../Modal/Modal';
import DeleteIcon from '@mui/icons-material/Delete';
import DeleteIcon2 from '@mui/icons-material/Delete';

function Post() {
    const [show,setShow] =useState(false);

    let { id } = useParams();
    const [postObject, setPostObject] = useState({});
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const { authState } = useContext(AuthContext);

    let history = useHistory();

    useEffect(() => {
        axios.get(`http://localhost:3001/posts/byId/${id}`).then((response) => {
            setPostObject(response.data);
        });

        axios.get(`http://localhost:3001/comments/${id}`).then((response) => {
            setComments(response.data);
        });
    }, []);

    const addComment = () => {
        axios
            .post(
                "http://localhost:3001/comments",
                {
                    commentBody: newComment,
                    PostId: id,
                },
                {
                    headers: {
                        accessToken: localStorage.getItem("accessToken"),
                    },
                }
            )
            .then((response) => {
                if (response.data.error) {
                    console.log(response.data.error);
                } else {
                    const commentToAdd = {
                        commentBody: newComment,
                        username: response.data.username,
                    };
                    setComments([...comments, commentToAdd]);
                    setNewComment("");
                }
            });
    };

    const deleteComment = (id) => {
        axios
            .delete(`http://localhost:3001/comments/${id}`, {
                headers: { accessToken: localStorage.getItem("accessToken") },
            })
            .then(() => {
                setComments(
                    comments.filter((val) => {
                        return val.id !== id;
                    })
                );
            });
    };

    const deletePost = (id) => {
        axios
            .delete(`http://localhost:3001/posts/${id}`, {
                headers: { accessToken: localStorage.getItem("accessToken") },
            })
            .then(() => {
                history.push("/");
            });
    };

    const updatePost = (newTitle, newText) => {
        setPostObject({...postObject, title:newTitle, postText: newText})
        console.log(newTitle)
        setShow(false)
    }
    const onClose = (show) => {
        setShow(false)
    }


    return (
        <div className="postPage">
            <div className="leftSide">
                <div className="post" id="individual">
                    <div className="title"
                         onClick={()=>{setShow(true)}} >
                        {postObject.title}

                        <Modal show = {show} postObject = {postObject} onClose={onClose} updatePost={updatePost}/>

                    </div>

                    <div className="body"
                    >
                        {postObject.postText}
                    </div>
                    <div className="postcomment footer"> {postObject.username}
                        {authState.username===postObject.username &&(
                            <DeleteIcon2 fontSize="large" className="deletePost"
                                         onClick={()=>{
                                deletePost(postObject.id)}}>Delete Post</DeleteIcon2>
                        )}
                    </div>

                </div>
            </div>
            <div className="rightSide">
                <div className="addCommentContainer">
                    <input
                        type="text"
                        placeholder="Comment..."
                        autoComplete="off"
                        value={newComment}
                        onChange={(event) => {setNewComment(event.target.value);
                        }}
                    />
                    <button onClick={addComment}> Add Comment</button>
                </div>
                <div className="listOfComments">
                    {comments.map((comment, key) => {
                        return (
                            <div key={key} className="comment">

                                <label className="labelName" >
                                    {comment.commentBody} : {comment.username}</label>
                                <div style ={{width: "fit-content", display: "inline-block"}}>
                                {authState.username === comment.username && (
                                    <DeleteIcon
                                        className="deleteComment"
                                        onClick={() => {
                                            deleteComment(comment.id);
                                        }}
                                    >
                                    </DeleteIcon>
                                )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default Post;