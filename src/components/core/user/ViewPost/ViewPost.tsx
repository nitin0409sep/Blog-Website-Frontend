import React, { useEffect, useState } from "react";
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
import { AlertDialog } from "../../../common/Dialog";

const ViewPost = () => {
  const { setShowToast, setToastMessage, setToastError, refreshPage, setRefreshPage, showDialog, setShowDialog } = useUserContext();

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
    // navigate(`/user/update-post/${id}`);
  }

  const handleDelete = async (id: string) => {
    if (!id) return;
    setShowDialog(true);
  }

  return (
    <>
      <div className="py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">My Posts</h1>
          <p className="text-slate-400 mt-1">Manage and view your published articles</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {posts?.map((post: Post, index: number) => (
            <article
              key={post.post_id || index}
              className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 hover:border-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-500 hover:-translate-y-1"
            >
              {/* Image */}
              <div className="relative aspect-[16/10] overflow-hidden">
                <img
                  src={post.img_url}
                  loading="lazy"
                  alt={post.post_name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null;
                    target.src = "/no-image.svg";
                  }}
                />

                {/* Action Buttons */}
                <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button
                    onClick={(e) => { e.stopPropagation(); handleEdit(post.post_id); }}
                    className="p-2 rounded-xl bg-slate-900/70 backdrop-blur-sm border border-white/10 text-emerald-400 hover:bg-emerald-500/20 hover:border-emerald-500/30 transition-all"
                  >
                    <Tooltip title="Edit">
                      <EditIcon style={{ fontSize: 18 }} />
                    </Tooltip>
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDelete(post.post_id); }}
                    className="p-2 rounded-xl bg-slate-900/70 backdrop-blur-sm border border-white/10 text-rose-400 hover:bg-rose-500/20 hover:border-rose-500/30 transition-all"
                  >
                    <Tooltip title="Delete">
                      <DeleteIcon style={{ fontSize: 18 }} />
                    </Tooltip>
                  </button>
                </div>
              </div>

              {/* Content */}
              <div
                className="p-5 cursor-pointer"
                onClick={() => handleClick(post.post_id)}
              >
                <h3 className="text-lg font-semibold text-white line-clamp-2 mb-2 group-hover:text-indigo-300 transition-colors">
                  {post.post_name}
                </h3>

                <p className="text-sm text-slate-400 line-clamp-3 mb-4 leading-relaxed">
                  {post.post_desc}
                </p>

                <span className="inline-flex items-center gap-1.5 text-sm font-medium text-indigo-400 group-hover:text-indigo-300 transition-colors">
                  Read article
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>

      {showDialog && <AlertDialog title={"Delete Post"} desc={"Are you sure you want to delete this post?"} btn1={"Cancel"} btn2={"Delete"} />}
    </>
  );
};

export default ViewPost;
