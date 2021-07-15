import jwt from 'jsonwebtoken';

export const verify = async (
  token: string,
  SECRET_KEY: string,
  verifyAdmin: boolean
) => {
  const v = () =>
    new Promise((resolve, reject) => {
      jwt.verify(token, SECRET_KEY, (authError, authData: any) => {
        if (authError) reject(authError);

        // console.log('authData', authData);

        // console.log(
        //   !authData ||
        //     !authData.roles ||
        //     !Array.isArray(!authData.roles) ||
        //     !authData.roles.includes('admin')
        // );

        // console.log('!authData.roles', !authData.roles);
        // console.log(
        //   '!Array.isArray(!authData.roles)',
        //   !Array.isArray(authData.roles)
        // );
        // console.log(
        //   '!authData.roles.includes("admin")',
        //   !authData.roles.includes('admin')
        // );

        if (
          verifyAdmin &&
          (!authData ||
            !authData.roles ||
            !Array.isArray(authData.roles) ||
            !authData.roles.includes('admin'))
        ) {
          console.log('user is not admin');
          resolve(false);
        }
      });

      resolve(true);
    });

  const result = await v();

  return result;
};
