import Post from '../models/Post.js';

// @desc    Get all posts
// @route   GET /api/posts
export const getPosts = async (req, res) => {
  const pageSize = 10;
  const page = Number(req.query.pageNumber) || 1;
  const keyword = req.query.keyword
    ? {
        title: {
          $regex: req.query.keyword,
          $options: 'i',
        },
      }
    : {};

  const category = req.query.category ? { category: req.query.category } : {};

  const count = await Post.countDocuments({ ...keyword, ...category, status: 'published' });
  const posts = await Post.find({ ...keyword, ...category, status: 'published' })
    .populate('author', 'name avatar')
    .sort({ createdAt: -1 })
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({ posts, page, pages: Math.ceil(count / pageSize) });
};

// @desc    Get single post
// @route   GET /api/posts/:id
export const getPostById = async (req, res) => {
  const post = await Post.findById(req.params.id).populate('author', 'name avatar bio');

  if (post) {
    post.views += 1;
    await post.save();
    res.json(post);
  } else {
    res.status(404);
    throw new Error('Post not found');
  }
};

// @desc    Create a post
// @route   POST /api/posts
export const createPost = async (req, res) => {
  const { title, content, coverImage, tags, category, status } = req.body;

  const post = new Post({
    title,
    content,
    coverImage,
    tags,
    category,
    status,
    author: req.user._id,
  });

  const createdPost = await post.save();
  res.status(201).json(createdPost);
};

// @desc    Update a post
// @route   PUT /api/posts/:id
export const updatePost = async (req, res) => {
  const { title, content, coverImage, tags, category, status } = req.body;

  const post = await Post.findById(req.params.id);

  if (post) {
    if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      res.status(401);
      throw new Error('User not authorized');
    }

    post.title = title || post.title;
    post.content = content || post.content;
    post.coverImage = coverImage || post.coverImage;
    post.tags = tags || post.tags;
    post.category = category || post.category;
    post.status = status || post.status;

    const updatedPost = await post.save();
    res.json(updatedPost);
  } else {
    res.status(404);
    throw new Error('Post not found');
  }
};

// @desc    Delete a post
// @route   DELETE /api/posts/:id
export const deletePost = async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (post) {
    if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      res.status(401);
      throw new Error('User not authorized');
    }
    await post.deleteOne();
    res.json({ message: 'Post removed' });
  } else {
    res.status(404);
    throw new Error('Post not found');
  }
};

// @desc    Get user posts
// @route   GET /api/posts/user/:userId
export const getUserPosts = async (req, res) => {
  const posts = await Post.find({ author: req.params.userId }).populate('author', 'name avatar');
  res.json(posts);
};

// @desc    Like/Unlike post
// @route   PUT /api/posts/:id/like
export const likePost = async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (post) {
    const alreadyLiked = post.likes.find((r) => r.toString() === req.user._id.toString());

    if (alreadyLiked) {
      post.likes = post.likes.filter((r) => r.toString() !== req.user._id.toString());
    } else {
      post.likes.push(req.user._id);
    }

    await post.save();
    res.json(post.likes);
  } else {
    res.status(404);
    throw new Error('Post not found');
  }
};
