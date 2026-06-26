import { Link } from 'react-router-dom';
import { Calendar, Clock, Eye, LucideArrowUpRight } from 'lucide-react';
import { formatDate } from '../utils/formatDate';
import { calculateReadingTime } from '../utils/readingTime';

const PostCard = ({ post }) => {
  const readingTime = calculateReadingTime(post.content);

  return (
    <article className="group relative bg-white dark:bg-dark-card rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 hover:border-accent dark:hover:border-accent transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      {/* Image Wrapper */}
      <Link to={`/post/${post._id}`} className="block relative overflow-hidden aspect-[16/10]">
        <img
          src={post.coverImage || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&q=80&w=600'}
          alt={post.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 rounded-full bg-accent/90 text-white text-xs font-semibold backdrop-blur-sm">
            {post.category}
          </span>
        </div>
      </Link>

      <div className="p-6">
        {/* Meta Info */}
        <div className="flex items-center space-x-4 mb-4 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center">
            <Calendar className="w-3.5 h-3.5 mr-1.5" />
            {formatDate(post.createdAt)}
          </div>
          <div className="flex items-center">
            <Clock className="w-3.5 h-3.5 mr-1.5" />
            {readingTime} min read
          </div>
        </div>

        {/* Title */}
        <Link to={`/post/${post._id}`}>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-accent transition-colors line-clamp-2 leading-tight">
            {post.title}
          </h3>
        </Link>

        {/* Excerpt */}
        <p className="text-slate-600 dark:text-slate-400 text-sm mb-6 line-clamp-3 overflow-hidden" 
           dangerouslySetInnerHTML={{ __html: post.content.substring(0, 150) + '...' }} />

        {/* Footer */}
        <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <img
              src={post.author?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=50'}
              alt={post.author?.name}
              className="w-8 h-8 rounded-full object-cover"
            />
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              {post.author?.name}
            </span>
          </div>
          
          <Link to={`/post/${post._id}`} className="text-accent group-hover:bg-accent group-hover:text-white p-2 rounded-full transition-all">
            <LucideArrowUpRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </article>
  );
};

export default PostCard;
