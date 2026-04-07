import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
   name:{
       type:String,
       required: [true, "Please enter a name"],
       trim: true,
       minLength:2,
       maxLength: 50,
   },
    email:{
        type: String,
        unique: true,
        required: [true, "Please enter a valid email"],
        trim: true,
        lowercase: true,
        match: [/\S+@\S+\.\S+/, "Please enter a valid email"]

    },
    password: {
        type: String,
        required: [true, "Please enter a valid password"],
        minLength: 6,

    },
    isVerified: {
       type: Boolean,
       default: false,
    },
    verificationToken: {
       type: String,
       default: null,
    },
    verificationTokenExpiresAt: {
       type: Date,
       default: null,
    },
    resetPasswordToken: {
       type: String,
       default: null,
    },
    resetPasswordExpiresAt: {
       type: Date,
       default: null,
    }
}, {timestamps: true});

const User = mongoose.model('User', userSchema);

export default User;
