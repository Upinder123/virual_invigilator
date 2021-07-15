import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { checkValidObjectId } from '../helpers/checkValidObjectID';
import checkValidRole from '../helpers/checkValidRole';
import { validateEmail } from '../helpers/validateEmail';
const db = require('../models');

export async function signIn(req: Request, res: Response, next: NextFunction) {
  try {
    // Finding a user
    const { email, password } = req.body;

    if (!email || !password) {
      return next({
        status: 400,
        message: 'Email and Password are mandatory!',
      });
    }

    if (!validateEmail(email))
      return next({
        status: 400,
        message: 'Email Provided is not valid!',
      });

    const user = await db.User.findOne({ email });

    // If no user found
    if (!user)
      return next({
        status: 404,
        message: 'You have to sign up first!',
      });

    const { _id, profileImageURL, isAdmin, roles } = user;

    /* Comare Password
     * We added a utility `comparePassword` function to each User
     */
    const isMatch = await user.comparePassword(password);

    if (isMatch) {
      const token = jwt.sign(
        { email, profileImageURL, isAdmin, roles },
        process.env.SECRET_KEY!,
        {
          expiresIn: '7d',
        }
      );

      return res
        .status(200)
        .json({ _id, email, token, profileImageURL, isAdmin, roles });
    } else {
      return next({
        // 401 - Unauthorized
        status: 401,
        message: 'Invalid Credentials',
      });
    }
  } catch (error) {
    return next(error);
  }
}

export async function signUp(req: Request, res: Response, next: NextFunction) {
  try {
    // Create a user
    console.log(req.body);

    const {
      name: reqName,
      email,
      password,
      roles,
      profileImageURL: reqProfileImageURL,
    } = req.body;

    if (!email || !password) {
      return next({
        status: 400,
        message: 'Email and Pawword is mandatory!',
      });
    }

    if (!roles)
      return next({
        status: 400,
        message: 'No roles provided!',
      });

    if (!checkValidRole(roles)) {
      return next({
        status: 400,
        message: 'Invalid roles provided!',
      });
    }

    if (!validateEmail(email))
      return next({
        status: 400,
        message: 'Email Provided is not valid!',
      });

    const alreadyUserExists = await db.User.findOne({ email });
    if (alreadyUserExists)
      return next({
        status: 409,
        message: 'Sorry, that email is already taken!',
      });

    // Create a token (signing a token)
    /* SECRET_KEY should not be null */
    const SECRET_KEY = process.env.SECRET_KEY;

    if (!SECRET_KEY) {
      console.error('No secret key found! check /server/.env file');
      return next({
        status: 500,
        message:
          'SECRET_KEY is not found in env varibales, please provide one!',
      });
    }

    const newUser = await db.User.create(req.body);

    const {
      id,
      name,
      profileImageURL,
      isAdmin,
      email: userEmail,
      roles: userRoles,
    } = newUser;

    const token = jwt.sign(
      {
        id,
        email,
        name: userEmail,
        roles: userRoles,
        profileImageURL,
        isAdmin,
      },
      SECRET_KEY
    );

    return res.status(200).json({
      id,
      name: userEmail,
      roles: userRoles,
      email,
      profileImageURL,
      token,
    });
  } catch (error) {
    // See what kind of error
    /* If validation fails */
    if (error.code === 11000) {
      error.message = 'Sorry, that email is already taken';
    }

    return next({
      status: 400,
      message: error.message,
    });
  }
}

/* Compulsory subjects should be added only to Batch if the user is student */
/* While the Batch's subject can contain the list of all compulsory and non-compulsory subjects */
export async function addSubjectToUserIfNotCompulsoryOrUserIsNotStudent(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    /* This optional third field is when a teacher is being assigned a new subject to teach to the following batches */
    const { userId, subjectId, batchIds } = req.body;

    if (!userId || !subjectId)
      return next({
        status: 400,
        message:
          /* keys `subjectId` and `userId` are mandatory to assign a subject to a student */
          'Subject and User are mandatory to assign a subject to a user',
      });

    if (!checkValidObjectId([userId, subjectId]))
      return next({
        status: 400,
        message: 'Invalid User / Subject provided!',
      });

    const user = await db.User.findOne({ _id: userId });
    if (!user)
      return next({
        status: 404,
        message: 'given user does not exist!',
      });

    if (user.subjects && user.subjects.includes(subjectId))
      return next({
        status: 400,
        message: 'Given user already has that subject!',
      });

    if (!user.batches || user.batches.length === 0)
      return next({
        status: 400,
        message:
          'User should first be assigned to a batch, then assigned subject',
      });

    const subject = await db.Subject.findOne({ _id: subjectId });
    if (!subject)
      return next({
        status: 404,
        message: 'given subject does not exist!',
      });

    /* If given subject is compulsory and given user is a student */
    if (subject.compulsory && user.roles.includes('student'))
      return next({
        status: 400,
        message:
          'Compulsory subjects should be added to the batch, not to individual student!',
      });

    /***  Else if subject is not compulsory ***/

    /* 1. User is a student */
    /* Add subject to user's subject list and add subject to user's batch's subject list */
    /* Compulsory and non-compulsory, both subjects should be present in a Batch Document */
    /* If given user is a student add that non-compulsory subject to list of subjects of batch */
    if (user.roles.includes('student')) {
      // Student is supposed to have only one batch
      const userBatch = await db.Batch.findOne({ _id: user.batches[0] });
      // if that batch does not already has that subject
      /* Maybe there was a student of same batch before this one that was assigned the same non-compulsory subject */
      if (userBatch.subjects && !userBatch.subjects.includes(subjectId)) {
        userBatch.subjects.push(subject);
        userBatch.save();
      }
    } else {
      /* 2. User is not a student */
      /* Add subject to user's subject list and add subject to given batch's subject list */
      /* Teacher can be assigned compulsory subjects too since A teacher may be teacher for multiple batches and he/she is assigned a new subject for given batch(es) */
      // Check valid batchIds given
      if (
        !batchIds ||
        !Array.isArray(batchIds) ||
        !checkValidObjectId(batchIds)
      )
        return next({
          status: 400,
          message: 'Given batch IDs are not valid!',
        });

      /*
       * Check if batch IDs are valid, i.e.,
       * Given user cannot be assigned subjects of a batch which does not belongs to her/him
       */
      const validbatchIds = batchIds.every(id => user.batches.includes(id));

      if (!validbatchIds)
        return next({
          status: 400,
          message:
            'Given user first should be assigned to given batch(es) then subjects should be assigned!',
        });

      // Add given subject to all the given batches
      const q = await db.Batch.updateMany(
        { _id: { $in: batchIds } },
        { $addToSet: { subjects: [subject] } }
      );
      console.log(q);
    }

    // push `non-compulsory` to list of subjects of given user (whether be student or not)
    user.subjects.push(subject);
    user.save();

    return res.status(200).json({ user });
  } catch (error) {
    return next(error);
  }
}

export async function getAllUsers(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const users = await db.User.find();
    console.log(users);

    return res.status(200).json(users);
  } catch (error) {
    return next(error);
  }
}
