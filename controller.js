const mongoose = require('mongoose');
const joi = require('joi');
const TaskModel = require('./models/task')




// -----------------to get list of tasks-------------------
const getTasks = async (req, res, next)=>{
    try {
        const user = req.user
      const tasksList = await TaskModel.find({ user_id: user._id});
  
      if(!tasksList){
        const noTaskError = new Error ("No Item Found");
        noTaskError.status = 404;
        throw noTaskError;
      }
      res.status(200)
      res.render('dashboard', {user: user, tasksList: tasksList})
    } catch (error) {
      next(error)
    }
  }



  // -----------------to post a task-------------------
const postTask = async(req, res, next) => {
    try {
        // const userId = req.user[_id];

        const schema = joi.object({
            to_do: joi.string().required(),
            status: joi.string(),
            user_id: joi.string().required()
        })
        const valid = await schema.validate(req.body, { abortEarly: true })
            if (valid.error){
                const loginError = new Error (valid.error.message);
                loginError.status = 422;
                throw loginError;
            }
        const bodyOfRequest = req.body;
        
        const task = await TaskModel.create({
          to_do: bodyOfRequest.to_do,
          status: bodyOfRequest.status,
          user_id: bodyOfRequest.user_id
        });
    
        res.status(201)
        res.redirect("/tasks/get");
      } catch (error) {
        next(error)
      }
}

// -------------------to change status---------
const changeStatus = async (req, res, next) => {
    try {
        const bodyOfRequest = req.body;
    const schema = joi.object({
        _id: joi.string().required(),
        status: joi.string().required()
    })
    const valid = await schema.validate(req.body, {abortEarly: true})
    if (valid.error){
        const loginError = new Error (valid.error.message);
        loginError.status = 422;
        throw loginError;
    }
    const updateStatus = await TaskModel.updateOne({_id: bodyOfRequest._id}, {$set: {status: bodyOfRequest.status}});
    res.status(201)
    res.redirect("/tasks/get")
        
    } catch (error) {
        next(error);
    }
    
}



  module.exports = {
    getTasks,
    postTask,
    changeStatus
  }