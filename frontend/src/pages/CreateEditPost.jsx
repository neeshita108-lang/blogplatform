import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useMutation, useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { ImagePlus, Tags, Type, Layout, Send, Save } from 'lucide-react';
import api from '../api';

const CATEGORIES = ['Technology', 'Design', 'Lifestyle', 'Business', 'Health'];

const CreateEditPost = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    coverImage: '',
    category: 'Technology',
    tags: '',
    status: 'published',
  });

  const { data: post, isLoading } = useQuery({
    queryKey: ['post', id],
    queryFn: async () => {
      const { data } = await api.get(`/posts/${id}`);
      return data;
    },
    enabled: isEdit,
  });

  useEffect(() => {
    if (post && isEdit) {
      setFormData({
        title: post.title,
        content: post.content,
        coverImage: post.coverImage,
        category: post.category,
        tags: post.tags.join(', '),
        status: post.status,
      });
    }
  }, [post, isEdit]);

  const mutation = useMutation({
    mutationFn: (data) => {
      const formattedData = {
        ...data,
        tags: data.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== ''),
      };
      return isEdit ? api.put(`/posts/${id}`, formattedData) : api.post('/posts', formattedData);
    },
    onSuccess: (res) => {
      toast.success(isEdit ? 'Post updated!' : 'Post published!');
      navigate(`/post/${res.data._id}`);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Something went wrong');
    },
  });

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link', 'image', 'code-block'],
      ['clean'],
    ],
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.content) {
      return toast.error('Title and content are required');
    }
    mutation.mutate(formData);
  };

  if (isEdit && isLoading) return <div className="text-center py-20">Loading...</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-12">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">
            {isEdit ? 'Refine your masterpiece' : 'Share your story'}
          </h1>
          <p className="text-slate-500 dark:text-slate-400">Everything you need to create a stunning article.</p>
        </div>
        <div className="flex space-x-4">
          <button 
            type="button" 
            onClick={() => setFormData({...formData, status: 'draft'})}
            className="px-6 py-2 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Draft</span>
          </button>
          <button 
            onClick={handleSubmit}
            disabled={mutation.isLoading}
            className="btn-primary flex items-center space-x-2"
          >
            <Send className="w-4 h-4" />
            <span>{isEdit ? 'Update Post' : 'Publish Post'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
          <div className="relative group">
            <input
              type="text"
              placeholder="Article Title"
              className="w-full text-4xl md:text-5xl font-black bg-transparent border-none focus:ring-0 placeholder-slate-300 dark:placeholder-slate-700 dark:text-white p-0"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
            />
            <div className="h-1 w-20 bg-accent mt-4 group-focus-within:w-full transition-all duration-500" />
          </div>

          <div className="bg-white dark:bg-dark-card rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800">
            <ReactQuill
              theme="snow"
              value={formData.content}
              onChange={(val) => setFormData({...formData, content: val})}
              modules={modules}
              className="dark:text-white"
            />
          </div>
        </div>

        <aside className="space-y-8">
          <div className="bg-white dark:bg-dark-card rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="text-lg font-bold dark:text-white mb-6 flex items-center space-x-2">
              <Layout className="w-5 h-5 text-accent" />
              <span>Post Settings</span>
            </h3>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center space-x-2">
                  <Type className="w-4 h-4" />
                  <span>Category</span>
                </label>
                <select
                  className="input-field"
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                >
                  {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center space-x-2">
                  <Tags className="w-4 h-4" />
                  <span>Tags (comma separated)</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. tech, coding, tutorial"
                  className="input-field"
                  value={formData.tags}
                  onChange={(e) => setFormData({...formData, tags: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center space-x-2">
                  <ImagePlus className="w-4 h-4" />
                  <span>Cover Image URL</span>
                </label>
                <input
                  type="text"
                  placeholder="Paste image URL here"
                  className="input-field"
                  value={formData.coverImage}
                  onChange={(e) => setFormData({...formData, coverImage: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Visibility</label>
                <div className="flex items-center space-x-4">
                  <button
                    type="button"
                    onClick={() => setFormData({...formData, status: 'published'})}
                    className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-all ${
                      formData.status === 'published' 
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400' 
                        : 'border-slate-200 dark:border-slate-800 dark:text-slate-500'
                    }`}
                  >
                    Published
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({...formData, status: 'draft'})}
                    className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-all ${
                      formData.status === 'draft' 
                        ? 'bg-orange-50 border-orange-500 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400' 
                        : 'border-slate-200 dark:border-slate-800 dark:text-slate-500'
                    }`}
                  >
                    Draft
                  </button>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default CreateEditPost;
