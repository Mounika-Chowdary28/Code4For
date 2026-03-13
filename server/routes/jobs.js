const express = require('express');
const axios = require('axios');
const User = require('../models/User');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Route to get job suggestions from LinkedIn based on user profile
router.get('/suggestions', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const profile = user.profile;

    // For now, return mock data. To use real API, set RAPIDAPI_KEY in .env and uncomment the API call below
    const mockJobs = [
      {
        title: 'Senior Software Engineer',
        company: 'Tech Innovations Inc.',
        location: profile.location || 'San Francisco, CA',
        link: 'https://linkedin.com/jobs/view/senior-software-engineer-123',
        postedDate: '3 days ago',
        description: `We are looking for a ${profile.previousRole} with experience in ${profile.skills.join(', ')} to join our team. This role involves developing cutting-edge applications and working on innovative projects.`
      },
      {
        title: 'Product Manager',
        company: 'Global Solutions Ltd.',
        location: profile.location || 'New York, NY',
        link: 'https://linkedin.com/jobs/view/product-manager-456',
        postedDate: '1 week ago',
        description: `Seeking a career re-entry professional with ${profile.previousRole} background to manage product development. Skills in ${profile.skills.slice(0, 3).join(', ')} are highly valued.`
      },
      {
        title: 'Data Analyst',
        company: 'Analytics Corp',
        location: 'Remote',
        link: 'https://linkedin.com/jobs/view/data-analyst-789',
        postedDate: '5 days ago',
        description: 'Join our team to analyze data and provide insights. Experience with data tools and analytics is preferred.'
      },
      {
        title: 'UX Designer',
        company: 'Creative Agency',
        location: profile.location || 'Austin, TX',
        link: 'https://linkedin.com/jobs/view/ux-designer-101',
        postedDate: '2 days ago',
        description: 'Design user experiences for web and mobile applications. Portfolio and design skills required.'
      }
    ];

    // Uncomment below to use real API (requires RAPIDAPI_KEY in .env)
    /*
    // Build search query based on profile
    const keywords = [
      profile.previousRole,
      profile.desiredRole,
      ...profile.skills,
      profile.location
    ].filter(Boolean).join(' ');

    // Use JSearch API (aggregates jobs from multiple sources including LinkedIn)
    const options = {
      method: 'GET',
      url: 'https://jsearch.p.rapidapi.com/search',
      params: {
        query: keywords,
        location: profile.location || 'United States',
        date_posted: 'week', // past week
        remote_jobs_only: false,
        employment_types: 'FULLTIME',
        num_pages: '1'
      },
      headers: {
        'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
        'X-RapidAPI-Host': 'jsearch.p.rapidapi.com'
      },
      timeout: 10000
    };

    const response = await axios.request(options);

    // Process the response to match our format (JSearch API)
    const jobs = response.data.data.slice(0, 10).map(job => ({
      title: job.job_title,
      company: job.employer_name,
      location: `${job.job_city}, ${job.job_country}`,
      link: job.job_apply_link,
      postedDate: job.job_posted_at_datetime_utc ? new Date(job.job_posted_at_datetime_utc).toLocaleDateString() : 'Recently',
      description: job.job_description || 'No description available'
    }));

    res.json({ jobs });
    */

    res.json({ jobs: mockJobs });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({ message: 'Failed to fetch job suggestions' });
  }
});

module.exports = router;