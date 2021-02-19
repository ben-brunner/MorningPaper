const mongoose = require('mongoose');

const articleSchema = mongoose.Schema({
    img: String,
    title: String,
    description: String,
    content: String,
    lang: String,
    userId: [{type: mongoose.Schema.Types.ObjectId, ref: 'users'}]
});

var articleModel = mongoose.model('articles', articleSchema);

module.exports = articleModel;