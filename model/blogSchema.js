const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
    minlength: 5,
  },
  date: Date,
  important: Boolean,
});

module.exports = mongoose.model('Blog', blogSchema);
