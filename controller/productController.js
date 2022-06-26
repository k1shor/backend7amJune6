const Product = require('../model/productModel')

// to add product
exports.addProduct = async(req, res) => {
    let product = new Product({
        product_name: req.body.product_name,
        product_description: req.body.product_description,
        product_price: req.body.product_price,
        count_in_stock: req.body.count_in_stock,
        product_image: req.file.path,
        category: req.body.category
    })
    product = await product.save()
    if(!product){
        return res.status(400).json({error: "something went wrong"})
    }
    res.send(product)
}

// to view product list
exports.productList = async(req,res) => {
    let order = req.query.order? req.query.order : 1
    let sort = req.query.sortBy ? req.query.sortBy : '_id'
    let limit = req.query.limit ? req.query.limit : 200000000

    let product = await Product.find().populate('category','category_name')
    .sort([[sort,order]])
    .limit(limit)
    if(!product){
        return res.status(400).json({error: "something went wrong"})
    }
    res.send(product)
}

// to view product details
exports.productDetails = async (req,res) => {
    let product = await Product.findById(req.params.product_id).populate('category','category_name')
    if(!product){
        return res.status(400).json({error: "something went wrong"})
    }
    res.send(product)
}

// to find product according to category
exports.productByCategory = async (req,res) => {
    let product = await Product.find({
        category: req.params.category_id
    })
    if(!product){
        return res.status(400).json({error: "something went wrong"})
    }
    res.send(product)
}

// to update product
exports.updateProduct = async (req,res) => {
    let product = await Product.findByIdAndUpdate(req.params.id,{
        product_name: req.body.product_name,
        product_description: req.body.product_description,
        product_price: req.body.product_price,
        count_in_stock: req.body.count_in_stock,
        product_image: req.body.product_image,
        category: req.body.category
    },{new:true})
    if(!product){
        return res.status(400).json({error: "something went wrong"})
    }
    res.send(product)
}

// to remove/delete product
exports.deleteProduct = (req,res) => {
    Product.findByIdAndRemove(req.params.id)
    .then(product=>{
        if(product==null){
            return res.status(400).json({error:"Product not found"})
        }
        else{
            return res.status(200).json({message:"Product deleted successfully"})
        }
    })
    .catch(err=>res.status(400).json({error:err}))
}

// to get filtered products
exports.filterProduct = async (req, res) => {
    let sortBy = req.query.sortBy ? req.query.sortBy : '_id'
    let order = req.query.order ? req.query.order : '1'
    let limit = req.query.limit ? Number(req.query.limit) : 20000000
    let skip = req.query.skip ? Number(req.query.skip) : 0
    // filter arguments
    let findArgs = {}
    for( let key in req.body.filters){
        if(req.body.filters[key].length>0){
            if(key==='product_price'){
                findArgs[key] = {
                    $gte: req.body.filters[key][0],
                    $lte: req.body.filters[key][1]
                }
            }
            else{
                findArgs[key] = req.body.filters[key]
            }
        }
    }
    // find products
    const product = await Product.find(findArgs)
    .populate('category')
    .sort([[sortBy,order]])
    .limit(limit)
    .skip(skip)
    if(!product){
        return res.status(400).json({error: "something went wrong"})
    }
    res.json({
        size: product.length,
        product
    })
}

exports.findRelated = async(req,res) => {
    let product = await Product.findById(req.params.id)
    if(!product){
        return res.status(400).json({error:"something went wrong"})
    }
    let relatedProduct = await Product.find({
        category: product.category,
        _id:{$ne: product._id}
    })
    if(!relatedProduct){
        return res.status(400).json({error:"something went wrong"})
    }
    res.send(relatedProduct)
}