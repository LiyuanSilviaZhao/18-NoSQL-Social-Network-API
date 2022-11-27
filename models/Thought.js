const { Schema, model } = require('mongoose');
const moment = require('moment');



//reaction Schema
const reactionSchema = new Schema(
  {
    reactionId: {
      type: Schema.Types.ObjectId,
      default: () => new Types.ObjectId(),
    },
    reactionBody: {
      type: String,
      required: true,
      maxlength: 280,
    },
    username: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: value => {
        return moment(value).local().format("MMM Do YYYY, h:mm:ss a");
      }
    },
  },
  {
    toJSON: {
      getters: true,
    },
    id: false,
  }
);

// Schema to create a thought model
const thoughtSchema = new Schema(
  {
    thoughtText: {
      type: String,
      required: true,
      maxlength: 280,
      minlength: 1,

    },
    createAt: {
      type: Date, 
      default: Date.now,
      get: value => {
        return moment(value).local().format("MMM Do YYYY, h:mm:ss a");
      }
    },
    username: {
      type: String,
      required: true,
    },
    reactions: [
      reactionSchema
    ],
  },
    {
      toJSON: {
      virtuals: true,
      getters:true,
    },
    id: false,
  }
);

thoughtSchema
  .virtual('reactionCount')
  .get(function () {
    return this.reactions.length;
  });

const Thought = model('thought', thoughtSchema);

module.exports = Thought;
