const express = require('express');
const auth = require('../middleware/auth');
const User = require('../models/User');
const OpenAI = require('openai');

const router = express.Router();

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Test route for mock data (no auth required)
router.get('/test', async (req, res) => {
  try {
    console.log('Test analysis request received');

    // Mock user data for testing
    const user = {
      profile: {
        previousRole: 'Software Engineer',
        experience: '5 years',
        careerBreakDuration: '3 years',
        desiredCareerPath: 'Full Stack Development',
        location: 'San Francisco, CA',
        skills: ['JavaScript', 'React', 'Node.js'],
        certifications: ['AWS Certified Developer'],
        linkedin: 'https://linkedin.com/in/testuser',
        website: 'https://portfolio.com'
      }
    };

    // Return mock analysis data
    const mockAnalysis = {
      skillGapAnalysis: {
        summary: `Based on your experience as a ${user.profile.previousRole} and your ${user.profile.careerBreakDuration} career break, you may have gaps in current technologies and industry practices.`,
        detailed: `**Key Skill Gaps Identified:**

**Technical Skills:**
• React Hooks and Functional Components
• Modern JavaScript (ES6+, async/await, modules)
• Cloud platforms (AWS, Azure, GCP)
• Containerization (Docker, Kubernetes)
• CI/CD pipelines and DevOps practices

**Soft Skills:**
• Agile/Scrum methodologies
• Remote work collaboration tools
• Current industry networking

**Learning Resources:**

**Online Courses:**
• React - The Complete Guide: https://www.udemy.com/course/react-the-complete-guide-incl-redux/
• Modern JavaScript: https://www.udemy.com/course/modern-javascript-from-the-beginning/
• AWS Certified Developer: https://aws.amazon.com/certification/certified-developer-associate/

**YouTube Channels:**
• Traversy Media: https://www.youtube.com/c/TraversyMedia
• Academind: https://www.youtube.com/c/Academind
• freeCodeCamp: https://www.youtube.com/c/Freecodecamp

**Practice Platforms:**
• LeetCode: https://leetcode.com/
• HackerRank: https://www.hackerrank.com/
• freeCodeCamp: https://www.freecodecamp.org/

**Documentation:**
• React Docs: https://reactjs.org/docs/getting-started.html
• MDN Web Docs: https://developer.mozilla.org/
• AWS Documentation: https://docs.aws.amazon.com/`,
        images: [
          'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop',
          'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop'
        ]
      },
      learningRoadmap: {
        summary: `1. Start with foundational courses in your field\n2. Take certification programs relevant to ${user.profile.desiredCareerPath}\n3. Practice with current tools and technologies\n4. Network with professionals in your industry\n5. Consider mentorship programs for career re-entry`,
        detailed: `A structured learning approach will help you systematically bridge skill gaps and prepare for re-entry into the workforce.`,
        images: [
          'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&h=400&fit=crop',
          'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&h=400&fit=crop'
        ]
      },
      jobSuggestions: {
        summary: `Consider roles such as ${user.profile.previousRole} positions with companies offering return-to-work programs.`,
        detailed: `Senior Software Engineer - https://www.linkedin.com/jobs/search/?keywords=senior%20software%20engineer&location=${encodeURIComponent(user.profile.location || 'United States')}
A great role for leveraging your experience with opportunities to work on cutting-edge technologies.`,
        images: [
          'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=400&fit=crop',
          'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=600&h=400&fit=crop'
        ]
      },
      interviewPrep: {
        summary: `Refresh your knowledge of current industry trends and technologies. Practice explaining your career break positively.`,
        detailed: `Effective interview preparation is crucial for a successful career re-entry. Here's a comprehensive guide with specific resources and links:

Technical Interview Preparation:
• LeetCode: https://leetcode.com/ - Practice coding problems with company-specific questions
• HackerRank: https://www.hackerrank.com/ - Technical skills assessment and practice
• Pramp: https://www.pramp.com/ - Free peer-to-peer mock technical interviews
• Interviewing.io: https://interviewing.io/ - Anonymous technical interview practice

Behavioral Interview Resources:
• STAR Method Guide: https://www.themuse.com/advice/star-interview-method - Framework for answering behavioral questions
• Big Interview: https://biginterview.com/ - Video practice platform for interview skills
• Interview Cake: https://www.interviewcake.com/ - Technical and behavioral interview prep

Industry-Specific Preparation:
• LinkedIn Learning: https://www.linkedin.com/learning/ - Free courses on industry trends and skills
• Coursera Interview Prep: https://www.coursera.org/courses?query=interview%20preparation - Structured interview courses
• Udemy Interview Courses: https://www.udemy.com/topic/interview-preparation/ - Affordable video courses

Resume and Profile Optimization:
• ResumeLab: https://resumelab.com/ - Resume templates and optimization tools
• Canva Resume Builder: https://www.canva.com/resumes/templates/ - Free resume design templates
• LinkedIn Profile Optimization: https://www.linkedin.com/help/linkedin/answer/a521929 - Official LinkedIn guides

Mock Interview Platforms:
• Pramp: https://www.pramp.com/ - Free peer-to-peer practice interviews
• Interviewing.io: https://interviewing.io/ - Anonymous interview practice
• Gainlo: https://www.gainlo.co/ - Interview experiences and practice questions

Virtual Interview Tips:
• Zoom Interview Tips: https://blog.zoom.us/zoom-interview-tips/ - Best practices for virtual interviews
• Technical Setup Guide: https://www.themuse.com/advice/technical-interview-tips - Virtual interview preparation

Career Break Communication:
• Positive Framing Guide: https://www.forbes.com/sites/forbescoachescouncil/2021/05/14/how-to-explain-a-career-break-in-an-interview/ - Articles on addressing career gaps
• Transferable Skills Focus: https://www.monster.com/career-advice/article/how-to-explain-employment-gaps - Strategies for explaining breaks

Practice Resources:
• Glassdoor Interview Questions: https://www.glassdoor.com/Interview/index.htm - Company-specific interview questions
• Indeed Interview Prep: https://www.indeed.com/career-advice/interviewing - Free interview guides and tips
• YouTube Interview Channels: https://www.youtube.com/results?search_query=job+interview+tips - Free video tutorials

Remember to practice regularly, record yourself, and seek feedback.`,
        images: [
          'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=600&h=400&fit=crop',
          'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=400&fit=crop'
        ]
      }
    };

    res.json(mockAnalysis);
  } catch (err) {
    console.error('Test analysis route error:', err);
    res.status(500).json({ msg: 'Server error occurred' });
  }
});

