const supertest = require('supertest');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { usersInDB } = require('./users_test_helpers');
const app = require('../app');
const api = supertest(app);

const User = require('../models/userSchema');

beforeEach(async () => {
  await User.deleteMany({});

  const passwordHash = await bcrypt.hash('sekret', 10);
  const user = new User({ username: 'root', passwordHash });

  await user.save();
});

describe('Api Tests', () => {
  console.log('sent');
  test('check status of get request', async () => {
    await api
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });
});

afterAll(() => {
  mongoose.connection.close();
});
