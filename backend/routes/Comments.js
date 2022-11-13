const express = require('express');
const router = express.Router();
const {comments} = require("../models");
const {validateToken} = require('../middlewares/AuthMiddleware');

router.get("/:postId",async (req,res)=>{
    const postId=req.params.postId;
    const com=await comments.findAll({where:{PostId:postId}});
    res.json(com);
});
router.post("/",validateToken,async (req,res)=>{
    const comment=req.body;
    const username = req.user.username;
    comment.username = username;
    await comments.create(comment);
    res.json(comment);
});

router.delete("/:commentId", validateToken, async (req, res) => {
    const commentId = req.params.commentId;

    await comments.destroy({
        where: {
            id: commentId,
        },
    });

    res.json("DELETED SUCCESSFULLY");
});

module.exports=router;