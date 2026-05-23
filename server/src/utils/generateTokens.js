import jwt from "jsonwebtoken";

export const generateAccessToken =
  (userId) => {

    return jwt.sign(

      {
        userId:
          Number(userId),
      },

      process.env
        .JWT_ACCESS_SECRET,

      {
        expiresIn:
          process.env
            .ACCESS_TOKEN_EXPIRES ||
          "15m",
      }
    );
  };

export const generateRefreshToken =
  (userId) => {

    return jwt.sign(

      {
        userId:
          Number(userId),
      },

      process.env
        .JWT_REFRESH_SECRET,

      {
        expiresIn:
          process.env
            .REFRESH_TOKEN_EXPIRES ||
          "7d",
      }
    );
  };