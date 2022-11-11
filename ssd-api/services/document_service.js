const Document = require('../schemas/document_schema');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs');
const config = require('../config.json');


const gelAllDocuments = async () => {
    return Document.find({})
}

const validateToken = async (req, res, next) => {
    var token = req.headers['x-access-token'];
    console.log(token);

    let result = false;

    if (token) {
        jwt.verify(token, config.secret, function (err, decoded) {
            if (err) {
                let errordata = {
                    message: err.message,
                    // expiredAt: err.expiredAt
                };
                console.log(errordata);
                res.status(401).json({
                    message: 'Unauthorized Access'
                });
                return false;

            }
            req.decoded = decoded;
            result = decoded;
            console.log(decoded);
           
        });
        return  result;
    } else {
        res.status(403).json({
            message: 'Forbidden Access'
        });
        return false;
    }
}


exports.gelAllDocuments = gelAllDocuments;
exports.validateToken = validateToken;
