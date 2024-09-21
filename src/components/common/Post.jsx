import React from "react";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { fetchPostData } from "../utils/services/Posts.service";
import { GlobalLoader } from "./Loader";
import Error from "./Error";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import { useForm } from "react-hook-form";
import { Spinner } from "./Loader";

const Post = () => {
  const { id } = useParams();
  const { register, formState, getValues } = useForm();
  const { errors, isSubmitting, isValid } = formState;

  const {
    data: post,
    isLoading,
    isError,
    isFetching,
  } = useQuery("article-data", () => fetchPostData(id), {
    select: (data) => {
      return data.data.post;
    },
  });

  if (isFetching || isLoading) {
    return <GlobalLoader></GlobalLoader>;
  }

  if (isError) return <Error />;

  return (
    <>
      <div className="flex flex-col font-light text-white text-3xl font-serif">
        {/* Image */}
        <div>
          <img
            src={post.img_url}
            loading="lazy"
            alt="Post image"
            style={{ height: "400px", objectFit: "cover" }}
            onError={(e) => {
              const target = e.target;
              target.onerror = null; // Prevent loop if fallback fails
              target.src = "/no-image.svg";
            }}
          />
        </div>

        {/* Title */}
        <div className=" p-5 text-3xl text-pink-400 ">
          Title - {post.post_name}
        </div>

        {/* Description */}
        <div className=" p-5 text-3xl ">Desc - {post.post_desc}</div>

        {/* Writer & Likes */}
        <div className="flex h-20 p-5 justify-between text-4xl">
          <span className="text-purple-400 ">
            Written By - {post.user_name}
          </span>

          <div className="hover: text-green-400 flex justify-center items-center gap-1 hover:text-blue-400">
            <ThumbUpIcon fontSize="large" />{" "}
            <span className="text-4xl">Like - {post.likes ?? 0}</span>
          </div>
        </div>

        {/* Article */}
        <div className="flex-1 text-pretty hyphens-auto text-justify p-5">
          <span className="text-white font-serif">{post?.post_article}</span>
        </div>
      </div>

      <hr />
      {/* Comments */}
      <div className="h-40 p-5 text-4xl flex flex-col gap-4">
        <span className="text-white">Comments -</span>
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Add add your valuable comments..."
            className="w-full p-4 rounded-xl border-none text-2xl outline-none"
            {...register("comment", {
              required: {
                value: true,
              },
            })}
          />
          {errors.comment && (
            <p className="text-red-400 text-lg pl-2">{errors.desc.message}</p>
          )}

          <div className="flex justify-center rounded-xl text-center">
            <button
              type="submit"
              className={`p-4 rounded-lg text-2xl flex justify-center ${
                !isValid
                  ? "bg-gray-500 text-white cursor-not-allowed"
                  : "bg-green-400 text-white hover:scale-100 transform transition-all duration-300 ease-in-out"
              }`}
              disabled={!isValid || isSubmitting}
            >
              {isSubmitting ? <Spinner height={20} width={20} /> : "Add"}
            </button>
          </div>
        </div>
      </div>

      <hr />
    </>
  );
};

export default Post;
