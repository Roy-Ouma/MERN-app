import express from 'express';
import { userAuth } from '../middleware/authMiddleware.js';
import { createPost,
     getFollowers,
      getPostContent,
       stats,commentPost
        , updatePost, 
        getPosts,
         getPopularContents,
          getPost,
     getComments,
      deletePost,
       deleteComment} from '../controllers/postController.js';

const router = express.Router();

// Controller functions (to be implemented)
//ADMIN ROUTES

router.post("/admin-analytics", userAuth, stats);
router.post("/admin-followers", userAuth, getFollowers);
router.post("/admin-content", userAuth, getPostContent);
router.post("/create-post", userAuth, createPost);

//LIKE & COMMENT ON POST
router.post("/comment/:id", userAuth, commentPost);


//UPDATE POST
router.patch("/update/:id", userAuth, updatePost);

//GET A POST
router.get("/", getPosts);
router.get("/popular", getPopularContents);
router.get("/postId", getPost);
router.get("/comments/:postId", getComments);


//DELETE POST
router.delete("/:id", userAuth, deletePost);
router.delete("/comment/:id/:postId", userAuth, deleteComment);

export default router;