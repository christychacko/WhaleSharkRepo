const mongoose = require('mongoose');
var userModelSchema=mongoose.Schema({
    status:{
        type:String,
        default:"Active"
    },
    role:{
        type:String,
        default:"User"
    },
    username:{
        type:String
    },
    name:{
        type:String
    },
    phonenum:{
        type:Number
    },
    emailid:{
        type:String
    },
    password:{
        type:String
    }
})
module.exports=mongoose.model("userModel",userModelSchema);