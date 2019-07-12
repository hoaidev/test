// Import Models here
var fairModel = require('../models/fairModel');
const bookUserModel = require('../models/bookUserModel');
const bookTeamModel = require('../models/bookTeamModel');
const teamModel = require('../models/teamModel');
const userModel = require('../models/userModel');
var stadiumModel = require('../models/stadiumModel');
var commonConstants = require('../common/commonConstants')
var commonFunction = require('../common/commonFunction')
var commonMessage = require('../common/commonMessage')
var collectionConstants = require('../common/collectionConstants')
var baseController = require('./baseController');
const ObjectId = require('mongoose').Types.ObjectId;
const { validationResult } = require('express-validator/check');
const moment = require('moment');

exports.searchPriceFair = (req, res) => {
    var searchRequest = req.body;
    var searchCondition;
    if (commonFunction.isNotNull(searchRequest.agentUserId)) {
        searchCondition = { "agentUser.agentUserId": searchRequest.agentUserId };
    } else {
        searchCondition = {};
    }
    if (commonFunction.isNotNull(searchRequest.fairStadiumId)) {
        searchCondition.fairStadiumId = searchRequest.fairStadiumId;
    }
    if (commonFunction.isNotNull(searchRequest.fairDays)) {
        searchCondition.fairDay = { '$in': searchRequest.fairDays };
    }
    if (commonFunction.isNotNull(searchRequest.fairStadiumType)) {
        searchCondition.fairStadiumType = searchRequest.fairStadiumType;
    }
    searchCondition.offFlag = { '$ne': 1 };
    var sort = { fairTime: 1 };
    fairModel.aggregate(
        [{ $match: searchCondition },
        {
            $group:
            {
                _id: { fairTime: "$fairTime", fairPrice: "$fairPrice", fairStadiumType: "$fairStadiumType" }, fairDays: { $addToSet: "$fairDay" }
            }
        },
        { $project: { fairTime: '$_id.fairTime', fairPrice: '$_id.fairPrice', fairDays: '$fairDays', fairStadiumType: '$_id.fairStadiumType', _id: 0 } },
        { $sort: sort },
        { $skip: commonFunction.isNotNull(searchRequest.page) ? (commonConstants.PAGING.FAIR_LIST * searchRequest.page) : 0 },
        { $limit: commonConstants.PAGING.FAIR_LIST }
        ], (err, data) => {
            if (err) return res.json(err);
            return res.send(commonFunction.successOutputArray(data))
        }
    );
}

