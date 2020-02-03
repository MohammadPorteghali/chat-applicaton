const express = require('express');
const router = express.Router();
const MessageController = require('../Controllers/MesaageController');
const jwtMiddleware = require('../middleware/jwt.middleware');

// sending message route
router.post('/text_message_sending', jwtMiddleware.verify, (request, response) => {
        MessageController.text_message_sending(
            request.tokenDataId,
            request.body.text_message,
            request.body.client_id
        ).then((data) => {
                response.json({status: true, data: data})
            },(err)=> { response.json({status: false, msg: err})}
        )
    });

// receiving message route
router.post('/text_message_receiving', jwtMiddleware.verify, (request, response) => {
    console.log(request.body.client_id);
    MessageController.text_message_receiving(
        request.tokenDataId,
        request.body.client_id,
        // request.query.page
    ).then((data) => {
            response.json({status: true, data: data})
        },(err)=> { response.json({status: false, msg: err})}
    )
});

// unseen messages counter route
router.get('/unseen_counter', jwtMiddleware.verify, (request, response) => {
    MessageController.unseen_counter(
        request.tokenDataId
    ).then((data) => {
            response.json({status: true, data: data})
        },(err)=> { response.json({status: false, msg: err})}
    )
});

module.exports = router;
