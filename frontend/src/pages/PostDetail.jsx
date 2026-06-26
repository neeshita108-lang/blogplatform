import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Heart, Share2, MessageCircle, ChevronLeft, Calendar, Clock, Eye, Trash2, Edit } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api';
import useAuth from '../hooks/useAuth';
import { SkeletonDetail } from '../components/Skeleton';
import { formatDate } from '../utils/formatDate';
import { calculateReadingTime } from '../utils/readingTime';
import { useState } from 'react';

const PostDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [commentContent, setCommentContent] = useState('');

  const { data: post, isLoading, isError } = useQuery({
    queryKey: ['post', id],
    queryFn: async () => {
      const { data } = await api.get(`/posts/${id}`);
      return data;
    },
  });

  const { data: comments, isLoading: commentsLoading } = useQuery({
    queryKey: ['comments', id],
    queryFn: async () => {
      const { data } = await api.get(`/comments/${id}`);
      return data;
    },
  });

  const likeMutation = useMutation({
    mutationFn: () => api.put(`/posts/${id}/like`),
    onSuccess: (data) => {
      queryClient.setQueryData(['post', id], (old) => ({ ...old, likes: data.data }));
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => api.delete(`/posts/${id}`),
    onSuccess: () => {
      toast.success('Post deleted successfully');
      navigate('/');
    },
  });

  const commentMutation = useMutation({
    mutationFn: (newComment) => api.post(`/comments/${id}`, { content: newComment }),
    onSuccess: () => {
      toast.success('Comment added');
      setCommentContent('');
      queryClient.invalidateQueries(['comments', id]);
    },
  });

  const deleteCommentMutation = useMutation({
    mutationFn: (commentId) => api.delete(`/comments/${commentId}`),
    onSuccess: () => {
      toast.success('Comment deleted');
      queryClient.invalidateQueries(['comments', id]);
    },
  });

  if (isLoading) return <div className="max-w-7xl mx-auto px-4 py-12"><SkeletonDetail /></div>;
  if (isError) return <div className="text-center py-20 text-red-500">Post not found</div>;

  const isAuthor = user?._id === post.author._id || user?.role === 'admin';
  const readingTime = calculateReadingTime(post.content);
  const isLiked = user && post.likes.includes(user._id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link to="/" className="inline-flex items-center text-slate-500 hover:text-accent mb-8 transition-colors group">
        <ChevronLeft className="w-5 h-5 mr-1 group-hover:-translate-x-1 transition-transform" />
        Back to articles
      </Link>

      <article className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="mb-12">
          <div className="flex items-center space-x-2 mb-6">
            <span className="px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-accent text-xs font-bold uppercase tracking-wider">
              {post.category}
            </span>
            <div className="flex space-x-2 text-slate-400 text-xs">
              {post.tags.map(tag => <span key={tag}>#{tag}</span>)}
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-8 tracking-tight leading-[1.15]">
            {post.title}
          </h1>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 py-8 border-y border-slate-100 dark:border-slate-800">
            <div className="flex items-center space-x-4">
              <img
                src={post.author.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100'}
                alt={post.author.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-accent/20"
              />
              <div>
                <p className="font-bold text-slate-900 dark:text-white">{post.author.name}</p>
                <div className="flex items-center text-xs text-slate-500 space-x-3">
                  <span className="flex items-center"><Calendar className="w-3.5 h-3.5 mr-1" /> {formatDate(post.createdAt)}</span>
                  <span className="flex items-center"><Clock className="w-3.5 h-3.5 mr-1" /> {readingTime} min read</span>
                  <span className="flex items-center"><Eye className="w-3.5 h-3.5 mr-1" /> {post.views} views</span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {isAuthor && (
                <>
                  <Link to={`/edit-post/${post._id}`} className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-accent transition-colors">
                    <Edit className="w-5 h-5" />
                  </Link>
                  <button onClick={() => deleteMutation.mutate()} className="p-2 rounded-lg bg-red-50 dark:bg-red-900/10 text-red-500 hover:bg-red-100 transition-colors">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </>
              )}
              <div className="w-[1px] h-8 bg-slate-200 dark:border-slate-700 mx-2 hidden md:block" />
              <button 
                onClick={() => user ? likeMutation.mutate() : toast.error('Please login to like')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all ${
                  isLiked 
                    ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' 
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}
              >
                <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                <span className="font-bold">{post.likes.length}</span>
              </button>
              <button className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-accent transition-colors">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </header>

        {/* Cover Image */}
        <div className="w-full h-[400px] md:h-[500px] rounded-3xl overflow-hidden mb-12 shadow-2xl">
          <img
            src={post.coverImage || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&q=80&w=1200'}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content */}
        <div 
          className="prose prose-lg dark:prose-invert max-w-none mb-20 text-slate-700 dark:text-slate-300 leading-relaxed font-inter ql-editor px-0"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Author Bio */}
        <div className="p-8 bg-slate-50 dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-center gap-8 mb-20">
          <img
            src={post.author.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150'}
            alt={post.author.name}
            className="w-24 h-24 rounded-full object-cover"
          />
          <div className="text-center md:text-left">
            <h3 className="text-xl font-bold dark:text-white mb-2">Written by {post.author.name}</h3>
            <p className="text-slate-500 dark:text-slate-400 mb-4">{post.author.bio || 'Product designer, writer, and tech enthusiast.'}</p>
            <Link to={`/profile/${post.author._id}`} className="text-accent font-bold hover:underline">View Profile</Link>
          </div>
        </div>

        {/* Comments Section */}
        <section className="border-t border-slate-100 dark:border-slate-800 pt-12">
          <div className="flex items-center space-x-2 mb-8">
            <MessageCircle className="w-6 h-6 text-accent" />
            <h2 className="text-2xl font-bold dark:text-white">Responses ({comments?.length || 0})</h2>
          </div>

          {user ? (
            <div className="mb-12">
              <div className="flex gap-4">
                <img
                  src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=50'}
                  alt={user.name}
                  className="w-10 h-10 rounded-full object-cover border-2 border-accent/20"
                />
                <div className="flex-1">
                  <textarea
                    placeholder="Add to the discussion..."
                    className="w-full bg-white dark:bg-dark-card border border-slate-200 dark:border-slate-800 rounded-2xl p-4 focus:ring-2 focus:ring-accent focus:outline-none dark:text-white transition-all h-32"
                    value={commentContent}
                    onChange={(e) => setCommentContent(e.target.value)}
                  />
                  <div className="flex justify-end mt-4">
                    <button 
                      onClick={() => commentMutation.mutate(commentContent)}
                      disabled={!commentContent.trim() || commentMutation.isLoading}
                      className="btn-primary"
                    >
                      Publish Comment
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-50 dark:bg-slate-900 rounded-2xl p-8 text-center mb-12">
              <p className="dark:text-white mb-4">You must be logged in to leave a comment.</p>
              <Link to="/login" className="btn-primary inline-block">Login to Comment</Link>
            </div>
          )}

          <div className="space-y-8">
            {comments?.map((comment) => (
              <div key={comment._id} className="group flex gap-4">
                <img
                  src={comment.author.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=50'}
                  alt={comment.author.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="bg-slate-50 dark:bg-slate-900 rounded-2xl p-5 border border-slate-100 dark:border-slate-800">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold dark:text-white text-sm">{comment.author.name}</span>
                        <span className="text-xs text-slate-400">{formatDate(comment.createdAt)}</span>
                      </div>
                      {(user?._id === comment.author._id || user?.role === 'admin') && (
                        <button 
                          onClick={() => deleteCommentMutation.mutate(comment._id)}
                          className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{comment.content}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </article>
    </div>
  );
};

export default PostDetail;