exports.searchFair = (req, res) => {
    var searchRequest = req.body;
    var searchCondition;
    if (commonFunction.isNotNull(searchRequest.agentUserId)) {
        searchCondition = { "agentUser.agentUserId": searchRequest.agentUserId };
    } else {
        searchCondition = {};
    }
    if (commonFunction.isNotNull(searchRequest.fairStadiumId)) {
        searchCondition.fairStadiumId = searchRequest.fairStadiumId;
    }
    if (commonFunction.isNotNull(searchRequest.fairStadiumType)) {
        searchCondition.fairStadiumType = searchRequest.fairStadiumType;
    }
    if (commonFunction.isListNull(searchCondition.isSearchEmpty) && searchCondition.isSearchEmpty) {
        searchCondition.bookingUser = null
        searchCondition.bookDateTime = null;
        searchCondition.bookStatus = { $ne: 1 }
    }
    //  >= NOW
    searchCondition.$or = [
        // FAIRDATE > NOW
        { fairDate: { $gt: moment().format(commonConstants.DATE_TIME.YYYYMMDD).toString() } },
        // FAIRTIME >= NOW && FAIRdATE = NOW
        { $and: [{ fairDate: moment().format(commonConstants.DATE_TIME.YYYYMMDD).toString() }, { fairTime: { $gt: ((moment().hour() * 2) + (moment().minutes() >= 30 ? 2 : 1)) } }] }
    ]
    // DATEFROM != NULL and DATETO != NULL
    if (commonFunction.isNotNull(searchRequest.dateFrom) && commonFunction.isNotNull(searchRequest.dateTo)) {
        searchCondition.fairDate = { $gte: searchRequest.dateFrom, $lte: searchRequest.dateTo }
    }
    // DATEFROM != NULL and DATETO == NULL
    if (commonFunction.isNotNull(searchRequest.dateFrom) && !commonFunction.isNotNull(searchRequest.dateTo)) {
        searchCondition.fairDate = { $gte: searchRequest.dateFrom }
    }
    // DATEFROM == NULL and DATETO != NULL
    if (!commonFunction.isNotNull(searchRequest.dateFrom) && commonFunction.isNotNull(searchRequest.dateTo)) {
        searchCondition.fairDate = { $lt: searchRequest.dateTo }
    }
    // TIMEFROM != NULL and TIMETO != NULL
    if (commonFunction.isNotNull(searchRequest.timeFrom) && commonFunction.isNotNull(searchRequest.timeTo)) {
        if (searchRequest.timeFrom <= searchRequest.timeTo) {
            searchCondition.fairTime = { $gte: searchRequest.timeFrom, $lt: searchRequest.timeTo }
        } else {
            searchCondition.$or = [
                { fairTime: { $gte: searchRequest.timeFrom } }, { fairTime: { $lt: searchRequest.timeTo } }
            ]
        }

    }
    // TIMEFROM != NULL and TIMETO == NULL
    if (commonFunction.isNotNull(searchRequest.timeFrom) && !commonFunction.isNotNull(searchRequest.timeTo)) {
        searchCondition.fairTime = { $gte: searchRequest.timeFrom }
    }
    // TIMEFROM == NULL and TIMETO != NULL
    if (!commonFunction.isNotNull(searchRequest.timeFrom) && commonFunction.isNotNull(searchRequest.timeTo)) {
        searchCondition.fairTime = { $lt: searchRequest.timeTo }
    }

    var sort = { fairDate: 1, fairTime: 1 };
    searchCondition.offFlag = { $ne: 1 };
    fairModel.aggregate(
        [{ $match: searchCondition },
        {
            $group:
            {
                _id: { fairTime: "$fairTime", fairStadiumType: "$fairStadiumType", fairDate: "$fairDate" },
                fairCount: { $sum: 1 },
                lstId: { $addToSet: "$_id" }
            }
        },
        { $project: { fairTime: '$_id.fairTime', fairDate: '$_id.fairDate', fairStadiumType: '$_id.fairStadiumType', fairCount: '$fairCount', _id: 0, lstId: '$lstId' } },
        { $sort: sort },
        { $skip: commonFunction.isNotNull(searchRequest.page) ? (commonConstants.PAGING.FAIR_LIST * searchRequest.page) : 0 },
        { $limit: commonConstants.PAGING.FAIR_LIST }
        ], (err, data) => {
            if (err) return res.json(err);
            return res.send(commonFunction.successOutputArray(data))
        }
    );
}

exports.updateFair = (req, res) => {
    try {
        if (commonFunction.isNotNull(req.body.fairId) && (commonFunction.isNotNull(req.body.bookingTeam) || commonFunction.isNotNull(req.body.bookingUser))) {
            var fairId = { _id: new ObjectId(req.body.fairId) }
            var updateField = {};
            if (commonFunction.isNotNull(req.body.bookingTeam)) {
                updateField[collectionConstants.FAIR.BOOKING_TEAM] = req.body.bookingTeam
            }
            if (commonFunction.isNotNull(req.body.bookingUser)) {
                updateField[collectionConstants.FAIR.BOOKING_USER] = req.body.bookingUser
            }
            fairModel.updateOne(fairId, updateField, (err, doc) => {
                if (err) return res.send(commonFunction.failureOutput(commonConstants.STATUS.STATUS_FAILURE, commonMessage.err));
                return res.send(commonFunction.successOutputObject(doc))
            })
        } else {
            return res.send(commonFunction.failureOutput(commonConstants.STATUS.STATUS_FAILURE, commonMessage.LACK_PARAM));
        }

    } catch (error) {
        return res.send(commonFunction.failureOutput(commonConstants.STATUS.STATUS_FAILURE, commonMessage.FAILURE))
    }
}



