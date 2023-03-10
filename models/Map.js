const mongoose = require('mongoose')

const Map = mongoose.model('Map', {
    CURSO: "String",
    MATUTINO: "Mixed",
    NOTURNO: "Mixed"
})

module.exports = Map