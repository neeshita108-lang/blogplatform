import Comment from '../models/Comment.js';

// @desc    Get comments for a post
// @route   GET /api/comments/:postId
export const getComments = async (req, res) => {
  const comments = await Comment.find({ postId: req.params.postId }).populate('author', 'name avatar').sort({ createdAt: -1 });
  res.json(comments);
};

// @desc    Add a comment
// @route   POST /api/comments/:postId
export const addComment = async (req, res) => {
  const { content } = req.body;

  const comment = new Comment({
    postId: req.params.postId,
    author: req.user._id,
    content,
  });

  const createdComment = await comment.save();
  const populatedComment = await Comment.findById(createdComment._id).populate('author', 'name avatar');
  res.status(201).json(populatedComment);
};

// @desc    Delete a comment
// @route   DELETE /api/comments/:id
export const deleteComment = async (req, res) => {
  const comment = await Comment.findById(req.params.id);

  if (comment) {
    if (comment.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      res.status(401);
      throw new Error('User not authorized');
    }
    await comment.deleteOne();
    res.json({ message: 'Comment removed' });
  } else {
    res.status(404);
    throw new Error('Comment not found');
  }
};

// @desc    Update a comment
// @route   PUT /api/comments/:id
export const updateComment = async (req, res) => {
  const { content } = req.body;
  const comment = await Comment.findById(req.params.id);

  if (comment) {
    if (comment.author.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('User not authorized');
    }
    comment.content = content || comment.content;
    const updatedComment = await comment.save();
    res.json(updatedComment);
  } else {
    res.status(404);
    throw new Error('Comment not found');
  }
};
