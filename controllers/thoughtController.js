const {ObjectId} = require('mongoose').Types;
const { User, Thought } = require('../models');

module.exports = {
  // Get all Thoughts
  getThoughts(req, res) {
    Thought.find()
      .then((thoughts) => res.json(thoughts))
      .catch((err) => res.status(500).json(err));
  },

  // Get a Thought
  getSingleThought(req, res) {
    Thought.findOne({ _id: req.params.thoughtId })
      .select('-__v')
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: 'No Thought with that ID' })
          : res.json(thought)
      )
      .catch((err) => res.status(500).json(err));
  },

  // Create a Thought
  createThought(req, res) {
    Thought.create(req.body)
    .then((thought) => {
      return User.findOneAndUpdate(
        { _id: req.body.userId },
        { $push: { thoughts: thought._id } },
        { new: true }
      );
    })
    .then((user) =>
      !user
        ? res
            .status(404)
            .json({ message: 'thought created, but no user with this ID' })
        : res.json({ message: 'comment created' })
    )
      .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
      });
  },

  // Delete a Thought
  deleteThought(req, res) {
    Thought.findOneAndDelete({ _id: req.params.thoughtId })
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: 'No Thought with that ID' })
          : User.findOneAndUpdate(
            { user: req.params.userId },
            { $pull: { thoughts: req.params.thoughtId } },
            { new: true }
      ))
      .then(() => res.json({ message: 'Thought deleted!' }))
      .catch((err) => res.status(500).json(err));
  },

  // Update a Thought
  updateThought(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $set: req.body },
      { runValidators: true, new: true }
    )
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: 'No Thought with this id!' })
          : res.json(thought)
      )
      .catch((err) => res.status(500).json(err));
  },


  //Create a reaction
  addReaction(req, res) {
    Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $push: { reactions: req.body } },
        { new: true }
    ).then((thought) =>
      !thought
        ? res
            .status(404)
            .json({ message: 'reaction created, but no thought with this ID' })
        : res.json({ message: 'reaction created' })
    )
    .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
    });
  },

  //delete a reaction 
  deleteReaction(req, res) {
    Thought.findOneAndUpdate(
      {_id: req.params.thoughtId}, 
      {$pull: {reactions: {_id: req.params.reactionId}}}, 
      {new : true}
      )
      .then((reaction) =>
        !reaction
          ? res.status(404).json({ message: 'No reaction with that ID' })
          : res.json({ message: 'reaction deleted!' }))
      .catch((err) => res.status(500).json(err));
  },

};
