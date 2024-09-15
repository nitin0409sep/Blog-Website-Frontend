import React from "react";
import "./ViewPost.css";
import { useQuery } from 'react-query';
import { fetchUserPosts } from "../../../utils/Services/Posts.service";
import { GlobalLoader } from "../../../common/Loader";
import Error from "../../../common/Error";
import { Post } from "../../../utils/interfaces/Post.interface";

const ViewPost = () => {
  const { data: posts, isLoading, isError, error } = useQuery("user-post", fetchUserPosts, {
    select: (data) => {
      return data.data.posts;
    },
  })

  if (isLoading) {
    return <GlobalLoader />;
  }

  if (isError) {
    console.log(error);
    return <Error />;
  }


  return (
    <div className="outer-container">
      <div className="gridcontainer">
        {posts?.map((post: Post, index: number) => (
          <div className="griditem" key={post.post_id || index}>
            <div className="innergrid">

              {/* Post Image */}
              <div className="innergriditem innergriditem1">
                <img
                  src={post.img_url}
                  alt="Post image"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null; // Prevent loop if fallback fails
                    target.src = "/no-image.svg";
                  }}
                />
              </div>

              {/* Post Name */}
              <div className="innergriditem innergriditem2 text-pink-600 font-bold font-serif">
                {post.post_name}
              </div>

              {/* Post Description */}
              <div className="innergriditem innergriditem3">
                {post.post_desc}
              </div>

              {/* Read Article Button */}
              <div
                className="innergriditem4 bg-blue-400 text-white font-medium font-serif cursor-pointer
                     hover:transform hover:transition-all hover:duration-500 hover:ease-in-out hover:rounded-t-none rounded-br-xl rounded-bl-xl
                    hover:scale-100 justify-center hover:bg-slate-100 hover:text-blue-400"
              >
                <span>Read Full Article</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewPost;
