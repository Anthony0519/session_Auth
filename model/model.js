const mongoose = require('mongoose')
const {DateTime} = require('luxon')

const createdOn = DateTime.now().toLocaleString({weekday:"short",month:"short",day:"2-digit", year:"numeric", hour:"2-digit",minute:"2-digit"})

const regSchema = new mongoose.Schema({
    firstName:{
        type:String,
    },
    lastName:{
        type:String,
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    profile:{  
        type:String,
    },
    password:{  
        type:String,
    },
    isVerified:{  
        type:Boolean,
    },
    Date_Created:{
        type:String,
        default:createdOn
    },
})

const dataBase = mongoose.model("schoolApp", regSchema)
 
module.exports = dataBase