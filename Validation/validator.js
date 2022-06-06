const {check, validationResult} = require('express-validator')

// category validation 
exports.categoryValidationSchema = [
    check('category_name','category name is required').notEmpty()
    .isLength({min:3}).withMessage('category name must be at least 3 characters.')
]

//product validation
exports.productValidationSchema = [
    check('product_name', 'product name is required').notEmpty()
    .isLength({min:3}).withMessage('product name must be at least 3 characters.'),
    check('product_description', 'product description is required').notEmpty()
    .isLength({min:20}).withMessage('description must be at least 20 characters'),
    check('product_price', 'price is required').notEmpty()
    .isNumeric().withMessage('price must be only number'),
    check('category','category is required').notEmpty(),
    check('count_in_stock', 'count in stock is required').notEmpty()
    .isNumeric().withMessage('count must be a number')
]

// user validation
exports.userValidationSchema = [
    check('name', 'name is required').notEmpty()
    .isLength({min:3}).withMessage('name must be at least 3 characters.'),
    check('email', 'email is required').notEmpty()
    .isEmail().withMessage('incorrect email format'),
    check('password', 'password is required').notEmpty()
    .isLength({min:8}).withMessage('password must be at least 8 characters.')
    .isLength({max:30}).withMessage('password must not be more than 30 characters')
    .matches(/[a-z]/).withMessage('must contain lowercase alphabet')
    .matches(/[A-Z]/).withMessage('must contain uppercase alphabet')
    .matches(/[0-9]/).withMessage('must contain number ')
    .matches(/[_\-\.]/).withMessage('must contain special character')
]

// to display error
exports.validation = (req,res, next) => {
    const errors = validationResult(req)
    if(errors.isEmpty()){
        next()
    }
    else{
        return res.status(400).json({error: errors.array()[0].msg})
    }
}