exports.deleteFairbyId = (req, res) => {
    fairModel.deleteOne({ "_id": ObjectId(req.body.fairId) }, (err, data) => {
        if (err) {
            return res.json(err);
        } else {
            if (data.deletedCount == '0') {
                return res.send(commonFunction.failureOutput(commonConstants.STATUS.STATUS_DATA_NOT_EXIST, commonMessage.DELETE_NO_RECORD))
            } else {
                return res.send(commonFunction.successOutputObject(null))
            }
        }
    });
}

/**
 * @author Hoang Thi Huong Giang
 */
//begin
exports.bookById = async (req, res) => {
    console.log('request: ', req.body)
    try {
        var errorMsg = baseController.validate(req)
        // if (commonFunction.isNotNull(errorMsg)) {
        //     return res.send(errorMsg);
        // }
        var update = {}
        var bookingUser = {}
        var resultBookUser = {}
        if (commonFunction.isNotBlank(req.body.userId)) {
            var bookedUserCondition = {}
            bookedUserCondition[collectionConstants.BOOK_USER.ORIGINAL_ID] = req.body.userId
            var bookedUser = await bookUserModel.findOne(bookedUserCondition).lean().then(res => res)
            if (commonFunction.isEmptyObject(bookedUser)) {
                var manuUser = await userModel.findById(req.body.userId).lean().then(res => res)
                var newUser = new bookUserModel
                newUser[collectionConstants.BOOK_USER.ORIGINAL_ID] = manuUser._id
                newUser[collectionConstants.BOOK_USER.NAME] = manuUser[collectionConstants.USER.NAME]
                newUser[collectionConstants.BOOK_USER.AVATAR] = manuUser[collectionConstants.USER.AVATAR]
                newUser[collectionConstants.BOOK_USER.TEL] = commonFunction.isNotBlank(req.body.tel) ? req.body.tel : manuUser[collectionConstants.USER.COMMON_INFO_TEL]
                newUser[collectionConstants.BOOK_USER.STADIUM_BOOK].push(req.body.stadiumId),
                    newUser[collectionConstants.BOOK_USER.AGENT_SYSTEM] = 1
                newUser[collectionConstants.BOOK_USER.INSERT_TIME] = commonFunction.getCurrTimestampInSecNum()
                resultBookUser = await newUser.save().then(res => res ? res.toObject() : res)
            } else {
                var condition = {}
                condition[collectionConstants.BOOK_USER.ORIGINAL_ID] = bookedUser.originalId
                var addToSet = {}
                addToSet[collectionConstants.BOOK_USER.STADIUM_BOOK] = req.body.stadiumId
                var set = {}
                if (commonFunction.isNotBlank(req.body.tel)) {
                    set[collectionConstants.BOOK_USER.TEL] = req.body.tel
                }
                resultBookUser = await bookUserModel.findOneAndUpdate(condition, { $set: set, $addToSet: addToSet }, { new: true })
            }
        } else {
            if (commonFunction.isNotBlank(req.body.userName)) {
                var newUser = new bookUserModel
                newUser[collectionConstants.BOOK_USER.ORIGINAL_ID] = newUser._id
                newUser[collectionConstants.BOOK_USER.NAME] = req.body.userName
                if (commonFunction.isNotBlank(req.body.tel)) {
                    newUser[collectionConstants.BOOK_USER.TEL] = req.body.tel
                }
                newUser[collectionConstants.BOOK_USER.STADIUM_BOOK].push(req.body.stadiumId)
                newUser[collectionConstants.BOOK_USER.AGENT_SYSTEM] = 1
                newUser[collectionConstants.BOOK_USER.INSERT_TIME] = commonFunction.getCurrTimestampInSecNum()
                resultBookUser = await newUser.save().then(res => res ? res.toObject() : res)
            }
        }
        bookingUser[collectionConstants.FAIR.BOOKING_USER_ID] = resultBookUser[collectionConstants.BOOK_USER.ORIGINAL_ID]
        bookingUser[collectionConstants.FAIR.BOOKING_USER_NAME] = resultBookUser[collectionConstants.BOOK_USER.NAME]
        if (commonFunction.isNotBlank(bookingUser[collectionConstants.FAIR.BOOKING_USER_TEL])) {
            bookingUser[collectionConstants.FAIR.BOOKING_USER_TEL] = resultBookUser[collectionConstants.BOOK_USER.TEL]
        }
        update[collectionConstants.FAIR.BOOKING_USER] = bookingUser

        var bookingTeam = {}
        var resultBookTeam = {}
        if (commonFunction.isNotBlank(req.body.teamId)) {
            var bookedTeamCondition = {}
            bookedTeamCondition[collectionConstants.BOOK_TEAM.ORIGINAL_ID] = req.body.teamId
            var bookedTeam = await bookTeamModel.findOne(bookedTeamCondition).lean().then(res => res)
            if (commonFunction.isEmptyObject(bookedTeam)) {
                var manuTeam = await teamModel.findById(req.body.teamId).lean().then(res => res)
                var newTeam = new bookTeamModel
                newTeam[collectionConstants.BOOK_TEAM.ORIGINAL_ID] = manuTeam._id
                newTeam[collectionConstants.BOOK_TEAM.NAME] = manuTeam[collectionConstants.TEAM.NAME]
                newTeam[collectionConstants.BOOK_TEAM.AVATAR] = manuTeam[collectionConstants.TEAM.AVATAR]
                if (commonFunction.isNotBlank(req.body.tel)) {
                    newTeam[collectionConstants.BOOK_TEAM.TEL] = req.body.tel
                }
                newTeam[collectionConstants.BOOK_TEAM.STADIUM_BOOK].push(req.body.stadiumId)
                newTeam[collectionConstants.BOOK_TEAM.AGENT_SYSTEM] = 1
                newTeam[collectionConstants.BOOK_TEAM.INSERT_TIME] = commonFunction.getCurrTimestampInSecNum()
                resultBookTeam = await newTeam.save().then(res => res ? res.toObject() : res)
            } else {
                var condition = {}
                condition[collectionConstants.BOOK_TEAM.ORIGINAL_ID] = bookedTeam.originalId
                var addToSet = {}
                addToSet[collectionConstants.BOOK_TEAM.STADIUM_BOOK] = req.body.stadiumId
                var set = {}
                if (commonFunction.isNotBlank(req.body.tel)) {
                    set[collectionConstants.BOOK_TEAM.TEL] = req.body.tel
                }
                resultBookTeam = await bookTeamModel.findOneAndUpdate(condition, { $set: set, $addToSet: addToSet }, { new: true }).lean().then(res => res)
            }
        } else {
            if (commonFunction.isNotBlank(req.body.teamName)) {
                var newTeam = new bookTeamModel
                newTeam[collectionConstants.BOOK_TEAM.ORIGINAL_ID] = newTeam._id
                newTeam[collectionConstants.BOOK_TEAM.NAME] = req.body.teamName
                if (commonFunction.isNotBlank(req.body.tel)) {
                    newTeam[collectionConstants.BOOK_TEAM.TEL] = req.body.tel
                }
                newTeam[collectionConstants.BOOK_TEAM.STADIUM_BOOK].push(req.body.stadiumId)
                newTeam[collectionConstants.BOOK_TEAM.AGENT_SYSTEM] = 1
                newTeam[collectionConstants.BOOK_TEAM.INSERT_TIME] = commonFunction.getCurrTimestampInSecNum()
                resultBookTeam = await newTeam.save().then(res => res ? res.toObject() : res)
            }
        }
        bookingTeam[collectionConstants.FAIR.BOOKING_TEAM_ID] = resultBookTeam[collectionConstants.BOOK_TEAM.ORIGINAL_ID]
        bookingTeam[collectionConstants.FAIR.BOOKING_TEAM_NAME] = resultBookTeam[collectionConstants.BOOK_TEAM.NAME]
        if (commonFunction.isNotBlank(bookingTeam[collectionConstants.FAIR.BOOKING_TEAM_TEL])) {
            bookingTeam[collectionConstants.FAIR.BOOKING_TEAM_TEL] = resultBookTeam[collectionConstants.BOOK_TEAM.TEL]
        }
        update[collectionConstants.FAIR.BOOKING_TEAM] = bookingTeam
        if (commonFunction.isNotEmptyObject(resultBookUser) && commonFunction.isNotEmptyObject(resultBookTeam)) {
            var bookedUserCondition = {}
            bookedUserCondition[collectionConstants.BOOK_USER.ORIGINAL_ID] = resultBookUser[collectionConstants.BOOK_USER.ORIGINAL_ID]
            var addTeamToUser = {}
            addTeamToUser[collectionConstants.BOOK_USER.TEAM_BOOK] = resultBookTeam[collectionConstants.BOOK_TEAM.ORIGINAL_ID]
            await bookUserModel.findOneAndUpdate(bookedUserCondition, { $addToSet: addTeamToUser })
            var bookedTeamCondition = {}
            bookedTeamCondition[collectionConstants.BOOK_TEAM.ORIGINAL_ID] = resultBookTeam[collectionConstants.BOOK_TEAM.ORIGINAL_ID]
            var addUserToTeam = {}
            addUserToTeam[collectionConstants.BOOK_TEAM.USER_BOOK] = resultBookUser[collectionConstants.BOOK_USER.ORIGINAL_ID]
            await bookTeamModel.findOneAndUpdate(bookedTeamCondition, { $addToSet: addUserToTeam })
        }

        update[collectionConstants.FAIR.BOOK_STATUS] = 1
        update[collectionConstants.FAIR.BOOK_DATE_TIME] = commonFunction.getCurrTimestampInSecNum()
        var lstResult = []
        var fairLst = req.body.fair
        var rootFairId = fairLst[0].fairId
        var goldFairCount = fairLst.filter(f => f.goldFlag == 1).length
        update[collectionConstants.FAIR.FAIR_PRICE] = Number(fairLst[0].fairPrice.trim())
        update[collectionConstants.FAIR.BOOK_FAIR_HOUR] = goldFairCount + 0.5 * (fairLst.length - goldFairCount)
        await bookFair(rootFairId, update, lstResult)
        removeItem(update)
        fairLst.shift()
        await Promise.all(fairLst.map(async (fair) => {
            update[collectionConstants.FAIR.UNION_FLAG] = 1
            update[collectionConstants.FAIR.ROOT_FAIR_ID] = rootFairId
            await bookFair(fair.fairId, update, lstResult)
        }));

        return res.send(commonFunction.successOutputObject(lstResult))
    } catch (error) {
        console.log('error', error)
        return res.send(commonFunction.failureOutput(commonConstants.STATUS.STATUS_FAILURE, commonMessage.FAILURE))
    }
}

