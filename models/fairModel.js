var mongoose = require('mongoose');

var fairSchema = new mongoose.Schema({
    _id: Object,
    insertTime: Number,
    updateTime: Number,
    deleteTime: Number,
    updateFlag: Number,
    deleteFlag: Number,
    fairDistrict: Number,
    fairStadiumId: String,
    fairStadiumName: String,
    fairStadiumAddress: String,
    fairStadiumSlug: String,
    fairStadiumType: Number,
    fairDay: Number,
    fairDate: String,
    fairDateNum: Number,
    fairTime: Number,
    fairPrice: Number,
    fairStadiumChild: String,
    fairStadiumChildName: String,
    bookingUser: {
        bookingUserId: String,
        bookingUserName: String,
        bookingUserTel: String,
        bookingUserAvatar: String,
        bookingUserFbId: String,
        bookingUserSlug: String,
    },
    bookingTeam: {
        bookingTeamId: String,
        bookingTeamName: String,
        bookingTeamAvatar: String,
        bookingTeamSlug: String,
    },
    agentUser: {
        agentUserId: String,
        agentUserName: String,
        agentUserAvatar: String,
        agentUserSlug: String,
        agentUserFbId: String
    },
    note: String,
    bookStatus: Number,
    bookDateTime: String,
    offFlag : Number,
    bookFairHour: Number,
    unionFlag: Number,
    goldFlag : Number,
    delFlag : Number,
    rootFairId: String
})

module.exports = mongoose.model('Fair', fairSchema, 'fair');