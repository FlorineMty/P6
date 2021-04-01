const passwordSchema = require('../models/password');


module.exports = (req,res,next) => {
    console.log("we are inside the validate password method")
    if(passwordSchema !== req.body.password) {
            console.log("Your password must contain at least 8 caracters, upper and lower letters and no space")
            return res.send("verfiy password and password didn't match");
    }
    next()
}