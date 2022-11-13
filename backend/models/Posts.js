module.exports = (sequelize,DataTypes)=> {

    const Posts = sequelize.define("Posts",{
        title:{
            type:DataTypes.STRING,
            allowNull:false
        },
        postText:{
            type:DataTypes.STRING,
            allowNull:false
        },
        username:{
            type:DataTypes.STRING,
            allowNull:false
        },
    });

    Posts.associate = (models) => {
        Posts.hasMany(models.comments, {
            onDelete: "cascade",
        });

        Posts.hasMany(models.likes, {
            onDelete: "cascade",
        });
    };

    return Posts;
};