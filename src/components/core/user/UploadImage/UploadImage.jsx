import React, { useState, useRef, useEffect, memo } from "react";
import { Spinner } from "../../../common/Loader";
import { useDispatch, useSelector } from "react-redux";
import { addPost } from "../../../../features/AddPost.slice";

const UploadImage = memo(
  ({ setImageData }) => {
    const [image, setImage] = useState(null);
    const fileInputRef = useRef("");
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const post = useSelector((state) => state.addPost.Post);

    useEffect(() => {
      setImage(post.img);
    }, [post.img]);

    const handleImageChange = (e) => {
      setLoading(true);
      const file = e.target.files ? e.target.files[0] : null;
      const reader = new FileReader();

      reader.onloadend = () => {
        setImage(reader.result);
        setLoading(false);
        dispatch(addPost({ ...post, img: reader.result }));
      };

      reader.onerror = () => {
        setLoading(false);
        console.error("Failed to read the file");
      };

      if (file) {
        setImageData(file);
        reader.readAsDataURL(file);
      }
    };

    const handleButtonClick = () => {
      fileInputRef.current?.click();
    };

    return (
      <>
        <div className="relative h-full w-full flex items-center justify-center">
          {loading ? (
            <Spinner />
          ) : image ? (
            <>
              <img
                src={image}
                alt="Upload Image"
                style={{ height: "100%", width: "100%", objectFit: "cover" }}
                className="border-r-0 border-l-0 rounded-xl"
              />
              <button
                className="absolute top-5 right-5 p-3 text-gray-500 text-xl font-bold shadow-lg bg-white rounded-2xl
              hover:scale-105 transform transition-all duration-300 ease-in-out hover:text-xl"
                onClick={handleButtonClick}
              >
                Edit Image
              </button>
            </>
          ) : (
            <>
              <button
                className="p-6 text-gray-500 text-3xl font-semibold shadow-lg bg-white rounded-2xl
              hover:scale-105 transform transition-all duration-300 ease-in-out"
                onClick={handleButtonClick}
              >
                Upload Image
              </button>
            </>
          )}

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            className="hidden"
          />
        </div>
      </>
    );
  },
  (prevProps, nextProps) => prevProps.setImageData === nextProps.setImageData
);

export default UploadImage;
