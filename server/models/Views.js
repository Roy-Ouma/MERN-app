import mongoose from "mongoose";

const viewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
    post: { type: mongoose.Schema.Types.ObjectId, ref: "Posts" },
  },
  { timestamps: true }
);

const Views = mongoose.model("Views", viewSchema);
export default Views;