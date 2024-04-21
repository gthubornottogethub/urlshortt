
const mongoose = require("mongoose");
const {Schema, model} = mongoose;
const UrlSchema = new Schema({
    url: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true
    },
});
const UrlModel = model("Post", UrlSchema);
module.exports = UrlModel; 