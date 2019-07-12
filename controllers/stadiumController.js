var commonFunction = require('../common/commonFunction');
var commonConstants = require('../common/commonConstants');
var collectionConstants = require('../common/collectionConstants');
var commonMessage = require('../common/commonMessage');
var baseController = require('./baseController');
var mongoose = require('mongoose');
var ObjectId = require('mongoose').Types.ObjectId;
var stadiumModel = require('../models/stadiumModel');

exports.getById = async (req, res) => {
    try {
        var errorMsg = baseController.validate(req);
        if (commonFunction.isNotNull(errorMsg)) {
            return res.send(errorMsg);
        }
        var input = {};
        baseController.limitDisplayedStadiumField(input);
        var result = await baseController.getById(req.body.stadiumId, input, 'Stadium');
        return res.send(result);
    } catch (error) {
        console.log('error', error);
        return res.send(commonFunction.failureOutput(commonConstants.STATUS.STATUS_FAILURE, commonMessage.FAILURE));
    }
}

exports.updateById = async (req, res) => {
    try {
        var errorMsg = baseController.validate(req);
        if (commonFunction.isNotNull(errorMsg)) {
            return res.send(errorMsg);
        }
        var stadiumUpd = req.body;
        var update = {};
        if (commonFunction.isNotBlank(stadiumUpd.name)) {
            update[collectionConstants.STADIUM.NAME] = stadiumUpd.name;
        }
        if (commonFunction.isNotBlank(stadiumUpd.address)) {
            update[collectionConstants.STADIUM.ADDRESS] = stadiumUpd.address;
        }
        if (commonFunction.isNotNull(stadiumUpd.district)) {
            update[collectionConstants.STADIUM.DISTRICT] = Number(stadiumUpd.district);
        }
        if (commonFunction.isNotBlank(stadiumUpd.tel)) {
            update[collectionConstants.STADIUM.TEL] = stadiumUpd.tel;
        }
        if (commonFunction.isNotBlank(stadiumUpd.introduce)) {
            update[collectionConstants.STADIUM.INTRODUCE] = stadiumUpd.introduce;
        }
        if (commonFunction.isNotBlank(stadiumUpd.service)) {
            update[collectionConstants.STADIUM.SERVICE] = stadiumUpd.service;
        }
        if (commonFunction.isNotBlank(stadiumUpd.iframeUrl)) {
            update[collectionConstants.STADIUM.IFRAME_URL] = stadiumUpd.iframeUrl;
        }
        if (commonFunction.isNotNull(stadiumUpd.s5Number)) {
            update[collectionConstants.STADIUM.S5_NUMBER] = stadiumUpd.s5Number;
        }
        if (commonFunction.isNotNull(stadiumUpd.s5HighPrice)) {
            update[collectionConstants.STADIUM.S5_HIGH_PRICE] = stadiumUpd.s5HighPrice;
        }
        if (commonFunction.isNotNull(stadiumUpd.s5LowPrice)) {
            update[collectionConstants.STADIUM.S5_LOW_PRICE] = stadiumUpd.s5LowPrice;
        }
        if (commonFunction.isNotNull(stadiumUpd.s7Number)) {
            update[collectionConstants.STADIUM.S7_NUMBER] = stadiumUpd.s7Number;
        }
        if (commonFunction.isNotNull(stadiumUpd.s7HighPrice)) {
            update[collectionConstants.STADIUM.S7_HIGH_PRICE] = stadiumUpd.s7HighPrice;
        }
        if (commonFunction.isNotNull(stadiumUpd.s7LowPrice)) {
            update[collectionConstants.STADIUM.S7_LOW_PRICE] = stadiumUpd.s7LowPrice;
        }
        if (commonFunction.isNotBlank(stadiumUpd.name) || commonFunction.isNotBlank(stadiumUpd.address) || commonFunction.isNotBlank(stadiumUpd.slug)) {
            update[collectionConstants.STADIUM.UPDATE_FLAG] = 1;
        }
        console.log(update)
        var result = await baseController.updateById(stadiumUpd.stadiumId, update, 'Stadium');
        return res.send(result);
    } catch (error) {
        console.log('error', error);
        return res.send(commonFunction.failureOutput(commonConstants.STATUS.STATUS_FAILURE, commonMessage.FAILURE));
    }
}

