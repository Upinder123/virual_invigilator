import express from 'express';
const router = express.Router();
import {
  addSubjectToUserIfNotCompulsoryOrUserIsNotStudent,
  getAllUsers,
  signIn,
  signUp,
} from '../handlers/auth';
import verifyToken from '../middlewares';
import verifyTokenAdmin from '../middlewares/auth/verifyTokenAdmin';

/* Use this function if this route is encountered */
/* Prefixed with `/v1/api/user` */
router
  .post('/signup', signUp)
  .post('/signin', signIn)
  .get('/users', verifyTokenAdmin, getAllUsers)
  /* Assign new subject to user */
  .put('/subject', addSubjectToUserIfNotCompulsoryOrUserIsNotStudent);

export default router;
