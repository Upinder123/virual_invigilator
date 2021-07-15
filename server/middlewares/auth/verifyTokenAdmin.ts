import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { getTokenAndSecret } from './getTokenAndSecret';
import { verify } from './checkToken';
/*
 * TOKEN FORMAT
 * Bearer <access_token>
 *
 */

interface RequestWithToken extends Request {
  token?: string;
}

const verifyTokenAdmin = async (
  req: RequestWithToken,
  res: Response,
  next: NextFunction
) => {
  try {
    const { token, SECRET_KEY, error } = getTokenAndSecret(req);

    if (!token || !SECRET_KEY || error) return next(error);

    const verificationResult = await verify(token, SECRET_KEY, true);
    console.log('verificationResult', verificationResult);

    if (!verificationResult)
      return next({
        // 403 - Forbidden
        status: 403,
        message: 'Forbidden',
      });

    req.token = token;
    next();
  } catch (e) {
    /* Token is not valid then it will throw an error */
    console.log('e', e);

    return next({
      // 403 - Forbidden
      status: 403,
      message: 'Forbidden',
      info: e,
    });
  }
};

export default verifyTokenAdmin;
