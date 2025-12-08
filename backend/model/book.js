const mongoose = require("mongoose")
const Schema = mongoose.Schema

const bookSchema = new Schema(
  {
    title: String,
    author: String,
    year: Number,
    description: String,
    image: {
      type: String,
      required: true,
    },
    category: String,
    state: {
      type: String,
      enum: ["loaned", "available"],
      required: true,
    },
  },
  {
    toJSON: {
      transform: function (doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

module.exports = mongoose.model("Book", bookSchema);