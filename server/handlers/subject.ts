import { NextFunction, Request, Response } from 'express';
const db = require('../models');

export const addSubject = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name: subjectName, compulsory: isCompulsory } = req.body;

    if (!subjectName)
      return next({
        status: 400,
        message: 'No subject name passed for creation!',
      });

    const subject = await db.Subject.create({
      name: subjectName,
      compulsory: isCompulsory,
    });
    const { _id, name, compulsory } = subject;
    res.status(200).json({
      subject: {
        _id,
        name,
        compulsory,
      },
    });
  } catch (e) {
    console.log(e);

    if (e.code === 11000) {
      e.message = 'Subject names should be unique!';
    }
    return next(e);
  }
};

export const getSubjectsOfUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name: subjectName, compulsory: isCompulsory } = req.body;

    if (!subjectName)
      return next({
        status: 400,
        message: 'No subject name passed for creation!',
      });

    const subject = await db.Subject.create({
      name: subjectName,
      compulsory: isCompulsory,
    });
    const { _id, name, compulsory } = subject;
    res.status(200).json({
      subject: {
        _id,
        name,
        compulsory,
      },
    });
  } catch (e) {
    console.log(e);

    if (e.code === 11000) {
      e.message = 'Subject names should be unique!';
    }
    return next(e);
  }
};