exports.addImageById = async (req, res) => {
    try {
        var errorMsg = baseController.validate(req);
        if (commonFunction.isNotNull(errorMsg)) {
            return res.send(errorMsg);
        }
        var stadiumUpd = req.body;
        var update = {};
        if (commonFunction.isNotNull(stadiumUpd.imageUrl) && stadiumUpd.imageUrl.length > 0) {
            var imageListArr = [];
            stadiumUpd.imageUrl.forEach(element => {
                var image = {};
                image.imageUrl = element;
                image.imagePostDate = commonFunction.getCurrTimestampInSecStr();
                imageListArr.push(image);
            });
            var imageList = {};
            imageList[collectionConstants.STADIUM.IMAGE_LIST] = { '$each': imageListArr };
            update[commonConstants.QUERY_KEYWORD.ADD_TO_SET] = imageList;
        }
        var result = await baseController.updateById(stadiumUpd.stadiumId, update, 'Stadium');
        return res.send(result);
    } catch (error) {
        console.log('error', error);
        return res.send(commonFunction.failureOutput(commonConstants.STATUS.STATUS_FAILURE, commonMessage.FAILURE));
    }
}

exports.deleteImageById = async (req, res) => {
    try {
        var errorMsg = baseController.validate(req);
        if (commonFunction.isNotNull(errorMsg)) {
            return res.send(errorMsg);
        }
        var query = {}
        query[collectionConstants.STADIUM._ID] = new ObjectId(req.body.stadiumId);
        query[collectionConstants.STADIUM.DELETE_FLAG] = { '$ne': 1 };
        var elemMatch = {};
        elemMatch[collectionConstants.STADIUM.IMAGE_URL] = req.body.imageUrl;
        query[collectionConstants.STADIUM.IMAGE_LIST] = { '$elemMatch': elemMatch };

        var update = {};
        var imageList = {}
        imageList[collectionConstants.STADIUM.IMAGE_URL] = req.body.imageUrl;
        var pull = {}
        pull[collectionConstants.STADIUM.IMAGE_LIST] = imageList;
        update[commonConstants.QUERY_KEYWORD.PULL] = pull;
        update[commonConstants.QUERY_KEYWORD.UPDATE_TIME] = commonFunction.getCurrTimestampInSecNum();

        await mongoose.model('Stadium').updateMany(query, update, (err, doc) => {
            if (err) {
                console.log('error', err)
                return commonFunction.failureOutput(commonConstants.STATUS.STATUS_FAILURE, commonMessage.UPDATE_FAILURE);
            };
            if (doc.nModified === 0) {
                return res.send(commonFunction.failureOutput(commonConstants.STATUS.STATUS_FAILURE, commonMessage.MODIFIELD_COUNT_0));
            };
            return res.send(commonFunction.successOutputObject(null));
        })
    } catch (error) {
        console.log('error', error);
        return res.send(commonFunction.failureOutput(commonConstants.STATUS.STATUS_FAILURE, commonMessage.FAILURE));
    }
}

exports.getStadiumAgent = (req, res) => {
    if (commonFunction.isNotNull(req.body.agentUserId)) {
        mongoose.model('Stadium').find(
            {
                "agentUser.agentUserId": req.body.agentUserId,
                "deleteFlag": {
                    $ne: 1
                }
            }
            ,
            {
                _id: 1, name: 1, address: 1, district: 1, tel: 1, introduce: 1, service: 1, slug: 1, s5: 1, s7: 1, stadiumChild: 1, s5Price: 1, s7Price: 1, imageList: 1, agentUser: 1, slug: 1, iframeUrl: 1
            }, (err, data) => {
                if (err) {
                    return res.send(commonFunction.failureOutput(commonConstants.STATUS.STATUS_FAILURE, commonMessage.FAILURE));
                }
                if (!err) {
                    return res.send(commonFunction.successOutputArray(data));
                }
            })
    } else {
        return res.send(commonFunction.failureOutput(commonConstants.STATUS.STATUS_FAILURE, commonMessage.INCORRECT_PARAM));
    }
}

