const joi = require('joi');





const validateUserCreation = async (req, res, next)=>{
    try {
        const schema = joi.object({
            name: joi.string().required(),
            username: joi.string().required(),
            password: joi.string().required(),
            repeat_password: joi.ref('password')
        })
        const valid = await schema.validate(req.body)
        console.log({validError: valid.error})

        if (valid.error){
            const inputValidationError = new Error (valid.error.message);
            inputValidationError.status = 422;
            // throw inputValidationError;
            const errorParam = encodeURIComponent(inputValidationError.message); // Encode the error message
            return res.redirect(`/signup?error=${errorParam}`);
        }else{
            
        }
        const {name, username, password} = req.body
        next();
    } catch (error) {
        next(error)
    }
}


const loginValidation = async (req, res, next) => {
    try {
            const schema = joi.object({
                username: joi.string().required(),
                password: joi.string().required()
            })
            
            const valid = await schema.validate(req.body, { abortEarly: true })
            if (valid.error){
                const loginError = new Error (valid.error.message);
                loginError.status = 422;
                // throw loginError;
                const errorParam = encodeURIComponent(loginError.message); // Encode the error message
                return res.redirect(`/login?error=${errorParam}`);
            }
        
            
        next();
        
    } catch (error) {
        next(error)
    }
    }









module.exports = {
    validateUserCreation,
    loginValidation
}