const express = require('express');
const axios = require('axios');
const router = express.Router();

// Middleware to check if user is authenticated
const requireAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ error: 'Authentication required' });
};

// Get GitHub user stats
router.get('/stats', requireAuth, async (req, res) => {
  try {
    // TODO: Use GitHub API with user's access token
    // For now, return mock data
    const githubStats = {
      repositories: 15,
      commits: 234,
      stars: 45,
      followers: 12,
      following: 8,
      publicRepos: 12,
      privateRepos: 3
    };
    
    res.json(githubStats);
  } catch (error) {
    console.error('Error fetching GitHub stats:', error);
    res.status(500).json({ error: 'Failed to fetch GitHub data' });
  }
});

// Get user's repositories
router.get('/repositories', requireAuth, async (req, res) => {
  try {
    // TODO: Fetch user's repositories from GitHub API
    const repositories = [
      {
        id: 1,
        name: 'sample-repo',
        description: 'A sample repository',
        language: 'JavaScript',
        stars: 5,
        forks: 2,
        updatedAt: new Date()
      }
    ];
    
    res.json(repositories);
  } catch (error) {
    console.error('Error fetching repositories:', error);
    res.status(500).json({ error: 'Failed to fetch repositories' });
  }
});

// Get commit activity
router.get('/commits', requireAuth, async (req, res) => {
  try {
    // TODO: Fetch commit activity from GitHub API
    const commitActivity = {
      totalCommits: 234,
      weeklyActivity: [
        { week: '2024-01-01', commits: 5 },
        { week: '2024-01-08', commits: 12 },
        { week: '2024-01-15', commits: 8 }
      ]
    };
    
    res.json(commitActivity);
  } catch (error) {
    console.error('Error fetching commit activity:', error);
    res.status(500).json({ error: 'Failed to fetch commit activity' });
  }
});

module.exports = router; 