const { validationResult } = require('express-validator');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { uuid } = require('uuidv4');
const fs = require("fs");

const HttpError = require('../models/http-error');
const Document = require('../schemas/document_schema');
const DocumentService = require('../services/document_service');
const Role = require('../_helpers/role');
var path = require('path');
var CryptoJS = require("crypto-js");
const { SECRET } = require('../varibale');



const saveDocument = async (req, res, next) => {
    const validate = await DocumentService.validateToken(req, res, next);




    console.log("validate>>>", validate)

    if (validate && validate.role === "Manager") {

        // Decrypt
        var bytes = CryptoJS.AES.decrypt(req.body.data, SECRET);
        req.body = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

        console.log("backend decrypt>>>", req.body);

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log(errors);
            return next(new HttpError('Invalid inputs! Please check again.', 422));
        }


        const docName = await this.DocumentProcess(req.body);

        console.log("docname>>>", docName)

        const { username, role, userid, document } = req.body


        const newDocument = new Document({
            userid,
            username,
            role,
            document

        });

        try {
            const session = await mongoose.startSession();
            session.startTransaction();
            await newDocument.save({ session: session });
            await session.commitTransaction();
        } catch (err) {
            const error = new HttpError(
                'Error occured while saving details. Please try again',
                500
            );
            return next(error);
        }

        res.status(201).json({ newDocument });
    } else {
        res.status(500).json({
            message: "You don't have permissions"
        });
    }




}

module.exports.downloadDocument = async (req, res, next) => {
    const filePath = process.cwd() + "/public/uploads/documents/" + req.params.filename;

    const validate = await DocumentService.validateToken(req, res, next);

    if (validate &&(validate.role === "Manager" || validate.role === "Worker")) {

        res.download(
            filePath,
            "File.pdf", // Remember to include file extension
            (err) => {
                if (err) {
                    res.send({
                        error: err,
                        msg: "Problem downloading the file"
                    })
                }
            });
    }else {
        res.status(500).json({
            message: "You don't have permissions"
        });
    }


}


const gelAllDocuments = async (req, res, next) => {


    const validate = await DocumentService.validateToken(req, res, next);

    if (validate &&(validate.role === "Manager" || validate.role === "Worker")) {
        DocumentService.gelAllDocuments()
            .then(documents => res.json({ data: documents }))
            .catch(err => next(err));
    }else {
        res.status(500).json({
            message: "You don't have permissions"
        });
    }


}



module.exports.DocumentProcess = async (req, res) => {

    try {

        let fileType = ""
        let base64 = ""

        if(req.fileType === "pdf"){

            fileType = req.document.substring(
                "data:application/".length,
                req.document.indexOf(";base64")
            );
            base64 = req.document.replace(/^data:application\/\w+;base64,/, "");

        }else if(req.fileType === "txt"){

            // fileType = req.document.substring(
            //     "data:text/".length,
            //     req.document.indexOf(";base64")
            // );
            fileType = "txt";
            base64 = req.document.replace(/^data:text\/\w+;base64,/, "");

        }


        
        const timestamp = new Date().getTime();
        // req.document = `${timestamp}.${fileType}`;
        req.document = `${req.fileName + "_" + timestamp}.${fileType}`;
        const fileName = `public/uploads/documents/${req.document}`;
        let upload_name = req.document;
        fs.writeFile(fileName, base64, "base64", function (err) {
            if (err) {
                console.log(err);
                // return err;
            }
            //return Promise.resolve({upload_name});
        });
        return upload_name;
    } catch (error) {
        return { message: error.message };
    }

};


exports.gelAllDocuments = gelAllDocuments;
exports.saveDocument = saveDocument;


