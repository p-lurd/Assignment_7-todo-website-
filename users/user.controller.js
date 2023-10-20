const UserModel = require('../models/user');
const TaskModel = require('../models/task');
const userMiddleware = require('./user.middleware');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken')


const createUser = async (req, res, next)=>{
    try {

        const {name, username, password} = req.body
        const existedusername = await UserModel.findOne({username});
        if (existedusername){
            const duplicateUserError = new Error("User already exists");
            duplicateUserError.status = 409;
            // throw duplicateUserError;
            const errorParam = encodeURIComponent(duplicateUserError.message); // Encode the error message
            return res.redirect(`/signup?error=${errorParam}`);
        }
        const user = await UserModel.create({
            name,
            username,
            password
        })

        const token = await jwt.sign({ username: user.username, id: user.id}, process.env.JWT_SECRET)
        res.status(201);
        // res.json({
        //  message: 'User created successfully',
        //     user,
        //     token
        //  })
         return res.redirect('/login')
    } catch (error) {
        next(error);
    }
}




// to login 
const login = async (req, res, next) => {
    try {
      const bodyOfRequest = req.body;
      const user = await UserModel.findOne({
        username: bodyOfRequest.username
      });
      if (!user){
        const userNotFound = new Error ("User not found, check username or signup");
        userNotFound.status = 404;
        // throw userNotFound;
        const errorParam = encodeURIComponent(userNotFound.message); // Encode the error message
        return res.redirect(`/login?error=${errorParam}`);
      }
  
      const validPassword = await user.isValidPassword(bodyOfRequest.password);

      if (!validPassword) {
        const invalidCredentials = new Error("username or password is wrong");
        invalidCredentials.status = 422;
        const errorParam = encodeURIComponent(invalidCredentials.message); // Encode the error message
        return res.redirect(`/login?error=${errorParam}`);
      }
      
  
      const token = await jwt.sign({ username: user.username, id: user.id}, 
        process.env.JWT_SECRET, 
        { expiresIn: '36h' });
      // console.log(user.id);
      // return {
      //   message: 'Login successful',
      //   code: 200,
      //   data: {
      //       user,
      //       token
      //   }
      res.cookie('user_id', user.id);

      res.cookie('token', token); // Store the token in a cookie for subsequent requests
      res.redirect('/tasks/get');
      
    } catch (error) {
      next(error)
    }
  }




module.exports = {
    createUser,
    login
}