const jwt = require("jsonwebtoken")

const tokenChecker = (req,res,next) => {
    try {
        const user = jwt.verify(req.body.token,process.env.JWT_SECRET);
        if (!user) {
            throw new Error("User not found");
        }
        req.body.user = user
        next();
    }
    catch (error) {
         res.send({status:"error",data:error});
    }
}

module.exports = {tokenChecker}