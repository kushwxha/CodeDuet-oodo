const User = require('../models/User');

// GET /api/users/me
const getProfile = async (req, res) => {
  res.json(req.user);
};

// PUT /api/users/me
const updateProfile = async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  const { name, location, profilePhoto, skillsOffered, skillsWanted, availability, isPublic } = req.body;

  user.name = name || user.name;
  user.location = location || user.location;
  user.profilePhoto = profilePhoto || user.profilePhoto;
  user.skillsOffered = skillsOffered || user.skillsOffered;
  user.skillsWanted = skillsWanted || user.skillsWanted;
  user.availability = availability || user.availability;
  user.isPublic = isPublic !== undefined ? isPublic : user.isPublic;

  const updated = await user.save();
  res.json(updated);
};

// GET /api/users/
const listUsers = async (req, res) => {
  const users = await User.find({ isPublic: true }).select('-password');
  res.json(users);
};

// GET /api/users/search?skill=Photoshop
const searchUsersBySkill = async (req, res) => {
  const skill = req.query.skill;
  if (!skill) return res.status(400).json({ message: 'Skill query is required' });

  const users = await User.find({
    isPublic: true,
    $or: [
      { skillsOffered: { $regex: skill, $options: 'i' } },
      { skillsWanted: { $regex: skill, $options: 'i' } },
    ],
  }).select('-password');

  res.json(users);
};

module.exports = { getProfile, updateProfile, listUsers, searchUsersBySkill };