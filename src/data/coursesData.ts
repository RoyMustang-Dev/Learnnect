// Course data based on learnnect_description.txt

export interface Course {
  id: string;
  courseId: string; // Unique Course ID from description
  courseName: string; // Internal Course Name
  courseDisplayName: string; // Marketing-friendly Display Name
  type: 'Paid/Premium' | 'Free' | 'Freemium';
  price: number;
  originalPrice?: number;
  description: string;
  category: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  duration: string;
  instructor?: string;
  image?: string;
  features?: string[];
}

// Paid/Premium Courses (Course IDs 111-120) - For Carousel
export const paidCourses: Course[] = [
  {
    id: '111',
    courseId: '111',
    courseName: 'BI & Data Visualization course with Power BI',
    courseDisplayName: 'Mastering Business Intelligence & Visual Analytics',
    type: 'Paid/Premium',
    price: 4999,
    originalPrice: 9999,
    description: 'Master business intelligence and data visualization with Power BI, creating compelling dashboards and reports.',
    category: 'Business Intelligence',
    level: 'Intermediate',
    duration: '12 weeks',
    instructor: 'Industry Expert',
    features: ['3-Phase Learning', 'Real Projects', 'Power BI Mastery', 'Career Support']
  },
  {
    id: '112',
    courseId: '112',
    courseName: 'Complete Data Analytics with Python',
    courseDisplayName: 'Mastering Data Analytics with Python',
    type: 'Paid/Premium',
    price: 3999,
    originalPrice: 7999,
    description: 'Learn professional data analytics using Python, covering data manipulation, visualization, and statistical analysis.',
    category: 'Data Analytics',
    level: 'Intermediate',
    duration: '12 weeks',
    instructor: 'Industry Expert',
    features: ['Python Mastery', 'Data Visualization', 'Statistical Analysis', 'Real Datasets']
  },
  {
    id: '113',
    courseId: '113',
    courseName: 'Complete Data Analytics with Python & Gen AI',
    courseDisplayName: 'Augmented Data Analyst: Python & Gen AI for Deeper Insights',
    type: 'Paid/Premium',
    price: 4999,
    originalPrice: 9999,
    description: 'Advanced data analytics combining Python expertise with Generative AI for next-generation insights.',
    category: 'Data Analytics',
    level: 'Advanced',
    duration: '16 weeks',
    instructor: 'Industry Expert',
    features: ['Python + Gen AI', 'Advanced Analytics', 'AI-Powered Insights', 'Industry Projects']
  },
  {
    id: '114',
    courseId: '114',
    courseName: 'Data Analytics : Zero to Mastery with Python + AI & ML + Gen AI',
    courseDisplayName: 'AI-Powered Data Analyst: From Insights to Innovation',
    type: 'Paid/Premium',
    price: 6999,
    originalPrice: 13999,
    description: 'Complete data analytics program combining Python, AI & ML, and Generative AI technologies.',
    category: 'Data Analytics',
    level: 'Expert',
    duration: '20 weeks',
    instructor: 'Industry Expert',
    features: ['Complete Analytics', 'Python + AI + Gen AI', 'Advanced Projects', 'Industry Ready']
  },
  {
    id: '115',
    courseId: '115',
    courseName: 'Machine Learning : Zero to Mastery',
    courseDisplayName: 'ML Mastery: From Concept to Code',
    type: 'Paid/Premium',
    price: 4499,
    originalPrice: 8999,
    description: 'Complete machine learning course from fundamentals to advanced algorithms and real-world applications.',
    category: 'Machine Learning',
    level: 'Intermediate',
    duration: '14 weeks',
    instructor: 'Industry Expert',
    features: ['Complete ML Pipeline', 'Algorithm Mastery', 'Real Applications', 'Project Portfolio']
  },
  {
    id: '116',
    courseId: '116',
    courseName: 'Machine Learning : Zero to Mastery with Gen AI',
    courseDisplayName: 'Applied AI Engineer: Machine Learning & Generative AI',
    type: 'Paid/Premium',
    price: 5499,
    originalPrice: 10999,
    description: 'Advanced machine learning course enhanced with Generative AI techniques and applications.',
    category: 'Machine Learning',
    level: 'Advanced',
    duration: '18 weeks',
    instructor: 'Industry Expert',
    features: ['ML + Gen AI', 'Advanced Algorithms', 'AI Integration', 'Industry Applications']
  },
  {
    id: '117',
    courseId: '117',
    courseName: 'Complete Data Science with MLOps',
    courseDisplayName: 'Data Science Pro: ML to Deployment',
    type: 'Paid/Premium',
    price: 4999,
    originalPrice: 9999,
    description: 'Master data science with MLOps integration, covering the complete pipeline from data collection to model deployment and monitoring.',
    category: 'Data Science',
    level: 'Advanced',
    duration: '16 weeks',
    instructor: 'Industry Expert',
    features: ['3-Phase Learning', 'Real Projects', 'MLOps Pipeline', 'Career Support']
  },
  {
    id: '118',
    courseId: '118',
    courseName: 'Complete Data Science with MLOps & Gen AI',
    courseDisplayName: 'Transformative Data Science: MLOps & Generative AI',
    type: 'Paid/Premium',
    price: 5999,
    originalPrice: 11999,
    description: 'Comprehensive data science course combining MLOps practices with cutting-edge Generative AI technologies.',
    category: 'Data Science',
    level: 'Expert',
    duration: '20 weeks',
    instructor: 'Industry Expert',
    features: ['MLOps + Gen AI', 'Advanced Projects', 'Industry Mentorship', 'Lifetime Support']
  },
  {
    id: '119',
    courseId: '119',
    courseName: 'Generative AI : Zero to Mastery',
    courseDisplayName: 'Prompt to Product: Mastering Generative AI',
    type: 'Paid/Premium',
    price: 5999,
    originalPrice: 11999,
    description: 'Comprehensive Generative AI course covering LLMs, image generation, and cutting-edge AI technologies.',
    category: 'Generative AI',
    level: 'Advanced',
    duration: '16 weeks',
    instructor: 'Industry Expert',
    features: ['Complete Gen AI', 'LLMs & Image Gen', 'Latest Technologies', 'Practical Applications']
  },
  {
    id: '120',
    courseId: '120',
    courseName: 'Complete Data Science with MLOps + AI & ML + Gen AI',
    courseDisplayName: 'Full Spectrum AI & Data Science Professional',
    type: 'Paid/Premium',
    price: 7999,
    originalPrice: 15999,
    description: 'The ultimate data science program combining MLOps, AI & ML, and Generative AI in one comprehensive course.',
    category: 'Data Science',
    level: 'Expert',
    duration: '24 weeks',
    instructor: 'Industry Expert',
    features: ['Complete Mastery', 'All Technologies', 'Comprehensive Projects', 'Career Guarantee']
  }
];

