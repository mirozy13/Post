const express = require('express');
const router = express.Router();
const {Posts,likes} = require("../models");
const {validateToken} =require('../middlewares/AuthMiddleware');


router.get("/",validateToken,async (req,res)=>{
    const listOfPosts = await Posts.findAll({include:[likes]});
    const likedPosts= await likes.findAll({where:{UserId:req.user.id}});
    res.json({listOfPosts:listOfPosts,likedPosts:likedPosts});
});

router.post("/", validateToken, async (req, res) => {
    const post = req.body;
    post.username = req.user.username;
    post.UserId = req.user.id;
    await Posts.create(post);
    res.json(post);
});

router.get("/byId/:id",async (req,res)=>{
    const id=req.params.id;
    const post=await Posts.findByPk(id);
    res.json(post);
});

router.get("/byuserId/:id", async (req, res) => {
    const id = req.params.id;
    const listOfPosts = await Posts.findAll({
        where: { UserId: id },
        include: [likes],
    });
    res.json(listOfPosts);
});


router.delete("/:postId", validateToken, async (req, res) => {
    const postId = req.params.postId;
    await Posts.destroy({
        where: {
            id: postId,
        },
    });

    res.json("DELETED SUCCESSFULLY");
});

router.put("/edit", validateToken, async (req, res) => {
    const {New_title, New_text, id} = req.body;
    await Posts.update({title:New_title, postText: New_text},{where:{id:id}});
    res.json({New_title: New_title, New_text: New_text});
});

router.put("/postText", validateToken, async (req, res) => {
    const {newText,id} = req.body;
    await Posts.update({postText:newText},{where:{id:id}});
    res.json(newText);
});

module.exports = router;