import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Trash2, ExternalLink, Users, FileText, TrendingUp, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api';
import { formatDate } from '../utils/formatDate';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const queryClient = useQueryClient();

  const { data: posts, isLoading: postsLoading } = useQuery({
    queryKey: ['adminPosts'],
    queryFn: async () => {
      const { data } = await api.get('/posts?pageNumber=1');
      return data.posts;
    },
  });

  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ['adminUsers'],
    queryFn: async () => {
      const { data } = await api.get('/users');
      return data;
    },
  });

  const deletePostMutation = useMutation({
    mutationFn: (id) => api.delete(`/posts/${id}`),
    onSuccess: () => {
      toast.success('Post removed by admin');
      queryClient.invalidateQueries(['adminPosts']);
    },
  });

  const stats = [
    { label: 'Total Posts', value: posts?.length || 0, icon: FileText, color: 'text-blue-500' },
    { label: 'Total Users', value: users?.length || 0, icon: Users, color: 'text-purple-500' },
    { label: 'Total Views', value: posts?.reduce((acc, p) => acc + p.views, 0) || 0, icon: TrendingUp, color: 'text-emerald-500' },
  ];

  if (postsLoading || usersLoading) return <div className="p-12 text-center">Crunching data...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center space-x-4 mb-12">
        <div className="p-3 bg-accent/10 rounded-2xl">
          <ShieldCheck className="w-8 h-8 text-accent" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Admin Dashboard</h1>
          <p className="text-slate-500 dark:text-slate-400">Manage your platform's growth and safety.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white dark:bg-dark-card p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center space-x-6">
            <div className={`p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">{stat.label}</p>
              <h3 className="text-3xl font-black dark:text-white">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="bg-white dark:bg-dark-card rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
            <h2 className="font-bold text-slate-900 dark:text-white">Recent Articles</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b dark:border-slate-800">
                  <th className="px-6 py-4 text-xs font-black uppercase text-slate-400">Post</th>
                  <th className="px-6 py-4 text-xs font-black uppercase text-slate-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {posts?.map(post => (
                  <tr key={post._id} className="border-b dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-bold text-slate-700 dark:text-slate-300 line-clamp-1 text-sm">{post.title}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <Link to={`/post/${post._id}`} className="p-1.5 rounded-lg text-slate-400 hover:text-accent"><ExternalLink className="w-4 h-4" /></Link>
                        <button onClick={() => deletePostMutation.mutate(post._id)} className="p-1.5 rounded-lg text-slate-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
