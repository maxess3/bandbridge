import prisma from "../db/db.config.js";

export const createPost = async (req, res) => {
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

  return res.json({ status: 200, data: newPost, msg: "Post created." });
};