// Get career analysis
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    console.log('Analysis request for user:', req.user.id);
    console.log('User profile:', user.profile);

    if (!user.profile || !user.profile.previousRole || !user.profile.experience || !user.profile.careerBreakDuration || !user.profile.desiredCareerPath) {
      console.log('Profile incomplete');
      return res.status(400).json({ msg: 'Please complete your profile first' });
    }

    console.log('OpenAI API Key exists:', !!process.env.OPENAI_API_KEY);

    // For testing - return mock data if OpenAI fails
    try {
      const prompt = `Based on the following user profile, provide a personalized career re-entry analysis for a woman returning to work:

Personal Information:
- Age: ${user.profile.age || 'Not specified'}
- Location: ${user.profile.location || 'Not specified'}
- Education: ${user.profile.education || 'Not specified'}
- Languages: ${user.profile.languages?.join(', ') || 'Not specified'}

Career Information:
- Previous Role: ${user.profile.previousRole}
- Experience: ${user.profile.experience}
- Career Break Duration: ${user.profile.careerBreakDuration}
- Desired Career Path: ${user.profile.desiredCareerPath}
- Current Salary: ${user.profile.currentSalary || 'Not specified'}
- Desired Salary: ${user.profile.desiredSalary || 'Not specified'}
- Availability: ${user.profile.availability || 'Not specified'}
- Work Preference: ${user.profile.workPreference || 'Not specified'}
- Open to Relocation: ${user.profile.relocationWillingness ? 'Yes' : 'No'}

Skills & Qualifications:
- Current Skills: ${user.profile.skills?.join(', ') || 'None specified'}
- Certifications: ${user.profile.certifications?.join(', ') || 'None specified'}
- LinkedIn: ${user.profile.linkedin || 'Not provided'}
- Website/Portfolio: ${user.profile.website || 'Not provided'}

Additional Notes: ${user.profile.additionalNotes || 'None provided'}

Please provide a detailed analysis with the following sections:

SKILL GAP ANALYSIS:
[Provide a detailed analysis of skill gaps based on current industry requirements. Include specific learning resources, online courses, YouTube playlists, websites, and reference materials for each skill gap identified. Provide direct links where possible.]

LEARNING ROADMAP:
[Provide a personalized learning plan with recommended certifications, courses, and timeline]

JOB SUGGESTIONS:
[Suggest suitable job roles, returnship programs, and career transition opportunities. Include specific LinkedIn job search links for each suggested role based on the user's location and skills. Format as: Role Title - LinkedIn Search Link - Brief description]

INTERVIEW PREPARATION:
[Provide comprehensive interview preparation guidance with specific resources, online courses, practice platforms, and preparation materials. Include direct links to useful websites, YouTube channels, practice platforms, and preparation guides. Cover technical interviews, behavioral questions, and industry-specific preparation.]

Format your response clearly with these exact section headers.`;

      console.log('Sending prompt to OpenAI...');

      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are an expert career counselor specializing in helping women return to the workforce after career breaks. Provide detailed, actionable, and encouraging advice. Focus on practical steps and current market trends." },
          { role: "user", content: prompt }
        ],
        max_tokens: 1500,
        temperature: 0.7,
      });

      const response = completion.choices[0].message.content;
      console.log('OpenAI response received:', response.substring(0, 200) + '...');

      // Parse the response into structured format
      const analysis = parseAnalysisResponse(response);
      console.log('Parsed analysis keys:', Object.keys(analysis));

      res.json(analysis);
    } catch (openaiError) {
      console.error('OpenAI API Error:', openaiError.message);

      // Return mock data for testing
      console.log('Returning mock analysis data for testing...');
      const mockAnalysis = {
        skillGapAnalysis: {
          summary: `Based on your experience as a ${user.profile.previousRole} and your ${user.profile.careerBreakDuration} career break, you may have gaps in current technologies and industry practices. Key areas to focus on include digital tools, updated methodologies, and current market trends in your desired field of ${user.profile.desiredCareerPath}.

**Recommended Learning Resources:**
• Online Platforms: Coursera (https://coursera.org), edX (https://edx.org), Udemy (https://udemy.com)
• YouTube Channels: freeCodeCamp, Traversy Media, The Net Ninja
• Professional Development: LinkedIn Learning, industry-specific certifications
• Practice Platforms: GitHub for projects, Stack Overflow for Q&A

Click "View More" for detailed study materials and specific course recommendations.`,
          detailed: `Your previous experience as a ${user.profile.previousRole} provides a strong foundation, but the technology landscape has evolved significantly during your career break. Modern workplaces now emphasize digital collaboration tools, agile methodologies, and industry-specific software that may not have been prevalent when you last worked.

Key skill gaps to address include:
• Digital proficiency in current industry-standard tools and platforms
• Updated knowledge of modern work methodologies and best practices
• Familiarity with current market trends and emerging technologies
• Soft skills like remote work etiquette and virtual collaboration
• Industry-specific certifications that demonstrate current competency

**Learning Resources & Study Materials:**

**Digital Tools & Software:**
• Microsoft Office 365/ Google Workspace: https://www.microsoft.com/en-us/microsoft-365
• Zoom/Teams/Slack for remote collaboration: https://zoom.us, https://teams.microsoft.com
• Trello/Asana/Jira for project management: https://trello.com, https://asana.com

**Online Learning Platforms:**
• Coursera: https://www.coursera.org - Free courses from universities
• edX: https://www.edx.org - University-level courses and certifications
• Udemy: https://www.udemy.com - Practical skill-building courses
• LinkedIn Learning: https://www.linkedin.com/learning - Professional development

**YouTube Learning Channels:**
• freeCodeCamp: https://www.youtube.com/c/Freecodecamp - Programming and tech skills
• Traversy Media: https://www.youtube.com/c/TraversyMedia - Web development tutorials
• The Net Ninja: https://www.youtube.com/c/TheNetNinja - Full-stack development
• Academind: https://www.youtube.com/c/Academind - In-depth programming tutorials

**Industry-Specific Resources:**
• For ${user.profile.desiredCareerPath}: Research industry leaders and follow their learning paths
• Stack Overflow: https://stackoverflow.com - Programming Q&A and community
• GitHub: https://github.com - Code repositories and collaboration
• Medium: https://medium.com - Articles and tutorials from industry experts

**Recommended Study Plan:**
1. Start with free YouTube tutorials for quick overviews
2. Take structured courses on Coursera/edX for certifications
3. Practice with real projects on GitHub
4. Join communities on Reddit, Discord, or LinkedIn groups
5. Consider paid certifications for resume credibility

The good news is that many of these skills can be learned through online courses, certifications, and practical projects. Starting with foundational courses and gradually building up to advanced topics will help you bridge these gaps efficiently.`,
          images: [
            'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop',
            'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop'
          ]
        },
        learningRoadmap: {
          summary: `1. Start with foundational courses in your field\n2. Take certification programs relevant to ${user.profile.desiredCareerPath}\n3. Practice with current tools and technologies\n4. Network with professionals in your industry\n5. Consider mentorship programs for career re-entry`,
          detailed: `A structured learning approach will help you systematically bridge skill gaps and prepare for re-entry into the workforce. Here's a comprehensive 6-12 month roadmap tailored to your career transition:

Month 1-2: Foundation Building
• Complete online courses in core concepts of ${user.profile.desiredCareerPath}
• Learn essential digital tools and software used in the industry
• Refresh fundamental skills from your previous experience

Month 3-4: Skill Development
• Pursue industry-recognized certifications
• Practice with real-world projects and case studies
• Join online communities and forums related to your field

Month 5-6: Advanced Learning
• Take specialized courses in emerging trends
• Participate in workshops and webinars
• Start building a portfolio of work samples

Month 7-8: Networking and Application
• Attend industry events and networking sessions
• Connect with mentors and career advisors
• Begin updating your resume and LinkedIn profile

Month 9-12: Interview Preparation and Job Search
• Practice interview skills and technical assessments
• Apply for returnship programs and entry-level positions
• Consider informational interviews with industry professionals

Remember to maintain a healthy balance between learning and practical application. Regular practice and networking will accelerate your progress.`,
          images: [
            'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&h=400&fit=crop',
            'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&h=400&fit=crop'
          ]
        },
        jobSuggestions: {
          summary: `Consider roles such as ${user.profile.previousRole} positions with companies offering return-to-work programs. Look for companies with flexible work arrangements and returnship programs specifically designed for career re-entry. Entry-level or mid-level positions in growing companies could be a good starting point.`,
          detailed: `The job market offers numerous opportunities for career re-entry, especially with your background in ${user.profile.previousRole}. Here are targeted suggestions with LinkedIn job search links:

Senior Software Engineer - https://www.linkedin.com/jobs/search/?keywords=senior%20software%20engineer&location=${encodeURIComponent(user.profile.location || 'United States')}
A great role for leveraging your ${user.profile.previousRole} experience with opportunities to work on cutting-edge technologies and mentor junior team members.

Product Manager - https://www.linkedin.com/jobs/search/?keywords=product%20manager&location=${encodeURIComponent(user.profile.location || 'United States')}
Perfect for career re-entry with focus on strategy, user experience, and cross-functional collaboration. Many companies offer returnship programs in product roles.

Data Analyst - https://www.linkedin.com/jobs/search/?keywords=data%20analyst&location=${encodeURIComponent(user.profile.location || 'United States')}
Growing field with high demand for analytical skills. Remote opportunities available and companies value transferable skills from various backgrounds.

UX Designer - https://www.linkedin.com/jobs/search/?keywords=ux%20designer&location=${encodeURIComponent(user.profile.location || 'United States')}
Creative role that benefits from diverse perspectives. Many design teams welcome career re-entry professionals and offer flexible work arrangements.

Project Manager - https://www.linkedin.com/jobs/search/?keywords=project%20manager&location=${encodeURIComponent(user.profile.location || 'United States')}
Strong demand for organizational and leadership skills. Returnship programs often include project management training and mentorship.

Additional Opportunities:
• Returnship Programs: Search for "returnship program" on LinkedIn for structured re-entry opportunities
• Remote Work: Filter LinkedIn searches for remote positions to find flexible arrangements
• Company Return Programs: Companies like Microsoft, Amazon, and Goldman Sachs have dedicated career re-entry initiatives

Start by exploring these LinkedIn searches and update your profile to highlight your enthusiasm for returning to work. Consider reaching out to alumni networks and professional groups for additional opportunities.`,
          images: [
            'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=400&fit=crop',
            'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=600&h=400&fit=crop'
          ]
        },
        interviewPrep: {
          summary: `Refresh your knowledge of current industry trends and technologies. Practice explaining your career break positively. Prepare stories about your previous experience and how it relates to current opportunities. Consider mock interviews and update your resume to highlight transferable skills.`,
          detailed: `Effective interview preparation is crucial for a successful career re-entry. Here's a comprehensive guide with specific resources and links:

Technical Interview Preparation:
• LeetCode: https://leetcode.com/ - Practice coding problems with company-specific questions
• HackerRank: https://www.hackerrank.com/ - Technical skills assessment and practice
• Pramp: https://www.pramp.com/ - Free peer-to-peer mock technical interviews
• Interviewing.io: https://interviewing.io/ - Anonymous technical interview practice

Behavioral Interview Resources:
• STAR Method Guide: https://www.themuse.com/advice/star-interview-method - Framework for answering behavioral questions
• Big Interview: https://biginterview.com/ - Video practice platform for interview skills
• Interview Cake: https://www.interviewcake.com/ - Technical and behavioral interview prep

Industry-Specific Preparation:
• LinkedIn Learning: https://www.linkedin.com/learning/ - Free courses on industry trends and skills
• Coursera Interview Prep: https://www.coursera.org/courses?query=interview%20preparation - Structured interview courses
• Udemy Interview Courses: https://www.udemy.com/topic/interview-preparation/ - Affordable video courses

Resume and Profile Optimization:
• ResumeLab: https://resumelab.com/ - Resume templates and optimization tools
• Canva Resume Builder: https://www.canva.com/resumes/templates/ - Free resume design templates
• LinkedIn Profile Optimization: https://www.linkedin.com/help/linkedin/answer/a521929 - Official LinkedIn guides

Mock Interview Platforms:
• Pramp: https://www.pramp.com/ - Free peer-to-peer practice interviews
• Interviewing.io: https://interviewing.io/ - Anonymous interview practice
• Gainlo: https://www.gainlo.co/ - Interview experiences and practice questions

Virtual Interview Tips:
• Zoom Interview Tips: https://blog.zoom.us/zoom-interview-tips/ - Best practices for virtual interviews
• Technical Setup Guide: https://www.themuse.com/advice/technical-interview-tips - Virtual interview preparation

Career Break Communication:
• Positive Framing Guide: https://www.forbes.com/sites/forbescoachescouncil/2021/05/14/how-to-explain-a-career-break-in-an-interview/ - Articles on addressing career gaps
• Transferable Skills Focus: https://www.monster.com/career-advice/article/how-to-explain-employment-gaps - Strategies for explaining breaks

Practice Resources:
• Glassdoor Interview Questions: https://www.glassdoor.com/Interview/index.htm - Company-specific interview questions
• Indeed Interview Prep: https://www.indeed.com/career-advice/interviewing - Free interview guides and tips
• YouTube Interview Channels: https://www.youtube.com/results?search_query=job+interview+tips - Free video tutorials

Remember to practice regularly, record yourself, and seek feedback. Start with 30-minute daily practice sessions focusing on different types of interview questions. Consider working with a career coach for personalized feedback on your interview performance.`,
          images: [
            'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=600&h=400&fit=crop',
            'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=400&fit=crop'
          ]
        }
      };

      res.json(mockAnalysis);
    }
  } catch (err) {
    console.error('Analysis route error:', err);
    res.status(500).json({ msg: 'Server error occurred' });
  }
});

