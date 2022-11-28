const mongoose = require('mongoose');
var tokenModelSchema=mongoose.Schema({
    status:{
        type:String,
        default:"Active"
    },
    token:{
        type:String
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"userModel"
    }
})
module.exports=mongoose.model("tokenModel",tokenModelSchema);