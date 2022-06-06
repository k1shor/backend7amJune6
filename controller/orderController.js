const Order = require('../model/orderModel')
const OrderItems = require('../model/orderItemsModel')
const Product = require('../model/productModel')

exports.placeOrder = async (req, res) => {
    let orderItemsIds = await Promise.all(
        req.body.orderItems.map(async (orderItem) => {
            let product = await Product.findById(orderItem.product)
            if (!product) {
                return res.status(400).json({ error: "product not found" })
            }

            let new_order_item = new OrderItems({
                product : orderItem.product,
                quantity : orderItem.quantity,
                totalPrice : orderItem.quantity * product.product_price
            })
            new_order_item = await new_order_item.save()
            if (!new_order_item) {
                return res.status(400).json({ error: "failed to save order item." })
            }
            return new_order_item._id
        })
    )
    // calculate total price
    let individual_total_prices = await Promise.all(orderItemsIds.map(async item=>{
        let orderItem = await OrderItems.findById(item)
        return orderItem.totalPrice
    }))
    let totalOrderPrice = individual_total_prices.reduce((acc,cur)=>acc+cur)

    let order = new Order({
        orderItemsIds :  orderItemsIds, 
        userId: req.body.user,
        shipping_address: req.body.shipping_address,
        alternate_shipping_address: req.body.alternate_shipping_address,
        city:req.body.city,
        country:req.body.country,
        phone: req.body.phone,
        totalOrderPrice: totalOrderPrice
    })
order = await order.save()
if(!order){
    return res.status(400).json({error:"failed to place order"})
}
res.send(order)



}

// to view orders
exports.orderList = async(req,res) => {
    let order = await Order.find().populate('userId','name').sort({createdAt:-1})
    if(!order){
        return res.status(400).json({error:"something went wrong"})
    }
    res.send(order)
}

// to view order Details
exports.orderDetails = async(req,res) => {
    let order = await Order.findById(req.params.id).populate('userId','name')
    .populate({path:'orderItemsIds',populate:{path:'product',populate:'category'}})
    if(!order){
        return res.status(400).json({error:"something went wrong"})
    }
    res.send(order)
}

// to view user order
exports.userOrder = async (req, res) => {
    let order = await Order.find({userId:req.params.userid}).populate('userId','name')
    .populate({path:'orderItemsIds',populate:{path:'product',populate:'category'}})
    if(!order){
        return res.status(400).json({error:"something went wrong"})
    }
    res.send(order)
}

// to update order status
exports.updateOrderStatus = async (req,res) => {
    let order = await Order.findByIdAndUpdate(req.params.id, {
        status:req.body.status
    },
    {new:true})
    if(!order){
        return res.status(400).json({error:"something went wrong"})
    }
    res.send(order)
}

// to delete order
// order - [orderitems], user, shipping_info, status
exports.deleteOrder = (req,res) =>{
    Order.findByIdAndRemove(req.params.id)
    .then(async order=>{
        if(order){
            await order.orderItemsIds.map(async orderItem=>{
                await OrderItems.findByIdAndRemove(orderItem)
                if(!orderItem){
                    return res.status(400).json({error:"failed to delete order Item"})
                }
            })
            return res.status(200).json({message:"Order deleted successfully"})
        }
        else{
            return res.status(400).json({error:"failed to delete order"})
        }
    })
}
