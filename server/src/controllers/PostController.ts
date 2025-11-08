import prisma from "../db/db.config";
import { Request, Response } from "express";

/**
 * Creates a new post.
 *
 * @param req - Express request object containing post data in body
 * @param res - Express response object
 * @returns The created post data
 */
export const createPost = async (req: Request, res: Response) => {
  const { user_id, country, department, city, title, content } = req.body;

  const newPost = await prisma.post.create({
    data: {
      user_id: String(user_id),
      country,
      department,
      city,
      title,
      content,
    },
  });

  res.status(200).json({ data: newPost, message: "Post created." });
};