bookFair = async (fairId, update, lstResult) => {
    var result = await baseController.updateById(fairId, update, 'Fair');
    if (result.status === 0) {
        lstResult.push(result.data)
    }
}

removeItem = (update) => {
    delete update[collectionConstants.FAIR.BOOKING_USER];
    delete update[collectionConstants.FAIR.BOOKING_TEAM];
    delete update[collectionConstants.FAIR.FAIR_PRICE];
    delete update[collectionConstants.FAIR.BOOK_FAIR_TIME];
    delete update[collectionConstants.FAIR.BOOK_FAIR_HOUR];
}

exports.updatePriceFair = (req, res) => {
    var searchCondition = req.body;
    var condition = {};
    condition.fairDay = {
        $in: searchCondition.fairDays
    };
    condition.fairStadiumType = searchCondition.fairStadiumType;
    condition.fairTime = searchCondition.fairTime;
    var update = { fairPrice: searchCondition.fairPrice };
    fairModel.updateMany(condition, update, (err, doc) => {
        if (err) return res.send(err)
        return res.send(commonFunction.successOutputObject(doc))
    })
}

exports.insertPriceFair = async (req, res) => {
    try {
        var stadium = await stadiumModel.findById(req.body.stadiumId, { name: 1, address: 1, district: 1, tel: 1, slug: 1, _id: 0, stadiumChild: 1, agentUser: 1 }).lean()
        // console.log(req.body)
        var startDate = moment()
        var endDate = moment(startDate).endOf('year')
        var diffDays = moment.duration(endDate.diff(startDate, 'days'))._milliseconds
        var bulkWriteArray = []
        req.body.stadiumChildList.forEach(child => {
            for (let day = 0; day <= diffDays; day++) {
                for (let index = 1; index <= 48; index++) {
                    var documentObj = {}
                    documentObj.fairStadiumId = req.body.stadiumId
                    documentObj.fairDistrict = stadium.district
                    documentObj.fairStadiumName = stadium.name
                    documentObj.fairStadiumName = stadium.name
                    documentObj.fairStadiumSlug = stadium.slug
                    documentObj.fairStadiumAddress = stadium.address
                    documentObj.agentUser = stadium.agentUser
                    documentObj.fairStadiumType = req.body.stadiumChildType
                    documentObj.fairStadiumChild = child.childStadiumId
                    documentObj.fairStadiumChildName = child.childStadiumName
                    documentObj.fairTime = index
                    documentObj.fairDate = moment(startDate).add(day, 'days').format('YYYYMMDD')
                    documentObj.fairDateNum = Number(moment(startDate).add(day, 'days').format('YYYYMMDD'))
                    documentObj.fairDay = commonConstants.DAY_NAME[moment(startDate).add(day, 'days').format('dddd')]
                    var query = {
                        insertOne: {
                            document: documentObj
                        }
                    }
                    bulkWriteArray.push(query)
                }
            }
        })
        // console.log(bulkWriteArray)
        var result = await fairModel.bulkWrite(bulkWriteArray).then(res => res)
        var updateStadium = {}
        updateStadium[commonConstants.STADIUM_PRICE[req.body.stadiumChildType]] = req.body.data
        var resultUpdateStadium = await stadiumModel.findByIdAndUpdate(req.body.stadiumId, updateStadium, { new: true }).lean().then(res => res)
        // console.log("resultUpdateStadium", resultUpdateStadium)
        var resObj = {
            status: commonConstants.STATUS.STATUS_SUCCESS,
            message: commonMessage.SUCCESS,
            data: {
                n: result.n,
                stadium: resultUpdateStadium
            }
        }
        res.send(resObj)
    } catch (error) {
        return res.send(commonFunction.failureOutput(commonConstants.STATUS.STATUS_FAILURE, error.message))
    }
}


