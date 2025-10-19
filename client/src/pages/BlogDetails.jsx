import useStore from "../store";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { posts } from "../utils/dummyData";
import { Link } from "react-router-dom";
import PopularPost from "../components/PopularPost";
import PopularWriter from "../components/PopularWriter";
import { popular } from "../utils/dummyData";
import Markdown from "markdown-to-jsx";
import PostComments from "../components/PostComments";

const BlogDetails = () => {
 const {setIsLoading} = useStore();

 const { id } = useParams();
 const [post, setPost] = useState(posts[1]);

 useEffect(() => {
  if (id) {
    //fetch post by id
    window.scrollTo({top: 0, left: 0, behavior: 'smooth'});
  }
 }, [id]);

 if (!post) {
  return <div className="w-full h-full py-8 flex items-center justify-center">
    <span className="text-xl text-slate-500">Loading...</span>
  </div>;
 }
 
  return <div className="w-full px-0 md:px-10 py-8 2xl:px-20">
    <div className="w-full flex flex-col-reverse md:flex-row gap-2 gap-y-5 items-center">
     <div className="w-full md:w-1/2 flex flex-col gap-8">
      <h1 className="text-3xl md:text-5xl font-bold text-slate-800 dark:text-white">
        {post?.title}
      </h1>
      <div className="w-full flex items-center">
        <span className="flex-1 text-rose-600 font-semibold">
          {post?.cat}
        </span>
        <span className="flex flex-1 items-baseline text-2xl font-medium text-slate-700 dark:text-gray-400">
          {post?.views?.length || 0}
          <span className="text-base text-rose-600">Views</span>
        </span>
      </div>
       <Link to = {'/writer/${post?.user?._id}'} className="flex 
        gap-3">
          <img
             src = {post?.user?.image}
             alt = {post?.user?.name}
             className = 'object-cover w-12 h-12 rounded-full'
          />
          <div className = ''>
            <p className="text-slate-800 dark:text-white 
            font-medium">
              {post?.user?.name}
              </p>
              <span className="text-slate-600">
                {new Date(post?.createdAt).toDateString()}
              </span>
          </div>
       </Link>

     </div>
     <img src={post?.img} alt={post?.title} className="w-full md:w-1/2 rounded-lg object-cover h-auto md:h-[360px] 2xl:h-[460px]" />
    </div>
    <div className='w-full flex flex-col md:flex-row gap-10 mt-10'>
      {/**Left*/}
      <div className='w-full flex flex-col text-black dark:text-gray-500'>
        {post?.desc && 
        (
          <Markdown
          options={{wrapper: 'article'}}
          className = 'leading-[3rem] text-base 2xl:text-[20px]'
          >
            {post?.desc}
          </Markdown>
        )}

        {/**COMMENTS */}
      <div className="w-full">
        <PostComments postId={id} /> 
      </div>
      </div>
      {/* RIGHT */}
      <div className="w-full md:w-1/4 flex flex-col gap-y-12">
        <PopularPost posts={popular?.posts} />
        <PopularWriter data={popular?.writers} />
      </div>
    </div>
  </div>;
};

export default BlogDetails;
