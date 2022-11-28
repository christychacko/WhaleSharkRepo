const mongoose = require('mongoose');
var waterModelSchema=mongoose.Schema({
    status:{
        type:String,
        default:"Active"
    },
    photo:{
        type:String
    },
    animalLength:{
        type:Number
    },
    gender:{
        type:String
    },
    description:{
        type:String
    },
    location:{
        type:String
    }
})
module.exports=mongoose.model("waterModel",waterModelSchema);