exports.insertChildStadium = async (req, res) => {
    if (commonFunction.isNotNull(req.body)) {

        mongoose.model('Stadium').update(
            {
                '_id': ObjectId(req.body.stadiumId)
            },
            {

                $push: { stadiumChild: { stadiumChildId: req.body.stadiumId + new Date().getTime(), stadiumChildName: req.body.stadiumChildName, stadiumChildType: req.body.stadiumChildType } }
            },
            async (err, data) => {
                if (err) {
                    return res.send(commonFunction.failureOutput(commonConstants.STATUS.STATUS_FAILURE, commonMessage.FAILURE));
                }
                if (!err) {

                    stadiumUpdate = await stadiumModel.distinct(
                        "stadiumChild",
                        { '_id': ObjectId(req.body.stadiumId) },
                    )
                    return res.send(commonFunction.successOutputArray(stadiumUpdate));
                }

            })
    } else {
        return res.send(commonFunction.failureOutput(commonConstants.STATUS.STATUS_FAILURE, commonMessage.INCORRECT_PARAM));
    }
}

exports.updateStadiumPrice = async (req, res) => {
    try {
        var updateStadium = {}
        updateStadium[commonConstants.STADIUM_PRICE[req.body.stadiumType]] = req.body.data
        var result = await stadiumModel.findByIdAndUpdate(req.body.stadiumId, updateStadium, { new: true }).lean().then(res => res)
        // console.log(result)
        return res.send(commonFunction.successOutputObject(result))
    } catch (error) {
        return res.send(commonFunction.failureOutput(commonConstants.STATUS.STATUS_FAILURE, error))
    }
}

exports.deleteChildStadium = (req, res) => {
    if (commonFunction.isNotNull(req.body)) {
        mongoose.model('Stadium').update(
            {
                '_id': ObjectId(req.body.stadiumId)
            },
            {

                $pull: { stadiumChild: { stadiumChildId: req.body.stadiumChildId } }

            },
            (err, data) => {
                if (err) {
                    return res.send(commonFunction.failureOutput(commonConstants.STATUS.STATUS_FAILURE, commonMessage.FAILURE));
                }
                if (!err) {
                    return res.send(commonFunction.successOutputArray(data));
                }

            })
    } else {
        return res.send(commonFunction.failureOutput(commonConstants.STATUS.STATUS_FAILURE, commonMessage.INCORRECT_PARAM));
    }
}

exports.updateChildStadium = (req, res) => {
    if (commonFunction.isNotNull(req.body) && commonFunction.isNotNull(req.body.stadiumId) && commonFunction.isNotNull(req.body.stadiumChildId)) {
        var update = {}
        if (commonFunction.isNotNull(req.body.stadiumChildName)) {
            update["stadiumChild.$.stadiumChildName"] = req.body.stadiumChildName;
        }
        if (commonFunction.isNotNull(req.body.stadiumChildType)) {
            update["stadiumChild.$.stadiumChildType"] = req.body.stadiumChildType;
        }
        mongoose.model('Stadium').update(
            {
                '_id': ObjectId(req.body.stadiumId),
                "stadiumChild.stadiumChildId": req.body.stadiumChildId
            },
            {
                $set: update
            },
            (err, data) => {
                if (err) {
                    return res.send(commonFunction.failureOutput(commonConstants.STATUS.STATUS_FAILURE, commonMessage.FAILURE));
                }
                if (!err) {
                    return res.send(commonFunction.successOutputArray(data));
                }

            })
    } else {
        return res.send(commonFunction.failureOutput(commonConstants.STATUS.STATUS_FAILURE, commonMessage.INCORRECT_PARAM));
    }
}

exports.getStadiumTypeListById = async (req, res) => {
    try {
        var errorMsg = baseController.validate(req);
        if (commonFunction.isNotNull(errorMsg)) {
            return res.send(errorMsg);
        }
        var query = {};
        query[commonConstants.QUERY_KEYWORD.OBJECT_ID] = new ObjectId(req.body.stadiumId);
        query[commonConstants.QUERY_KEYWORD.DELETE_FLAG] = { '$ne': 1 };
        var result = null;
        result = await stadiumModel.distinct(collectionConstants.STADIUM.STADIUM_CHILD_TYPE, query);
        if (result !== null) {
            result[commonConstants.QUERY_KEYWORD.ID] = result[commonConstants.QUERY_KEYWORD.OBJECT_ID];
        }
        return res.send(commonFunction.successOutputObject(result));
    } catch (error) {
        console.log('error', error);
        return res.send(commonFunction.failureOutput(commonConstants.STATUS.STATUS_FAILURE, commonMessage.FAILURE));
    }
}