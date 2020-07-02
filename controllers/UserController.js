const User = require("../models/Users");

exports.listAllUsers = (req, res) => {
  User.find({}, (err, user) => {
    if (err) {
      res.status(500).send(err);
    }
    res.status(200).json(user);
  });
};

exports.createNewUser = async (req, res) => {
  const newUser = req.body;
  const user = new User(newUser);
  try {
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    if (err) {
      res.status(500).send(err);
      // TODO: Add specific error message when creating a user with duplicate username
    }
  }
};

exports.updateUser = (req, res) => {
  User.findOneAndUpdate(
    { _id: req.params.userid },
    req.body,
    { new: true },
    (err, user) => {
      if (err) {
        res.status(500).send(err);
      }
      res.status(200).json(user);
    }
  );
};

exports.deleteUser = (req, res) => {
  User.deleteOne({ _id: req.params.userid }, (err, user) => {
    if (err) {
      res.status(404).send(err);
    }
    res.status(204).json({ message: "User successfully deleted" });
  });
};

exports.getUser = (req, res) => {
  User.findById(req.params.userid, (err, user) => {
    if (err) {
      res.status(500).send(err);
    }
    res.status(200).json(user);
  });
};
