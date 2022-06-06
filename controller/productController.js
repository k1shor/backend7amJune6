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
    let product = await Product.find().populate('category','category_name')
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