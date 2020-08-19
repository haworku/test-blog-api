const Comment = require("../models/Comments");

exports.listAllComments = async (req, res) => {
  try {
    const comments = await Comment.find({});
    res.status(200).json(comments);
  } catch (err) {
    res.status(500).send(err);
  }
};

exports.createNewComment = async (req, res) => {
  const comment = new Comment(req.body);
  try {
    await comment.save();
    res.status(201).json(comment);
  } catch (err) {
    res.status(500).send(err);
  }
};

exports.updateComment = async (req, res) => {
  try {
    const newComment = await Comment.findOneAndUpdate(
      { _id: req.params.commentid },
      req.body,
      {
        new: true,
        runValidators: true,
        context: "query",
      }
    );
    if (!newComment)
      return res.status(404).send({ message: "No comment found" });
    res.status(200).json(newComment);
  } catch (err) {
    res.status(500).send(err);
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findOneAndDelete({
      _id: req.params.commentid,
    });
    if (!comment) return res.status(404).send({ message: "No comment found" });
    res.status(204).json({ message: "Comment successfully deleted" });
  } catch (err) {
    res.status(500).send(err);
  }
};

exports.getComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentid);
    if (!comment) return res.status(404).send({ message: "No comment found" });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).send(err);
  }
};
