var mongoose = require('mongoose');

var stadiumSchema = new mongoose.Schema({
    id: String,
    insertTime: Number,
    updateTime: Number,
    deleteTime: Number,
    updateFlag: Number,
    deleteFlag: Number,
    name: String,
    address: String,
    district: Number,
    tel: String,
    introduce: String,
    service: String,
    slug: String,
    s5: {
        s5Number: Number,
        s5HighPrice: String,
        s5LowPrice: String
    },
    s7: {
        s7Number: Number,
        s7HighPrice: String,
        s7LowPrice: String
    },
    imageList: [
        {
            imagePostDate: String,
            imageTitle: String,
            imageUrl: String
        }
    ],
    likeCount: Number,
    likeUserList: [
        {
            likeUserId: String,
            likeUserName: String,
            likeUserAvatar: String,
            likeUserSlug: String,
            likeUserFbId: String,
            likeFlag: Number
        }
    ],
    reportCount: Number,
    reportUserList: [
        {
            reportUserId: String,
            reportUserName: String,
            reportUserAvatar: String,
            reportUserSlug: String,
            reportUserFbId: String,
            reportContent: String,
            reportStar: Number
        }
    ],
    agentUser: {
        agentUserId: String,
        agentUserName: String,
        agentUserAvatar: String,
        agentUserSlug: String,
        agentUserFbId: String
    },
    stadiumChild: Array,
    iframeUrl: String,
    s5Price: [
        {
            _id: false,
            fairTimeFrom: Number,
            fairTimeTo: Number,
            fairMonPrice: Number,
            fairTuePrice: Number,
            fairWedPrice: Number,
            fairThuPrice: Number,
            fairFriPrice: Number,
            fairSatPrice: Number,
            fairSunPrice: Number,
            offFlag: Number,
            goldFlag: Number
        }
    ],
    s7Price: [
        {
            _id: false,
            fairTimeFrom: Number,
            fairTimeTo: Number,
            fairMonPrice: Number,
            fairTuePrice: Number,
            fairWedPrice: Number,
            fairThuPrice: Number,
            fairFriPrice: Number,
            fairSatPrice: Number,
            fairSunPrice: Number,
            offFlag: Number,
            goldFlag: Number
        }
    ],
})

module.exports = mongoose.model('Stadium', stadiumSchema, 'stadium');