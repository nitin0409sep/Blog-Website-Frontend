import React, { useEffect } from "react";
import "./ViewPost.css";
import { useQuery } from 'react-query';
import { GlobalLoader } from "../../../common/Loader";
import Error from "../../../common/Error";
import { Post } from "../../../utils/interfaces/Post.interface";
import { useNavigate } from "react-router-dom";
import { deletePost, fetchUserPosts } from "../../../utils/services/Posts.service";
import { useUserContext } from "../../../../contexts/UserContextProvider";
import Tooltip from '@mui/material/Tooltip';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import NoPostsMessage from "../../../common/NoPostsMessage";

const ViewPost = () => {
  const { setShowToast, setToastMessage, setToastError, refreshPage, setRefreshPage } = useUserContext();

  const { data: posts, isLoading, isError, error, refetch } = useQuery("user-post", fetchUserPosts, {
    cacheTime: 10,
    select: (data) => {
      return data.data.posts;
    },
  })

  useEffect(() => {
    refetch();
  }, [refreshPage])

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

  const handleClick = (id: string) => {
    navigate(`/user/view-posts/${id}`);
  };

  const handleEdit = async (id: string) => {
    if (!id)
      return;

    navigate(`/user/update-post/${id}`);
  }

  const handleDelete = async (id: string) => {
    if (!id)
      return;

    try {
      const res = await deletePost(id);
      if (res) {
        setShowToast(true);
        setRefreshPage((prev) => !prev);
        setToastMessage(res?.data?.message || "Post Deleted Successfully");
      }
    } catch (error) {
      setShowToast(true);
      setToastError("Couldn't delete Post, please try again.");
    }
  }


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
                  <button onClick={() => handleEdit(post.post_id)}>
                    <Tooltip title="Edit" style={{ fontSize: '12px' }}>
                      <EditIcon fontSize="large" style={{ color: 'green' }} />
                    </Tooltip>
                  </button>
                  <button onClick={() => handleDelete(post.post_id)}>
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
