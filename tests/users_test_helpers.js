const User = require('../models/userSchema');

const blogsInDB = async () => {
  return await User.find({});
};

module.exports = {
  blogsInDB,
};
