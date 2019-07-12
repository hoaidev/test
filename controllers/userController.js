var userModel = require('../models/userModel');
const ObjectId = require('mongoose').Types.ObjectId;
var commonFunction = require('../common/commonFunction')
var commonConstants = require('../common/commonConstants')
var commonMessage = require('../common/commonMessage');
const { check, validationResult } = require('express-validator/check');
var baseController = require('../controllers/baseController')
const bookUserModel = require('../models/bookUserModel');

var collectionConstants = require('../common/collectionConstants');
exports.getAll = (req, res) => {
    userModel.find((err, data) => {
        // if (err) return res.json(err);
        return res.json(data)
    });
}

exports.getById = (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.send(commonFunction.failureOutput(commonConstants.STATUS.STATUS_FAILURE, errors.array()))
        }
        obj.deleteFlag = { '$ne': 1 }
        userModel.findById(req.body.id, (err, data) => {
            return res.send(commonFunction.successOutputArray(data))
        })
    } catch (error) {
        return res.send(commonFunction.failureOutput(commonConstants.STATUS.STATUS_FAILURE, error))
    }
}
exports.updateAgent = (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.send(commonFunction.failureOutput(commonConstants.STATUS.STATUS_FAILURE, errors.array()))
        }
        console.log('req', req.body)
        condition = {}
        condition.deleteFlag = { '$ne': 1 }
        condition._id = new ObjectId(req.body.id)
        var updateObj = {}
        if (commonFunction.isNotBlank(req.body.name)) {
            updateObj.name = req.body.name
        }
        // updateObj.commonInfo = {}
        if (commonFunction.isNotBlank(req.body.email)) {
            updateObj[collectionConstants.USER.EMAIL] = req.body.email
        }
        if (commonFunction.isNotBlank(req.body.avatar)) {
            updateObj[collectionConstants.USER.AVATAR] = req.body.avatar
        }
        if (commonFunction.isNotBlank(req.body.tel)) {
            updateObj[collectionConstants.USER.COMMON_INFO_TEL] = req.body.tel
        }
        if (commonFunction.isNotBlank(req.body.skype)) {
            updateObj[collectionConstants.USER.SKYPE] = req.body.skype
        }
        if (commonFunction.isNotBlank(req.body.zalo)) {
            updateObj[collectionConstants.USER.ZALO] = req.body.zalo
        }
        console.log('updateObj: ', updateObj)
        delete updateObj.id
        userModel.findOneAndUpdate(condition, updateObj, { new: true }, (err, data) => {
            return res.send(commonFunction.successOutputArray(data))
        })

    } catch (error) {
        return res.send(commonFunction.failureOutput(commonConstants.STATUS.STATUS_FAILURE, error))
    }
}
exports.searchAllByName = async (req, res) => {
    var userName = req.body.name
    var input = {}
    baseController.fullTextSearch(input, userName)
    var userList = await userModel.find(input).lean().then(value => value)
    var bookUserList = await bookUserModel.find(input).lean().then(value => value)
    var sameUserList = userList.filter(t => bookUserList.some(b => b.originalId == t._id))
    var result = userList.filter(u => !sameUserList.some(b => b._id == u._id))
    result = bookUserList.concat(result)
    return res.send(commonFunction.successOutputArray(result))
}

exports.getAllUser = (req, res) => {
    userModel.find({}, { name: 1, avatar: 1, slug: 1 }, (err, doc) => {
        if (err) return res.send(commonFunction.failureOutput(commonConstants.STATUS.STATUS_FAILURE, commonMessage.FAILURE))
        return res.send(commonFunction.successOutputArray(doc))
    })
}


