const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const searchTermSchema = new Schema(
  {
    searchVal: String,
    searchDate: Date
  },
  //{timeStamp:true}
  {collection: 'searchterms'}
);

const ModelClass = mongoose.model("searchTerm",searchTermSchema);

module.exports = ModelClass;