// Helper function to parse the analysis response
function parseAnalysisResponse(response) {
  const sections = {
    skillGapAnalysis: {
      summary: '',
      detailed: '',
      images: [
        'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop'
      ]
    },
    learningRoadmap: {
      summary: '',
      detailed: '',
      images: [
        'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&h=400&fit=crop'
      ]
    },
    jobSuggestions: {
      summary: '',
      detailed: '',
      images: [
        'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=600&h=400&fit=crop'
      ]
    },
    interviewPrep: {
      summary: '',
      detailed: '',
      images: [
        'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=400&fit=crop'
      ]
    }
  };

  // Split response by section headers
  const skillGapMatch = response.match(/SKILL GAP ANALYSIS:(.*?)(?=LEARNING ROADMAP:|JOB SUGGESTIONS:|INTERVIEW PREPARATION:|$)/is);
  const learningMatch = response.match(/LEARNING ROADMAP:(.*?)(?=JOB SUGGESTIONS:|INTERVIEW PREPARATION:|$)/is);
  const jobMatch = response.match(/JOB SUGGESTIONS:(.*?)(?=INTERVIEW PREPARATION:|$)/is);
  const interviewMatch = response.match(/INTERVIEW PREPARATION:(.*?)$/is);

  if (skillGapMatch) {
    const content = skillGapMatch[1].trim();
    sections.skillGapAnalysis.summary = content.split('\n').slice(0, 3).join('\n'); // First 3 lines as summary
    sections.skillGapAnalysis.detailed = content;
  } else {
    sections.skillGapAnalysis.summary = 'Unable to analyze skill gaps at this time.';
    sections.skillGapAnalysis.detailed = 'Unable to analyze skill gaps at this time.';
  }

  if (learningMatch) {
    const content = learningMatch[1].trim();
    sections.learningRoadmap.summary = content.split('\n').slice(0, 5).join('\n'); // First 5 lines as summary
    sections.learningRoadmap.detailed = content;
  } else {
    sections.learningRoadmap.summary = 'Unable to generate learning roadmap at this time.';
    sections.learningRoadmap.detailed = 'Unable to generate learning roadmap at this time.';
  }

  if (jobMatch) {
    const content = jobMatch[1].trim();
    sections.jobSuggestions.summary = content.split('\n').slice(0, 4).join('\n'); // First 4 lines as summary
    sections.jobSuggestions.detailed = content;
  } else {
    sections.jobSuggestions.summary = 'Unable to provide job suggestions at this time.';
    sections.jobSuggestions.detailed = 'Unable to provide job suggestions at this time.';
  }

  if (interviewMatch) {
    const content = interviewMatch[1].trim();
    sections.interviewPrep.summary = content.split('\n').slice(0, 4).join('\n'); // First 4 lines as summary
    sections.interviewPrep.detailed = content;
  } else {
    sections.interviewPrep.summary = 'Unable to provide interview preparation guidance at this time.';
    sections.interviewPrep.detailed = 'Unable to provide interview preparation guidance at this time.';
  }

  return sections;
}

module.exports = router;