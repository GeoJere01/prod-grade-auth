import { Request, Response } from "express";
import { registerSchema } from "./auth.schema";
import { User } from "../../models/user.model";
import bcrypt from "bcryptjs";

const registerHandler = async (req: Request, res: Response) => {
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
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  // Create a newUser
  const newlyCreatedUser = User.create({
    email,
    passwordHash,
    isEmailVerified: false,
  });
};
