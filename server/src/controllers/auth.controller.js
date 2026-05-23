import bcrypt from "bcryptjs";

import { prisma }
from "../config/db.js";

import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/generateTokens.js";

import {
  getISTTime,
} from "../utils/time.js";

export const registerUser =
  async (req, res) => {
    try {

      const {
        name,
        username,
        institute_email,
        password,
        recovery_email,
      } = req.body;

      if (
        !name ||
        !username ||
        !institute_email ||
        !password
      ) {

        return res.status(400).json({
          success: false,
          message:
            "Please fill all required fields",
        });
      }

      const existingUser =
        await prisma.user.findFirst({
          where: {

            OR: [
              {
                institute_email,
              },

              {
                username,
              },
            ],
          },
        });

      if (existingUser) {

        if (
          existingUser.institute_email ===
          institute_email
        ) {

          return res.status(400).json({
            success: false,
            message:
              "Institute email already exists",
          });
        }

        if (
          existingUser.username ===
          username
        ) {

          return res.status(400).json({
            success: false,
            message:
              "Username already taken",
          });
        }
      }

      const hashedPassword =
        await bcrypt.hash(
          password,
          10
        );

      const user =
        await prisma.user.create({
          data: {
            name,
            username,
            institute_email,
            recovery_email,
            password:
              hashedPassword,
          },

          select: {
            id: true,
            name: true,
            username: true,
            institute_email: true,
            recovery_email: true,
            created_at: true,
          },
        });

      const accessToken =
        generateAccessToken(
          user.id
        );

      const refreshToken =
        generateRefreshToken(
          user.id
        );

      await prisma.refreshToken.create({
        data: {

          user_id:
            user.id,

          token:
            refreshToken,

          expires_at:
            new Date(
              Date.now() +
              7 *
                24 *
                60 *
                60 *
                1000
            ),
        },
      });

      return res.status(201).json({
        success: true,
        message:
          "User registered successfully",

        accessToken,

        refreshToken,

        user,
      });

    } catch (error) {

      console.log(error);

      return res.status(500).json({
        success: false,
        message:
          "Server Error",
      });
    }
  };

export const loginUser =
  async (req, res) => {
    try {

      const {
        institute_email,
        password,
      } = req.body;

      if (
        !institute_email ||
        !password
      ) {

        return res.status(400).json({
          success: false,
          message:
            "Please provide institute email and password",
        });
      }

      const user =
        await prisma.user.findUnique({
          where: {
            institute_email,
          },
        });

      if (!user) {

        return res.status(400).json({
          success: false,
          message:
            "Invalid credentials",
        });
      }

      const isPasswordMatched =
        await bcrypt.compare(
          password,
          user.password
        );

      if (
        !isPasswordMatched
      ) {

        return res.status(400).json({
          success: false,
          message:
            "Invalid credentials",
        });
      }

      await prisma.user.update({
        where: {
          id: user.id,
        },

        data: {
          last_login:
            getISTTime(),
        },
      });

      const accessToken =
        generateAccessToken(
          user.id
        );

      const refreshToken =
        generateRefreshToken(
          user.id
        );

      await prisma.refreshToken.create({
        data: {

          user_id:
            user.id,

          token:
            refreshToken,

          expires_at:
            new Date(
              Date.now() +
              7 *
                24 *
                60 *
                60 *
                1000
            ),
        },
      });

      return res.status(200).json({
        success: true,
        message:
          "Login successful",

        accessToken,

        refreshToken,

        user: {
          id: user.id,
          name: user.name,
          username:
            user.username,

          institute_email:
            user.institute_email,

          recovery_email:
            user.recovery_email,
        },
      });

    } catch (error) {

      console.log(error);

      return res.status(500).json({
        success: false,
        message:
          "Server Error",
      });
    }
  };