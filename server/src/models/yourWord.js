const mongoose = require("mongoose");
const paginate = require("mongoose-paginate-v2");

const yourWordSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    require: true,
  },
  wordId: {
    type: mongoose.Schema.ObjectId,
    ref: "Word",
    require: true,
  },
});

yourWordSchema.plugin(paginate);

module.exports = mongoose.model("YourWord", yourWordSchema);
