const express = require('express');
const router = express.Router();

// Middleware to check if user is authenticated
const requireAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ error: 'Authentication required' });
};

// Get user dashboard data
router.get('/stats', requireAuth, async (req, res) => {
  try {
    // TODO: Fetch user stats from database
    // This will include GitHub and LeetCode data
    const userStats = {
      github: {
        repositories: 0,
        commits: 0,
        stars: 0,
        followers: 0
      },
      leetcode: {
        problemsSolved: 0,
        contestRating: 0,
        submissions: 0
      },
      resume: {
        skills: [],
        experience: 0,
        lastUpdated: null
      }
    };
    
    res.json(userStats);
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

// Get user profile
router.get('/profile', requireAuth, async (req, res) => {
  try {
    // TODO: Fetch user profile from database
    const profile = {
      id: req.user.id,
      username: req.user.username,
      email: req.user.email,
      avatar: req.user.avatar,
      joinedAt: new Date()
    };
    
    res.json(profile);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Update user preferences
router.put('/preferences', requireAuth, async (req, res) => {
  try {
    const { preferences } = req.body;
    // TODO: Update user preferences in database
    res.json({ message: 'Preferences updated successfully' });
  } catch (error) {
    console.error('Error updating preferences:', error);
    res.status(500).json({ error: 'Failed to update preferences' });
  }
});

module.exports = router; 