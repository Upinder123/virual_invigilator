import express from 'express';
import { addBatch, addSubjectToBatch, addUser } from '../handlers/batch';
const router = express.Router();

/* Prefixed with `/v1/api/batch` */
router
  /* Add a new batch */
  .post('/', addBatch)
  /* Add a user to a batch */
  .put('/user', addUser)
  /* Add a new subject to a batch */
  .put('/subject', addSubjectToBatch);

export default router;
