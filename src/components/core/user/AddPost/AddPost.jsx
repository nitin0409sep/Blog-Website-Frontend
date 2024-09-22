import React, { useEffect, useState } from "react";
import UploadImage from "../UploadImage/UploadImage";
import PostForm from "../PostForm/PostForm";
import { Provider } from "react-redux";
import { store } from "../../../../store/store";
import { useParams } from "react-router-dom";
import { useQuery } from "react-query";
import { fetchPostData } from "../../../utils/services/Posts.service";
import { Navigate } from "react-router-dom";

const AddPost = () => {
  const { id } = useParams();

  const [userPostData, setUserPostData] = useState("");
  const [imageData, setImageData] = useState(null);

  useEffect(() => {
    if (id) {
      (async () => {
        try {
          const { data } = await fetchPostData(id); // Assuming fetchPostData is an async function
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
    <>
      {/* Common container for both screen sizes */}
      <Provider store={store}>
        <div className="grid text-white h-full w-full pl-2 pr-2">
          {/* For Mobile Screen - Below 700px */}
          <div className="md:hidden grid grid-cols-1 grid-rows-[20rem_auto]">
            <UploadImage setImageData={setImageData} />
            <PostForm image={imageData} userPostData={userPostData} />
          </div>

          {/* For Screens 700px and above */}
          <div className="hidden md:grid md:grid-cols-[2fr_1.5fr]">
            <PostForm image={imageData} />
            <UploadImage setImageData={setImageData} />
          </div>
        </div>
      </Provider>
    </>
  );
};

export default AddPost;
