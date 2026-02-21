import React, { useEffect, useState } from "react";
import UploadImage from "../UploadImage/UploadImage";
import PostForm from "../PostForm/PostForm";
import { Provider } from "react-redux";
import { store } from "../../../../store/store";
import { useParams } from "react-router-dom";
// import { useQuery } from "react-query";
// import { Navigate } from "react-router-dom";
// import { fetchPostData } from "../../../utils/services/Posts.service";

const AddPost = () => {
  const { id } = useParams();

  const [userPostData, setUserPostData] = useState("");
  const [imageData, setImageData] = useState(null);

  useEffect(() => {
    if (id) {
      (async () => {
        try {
          const { data } = await fetchPostData(id);
          setUserPostData(data.post);
        } catch (error) {
          console.error("Error fetching post data:", error);
        }
      })();
    }
  }, [id]);

  useEffect(() => {
    setImageData(userPostData.img_url);
  }, [userPostData]);

  return (
    <Provider store={store}>
      <div className="py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">
            {id ? "Edit Post" : "Create New Post"}
          </h1>
          <p className="text-slate-400 mt-1">
            {id ? "Update your article details" : "Share your thoughts with the world"}
          </p>
        </div>

        {/* Mobile: stacked layout */}
        <div className="md:hidden grid grid-cols-1 gap-6">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden h-64">
            <UploadImage setImageData={setImageData} />
          </div>
          <PostForm image={imageData} userPostData={userPostData} />
        </div>

        {/* Desktop: side by side */}
        <div className="hidden md:grid md:grid-cols-5 gap-6 min-h-[70vh]">
          <div className="col-span-3">
            <PostForm image={imageData} />
          </div>
          <div className="col-span-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden">
            <UploadImage setImageData={setImageData} />
          </div>
        </div>
      </div>
    </Provider>
  );
};

export default AddPost;
