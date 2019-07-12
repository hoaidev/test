// Import Models here
var sampleModel = require('../models/sampleModel');

exports.getAll = (req, res) => {
    sampleModel.find((err, data) => {
        if (err) return res.json(err);
        return res.json(data)
    });
}

exports.getById = (req, res) => {
    res.json({'single': 'data'})
}
