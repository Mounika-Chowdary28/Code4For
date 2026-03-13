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
    console.log('Fetching jobs for user profile:', {
      previousRole: profile.previousRole,
      desiredRole: profile.desiredRole,
      skills: profile.skills,
      location: profile.location
    });

    // For now, return mock data with LinkedIn search links. To use real API, set RAPIDAPI_KEY in .env and uncomment the API call below
    const mockJobs = [
      {
        title: 'Senior Software Engineer',
        company: 'Tech Innovations Inc.',
        location: profile.location || 'San Francisco, CA',
        link: `https://www.linkedin.com/jobs/search/?keywords=senior%20software%20engineer&location=${encodeURIComponent(profile.location || 'San Francisco, CA')}`,
        postedDate: '3 days ago',
        description: `We are looking for a ${profile.previousRole || 'software engineer'} with experience in ${profile.skills?.join(', ') || 'various technologies'} to join our team. This role involves developing cutting-edge applications and working on innovative projects.`
      },
      {
        title: 'Product Manager',
        company: 'Global Solutions Ltd.',
        location: profile.location || 'New York, NY',
        link: `https://www.linkedin.com/jobs/search/?keywords=product%20manager&location=${encodeURIComponent(profile.location || 'New York, NY')}`,
        postedDate: '1 week ago',
        description: `Seeking a career re-entry professional with ${profile.previousRole || 'management'} background to manage product development. Skills in ${profile.skills?.slice(0, 3).join(', ') || 'product management'} are highly valued.`
      },
      {
        title: 'Data Analyst',
        company: 'Analytics Corp',
        location: 'Remote',
        link: 'https://www.linkedin.com/jobs/search/?keywords=data%20analyst&location=Remote',
        postedDate: '5 days ago',
        description: 'Join our team to analyze data and provide insights. Experience with data tools and analytics is preferred. Great opportunity for career transition.'
      },
      {
        title: 'UX Designer',
        company: 'Creative Agency',
        location: profile.location || 'Austin, TX',
        link: `https://www.linkedin.com/jobs/search/?keywords=ux%20designer&location=${encodeURIComponent(profile.location || 'Austin, TX')}`,
        postedDate: '2 days ago',
        description: 'Design user experiences for web and mobile applications. Portfolio and design skills required. Perfect for creative professionals returning to work.'
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
    // Always return fallback jobs
    const fallbackJobs = [
      {
        title: 'Software Developer',
        company: 'Tech Company',
        location: 'Remote',
        link: 'https://www.linkedin.com/jobs/search/?keywords=software%20developer&location=Remote',
        postedDate: '1 week ago',
        description: 'Great opportunity for developers to join our team and work on exciting projects.'
      },
      {
        title: 'Project Manager',
        company: 'Business Solutions Inc.',
        location: 'New York, NY',
        link: 'https://www.linkedin.com/jobs/search/?keywords=project%20manager&location=New%20York%2C%20NY',
        postedDate: '3 days ago',
        description: 'Manage projects and lead teams in a dynamic environment.'
      }
    ];
    res.json({ jobs: fallbackJobs });
  }
});

module.exports = router;