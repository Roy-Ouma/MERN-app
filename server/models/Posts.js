import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "Users", required: true },
    title: { type: String },
    desc: { type: String },
    img: { type: String },
    slug: { type: String },
    cat: { type: String },
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comments" }],
    views: [{ type: mongoose.Schema.Types.ObjectId, ref: "Views" }],
    status: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Posts = mongoose.model("Posts", postSchema);
export default Posts;