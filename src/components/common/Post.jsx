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
    return <GlobalLoader></GlobalLoader>;
  }

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
          <div className=" p-5 text-3xl ">Desc - {post.post_desc}</div>

          <hr />
          {/* Writer & Likes */}
          <div className="flex h-20 p-5 justify-between text-4xl">
            <span className="text-purple-400 ">
              Written By - {post.user_name}
            </span>

            <div className="hover: text-green-400 flex justify-center items-center gap-1 hover:text-blue-400 ">
              <ThumbUpIcon fontSize="large" />{" "}
              <span className="text-4xl">Like - {post.likes ?? 0}</span>
            </div>
          </div>
          <hr />

          {/* Article */}
          <div className="flex-1 text-pretty hyphens-auto text-justify p-5 leading-relaxed">
            <span className="text-white font-serif">{post?.post_article}</span>
          </div>
        </div>

        {/* Comments */}
        <div className="p-5 text-4xl flex flex-col  gap-4">
          <hr />

          <span className="text-white">Comments -</span>
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Please add your valuable comments..."
              className="w-full p-4 rounded-xl border-none text-2xl outline-none"
              readOnly={!user}
              {...register("comment", {
                required: {
                  value: true,
                },
              })}
            />
            {errors.comment && (
              <p className="text-red-400 text-lg pl-2">{errors.desc.message}</p>
            )}

            <div className="flex align-bottom justify-center rounded-xl text-center">
              <button
                type="submit"
                className={`p-4 pl-10 pr-10 rounded-lg text-2xl flex justify-center ${
                  !isValid || !user
                    ? "bg-gray-500 text-white cursor-not-allowed"
                    : "bg-green-400 text-white hover:scale-100 transform transition-all duration-300 ease-in-out"
                }`}
                disabled={!isValid || isSubmitting}
              >
                {isSubmitting ? <Spinner height={20} width={20} /> : "Add"}
              </button>
            </div>
          </div>

          <hr />
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
            <div className="p-5 text-3xl">Desc - {post.post_desc}</div>

            <hr className="border-gray-700" />

            {/* Writer & Likes */}
            <div className="flex h-24 p-5 justify-between text-3xl">
              <span className="text-purple-400">
                Written By - {post.user_name}
              </span>

              <div className="text-green-400 flex justify-center items-center gap-1 hover:text-blue-400 cursor-pointer">
                <ThumbUpIcon fontSize="large" />
                <span className="text-3xl">Like - {post.likes ?? 0}</span>
              </div>
            </div>
            <hr className="border-gray-700" />

            {/* Article */}
            <div className="pt-5 pl-5 pb-5 leading-relaxed flex-1 text-pretty hyphens-auto text-justify overflow-auto pr-2">
              <span className="text-white font-serif">
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
        <div
          className="pl-5 pr-5 text-3xl flex flex-col gap-4"
          onClick={checkUser}
        >
          <hr className="border-gray-700" />

          <span className="text-white">Comments -</span>
          <form
            className="w-full flex gap-3"
            onSubmit={handleSubmit(addComment)}
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
        </div>
      </div>
    </>
  );
};

export default Post;
