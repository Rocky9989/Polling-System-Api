import mongoose from 'mongoose';

// Define the schema for an Option
const optionSchema = new mongoose.Schema(
  {
    // The text of the option
    text: {
      type: String,
      required: true,
    },

    // Number of votes this option has received
    votes: {
      type: Number,
      default: 0,
    },

    // Reference to the associated Question
    question: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Question',
      required: true,
    },
  },

  // Automatically add createdAt and updatedAt timestamps
  { timestamps: true }
);

// Create the Option model from the schema
const Option = mongoose.model('Option', optionSchema);

export default Option;
