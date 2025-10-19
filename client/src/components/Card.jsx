import Markdown from 'markdown-to-jsx';
import React from 'react';
import { Link } from 'react-router-dom';
import {AiOutlineArrowRight} from "react-icons/ai"

const Card = ({post, index}) => {
    return (
        <div className='w-full flex flex-col gap-8 items-center rounded
        md:flex-row '>
         
        <Link to = {`/${post?.slug}/${post._id}`} className='w-full
         md:w-2/4 h-64'>
         <img
          src={post?.img} 
          alt={post?.title}
          className='object-cover
         w-full h-full rounded'/>
         </Link>
         <div className='w-full md:w-2/4 flex flex-col gap-3'>
         <div className='flex gap-2'>
          <span className='text-sm text-gray-600'>{new Date (post?.createdAt).toDateString()}</span>
         </div>
           <span className='text-sm text-rose-600 font-semibold'>{post?.cat}</span>

         <h6 className='text-xl 2xl:text-3xl font-serif text-black
         dark:text-white'>
            {post?.title}
         </h6>

         <div className='flex-1 overflow-hidden text-gray-600
          dark:text-slate-500 text-sm text-justify'>
        <Markdown options={{ wrapper: "article" }}>
         {post?.desc?.slice(0, 250) + "...."}
         </Markdown>
          </div>

           <Link
            to={`/${post?.slug}/${post?._id}`}
            className='flex items-center gap-2
          text-black dark:text-white' >
            
          <span> Read More</span>
          <AiOutlineArrowRight />
          </Link>

         </div>
         </div>
    );
};       

export default Card;