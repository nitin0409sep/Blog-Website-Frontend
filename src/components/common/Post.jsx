import React, { useState, useEffect } from "react";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import {
  fetchPublicPostById,
  fetchUserPostById,
  likeUnlikePost,
  postComments,
  likeUnlikeComment,
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

  const { user, setShowToast, setToastMessage, setToastError } =
    useUserContext();
  const { id } = useParams();
  const { register, formState, getValues, handleSubmit, reset } = useForm();

  const { errors, isSubmitting, isValid } = formState;
  const [comments, setComments] = useState([]);
  const [commentVal, setCommentValue] = useState("");
  const [subCommentVal, setSubCommentValue] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [subCommentIdx, setSubCommentIdx] = useState(-1);

  const {
    data: post,
    isLoading,
    isError,
    isFetching,
    refetch,
  } = useQuery(
    "article-data",
    () =>
      urlRoute === "user"
        ? fetchUserPostById(id)
        : fetchPublicPostById(id, user),
    {
      select: (data) => {
        return data.data.posts;
      },
    }
  );

  // used useEffect To Set Comment Values
  useEffect(() => {
    if (post?.comments) {
      const commentValues = setCommentsValue(post.comments);
      setComments(commentValues);
    }
  }, [post]);

  // Comments
  function setCommentsValue(obj) {
    if (!obj) return;

    const map = new Map();

    obj.forEach((comment) => {
      if (comment.is_sub_comment == false && comment.parentCommentId == null) {
        map.set(comment.comment_id, [
          {
            comment_id: comment.comment_id,
            user: comment.user,
            parent_Comment: comment.comment,
            is_sub_comment: comment.is_sub_comment,
            parent_comment_like_count: comment.commentsLikeCount,
            comment_time: currentTime(comment.commentTiming),
            user_liked_comment: comment?.user_liked_comment ?? null,
          },
        ]);
      }
    });

    mapSubComments();

    function mapSubComments() {
      obj.forEach((comment) => {
        if (
          map.has(comment.parentCommentId) &&
          comment.parentCommentId != null &&
          comment.is_sub_comment === true
        ) {
          map.get(comment.parentCommentId).push({
            comment_id: comment.comment_id,
            user: comment.user,
            sub_comment: comment.comment,
            is_sub_comment: comment.is_sub_comment,
            sub_comment_like_count: comment.commentsLikeCount,
            comment_time: currentTime(comment.commentTiming),
            user_liked_comment: comment.user_liked_comment ?? null,
          });
        }
      });
    }

    const commentsArray = [];
    for (let [_, value] of map) {
      commentsArray.push(value);
    }

    return commentsArray;
  }

  // Current Time Difference Function
  function currentTime(commentTiming) {
    const hours = Math.floor(
      (Date.now() - new Date(commentTiming).getTime()) / (1000 * 60 * 60)
    );

    if (hours >= 24) {
      const days = Math.floor(hours / 24);
      return days + (days > 1 ? " days" : " day");
    }

    return hours + (hours > 1 ? " hours" : " hour");
  }

  // Post Likes
  async function handlePostLike(liked) {
    if (!user) {
      setShowToast(true);
      setToastError("Please Login To Like a Post!");
      return;
    }

    try {
      const res = await likeUnlikePost(!liked, id);
      if (res?.data?.data) {
        setShowToast(true);
        setToastMessage(res.data.data);
        refetch();
      }
    } catch (error) {
      setShowToast(true);
      setToastError(error.message);
    }
  }

  // Add Comments on Mobile Screen Function
  async function addComment(e, obj) {
    e.preventDefault();
    if (!user) {
      setShowToast(true);
      setToastError("Please Login To Comment on a Post!");
      return;
    }

    if (commentVal || subCommentVal) {
      try {
        obj.post_id = id;
        setIsSubmittingComment(true);
        const res = await postComments(obj);

        if (res?.data?.data) {
          setShowToast(true);
          setToastMessage(res.data.data);
          setIsSubmittingComment(false);
          setSubCommentIdx(-1);
          setCommentValue("");
          setSubCommentValue("");
          refetch();
        } else {
          setShowToast(true);
          setToastError("Comment Unsuccessfull, Please try again!");
          setIsSubmittingComment(false);
        }
      } catch (error) {
        setShowToast(true);
        setToastError(error.message);
        setIsSubmittingComment(false);
      }
    }
  }

  // Add Comments on Large Screen Function
  async function addCommentLargeScreen(obj) {
    if (!user) {
      setShowToast(true);
      setToastError("Please Login To Comment on a Post!");
      return;
    }

    try {
      obj.post_id = id;
      setIsSubmittingComment(true);
      const res = await postComments(obj);

      if (res?.data?.data) {
        setShowToast(true);
        setToastMessage(res.data.data);
        setIsSubmittingComment(false);
        setSubCommentIdx(-1);
        refetch();
        reset();
      } else {
        setShowToast(true);
        setToastError("Comment Unsuccessfull, Please try again!");
        setIsSubmittingComment(false);
      }
    } catch (error) {
      setShowToast(true);
      setToastError(error.message);
      setIsSubmittingComment(false);
    }
  }

  // Comment Like
  async function handleCommentLike(comment_id, liked) {
    if (!user) {
      setShowToast(true);
      setToastError("Please Login To Like Comment on a Post!");
      return;
    }

    if (!comment_id) {
      setShowToast(true);
      setToastError("Comment Id not found");
      return;
    }

    try {
      const res = await likeUnlikeComment(comment_id, !liked);
      if (res?.data?.data) {
        setShowToast(true);
        setToastMessage(res.data.data);
        refetch();
      }
    } catch (error) {
      setShowToast(true);
      setToastError(error.message);
    }
  }

  // Fetching
  if (isFetching || isLoading) {
    return <GlobalLoader />;
  }

  // Error
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

