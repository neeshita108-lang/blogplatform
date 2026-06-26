import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { User, Mail, Calendar, Edit, LayoutGrid, List, MapPin, Link as LinkIcon, Camera } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api';
import useAuth from '../hooks/useAuth';
import PostCard from '../components/PostCard';
import { formatDate } from '../utils/formatDate';

const Profile = () => {
  const { id } = useParams();
  const { user: currentUser, updateProfile } = useAuth();
  const queryClient = useQueryClient();
  const isOwnProfile = currentUser?._id === id;

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: '',
    bio: '',
    avatar: '',
  });

  const { data: profile, isLoading } = useQuery({
    queryKey: ['user', id],
    queryFn: async () => {
      const { data } = await api.get(`/users/${id}`);
      return data;
    },
    onSuccess: (data) => {
      if (isOwnProfile) {
        setEditData({ name: data.name, bio: data.bio, avatar: data.avatar });
      }
    }
  });

  const { data: posts, isLoading: postsLoading } = useQuery({
    queryKey: ['userPosts', id],
    queryFn: async () => {
      const { data } = await api.get(`/posts/user/${id}`);
      return data;
    },
  });

  const mutation = useMutation({
    mutationFn: (newData) => updateProfile(newData),
    onSuccess: () => {
      toast.success('Profile updated!');
      setIsEditing(false);
      queryClient.invalidateQueries(['user', id]);
    },
  });

  if (isLoading) return <div className="text-center py-20">Loading profile...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white dark:bg-dark-card rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm mb-12">
        <div className="h-48 bg-gradient-to-r from-accent to-indigo-800" />
        <div className="px-8 pb-8">
          <div className="relative flex flex-col md:flex-row items-end -mt-16 gap-6 mb-8 text-center md:text-left">
            <div className="relative mx-auto md:mx-0">
               <img
                src={profile.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200'}
                alt={profile.name}
                className="w-40 h-40 rounded-3xl object-cover border-8 border-white dark:border-dark-card shadow-lg"
              />
            </div>

            <div className="flex-1 pb-4">
              <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">{profile.name}</h1>
              <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-slate-500 dark:text-slate-400 font-medium">
                <span className="flex items-center"><Mail className="w-4 h-4 mr-1.5" /> {profile.email}</span>
                <span className="flex items-center"><Calendar className="w-4 h-4 mr-1.5" /> Joined {formatDate(profile.createdAt)}</span>
              </div>
            </div>

            <div className="pb-4">
              {isOwnProfile && (
                <button 
                  onClick={() => setIsEditing(!isEditing)}
                  className="px-6 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all flex items-center space-x-2"
                >
                  <Edit className="w-4 h-4" />
                  <span>{isEditing ? 'Cancel Edit' : 'Edit Profile'}</span>
                </button>
              )}
            </div>
          </div>

          {isEditing ? (
            <div className="max-w-2xl space-y-6">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Full Name</label>
                    <input
                      type="text"
                      className="input-field"
                      value={editData.name}
                      onChange={(e) => setEditData({...editData, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Avatar URL</label>
                    <input
                      type="text"
                      className="input-field"
                      value={editData.avatar}
                      onChange={(e) => setEditData({...editData, avatar: e.target.value})}
                    />
                  </div>
               </div>
               <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Bio</label>
                  <textarea
                    rows={4}
                    className="input-field"
                    value={editData.bio}
                    onChange={(e) => setEditData({...editData, bio: e.target.value})}
                    placeholder="Tell the world about yourself..."
                  />
               </div>
               <button 
                onClick={() => mutation.mutate(editData)}
                disabled={mutation.isLoading}
                className="btn-primary"
               >
                Save Changes
               </button>
            </div>
          ) : (
            <div className="max-w-3xl">
              <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                {profile.bio || "No bio yet."}
              </p>
            </div>
          )}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-8">Articles by {profile.name}</h2>
        {postsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => <div key={i} className="h-64 bg-slate-200 dark:bg-slate-800 rounded-3xl animate-pulse" />)}
          </div>
        ) : posts?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map(post => <PostCard key={post._id} post={post} />)}
          </div>
        ) : (
          <div className="text-center py-20 bg-slate-50 dark:bg-slate-900 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800">
             <p className="text-slate-500 dark:text-slate-400 italic">No articles published yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
