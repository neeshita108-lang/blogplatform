import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import api from '../api';
import PostCard from '../components/PostCard';
import { SkeletonCard } from '../components/Skeleton';
import { Search, ChevronLeft, ChevronRight, SlidersHorizontal } from 'lucide-react';

const CATEGORIES = ['All', 'Technology', 'Design', 'Lifestyle', 'Business', 'Health'];

const Home = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeCategory, setActiveCategory] = useState(searchParams.get('category') || 'All');
  
  const page = searchParams.get('pageNumber') || 1;
  const keyword = searchParams.get('keyword') || '';

  const { data, isLoading, isError } = useQuery({
    queryKey: ['posts', page, keyword, activeCategory],
    queryFn: async () => {
      const catParam = activeCategory === 'All' ? '' : `&category=${activeCategory}`;
      const { data } = await api.get(`/posts?pageNumber=${page}&keyword=${keyword}${catParam}`);
      return data;
    },
    keepPreviousData: true,
  });

  const handleCategoryClick = (category) => {
    setActiveCategory(category);
    setSearchParams({ category, pageNumber: 1 });
  };

  const handlePageChange = (newPage) => {
    setSearchParams({ pageNumber: newPage, keyword, category: activeCategory });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 dark:text-white mb-6 tracking-tight">
          Discover the latest in <span className="text-accent underline decoration-indigo-500/30 decoration-8 underline-offset-4">Digital Innovation</span>
        </h1>
        <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Insights, thoughts and stories from the leading minds in technology and design.
        </p>
      </div>

      {/* Filter & Categories */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
        <div className="flex overflow-x-auto pb-2 w-full md:w-auto scrollbar-hide space-x-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryClick(cat)}
              className={`px-6 py-2 rounded-full whitespace-nowrap transition-all flex-shrink-0 ${
                activeCategory === cat
                  ? 'bg-accent text-white shadow-lg shadow-indigo-500/30'
                  : 'bg-white dark:bg-dark-card text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:border-accent'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        
        <div className="flex items-center space-x-2 text-slate-500 dark:text-slate-400 text-sm font-medium border-l border-slate-200 dark:border-slate-800 pl-4 hidden md:flex">
          <SlidersHorizontal className="w-4 h-4" />
          <span>Sort: Latest First</span>
        </div>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : isError ? (
        <div className="text-center py-20 bg-slate-50 dark:bg-slate-900 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800">
          <p className="text-xl text-red-500 font-medium">Something went wrong. Please try again later.</p>
        </div>
      ) : data?.posts.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 dark:bg-slate-900 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800">
          <div className="w-16 h-16 bg-slate-200 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-2xl font-bold dark:text-white mb-2">No posts found</h3>
          <p className="text-slate-500 dark:text-slate-400">Try adjusting your filters or search keywords.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {data.posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>

          {/* Pagination */}
          {data.pages > 1 && (
            <div className="flex justify-center items-center space-x-4 mt-16">
              <button
                onClick={() => handlePageChange(Math.max(1, data.page - 1))}
                disabled={data.page === 1}
                className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 disabled:opacity-50 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                <ChevronLeft className="w-5 h-5 dark:text-white" />
              </button>
              <div className="flex space-x-2">
                {[...Array(data.pages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => handlePageChange(i + 1)}
                    className={`w-10 h-10 rounded-lg font-medium transition-all ${
                      data.page === i + 1
                        ? 'bg-accent text-white shadow-md'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              <button
                onClick={() => handlePageChange(Math.min(data.pages, data.page + 1))}
                disabled={data.page === data.pages}
                className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 disabled:opacity-50 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                <ChevronRight className="w-5 h-5 dark:text-white" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Home;
