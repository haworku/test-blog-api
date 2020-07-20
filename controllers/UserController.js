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
    res.status(500).send(err);
  }
};

exports.updateUser = async (req, res) => {
  try {
    const newUser = await User.findOneAndUpdate(
      { _id: req.params.userid },
      req.body,
      {
        new: true,
        runValidators: true,
        context: "query",
        upsert: true,
      }
    );

    res.status(200).json(newUser);
  } catch (err) {
    res.status(500).send(err);
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
