// Load env var
require('dotenv').config();

import express from 'express';
import cors from 'cors';
import CustomError from './@types/error';
import errorHandler from './handlers/error';
import examRoutes from './routes/exam';
import authRoutes from './routes/auth';
import subjectRoutes from './routes/subject';
import batchRoutes from './routes/batch';
import searchRoutes from './routes/search';

const app = express();

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/v1/api/auth', authRoutes);
app.use('/v1/api/exam', examRoutes);
app.use('/v1/api/subject', subjectRoutes);
app.use('/v1/api/batch', batchRoutes);
app.use('/v1/api/user', authRoutes);
app.use('/v1/api/search', searchRoutes);

/* WHEN NO ROUTE SATISFY THE GIVEN CONDITION */
app.use((req, res, next) => {
  const error: CustomError = new Error('Not Found');
  error.status = 404;
  next(error);
});

/* Use our little generic error handler */
app.use(errorHandler);

app.listen(PORT, () => console.log(`Server started on PORT ${PORT}`));
