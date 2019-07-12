var commonFunction = require('../common/commonFunction');
var commonConstants = require('../common/commonConstants');
var collectionConstants = require('../common/collectionConstants');
var commonMessage = require('../common/commonMessage');
const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const { validationResult } = require('express-validator/check');

exports.login = async (req, res) => {
    // try {
    //     jwt.verify(req.token, 'secretkey', (err, authData) => {
    //         if (err) {
    //             res.sendStatus(403)
    //         } else {
    //             res.send(authData)
    //         }
    //     })
    //     var token = req.body.authToken;
    //     var result = null;
    //     return res.send(result);
    // } catch (error) {
    //     console.log('error', error);
    //     return res.send(commonFunction.failureOutput(commonConstants.STATUS.STATUS_FAILURE, commonMessage.FAILURE));
    // }

    // jwt.verify(req.token, 'secretkey', (err, authData) => {
    //     if (err) {
    //         console.log(err)
    //         res.sendStatus(403)
    //     } else {
    //         res.send(authData)
    //     }
    // })

}

//format token
//authorization: Bearer <access_token>
exports.verifyToken = (req, res, next) => {
    //get auth header value
    const bearerHeader = req.headers['authorization'];
    //check if bearer is undefined
    if (typeof bearerHeader !== 'undefined') {
        //split the space
        const bearer = bearerHeader.split(' ');
        //get token from the array
        const bearerToken = bearer[1];
        //set the token
        req.token = bearerToken;
        //next middleware
        next();
    } else {
        //forbidden
        res.sendStatus(403)
    }

}

exports.facebookOAuth = (req, res, next) => {
    if (commonFunction.isEmptyObject(req) || commonFunction.isEmptyObject(req.user)) {
        res.send(commonFunction.failureOutput(commonConstants.STATUS.STATUS_ROLE_ERROR, commonMessage.INCORRECT_ROLE));
    }
    var userObj = Object.assign({}, req.user);
    jwt.sign({ user: userObj }, 'secretkey', { expiresIn: '2h' }, (err, token) => {
        if (err) throw err;
        userObj._doc.token = token;
        res.send(commonFunction.successOutputObject(userObj._doc));
    });
}
//longlvq login fake
exports.loginNotVeryfacebook = (req, res) => {
    console.log("longlvq")
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.send(commonFunction.failureOutput(commonConstants.STATUS.STATUS_FAILURE, errors.array()))
        }
        else {
            var condition = req.body
            console.log(condition)
            condition.deleteFlag = { '$ne': 1 }
            User.findOne(condition, (err, data) => {
                return res.send(commonFunction.successOutputObject(data));
            })
        }
    } catch (error) {
        return res.send(commonFunction.failureOutput(commonConstants.STATUS.STATUS_FAILURE, error))
    }

}