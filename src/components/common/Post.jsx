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
    return <GlobalLoader></GlobalLoader>;
  }

  // Error
  if (isError) return <Error />;

  return (
    <>
      {/* For Small-Medium Devices Upto 1020 px */}
      <div className="flex flex-col h-full justify-between lg:hidden">
        <div className="flex flex-col font-light text-white text-3xl font-serif">
          {/* Image */}
          <div>
            <img
              src={post.img_url}
              loading="lazy"
              alt="Post image"
              style={{ objectFit: "cover", height: "400px" }}
              onError={(e) => {
                const target = e.target;
                target.onerror = null; // Prevent loop if fallback fails
                target.src = "/no-image.svg";
                target.className =
                  "w-full h-full flex justify-center items-center object-contain bg-gray-100 p-10";
              }}
            />
          </div>

          {/* Title */}
          <div className=" p-5 text-3xl text-pink-400 ">
            Title - {post.post_name}
          </div>

          {/* Description */}
          <div className="p-5 pt-0 text-2xl hyphens-auto text-justify leading-relaxed">
            Desc - {post.post_desc}
          </div>

          <hr />
          {/* Writer & Likes */}
          <div className="flex h-20 p-5 justify-between text-4xl">
            <span className="text-purple-400 ">
              Written By - {post.user_name}
            </span>

            <button
              className={`flex justify-center items-center gap-1 cursor-pointer ${
                post.user_like ? "text-blue-400" : "text-green-400"
              }`}
              onClick={() => handlePostLike(post.user_like)}
            >
              <ThumbUpIcon fontSize="large" />{" "}
              <span className="text-4xl">Like - {post.likescount ?? 0}</span>
            </button>
          </div>
          <hr />

          {/* Article */}
          <div className="flex-1 text-pretty hyphens-auto text-justify p-5 leading-relaxed">
            <span className="text-white font-serif">{post?.post_article}</span>
          </div>
        </div>

        {/* Add Comments Form */}
        <div className="p-5 text-4xl flex flex-col gap-4">
          <hr />
          <span className="text-white">Comments -</span>
          <form
            className="w-full flex gap-3"
            onSubmit={(e) =>
              addComment(e, {
                is_sub_comment: false,
                parent_comment_id: null,
                comment: commentVal,
              })
            }
          >
            <input
              type="text"
              placeholder="Please add your valuable comments..."
              className="w-full p-5 rounded-xl border-none text-xl outline-none"
              readOnly={!user}
              value={commentVal}
              onChange={(e) => setCommentValue(e.target.value)}
            />

            <div className="flex items-center justify-center rounded-xl text-center">
              <button
                type="submit"
                className={`pt-5 pb-5 pl-20 pr-20 rounded-lg text-2xl flex justify-center ${
                  !commentVal.length || !user
                    ? "bg-gray-500 text-white cursor-not-allowed"
                    : "bg-green-400 text-white hover:scale-105 transform transition-all duration-300 ease-in-out"
                }`}
              >
                {isSubmittingComment ? (
                  <Spinner height={20} width={20} />
                ) : (
                  "Add"
                )}
              </button>
            </div>
          </form>
          <hr />

          {/* Comments */}
          <div
            className={`${
              comments.length ? "block" : "hidden"
            } text-white p-4 space-y-4`}
          >
            {comments.map((comment, index) => (
              <div
                key={index}
                className="border-b border-gray-600 pb-4 text-lg"
              >
                {comment.map((val, subIndex) => (
                  <div key={subIndex} className="mb-2">
                    {/* Parent Comment */}
                    {val.is_sub_comment === false && val.parent_Comment && (
                      <>
                        <div className="mb-2">
                          <div className="font-bold text-lg">
                            User Name - {val.user} {val.user_liked_comment}
                          </div>
                          <div className="bg-gray-800 p-3 rounded-lg">
                            {val.parent_Comment}
                          </div>
                          <div className="flex items-center space-x-4 text-sm mt-2 mb-2 text-gray-400">
                            <span className="text-lg flex gap-2">
                              <span>Likes :</span>
                              {val.parent_comment_like_count !== null &&
                              val.parent_comment_like_count !== undefined
                                ? val.parent_comment_like_count
                                : 0}
                            </span>
                            <span className="text-lg">{val.comment_time}</span>
                            <button
                              className={`cursor-pointer ${
                                val?.user_liked_comment
                                  ? "text-blue-400"
                                  : "text-green-400"
                              }`}
                              onClick={() =>
                                handleCommentLike(
                                  val.comment_id,
                                  val?.user_liked_comment
                                )
                              }
                            >
                              <ThumbUpIcon />
                            </button>

                            <button
                              className={`cursor-pointer text-lg mt-1 hover:text-blue-400 text-green-400`}
                              onClick={(e) => {
                                index === subCommentIdx
                                  ? setSubCommentIdx(-1)
                                  : setSubCommentIdx(index);
                              }}
                            >
                              Reply
                            </button>
                          </div>
                        </div>

                        {subCommentIdx === index && (
                          <form
                            className="w-full flex gap-3"
                            onSubmit={(e) =>
                              addComment(e, {
                                is_sub_comment: true,
                                parent_comment_id: val.comment_id,
                                comment: subCommentVal,
                              })
                            }
                          >
                            <input
                              type="text"
                              placeholder="Please add your valuable comments..."
                              className="w-full p-5 rounded-xl border-none text-lg outline-none text-black"
                              readOnly={!user}
                              value={subCommentVal}
                              onChange={(e) =>
                                setSubCommentValue(e.target.value)
                              }
                            />

                            <div className="flex items-center justify-center rounded-xl text-center">
                              <button
                                type="submit"
                                className={`pt-5 pb-5 pl-20 pr-20 rounded-lg text-2xl flex justify-center ${
                                  !subCommentVal.length || !user
                                    ? "bg-gray-500 text-white cursor-not-allowed"
                                    : "bg-green-400 text-white hover:scale-105 transform transition-all duration-300 ease-in-out"
                                }`}
                              >
                                {isSubmittingComment ? (
                                  <Spinner height={20} width={20} />
                                ) : (
                                  "Add"
                                )}
                              </button>
                            </div>
                          </form>
                        )}
                      </>
                    )}

                    {/* Sub Comments */}
                    {val.is_sub_comment === true && val.sub_comment && (
                      <div className="ml-8 mt-2 pl-4 border-l-2 border-gray-700 text-lg">
                        <div className="font-bold text-sm text-gray-300">
                          User Name - {val.user}
                        </div>
                        <div className="bg-gray-700 p-2 rounded-lg">
                          {val.sub_comment}
                        </div>
                        <div className="flex items-center space-x-2 text-sm mt-1 text-gray-500">
                          <span className="text-lg">Likes :</span>
                          <span className="text-lg">
                            {val.sub_comment_like_count !== null &&
                            val.sub_comment_like_count !== undefined
                              ? val.sub_comment_like_count
                              : 0}
                          </span>
                          <span className="text-lg">{val.comment_time}</span>

                          {/* Sub Comment Like Button */}
                          <button
                            className={`cursor-pointer ${
                              val.user_liked_comment
                                ? "text-blue-400"
                                : "text-green-400"
                            }`}
                            onClick={() =>
                              handleCommentLike(
                                val.comment_id,
                                val.user_liked_comment
                              )
                            }
                          >
                            <ThumbUpIcon />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* For Large Devices Above 1020 px */}
      <div className="hidden lg:flex sm:flex-col h-full justify-between">
        <div
          className="grid font-light text-white text-4xl font-serif h-full grid-cols-5 gap-x-5"
          style={{
            height: "80vh",
          }}
        >
          {/* Content */}
          <div className="flex flex-col col-span-3" style={{ height: "80vh" }}>
            {/* Title */}
            <div className="p-5 text-4xl text-pink-400">
              Title - {post.post_name}
            </div>

            {/* Description */}
            <div className="p-5 pt-0 text-3xl hyphens-auto text-justify leading-relaxed">
              Desc - {post.post_desc}
            </div>

            <hr className="border-gray-700" />

            {/* Writer & Likes */}
            <div className="flex h-24 p-5 justify-between text-3xl items-center">
              <span className="text-purple-400">
                Written By - {post.user_name}
              </span>

              <div
                className={` flex justify-center items-center gap-1 cursor-pointer  ${
                  post.user_like ? "text-blue-400" : "text-green-400"
                }`}
                onClick={() => handlePostLike(post.user_like)}
              >
                <ThumbUpIcon fontSize="large" />
                <span className="text-3xl">Like - {post.likescount ?? 0}</span>
              </div>
            </div>
            <hr className="border-gray-700" />

            {/* Article */}
            <div className="pt-5 pl-5 pb-5 leading-relaxed flex-1 text-pretty hyphens-auto text-justify overflow-auto pr-2">
              <span
                className="text-white font-serif"
                style={{ "font-size": "1.6rem" }}
              >
                {post?.post_article}
              </span>
            </div>
          </div>

          {/* Image */}
          <div className="col-span-2 rounded-lg mt-1 mr-2">
            <img
              src={post.img_url}
              loading="lazy"
              alt="Post image"
              className="object-cover w-full h-full rounded-lg"
              onError={(e) => {
                const target = e.target;
                target.onerror = null; // Prevent loop if fallback fails
                target.src = "/no-photos.png";
                target.className =
                  "w-full h-full flex justify-center items-center object-contain bg-gray-100 p-10";
              }}
            />
          </div>
        </div>

        {/* Comments */}
        <div className="pl-5 pr-5 text-3xl flex flex-col gap-4">
          <hr className="border-gray-700" />

          <span className="text-white">Comments -</span>
          <form
            className="w-full flex gap-3"
            onSubmit={handleSubmit(() =>
              addCommentLargeScreen({
                is_sub_comment: false,
                parent_comment_id: null,
                comment: getValues("comment"),
              })
            )}
          >
            <input
              type="text"
              placeholder="Please add your valuable comments..."
              className="w-full p-5 rounded-xl border-none text-xl outline-none"
              readOnly={!user}
              {...register("comment", {
                required: {
                  value: true,
                },
              })}
            />
            {errors.comment && (
              <p className="text-red-400 text-lg pl-2">
                {errors.comment.message}
              </p>
            )}

            <div className="flex items-center justify-center rounded-xl text-center">
              <button
                type="submit"
                className={`pt-5 pb-5 pl-32 pr-32 rounded-lg text-2xl flex justify-center ${
                  !isValid || !user
                    ? "bg-gray-500 text-white cursor-not-allowed"
                    : "bg-green-400 text-white hover:scale-105 transform transition-all duration-300 ease-in-out"
                }`}
                disabled={!isValid || isSubmitting}
              >
                {isSubmitting ? <Spinner height={20} width={20} /> : "Add"}
              </button>
            </div>
          </form>

          <hr className="border-gray-700" />

          {/* Comments */}
          <div className="text-white p-4 space-y-4">
            {comments.map((comment, index) => (
              <div key={index} className="border-b border-gray-600 pb-4">
                {comment.map((val, subIndex) => (
                  <div key={subIndex} className="mb-2">
                    {/* Parent Comment */}
                    {val.is_sub_comment === false && val.parent_Comment && (
                      <>
                        <div className="mb-2 text-xl">
                          <div className="font-bold text-xl">
                            User Name - {val.user}
                          </div>
                          <div className="bg-gray-800 p-3 rounded-lg">
                            {val.parent_Comment}
                          </div>
                          <div className="flex items-center space-x-4 text-xl mt-2 text-gray-400">
                            <span>
                              Likes:
                              {val.parent_comment_like_count !== null &&
                              val.parent_comment_like_count !== undefined
                                ? val.parent_comment_like_count
                                : 0}
                            </span>
                            <span>{val.comment_time}</span>

                            <button
                              className={`cursor-pointer ${
                                val?.user_liked_comment
                                  ? "text-blue-400"
                                  : "text-green-400"
                              }`}
                              onClick={() =>
                                handleCommentLike(
                                  val.comment_id,
                                  val.user_liked_comment
                                )
                              }
                            >
                              <ThumbUpIcon />
                            </button>

                            <button
                              className={`cursor-pointer text-lg mt-1 hover:text-blue-400 text-green-400`}
                              onClick={(e) => {
                                index === subCommentIdx
                                  ? setSubCommentIdx(-1)
                                  : setSubCommentIdx(index);
                              }}
                            >
                              Reply
                            </button>
                          </div>
                        </div>

                        {subCommentIdx === index && (
                          <form
                            className="w-full flex gap-3"
                            onSubmit={(e) =>
                              addComment(e, {
                                is_sub_comment: true,
                                parent_comment_id: val.comment_id,
                                comment: subCommentVal,
                              })
                            }
                          >
                            <input
                              type="text"
                              placeholder="Please add your valuable comments..."
                              className="w-full p-5 rounded-xl border-none text-lg outline-none text-black"
                              readOnly={!user}
                              value={subCommentVal}
                              onChange={(e) =>
                                setSubCommentValue(e.target.value)
                              }
                            />

                            <div className="flex items-center justify-center rounded-xl text-center">
                              <button
                                type="submit"
                                className={`pt-5 pb-5 pl-20 pr-20 rounded-lg text-2xl flex justify-center ${
                                  !subCommentVal.length || !user
                                    ? "bg-gray-500 text-white cursor-not-allowed"
                                    : "bg-green-400 text-white hover:scale-105 transform transition-all duration-300 ease-in-out"
                                }`}
                              >
                                {isSubmittingComment ? (
                                  <Spinner height={20} width={20} />
                                ) : (
                                  "Add"
                                )}
                              </button>
                            </div>
                          </form>
                        )}
                      </>
                    )}

                    {/* Sub Comments */}
                    {val.is_sub_comment === true && val.sub_comment && (
                      <div className="ml-8 pl-4 border-l-2 border-gray-700 text-xl">
                        <div className="font-bold text-sm text-gray-300">
                          User Name - {val.user}
                        </div>
                        <div className="bg-gray-700 p-2 rounded-lg">
                          {val.sub_comment}
                        </div>
                        <div className="flex items-center space-x-4 text-xl mt-1 text-gray-500">
                          <span>
                            Likes:
                            {val.sub_comment_like_count !== null &&
                            val.sub_comment_like_count !== undefined
                              ? val.sub_comment_like_count
                              : 0}
                          </span>
                          <span>{val.comment_time}</span>

                          <button
                            className={`cursor-pointer ${
                              val?.user_liked_comment
                                ? "text-blue-400"
                                : "text-green-400"
                            }`}
                            onClick={() =>
                              handleCommentLike(
                                val.comment_id,
                                val.user_liked_comment
                              )
                            }
                          >
                            <ThumbUpIcon />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Post;