// Free/Freemium Courses (Course IDs 11-24) - For Featured Section
export const freeCourses: Course[] = [
  // Free Courses
  {
    id: '11',
    courseId: '11',
    courseName: 'Version Control Basics with Git & GitHub',
    courseDisplayName: 'Code & Collaborate: Git & GitHub Essentials',
    type: 'Free',
    price: 0,
    description: 'Master version control with Git and GitHub for collaborative development.',
    category: 'Development Tools',
    level: 'Beginner',
    duration: '2 weeks'
  },
  {
    id: '15',
    courseId: '15',
    courseName: 'Python for Data Science',
    courseDisplayName: 'Data Science Ready: Python Essentials',
    type: 'Free',
    price: 0,
    description: 'Learn Python programming fundamentals specifically for data science applications.',
    category: 'Programming',
    level: 'Beginner',
    duration: '4 weeks'
  },
  {
    id: '16',
    courseId: '16',
    courseName: 'Data Analytics Foundations',
    courseDisplayName: 'Data Analytics: Core Concepts',
    type: 'Free',
    price: 0,
    description: 'Introduction to data analytics concepts, tools, and methodologies.',
    category: 'Data Analytics',
    level: 'Beginner',
    duration: '3 weeks'
  },
  // Freemium Courses (₹199)
  {
    id: '12',
    courseId: '12',
    courseName: 'Excel Foundations',
    courseDisplayName: 'Mastering Excel Basics: Your Data Toolkit',
    type: 'Freemium',
    price: 199,
    description: 'Master Excel for data analysis, visualization, and business intelligence.',
    category: 'Data Analysis',
    level: 'Beginner',
    duration: '3 weeks'
  },
  {
    id: '13',
    courseId: '13',
    courseName: 'Introduction to Databases & SQL',
    courseDisplayName: 'SQL Fundamentals for Data Professionals',
    type: 'Freemium',
    price: 199,
    description: 'Learn SQL for database management and data querying.',
    category: 'Database',
    level: 'Beginner',
    duration: '4 weeks'
  },
  {
    id: '14',
    courseId: '14',
    courseName: 'Introduction to Power BI & DAX',
    courseDisplayName: 'Power BI Essentials: From Data to Dashboard',
    type: 'Freemium',
    price: 199,
    description: 'Create powerful business intelligence dashboards with Power BI.',
    category: 'Business Intelligence',
    level: 'Intermediate',
    duration: '4 weeks'
  },
  {
    id: '17',
    courseId: '17',
    courseName: 'ML Foundations',
    courseDisplayName: 'Machine Learning: Core Concepts',
    type: 'Freemium',
    price: 199,
    description: 'Introduction to machine learning concepts and algorithms.',
    category: 'Machine Learning',
    level: 'Beginner',
    duration: '5 weeks'
  },
  {
    id: '18',
    courseId: '18',
    courseName: 'Data Science Foundations',
    courseDisplayName: 'Data Science: The Essentials',
    type: 'Freemium',
    price: 199,
    description: 'Foundational concepts in data science and analytics.',
    category: 'Data Science',
    level: 'Beginner',
    duration: '5 weeks'
  },
  {
    id: '19',
    courseId: '19',
    courseName: 'Streamlit Foundations',
    courseDisplayName: 'Data Apps in a Flash: Streamlit Intro',
    type: 'Freemium',
    price: 199,
    description: 'Build interactive web applications for data science with Streamlit.',
    category: 'Web Apps',
    level: 'Intermediate',
    duration: '3 weeks'
  },
  {
    id: '20',
    courseId: '20',
    courseName: 'Cloud Computing Foundations',
    courseDisplayName: 'Navigating the Cloud: Fundamentals',
    type: 'Freemium',
    price: 199,
    description: 'Learn cloud computing fundamentals and popular platforms.',
    category: 'Cloud Computing',
    level: 'Intermediate',
    duration: '4 weeks'
  },
  {
    id: '21',
    courseId: '21',
    courseName: 'Generative AI Foundations',
    courseDisplayName: 'Unlocking Generative AI: Your First Steps',
    type: 'Freemium',
    price: 199,
    description: 'Introduction to Generative AI concepts and applications.',
    category: 'Generative AI',
    level: 'Beginner',
    duration: '4 weeks'
  },
  {
    id: '22',
    courseId: '22',
    courseName: 'Introduction to LLMs',
    courseDisplayName: 'Understanding LLMs: The AI Revolution',
    type: 'Freemium',
    price: 199,
    description: 'Understanding and working with Large Language Models.',
    category: 'Generative AI',
    level: 'Intermediate',
    duration: '5 weeks'
  },
  {
    id: '23',
    courseId: '23',
    courseName: 'Introduction to LangChain & LangGraphs',
    courseDisplayName: 'Powering LLMs: LangChain Fundamentals',
    type: 'Freemium',
    price: 199,
    description: 'Build AI applications using the LangChain framework.',
    category: 'Generative AI',
    level: 'Intermediate',
    duration: '4 weeks'
  },
  {
    id: '24',
    courseId: '24',
    courseName: 'RPA Platforms Introductions',
    courseDisplayName: 'Automate Your World: Intro to RPA',
    type: 'Freemium',
    price: 199,
    description: 'Automate business processes with RPA technologies.',
    category: 'Automation',
    level: 'Intermediate',
    duration: '5 weeks'
  }
];

// All courses combined
export const allCourses: Course[] = [...paidCourses, ...freeCourses];

// Course categories for filtering
export const courseCategories = [
  'All',
  'Data Science',
  'Data Analytics', 
  'Machine Learning',
  'Generative AI',
  'Programming',
  'Business Intelligence',
  'Database',
  'Web Apps',
  'Cloud Computing',
  'Development Tools',
  'Automation'
];
