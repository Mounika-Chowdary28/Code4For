const express = require('express');
const auth = require('../middleware/auth');
const User = require('../models/User');
const OpenAI = require('openai');

const router = express.Router();

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
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
[Suggest suitable job roles, returnship programs, and career transition opportunities]

INTERVIEW PREPARATION:
[Provide guidance for interview preparation and skill refresh recommendations]

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
          detailed: `The job market offers numerous opportunities for career re-entry, especially with your background in ${user.profile.previousRole}. Here are targeted suggestions for your successful return:

Returnship Programs:
• Corporate return-to-work programs (6-12 months paid programs)
• Companies like Microsoft, Amazon, and Goldman Sachs offer structured re-entry
• Focus on roles that leverage your existing experience while allowing skill updates

Flexible Work Arrangements:
• Remote or hybrid positions that accommodate work-life balance needs
• Part-time or project-based roles for gradual re-entry
• Consulting opportunities to build recent experience

Career Transition Roles:
• Positions that build on your transferable skills from ${user.profile.previousRole}
• Roles in growing industries like technology, healthcare, and education
• Entry-level positions in companies valuing diversity and inclusion

Industry-Specific Opportunities:
• Companies in ${user.profile.desiredCareerPath} with inclusive hiring practices
• Organizations with employee resource groups for career re-entry
• Startups and mid-sized companies often more flexible than large corporations

Additional Considerations:
• Look for companies with parental leave and flexible scheduling policies
• Consider roles that offer professional development and mentorship
• Evaluate company culture and values alignment with your career goals

Start by researching companies known for supporting career re-entry and update your professional profiles to highlight your enthusiasm for returning to work.`,
          images: [
            'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=400&fit=crop',
            'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=600&h=400&fit=crop'
          ]
        },
        interviewPrep: {
          summary: `Refresh your knowledge of current industry trends and technologies. Practice explaining your career break positively. Prepare stories about your previous experience and how it relates to current opportunities. Consider mock interviews and update your resume to highlight transferable skills.`,
          detailed: `Effective interview preparation is crucial for a successful career re-entry. Here's a comprehensive guide to help you prepare:

Understanding the Interview Landscape:
• Modern interviews often include behavioral, technical, and situational questions
• Companies increasingly focus on cultural fit and growth potential
• Virtual interviews require different preparation than in-person meetings

Addressing the Career Break:
• Prepare a positive, concise explanation for your career break
• Focus on transferable skills and continuous learning during the break
• Highlight how your break has given you new perspectives and priorities

Technical Preparation:
• Refresh knowledge of current industry trends and technologies
• Practice technical skills relevant to ${user.profile.desiredCareerPath}
• Prepare for coding assessments, case studies, or portfolio reviews

Behavioral Interview Practice:
• Prepare STAR (Situation, Task, Action, Result) stories from your experience
• Practice explaining how your previous role skills apply to current opportunities
• Prepare questions to ask interviewers about company culture and growth

Practical Steps:
• Conduct mock interviews with mentors or career coaches
• Record yourself answering common questions and review for improvement
• Research the company and prepare thoughtful questions
• Update your resume and LinkedIn to reflect current market relevance

Remember that interviews are a two-way street. You're also evaluating whether the company and role are a good fit for your career goals and work-life balance needs.`,
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