const { validationResult } = require('express-validator');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { uuid } = require('uuidv4');

const HttpError = require('../models/http-error');
const Message = require('../schemas/message_schema');
const MessageService = require('../services/message_service');
const DocumentService = require('../services/document_service');
const Role = require('../_helpers/role');
var CryptoJS = require("crypto-js");
const { SECRET } = require('../varibale');



const saveMessage = async (req, res, next) => {

    const validate = await DocumentService.validateToken(req, res, next);


    console.log("validate>>>", validate)


    if (validate &&(validate.role === "Manager" || validate.role === "Worker")) {

        // Decrypt
        var bytes = CryptoJS.AES.decrypt(req.body.data, SECRET);
        req.body = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

        console.log("backend decrypt>>>", req.body);

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log(errors);
            return next(new HttpError('Invalid inputs! Please check again.', 422));
        }

        const { username, role, userid, message } = req.body

        const newMessage = new Message({
            userid,
            username,
            role,
            message

        });

        try {
            const session = await mongoose.startSession();
            session.startTransaction();
            await newMessage.save({ session: session });
            await session.commitTransaction();
        } catch (err) {
            const error = new HttpError(
                'Error occured while saving details. Please try again',
                500
            );
            return next(error);
        }

        res.status(201).json({ newMessage });
    }else {
        res.status(500).json({
            message: "You don't have permissions"
        });
    }




}


const gelAllMessages = async (req, res, next) => {

    const validate = await DocumentService.validateToken(req, res, next);

    if (validate &&(validate.role === "Manager" || validate.role === "Worker")) {
        MessageService.gelAllMessages()
            .then(messages => res.json({ data: messages }))
            .catch(err => next(err));
    }else {
        res.status(500).json({
            message: "You don't have permissions"
        });
    }

}



exports.gelAllMessages = gelAllMessages;
exports.saveMessage = saveMessage;


