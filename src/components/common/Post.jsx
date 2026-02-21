import React from "react";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import {
  fetchPostData,
  fetchUserPostById,
} from "../utils/services/Posts.service";
import { GlobalLoader } from "./Loader";
import Error from "./Error";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import { useForm } from "react-hook-form";
import { Spinner } from "./Loader";
import { useLocation } from "react-router-dom";
import { useUserContext } from "../../contexts/UserContextProvider";

const Post = () => {
  const location = useLocation();
  const urlRoute = location.pathname.split("/")[1];

  const { user } = useUserContext();
  const { id } = useParams();
  const { register, formState, getValues, handleSubmit } = useForm();
  const { errors, isSubmitting, isValid } = formState;

  const {
    data: post,
    isLoading,
    isError,
    isFetching,
  } = useQuery(
    "article-data",
    () => (urlRoute ? fetchPostData(id) : fetchUserPostById(id)),
    {
      select: (data) => {
        return data.data.post;
      },
    }
  );

  function addComment() {
    console.log(getValues());
  }

  function checkUser() {
    if (!user) {
      alert("Please login to add your comment!");
    }
  }

  if (isFetching || isLoading) {
    return <GlobalLoader />;
  }

  if (isError) return <Error />;

  return (
    <div className="py-6 max-w-6xl mx-auto">
      {/* Article Header */}
      <div className="mb-8">
        <h1 className="text-3xl lg:text-4xl font-bold text-white leading-tight mb-3">
          {post.post_name}
        </h1>
        <p className="text-lg text-slate-300 mb-4">{post.post_desc}</p>

        <div className="flex flex-wrap items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-xs font-bold">
              {post.user_name?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <span className="text-slate-300 font-medium">{post.user_name}</span>
          </div>

          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-slate-300 hover:bg-indigo-500/20 hover:border-indigo-500/30 hover:text-indigo-300 transition-all duration-300">
            <ThumbUpIcon style={{ fontSize: 16 }} />
            <span className="text-sm font-medium">{post.likes ?? 0} Likes</span>
          </button>
        </div>
      </div>

      {/* Image + Article Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-8">
        {/* Article Content */}
        <div className="lg:col-span-3 order-2 lg:order-1">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 lg:p-8">
            <div className="prose prose-invert max-w-none">
              <p className="text-base text-slate-200 leading-relaxed whitespace-pre-wrap">
                {post?.post_article}
              </p>
            </div>
          </div>
        </div>

        {/* Image */}
        <div className="lg:col-span-2 order-1 lg:order-2">
          <div className="sticky top-24 rounded-2xl overflow-hidden border border-white/10">
            <img
              src={post.img_url}
              loading="lazy"
              alt={post.post_name}
              className="w-full h-64 lg:h-[400px] object-cover"
              onError={(e) => {
                const target = e.target;
                target.onerror = null;
                target.src = "/no-image.svg";
                target.className = "w-full h-64 lg:h-[400px] object-contain bg-slate-800/50 p-10";
              }}
            />
          </div>
        </div>
      </div>

      {/* Comments Section */}
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6" onClick={checkUser}>
        <h3 className="text-lg font-semibold text-white mb-4">Comments</h3>

        <form className="flex gap-3" onSubmit={handleSubmit(addComment)}>
          <input
            type="text"
            placeholder={user ? "Share your thoughts..." : "Login to comment..."}
            className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 transition-all"
            readOnly={!user}
            {...register("comment", {
              required: {
                value: true,
              },
            })}
          />
          {errors.comment && (
            <p className="text-rose-400 text-xs pl-2">{errors.comment.message}</p>
          )}

          <button
            type="submit"
            className={`px-6 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
              !isValid || !user
                ? "bg-white/5 text-slate-500 cursor-not-allowed border border-white/10"
                : "bg-gradient-to-r from-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-105"
            }`}
            disabled={!isValid || isSubmitting}
          >
            {isSubmitting ? <Spinner height={20} width={20} /> : "Post"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Post;
