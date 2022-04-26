var Para = require('../models/para')

module.exports.listar = () => {
    return Para
        .find({},{_id: 1, data: 1, para: 1, edit_date: 1})
        .exec()
}

module.exports.inserir = (p) => {
    var d = new Date()
    p.data = d.toISOString().substring(0,16)
    var newPara = new Para(p)
    return newPara
        .save()
}

module.exports.apagar = (id) => {
    return Para
        .deleteOne({_id: id})
        .exec()
}

module.exports.atualizar = (atualizado) => {
    return Para
        .updateOne({_id: atualizado._id},{ para: atualizado.para, edit: atualizado.editado })
        .exec()
}