/**
 * @author longlvq
 * search fair statistical
 */
exports.searchFairStatistic = (req, res) => {
    try {
        console.log('req: ', req.body)
        var errorMsg = baseController.validate(req);
        if (commonFunction.isNotNull(errorMsg)) {
            return res.send(errorMsg);
        }
        var condition = {};
        var project = { fairTime: 1, fairPrice: 1, fairDays: 1, fairStadiumType: 1, fairDate: 1, fairStadiumChild: 1, fairStadiumChildName: 1, bookStatus: 1, fairDay: 1 }

        condition.deleteFlag = { '$ne': 1 };
        if (commonFunction.isNotNull(req.body.fairStadiumType)) {
            condition.fairStadiumType = req.body.fairStadiumType;
        }
        if (commonFunction.isNotBlank(req.body.fairStadiumId)) {
            condition.fairStadiumId = req.body.fairStadiumId;
        }
        if (commonFunction.isNotBlank(req.body.fairDateFrom) || commonFunction.isNotBlank(req.body.fairDateTo)) {
            condition.fairDate = {
                $gte: req.body.fairDateFrom,
                $lte: req.body.fairDateTo
            }
        }
        condition.bookStatus = 1
        if (req.body.revenue == true) {
            condition.bookFairHour = { $exists: true }
        }
        console.log('condition: ', condition)
        if (commonFunction.isNotNull(req.body.bucketObtionCount)) {
            var bucket = {
                groupBy: "$fairDateNum",
                boundaries: req.body.bucketObtionCount,
                default: "Other",
                output: {
                    "countSum": { $sum: 1 },
                    "countPrice": { $sum: "$fairPrice" },
                    "titles": { $push: "$fairDateNum" }
                }
            }
            console.log(req.body.bucketObtionCount)
            fairModel.aggregate(
                [{ $match: condition },
                {
                    $bucket: bucket
                }
                ], (err, data) => {
                    if (err) return res.json(err);
                    return res.send(commonFunction.successOutputArray(data))
                }
            );
        } else {
            fairModel.aggregate(
                [{ $match: condition },
                { $project: project },

                ], (err, data) => {
                    if (err) return res.json(err);
                    return res.send(commonFunction.successOutputArray(data))
                }
            );
        }
    } catch (error) {
        return res.send(commonFunction.failureOutput(commonConstants.STATUS.STATUS_FAILURE, error))
    }
}
//begin

