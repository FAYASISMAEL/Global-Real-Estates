import User from '../Model/user_model.js';

export const handleUserLogin = async (req, res) => {
  try {
    const { email, name, picture } = req.body;

    let user = await User.findOne({ email });
    
    if (!user) {
      user = new User({
        email,
        name,
        picture,
        isLoggedIn: true,
        lastLoginAt: new Date(),
        lastActivityAt: new Date()
      });
    } else {
      user.isLoggedIn = true;
      user.lastLoginAt = new Date();
      user.lastActivityAt = new Date();
      if (name) user.name = name;
      if (picture) user.picture = picture;
    }

    await user.save();
    res.status(200).json(user);
  } catch (error) {
    console.error('Error handling user login:', error);
    res.status(500).json({ error: 'Failed to handle user login' });
  }
};

// Handle user logout
export const handleUserLogout = async (req, res) => {
  try {
    const { email } = req.params;
    
    const user = await User.findOne({ email });
    if (user) {
      user.isLoggedIn = false;
      await user.save();
    }

    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Error handling user logout:', error);
    res.status(500).json({ error: 'Failed to handle user logout' });
  }
};

export const updateUserActivity = async (req, res) => {
  try {
    const { email } = req.params;
    
    const user = await User.findOne({ email });
    if (user) {
      user.lastActivityAt = new Date();
      await user.save();
    }

    res.status(200).json({ message: 'Activity updated' });
  } catch (error) {
    console.error('Error updating user activity:', error);
    res.status(500).json({ error: 'Failed to update user activity' });
  }
}; 