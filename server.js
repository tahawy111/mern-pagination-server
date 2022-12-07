import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import Post from "./models/Post.js";
import dotenv from "dotenv";
import helmet from "helmet";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
const port = process.env.PORT;
import fs from "fs";

const posts = JSON.parse(fs.readFileSync(`./utils/posts.json`));

app.post("/create", async (req, res) => {
  try {
    await Post.create(posts);
    res.status(200).json({ message: "Data Added" });
  } catch (error) {}
});

app.get("/get", async (req, res) => {
  try {
    const page = +req.query.page || 1;
    const pageSize = +req.query.limit || 12;
    const skip = (page - 1) * pageSize;
    const total = await Post.countDocuments();
    const pages = Math.ceil(total / pageSize);

    if (page > pages) {
      return res.status(200).json({ status: "fail", message: "No page found" });
    }

    const posts = await Post.find().skip(skip).limit(pageSize);

    return res.status(200).json({
      status: "success",
      countCurrentPages: posts.length,
      page,
      pages,
      data: posts,
      total,
    });
  } catch (error) {
    return res.status(400).json({ status: "error", message: "server error" });
  }
});

mongoose.connect(process.env.MONGO_URI, () => console.log("DB Connected"));
app.listen(port, () => console.log("Server is running on port", port));
