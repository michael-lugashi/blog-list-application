const blogRouter = require('express').Router();
const jwt = require('jsonwebtoken');
const Blog = require('../models/blogSchema');
const User = require('../models/userSchema');

const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization');
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    request.token = authorization.substring(7);
    next();
  } else {
    response.status(401).json({ error: 'token missing' });
  }
};

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

blogRouter.post('/', tokenExtractor, async (request, response, next) => {
  try {
    const decodedToken = jwt.verify(request.token, process.env.SECRET);
    if (!decodedToken.id) {
      return response.status(401).json({ error: 'invalid token' });
    }
    const { title, author, url, likes } = request.body;

    const newBlog = {
      title,
      author,
      url,
      likes,
      authorInfo: decodedToken.id,
    };
    const blog = new Blog(newBlog);
    const result = await blog.save();
    await User.findByIdAndUpdate(decodedToken.id, {
      $push: { blogs: result.id },
    });
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
