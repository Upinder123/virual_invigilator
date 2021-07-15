import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { checkValidObjectId } from '../helpers/checkValidObjectID';
import { IBatch } from '../models/batch';
import { IUser } from '../models/user';
const db = require('../models');

export const addBatch = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, start, end } = req.body;

    if (!name || !start)
      return next({
        status: 400,
        message: "Batch's Name and starting date are mandatory!",
      });

    const batch = await db.Batch.create({ name, start, end });
    return res.status(200).json(batch);
  } catch (e) {
    // See what kind of error
    /* If validation fails */
    if (e.code === 11000) {
      e.message = 'Sorry, that batch already exists!';
    }

    console.log('batch error: ', e.message);
    return next({
      message: e.message,
      status: e.code === 11000 ? 400 : e.code,
    });
  }
};

export const addUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId, batchId } = req.body;

    if (!userId || !batchId)
      return next({
        status: 400,
        /* keys `batchId` and `userId` are mandatory to add a user to a batch */
        message: 'Batch and User are mandatory to add a user to a batch',
      });

    if (!checkValidObjectId([userId, batchId]))
      return next({
        status: 400,
        message: 'Invalid User / Batch provided!',
      });

    const batch = await db.Batch.findOne({ _id: batchId });
    if (!batch)
      return next({
        status: 404,
        message: 'given batch does not exist!',
      });

    const user = await db.User.findOne({ _id: userId });
    if (!user)
      return next({
        status: 404,
        message: 'given user does not exist!',
      });

    if (batch.users && batch.users.includes(userId))
      return next({
        status: 400,
        message: 'Given user already exits in the batch!',
      });

    /* A user cannot have multiple batches if a student */
    if (
      user.batches &&
      user.batches.length > 0 &&
      user.roles.includes('student')
    )
      return next({
        status: 400,
        message: 'A student cannot be added to multiple batches!',
      });

    batch.users.push(user);
    batch.save();

    user.batches.push(batch);
    user.save();

    return res.status(200).json({
      batch,
    });
  } catch (e) {
    console.log(e);
    console.log(e.code);
    return next(e);
  }
};

export const addSubjectToBatch = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { subjectId, batchId } = req.body;

    if (!subjectId || !batchId)
      return next({
        status: 400,
        message:
          /* 'Keys `batchId` and `subjectId` are mandatory to add a subject to a batch' */
          'Batch and Subject are mandatory to add a subject to a batch',
      });

    if (!checkValidObjectId([subjectId, batchId]))
      return next({
        status: 400,
        message: 'Invalid User / Subject provided!',
      });

    const batch = await db.Batch.findOne({ _id: batchId });
    if (!batch)
      return next({
        status: 404,
        message: 'given batch does not exist!',
      });

    const subject = await db.Subject.findOne({ _id: subjectId });
    if (!subject)
      return next({
        status: 404,
        message: 'given subject does not exist!',
      });

    if (batch.subjects && batch.subjects.includes(subjectId))
      return next({
        status: 400,
        message: 'Given subject already exits in the batch!',
      });

    batch.subjects.push(subject);
    batch.save();

    subject.batches.push(batch);
    subject.save();

    return res.status(200).json({ batch });
  } catch (e) {
    console.log(e);
    return next(e);
  }
};
