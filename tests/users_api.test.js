const supertest = require('supertest');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { usersInDb } = require('./users_test_helpers');
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

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await usersInDb();

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen',
    };

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(result.body.error).toContain('`username` to be unique');

    const usersAtEnd = await usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length);
  });

  test('creation fails if is password too short', async () => {
    const usersAtStart = await usersInDb();

    const newUser = {
      username: 'newRoots',
      name: 'Superuser',
      password: 'sa',
    };

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(result.body.error).toContain('at least three characters');

    const usersAtEnd = await usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length);
  });

  test('creation fails if is username too short', async () => {
    const usersAtStart = await usersInDb();

    const newUser = {
      username: 'ne',
      name: 'Superuser',
      password: 'salty',
    };

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(result.body.error).toContain('Path `username` (`ne`) is shorter than the minimum allowed length (3).');

    const usersAtEnd = await usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length);
  });

  test('creation fails if password is missing', async () => {
    const usersAtStart = await usersInDb();

    const newUser = {
      username: 'usernameIsNotMissing',
      name: 'Superuser'
    };

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(result.body.error).toContain('Password is missing!');

    const usersAtEnd = await usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length);
  });

  test('creation fails if username is missing', async () => {
    const usersAtStart = await usersInDb();

    const newUser = {
      name: 'Superuser',
      password: 'passwordIsNotMissing'
    };

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(result.body.error).toContain('username: Path `username` is required.');

    const usersAtEnd = await usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length);
  });

});

afterAll(() => {
  mongoose.connection.close();
});
