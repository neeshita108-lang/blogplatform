import User from '../models/User.js';

export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (user) { res.json(user); } 
    else { res.status(404).json({ message: 'User not found' }); }
  } catch (error) { res.status(500).json({ message: error.message }); }
};

export const updateUserProfile = async (req, res) => {
  try {
    console.log('UPDATE CALLED - using findByIdAndUpdate');
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $set: { name: req.body.name, avatar: req.body.avatar, bio: req.body.bio } },
      { new: true }
    ).select('-password');
    if (!updatedUser) return res.status(404).json({ message: 'User not found' });
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      avatar: updatedUser.avatar,
      bio: updatedUser.bio,
      role: updatedUser.role,
      token: req.headers.authorization.split(' ')[1],
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: error.message });
  }
};

export const getUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) { res.status(500).json({ message: error.message }); }
};
