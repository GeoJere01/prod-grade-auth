import { Request, Response } from "express";
import { registerSchema } from "./auth.schema";
import { User } from "../../models/user.model";
import { hashPassword } from "../../lib/hash";
import jwt from "jsonwebtoken";
import { sendEmail } from "../../lib/email";

function getAppUrl() {
  return process.env.APP_URL || `http://localhost:${process.env.PORT}`;
}

export const registerHandler = async (req: Request, res: Response) => {
  try {
    // Validate the data from the user data
    const result = registerSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid input format",
        error: result.error.flatten,
      });
    }

    const { email, password, name } = result.data;

    const normalisedEmail = email.toLowerCase().trim();

    const isExisting = await User.findOne({ email: normalisedEmail });

    if (isExisting) {
      return res.status(409).json({
        success: false,
        message: "Email already in USE! Please try different email address.",
      });
    }

    // If user user is not present, hash the password
    const passwordHash = await hashPassword(password);

    // Create a newUser
    const newlyCreatedUser = await User.create({
      email,
      passwordHash,
      isEmailVerified: false,
      name,
    });

    // Email verification
    const verifyToken = jwt.sign(
      {
        id: newlyCreatedUser.id,
      },
      process.env.JWT_ACCESS_SECRET!,
      {
        expiresIn: "1d",
      },
    );

    const verifyUrl = `${getAppUrl}/auth/verify-email?token=${verifyToken}`;

    await sendEmail(
      newlyCreatedUser.email,
      "Verify your email",
      `<p>Please verify your email by clicking this link</p>
      <p><a href="${verifyUrl}">${verifyUrl}</a></p>`,
    );

    return res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newlyCreatedUser.id,
        email: newlyCreatedUser.email,
        role: newlyCreatedUser.role,
        isEmailVerified: newlyCreatedUser.isEmailVerified,
      },
    });
  } catch (error) {}
};
