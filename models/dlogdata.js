const mongoose = require('mongoose');

  const blogSchema= new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    image: String, 
    content: {
        type: String,
        required: true
    },
    created: {type: String},
    user: {
      type: String
    },
    user_id:{
      type: String
    }
  });
 
const Blog = mongoose.model('Blog',blogSchema);
module.exports = Blog;