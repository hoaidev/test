var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    id: String,
    originalId: String,
    insertTime: Number,
    updateTime: Number,
    deleteTime: Number,
    updateFlag: Number,
    deleteFlag: Number,
    name: String,
    tel: String,
    avatar: String,
    stadiumBook: Array,
    userBook: Array,
    agentSystem: Number
})

module.exports = mongoose.model('BookTeam', userSchema, 'bookTeam');