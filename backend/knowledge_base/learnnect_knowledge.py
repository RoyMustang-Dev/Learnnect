"""
Learnnect Knowledge Base - ChromaDB Implementation
Dynamic knowledge base that updates based on website changes
"""

import chromadb
from chromadb.config import Settings
import json
import uuid
from datetime import datetime
from typing import List, Dict, Any, Optional
from sentence_transformers import SentenceTransformer
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class LearnnectKnowledgeBase:
    def __init__(self, persist_directory: str = "./chroma_db"):
        """Initialize ChromaDB with Learnnect knowledge"""
        self.client = chromadb.PersistentClient(
            path=persist_directory,
            settings=Settings(
                anonymized_telemetry=False,
                allow_reset=True
            )
        )
        
        # Initialize embedding model
        self.embedding_model = SentenceTransformer('all-MiniLM-L6-v2')
        
        # Create or get collection
        self.collection = self.client.get_or_create_collection(
            name="learnnect_knowledge",
            metadata={"description": "Learnnect EdTech Platform Knowledge Base"}
        )
        
        # Initialize knowledge base
        self.initialize_knowledge_base()
    
    def initialize_knowledge_base(self):
        """Initialize the knowledge base with Learnnect data"""
        logger.info("🚀 Initializing Learnnect Knowledge Base...")
        
        # Check if knowledge base is already populated
        if self.collection.count() > 0:
            logger.info(f"📚 Knowledge base already contains {self.collection.count()} documents")
            return
        
        # Add all knowledge categories
        self.add_course_knowledge()
        self.add_pricing_knowledge()
        self.add_company_knowledge()
        self.add_contact_knowledge()
        self.add_features_knowledge()
        self.add_support_knowledge()
        
        logger.info(f"✅ Knowledge base initialized with {self.collection.count()} documents")
    
    def add_course_knowledge(self):
        """Add comprehensive course information"""
        courses_data = [
            {
                "id": "course_data_science_intro",
                "title": "Introduction to Data Science",
                "instructor": "Dr. Sarah Johnson",
                "price": 0,
                "category": "Data Science",
                "level": "Beginner",
                "duration": "6 weeks",
                "description": "Learn the fundamentals of data science, including data visualization, statistical analysis, and machine learning basics.",
                "content": """
                Introduction to Data Science Course Details:
                - Instructor: Dr. Sarah Johnson (Expert Data Scientist)
                - Price: FREE (Perfect for beginners!)
                - Duration: 6 weeks of comprehensive learning
                - Level: Beginner-friendly
                - Category: Data Science Fundamentals
                
                What You'll Learn:
                • Data visualization techniques and tools
                • Statistical analysis and interpretation
                • Machine learning basics and algorithms
                • Python programming for data science
                • Data cleaning and preprocessing
                • Real-world project implementation
                
                Perfect for: Complete beginners wanting to enter data science
                Prerequisites: Basic computer skills, no programming experience required
                Certificate: Yes, upon completion
                """,
                "metadata": {
                    "source": "courses",
                    "type": "course_info",
                    "category": "data_science",
                    "level": "beginner",
                    "price_range": "free"
                }
            },
            {
                "id": "course_generative_ai",
                "title": "Generative AI with Python",
                "instructor": "Dr. Michael Lee",
                "price": 99.99,
                "category": "Generative AI",
                "level": "Advanced",
                "duration": "10 weeks",
                "description": "Explore the exciting world of generative AI, including GANs, VAEs, and diffusion models to create innovative AI-generated content.",
                "content": """
                Generative AI with Python - Advanced Course:
                - Instructor: Dr. Michael Lee (AI Research Scientist)
                - Price: $99.99 (Premium advanced course)
                - Duration: 10 weeks of intensive learning
                - Level: Advanced (requires Python knowledge)
                - Category: Generative AI & Machine Learning
                
                Course Overview:
                This comprehensive course takes you from basic concepts to advanced techniques in generative models.
                You'll learn mathematics and programming skills to build generative models from scratch.
                
                What You'll Master:
                • Generative Adversarial Networks (GANs)
                • Variational Autoencoders (VAEs)
                • Diffusion Models and Stable Diffusion
                • Text generation with GPT models
                • Image generation and manipulation
                • Music and audio generation
                • Real-world AI applications
                
                Prerequisites:
                • Intermediate Python programming skills
                • Basic understanding of neural networks
                • Linear algebra and calculus knowledge
                
                Outcomes: Build models that generate realistic images, text, music, and more
                Enrollment: 1,253 students | Rating: 4.8/5 | Reviews: 284
                """,
                "metadata": {
                    "source": "courses",
                    "type": "course_info",
                    "category": "generative_ai",
                    "level": "advanced",
                    "price_range": "premium"
                }
            }
        ]
        
        for course in courses_data:
            self.add_document(
                content=course["content"],
                metadata=course["metadata"],
                doc_id=course["id"]
            )
    
    def add_pricing_knowledge(self):
        """Add pricing and payment information"""
        pricing_data = [
            {
                "id": "pricing_general",
                "content": """
                Learnnect Pricing & Payment Options:
                
                COURSE PRICING:
                • Introduction to Data Science: FREE (Perfect starter course!)
                • Generative AI with Python: $99.99 (Advanced level)
                • Machine Learning Fundamentals: $79.99
                • Web Development Bootcamp: $149.99
                • AI/ML Specialization: $199.99
                
                PAYMENT PLANS AVAILABLE:
                ✅ Full Payment (5% discount applied automatically)
                ✅ 3-Month Payment Plan (No interest, split into 3 equal payments)
                ✅ 6-Month Payment Plan (Small processing fee applies)
                
                WHAT'S INCLUDED IN ALL COURSES:
                • Lifetime access to course materials
                • 1-on-1 mentorship sessions
                • Real-world hands-on projects
                • Job placement assistance
                • 24/7 community support
                • Certificate of completion
                • Regular content updates
                
                SPECIAL OFFERS:
                • Student Discount: 20% off with valid student ID
                • Early Bird: 15% off if enrolled 2 weeks before course start
                • Bundle Deals: Save 30% when purchasing 3+ courses
                
                REFUND POLICY:
                30-day money-back guarantee if not satisfied
                """,
                "metadata": {
                    "source": "pricing",
                    "type": "pricing_info",
                    "category": "payment_plans"
                }
            }
        ]
        
        for item in pricing_data:
            self.add_document(
                content=item["content"],
                metadata=item["metadata"],
                doc_id=item["id"]
            )
    
    def add_company_knowledge(self):
        """Add company information and mission"""
        company_data = [
            {
                "id": "about_learnnect",
                "content": """
                About Learnnect - Transforming Education for the Future
                
                MISSION:
                Learnnect is born from a vision to democratize cutting-edge technology education. 
                We don't just teach—we transform careers and lives.
                
                VISION:
                In a world where AI and Data Science skills are becoming essential, we're creating 
                the bridge between curiosity and expertise, between learning and earning.
                
                WHAT MAKES US DIFFERENT:
                • Industry-aligned curriculum designed by experts
                • Real-world projects with actual companies
                • Personalized learning paths for every student
                • 24/7 mentorship and support system
                • Job placement assistance with 90% success rate
                • Cutting-edge technology and tools
                
                OUR VALUES:
                ✨ Innovation: Always at the forefront of technology
                🚀 Excellence: Highest quality education standards
                💪 Empowerment: Building confident, skilled professionals
                🌟 Community: Supportive learning environment
                ⚡ Results: Focus on real career outcomes
                
                ACHIEVEMENTS:
                • 10,000+ students trained successfully
                • 90% job placement rate within 6 months
                • 500+ hiring partner companies
                • 4.8/5 average student satisfaction rating
                • Featured in TechCrunch, Forbes, and Wired
                
                TAGLINE: "Learn, Connect, Succeed!!"
                """,
                "metadata": {
                    "source": "about",
                    "type": "company_info",
                    "category": "mission_vision"
                }
            }
        ]
        
        for item in company_data:
            self.add_document(
                content=item["content"],
                metadata=item["metadata"],
                doc_id=item["id"]
            )
    
    def add_contact_knowledge(self):
        """Add contact and support information"""
        contact_data = [
            {
                "id": "contact_info",
                "content": """
                Contact Learnnect - We're Here to Help!
                
                CONTACT INFORMATION:
                📧 Email: support@learnnect.com
                📞 Phone: +1 (555) 123-4567
                🕒 Hours: Monday-Friday, 8am to 5pm PST
                
                SUPPORT CHANNELS:
                • Live Chat: Available 24/7 on website
                • Email Support: Response within 2 hours
                • Phone Support: Immediate assistance during business hours
                • Community Forum: Peer-to-peer help and discussions
                
                OFFICE LOCATIONS:
                🏢 Headquarters: San Francisco, CA
                🌍 Remote Team: Global presence with local support
                
                SOCIAL MEDIA:
                • Twitter: @learnnect
                • LinkedIn: /company/learnnect
                • YouTube: /learnnect-education
                • Instagram: @learnnect_official
                
                FOR SPECIFIC INQUIRIES:
                • Course Questions: courses@learnnect.com
                • Technical Support: tech@learnnect.com
                • Partnerships: partnerships@learnnect.com
                • Media Inquiries: media@learnnect.com
                
                RESPONSE TIMES:
                • Live Chat: Instant
                • Email: Within 2 hours
                • Phone: Immediate during business hours
                • Complex Issues: Within 24 hours
                """,
                "metadata": {
                    "source": "contact",
                    "type": "contact_info",
                    "category": "support_channels"
                }
            }
        ]
        
        for item in contact_data:
            self.add_document(
                content=item["content"],
                metadata=item["metadata"],
                doc_id=item["id"]
            )
    
    def add_features_knowledge(self):
        """Add platform features and benefits"""
        features_data = [
            {
                "id": "platform_features",
                "content": """
                Learnnect Platform Features - Why Choose Us?
                
                🎓 EXPERT INSTRUCTORS:
                • Industry professionals with years of experience
                • Academic experts from top universities
                • Regular guest lectures from tech leaders
                • Personalized feedback and guidance
                
                🛠️ HANDS-ON PROJECTS:
                • Real-world projects that build your portfolio
                • Industry-standard tools and technologies
                • Collaborative team projects
                • Capstone projects with actual companies
                
                ⏰ FLEXIBLE LEARNING:
                • Study at your own pace
                • Lifetime access to course materials
                • Mobile-friendly platform
                • Offline content download available
                
                🎯 CAREER SUPPORT:
                • Job placement assistance (90% success rate)
                • Resume and portfolio review
                • Interview preparation and mock interviews
                • Networking events with industry professionals
                
                💻 CUTTING-EDGE TECHNOLOGY:
                • Latest tools and frameworks
                • Cloud-based development environments
                • AI-powered learning recommendations
                • Interactive coding environments
                
                🌟 COMMUNITY & SUPPORT:
                • 24/7 technical support
                • Active student community forums
                • Study groups and peer learning
                • Alumni network access
                
                📊 LEARNING ANALYTICS:
                • Progress tracking and insights
                • Personalized learning paths
                • Skill gap analysis
                • Performance benchmarking
                """,
                "metadata": {
                    "source": "features",
                    "type": "platform_features",
                    "category": "benefits"
                }
            }
        ]
        
        for item in features_data:
            self.add_document(
                content=item["content"],
                metadata=item["metadata"],
                doc_id=item["id"]
            )
    
    def add_support_knowledge(self):
        """Add support and FAQ information"""
        support_data = [
            {
                "id": "support_faq",
                "content": """
                Learnnect Support & Frequently Asked Questions
                
                GETTING STARTED:
                Q: How do I enroll in a course?
                A: Simply browse our courses, click "Enroll Now", and complete the payment process. You'll get instant access!
                
                Q: Do I need prior experience?
                A: Our beginner courses require no prior experience. Advanced courses have prerequisites listed in the course description.
                
                Q: What if I can't keep up with the pace?
                A: No worries! You have lifetime access, so learn at your own pace. Our mentors are also available for extra support.
                
                TECHNICAL SUPPORT:
                Q: What if I have technical issues?
                A: Contact our 24/7 tech support at tech@learnnect.com or use live chat for immediate assistance.
                
                Q: Can I access courses on mobile?
                A: Yes! Our platform is fully mobile-responsive and we have iOS/Android apps coming soon.
                
                PAYMENT & REFUNDS:
                Q: What payment methods do you accept?
                A: We accept all major credit cards, PayPal, and offer payment plans for expensive courses.
                
                Q: What's your refund policy?
                A: 30-day money-back guarantee if you're not satisfied with the course quality.
                
                CERTIFICATES & CAREER:
                Q: Do I get a certificate?
                A: Yes! All courses include a certificate of completion that you can add to LinkedIn and your resume.
                
                Q: Do you help with job placement?
                A: Absolutely! We have a 90% job placement success rate and work with 500+ hiring partners.
                
                COMMUNITY & LEARNING:
                Q: Can I interact with other students?
                A: Yes! Join our community forums, study groups, and attend virtual networking events.
                
                Q: How long do I have access to course materials?
                A: Lifetime access! Once enrolled, the content is yours forever, including all future updates.
                """,
                "metadata": {
                    "source": "support",
                    "type": "faq",
                    "category": "help"
                }
            }
        ]
        
        for item in support_data:
            self.add_document(
                content=item["content"],
                metadata=item["metadata"],
                doc_id=item["id"]
            )
    
    def add_document(self, content: str, metadata: Dict[str, Any], doc_id: Optional[str] = None):
        """Add a document to the knowledge base"""
        if doc_id is None:
            doc_id = str(uuid.uuid4())
        
        # Add timestamp
        metadata["timestamp"] = datetime.now().isoformat()
        
        self.collection.add(
            documents=[content],
            metadatas=[metadata],
            ids=[doc_id]
        )
        
        logger.info(f"📄 Added document: {doc_id}")
    
    def search_knowledge(self, query: str, n_results: int = 5, filter_metadata: Optional[Dict] = None) -> List[Dict]:
        """Search the knowledge base"""
        try:
            results = self.collection.query(
                query_texts=[query],
                n_results=n_results,
                where=filter_metadata
            )
            
            # Format results
            formatted_results = []
            for i in range(len(results['documents'][0])):
                formatted_results.append({
                    'content': results['documents'][0][i],
                    'metadata': results['metadatas'][0][i],
                    'distance': results['distances'][0][i] if 'distances' in results else None,
                    'id': results['ids'][0][i]
                })
            
            return formatted_results
            
        except Exception as e:
            logger.error(f"❌ Search error: {e}")
            return []
    
    def update_knowledge(self, doc_id: str, content: str, metadata: Dict[str, Any]):
        """Update existing knowledge"""
        metadata["updated_at"] = datetime.now().isoformat()
        
        self.collection.update(
            ids=[doc_id],
            documents=[content],
            metadatas=[metadata]
        )
        
        logger.info(f"🔄 Updated document: {doc_id}")
    
    def get_knowledge_stats(self) -> Dict[str, Any]:
        """Get knowledge base statistics"""
        total_docs = self.collection.count()
        
        # Get documents by category
        categories = {}
        all_docs = self.collection.get()
        
        for metadata in all_docs['metadatas']:
            category = metadata.get('category', 'unknown')
            categories[category] = categories.get(category, 0) + 1
        
        return {
            'total_documents': total_docs,
            'categories': categories,
            'last_updated': datetime.now().isoformat()
        }

# Initialize knowledge base
if __name__ == "__main__":
    kb = LearnnectKnowledgeBase()
    stats = kb.get_knowledge_stats()
    print(f"📊 Knowledge Base Stats: {json.dumps(stats, indent=2)}")
