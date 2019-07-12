var mongoose = require('mongoose');

var sampleSchema = new mongoose.Schema({
    sample: String
})

module.exports = mongoose.model('Sample', sampleSchema);