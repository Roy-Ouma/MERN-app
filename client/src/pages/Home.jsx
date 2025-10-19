import React, { useState } from "react";
import { CATEGORIES, popular, posts } from "../utils/dummyData";
import Banner from "../components/Banner";
import { Link } from "react-router-dom";
import Card from "../components/Card";
import Pagination from '../components/Pagination';
import PopularPost from "../components/PopularPost";
import PopularWriter from "../components/PopularWriter";


const Home = () => {
  const numOfPages = 10;
  const [page, setPage] = useState(1);
  const randomIndex = Math.floor(Math.random() * posts.length);
  const handlePageChange = (val) => {
    setPage(val);
  };

  if (posts.length < 1)
    return (
      <div className="w-full h-full px-8 flex place-items-centre justify-center">
        <span className="text-lg text-slate-500">No Post Available</span>

      </div>
    );

  return (
    <React.Fragment>
      <div className="py-10 2xl:py-5">
        <Banner post={posts[randomIndex]} />
        <div className="px-0 lg:pl-20 2xl:px-20">
          {/* categories */}
          <div className="mt-6 md:mt-0">
            <p className="text-2xl font-semibold text-gray-600 dark:text-white">Popular Categories</p>
            <div className="w-full flex flex-wrap py-10  gap-8">
              {CATEGORIES.map((cat) => (
                <Link
                  to = {`/category?cat=${cat.label}`}
                  key={cat.id || cat.label}
                  className={`flex items-center justify-center gap-3 ${cat.color} text-white font-semibold text-base px-4 py-2 rounded cursor-pointer`}
                  
                >
                  {cat.icon}
                  <span>{cat.label}</span>
                </Link>
              ))}
            </div>
          </div>
          {/* posts */}
          <div className="w-full flex flex-col md:flex-row gap-10 2xl:gap-20">
            {/* Left side */}
            <div className="w-full md:w-2/3 flex flex-col gap-10 gap-y-20">
              {posts?.map((post, index) => (
                <Card key={post?._id} post={post} index={index} />
              ))}
              <div className="w-full flex items-center justify-center">
                {/*<Pagination totalPages={numOfPages} onPageChange={handlePageChange}/> */}
                <Pagination 
                totalPages={numOfPages}
                 onPageChange={handlePageChange} />
              </div>
            </div>
            {/* Right Side */}
            <div className="w-full md:w-1/4 flex flex-col gap-y-12">
              {/* Popular post */}
              <PopularPost posts={popular?.posts} />
              {/* Popular writers */}
              <PopularWriter data={popular?.writers} />
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Home;
