const MessageModel = require('../Models/messageModel');

// text message sending controller
module.exports.text_message_sending = function (
    owner_id,
    text_message,
    client_id) {
    const textMessageData = new MessageModel({
        owner_id: owner_id,
        text_message: text_message,
        client_id: client_id,
    });


    return new Promise((resolve, reject) => {
        textMessageData.save((err,data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        })
    })

};

// text message receiving controller
module.exports.text_message_receiving = function (
    owner_id,
    client_id,
    page) {
    // console.log(owner_id);
    // console.log(client_id);
    return new Promise((resolve, reject) => {
        MessageModel.find().or([{owner_id: owner_id, client_id: client_id}, {owner_id: client_id, client_id: owner_id}]).sort({createdAt: -1})
            // .skip((page - 1) * 10).limit(10)
            .exec(async function (err, data) {
                if (err) {
                    console.log(err);
                    reject(err);
                } else if (data.length === 0) {
                    console.log("No record found");
                    resolve([]);
                } else {
                    await MessageModel.update({owner_id: client_id, client_id: owner_id, seen: false},{seen: true},{ multi: true });
                    resolve(data);
                }
            });
    })
};

// unseen messages counter
module.exports.unseen_counter = function (
    owner_id) {
    return new Promise((resolve, reject) => {

        //Todo: aggregate not optimize!!!
        MessageModel.aggregate([
            {$match: {seen: false, client_id : owner_id} },
            {$group: { _id: "$owner_id", count:{ $sum: 1}}},
        ]).exec( async function (err, data) {
                if (err) {
                    reject(err);
                }else {
                        console.log(data);
                    resolve(data);
                }
            }
        )
    })
};
