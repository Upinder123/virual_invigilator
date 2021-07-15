import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { verify } from './checkToken';
/*
 * TOKEN FORMAT
 * Bearer <access_token>
 *
 */

interface RequestWithToken extends Request {
  token?: string;
}

/* return {token, SECRET_KEY, error} */
export const getTokenAndSecret = (req: RequestWithToken) => {
  try {
    // Get the auth header value
    const t = req.headers['Authorization'] || req.headers.authorization;

    if (!t || typeof t != 'string') {
      console.log('Authorization header not present or is not string!');
      return {
        token: null,
        SECRET_KEY: null,
        error: {
          // 403 - Forbidden
          status: 403,
          message: 'Forbidden',
        },
      };
    }

    const bearerHeader: string = t;

    // ['Bearer', <access_token>]
    const token = bearerHeader.split(' ')[1];

    /* SECRET_KEY should not be null */
    const SECRET_KEY = process.env.SECRET_KEY;

    if (!SECRET_KEY) {
      console.error('No secret key found! check /server/.env file');

      return {
        token: null,
        SECRET_KEY: null,
        error: {
          status: 500,
          message:
            'SECRET_KEY is not found in env varibales, please provide one!',
        },
      };
    }

    return { token, SECRET_KEY, error: null };
  } catch (e) {
    console.log(e);

    return {
      token: null,
      SECRET_KEY: null,
      error: {
        // 403 - Forbidden
        status: 403,
        message: 'Forbidden',
        info: e,
      },
    };
  }
};
