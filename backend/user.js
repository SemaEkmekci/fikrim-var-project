const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
    {
        userName:String,
        userSurname:String,
        email: {type:String, unique: true},
        password:String,
        role:String,
        unit:String,
        mailVerification:Boolean,
    },{
        collection:"User"
    }
);

const user = mongoose.model("User",UserSchema);

module.exports = user;