import express from 'express';
import { deleteOption, addVote } from '../controllers/optionController.js';

const router = express.Router();

// Route to delete an option
router.delete('/:id/delete', deleteOption);

// Route to add a vote to an option
router.post('/:id/add_vote', addVote);

export default router;
