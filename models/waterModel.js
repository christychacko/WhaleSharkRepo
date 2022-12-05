const mongoose = require('mongoose');
var waterModelSchema=mongoose.Schema({
    status:{
        type:String,
        default:"Active"
    },
    animaltype:{
        type:String
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
    },
    boatNo:{
        type:Number
    },
    boatOwner:{
         type:String
    },
    document:{
        type :String
  },
    healthStatus:{
          type :String
    }
    
})
module.exports=mongoose.model("waterModel",waterModelSchema);