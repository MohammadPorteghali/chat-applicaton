const express = require('express');
const router = express.Router();
const UserController = require('../Controllers/UserController');
const jwtController = require('../Controllers/jwtController');
const jwtMiddleware = require('../middleware/jwt.middleware');
const jwt = require('jsonwebtoken');

const config = require('../config/config');
const bcrypt = require('bcrypt');
const {check, validationResult} = require('express-validator');

//Sign_Up
router.post('/sign_up',
    [
        check('*', 'empty field').not().isEmpty(),
        check('email', 'wrong email format !').isEmail(),
        // check('phone_number', 'wrong phone_number format !').isNumeric(),
        check('password', 'password length is too short !').isLength({min: 3}),
    ]
    , function (request, response) {
        const errors = validationResult(request)
        if (!errors.isEmpty()) {
            // return response.status(422).json({ errors: errors.array() })
            return response.status(422).json({status: false, error: errors.array()[0].msg})
        }

        UserController.signUp(
            request.body.first_name,
            request.body.last_name,
            request.body.email,
            request.body.phone_number,
            request.body.password)
            .then((data) => {
                    response.json({status: true, data: data})
                }
                ,(err)=> { response.json({status: false, msg: err})})
    });

//Sign_In
router.post('/sign_in',
    [
        check('*', 'empty field').not().isEmpty(),
        check('email', 'wrong email format !').isEmail(),
        // check('phone_number', 'wrong phone_number format !').isNumeric(),
        check('password', 'password length is too short !').isLength({min: 3}),
    ]
    ,function (request, response) {
        const errors = validationResult(request)
        if (!errors.isEmpty()) {
            // return response.status(422).json({ errors: errors.array() })
            return response.status(422).json({status: false, error: errors.array()[0].msg})
        }

    UserController.signIn(request.body.email, request.body.password).then((data) => {
        if (bcrypt.compareSync(request.body.password, data.password)) {
            //the last one:{} => for ever? {expiresIn: '365d' // expires in 365 days}

            let dataJwt = {
                rand1: randChar(6),
                email: request.body.email,
                rand2: randChar(6),
                id: data._id,
                rand3: randChar(6)
            };
            let userData = {
                first_name: data.first_name,
                last_name: data.last_name,
                id: data._id
            };
            jwtController.sing(dataJwt).then((token)=>{
                // console.log(token)
                response.json({status: true, message: "user found!!!",token: token, user :userData});
            },(err)=>{
                response.json({status: false, message:err});
            })
        }
    })
});

// log out
//TODO

//get list of users
router.get('/list_users' ,jwtMiddleware.verify , function (request, response) {
    // console.log();
    UserController.listUsers(request.tokenDataId).then((data) => {
        response.json({status: true, users:data})
    }, (err) => {
        console.log(err);
        //Todo: err
    })

});

module.exports = router;

function randChar(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
