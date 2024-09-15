import { useQuery } from "react-query";
import { fetchPublicPosts } from "../Services/Posts.service";
import { GlobalLoader } from "../../common/Loader";
import Error from "../../common/Error";
import "./Public.css";

const Public = () => {
  // isFetching, isSuccess
  const {
    data: posts,
    isLoading,
    error,
    isError,
  } = useQuery("public-posts", fetchPublicPosts, {
    select: (data) => {
      return data.data.posts;
    },
  });

  if (isLoading) {
    return <GlobalLoader />;
  }

  if (isError) {
    console.log(error);
    return <Error />;
  }

  return (
    <div className="outer-container">
      <div className="gridcontainer">
        {posts.map((post, index) => (
          <div className="griditem" key={post.post_id || index}>
            <div className="innergrid">
              {/* Post Image */}
              <div className="innergriditem1">
                <img
                  src={post.img_url}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                  alt="Post image"
                  onError={(e) => {
                    e.target.onerror = null; // Prevent infinite loop in case the fallback image also fails
                    e.target.src = "/no-image.svg";
                  }}
                />
              </div>

              {/* Post Name */}
              <div className="innergriditem2 text-pink-500 bg-slate-200 font-bold font-serif">
                {post.post_name}
              </div>
              {/* Description */}
              <div className="innergriditem3 text-purple-500 bg-slate-200">
                {post.post_desc}
              </div>

              {/* Read Article Button */}
              <div
                className="innergriditem4 bg-blue-400 text-white font-medium font-serif cursor-pointer
                     hover:transform hover:transition-all hover:duration-500 hover:ease-in-out hover:rounded-t-none rounded-br-xl rounded-bl-xl
                    hover:scale-100 justify-center hover:bg-slate-100 hover:text-blue-400"
              >
                <span>Read Full Article</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Public;