/**
 * @author Hoang Thi Huong Giang
 */
//begin
exports.searchCalendarFair = async (req, res) => {
    try {
        var conditions = {}
        conditions.deleteFlag = { '$ne': 1 }
        if (commonFunction.isNotBlank(req.body.fairStadiumId)) {
            conditions.fairStadiumId = req.body.fairStadiumId
        }
        if (commonFunction.isNotNull(req.body.fairStadiumType)) {
            conditions.fairStadiumType = req.body.fairStadiumType
        }
        if (commonFunction.isNotBlank(req.body.fairDateFrom) || commonFunction.isNotBlank(req.body.fairDateTo)) {
            conditions.fairDate = {
                $gte: req.body.fairDateFrom,
                $lte: req.body.fairDateTo
            }
        }
        var result = await fairModel.find(conditions).lean().then(res => res)
        res.send(commonFunction.successOutputArray(result))
        //group
        // var group = {
        //     _id: {
        //         fairDay: "$fairDay",
        //         fairDate: "$fairDate",
        //         fairTime: "$fairTime",
        //         goldFlag: "$goldFlag",
        //         offFlag: "$offFlag",
        //         fairPrice: "$fairPrice"
        //     },
        //     fairList: {
        //         $push: {
        //             _id: "$_id",
        //             fairDay: "$fairDay",
        //             fairDate: "$fairDate",
        //             fairTime: "$fairTime",
        //             fairPrice: "$fairPrice",
        //             fairStadiumChild: "$fairStadiumChild",
        //             fairStadiumChildName: "$fairStadiumChildName",
        //             bookStatus: "$bookStatus",
        //             goldFlag: "$goldFlag"
        //         }
        //     }
        // };
        // //project
        // var project = {
        //     _id: 0,
        //     fairDay: "$_id.fairDay",
        //     fairDate: "$_id.fairDate",
        //     fairTime: "$_id.fairTime",
        //     goldFlag: "$_id.goldFlag",
        //     offFlag: "$_id.offFlag",
        //     fairPrice: "$_id.fairPrice",
        //     fairList: {
        //         $filter: {
        //             input: "$fairList",
        //             as: "item",
        //             cond: { $ne: ["$$item.bookStatus", 1] }
        //         }
        //     }
        // }
        // var pipeline = [
        //     { $match: query },
        //     { $group: group },
        //     { $project: project }
        // ];
        // fairModel.aggregate(pipeline, (err, data) => {
        //     if (err) {
        //         return res.send(commonFunction.failureOutput(commonConstants.STATUS.STATUS_FAILURE, commonMessage.FAILURE));
        //     };
        //     return res.send(commonFunction.successOutputArray(data))
        // }
        // );
    } catch (error) {
        return res.send(commonFunction.failureOutput(commonConstants.STATUS.STATUS_FAILURE, error))
    }
}
//end


