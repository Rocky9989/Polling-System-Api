import Option from '../models/Option.js';
import Question from '../models/Question.js';

// Controller to create a new option for a question
export const createOption = async (req, res) => {
  try {
    const { id } = req.params; // Question ID from URL params
    const { text } = req.body; // Option text from request body

    // Validate required fields
    if (!id) {
      return res.status(400).json({ message: 'Question ID is required' });
    }
    if (!text) {
      return res.status(400).json({ message: 'Option text is required' });
    }

    // Find the question to which the option will be added
    const question = await Question.findById(id);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    // Create a new option instance
    const option = new Option({
      text,
      question: id,
    });
    await option.save(); // Save the option to the database

    // Add the option to the question's options array
    question.options.push(option);
    await question.save();

    // Respond with success
    res.status(201).json({
      message: 'Option created successfully',
      option: option,
    });
  } catch (error) {
    console.error('Error creating option:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Controller to delete an option
export const deleteOption = async (req, res) => {
  try {
    const { id } = req.params; // Option ID from URL params
    if (!id) {
      return res.status(400).json({ message: 'Option ID is required' });
    }

    // Find the option to delete
    const option = await Option.findById(id);
    if (!option) {
      return res.status(404).json({ message: 'Option not found' });
    }

    // Prevent deletion if the option has votes
    if (option.votes > 0) {
      return res
        .status(400)
        .json({ message: 'Cannot delete an option with votes' });
    }

    // Delete the option and remove its reference from the question
    await Option.findByIdAndDelete(id);
    await Question.findByIdAndUpdate(option.question, {
      $pull: { options: id },
    });

    // Respond with success
    res.status(200).json({ message: 'Option deleted successfully' });
  } catch (error) {
    console.error('Error deleting option:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Controller to add a vote to an option
export const addVote = async (req, res) => {
  try {
    const { id } = req.params; // Option ID from URL params
    if (!id) {
      return res.status(400).json({ message: 'Option ID is required' });
    }

    // Find the option to vote for
    const option = await Option.findById(id);
    if (!option) {
      return res.status(404).json({ message: 'Option not found' });
    }
    option.votes += 1; // Increment the vote count
    await option.save(); // Save the updated option

    // Respond with success
    res.status(200).json({
      message: 'Vote added successfully',
      option: option,
    });
  } catch (error) {
    console.error('Error adding vote:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
