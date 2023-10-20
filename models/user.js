const mongoose = require('mongoose');
const shortid = require('shortid');
const bcrypt = require('bcrypt');


const Schema = mongoose.Schema;

const User = new Schema ({
    _id: {
        type: String,
        default: shortid.generate
    },
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: { type: String, required: true},
    // repeat_password: { type: String, required: true},
    created_at: { type: Date, default: new Date() }
})




// before save
User.pre('save', async function (next) {
        const user = this;
        const hash = await bcrypt.hash(this.password, 10);
        this.password = hash;
})



User.methods.isValidPassword = async function(password){
    const user = this;
    const compare = await bcrypt.compare(password, user.password);

    return compare
}



const UserModel = mongoose.model('users', User);


module.exports = UserModel