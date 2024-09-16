import React from "react";
import { useNavigate } from "react-router-dom";

const NoPostsMessage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <h1 className="font-semibold text-gray-100 mb-4 text-5xl">
        You haven't added any posts yet 🙂
      </h1>
      <p className="text-gray-500 mb-6 text-2xl">
        Start sharing your thoughts with the world by adding your first post!
      </p>
      <button
        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold` py-4 px-6 rounded text-xl"
        onClick={() => {
          navigate("/addPost");
        }}
      >
        Add New Post
      </button>
    </div>
  );
};

export default NoPostsMessage;
