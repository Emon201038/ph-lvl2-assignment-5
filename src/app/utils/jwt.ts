import jwt, { JwtPayload as JWTPayload, SignOptions } from "jsonwebtoken";

export interface JwtPayload extends JWTPayload {
  userId: string;
  role: string;
  email: string;
  iat?: number;
  exp?: number;
}

export const generateJwt = (payload: JwtPayload, secret: string, expiresIn?: string) => jwt.sign(payload, secret, {
  expiresIn
} as SignOptions);

export const verifyJwt = (token: string, secret: string) => jwt.verify(token, secret);

