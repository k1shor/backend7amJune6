// samsung - 5
// acer laptop - 2

// orderitems - [id1, id2]
// user - userDetails
// shipping address 
// phone 

let mongoose = require('mongoose')
let {ObjectId} = mongoose.Schema

let orderSchema = mongoose.Schema({
    orderItemsIds : [{
            type: ObjectId,
            ref: "OrderItems",
            required: true
        }],
    userId: {
        type: ObjectId,
        ref:"User",
        required: true
    },
    shipping_address:{
        type: String,
        required: true
    },
    alternate_shipping_address:{
        type: String
    },
    city:{
        type:String,
        required: true
    },
    country:{
        type: String, 
        required: true
    },
    phone:{
        type: String,
        required: true
    },
    totalOrderPrice:{
        type: Number,
        required: true
    }, 
    status:{
        type: String,
        required: true,
        default: "pending"
    }
},{timestamps:true})

module.exports = mongoose.model("Order",orderSchema)
