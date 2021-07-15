import express from 'express';
import { getLatestSongs, searchBatch, searchUser } from '../handlers/search';
import verifyTokenAdmin from '../middlewares/auth/verifyTokenAdmin';
const router = express.Router();

/* Prefixed with `v1/api/search` */
router
  .post('/user', verifyTokenAdmin, searchUser)
  .post('/batch', verifyTokenAdmin, searchBatch);

export default router;
