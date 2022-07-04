const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

// payment_processing
exports.processPayment = async(req, res) => {
    const paymentIntent = await stripe.paymentIntents.create({
        amount: req.body.amount,
        currency: 'npr',
        metadata: {
            integration_check: 'accept_a_payment'
        }
    })
    res.status(200).json({
        success: true,
        client_secret: paymentIntent.client_secret
    })
}

// to send stripe key to front end
exports.sendStripeKey = (req,res) => {
    res.status(200).json({
        success: true,
        stripeAPIKey : process.env.STRIPE_API_KEY
    })
}