const User = require('./schemas/userSchema');

const findByEmail = async email => {
  return await User.findOne({ email });
};

const findById = async id => {
  return await User.findOne({ _id: id });
};

const findByVerificationToken = async verificationToken => {
  return await User.findOne({ verificationToken });
};

const create = async ({ email, password, verify, verificationToken }) => {
  const user = new User({ email, password, verify, verificationToken });
  return await user.save();
};

const updateToken = async (id, token) => {
  return await User.updateOne({ _id: id }, { token });
};

const updateSubUser = async (id, subscription) => {
  return await User.updateOne({ _id: id }, { subscription });
};

const updateAvatar = async (id, avatarURL) => {
  return await User.updateOne({ _id: id }, { avatarURL });
};

const updateVerificationToken = async (id, verify, verificationToken) => {
  return await User.findOneAndUpdate(
    { _id: id },
    { verify, verificationToken },
  );
};

module.exports = {
  findByEmail,
  findById,
  create,
  updateToken,
  updateSubUser,
  updateAvatar,
  findByVerificationToken,
  updateVerificationToken,
};
