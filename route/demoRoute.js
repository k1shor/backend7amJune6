const express = require('express')
const { welcome } = require('../controller/demoController')
const router = express.Router()


router.get('/first',(req,res)=>{
    res.send("This message is from router.")
})

router.get('/second', welcome)

module.exports = router