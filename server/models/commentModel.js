import mongoose from "mongoose";

const { Schema } = mongoose;

const commentSchema = new Schema({
    user: {type: Schema.Types.ObjectId, ref: "Users", required: true},
    post: {type: Schema.Types.ObjectId, ref: "Posts", required: true},
    desc: {type: String},
}, {timestamps: true});

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;