var mongoose = require('mongoose');

var ficheiroSchema = new mongoose.Schema({
    name: String,
    date: String,
    desc: String,
    memetype: String,
})

module.exports = mongoose.model('ficheiro', ficheiroSchema)