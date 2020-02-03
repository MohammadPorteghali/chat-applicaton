const UserModel = require('../Models/userModel');

// sign up controller
module.exports.signUp = function (
    first_name,
    last_name,
    email,
    phone_number,
    password) {

    const signUpData = new UserModel({
        first_name: first_name,
        last_name: last_name,
        email: email,
        phone_number: phone_number,
        password: password,
    });

    return new Promise((resolve, reject) => {
        signUpData.save((err,data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        })
    })

};

// sign in controller

module.exports.signIn = function (email, password) {
    return new Promise((resolve, reject) => {
        UserModel.findOne({email: email},
            (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            })
    })
};

// log out controller

// TODO

// get list of users
module.exports.listUsers = (id) => {

    return new Promise((resolve, reject) => {
        UserModel.find( {_id : { $ne: id } },
            (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            })
    })

};
