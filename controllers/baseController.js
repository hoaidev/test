var commonFunction = require('../common/commonFunction');
var commonConstants = require('../common/commonConstants');
var commonMessage = require('../common/commonMessage');
var collectionConstants = require('../common/collectionConstants');
const mongoose = require('mongoose');
const ObjectId = require('mongoose').Types.ObjectId;
require('../models/stadiumModel')
var { check, validationResult } = require('express-validator/check');

exports.getById = async (id, input, collection) => {
    console.log('baseController.getById');
    if (!(commonFunction.isNotBlank(id))) {
        return null;
    }
    input[commonConstants.QUERY_KEYWORD.OBJECT_ID] = new ObjectId(id);
    input[commonConstants.QUERY_KEYWORD.DELETE_FLAG] = { '$ne': 1 };
    var result = await exports.searchOne(input, collection);
    return commonFunction.successOutputObject(result);
}

exports.searchOne = async (input, collection) => {
    console.log('baseController.searchOne');
    var projection = input[commonConstants.QUERY_KEYWORD.PROJECTION];
    removeKeywordField(input);
    var currentObject = null;
    if (commonFunction.isNotNull(projection)) {
        currentObject = await mongoose.model(collection).findOne(input, projection);
    } else {
        currentObject = await mongoose.model(collection).findOne(input);
    }
    if (currentObject !== null) {
        currentObject[commonConstants.QUERY_KEYWORD.ID] = currentObject[commonConstants.QUERY_KEYWORD.OBJECT_ID];
    }
    return currentObject
}

exports.limitDisplayedStadiumField = (input) => {
    console.log('baseController.LimitDisplayedStadiumField');
    var projection = {};
    projection[collectionConstants.STADIUM.INSERT_TIME] = 0;
    projection[collectionConstants.STADIUM.UPDATE_TIME] = 0;
    projection[collectionConstants.STADIUM.DELETE_TIME] = 0;
    projection[collectionConstants.STADIUM.UPDATE_FLAG] = 0;
    projection[collectionConstants.STADIUM.DELETE_FLAG] = 0;
    input[commonConstants.QUERY_KEYWORD.PROJECTION] = projection
}

// exports.limitDisplayedStadiumTypeField = (input) => {
//     console.log('baseController.LimitDisplayedStadiumField');
//     var projection = {};
//     projection[collectionConstants.STADIUM.STADIUM_CHILD_TYPE] = 1;
//     input[commonConstants.QUERY_KEYWORD.PROJECTION] = projection
// }

exports.updateById = async (id, update, collection) => {
    console.log('baseController.updateById');
    var query = {};
    query[commonConstants.QUERY_KEYWORD.OBJECT_ID] = new ObjectId(id);
    query[commonConstants.QUERY_KEYWORD.DELETE_FLAG] = { '$ne': 1 };
    console.log('query: ', query);
    console.log('update: ', update);
    if (commonFunction.isEmptyObject(update)) {
        return commonFunction.failureOutput(commonConstants.STATUS.STATUS_FAILURE, commonMessage.NO_PARAM_TO_UPDATE);
    }
    update[commonConstants.QUERY_KEYWORD.UPDATE_TIME] = commonFunction.getCurrTimestampInSecNum();
    var result = await mongoose.model(collection).findOneAndUpdate(query, update, { new: true }, (err, doc) => {
        if (err) {
            console.log('error', err)
            return commonFunction.failureOutput(commonConstants.STATUS.STATUS_FAILURE, commonMessage.UPDATE_FAILURE);
        }
    })
    return commonFunction.successOutputObject(result);
}

exports.fullTextSearch = (input, name) => {
    console.log('baseRepository.FullTextSearch')
    if (commonFunction.isNotBlank(name)) {
        var convertName = name.split(' ').map((val) => { return '\'' + val + '\'' })
        input[commonConstants.QUERY_KEYWORD.TEXT] = { '$search': convertName.join(' ') }
    }
}

exports.validate = (req) => {
    console.log('baseController.validate')
    var errors = validationResult(req).array({ onlyFirstError: true });
    if (errors.length > 0) {
        return commonFunction.failureOutput(commonConstants.STATUS.STATUS_PARAM_ERROR, errors.map(i => `${i.param} ${i.msg}`)[0]);
    }
}

removeKeywordField = (searchQuery) => {
    removeKeywordField(searchQuery, true)
}
removeKeywordField = (searchQuery, keepIdFlg) => {
    console.log('baseController.removeKeywordField')
    delete searchQuery[commonConstants.QUERY_KEYWORD.PAGE]
    delete searchQuery[commonConstants.QUERY_KEYWORD.SIZE]
    delete searchQuery[commonConstants.QUERY_KEYWORD.SORT_FIELD]
    delete searchQuery[commonConstants.QUERY_KEYWORD.SORT_TYPE]
    delete searchQuery[commonConstants.QUERY_KEYWORD.SORT_MULTI]
    delete searchQuery[commonConstants.QUERY_KEYWORD.PROJECTION]

    var id = searchQuery.id
    if (commonFunction.isNotNull(id) && keepIdFlg === true) {
        searchQuery[commonConstants.QUERY_KEYWORD.OBJECT_ID] = new ObjectId(id)
        delete searchQuery[commonConstants.QUERY_KEYWORD.ID]
    }
}