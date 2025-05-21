import Question from '../models/Question.js';
import Option from '../models/Option.js';

// Controller to create a new question
export const createQuestion = async (req, res) => {
  try {
    const { title } = req.body;

    // Validate that title is provided
    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    // Create and save the new question
    const question = new Question({ title });
    await question.save();

    // Respond with success and the created question
    res
      .status(201)
      .json({ message: 'Question created successfully', question });
  } catch (error) {
    console.error('Error creating question:', error.message);

    // Handle server errors
    res.status(500).json({ message: 'Error creating question' });
  }
};

// Controller to delete a question
export const deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate that question ID is provided
    if (!id) {
      return res.status(400).json({ message: 'Question ID is required' });
    }

    // Find the question and populate its options
    const question = await Question.findById(id).populate('options');

    // If question not found, return 404
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    // Check if any option has votes
    const hasVotes = question.options.some((option) => option.votes > 0);

    // Prevent deletion if any option has votes
    if (hasVotes) {
      return res
        .status(400)
        .json({ message: 'Cannot delete question with votes' });
    }

    // Delete all options related to the question
    await Option.deleteMany({ question: question._id });
    // Delete the question itself
    await Question.findByIdAndDelete(id);

    // Respond with success
    res.status(200).json({ message: 'Question deleted successfully' });
  } catch (error) {
    console.error('Error deleting question:', error.message);

    // Handle server errors
    res.status(500).json({ message: 'Error deleting question' });
  }
};

// Controller to view a question and its options
export const viewQuestion = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate that question ID is provided
    if (!id) {
      return res.status(400).json({ message: 'Question ID is required' });
    }

    // Find the question and populate its options
    const question = await Question.findById(id).populate('options');

    // If question not found, return 404
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    // Construct base URL for links
    const baseUrl = `${req.protocol}://${req.get('host')}`;

    // Map options to include voting link
    const options = question.options.map((option) => ({
      id: option._id,
      title: option.title,
      votes: option.votes,
      link_to_vote: `${baseUrl}/options/${option._id}/add_vote`,
      link_to_delete: `${baseUrl}/options/${option._id}/delete`,
    }));

    // Respond with question details and helpful links
    res.status(200).json({
      id: question._id,
      title: question.title,
      options,
      link_to_delete: `${baseUrl}/questions/${question._id}/delete`,
      link_to_add_option: `${baseUrl}/questions/${question._id}/options/create`,
    });
  } catch (error) {
    console.error('Error viewing question:', error.message);

    // Handle server errors
    res.status(500).json({ message: 'Error viewing question' });
  }
};

export const viewAllQuestions = async (req, res) => {
  try {
    // Fetch all questions from the database
    const questions = await Question.find().populate('options');

    // Construct base URL for links
    const baseUrl = `${req.protocol}://${req.get('host')}`;

    // Map questions to include links
    const mappedQuestions = questions.map((question) => ({
      id: question._id,
      title: question.title,
      options: question.options.map((option) => ({
        id: option._id,
        title: option.title,
        votes: option.votes,
      })),
      link_to_view: `${baseUrl}/questions/${question._id}`,
      link_to_delete: `${baseUrl}/questions/${question._id}/delete`,
      link_to_add_option: `${baseUrl}/questions/${question._id}/options/create`,
    }));

    // Respond with all questions and their links
    res.status(200).json(mappedQuestions);
  } catch (error) {
    console.error('Error viewing all questions:', error.message);

    // Handle server errors
    res.status(500).json({ message: 'Error viewing all questions' });
  }
};
