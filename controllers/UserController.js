const User = require("../models/Users");

exports.listAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (err) {
    res.status(500).send(err);
  }
};

exports.createNewUser = async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    const error = checkForDuplicateKeyError(err);
    res.status(500).send(error);
  }
};

exports.updateUser = async (req, res) => {
  try {
    const newUser = await User.findOneAndUpdate(
      { _id: req.params.userid },
      req.body,
      {
        new: true,
      }
    );
    res.status(200).json(newUser);
  } catch (err) {
    const error = checkForDuplicateKeyError(err);
    res.status(500).send(error);
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.deleteOne({ _id: req.params.userid });
    if (!user) res.status(404).send({ message: "No user found" });
    res.status(204).json({ message: "User successfully deleted" });
  } catch (err) {
    res.status(500).send(err);
  }
};

exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.userid);
    res.status(200).json(user);
  } catch (err) {
    res.status(500).send(err);
  }
};

const checkForDuplicateKeyError = (err) =>
  err.code === 11000 && err.keyPattern.hasOwnProperty("username")
    ? {
        errors: {
          username: {
            kind: "unique",
            message: `Path 'username' (${err.keyValue.username}) is not unique.`,
          },
        },
        message: `Users validation failed: username: Path 'username' (${err.keyValue.username}) is not unique.`,
        name: "DuplicateKeyError",
      }
    : err;
