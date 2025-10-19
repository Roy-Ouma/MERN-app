
import React, { useState } from "react";
import { posts } from "../utils/dummyData";
import Card from "../components/Card";
import Pagination from "../components/Pagination";
import PopularPost from "../components/PopularPost";
import PopularWriter from "../components/PopularWriter";
import { popular } from "../utils/dummyData";
const CategoriesPage = () => {
  const query = new URLSearchParams(window.location.search).get ("cat");
    const numOfPages = 10;
      const [page, setPage] = useState(1);
  
  const handlePageChange = (val) => {
    setPage(val);
  };

  
  return <div className="px-0 2xl:px-20">
    <div className="py-5">
      <h2 className="text-4xl 2xl:text-5xl font-semibold
      text-slate-800 dark:text-white">
        {query}
      </h2>
    </div>

    <div className='w-full flex flex-col md:flex-row gap-10 2xl:gap-20'>
      {/* Add category content here */}

      <div className="w-full md:w-2/3 flex flex-col gap-10 gap-y-20">
        {posts?.length === 0 ? (
          <div className="w-full h-full py-8 flex justify-center">
            <span className="text-lg text-slate-500">
              No Post Available For This Category
            </span>
          </div>
        ) : (
          <>
            {posts?.map((post, index) => (
              <Card key={post?._id} post={post} index={index} />
            ))}
            <div className="w-full flex items-center justify-center">
              <Pagination 
                totalPages={numOfPages}
                onPageChange={handlePageChange}
              />
            </div>
          </>
        )}
      </div>
      {/* Right Side (same as Home.jsx) */}
      <div className="w-full md:w-1/4 flex flex-col gap-y-12">
        <PopularPost posts={popular?.posts} />
        <PopularWriter data={popular?.writers} />
      </div>
  </div>
  </div>;
};

export default CategoriesPage;
