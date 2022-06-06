const mongoose = require('mongoose')
const uuidv1 = require('uuidv1')
const crypto = require('crypto')

const userSchema = mongoose.Schema({
    name:{
        type:String, 
        required: true,
        trim: true
    },
    email:{
        type: String,
        required: true
    },
    hashed_password:{
        type: String,
        required: true
    },
    role:{
        type: Number, //0 - normal user, 1 - admin, 2- superadmin
        // type: Boolean, // true - admin, false - normal user
        default: 0,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    salt: String,
    // to generate password/encrypt password
},{timestamps:true})

// virtual field
userSchema.virtual('password')
.set(
    function(password){
        this._password = password
        this.salt = uuidv1()
        this.hashed_password= this.encryptPassword(password)
    }
)
.get(
    function(){
        return this._password
    }
)
// methods
userSchema.methods = {
    encryptPassword:function(password){
        if(password==""){return "";}
        try{
            return crypto.createHmac('sha1',this.salt)
            .update(password)
            .digest('hex')
        }
        catch(error){
            return "";
        }
    },
    authenticate: function(password){
        return this.hashed_password === this.encryptPassword(password)
    }
}

module.exports = mongoose.model('User',userSchema)