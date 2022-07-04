const express = require('express')
require ('dotenv').config()

const db = require('./Database/connection')

const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')

const demoroute = require('./route/demoRoute')
const CategoryRoute = require('./route/categoryRoute')
const ProductRoute = require('./route/productRoute')
const UserRoute = require('./route/userRoute')
const OrderRoute = require('./route/orderRoute')
const PaymentRoute = require('./route/paymentRoute')

const port = process.env.PORT
const app = express()

// middleware
app.use(bodyParser.json())
app.use(morgan('dev'))
app.use(cors())

// routes
app.use('/api',demoroute)
app.use('/api',CategoryRoute)
app.use('/api',ProductRoute)
app.use('/api',UserRoute)
app.use('/api',OrderRoute)
app.use('/api',PaymentRoute)

app.use('/public/uploads',express.static('public/uploads'))

//methods
// app.get(url, function(request,response){ statements})
// request - to get data from user
// response - to send data to user
app.get('/',(request, response)=>{
    response.send("Welcome to express js.")
})

app.get('/hello',(req,res)=>{
    res.send("This is express js.")
})

app.get('/goodmorning',(req,res)=>{
    res.send("Good Morning. This is express js class.")
})



// to start server
app.listen(port, ()=>{
    console.log(`server started at port ${port}`)
})