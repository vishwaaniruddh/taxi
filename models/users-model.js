const mongoose = require("mongoose");
Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String
    },
    email: {
        type: String,
    },
    userId: String,
    mobileNo: {
        type: String,
        unique: true
    },
    password: { type: String },
    otp: {
        type: String
    },
    recommendCode: { type: String }
});

const userModel = mongoose.model('users', userSchema);
module.exports = userModel;