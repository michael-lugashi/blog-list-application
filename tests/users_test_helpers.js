const User = require('../models/userSchema');

const usersInDb = async () => {
  return await User.find({});
};

module.exports = {
  usersInDb,
};
