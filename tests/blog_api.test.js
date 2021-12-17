const supertest = require('supertest');
const mongoose = require('mongoose');
const { initialBlogs, blogsInDB } = require('./blog_test_helpers');
const app = require('../app');
const api = supertest(app);

const Blog = require('../models/blogSchema');

beforeEach(async () => {
  await Blog.deleteMany({});

  const promisedBlogs = initialBlogs.map((blog) => {
    const newBlog = new Blog(blog);
    return newBlog.save();
  });

  await Promise.all(promisedBlogs);
});

describe('Blog Tests', () => {
  test('check status', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });
  test('check get', async () => {
    const response = await api.get('/api/blogs');
    expect(response.body).toHaveLength(initialBlogs.length);
    // expect(response.body.sort()).toEqual(initialBlogs.sort());
  });
  test('check ID', async () => {
    const response = await api.get('/api/blogs');
    expect(response.body[0].id).toBeDefined();
    // expect(response.body.sort()).toEqual(initialBlogs.sort());
  });
  test('check post', async () => {
    const newBlog = {
      title: 'My New Blog',
      author: 'Howard',
      url: 'http://www.newPost.com',
      likes: 5,
    };
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const blogs = await blogsInDB();
    const length = blogs.length;
    const blogUrls = blogs.map((blog) => blog.url);

    expect(length).toBe(initialBlogs.length + 1);
    expect(blogUrls).toContain(newBlog.url);
  });

  test('check default like', async () => {
    const newBlog = {
      title: 'Checking default like',
      author: 'Howard',
      url: 'http://www.newPostLikes.com',
    };
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const blogs = await blogsInDB();
    const blogUrls = blogs.map((blog) => blog.likes);

    expect(blogUrls).not.toContain(undefined);
  });

  test('check for bad request when title and url are missing', async () => {
    const newBlog = {
      author: 'Howard',
      likes: 5,
    };
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    const blogs = await blogsInDB();
    const length = blogs.length;

    expect(length).toBe(initialBlogs.length);
  });
});

afterAll(() => {
  mongoose.connection.close();
});
