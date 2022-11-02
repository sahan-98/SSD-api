const {validationResult} = require('express-validator');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { uuid } = require('uuidv4');

const HttpError = require('../models/http-error');
const User = require('../schemas/user_schema');
// const { selectFields } = require('express-validator/src/select-fields');


const saveUser = async (req, res, next) => {
    console.log('add user');
    const errors = validationResult(req);
    if (!errors.isEmpty()){
        console.log(errors);
        return next(new HttpError('Invalid inputs! Please check again.',422));
    }

    const { email,firstName,lastName,password,role } = req.body;

    let existingUser;
    try{
      existingUser = await User.findOne({ email: email});
    } catch(err) {
      const error = new HttpError(
        'Something went wrong, could not sign up.',
        500
      );
      return next(error);
    }

    if(existingUser) {
        const error = new HttpError(
          'User already exists, please sign in.',
          422
        );
        return next(error);
      }
      
    const hashedPassword = await bcrypt.hash(password,10);
    console.log(hashedPassword);

    const newUser = new User({
        userid: uuid(),
        firstName,
        lastName,
        email,
        password: hashedPassword,
        role
    });

    try{
        const session = await mongoose.startSession();
        session.startTransaction();
        await newUser.save({ session: session });
        await session.commitTransaction();
    } catch (err){
        const error = new HttpError(
            'Error occured while saving details. Please try again',
            500
        );
        return next(error);
    }

    res.status(201).json({ User: saveUser });


}

exports.saveUser = saveUser;
