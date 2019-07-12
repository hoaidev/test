var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    id: String,
    insertTime: Number,
    updateTime: Number,
    deleteTime: Number,
    updateFlag: Number,
    deleteFlag: Number,
    fbId: String,
    name: String,
    commonInfo: {
        bio: String,
        birthDate: String,
        email: String,
        tel: String,
        zalo : String,
        skype: String
    },
    level: Number,
    isNeedTeam: Boolean,
    district: [Number],
    positionArr: [
        {
            positionId: Number
        }
    ],
    teamList: [
        {
            teamId: String,
            teamName: String,
            teamAvatar: String,
            teamLevel: Number,
            teamSlug: String,
            teamStatus: Number,
            teamNo: Number,
            teamTime: String,
            userAuthorUserId: String,
            userAuthorUserName: String,
            userAuthorUserAvatar: String,
            userAuthorUserSlug: String,
            userAuthorUserFbId: String

        }
    ],
    avatar: String,
    slug: String,
    gallery: [
        {
            galleryTime: String,
            galleryTitle: String,
            galleryUrl: String,
            galleryMedUrl: String,
            gallerySmUrl: String
        }
    ],
    banner: String,
    description: String,
    role: Number,
    albumImages: [
        {
            albumName: String,
            albumDescription: String,
            albumMemberJoin: String,
            albumImageUrl: [String],
            albumDateTime: Number
        }
    ]
})

module.exports = mongoose.model('User', userSchema, 'user');