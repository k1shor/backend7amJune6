const express = require('express')
const { placeOrder, orderList, orderDetails, userOrder, updateOrderStatus, deleteOrder } = require('../controller/orderController')
const router = express.Router()

router.post('/placeorder',placeOrder)
router.get('/orders', orderList)
router.get('/orderdetails/:id', orderDetails)
router.get('/userorder/:userid', userOrder)
router.put('/updateorderstatus/:id', updateOrderStatus)
router.delete('/deleteorder/:id', deleteOrder)

module.exports = router