/**
 * @author Dinh Quang Linh
 */
//begin 

exports.updateNameStadiumChild = (req, res) => {
    var condition = {};
    condition = {
        fairStadiumChild: req.body.fairStadiumChild
    };
    var update = { fairStadiumChildName: req.body.fairStadiumChildName };
    fairModel.updateMany(condition, update, (err, doc) => {
        if (err) return res.send(err)
        return res.send(commonFunction.successOutputObject(doc))
    })
}


/**
 * Search booked stadium
 */exports.searchFairBooked = (req, res) => {
    try {
        if (commonFunction.isNotNull(req.body.fairStadiumId)) {
            request = req.body;
            var match = {};
            match.bookStatus = 1
            match.deleteFlag = { $ne: 1 };
            match.fairStadiumId = request.fairStadiumId;
            match.unionFlag = { $ne: 1 };
            // DATEFROM != NULL and DATETO != NULL
            if (commonFunction.isNotNull(request.dateFrom) && commonFunction.isNotNull(request.dateTo)) {
                match.fairDate = { $gte: request.dateFrom, $lte: request.dateTo }
            }
            // DATEFROM != NULL and DATETO == NULL
            if (commonFunction.isNotNull(request.dateFrom) && !commonFunction.isNotNull(request.dateTo)) {
                match.fairDate = { $gte: request.dateFrom }
            }
            // DATEFROM == NULL and DATETO != NULL
            if (!commonFunction.isNotNull(request.dateFrom) && commonFunction.isNotNull(request.dateTo)) {
                match.fairDate = { $lt: request.dateTo }
            }
            // TIMEFROM != NULL and TIMETO != NULL
            if (commonFunction.isNotNull(request.timeFrom) && commonFunction.isNotNull(request.timeTo)) {
                if (request.timeFrom <= request.timeTo) {
                    match.fairTime = { $gte: request.timeFrom, $lt: request.timeTo }
                } else {
                    match.$or = [
                        { fairTime: { $gte: request.timeFrom } }, { fairTime: { $lt: request.timeTo } }
                    ]
                }
            }
            // TIMEFROM != NULL and TIMETO == NULL
            if (commonFunction.isNotNull(request.timeFrom) && !commonFunction.isNotNull(request.timeTo)) {
                match.fairTime = { $gte: request.timeFrom }
            }
            // TIMEFROM == NULL and TIMETO != NULL
            if (!commonFunction.isNotNull(request.timeFrom) && commonFunction.isNotNull(request.timeTo)) {
                match.fairTime = { $lt: request.timeTo }
            }
            // fairStadiumType
            if (commonFunction.isNotNull(request.fairStadiumType)) {
                match.fairStadiumType = request.fairStadiumType;
            }
            // fairStadiumName
            if (commonFunction.isNotNull(request.fairStadiumName)) {
                match.fairStadiumChildName = request.fairStadiumName;
            }
            // Team
            if (commonFunction.isNotNull(request.teamId)) {
                match["bookingTeam.bookingTeamId"] = request.teamId;
            }
            if (!commonFunction.isNotNull(request.teamId) && commonFunction.isNotNull(request.teamName)) {
                match["bookingTeam.bookingTeamName"] = request.teamId;
            }
            // User
            if (commonFunction.isNotNull(request.userId)) {
                match["bookingUser.bookingUserId"] = request.userId;
            }
            if (!commonFunction.isNotNull(request.teamId) && commonFunction.isNotNull(request.userName)) {
                match["bookingUser.bookingUserName"] = request.userName;
            }
            var sort = { fairDate: 1, fairTime: 1 };
            fairModel.aggregate(
                [{ $match: match },
                { $project: { fairDate: 1, fairTime: 1, fairStadiumChildName: 1, fairStadiumType: 1, "bookingUser.bookingUserName": 1, "bookingTeam.bookingTeamName": 1, bookFairTime: 1 } },
                { $sort: sort },
                { $skip: commonFunction.isNotNull(request.page) ? (commonConstants.PAGING.FAIR_LIST * request.page) : 0 },
                { $limit: commonConstants.PAGING.FAIR_LIST }
                ], (err, data) => {
                    if (err) {
                        return res.send(commonFunction.failureOutput(commonConstants.STATUS.STATUS_PARAM_ERROR, commonMessage.FAILURE));
                    }
                    return res.send(commonFunction.successOutputArray(data))
                }
            );
        } else {
            return res.send(commonFunction.failureOutput(commonConstants.STATUS.STATUS_PARAM_ERROR, commonMessage.NULL_PARAM));
        }
    } catch (error) {
        return res.send(commonFunction.failureOutput(commonConstants.STATUS.STATUS_FAILURE, commonMessage.FAILURE))
    }
}

/**
 * @author Dinh Quang Linh
 */
//begin 

exports.insertDeleteFair = (req, res) => {
    var condition = {};
    condition = {
        fairStadiumChild: req.body.fairStadiumChild
    };
    var update = { delFlag: 1 };
    fairModel.updateMany(condition, update, (err, doc) => {
        if (err) return res.send(err)
        return res.send(commonFunction.successOutputObject(doc))
    })
}