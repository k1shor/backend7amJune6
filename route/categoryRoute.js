const express = require('express')
const { addCategory, listCategories, findCategory, updateCategory, deleteCategory } = require('../controller/categoryController')
const { requireSignin } = require('../controller/userController')
const { categoryValidationSchema, validation } = require('../Validation/validator')
const router = express.Router()

router.post('/addcategory',categoryValidationSchema, validation, requireSignin, addCategory)
router.get('/categories', listCategories)
router.get('/findcategory/:id', findCategory)
router.put('/updatecategory/:id',requireSignin, updateCategory)
router.delete('/deletecategory/:id',requireSignin, deleteCategory)


module.exports = router