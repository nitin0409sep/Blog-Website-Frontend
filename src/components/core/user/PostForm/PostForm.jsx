import React, { useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { Spinner } from "../../../common/Loader";
import { useDispatch, useSelector } from "react-redux";
import { addPost, resetAddPost } from "../../../../features/AddPost.slice";
import { addUserPost } from "../../../utils/Services/Posts.service";
import { useUserContext } from "../../../../contexts/UserContextProvider";

const PostForm = React.memo(({ image }) => {
  const dispatch = useDispatch();
  const post = useSelector((state) => state.addPost.Post);
  const { setShowToast, setToastMessage, setToastError } = useUserContext();
  const { register, handleSubmit, formState, setValue, getValues, reset } =
    useForm({
      defaultValues: {
        title: post.title,
        desc: post.desc,
        article: post.article,
        image: post.image,
      },
    });

  useEffect(() => {
    if (image) setValue("image", image);
  }, [image, setValue]);

  const handleChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      dispatch(addPost({ ...post, [name]: value }));
    },
    [dispatch, post]
  );

  const onSubmit = async () => {
    const { title, desc, article } = getValues();

    const req_body = {
      post_name: title,
      post_desc: desc,
      post_article: article,
      post_public: true,
    };

    const formData = new FormData();

    for (const key in req_body) {
      if (req_body.hasOwnProperty(key)) {
        formData.append(key, req_body[key]);
      }
    }

    formData.append("image", getValues("image"));

    try {
      const res = await addUserPost(formData);

      if (res?.data) {
        setShowToast(true);
        setToastMessage(res.data.message);
        reset();
      }
    } catch (error) {
      console.log(error);

      setShowToast(true);
      setToastError(error?.response?.data.errors ?? error.message);
    }

    dispatch(resetAddPost());
  };

  const onError = useCallback((err) => {
    console.error("Form submission error:", err);
  }, []);

  const { errors, isSubmitting, isValid } = formState;

  return (
    <form
      onSubmit={handleSubmit(onSubmit, onError)}
      className="h-full grid grid-rows-[auto_4rem] gap-2 p-2 pt-0"
    >
      <div className="h-full w-full grid grid-cols-1 grid-rows-[8rem_8rem_auto] gap-3">
        <div
          className={`grid grid-cols-1 ${
            errors.title
              ? "grid-rows-[2rem_5rem_2rem]"
              : "grid-rows-[2.3rem_5rem]"
          }`}
        >
          <label
            htmlFor="title"
            className="text-xl font-serif pl-2 text-gray-200"
          >
            Title
          </label>
          <input
            type="text"
            id="title"
            className="outline-none rounded-xl bg-gray-200 text-black text-4xl pl-2 pr-2"
            {...register("title", {
              required: "Title is required",
            })}
            onChange={handleChange}
          />
          {errors.title && (
            <p className="text-red-400 text-lg pl-2">{errors.title.message}</p>
          )}
        </div>

        <div
          className={`grid grid-cols-1 ${
            errors.desc ? "grid-rows-[2rem_5rem_1rem]" : "grid-rows-[3rem_5rem]"
          } `}
        >
          <label
            htmlFor="desc"
            className="text-xl font-serif pl-2 pr-2 text-gray-200 hover:text-white"
          >
            Description
          </label>
          <textarea
            id="desc"
            className="outline-none rounded-xl bg-gray-200 text-black text-3xl overflow-auto resize-none pl-2 pr-2 pt-2 text-justify break-words"
            {...register("desc", {
              required: "Description is required.",
              maxLength: {
                value: 130,
                message: "Max number of characters is 130.",
              },
            })}
            onChange={handleChange}
            maxLength={130}
          ></textarea>
          {errors.desc && (
            <p className="text-red-400 text-lg pl-2">{errors.desc.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 grid-rows-[1.3rem_auto] gap-3">
          <label
            htmlFor="article"
            className="text-xl font-serif pl-2 pr-2 text-gray-200 "
          >
            Article
          </label>
          <textarea
            id="article"
            className="outline-none rounded-xl bg-gray-200 text-black text-3xl overflow-auto resize-none p-4 text-justify break-words"
            {...register("article")}
            onChange={handleChange}
          ></textarea>
        </div>
      </div>

      <div className="self-end flex justify-center rounded-xl text-center">
        <button
          type="submit"
          className={`p-4 rounded-lg text-2xl flex justify-center w-full ${
            !isValid || !image || isSubmitting
              ? "bg-gray-500 text-white cursor-not-allowed"
              : "bg-green-400 text-white hover:scale-100 transform transition-all duration-300 ease-in-out"
          }`}
          disabled={!isValid || isSubmitting || !image}
        >
          {isSubmitting ? <Spinner height={20} width={20} /> : "Submit"}
        </button>
      </div>
    </form>
  );
});

export default PostForm;
