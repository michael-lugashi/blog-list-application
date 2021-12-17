const blogRouter = require('express').Router();
const Blog = require('../models/blogSchema');

blogRouter.get('/', async (request, response) => {
  // Blog.find({}).then((blogs) => {
  //   response.json(blogs);
  // });
  try {
    const blogs = await Blog.find({});
    response.json(blogs);
  } catch (exception) {
    response.status(500).send('An error occured');
  }
});

blogRouter.post('/', async (request, response, next) => {
  // const blog = new Blog(request.body);

  // blog.save().then((result) => {
  //   response.status(201).json(result);
  // });
  try {
    // const {title, url}= request.body;
    // if (!title || !url) {
    //   throw new Error('invalid request!');
    // }
    const blog = new Blog(request.body);
    const result = await blog.save();
    response.status(201).json(result);
  } catch (error) {
    next(error);
    // response.status(500).send('an error occured');
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
