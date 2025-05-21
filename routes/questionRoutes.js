import express from 'express';
import {
  createQuestion,
  deleteQuestion,
  viewAllQuestions,
  viewQuestion,
} from '../controllers/questionController.js';

import { createOption } from '../controllers/optionController.js';

const router = express.Router();

//create a new question
router.post('/create', createQuestion);

//delete a question
router.delete('/:id/delete', deleteQuestion);

//get a question by id
router.get('/:id', viewQuestion);

//get all questions
router.get('/', viewAllQuestions);

//create a new option for a question
router.post('/:id/options/create', createOption);

export default router;
