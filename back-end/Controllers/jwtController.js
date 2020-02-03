const jwt = require('jsonwebtoken');
const config = require('../config/config');



module.exports.sing = function (data) {
    return new Promise((resolve, reject) => {
        jwt.sign(data,  config.jwtSecret , { expiresIn: config.jwtExpiresIn }, function(err, token) {
            if(err){
                /// Todo: err res
                reject(err)
            } else {
                resolve(token)
            }

        });
    })
}


module.exports.verify = function (req, res, next) {
    if(req.cookies['Auth']){
        jwt.verify(req.cookies['Auth'], config.jwtSecret, function(err, decoded) {
            if(err){
                /// Todo: err res
            } else {
                next()
            }
            // console.log(decoded) // bar
        });
    } else {
        /// Todo: err res
    }

}
