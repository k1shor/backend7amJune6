const multer = require('multer')

const fs = require('fs')
const path = require('path')

const storage = multer.diskStorage({
    destination: (req, file, cb)=>{
        let fileDestination = 'public/uploads/'

        if(!fs.existsSync(fileDestination)){
            fs.mkdirSync(fileDestination, {recursive:true})
        }

        cb(null, fileDestination)
    },

    filename: (req, file, cb) => {
        // abc.jpeg -> file.originalname
        // extname -> jpeg
        // basename -> abc
        let ext = path.extname(file.originalname)
        let filename = path.basename(file.originalname, ext)
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, filename + '-' + uniqueSuffix + ext)    }
})

let imageFilter = (req, file, cb) => {
    if(!file.originalname.match(/\.(jpg|png|gif|jpeg|svg|JPG|PNG|JPEG|SVG|jfif|JFIF)/)){
        return cb(new Error(" you can upload image files only."), false)
    }

    cb(null, true)
}

let upload = multer({
    storage: storage,
    fileFilter: imageFilter,
    limits: {
        fileSize: 200000
    }

})

module.exports = upload