var teamModel = require('../models/teamModel')
var commonFunction = require('../common/commonFunction')
var baseController = require('../controllers/baseController')
const bookTeamModel = require('../models/bookTeamModel')

exports.searchAllByName = async (req, res) => {
    var teamName = req.body.name
    var input = {}
    baseController.fullTextSearch(input, teamName)
    var teamList = await teamModel.find(input, { name: 1, avatar: 1, slug: 1, userList: 1, captain: 1 }).lean().then(value => value)
    var bookTeamList = await bookTeamModel.find(input).lean().then(value => value)
    var sameTeamList = teamList.filter(t => bookTeamList.some(b => b.originalId == t._id))
    var result = teamList.filter(t => !sameTeamList.some(b => b._id == t._id))
    result = bookTeamList.concat(result)
    if (req.body.userId) {
        var arr = []
        result.forEach(u => {
            if (u.userBook && u.userBook.includes(req.body.userId)) {
                arr.push(u)
            } else if (u.agentSystem) {
                arr.push(u)
            } else if (u.captain && u.captain.captainUserId == req.body.userId) {
                arr.push(u)
            } else if (u.userList && u.userList.some(e => e.userId == req.body.userId && e.userStatus == 7)) {
                arr.push(u)
            }
        })
        result = result.filter(u => !arr.some(a => JSON.stringify(a) === JSON.stringify(u)))
        result = arr.concat(result)
    }
    console.log("arr", arr)
    console.log(result)
    return res.send(commonFunction.successOutputArray(result))
}