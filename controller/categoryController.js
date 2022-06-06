const Category = require('../model/categoryModel')

exports.addCategory = async (req,res) => {
    let category = await Category.findOne({
        category_name : req.body.category_name
    })
    if(category==null){
        let category = new Category({
            category_name:req.body.category_name
        })
        category = await category.save()
    
        if(!category){
            return res.status(400).json({error:"Something went wrong"})
        }
        res.send(category)
    }
    else{
        return res.status(400).json({error:"Category already exists."})
    }
}

// to view all categories
exports.listCategories = async (req,res) => {
    let category = await Category.find()
    if(!category){
        return res.status(400).json({error:"Something went wrong"})
    }
    res.send(category)
}

// to find category
exports.findCategory = async(req, res) => {
    let category = await Category.findById(req.params.id)
    if(!category){
        return res.status(400).json({error:"Something went wrong"})
    }
    res.send(category)
}

// to update category
exports.updateCategory = async(req,res) => {
    let category = await Category.findByIdAndUpdate(req.params.id,{
       category_name: req.body.category_name 
    },
    {new:true})
    if(!category){
        return res.status(400).json({error:"Something went wrong"})
    }
    res.send(category)

}

// to delete category
exports.deleteCategory = (req, res) => {
    Category.findByIdAndRemove(req.params.id)
    .then(category=>{
        if(!category){
            return res.status(400).json({error:"category not found"})
        }
        else{
            return res.status(200).json({message: "category deleted successfully"})
        }
    })
    .catch(err=>{return res.status(400).json({error:err.message})})
}
















       // form -> req.body
        // url -> req.params
        //facebook.com/asdlkfjaslkkfjasdfjl
        //google.com?search='asdlfkjaslfk'&
        // url -> req.query
