import React, { useContext } from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import {Link, useHistory} from "react-router-dom";
import ThumbUpIcon from '@mui/icons-material/ThumbUp';


function Home(){
    const [listOfPosts,setListOfPosts]=useState([]);
    const [likedPosts,setLikedPosts]= useState([]);
    let history = useHistory();


    useEffect(()=>{
        if(!localStorage.getItem("accessToken")){
            history.push("/login");
        }else {
            axios.get("http://localhost:3001/posts", {
                headers: {accessToken: localStorage.getItem("accessToken")},
            })
                .then((response) => {
                    setListOfPosts(response.data.listOfPosts);
                    setLikedPosts(response.data.likedPosts.map((like) => {
                            return like.PostId;
                        })
                    );
                });
        }
    },[]);


    const likeAPost = (postId) => {
        axios
            .post(
                "http://localhost:3001/likes",
                { PostId: postId },
                { headers: { accessToken: localStorage.getItem("accessToken") } }
            )
            .then((response) => {
                setListOfPosts(
                    listOfPosts.map((post) => {
                        if (post.id === postId) {
                            if (response.data.liked) {
                                return { ...post, likes: [...post.likes, 0] };
                            } else {
                                const likesArray = post.likes;
                                likesArray.pop();
                                return { ...post, likes: likesArray };
                            }
                        } else {
                            return post;
                        }
                    })
                );
                if (likedPosts.includes(postId)) {
                    setLikedPosts(
                        likedPosts.filter((id) => {
                            return id !== postId;
                        })
                    );
                } else {
                    setLikedPosts([...likedPosts, postId]);
                }
            });
    };


    return(
        <div className="postlist">
            {listOfPosts.map((value,key)=>{
                return (
                    <div key={key}  className="post">
                        <div className="title"> {value.title}</div>
                        <div
                            className="body"
                            onClick={()=>{
                            history.push(`/post/${value.id}`)
                        }}
                        >
                            {value.postText}
                        </div>
                        <div className="footer">
                        <div className="username">
                            <Link  className="link" to={`/profile/${value.UserId}`}> {value.username} </Link>
                        </div>
                        <div className="buttons">
                            <ThumbUpIcon
                                onClick={() => {
                                    likeAPost(value.id);
                                }}
                                className={
                                likedPosts.includes(value.id) ? "unlikeBttn": "likeBttn"
                            }
                            />
                            <label> {value.likes.length}</label>
                        </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export default Home;