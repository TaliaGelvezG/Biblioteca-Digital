const mongoose = require("mongoose");
const Schema = mongoose.Schema
const bcrypt = require("bcrypt");

const userSchema = new Schema({
    name:String,
    documentNumber:{
        type:String,
        unique:true, 
        required:true
    },
    documentType:String,
    email:{
        type:String,
        unique:true, 
        required:true
    },
    password:String,
    rol:{
        type:String,
        enum:['admin', 'user', 'librarian'],
        required:true
    }
},
{
    toJSON: {
        transform: function (doc, ret) {
            ret.id = ret._id;
            delete ret._id; 
            delete ret.__v;
            delete ret.password;
        }
    }
});

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema);