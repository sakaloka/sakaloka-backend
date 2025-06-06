import HapiAuthJwt2 from 'hapi-auth-jwt2';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const validate = async (decoded, request, h) => {
  return { isValid: true };
};

export default {
  name: 'auth-jwt',
  register: async (server) => {
    await server.register(HapiAuthJwt2);
    server.auth.strategy('jwt', 'jwt', {
      key: process.env.JWT_SECRET,
      validate,
      verifyOptions: { algorithms: ['HS256'] },
    });
    server.auth.default('jwt');
  },
};