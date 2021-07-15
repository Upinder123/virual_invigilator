import jwtDecode, { JwtPayload } from 'jwt-decode';

const checkAuth = () => {
  try {
    const TOKEN_KEY = process.env.REACT_APP_TOKEN_KEY;

    if (!TOKEN_KEY) return false;

    const token = localStorage.getItem(TOKEN_KEY);

    if (!token) return false;

    const { exp } = jwtDecode<JwtPayload>(token);

    /* Check token expiry */
    if (!exp || exp < new Date().getTime() / 1000) return false;
  } catch (e) {
    /* Throws an error when token is not valid */
    console.log(e);
    return false;
  }

  return true;
};

export default checkAuth;
