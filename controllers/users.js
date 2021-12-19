const bcrypt = require('bcrypt');
const usersRouter = require('express').Router();
const User = require('../models/userSchema');

usersRouter.post('/', async (request, response, next) => {
  try {
    const { password, username, name } = request.body;
    if (password.length < 3) {
      throw new Error('Password must be at least three characters!');
    }
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const user = new User({
      username: username,
      name: name,
      passwordHash,
    });

    const savedUser = await user.save();

    response.status(201).json(savedUser);
  } catch (error) {
    next(error);
  }
});

usersRouter.get('/', async (request, response, next) => {
  try {
    const users = await User.find({});
    response.json(users);
  } catch (error) {
    next(error);
  }
});

module.exports = usersRouter;
