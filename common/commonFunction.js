const moment = require('moment');
var commonConstant = require('./commonConstants')
var commonMessage = require('./commonMessage')
var exports = module.exports = {
    successOutputArray(result) {
        var output = {}
        output.status = commonConstant.STATUS.STATUS_SUCCESS
        output.message = commonMessage.SUCCESS
        if (!this.isListNull(result)) {
            output.totalRecord = result.length
            output.data = result
        } else {
            output.totalRecord = 0
            output.data = null
        }
        return output
    },

    successOutputObject(result) {
        var output = {}
        output.status = commonConstant.STATUS.STATUS_SUCCESS
        output.message = commonMessage.SUCCESS
        output.data = result
        return output
    },

    failureOutput(status, message) {
        var output = {}
        output.status = status
        output.message = message
        return output;
    },

    isListNull(value) {
        return (value === undefined || value === null || value.length == 0)
    },
    /**
     * return current timestamp(second) Number
     */
    getCurrTimestampInSecNum() {
        console.log('commonFunction.isNotBlank')
        return ~~(Date.now() / 1000)
    },

    /**
     * return current timestamp(second) String
     */
    getCurrTimestampInSecStr() {
        console.log('commonFunction.isNotBlank')
        return exports.getCurrTimestampInSecNum().toString()
    },

    /**
     * It will cover cases where 'value' was never defined, and also any of these:
     * null
     * undefined (value of undefined is not the same as a parameter that was never defined)
     * "" (empty string), "   "
     */
    isNotBlank(value) {
        // console.log('commonFunction.isNotBlank')
        return (typeof value != 'undefined'
            && value !== undefined
            && value !== null
            && value.trim().length > 0)
    },

    isNotNull(value) {
        // console.log('commonFunction.isNotNull')
        return (typeof value != 'undefined'
            && value !== undefined
            && value !== null)
    },
    /**
     * 
     * @param {*} obj 
     * @returns Boolean
     * {} ==> true
     * null ==> true
     * undefined ==> true
     * {'a':1} ==> true
     */
    isEmptyObject(obj) {
        // console.log('commonFunction.isEmptyObject')
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                return false
            }
        }
        return true
    },

    isNotEmptyObject(obj) {
        // console.log('commonFunction.isNotEmptyObject')
        return !this.isEmptyObject(obj);
    },

    isNumber(value) {
        // console.log('commonFunction.isNumber')
        return this.isNotBlank(value) ? !isNaN(value.trim()) : true;
    },
    /**
     * @author longlvq
     * @returns arr
     */
    createObtionBucketWeek(fromDate, Todate) {

        return []
    },

    createQueryForInsertPrice(lst, item, document, date, day, fairTime, frice) {
        var documentQr = JSON.parse(JSON.stringify(document));
        documentQr.fairDate = date;
        //longlvq add field 
        documentQr.fairDateNum = parseInt(date);
        documentQr.fairDay = day;
        documentQr.fairTime = fairTime;
        delete documentQr.stadiumChild;
        if (item.offFlag != null && item.offFlag == 1) {
            documentQr.offFlag = 1;
        } else {
            documentQr.fairPrice = frice;
        }
        if (item.goldFlag != null && item.goldFlag == 1) {
            if ((fairTime - item.fairTimeFrom) % 2 == 0) {
                documentQr.goldFlag = 1;
            } else {
                documentQr.deleteFlag = 1;
            }
        }
        var query = {
            insertOne: { "document": documentQr }
        }
        lst.push(query);
    },

    createQueryForUpdatePrice(lst, item, condition, date, fairTime, frice) {
        var filter = JSON.parse(JSON.stringify(condition));
        filter.fairTime = fairTime;
        filter.bookStatus = { $ne: 1 };
        filter.fairDate = date;
        var update = {}
        if (item.offFlag != null && item.offFlag == 1) {
            update.offFlag = 1;
            update.fairPrice = null;
        } else {
            if (frice != null) {
                update.fairPrice = frice;
            }
            update.offFlag = null;
        }
        if (item.goldFlag != null && item.goldFlag == 1) {
            if ((fairTime - item.fairTimeFrom) % 2 == 0) {
                update.goldFlag = 1;
                update.offFlag = null;
                update.deleteFlag = null;
            } else {
                update.deleteFlag = 1;
            }
        }
        var query = {
            updateMany: {
                filter: filter,
                update: update
            }
        };
        lst.push(query);
    },


    // return list monday to friday in next 52 weeks
    getListMondayOneYearLater() {
        var lst = [];
        for (var i = 0; i <= 52; i++) {
            lst.push(moment().day(1).add(i, 'week').format(commonConstant.DATE_TIME.YYYYMMDD));
        }
        return lst;
    },
    // return list Tuesday to friday in next 52 weeks
    getListTuesdayOneYearLater() {
        var lst = [];
        for (var i = 0; i <= 52; i++) {
            lst.push(moment().day(2).add(i, 'week').format(commonConstant.DATE_TIME.YYYYMMDD));
        }
        return lst;
    },
    // return list Wednesday to friday in next 52 weeks
    getListWednesdayOneYearLater() {
        var lst = [];
        for (var i = 0; i <= 52; i++) {
            lst.push(moment().day(3).add(i, 'week').format(commonConstant.DATE_TIME.YYYYMMDD));
        }
        return lst;
    },
    // return list Thursday to friday in next 52 weeks
    getListThursdayOneYearLater() {
        var lst = [];
        for (var i = 0; i <= 52; i++) {
            lst.push(moment().day(4).add(i, 'week').format(commonConstant.DATE_TIME.YYYYMMDD));
        }
        return lst;
    },
    // return list Friday to friday in next 52 weeks
    getListFridayOneYearLater() {
        var lst = [];
        for (var i = 0; i <= 52; i++) {
            lst.push(moment().day(5).add(i, 'week').format(commonConstant.DATE_TIME.YYYYMMDD));
        }
        return lst;
    },
    // return list Saturday to friday in next 52 weeks
    getListSaturdayOneYearLater() {
        var lst = [];
        for (var i = 0; i <= 52; i++) {
            lst.push(moment().day(6).add(i, 'week').format(commonConstant.DATE_TIME.YYYYMMDD));
        }
        return lst;
    },
    // return list Sunday to friday in next 52 weeks
    getListSundayOneYearLater() {
        var lst = [];
        for (var i = 0; i <= 52; i++) {
            lst.push(moment().day(7).add(i, 'week').format(commonConstant.DATE_TIME.YYYYMMDD));
        }
        return lst;
    },

}
