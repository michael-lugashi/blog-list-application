const blogRouter = require('express').Router();
const Blog = require('../models/blogSchema');
const User = require('../models/userSchema');

blogRouter.get('/', async (request, response, next) => {
  try {
    const blogs = await Blog.find({}).populate('authorInfo', {
      username: 1,
      name: 1,
    });
    response.json(blogs.map((blog) => blog.toJSON()));
  } catch (error) {
    next(error);
  }
});

blogRouter.post('/', async (request, response, next) => {
  try {
    const { authorInfo } = request.body;    
    const blog = new Blog(request.body);
    const result = await blog.save();
    await User.findByIdAndUpdate(authorInfo, { $push: { blogs: result.id } });
    response.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

blogRouter.delete('/:id', async (request, response, next) => {
  console.log('recieved');
  try {
    await Blog.findByIdAndRemove(request.params.id);
    response.status(204).end();
  } catch (error) {
    next(error);
  }
});

blogRouter.put('/:id', async (request, response, next) => {
  try {
    await Blog.findByIdAndUpdate(request.params.id, { $inc: { likes: 1 } });
    response.status(204).end();
  } catch (error) {
    next(error);
  }
});

module.exports = blogRouter;
