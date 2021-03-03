const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A task must have a name'],
      unique: true,
      trim: true
    },
    completed: {
      type: Boolean,
      default: false
    },
    user: {
      type: mongoose.Types.ObjectId,
      require: true,
      ref: 'User'
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true
  }
);

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
