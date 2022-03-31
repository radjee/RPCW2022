var mongoose = require('mongoose');
const student = require('../../../../Aula6/galunos/models/student');
var Ficheiro = require('../models/ficheiro');

// Listar
module.exports.list = () => {
    return Ficheiro
        .find()
        .sort()
        .exec()
}

// Lookup
module.exports.lookUp = id => {
    return Ficheiro
        .findOne({_id: mongoose.Types.ObjectId(id)})
        .exec()
}

// Insert
module.exports.insert = ficheiro => {
    var newFicheiro = new Ficheiro(ficheiro)
    return newFicheiro.save()
}