import mongoose from 'mongoose';

// Define the schema for a Question
const questionSchema = new mongoose.Schema(
  {
    // The title of the question, required field
    title: {
      type: String,
      required: true,
    },

    // The options associated with the question, referenced from the Option model
    options: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Option',
      },
    ],
  },

  // Automatically add createdAt and updatedAt timestamps
  { timestamps: true }
);

// Create the Question model from the schema
const Question = mongoose.model('Question', questionSchema);

export default Question;
