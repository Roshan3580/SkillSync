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

// Public summary endpoint for dashboard
router.get('/:username/summary', async (req, res) => {
  const { username } = req.params;
  try {
    // Fetch user profile
    const userRes = await axios.get(`https://api.github.com/users/${username}`);
    const user = userRes.data;

    // Fetch repos (paginated, get up to 100)
    const reposRes = await axios.get(`https://api.github.com/users/${username}/repos?per_page=100&type=owner&sort=updated`);
    const repos = reposRes.data;

    // Recent repos (last 5 updated)
    const recent_repos = repos.slice(0, 5).map(repo => ({
      name: repo.name,
      url: repo.html_url
    }));

    // Top languages
    const langCount = {};
    repos.forEach(repo => {
      if (repo.language) {
        langCount[repo.language] = (langCount[repo.language] || 0) + 1;
      }
    });
    const top_languages = Object.entries(langCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([lang]) => lang);

    let commits_per_month = [];
    let total_commits = 0;
    const monthMap = {};
    for (const repo of repos.slice(0, 5)) {
      try {
        const statsRes = await axios.get(`https://api.github.com/repos/${username}/${repo.name}/stats/commit_activity`);
        const stats = statsRes.data; // Array of 52 weeks
        stats.forEach(week => {
          const date = new Date(week.week * 1000);
          const month = `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
          monthMap[month] = (monthMap[month] || 0) + week.total;
          total_commits += week.total;
        });
      } catch (err) {
        // Ignore errors for individual repos (e.g., empty repos)
      }
    }
    // Format for chart (last 6 months)
    const months = Object.keys(monthMap).slice(-6);
    commits_per_month = months.map(month => ({ name: month, commits: monthMap[month] }));

    res.json({
      username: user.login,
      avatar_url: user.avatar_url,
      name: user.name,
      public_repos: user.public_repos,
      top_languages,
      recent_repos,
      total_commits,
      commits_per_month
    });
  } catch (error) {
    res.status(404).json({ error: 'GitHub user not found or API error' });
  }
});

module.exports = router; 