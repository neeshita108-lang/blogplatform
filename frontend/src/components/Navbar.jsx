import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sun, Moon, Search, User, LogOut, PlusSquare, Menu, X } from 'lucide-react';
import useAuth from '../hooks/useAuth';

const Navbar = () => {
  const [isDark, setIsDark] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isDark) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [isDark]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?keyword=${searchQuery}`);
    }
  };

  return (
    <nav className="sticky top-0 z-50 glass-dark border-b border-slate-200 dark:border-slate-800 backdrop-blur-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-500/30">
              B
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white hidden sm:block">
              Modern<span className="text-accent">Blog</span>
            </span>
          </Link>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-8 relative">
            <input
              type="text"
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-full py-2 pl-10 pr-4 focus:ring-2 focus:ring-accent text-slate-900 dark:text-white transition-all"
            />
            <Search className="absolute left-3 top-2.5 text-slate-400 w-5 h-5" />
          </form>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={() => setIsDark(!isDark)}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {user ? (
              <div className="flex items-center space-x-4">
                <Link to="/create-post" className="btn-primary flex items-center space-x-2 py-1.5 px-4 text-sm">
                  <PlusSquare className="w-4 h-4" />
                  <span>Write</span>
                </Link>
                <div className="relative group">
                  <button className="flex items-center space-x-2 p-1 rounded-full border border-slate-200 dark:border-slate-700">
                    <img
                      src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100'}
                      alt="Avatar"
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  </button>
                  <div className="absolute right-0 mt-2 w-48 py-2 bg-white dark:bg-dark-card rounded-xl shadow-xl border border-slate-100 dark:border-slate-800 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                    <Link to={`/profile/${user._id}`} className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800">
                      Profile
                    </Link>
                    {user.role === 'admin' && (
                      <Link to="/dashboard" className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800">
                        Admin Dashboard
                      </Link>
                    )}
                    <button
                      onClick={logout}
                      className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center space-x-2"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login" className="px-4 py-2 text-slate-600 dark:text-slate-300 hover:text-accent font-medium">
                  Login
                </Link>
                <Link to="/register" className="btn-primary py-1.5 px-5 text-sm">
                  Join Now
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={() => setIsDark(!isDark)}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-400"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-400"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white dark:bg-dark-bg border-b dark:border-slate-800 px-4 pt-2 pb-6 space-y-4">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-100 dark:bg-slate-800 rounded-lg py-2 pl-10 focus:ring-accent"
            />
            <Search className="absolute left-3 top-2.5 text-slate-400 w-5 h-5" />
          </form>
          {user ? (
            <>
              <Link to="/create-post" className="block text-slate-700 dark:text-slate-300 font-medium">Create Post</Link>
              <Link to={`/profile/${user._id}`} className="block text-slate-700 dark:text-slate-300 font-medium">My Profile</Link>
              <button onClick={logout} className="block text-red-500 font-medium">Logout</button>
            </>
          ) : (
            <div className="flex flex-col space-y-2">
              <Link to="/login" className="block text-center py-2 px-4 rounded-lg bg-slate-100 dark:bg-slate-800">Login</Link>
              <Link to="/register" className="block text-center py-2 px-4 rounded-lg bg-accent text-white">Register</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
