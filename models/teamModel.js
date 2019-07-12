var mongoose = require('mongoose');

var teamSchema = new mongoose.Schema({
    id: String,
    insertTime: Number,
    updateTime: Number,
    deleteTime: Number,
    updateFlag: Number,
    deleteFlag: Number,
    name: String,
    slogan: String,
    avatar: String,
    slug: String,
    age: String,
    level: Number,
    captain: {
        captainUserId: String,
        captainFbId: String,
        captainName: String,
        captainAvatar: String,
        captainSlug: String
    },
    gallery: [
        {
            galleryTime: String,
            galleryTitle: String,
            galleryUrl: String,
            galleryMedUrl: String,
            gallerySmUrl: String
        }
    ],
    findUser: Boolean,
    findCompetitor: Boolean,
    homeStadium: {
        stadiumId: String,
        stadiumName: String,
        stadiumAddress: String,
        stadiumDay: Number,
        stadiumTime: String,
        stadiumSlug: String,
        stadiumDistrict: String,
    },
    teamList: [
        {
            inviteId: String,
            teamId: String,
            teamLevel: Number,
            teamName: String,
            teamAvatar: String,
            teamSlug: String,
            teamMatchStadiumId: String,
            teamMatchStadiumName: String,
            teamMatchStadiumSlug: String,
            teamMatchDate: String,
            teamMatchTime: String,
            teamMatchStadiumType: Number,
            teamMatchMoney: Number,
            teamAuthorUserId: String,
            teamAuthorUserName: String,
            teamAuthorUserAvatar: String,
            teamAuthorUserSlug: String,
            teamAuthorUserFbId: String,
            matchResult: Number,
            matchScoreHome: Number,
            matchScoreAway: Number,
            matchResultTime: String,
            teamStatus: Number,
            teamTime: String,
            teamMatchExpire: Number,
        }
    ],
    userList: [
        {
            userId: String,
            userName: String,
            userAvatar: String,
            userLevel: Number,
            userSlug: String,
            userFbId: String,
            userAuthorUserId: String,
            userAuthorUserName: String,
            userAuthorUserAvatar: String,
            userAuthorUserSlug: String,
            userAuthorUserFbId: String,
            userStatus: Number,
            userTime: String,
        }
    ],
    resultMatch: [{
        matchId: String,
        matchDate: String,
        competitorId: String,
        competitorAvatar: String,
        competitorName: String,
        competitorSlug: String,
        result: Number,
        scoreHome: Number,
        scoreAway: Number,
        resultStatus: Number,
        resultTime: String,
    }],
    description: String,
    albumImages: [{
        albumName: String,
        albumDescription: String,
        albumMemberJoin: String,
        albumImageUrl: [String],
        albumDateTime: Number
    }]
})

module.exports = mongoose.model('Team', teamSchema, 'team');