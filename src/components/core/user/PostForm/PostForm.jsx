import React, { useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { Spinner } from "../../../common/Loader";
import { useDispatch, useSelector } from "react-redux";
import { addPost, resetAddPost } from "../../../../features/AddPost.slice";
import { addUserPost } from "../../../utils/services/Posts.service";
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

  const inputClass =
    "w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 transition-all";

  return (
    <form
      onSubmit={handleSubmit(onSubmit, onError)}
      className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 flex flex-col gap-5 h-full"
    >
      <div className="space-y-1.5">
        <label htmlFor="title" className="block text-sm font-medium text-slate-300">
          Title
        </label>
        <input
          type="text"
          id="title"
          placeholder="Give your post a title"
          className={inputClass}
          {...register("title", {
            required: "Title is required",
          })}
          onChange={handleChange}
        />
        {errors.title && (
          <p className="text-rose-400 text-xs">{errors.title.message}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <label htmlFor="desc" className="block text-sm font-medium text-slate-300">
          Description
        </label>
        <textarea
          id="desc"
          rows={2}
          placeholder="A brief summary of your post (max 130 chars)"
          className={`${inputClass} resize-none`}
          {...register("desc", {
            required: "Description is required.",
            maxLength: {
              value: 130,
              message: "Max number of characters is 130.",
            },
          })}
          onChange={handleChange}
          maxLength={130}
        />
        {errors.desc && (
          <p className="text-rose-400 text-xs">{errors.desc.message}</p>
        )}
      </div>

      <div className="space-y-1.5 flex-1 flex flex-col">
        <label htmlFor="article" className="block text-sm font-medium text-slate-300">
          Article
        </label>
        <textarea
          id="article"
          placeholder="Write your article content here..."
          className={`${inputClass} resize-none flex-1 min-h-[200px]`}
          {...register("article")}
          onChange={handleChange}
        />
      </div>

      <button
        type="submit"
        className={`w-full py-3 rounded-xl text-sm font-medium transition-all duration-300 flex items-center justify-center ${
          !isValid || !image || isSubmitting
            ? "bg-white/5 text-slate-500 cursor-not-allowed border border-white/10"
            : "bg-gradient-to-r from-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.02]"
        }`}
        disabled={!isValid || isSubmitting || !image}
      >
        {isSubmitting ? <Spinner height={20} width={20} /> : "Publish Post"}
      </button>
    </form>
  );
});

export default PostForm;
