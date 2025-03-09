import jwt, { Secret, SignOptions } from "jsonwebtoken";

export const generateAccessToken = (id: string): string => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET as Secret,
    { expiresIn: process.env.JWT_EXPIRE || "15m" } as SignOptions
  );
};

export const generateRefreshToken = (id: string): string => {
  return jwt.sign(
    { id },
    process.env.REFRESH_TOKEN_SECRET as Secret,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRE || "7d" } as SignOptions
  );
};

export const verifyToken = (token: string, secret: string): any => {
  try {
    return jwt.verify(token, secret as Secret);
  } catch (error) {
    return null;
  }
};
