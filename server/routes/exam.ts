import express from 'express';
import { addExam, getUpcomingExmasOfTecher } from '../handlers/exam';
const router = express.Router();

/* prefixed with `/v1/api/exam` */
router.post('/', addExam).get('/teacher/:teacherId', getUpcomingExmasOfTecher);
export default router;
