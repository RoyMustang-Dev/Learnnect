import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, Save, X } from 'lucide-react';
import { blogService, adminBlogService } from '../services/blogService';
import { adminAuthService } from '../services/adminAuthService';
import { BlogPost } from '../types/blog';
import LoadingSpinner from '../components/common/LoadingSpinner';
import AdminLogin from '../components/AdminLogin';

const AdminBlogPage: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [needsLogin, setNeedsLogin] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    author: '',
    category: 'Technology',
    tags: '',
    featuredImage: '',
    status: 'draft' as 'draft' | 'published'
  });

  useEffect(() => {
    checkAdminAndLoadPosts();
  }, []);

  const checkAdminAndLoadPosts = async () => {
    try {
      console.log('🔍 AdminBlogPage: Checking admin status...');
      const adminStatus = await adminAuthService.isAdmin();
      console.log('✅ AdminBlogPage: Admin status result:', adminStatus);

      setIsAdmin(adminStatus);

      if (adminStatus) {
        console.log('✅ AdminBlogPage: User is admin, loading posts...');
        const allPosts = await adminBlogService.getAllPostsForAdmin();
        setPosts(allPosts);
        setNeedsLogin(false);
      } else {
        console.log('❌ AdminBlogPage: User is not admin, showing login...');
        setNeedsLogin(true);
      }
    } catch (error) {
      console.error('❌ AdminBlogPage: Error checking admin status:', error);
      setNeedsLogin(true);
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSuccess = () => {
    console.log('🎉 AdminBlogPage: Login success callback triggered');
    setNeedsLogin(false);
    setLoading(true);
    checkAdminAndLoadPosts();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'title' && !editingPost ? { slug: value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') } : {})
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log('💾 Admin: Saving post...', editingPost ? 'UPDATE' : 'CREATE');
      console.log('📝 Admin: Form data:', formData);

      const postData = {
        ...formData,
        authorId: 'admin', // Add required authorId field
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        readTime: Math.ceil(formData.content.split(' ').length / 200), // Estimate reading time
        publishedAt: formData.status === 'published' ? new Date() : undefined
      };

      console.log('🔄 Admin: Processed post data:', postData);

      if (editingPost) {
        console.log('✏️ Admin: Updating existing post:', editingPost.id);
        await adminBlogService.updatePost(editingPost.id, postData);
        console.log('✅ Admin: Post updated successfully');
      } else {
        console.log('➕ Admin: Creating new post');
        const newPostId = await adminBlogService.createPost(postData);
        console.log('✅ Admin: Post created successfully with ID:', newPostId);
      }

      // Reset form and reload posts
      setFormData({
        title: '', slug: '', excerpt: '', content: '', author: '',
        category: 'Technology', tags: '', featuredImage: '', status: 'draft'
      });
      setShowCreateForm(false);
      setEditingPost(null);
      checkAdminAndLoadPosts();
    } catch (error) {
      console.error('❌ Admin: Error saving post:', error);
      alert('Error saving post. Please try again.');
    }
  };

  const handleEdit = (post: BlogPost) => {
    console.log('✏️ Admin: Editing post:', post.title);
    console.log('📝 Admin: Post data:', post);

    setEditingPost(post);
    setFormData({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      author: post.author,
      category: post.category,
      tags: Array.isArray(post.tags) ? post.tags.join(', ') : '',
      featuredImage: post.featuredImage || '',
      status: post.status
    });
    setShowCreateForm(true);

    console.log('✅ Admin: Edit form opened');
  };

  const handleDelete = async (postId: string) => {
    console.log('🗑️ Admin: Attempting to delete post:', postId);

    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        console.log('🔄 Admin: Deleting post...');
        await adminBlogService.deletePost(postId);
        console.log('✅ Admin: Post deleted successfully');
        checkAdminAndLoadPosts();
      } catch (error) {
        console.error('❌ Admin: Error deleting post:', error);
        alert('Error deleting post. Please try again.');
      }
    } else {
      console.log('❌ Admin: Delete cancelled by user');
    }
  };

  const cancelEdit = () => {
    setShowCreateForm(false);
    setEditingPost(null);
    setFormData({
      title: '', slug: '', excerpt: '', content: '', author: '',
      category: 'Technology', tags: '', featuredImage: '', status: 'draft'
    });
  };

  if (loading) {
    return <LoadingSpinner text="Checking admin access..." />;
  }

  if (needsLogin || !isAdmin) {
    return <AdminLogin onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="relative bg-gradient-to-br from-neon-black via-gray-900 to-neon-black min-h-screen">
      {/* Background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-neon-cyan/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-neon-magenta/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="relative z-10 pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-neon-magenta">
                Blog Admin Dashboard
              </h1>
              <p className="text-cyan-200 mt-2">Manage your blog posts and content</p>
            </div>
            <button
              onClick={() => setShowCreateForm(true)}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-neon-cyan/20 to-neon-blue/20 text-neon-cyan border border-neon-cyan/50 rounded-xl hover:bg-neon-cyan/10 transition-all duration-300"
            >
              <Plus className="h-5 w-5" />
              <span>New Post</span>
            </button>
          </div>

          {/* Create/Edit Form */}
          {showCreateForm && (
            <div className="mb-8 p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-neon-cyan">
                  {editingPost ? 'Edit Post' : 'Create New Post'}
                </h2>
                <button onClick={cancelEdit} className="text-gray-400 hover:text-white">
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-cyan-200 mb-2">Title</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-cyan-300/50 focus:outline-none focus:ring-2 focus:ring-neon-cyan"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-cyan-200 mb-2">Slug</label>
                    <input
                      type="text"
                      name="slug"
                      value={formData.slug}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-cyan-300/50 focus:outline-none focus:ring-2 focus:ring-neon-cyan"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-cyan-200 mb-2">Excerpt</label>
                  <textarea
                    name="excerpt"
                    value={formData.excerpt}
                    onChange={handleInputChange}
                    required
                    rows={3}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-cyan-300/50 focus:outline-none focus:ring-2 focus:ring-neon-cyan"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-cyan-200 mb-2">Content (Markdown supported)</label>
                  <textarea
                    name="content"
                    value={formData.content}
                    onChange={handleInputChange}
                    required
                    rows={10}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-cyan-300/50 focus:outline-none focus:ring-2 focus:ring-neon-cyan"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-cyan-200 mb-2">Author</label>
                    <input
                      type="text"
                      name="author"
                      value={formData.author}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-cyan-300/50 focus:outline-none focus:ring-2 focus:ring-neon-cyan"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-cyan-200 mb-2">Category</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-neon-cyan"
                    >
                      <option value="Technology">Technology</option>
                      <option value="Programming">Programming</option>
                      <option value="Design">Design</option>
                      <option value="Business">Business</option>
                      <option value="Tutorial">Tutorial</option>
                      <option value="News">News</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-cyan-200 mb-2">Status</label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-neon-cyan"
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-cyan-200 mb-2">Featured Image URL</label>
                    <input
                      type="url"
                      name="featuredImage"
                      value={formData.featuredImage}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-cyan-300/50 focus:outline-none focus:ring-2 focus:ring-neon-cyan"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-cyan-200 mb-2">Tags (comma separated)</label>
                    <input
                      type="text"
                      name="tags"
                      value={formData.tags}
                      onChange={handleInputChange}
                      placeholder="react, javascript, tutorial"
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-cyan-300/50 focus:outline-none focus:ring-2 focus:ring-neon-cyan"
                    />
                  </div>
                </div>

                <div className="flex space-x-4">
                  <button
                    type="submit"
                    className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-neon-cyan/20 to-neon-blue/20 text-neon-cyan border border-neon-cyan/50 rounded-xl hover:bg-neon-cyan/10 transition-all duration-300"
                  >
                    <Save className="h-5 w-5" />
                    <span>{editingPost ? 'Update Post' : 'Create Post'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="px-6 py-3 text-gray-400 border border-gray-600 rounded-xl hover:bg-gray-700 transition-all duration-300"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Posts List */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-neon-cyan">All Posts ({posts.length})</h2>
            {posts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-cyan-200">No posts found. Create your first post!</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {posts.map((post) => (
                  <div
                    key={post.id}
                    className="p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-bold text-white">{post.title}</h3>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            post.status === 'published'
                              ? 'bg-green-500/20 text-green-400'
                              : 'bg-yellow-500/20 text-yellow-400'
                          }`}>
                            {post.status}
                          </span>
                        </div>
                        <p className="text-cyan-200/80 text-sm mb-2">{post.excerpt}</p>
                        <div className="flex items-center space-x-4 text-xs text-cyan-400">
                          <span>By {post.author}</span>
                          <span>{post.category}</span>
                          <span className="flex items-center space-x-1">
                            <Eye className="h-3 w-3" />
                            <span>{post.views}</span>
                          </span>
                        </div>
                      </div>
                      <div className="flex space-x-2 ml-4">
                        <button
                          onClick={() => handleEdit(post)}
                          className="p-2 text-neon-cyan hover:bg-neon-cyan/10 rounded-lg transition-colors"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(post.id)}
                          className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminBlogPage;
