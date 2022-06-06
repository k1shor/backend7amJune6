const express = require('express')
const { addProduct, productList, productDetails, productByCategory, updateProduct, deleteProduct } = require('../controller/productController')
const { requireSignin } = require('../controller/userController')
const upload = require('../fileUpload/upload')
const { productValidationSchema, validation } = require('../Validation/validator')
const router = express.Router()

router.post('/addproduct',upload.single('product_image'), productValidationSchema,validation,requireSignin, addProduct)
router.get('/productlist', productList)
router.get('/productdetails/:product_id', productDetails)
router.get('/productbycategory/:category_id', productByCategory)
router.put('/productupdate/:id', requireSignin, updateProduct)
router.delete('/deleteproduct/:id', requireSignin,deleteProduct)

module.exports = router