const jwt = require('jsonwebtoken');
module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        req.userData = decoded;
        console.log(decoded);
        console.log(token);
        next();
    } catch (error) {
        
        res.status(401).json({
            err : error,
            message:"connection timed out login again"
        });
        return res;
    }
};