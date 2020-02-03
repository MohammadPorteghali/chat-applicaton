const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const saltRounds = 10;


const UserSchema = new Schema({
    first_name: String,
    last_name: String,
    email: String,
    phone_number: Number,
    password: String
}, {timestamps: true});


// hash user password before saving into database
UserSchema.pre('save', function(next){
    this.password = bcrypt.hashSync(this.password, saltRounds);
    next();
});


module.exports = mongoose.model('User', UserSchema );
