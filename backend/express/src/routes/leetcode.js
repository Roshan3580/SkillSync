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

// Get LeetCode user stats
router.get('/stats', requireAuth, async (req, res) => {
  try {
    // TODO: Scrape LeetCode or use unofficial API
    // For now, return mock data
    const leetcodeStats = {
      problemsSolved: 45,
      totalProblems: 2000,
      contestRating: 1450,
      submissions: 89,
      acceptanceRate: 85.5,
      ranking: 12500
    };
    
    res.json(leetcodeStats);
  } catch (error) {
    console.error('Error fetching LeetCode stats:', error);
    res.status(500).json({ error: 'Failed to fetch LeetCode data' });
  }
});

// Get solved problems
router.get('/problems', requireAuth, async (req, res) => {
  try {
    // TODO: Fetch user's solved problems
    const problems = [
      {
        id: 1,
        title: 'Two Sum',
        difficulty: 'Easy',
        status: 'Solved',
        submittedAt: new Date('2024-01-15')
      },
      {
        id: 2,
        title: 'Add Two Numbers',
        difficulty: 'Medium',
        status: 'Solved',
        submittedAt: new Date('2024-01-10')
      }
    ];
    
    res.json(problems);
  } catch (error) {
    console.error('Error fetching problems:', error);
    res.status(500).json({ error: 'Failed to fetch problems' });
  }
});

// Get contest history
router.get('/contests', requireAuth, async (req, res) => {
  try {
    // TODO: Fetch user's contest history
    const contests = [
      {
        id: 1,
        name: 'Weekly Contest 123',
        rank: 1500,
        score: 12,
        problemsSolved: 3,
        date: new Date('2024-01-20')
      }
    ];
    
    res.json(contests);
  } catch (error) {
    console.error('Error fetching contests:', error);
    res.status(500).json({ error: 'Failed to fetch contests' });
  }
});

// Get submission history
router.get('/submissions', requireAuth, async (req, res) => {
  try {
    // TODO: Fetch user's submission history
    const submissions = [
      {
        id: 1,
        problemTitle: 'Two Sum',
        status: 'Accepted',
        language: 'Python',
        runtime: 45,
        memory: 14.2,
        submittedAt: new Date('2024-01-15')
      }
    ];
    
    res.json(submissions);
  } catch (error) {
    console.error('Error fetching submissions:', error);
    res.status(500).json({ error: 'Failed to fetch submissions' });
  }
});

// Public summary endpoint for dashboard
router.get('/:username/summary', async (req, res) => {
  const { username } = req.params;
  try {
    // Use unofficial API for LeetCode stats
    const apiUrl = `https://leetcode-stats-api.herokuapp.com/${username}`;
    const response = await axios.get(apiUrl);
    const data = response.data;
    if (!data || data.status === 'error') {
      return res.status(404).json({ error: 'LeetCode user not found or API error' });
    }

    // Fetch recent submissions from LeetCode GraphQL
    let recent_problems = [];
    try {
      const graphqlRes = await axios.post(
        'https://leetcode.com/graphql',
        {
          query: `
            query recentAcSubmissions($username: String!) {
              recentAcSubmissionList(username: $username, limit: 10) {
                id
                title
                titleSlug
                timestamp
              }
            }
          `,
          variables: { username }
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Referer': `https://leetcode.com/${username}/`,
            'Origin': 'https://leetcode.com'
          }
        }
      );
      const acList = graphqlRes.data.data && graphqlRes.data.data.recentAcSubmissionList;
      if (Array.isArray(acList)) {
        recent_problems = acList.slice(0, 5).map(item => ({
          title: item.title,
          solved_at: new Date(parseInt(item.timestamp, 10) * 1000).toISOString()
        }));
      }
    } catch (err) {
      // If GraphQL fails, just leave recent_problems empty
    }

    res.json({
      username: data.username,
      total_solved: data.totalSolved,
      easy_solved: data.easySolved,
      total_easy: data.totalEasy,
      medium_solved: data.mediumSolved,
      total_medium: data.totalMedium,
      hard_solved: data.hardSolved,
      total_hard: data.totalHard,
      current_streak: data.streak || 0,
      recent_problems
    });
  } catch (error) {
    res.status(404).json({ error: 'LeetCode user not found or API error' });
  }
});

module.exports = router; 