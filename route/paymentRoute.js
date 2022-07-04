const express = require('express')
const { processPayment, sendStripeKey } = require('../controller/paymentController')
const router = express.Router()

router.post('/processpayment',processPayment)
router.get('/getStripeAPIKey',sendStripeKey)

module.exports = router