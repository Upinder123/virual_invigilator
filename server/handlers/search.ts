import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
const db = require('../models');

export async function searchUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { searchString, roles } = req.body;

    if (!searchString)
      return next({
        status: 400,
        message: 'Search String is mandatory!',
      });

    const allowedRoles = ['admin', 'student', 'teacher'];

    const rolesNotToSearch = allowedRoles.filter(
      role => !roles.includes(role)
    ) || ['admin'];
    console.log('rolesNotToSearch', rolesNotToSearch);
    console.log(
      'filter',
      allowedRoles.filter(role => !roles.includes(role))
    );

    /*
     * Find all users which have either name 'or' email as the queryString, AND
     * whose roles' elements are not in roles not to match
     * (since if we do elemens having roles, we can get unexpected result)
     * Ex roles: [ 'admin', 'student' ] will match query for users which are 'student'
     */
    const result = await db.User.find(
      {
        $and: [
          {
            $or: [
              { name: { $regex: searchString, $options: '$i' } },
              { email: { $regex: searchString, $options: '$i' } },
            ],
          },
          {
            roles: { $elemMatch: { $nin: rolesNotToSearch } },
          },
        ],
      },
      { password: 0 }
    );

    return res.status(200).json(result);
  } catch (error) {
    console.log(error);

    return next(error);
  }
}

export async function searchBatch(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { searchString } = req.body;

    if (!searchString)
      return next({
        status: 400,
        message: 'Search String is mandatory!',
      });

    /* finding song that matches either of the criterias and that too using regex (search string) */
    const result = await db.Batch.find(
      {
        $or: [{ name: { $regex: searchString, $options: '$i' } }],
      },
      { users: 0, subjects: 0, exams: 0, end: 0 }
    );

    return res.status(200).json(result);
  } catch (error) {
    console.log(error);

    return next(error);
  }
}

export async function getLatestSongs(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const result = await db.Song.find().sort({ uploadDate: -1 }).limit(10);
    return res.status(200).json(result);
  } catch (err) {
    console.log(err);

    return next(err);
  }
}
