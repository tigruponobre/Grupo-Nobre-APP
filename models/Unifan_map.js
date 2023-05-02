const mongoose = require('mongoose')

const UnifanMap = mongoose.model('UNIFAN_MAP', {
    CURSO: "String",
    MODALIDADE: "String",
    VESPERTINO: "Mixed",
    NOTURNO: "Mixed"
})

module.exports = UnifanMap