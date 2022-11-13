const express = require("express");
const router = express.Router();
const { likes } = require("../models");
const { validateToken } = require("../middlewares/AuthMiddleware");

router.post("/", validateToken, async (req, res) => {
    const {PostId} = req.body;
    const UserId = req.user.id;

    const found = await likes.findOne({
        where: { PostId: PostId, UserId: UserId },
    });
    if (!found) {
        await likes.create({ PostId: PostId, UserId: UserId });
        res.json({liked:true});
    } else {
        await likes.destroy({
            where: { PostId: PostId, UserId: UserId },
        });
        res.json({liked:false});
    }
});
module.exports = router;