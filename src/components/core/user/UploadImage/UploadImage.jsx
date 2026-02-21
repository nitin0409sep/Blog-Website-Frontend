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
      <div className="relative h-full w-full flex items-center justify-center min-h-[250px]">
        {loading ? (
          <Spinner />
        ) : image ? (
          <>
            <img
              src={image}
              alt="Upload preview"
              className="w-full h-full object-cover"
            />
            <button
              className="absolute top-4 right-4 px-4 py-2 text-xs font-medium text-white bg-slate-900/70 backdrop-blur-sm border border-white/20 rounded-xl hover:bg-white/20 transition-all"
              onClick={handleButtonClick}
            >
              Change Image
            </button>
          </>
        ) : (
          <button
            className="flex flex-col items-center gap-3 p-8 text-slate-400 hover:text-indigo-400 transition-colors cursor-pointer"
            onClick={handleButtonClick}
          >
            <div className="w-16 h-16 rounded-2xl bg-white/5 border-2 border-dashed border-white/20 flex items-center justify-center hover:border-indigo-500/40 transition-colors">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21zM8.25 8.625a1.125 1.125 0 100-2.25 1.125 1.125 0 000 2.25z" />
              </svg>
            </div>
            <div className="text-center">
              <p className="text-sm font-medium">Upload Image</p>
              <p className="text-xs text-slate-500 mt-1">Click to browse files</p>
            </div>
          </button>
        )}

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageChange}
          className="hidden"
        />
      </div>
    );
  },
  (prevProps, nextProps) => prevProps.setImageData === nextProps.setImageData
);

export default UploadImage;
