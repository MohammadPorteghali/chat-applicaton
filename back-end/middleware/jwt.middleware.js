const jwt = require('jsonwebtoken');
const config = require('../config/config');


module.exports.verify = function (request, response, next) {
    if(request.headers['authorization']){
        const token = request.headers['authorization'].split(" ");
        // console.log(token[1]);
        jwt.verify(token[1], config.jwtSecret, function(err, decoded) {
            if(err){
                //Todo: exp or hack

                response.json({status: false, message:'permission denied'});
            }else{
                console.log("decoded.id: ",decoded.id); // bar
                request.tokenDataId = decoded.id;
                next()
            }

        });
    } else{
        response.json({status: false, message:'not found auth'});
    }
    // console.log(request.headers['authorization']);

    /* j*/
};