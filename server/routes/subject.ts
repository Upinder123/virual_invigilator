import express from 'express';
import { addSubject } from '../handlers/subject';

const Router = express.Router();

/* prefixed with `/v1/api/subject` */
Router.post('/', addSubject);
export default Router;
