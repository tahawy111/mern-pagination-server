import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  title: String,
  author: String,
  body: String,
});

export default mongoose.model("post", postSchema);
