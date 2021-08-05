const mongoose = require('mongoose')

const newsSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    ownerID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
})



const News = mongoose.model('News', newsSchema)
module.exports = News