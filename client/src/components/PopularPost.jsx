import React from "react"
import { CATEGORIES } from "../utils/dummyData";
import { Link } from 'react-router-dom';

const PopularPost = ({posts}) => {
    const Card = ({post}) => {
        let catColor = "";
        CATEGORIES.map((cat) => {
            if (cat.label === post?.cat) {
                catColor = cat?.color;
            }
            return null;
        });

        return <div className="flex gap-2 items-center">
            <img 
            src={post?.img} 
            alt={post?.title} 
            className="w-12 h-12 rounded-full object-cover"
            />

            <div className="w-full flex flex-col gap-1">
                <span className={`${catColor} w-fit rounded-full px-2 py-0.5
                text-white text-[12px] 2xl:text-sm`}
                >
                    {post.cat}
                    </span>
                <Link to = {`/${post?.slug}/${post?._id}`} className='text-black dark:text-white
                '>
                    {post?.title}
                </Link>    

                <div className="flex gap-2 text-sm text-gray-500">
                    <span className="font-medium">{post?.user?.name}</span>
                    <span className="">
                        {new Date(post?.createdAt).toDateString()}
                    </span>

                </div>

            </div>
        </div>;
    }
    return <div className="w-full flex flex-col gap-8">
    <p className="text-xl font-bold -mb-6 text-gray-600
    dark:text-white">
        Popular Posts
        </p>

        {
            posts?.map((post) => (
                <Card post={post} key={post?._id} />
            
             ))
        }
    </div>;
};

export default PopularPost;