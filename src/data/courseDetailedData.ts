export interface JobMarketData {
  averageSalary: string;
  jobGrowth: string;
  openPositions: string;
  topCompanies: string[];
  skills: string[];
  careerPaths: string[];
  demandLevel: 'High' | 'Very High' | 'Extreme';
  futureOutlook: string;
}

export interface CourseContent {
  modules: {
    title: string;
    lessons: number;
    duration: string;
    topics: string[];
  }[];
  projects: {
    title: string;
    description: string;
    technologies: string[];
    difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  }[];
  certifications: string[];
  prerequisites: string[];
  learningOutcomes: string[];
}

export interface DetailedCourseData {
  jobMarket: JobMarketData;
  content: CourseContent;
  uniqueSellingPoints: string[];
  industryRelevance: string;
  marketingHook: string;
  genZAppeal: string;
}

export const courseDetailedData: { [courseId: string]: DetailedCourseData } = {
  // PAID/PREMIUM COURSES (111-120)
  
  '111': {
    jobMarket: {
      averageSalary: '₹8-18 LPA',
      jobGrowth: '+28% (2024-2029)',
      openPositions: '35,000+',
      topCompanies: ['Microsoft', 'Tableau', 'Qlik', 'Deloitte', 'PwC', 'EY'],
      skills: ['Power BI', 'DAX', 'Power Query', 'Data Modeling', 'SQL', 'Excel'],
      careerPaths: ['BI Developer', 'Data Analyst', 'Business Analyst', 'BI Consultant'],
      demandLevel: 'Very High',
      futureOutlook: 'Essential skill as companies become more data-driven'
    },
    content: {
      modules: [
        {
          title: 'Power BI Fundamentals',
          lessons: 15,
          duration: '3 weeks',
          topics: ['Power BI Desktop', 'Data Sources', 'Basic Visualizations', 'Reports vs Dashboards']
        },
        {
          title: 'Advanced DAX & Modeling',
          lessons: 18,
          duration: '4 weeks',
          topics: ['DAX Functions', 'Calculated Columns', 'Measures', 'Time Intelligence']
        },
        {
          title: 'Enterprise BI Solutions',
          lessons: 12,
          duration: '3 weeks',
          topics: ['Power BI Service', 'Gateways', 'Row-Level Security', 'Deployment']
        }
      ],
      projects: [
        {
          title: 'Sales Performance Dashboard',
          description: 'Build an interactive sales dashboard with KPIs and drill-down capabilities',
          technologies: ['Power BI', 'SQL Server', 'Excel'],
          difficulty: 'Intermediate'
        },
        {
          title: 'Financial Reporting System',
          description: 'Create automated financial reports with real-time data refresh',
          technologies: ['Power BI', 'Azure SQL', 'Power Query'],
          difficulty: 'Advanced'
        }
      ],
      certifications: ['Microsoft Power BI Data Analyst Associate', 'Learnnect BI Specialist'],
      prerequisites: ['Basic Excel knowledge', 'Understanding of databases'],
      learningOutcomes: [
        'Master Power BI from basics to advanced',
        'Create professional dashboards and reports',
        'Implement data modeling best practices',
        'Deploy enterprise BI solutions'
      ]
    },
    uniqueSellingPoints: [
      'Microsoft-certified curriculum',
      'Real enterprise datasets',
      'Industry-standard practices',
      'Job placement assistance'
    ],
    industryRelevance: 'Critical for data-driven decision making in modern businesses',
    marketingHook: 'Turn Data into Decisions - Master the #1 BI Tool',
    genZAppeal: 'Create viral-worthy dashboards that make data actually interesting! 📊✨'
  },

  '112': {
    jobMarket: {
      averageSalary: '₹12-25 LPA',
      jobGrowth: '+35% (2024-2029)',
      openPositions: '50,000+',
      topCompanies: ['Google', 'Microsoft', 'Amazon', 'Flipkart', 'Zomato', 'Swiggy'],
      skills: ['Python', 'SQL', 'Machine Learning', 'Statistics', 'Pandas', 'Scikit-learn'],
      careerPaths: ['Data Scientist', 'ML Engineer', 'Data Analyst', 'Research Scientist'],
      demandLevel: 'Extreme',
      futureOutlook: 'Fastest growing field with unlimited potential'
    },
    content: {
      modules: [
        {
          title: 'Python for Data Science',
          lessons: 20,
          duration: '4 weeks',
          topics: ['Python Basics', 'NumPy', 'Pandas', 'Data Manipulation', 'File Handling']
        },
        {
          title: 'Statistical Analysis & Visualization',
          lessons: 18,
          duration: '4 weeks',
          topics: ['Descriptive Statistics', 'Hypothesis Testing', 'Matplotlib', 'Seaborn', 'Plotly']
        },
        {
          title: 'Machine Learning Fundamentals',
          lessons: 25,
          duration: '6 weeks',
          topics: ['Supervised Learning', 'Unsupervised Learning', 'Model Evaluation', 'Feature Engineering']
        },
        {
          title: 'Advanced ML & Deployment',
          lessons: 15,
          duration: '4 weeks',
          topics: ['Ensemble Methods', 'Deep Learning Intro', 'Model Deployment', 'MLOps Basics']
        }
      ],
      projects: [
        {
          title: 'Customer Churn Prediction',
          description: 'Build a machine learning model to predict customer churn for a telecom company',
          technologies: ['Python', 'Scikit-learn', 'Pandas', 'Matplotlib'],
          difficulty: 'Intermediate'
        },
        {
          title: 'Recommendation System',
          description: 'Create a movie recommendation system using collaborative filtering',
          technologies: ['Python', 'TensorFlow', 'Surprise', 'Flask'],
          difficulty: 'Advanced'
        },
        {
          title: 'Stock Price Prediction',
          description: 'Develop a time series model to predict stock prices',
          technologies: ['Python', 'LSTM', 'Yahoo Finance API', 'Streamlit'],
          difficulty: 'Advanced'
        }
      ],
      certifications: ['Data Science Professional Certificate', 'Python for Data Science'],
      prerequisites: ['Basic programming knowledge', 'High school mathematics'],
      learningOutcomes: [
        'Master Python for data science',
        'Build and deploy ML models',
        'Perform statistical analysis',
        'Create data visualizations',
        'Work with real-world datasets'
      ]
    },
    uniqueSellingPoints: [
      'Industry-relevant projects',
      'Hands-on coding approach',
      'Real datasets from top companies',
      'Career transition support'
    ],
    industryRelevance: 'Core skill for the AI revolution and data-driven economy',
    marketingHook: 'Become the Data Wizard Every Company Needs',
    genZAppeal: 'Code your way to the future - where data meets destiny! 🚀💻'
  },

  '113': {
    jobMarket: {
      averageSalary: '₹10-22 LPA',
      jobGrowth: '+32% (2024-2029)',
      openPositions: '45,000+',
      topCompanies: ['Netflix', 'Spotify', 'Uber', 'OpenAI', 'DeepMind', 'Tesla'],
      skills: ['Python', 'TensorFlow', 'PyTorch', 'Neural Networks', 'Deep Learning', 'Computer Vision'],
      careerPaths: ['ML Engineer', 'AI Researcher', 'Deep Learning Engineer', 'Computer Vision Engineer'],
      demandLevel: 'Extreme',
      futureOutlook: 'Revolutionary technology shaping the future of AI'
    },
    content: {
      modules: [
        {
          title: 'Machine Learning Foundations',
          lessons: 16,
          duration: '3 weeks',
          topics: ['ML Algorithms', 'Supervised Learning', 'Unsupervised Learning', 'Model Evaluation']
        },
        {
          title: 'Deep Learning Fundamentals',
          lessons: 20,
          duration: '4 weeks',
          topics: ['Neural Networks', 'Backpropagation', 'CNNs', 'RNNs', 'LSTMs']
        },
        {
          title: 'Advanced Deep Learning',
          lessons: 18,
          duration: '4 weeks',
          topics: ['GANs', 'Transformers', 'Transfer Learning', 'Attention Mechanisms']
        },
        {
          title: 'Practical Applications',
          lessons: 14,
          duration: '3 weeks',
          topics: ['Computer Vision', 'NLP', 'Reinforcement Learning', 'Model Deployment']
        }
      ],
      projects: [
        {
          title: 'Image Classification System',
          description: 'Build a CNN model to classify images with 95%+ accuracy',
          technologies: ['Python', 'TensorFlow', 'Keras', 'OpenCV'],
          difficulty: 'Intermediate'
        },
        {
          title: 'Chatbot with NLP',
          description: 'Create an intelligent chatbot using transformer models',
          technologies: ['Python', 'Transformers', 'BERT', 'Flask'],
          difficulty: 'Advanced'
        },
        {
          title: 'Autonomous Vehicle Vision',
          description: 'Develop object detection for self-driving cars',
          technologies: ['Python', 'YOLO', 'OpenCV', 'PyTorch'],
          difficulty: 'Advanced'
        }
      ],
      certifications: ['Deep Learning Specialist', 'AI/ML Professional Certificate'],
      prerequisites: ['Python programming', 'Basic machine learning', 'Linear algebra'],
      learningOutcomes: [
        'Master deep learning algorithms',
        'Build neural networks from scratch',
        'Implement computer vision solutions',
        'Create NLP applications',
        'Deploy AI models in production'
      ]
    },
    uniqueSellingPoints: [
      'Cutting-edge AI techniques',
      'Industry-standard frameworks',
      'Real-world AI applications',
      'Research-oriented approach'
    ],
    industryRelevance: 'Powering the next generation of AI applications and automation',
    marketingHook: 'Build the AI That Will Change the World',
    genZAppeal: 'Train machines to think like you - but faster! 🤖🧠'
  },

  '114': {
    jobMarket: {
      averageSalary: '₹15-30 LPA',
      jobGrowth: '+45% (2024-2029)',
      openPositions: '25,000+',
      topCompanies: ['OpenAI', 'Google', 'Microsoft', 'Anthropic', 'Cohere', 'Stability AI'],
      skills: ['LLMs', 'Prompt Engineering', 'Fine-tuning', 'RAG', 'Vector Databases', 'Transformers'],
      careerPaths: ['GenAI Engineer', 'Prompt Engineer', 'AI Product Manager', 'LLM Researcher'],
      demandLevel: 'Extreme',
      futureOutlook: 'The hottest field in tech with explosive growth potential'
    },
    content: {
      modules: [
        {
          title: 'Generative AI Fundamentals',
          lessons: 12,
          duration: '2 weeks',
          topics: ['What is GenAI', 'LLMs', 'Transformers', 'Attention Mechanisms']
        },
        {
          title: 'Prompt Engineering Mastery',
          lessons: 15,
          duration: '3 weeks',
          topics: ['Prompt Design', 'Chain-of-Thought', 'Few-shot Learning', 'Prompt Optimization']
        },
        {
          title: 'Advanced GenAI Applications',
          lessons: 18,
          duration: '4 weeks',
          topics: ['RAG Systems', 'Fine-tuning', 'Multi-modal AI', 'AI Agents']
        },
        {
          title: 'Production GenAI Systems',
          lessons: 10,
          duration: '2 weeks',
          topics: ['API Integration', 'Scaling', 'Safety & Ethics', 'Cost Optimization']
        }
      ],
      projects: [
        {
          title: 'AI Content Generator',
          description: 'Build a multi-modal content generation platform',
          technologies: ['OpenAI API', 'Streamlit', 'LangChain', 'Pinecone'],
          difficulty: 'Intermediate'
        },
        {
          title: 'Intelligent Document Assistant',
          description: 'Create a RAG-based document Q&A system',
          technologies: ['LangChain', 'ChromaDB', 'FastAPI', 'React'],
          difficulty: 'Advanced'
        },
        {
          title: 'AI-Powered Code Assistant',
          description: 'Develop a coding assistant using fine-tuned models',
          technologies: ['Hugging Face', 'CodeT5', 'VS Code Extension', 'Python'],
          difficulty: 'Advanced'
        }
      ],
      certifications: ['Generative AI Specialist', 'Prompt Engineering Expert'],
      prerequisites: ['Python programming', 'Basic ML knowledge', 'API usage'],
      learningOutcomes: [
        'Master prompt engineering techniques',
        'Build RAG applications',
        'Fine-tune language models',
        'Create AI-powered products',
        'Implement safety measures'
      ]
    },
    uniqueSellingPoints: [
      'Latest GenAI techniques',
      'Hands-on with GPT-4',
      'Real startup projects',
      'Industry expert mentorship'
    ],
    industryRelevance: 'Driving the AI revolution across all industries',
    marketingHook: 'Master the Technology That\'s Reshaping Everything',
    genZAppeal: 'Create AI that creates - be the architect of tomorrow! ✨🎨'
  },

  '115': {
    jobMarket: {
      averageSalary: '₹8-16 LPA',
      jobGrowth: '+25% (2024-2029)',
      openPositions: '40,000+',
      topCompanies: ['Google', 'Microsoft', 'Amazon', 'Meta', 'Apple', 'Adobe'],
      skills: ['JavaScript', 'React', 'Node.js', 'Python', 'APIs', 'Databases'],
      careerPaths: ['Full Stack Developer', 'Frontend Developer', 'Backend Developer', 'Web Developer'],
      demandLevel: 'Very High',
      futureOutlook: 'Fundamental skill for digital transformation'
    },
    content: {
      modules: [
        {
          title: 'Frontend Development',
          lessons: 20,
          duration: '4 weeks',
          topics: ['HTML5', 'CSS3', 'JavaScript ES6+', 'React.js', 'Responsive Design']
        },
        {
          title: 'Backend Development',
          lessons: 18,
          duration: '4 weeks',
          topics: ['Node.js', 'Express.js', 'RESTful APIs', 'Authentication', 'Security']
        },
        {
          title: 'Database & DevOps',
          lessons: 15,
          duration: '3 weeks',
          topics: ['MongoDB', 'PostgreSQL', 'Git', 'Docker', 'Deployment']
        },
        {
          title: 'Advanced Topics',
          lessons: 12,
          duration: '3 weeks',
          topics: ['GraphQL', 'Microservices', 'Testing', 'Performance Optimization']
        }
      ],
      projects: [
        {
          title: 'E-commerce Platform',
          description: 'Build a full-featured online shopping platform',
          technologies: ['React', 'Node.js', 'MongoDB', 'Stripe'],
          difficulty: 'Intermediate'
        },
        {
          title: 'Social Media App',
          description: 'Create a real-time social networking application',
          technologies: ['React', 'Socket.io', 'Express', 'PostgreSQL'],
          difficulty: 'Advanced'
        },
        {
          title: 'Task Management System',
          description: 'Develop a collaborative project management tool',
          technologies: ['Next.js', 'Prisma', 'tRPC', 'TypeScript'],
          difficulty: 'Advanced'
        }
      ],
      certifications: ['Full Stack Web Developer', 'React Developer'],
      prerequisites: ['Basic programming knowledge', 'Computer fundamentals'],
      learningOutcomes: [
        'Build complete web applications',
        'Master modern JavaScript frameworks',
        'Implement secure backend systems',
        'Deploy applications to cloud',
        'Follow industry best practices'
      ]
    },
    uniqueSellingPoints: [
      'Modern tech stack',
      'Industry-relevant projects',
      'Full-stack expertise',
      'Job-ready portfolio'
    ],
    industryRelevance: 'Essential for digital products and online businesses',
    marketingHook: 'Code the Web, Shape the Future',
    genZAppeal: 'Build apps that go viral - from idea to internet fame! 🌐💫'
  },

  '116': {
    jobMarket: {
      averageSalary: '₹12-24 LPA',
      jobGrowth: '+38% (2024-2029)',
      openPositions: '30,000+',
      topCompanies: ['AWS', 'Microsoft', 'Google Cloud', 'IBM', 'Accenture', 'TCS'],
      skills: ['AWS', 'Azure', 'Docker', 'Kubernetes', 'Terraform', 'DevOps'],
      careerPaths: ['Cloud Engineer', 'DevOps Engineer', 'Cloud Architect', 'Site Reliability Engineer'],
      demandLevel: 'Very High',
      futureOutlook: 'Critical as businesses migrate to cloud-first strategies'
    },
    content: {
      modules: [
        {
          title: 'Cloud Fundamentals',
          lessons: 14,
          duration: '3 weeks',
          topics: ['Cloud Concepts', 'AWS Basics', 'EC2', 'S3', 'VPC']
        },
        {
          title: 'Advanced Cloud Services',
          lessons: 16,
          duration: '3 weeks',
          topics: ['Lambda', 'RDS', 'CloudFormation', 'Load Balancers', 'Auto Scaling']
        },
        {
          title: 'DevOps & Automation',
          lessons: 18,
          duration: '4 weeks',
          topics: ['CI/CD', 'Docker', 'Kubernetes', 'Terraform', 'Monitoring']
        },
        {
          title: 'Security & Best Practices',
          lessons: 12,
          duration: '2 weeks',
          topics: ['IAM', 'Security Groups', 'Compliance', 'Cost Optimization']
        }
      ],
      projects: [
        {
          title: 'Scalable Web Application',
          description: 'Deploy a highly available web app on AWS',
          technologies: ['AWS', 'Docker', 'Terraform', 'Jenkins'],
          difficulty: 'Intermediate'
        },
        {
          title: 'Microservices Architecture',
          description: 'Build and orchestrate microservices with Kubernetes',
          technologies: ['Kubernetes', 'Docker', 'Helm', 'Prometheus'],
          difficulty: 'Advanced'
        }
      ],
      certifications: ['AWS Solutions Architect', 'Cloud Practitioner'],
      prerequisites: ['Basic networking', 'Linux fundamentals', 'Programming basics'],
      learningOutcomes: [
        'Master AWS cloud services',
        'Implement DevOps practices',
        'Design scalable architectures',
        'Automate infrastructure deployment',
        'Ensure security and compliance'
      ]
    },
    uniqueSellingPoints: [
      'AWS certification prep',
      'Hands-on cloud labs',
      'Real-world scenarios',
      'Industry best practices'
    ],
    industryRelevance: 'Essential for modern scalable and resilient applications',
    marketingHook: 'Build in the Cloud, Scale Without Limits',
    genZAppeal: 'Deploy to the cloud and watch your apps reach the stratosphere! ☁️🚀'
  },

  '117': {
    jobMarket: {
      averageSalary: '₹10-20 LPA',
      jobGrowth: '+30% (2024-2029)',
      openPositions: '35,000+',
      topCompanies: ['Oracle', 'Microsoft', 'IBM', 'SAP', 'MongoDB', 'Snowflake'],
      skills: ['SQL', 'PostgreSQL', 'MongoDB', 'Data Modeling', 'Performance Tuning', 'ETL'],
      careerPaths: ['Database Administrator', 'Data Engineer', 'Database Developer', 'Data Architect'],
      demandLevel: 'High',
      futureOutlook: 'Growing demand for data management expertise'
    },
    content: {
      modules: [
        {
          title: 'SQL Mastery',
          lessons: 18,
          duration: '4 weeks',
          topics: ['Advanced SQL', 'Joins', 'Subqueries', 'Window Functions', 'Stored Procedures']
        },
        {
          title: 'Database Design',
          lessons: 15,
          duration: '3 weeks',
          topics: ['Normalization', 'ER Modeling', 'Indexing', 'Performance Optimization']
        },
        {
          title: 'NoSQL Databases',
          lessons: 12,
          duration: '3 weeks',
          topics: ['MongoDB', 'Cassandra', 'Redis', 'Document Stores', 'Graph Databases']
        },
        {
          title: 'Data Engineering',
          lessons: 14,
          duration: '3 weeks',
          topics: ['ETL Processes', 'Data Pipelines', 'Apache Spark', 'Data Warehousing']
        }
      ],
      projects: [
        {
          title: 'E-commerce Database System',
          description: 'Design and implement a complete e-commerce database',
          technologies: ['PostgreSQL', 'SQL', 'Python', 'Redis'],
          difficulty: 'Intermediate'
        },
        {
          title: 'Real-time Analytics Pipeline',
          description: 'Build a streaming data pipeline for real-time analytics',
          technologies: ['Apache Kafka', 'Spark', 'MongoDB', 'Elasticsearch'],
          difficulty: 'Advanced'
        }
      ],
      certifications: ['Database Professional', 'SQL Expert'],
      prerequisites: ['Basic programming', 'Understanding of data concepts'],
      learningOutcomes: [
        'Master SQL and database design',
        'Work with NoSQL databases',
        'Build data pipelines',
        'Optimize database performance',
        'Implement data security'
      ]
    },
    uniqueSellingPoints: [
      'Multi-database expertise',
      'Performance optimization focus',
      'Real-world data scenarios',
      'Industry-standard tools'
    ],
    industryRelevance: 'Foundation for all data-driven applications and analytics',
    marketingHook: 'Master the Language of Data',
    genZAppeal: 'Query your way to success - make databases your superpower! 💾⚡'
  },

  '118': {
    jobMarket: {
      averageSalary: '₹14-28 LPA',
      jobGrowth: '+40% (2024-2029)',
      openPositions: '20,000+',
      topCompanies: ['Snowflake', 'Databricks', 'Palantir', 'Confluent', 'Airbnb', 'Uber'],
      skills: ['Apache Spark', 'Kafka', 'Airflow', 'Python', 'Scala', 'Data Pipelines'],
      careerPaths: ['Data Engineer', 'Big Data Engineer', 'Platform Engineer', 'Data Architect'],
      demandLevel: 'Very High',
      futureOutlook: 'Critical for handling massive data volumes in digital economy'
    },
    content: {
      modules: [
        {
          title: 'Data Engineering Fundamentals',
          lessons: 16,
          duration: '3 weeks',
          topics: ['Data Pipelines', 'ETL vs ELT', 'Data Quality', 'Batch vs Stream Processing']
        },
        {
          title: 'Big Data Technologies',
          lessons: 20,
          duration: '4 weeks',
          topics: ['Apache Spark', 'Hadoop', 'Kafka', 'Hive', 'HBase']
        },
        {
          title: 'Cloud Data Platforms',
          lessons: 18,
          duration: '4 weeks',
          topics: ['AWS Data Services', 'Snowflake', 'Databricks', 'Data Lakes', 'Data Warehouses']
        },
        {
          title: 'Workflow Orchestration',
          lessons: 12,
          duration: '2 weeks',
          topics: ['Apache Airflow', 'Prefect', 'Monitoring', 'Error Handling']
        }
      ],
      projects: [
        {
          title: 'Real-time Data Pipeline',
          description: 'Build a streaming data pipeline for IoT sensor data',
          technologies: ['Kafka', 'Spark Streaming', 'Cassandra', 'Grafana'],
          difficulty: 'Advanced'
        },
        {
          title: 'Data Lake Architecture',
          description: 'Design and implement a modern data lake solution',
          technologies: ['AWS S3', 'Glue', 'Athena', 'Spark', 'Airflow'],
          difficulty: 'Advanced'
        }
      ],
      certifications: ['Data Engineering Professional', 'Big Data Specialist'],
      prerequisites: ['Python programming', 'SQL knowledge', 'Basic cloud concepts'],
      learningOutcomes: [
        'Build scalable data pipelines',
        'Master big data technologies',
        'Implement stream processing',
        'Design data architectures',
        'Ensure data quality and reliability'
      ]
    },
    uniqueSellingPoints: [
      'Latest big data tools',
      'Real-time processing focus',
      'Cloud-native approach',
      'Industry-scale projects'
    ],
    industryRelevance: 'Backbone of modern data-driven organizations',
    marketingHook: 'Engineer the Data Infrastructure of Tomorrow',
    genZAppeal: 'Build the pipes that power the digital world! 🔧📊'
  },

  '119': {
    jobMarket: {
      averageSalary: '₹16-32 LPA',
      jobGrowth: '+42% (2024-2029)',
      openPositions: '15,000+',
      topCompanies: ['Google', 'Tesla', 'NVIDIA', 'Boston Dynamics', 'Amazon Robotics', 'Waymo'],
      skills: ['ROS', 'Python', 'C++', 'Computer Vision', 'Path Planning', 'Sensor Fusion'],
      careerPaths: ['Robotics Engineer', 'Autonomous Systems Engineer', 'Computer Vision Engineer', 'AI Robotics Researcher'],
      demandLevel: 'High',
      futureOutlook: 'Revolutionary field with applications in automation, healthcare, and space'
    },
    content: {
      modules: [
        {
          title: 'Robotics Fundamentals',
          lessons: 14,
          duration: '3 weeks',
          topics: ['Robot Kinematics', 'Dynamics', 'Control Systems', 'Sensors and Actuators']
        },
        {
          title: 'ROS (Robot Operating System)',
          lessons: 18,
          duration: '4 weeks',
          topics: ['ROS Basics', 'Nodes and Topics', 'Services', 'Navigation Stack']
        },
        {
          title: 'Computer Vision for Robotics',
          lessons: 16,
          duration: '3 weeks',
          topics: ['Image Processing', 'Object Detection', 'SLAM', 'Visual Odometry']
        },
        {
          title: 'Autonomous Systems',
          lessons: 12,
          duration: '3 weeks',
          topics: ['Path Planning', 'Obstacle Avoidance', 'Decision Making', 'Multi-robot Systems']
        }
      ],
      projects: [
        {
          title: 'Autonomous Navigation Robot',
          description: 'Build a robot that can navigate autonomously in unknown environments',
          technologies: ['ROS', 'Python', 'OpenCV', 'Gazebo'],
          difficulty: 'Advanced'
        },
        {
          title: 'Robotic Arm Control',
          description: 'Develop precise control algorithms for a 6-DOF robotic arm',
          technologies: ['ROS', 'MoveIt', 'C++', 'Rviz'],
          difficulty: 'Advanced'
        }
      ],
      certifications: ['Robotics Engineer', 'ROS Developer'],
      prerequisites: ['Programming (Python/C++)', 'Linear algebra', 'Basic physics'],
      learningOutcomes: [
        'Master robotics fundamentals',
        'Program with ROS framework',
        'Implement computer vision',
        'Design autonomous systems',
        'Build real robotic applications'
      ]
    },
    uniqueSellingPoints: [
      'Hands-on robot programming',
      'Industry-standard ROS',
      'Real hardware projects',
      'Cutting-edge applications'
    ],
    industryRelevance: 'Driving automation revolution across industries',
    marketingHook: 'Build the Robots That Will Change Everything',
    genZAppeal: 'Code robots that are cooler than sci-fi movies! 🤖🎬'
  },

  '120': {
    jobMarket: {
      averageSalary: '₹18-35 LPA',
      jobGrowth: '+50% (2024-2029)',
      openPositions: '12,000+',
      topCompanies: ['OpenAI', 'Google DeepMind', 'Microsoft', 'NVIDIA', 'Meta AI', 'Anthropic'],
      skills: ['MLOps', 'Kubernetes', 'Docker', 'TensorFlow', 'PyTorch', 'CI/CD', 'Monitoring'],
      careerPaths: ['MLOps Engineer', 'AI Platform Engineer', 'ML Infrastructure Engineer', 'AI Solutions Architect'],
      demandLevel: 'Extreme',
      futureOutlook: 'Most comprehensive and future-proof AI career path'
    },
    content: {
      modules: [
        {
          title: 'Complete Data Science Foundation',
          lessons: 25,
          duration: '5 weeks',
          topics: ['Python', 'Statistics', 'ML Algorithms', 'Data Analysis', 'Visualization']
        },
        {
          title: 'Advanced AI & Deep Learning',
          lessons: 30,
          duration: '6 weeks',
          topics: ['Neural Networks', 'CNNs', 'RNNs', 'Transformers', 'Computer Vision', 'NLP']
        },
        {
          title: 'Generative AI Mastery',
          lessons: 20,
          duration: '4 weeks',
          topics: ['LLMs', 'Prompt Engineering', 'Fine-tuning', 'RAG', 'Multi-modal AI']
        },
        {
          title: 'MLOps & Production Systems',
          lessons: 25,
          duration: '5 weeks',
          topics: ['Model Deployment', 'Monitoring', 'CI/CD', 'Kubernetes', 'Scaling', 'A/B Testing']
        },
        {
          title: 'Capstone & Career Prep',
          lessons: 15,
          duration: '4 weeks',
          topics: ['End-to-end Projects', 'Portfolio Building', 'Interview Prep', 'Industry Networking']
        }
      ],
      projects: [
        {
          title: 'AI-Powered SaaS Platform',
          description: 'Build a complete AI application from data to deployment',
          technologies: ['Python', 'TensorFlow', 'FastAPI', 'Docker', 'Kubernetes', 'AWS'],
          difficulty: 'Advanced'
        },
        {
          title: 'Multi-modal AI Assistant',
          description: 'Create an AI assistant that handles text, images, and voice',
          technologies: ['OpenAI API', 'Whisper', 'DALL-E', 'LangChain', 'Streamlit'],
          difficulty: 'Advanced'
        },
        {
          title: 'MLOps Pipeline',
          description: 'Implement a complete MLOps pipeline with monitoring and auto-retraining',
          technologies: ['MLflow', 'Kubeflow', 'Prometheus', 'Grafana', 'Jenkins'],
          difficulty: 'Advanced'
        }
      ],
      certifications: ['Complete AI Professional', 'MLOps Specialist', 'Data Science Expert'],
      prerequisites: ['Basic programming', 'Mathematics fundamentals'],
      learningOutcomes: [
        'Master entire AI/ML stack',
        'Build production-ready AI systems',
        'Implement MLOps best practices',
        'Create generative AI applications',
        'Lead AI transformation projects'
      ]
    },
    uniqueSellingPoints: [
      'Most comprehensive AI course',
      'Industry mentorship program',
      'Guaranteed job placement',
      'Lifetime learning access'
    ],
    industryRelevance: 'Complete preparation for the AI-first economy',
    marketingHook: 'Become the Complete AI Professional Companies Fight For',
    genZAppeal: 'Master every AI skill that exists - become the ultimate tech wizard! 🧙‍♂️✨'
  },

  // FREE COURSES (11-16)

  '11': {
    jobMarket: {
      averageSalary: '₹6-12 LPA',
      jobGrowth: '+20% (2024-2029)',
      openPositions: '100,000+',
      topCompanies: ['GitHub', 'GitLab', 'Atlassian', 'Microsoft', 'Google', 'Meta'],
      skills: ['Git', 'GitHub', 'Version Control', 'Collaboration', 'Code Review', 'CI/CD'],
      careerPaths: ['Software Developer', 'DevOps Engineer', 'Technical Lead', 'Open Source Contributor'],
      demandLevel: 'Very High',
      futureOutlook: 'Essential skill for any developer role'
    },
    content: {
      modules: [
        {
          title: 'Git Fundamentals',
          lessons: 8,
          duration: '1 week',
          topics: ['Git Basics', 'Repository Setup', 'Commits', 'Branches', 'Merging']
        },
        {
          title: 'GitHub Mastery',
          lessons: 10,
          duration: '1 week',
          topics: ['GitHub Workflow', 'Pull Requests', 'Issues', 'Projects', 'Actions']
        }
      ],
      projects: [
        {
          title: 'Open Source Contribution',
          description: 'Contribute to a real open source project on GitHub',
          technologies: ['Git', 'GitHub', 'Markdown'],
          difficulty: 'Beginner'
        }
      ],
      certifications: ['Git & GitHub Essentials'],
      prerequisites: ['Basic computer skills'],
      learningOutcomes: [
        'Master Git version control',
        'Collaborate effectively on GitHub',
        'Contribute to open source projects',
        'Implement proper code review practices'
      ]
    },
    uniqueSellingPoints: [
      'Industry-standard workflow',
      'Real collaboration experience',
      'Open source contribution',
      'Essential developer skill'
    ],
    industryRelevance: 'Fundamental requirement for all software development roles',
    marketingHook: 'Master the Tool Every Developer Uses Daily',
    genZAppeal: 'Version control your way to coding greatness! 🚀💻'
  },

  '12': {
    jobMarket: {
      averageSalary: '₹5-10 LPA',
      jobGrowth: '+18% (2024-2029)',
      openPositions: '80,000+',
      topCompanies: ['Microsoft', 'Google', 'Apple', 'Adobe', 'Salesforce', 'Oracle'],
      skills: ['Excel', 'VBA', 'Pivot Tables', 'Data Analysis', 'Formulas', 'Macros'],
      careerPaths: ['Business Analyst', 'Data Analyst', 'Financial Analyst', 'Operations Analyst'],
      demandLevel: 'High',
      futureOutlook: 'Timeless skill with evolving advanced features'
    },
    content: {
      modules: [
        {
          title: 'Excel Fundamentals',
          lessons: 12,
          duration: '2 weeks',
          topics: ['Basic Functions', 'Formatting', 'Charts', 'Data Validation']
        },
        {
          title: 'Advanced Excel',
          lessons: 15,
          duration: '2 weeks',
          topics: ['Pivot Tables', 'VLOOKUP', 'Macros', 'VBA Basics', 'Power Query']
        }
      ],
      projects: [
        {
          title: 'Business Dashboard',
          description: 'Create an interactive business performance dashboard',
          technologies: ['Excel', 'VBA', 'Power Query'],
          difficulty: 'Intermediate'
        }
      ],
      certifications: ['Excel Expert'],
      prerequisites: ['Basic computer skills'],
      learningOutcomes: [
        'Master Excel formulas and functions',
        'Create professional dashboards',
        'Automate tasks with VBA',
        'Analyze data effectively'
      ]
    },
    uniqueSellingPoints: [
      'Universal business skill',
      'Immediate productivity boost',
      'Automation capabilities',
      'Professional certification'
    ],
    industryRelevance: 'Essential tool for business operations and analysis',
    marketingHook: 'Excel Your Way to Business Success',
    genZAppeal: 'Turn spreadsheets into superpowers! 📊⚡'
  },

  '13': {
    jobMarket: {
      averageSalary: '₹4-8 LPA',
      jobGrowth: '+15% (2024-2029)',
      openPositions: '60,000+',
      topCompanies: ['IBM', 'Accenture', 'TCS', 'Infosys', 'Wipro', 'HCL'],
      skills: ['Linux', 'Command Line', 'Shell Scripting', 'System Administration', 'Networking'],
      careerPaths: ['System Administrator', 'DevOps Engineer', 'Cloud Engineer', 'Security Analyst'],
      demandLevel: 'High',
      futureOutlook: 'Foundation for cloud and DevOps careers'
    },
    content: {
      modules: [
        {
          title: 'Linux Basics',
          lessons: 10,
          duration: '2 weeks',
          topics: ['File System', 'Commands', 'Permissions', 'Process Management']
        },
        {
          title: 'System Administration',
          lessons: 12,
          duration: '2 weeks',
          topics: ['User Management', 'Networking', 'Services', 'Security Basics']
        }
      ],
      projects: [
        {
          title: 'Web Server Setup',
          description: 'Configure and secure a Linux web server',
          technologies: ['Linux', 'Apache', 'SSH', 'Firewall'],
          difficulty: 'Intermediate'
        }
      ],
      certifications: ['Linux Essentials'],
      prerequisites: ['Basic computer knowledge'],
      learningOutcomes: [
        'Navigate Linux command line',
        'Manage files and permissions',
        'Configure system services',
        'Implement basic security'
      ]
    },
    uniqueSellingPoints: [
      'Industry-standard OS',
      'Foundation for advanced roles',
      'Hands-on practice',
      'Real-world scenarios'
    ],
    industryRelevance: 'Powers most servers and cloud infrastructure',
    marketingHook: 'Master the OS That Runs the Internet',
    genZAppeal: 'Command the terminal like a hacker in movies! 💻🔥'
  },

  '14': {
    jobMarket: {
      averageSalary: '₹6-14 LPA',
      jobGrowth: '+22% (2024-2029)',
      openPositions: '70,000+',
      topCompanies: ['Oracle', 'Microsoft', 'IBM', 'SAP', 'Amazon', 'Snowflake'],
      skills: ['SQL', 'Database Design', 'Query Optimization', 'Data Analysis', 'Reporting'],
      careerPaths: ['Data Analyst', 'Database Developer', 'Business Intelligence Analyst', 'Data Engineer'],
      demandLevel: 'Very High',
      futureOutlook: 'Fundamental skill for data-driven roles'
    },
    content: {
      modules: [
        {
          title: 'SQL Fundamentals',
          lessons: 15,
          duration: '3 weeks',
          topics: ['Basic Queries', 'Joins', 'Aggregations', 'Subqueries']
        },
        {
          title: 'Advanced SQL',
          lessons: 12,
          duration: '2 weeks',
          topics: ['Window Functions', 'CTEs', 'Stored Procedures', 'Performance Tuning']
        }
      ],
      projects: [
        {
          title: 'Sales Analytics Dashboard',
          description: 'Build comprehensive sales reports using SQL',
          technologies: ['SQL', 'PostgreSQL', 'Tableau'],
          difficulty: 'Intermediate'
        }
      ],
      certifications: ['SQL Professional'],
      prerequisites: ['Basic computer skills'],
      learningOutcomes: [
        'Write complex SQL queries',
        'Design efficient databases',
        'Analyze business data',
        'Create automated reports'
      ]
    },
    uniqueSellingPoints: [
      'Universal data skill',
      'High demand across industries',
      'Immediate job applicability',
      'Foundation for advanced analytics'
    ],
    industryRelevance: 'Essential for any role involving data',
    marketingHook: 'Speak the Language of Data',
    genZAppeal: 'Query your way to data mastery! 🔍📊'
  },

  '15': {
    jobMarket: {
      averageSalary: '₹8-16 LPA',
      jobGrowth: '+28% (2024-2029)',
      openPositions: '50,000+',
      topCompanies: ['Google', 'Facebook', 'Twitter', 'LinkedIn', 'Shopify', 'WordPress'],
      skills: ['HTML', 'CSS', 'JavaScript', 'Responsive Design', 'UI/UX', 'Frameworks'],
      careerPaths: ['Frontend Developer', 'Web Designer', 'UI Developer', 'Full Stack Developer'],
      demandLevel: 'Very High',
      futureOutlook: 'Growing with digital transformation'
    },
    content: {
      modules: [
        {
          title: 'HTML & CSS Mastery',
          lessons: 18,
          duration: '3 weeks',
          topics: ['HTML5', 'CSS3', 'Flexbox', 'Grid', 'Responsive Design']
        },
        {
          title: 'JavaScript Fundamentals',
          lessons: 20,
          duration: '4 weeks',
          topics: ['ES6+', 'DOM Manipulation', 'Events', 'APIs', 'Async Programming']
        }
      ],
      projects: [
        {
          title: 'Portfolio Website',
          description: 'Build a responsive personal portfolio website',
          technologies: ['HTML', 'CSS', 'JavaScript', 'Git'],
          difficulty: 'Beginner'
        },
        {
          title: 'Interactive Web App',
          description: 'Create a dynamic web application with API integration',
          technologies: ['JavaScript', 'Fetch API', 'Local Storage'],
          difficulty: 'Intermediate'
        }
      ],
      certifications: ['Frontend Developer'],
      prerequisites: ['Basic computer skills'],
      learningOutcomes: [
        'Build responsive websites',
        'Master modern JavaScript',
        'Create interactive user interfaces',
        'Implement best practices'
      ]
    },
    uniqueSellingPoints: [
      'Creative and technical skills',
      'Immediate visual results',
      'High demand field',
      'Gateway to full-stack development'
    ],
    industryRelevance: 'Essential for all web-based businesses',
    marketingHook: 'Code the Web, Design the Future',
    genZAppeal: 'Build websites that break the internet! 🌐✨'
  },

  '16': {
    jobMarket: {
      averageSalary: '₹7-15 LPA',
      jobGrowth: '+25% (2024-2029)',
      openPositions: '45,000+',
      topCompanies: ['Google', 'Microsoft', 'Amazon', 'Netflix', 'Spotify', 'Airbnb'],
      skills: ['Python', 'Programming Logic', 'Data Structures', 'Algorithms', 'Problem Solving'],
      careerPaths: ['Software Developer', 'Data Scientist', 'Backend Developer', 'Automation Engineer'],
      demandLevel: 'Very High',
      futureOutlook: 'Most versatile programming language'
    },
    content: {
      modules: [
        {
          title: 'Python Basics',
          lessons: 16,
          duration: '3 weeks',
          topics: ['Syntax', 'Variables', 'Control Flow', 'Functions', 'Data Types']
        },
        {
          title: 'Intermediate Python',
          lessons: 18,
          duration: '3 weeks',
          topics: ['OOP', 'File Handling', 'Error Handling', 'Libraries', 'APIs']
        }
      ],
      projects: [
        {
          title: 'Task Automation Tool',
          description: 'Build a Python script to automate daily tasks',
          technologies: ['Python', 'Libraries', 'File System'],
          difficulty: 'Beginner'
        },
        {
          title: 'Web Scraper',
          description: 'Create a web scraping application',
          technologies: ['Python', 'BeautifulSoup', 'Requests'],
          difficulty: 'Intermediate'
        }
      ],
      certifications: ['Python Developer'],
      prerequisites: ['Basic computer skills'],
      learningOutcomes: [
        'Master Python programming',
        'Build practical applications',
        'Automate repetitive tasks',
        'Foundation for advanced topics'
      ]
    },
    uniqueSellingPoints: [
      'Most popular programming language',
      'Versatile applications',
      'Beginner-friendly syntax',
      'Gateway to AI/ML'
    ],
    industryRelevance: 'Used across all tech domains',
    marketingHook: 'Learn the Language That Powers Everything',
    genZAppeal: 'Python your way to programming greatness! 🐍💻'
  },

  // FREEMIUM COURSES (17-24)

  '17': {
    jobMarket: {
      averageSalary: '₹9-18 LPA',
      jobGrowth: '+30% (2024-2029)',
      openPositions: '40,000+',
      topCompanies: ['Google', 'Microsoft', 'Oracle', 'SAP', 'Salesforce', 'Adobe'],
      skills: ['Java', 'Spring Framework', 'Microservices', 'REST APIs', 'Database Integration'],
      careerPaths: ['Java Developer', 'Backend Developer', 'Enterprise Developer', 'Software Architect'],
      demandLevel: 'Very High',
      futureOutlook: 'Stable demand in enterprise applications'
    },
    content: {
      modules: [
        {
          title: 'Java Fundamentals',
          lessons: 20,
          duration: '4 weeks',
          topics: ['OOP Concepts', 'Collections', 'Exception Handling', 'Multithreading']
        },
        {
          title: 'Enterprise Java',
          lessons: 18,
          duration: '3 weeks',
          topics: ['Spring Framework', 'Spring Boot', 'JPA/Hibernate', 'REST APIs']
        }
      ],
      projects: [
        {
          title: 'E-commerce Backend',
          description: 'Build a scalable e-commerce backend system',
          technologies: ['Java', 'Spring Boot', 'MySQL', 'REST'],
          difficulty: 'Intermediate'
        }
      ],
      certifications: ['Java Developer Professional'],
      prerequisites: ['Basic programming concepts'],
      learningOutcomes: [
        'Master Java programming',
        'Build enterprise applications',
        'Implement REST APIs',
        'Work with databases'
      ]
    },
    uniqueSellingPoints: [
      'Enterprise-grade skills',
      'High-paying opportunities',
      'Stable career path',
      'Industry-standard framework'
    ],
    industryRelevance: 'Backbone of enterprise software development',
    marketingHook: 'Master the Language of Enterprise',
    genZAppeal: 'Java your way to enterprise success! ☕💼'
  },

  '18': {
    jobMarket: {
      averageSalary: '₹10-20 LPA',
      jobGrowth: '+35% (2024-2029)',
      openPositions: '30,000+',
      topCompanies: ['Microsoft', 'Stack Overflow', 'Unity', 'Xamarin', 'Epic Games', 'Ubisoft'],
      skills: ['C#', '.NET Framework', 'ASP.NET', 'Entity Framework', 'Azure'],
      careerPaths: ['.NET Developer', 'Full Stack Developer', 'Game Developer', 'Enterprise Developer'],
      demandLevel: 'High',
      futureOutlook: 'Growing with Microsoft ecosystem expansion'
    },
    content: {
      modules: [
        {
          title: 'C# Programming',
          lessons: 18,
          duration: '4 weeks',
          topics: ['C# Syntax', 'OOP', 'LINQ', 'Async Programming', 'Error Handling']
        },
        {
          title: '.NET Development',
          lessons: 16,
          duration: '3 weeks',
          topics: ['ASP.NET Core', 'Web APIs', 'Entity Framework', 'Authentication']
        }
      ],
      projects: [
        {
          title: 'Task Management API',
          description: 'Build a comprehensive task management system',
          technologies: ['C#', 'ASP.NET Core', 'SQL Server', 'Entity Framework'],
          difficulty: 'Intermediate'
        }
      ],
      certifications: ['.NET Developer'],
      prerequisites: ['Basic programming knowledge'],
      learningOutcomes: [
        'Master C# programming',
        'Build web applications',
        'Create REST APIs',
        'Implement authentication'
      ]
    },
    uniqueSellingPoints: [
      'Microsoft ecosystem',
      'Versatile applications',
      'Strong job market',
      'Modern framework'
    ],
    industryRelevance: 'Key technology for Microsoft-based solutions',
    marketingHook: 'Build with the Power of Microsoft',
    genZAppeal: 'C# your way to coding excellence! 🚀💻'
  },

  '19': {
    jobMarket: {
      averageSalary: '₹8-16 LPA',
      jobGrowth: '+25% (2024-2029)',
      openPositions: '35,000+',
      topCompanies: ['Facebook', 'Instagram', 'Airbnb', 'Uber', 'Tesla', 'Netflix'],
      skills: ['React Native', 'JavaScript', 'Mobile Development', 'Redux', 'Native Modules'],
      careerPaths: ['Mobile Developer', 'React Native Developer', 'Full Stack Developer', 'App Developer'],
      demandLevel: 'High',
      futureOutlook: 'Growing with mobile-first approach'
    },
    content: {
      modules: [
        {
          title: 'React Native Basics',
          lessons: 16,
          duration: '3 weeks',
          topics: ['Components', 'Navigation', 'State Management', 'Styling']
        },
        {
          title: 'Advanced Mobile Development',
          lessons: 14,
          duration: '3 weeks',
          topics: ['Native Modules', 'Performance', 'Testing', 'Deployment']
        }
      ],
      projects: [
        {
          title: 'Social Media App',
          description: 'Build a cross-platform social media application',
          technologies: ['React Native', 'Firebase', 'Redux', 'Expo'],
          difficulty: 'Intermediate'
        }
      ],
      certifications: ['Mobile App Developer'],
      prerequisites: ['JavaScript knowledge', 'React basics'],
      learningOutcomes: [
        'Build cross-platform apps',
        'Master React Native',
        'Implement native features',
        'Deploy to app stores'
      ]
    },
    uniqueSellingPoints: [
      'Cross-platform development',
      'Single codebase for iOS/Android',
      'High demand skill',
      'Cost-effective solution'
    ],
    industryRelevance: 'Essential for mobile app development',
    marketingHook: 'Build Once, Run Everywhere',
    genZAppeal: 'Create apps that live in everyone\'s pocket! 📱✨'
  },

  '20': {
    jobMarket: {
      averageSalary: '₹12-22 LPA',
      jobGrowth: '+40% (2024-2029)',
      openPositions: '25,000+',
      topCompanies: ['AWS', 'Microsoft', 'Google Cloud', 'Docker', 'Kubernetes', 'HashiCorp'],
      skills: ['Docker', 'Kubernetes', 'CI/CD', 'Jenkins', 'Git', 'Monitoring'],
      careerPaths: ['DevOps Engineer', 'Site Reliability Engineer', 'Platform Engineer', 'Cloud Engineer'],
      demandLevel: 'Very High',
      futureOutlook: 'Critical for modern software delivery'
    },
    content: {
      modules: [
        {
          title: 'DevOps Fundamentals',
          lessons: 14,
          duration: '3 weeks',
          topics: ['DevOps Culture', 'Version Control', 'CI/CD Concepts', 'Infrastructure as Code']
        },
        {
          title: 'Containerization & Orchestration',
          lessons: 16,
          duration: '3 weeks',
          topics: ['Docker', 'Kubernetes', 'Container Security', 'Monitoring']
        }
      ],
      projects: [
        {
          title: 'CI/CD Pipeline',
          description: 'Build an automated deployment pipeline',
          technologies: ['Jenkins', 'Docker', 'Kubernetes', 'Git'],
          difficulty: 'Intermediate'
        }
      ],
      certifications: ['DevOps Engineer'],
      prerequisites: ['Linux basics', 'Programming fundamentals'],
      learningOutcomes: [
        'Implement CI/CD pipelines',
        'Master containerization',
        'Orchestrate with Kubernetes',
        'Monitor applications'
      ]
    },
    uniqueSellingPoints: [
      'High-demand field',
      'Modern practices',
      'Automation focus',
      'Career growth potential'
    ],
    industryRelevance: 'Essential for modern software development',
    marketingHook: 'Automate Your Way to Success',
    genZAppeal: 'Deploy like a boss with zero downtime! 🚀⚙️'
  },

  '21': {
    jobMarket: {
      averageSalary: '₹15-28 LPA',
      jobGrowth: '+45% (2024-2029)',
      openPositions: '20,000+',
      topCompanies: ['CrowdStrike', 'Palo Alto', 'Cisco', 'IBM Security', 'Microsoft', 'Google'],
      skills: ['Ethical Hacking', 'Penetration Testing', 'Network Security', 'Vulnerability Assessment'],
      careerPaths: ['Ethical Hacker', 'Security Analyst', 'Penetration Tester', 'Security Consultant'],
      demandLevel: 'Extreme',
      futureOutlook: 'Critical with increasing cyber threats'
    },
    content: {
      modules: [
        {
          title: 'Security Fundamentals',
          lessons: 12,
          duration: '3 weeks',
          topics: ['Security Concepts', 'Threat Landscape', 'Risk Assessment', 'Compliance']
        },
        {
          title: 'Ethical Hacking Techniques',
          lessons: 18,
          duration: '4 weeks',
          topics: ['Reconnaissance', 'Vulnerability Scanning', 'Exploitation', 'Post-Exploitation']
        }
      ],
      projects: [
        {
          title: 'Penetration Testing Lab',
          description: 'Conduct ethical hacking on vulnerable systems',
          technologies: ['Kali Linux', 'Metasploit', 'Nmap', 'Burp Suite'],
          difficulty: 'Advanced'
        }
      ],
      certifications: ['Ethical Hacker Certified'],
      prerequisites: ['Networking basics', 'Linux fundamentals'],
      learningOutcomes: [
        'Perform ethical hacking',
        'Conduct security assessments',
        'Identify vulnerabilities',
        'Implement security measures'
      ]
    },
    uniqueSellingPoints: [
      'High-paying career',
      'Critical skill shortage',
      'Hands-on hacking labs',
      'Industry certifications'
    ],
    industryRelevance: 'Essential for protecting digital assets',
    marketingHook: 'Hack for Good, Secure the Future',
    genZAppeal: 'Become the white hat hero the world needs! 🎩🔒'
  },

  '22': {
    jobMarket: {
      averageSalary: '₹6-12 LPA',
      jobGrowth: '+20% (2024-2029)',
      openPositions: '50,000+',
      topCompanies: ['HubSpot', 'Mailchimp', 'Salesforce', 'Adobe', 'Google', 'Facebook'],
      skills: ['SEO', 'SEM', 'Social Media', 'Content Marketing', 'Analytics', 'Email Marketing'],
      careerPaths: ['Digital Marketer', 'SEO Specialist', 'Social Media Manager', 'Marketing Analyst'],
      demandLevel: 'High',
      futureOutlook: 'Growing with digital business transformation'
    },
    content: {
      modules: [
        {
          title: 'Digital Marketing Fundamentals',
          lessons: 15,
          duration: '3 weeks',
          topics: ['Marketing Strategy', 'Customer Journey', 'Brand Building', 'Content Strategy']
        },
        {
          title: 'Advanced Digital Tactics',
          lessons: 18,
          duration: '4 weeks',
          topics: ['SEO/SEM', 'Social Media Marketing', 'Email Marketing', 'Analytics']
        }
      ],
      projects: [
        {
          title: 'Digital Marketing Campaign',
          description: 'Launch a complete digital marketing campaign',
          technologies: ['Google Ads', 'Facebook Ads', 'Google Analytics', 'Mailchimp'],
          difficulty: 'Intermediate'
        }
      ],
      certifications: ['Digital Marketing Professional'],
      prerequisites: ['Basic computer skills', 'Marketing interest'],
      learningOutcomes: [
        'Plan marketing strategies',
        'Execute digital campaigns',
        'Analyze marketing data',
        'Optimize for ROI'
      ]
    },
    uniqueSellingPoints: [
      'Creative and analytical',
      'High ROI skills',
      'Freelance opportunities',
      'Business impact'
    ],
    industryRelevance: 'Essential for business growth in digital age',
    marketingHook: 'Market Like a Pro, Grow Like Crazy',
    genZAppeal: 'Make brands go viral and wallets go heavy! 💰📈'
  },

  '23': {
    jobMarket: {
      averageSalary: '₹8-15 LPA',
      jobGrowth: '+22% (2024-2029)',
      openPositions: '30,000+',
      topCompanies: ['Figma', 'Adobe', 'Sketch', 'InVision', 'Airbnb', 'Uber'],
      skills: ['UI Design', 'UX Research', 'Prototyping', 'User Testing', 'Design Systems'],
      careerPaths: ['UI/UX Designer', 'Product Designer', 'Design Lead', 'UX Researcher'],
      demandLevel: 'High',
      futureOutlook: 'Growing with focus on user experience'
    },
    content: {
      modules: [
        {
          title: 'Design Fundamentals',
          lessons: 16,
          duration: '3 weeks',
          topics: ['Design Principles', 'Color Theory', 'Typography', 'Layout']
        },
        {
          title: 'UX/UI Mastery',
          lessons: 20,
          duration: '4 weeks',
          topics: ['User Research', 'Wireframing', 'Prototyping', 'Usability Testing']
        }
      ],
      projects: [
        {
          title: 'Mobile App Design',
          description: 'Design a complete mobile app from research to prototype',
          technologies: ['Figma', 'Adobe XD', 'Principle', 'InVision'],
          difficulty: 'Intermediate'
        }
      ],
      certifications: ['UI/UX Designer'],
      prerequisites: ['Creative interest', 'Basic computer skills'],
      learningOutcomes: [
        'Design user interfaces',
        'Conduct user research',
        'Create prototypes',
        'Test usability'
      ]
    },
    uniqueSellingPoints: [
      'Creative and technical',
      'High impact on products',
      'Growing demand',
      'Portfolio-based career'
    ],
    industryRelevance: 'Critical for digital product success',
    marketingHook: 'Design Experiences That Users Love',
    genZAppeal: 'Design the interfaces everyone wants to use! 🎨✨'
  },

  '24': {
    jobMarket: {
      averageSalary: '₹10-18 LPA',
      jobGrowth: '+35% (2024-2029)',
      openPositions: '25,000+',
      topCompanies: ['UiPath', 'Automation Anywhere', 'Blue Prism', 'Microsoft', 'IBM', 'Accenture'],
      skills: ['RPA Tools', 'Process Analysis', 'Bot Development', 'Workflow Automation', 'AI Integration'],
      careerPaths: ['RPA Developer', 'Automation Engineer', 'Process Analyst', 'RPA Architect'],
      demandLevel: 'Very High',
      futureOutlook: 'Explosive growth with business automation needs'
    },
    content: {
      modules: [
        {
          title: 'RPA Fundamentals',
          lessons: 12,
          duration: '3 weeks',
          topics: ['RPA Concepts', 'Process Identification', 'Tool Overview', 'Best Practices']
        },
        {
          title: 'Bot Development',
          lessons: 16,
          duration: '4 weeks',
          topics: ['UiPath Studio', 'Workflow Design', 'Exception Handling', 'Deployment']
        }
      ],
      projects: [
        {
          title: 'Invoice Processing Bot',
          description: 'Automate invoice processing workflow',
          technologies: ['UiPath', 'Excel', 'Email', 'OCR'],
          difficulty: 'Intermediate'
        }
      ],
      certifications: ['RPA Developer'],
      prerequisites: ['Basic computer skills', 'Process understanding'],
      learningOutcomes: [
        'Identify automation opportunities',
        'Develop RPA bots',
        'Implement workflows',
        'Manage bot lifecycle'
      ]
    },
    uniqueSellingPoints: [
      'High ROI technology',
      'Immediate business impact',
      'Growing market',
      'Cross-industry applications'
    ],
    industryRelevance: 'Driving efficiency across all business processes',
    marketingHook: 'Automate Everything, Amplify Results',
    genZAppeal: 'Build bots that work while you sleep! 🤖💤'
  }
};
