const mongoose = require('mongoose');
const shortid = require('shortid');


const Schema = mongoose.Schema;

const Task = new Schema ({
    _id: {
        type: String,
        default: shortid.generate
    },
    to_do: {
        type: String,
        required: true
    },
    status: {
        type: String, 
        required: true,
        enum: ['pending', 'completed', 'deleted'],
        default: 'pending'
    },
    user_id: { type: String, required: true, ref: "users"},
    // repeat_password: { type: String, required: true},
    created_at: { type: Date, default: new Date() }
})




const TaskModel = mongoose.model('tasks', Task);
module.exports = TaskModel