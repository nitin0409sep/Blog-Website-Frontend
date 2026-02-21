import { useQuery } from "react-query";
import { GlobalLoader } from "../../common/Loader";
import Error from "../../common/Error";
import "./Public.css";
import { useNavigate } from "react-router-dom";
import { fetchPublicPosts } from "../../utils/services/Posts.service";

const Public = () => {
  const navigate = useNavigate();

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

  if (!posts?.length) {
    return (
      <div className="flex flex-col justify-center items-center h-[60vh] gap-4">
        <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
          <svg className="w-8 h-8 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m6.75 12H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
          </svg>
        </div>
        <h2 className="text-2xl font-semibold text-white">No Posts Yet</h2>
        <p className="text-slate-400">Check back later for new content.</p>
      </div>
    );
  }

  const handleClick = (id) => {
    navigate(`/public/post/${id}`);
  };

  return (
    <div className="py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Explore Posts</h1>
        <p className="text-slate-400 mt-1">Discover stories and ideas from the community</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {posts.map((post, index) => (
          <article
            key={post.post_id || index}
            className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 hover:border-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-500 hover:-translate-y-1 cursor-pointer"
            onClick={() => handleClick(post.post_id)}
          >
            {/* Image */}
            <div className="aspect-[16/10] overflow-hidden">
              <img
                src={post.img_url}
                alt={post.post_name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/no-image.svg";
                }}
              />
            </div>

            {/* Content */}
            <div className="p-5">
              <h3 className="text-lg font-semibold text-white line-clamp-2 mb-2 group-hover:text-indigo-300 transition-colors">
                {post.post_name}
              </h3>

              <p className="text-sm text-slate-400 line-clamp-3 mb-4 leading-relaxed">
                {post.post_desc}
              </p>

              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-sm font-medium text-indigo-400 group-hover:text-indigo-300 transition-colors">
                  Read article
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default Public;
