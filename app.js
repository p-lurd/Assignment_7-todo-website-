const express = require('express');
const mongoose = require('mongoose');
const ejs = require('ejs')
// const bodyParser = require('body-parser')
const path = require('path')
const userController = require('./users/user.controller');
const userMiddlewares = require('./users/user.middleware');
const globalMiddlewares = require('./middlewares/global.middlewares');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const PORT = process.env.PORT
const db = require('./db');
const { getTasks, postTask, changeStatus } = require('./controller');





db.connect();

app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); 
app.use(express.static(path.join(__dirname, 'public')))





app.set('view engine', 'ejs');
app.set('views' , __dirname + '/views');



 

app.get("/", (req, res)=>{
    // res.status(200).json({message: 'success', status: true})
    res.render('index', { user: res.locals.user || null });
});
app.get('/signup', (req, res, next)=>{
    const error = req.query.error;
    const UserError = error ? new Error(decodeURIComponent(error)) : null;
    res.locals.UserError = UserError;
    res.render('signup', {UserError})
});
 

app.get('/login', (req, res, next) => {
    const error = req.query.error;
    const invalidCredentials = error ? new Error(decodeURIComponent(error)) : null;
    res.locals.invalidCredentials = invalidCredentials;
    res.render('login', { invalidCredentials });
  });
  

app.post("/user/signup", userMiddlewares.validateUserCreation, userController.createUser);

app.post("/user/login", userMiddlewares.loginValidation, userController.login);

// ----------------to authenticate user-----------------
app.use(globalMiddlewares.bearerTokenAuth);

// ---------------to view tasks--------------
app.get('/tasks/get', getTasks)

// ---------------to post tasks--------------
app.get('/tasks/post', (req, res)=>{
    res.render('postTask', {user_id: req.cookies.user_id})
});
app.post('/tasks/post', postTask)

// -----------to change status-------------
app.post('/tasks/status', changeStatus)




app.get('/logout', (req, res) => {    
    res.clearCookie('token')
    res.redirect('/')
});





app.use((error, req, res, next) => {
    if (error.status == 404) return res.status(404).sendFile(notFound);
    res.status(error.status ?? 500)
    res.send(error.message)
  })

 //-------------- when I navigate to “{random}.html” it should return with a 404 page-----------------
 app.get("*", (req, res) => {
    res.status(404);
    res.render('notFound')
  });


app.listen(PORT, ()=>{
    console.log (`server started at PORT: ${PORT}`)
});

module.exports = app;