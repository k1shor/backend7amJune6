// orderitems - {samsung, 5}, id1
// orderitems - {acer, 2}, id2


let mongoose = require('mongoose')
let {ObjectId} = mongoose.Schema

let orderItemsSchema = mongoose.Schema({
    product:{
        type:ObjectId,
        ref:"Product",
        required: true
    },
    quantity:{
        type:Number,
        required: true
    }, 
    totalPrice:{
        type:Number,
        required: true
    }
}, {timestamps:true})

module.exports = mongoose.model("OrderItems",orderItemsSchema)