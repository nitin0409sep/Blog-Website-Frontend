import React from "react";
import "./ViewPost.css";
import { useQuery } from 'react-query';
import { GlobalLoader } from "../../../common/Loader";
import Error from "../../../common/Error";
import { Post } from "../../../utils/interfaces/Post.interface";
import NoPostsMessage from "../../../common/NoPostsMessage";
import { useNavigate } from "react-router-dom";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Tooltip from '@mui/material/Tooltip';
import { fetchUserPosts } from "../../../utils/services/Posts.service";

const ViewPost = () => {
  const { data: posts, isLoading, isError, error } = useQuery("user-post", fetchUserPosts, {
    select: (data) => {
      return data.data.posts;
    },
  })

  const navigate = useNavigate();

  if (isLoading) {
    return <GlobalLoader />;
  }

  if (isError) {
    console.log(error);
    return <Error />;
  }

  if (!posts?.length) {
    return <NoPostsMessage />
  }

  const handleClick = (id) => {
    navigate(`/user/view-posts/${id}`);
  };


  return (
    <div className="outer-container">
      <div className="gridcontainer">
        {posts?.map((post: Post, index: number) => (
          <div className="griditem" key={post.post_id || index}>
            <div className="innergrid">

              {/* Post Image */}
              <div className="innergriditem innergriditem1 relative">
                <img
                  src={post.img_url}
                  loading="lazy"
                  alt="Post image"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null; // Prevent loop if fallback fails
                    target.src = "/no-image.svg";
                  }}
                />

                <div className="flex gap-2 absolute top-4 right-4">
                  <button>
                    <Tooltip title="Edit" style={{ fontSize: '12px' }}>
                      <EditIcon fontSize="large" style={{ color: 'green' }} />
                    </Tooltip>
                  </button>
                  <button>
                    <Tooltip title="Delete">
                      <DeleteIcon fontSize="large" style={{ color: 'red' }} />
                    </Tooltip>
                  </button>
                </div>


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
                onClick={() => handleClick(post.post_id)}
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
