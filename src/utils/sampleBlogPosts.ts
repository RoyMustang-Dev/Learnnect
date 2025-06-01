// Sample blog posts for testing and initial content
export const sampleBlogPosts = [
  {
    title: "Getting Started with Data Science in 2024",
    slug: "getting-started-data-science-2024",
    excerpt: "Learn the essential skills and tools you need to begin your journey in data science. From Python basics to machine learning fundamentals.",
    content: `# Getting Started with Data Science in 2024

Data science has become one of the most sought-after fields in technology. Whether you're a complete beginner or looking to transition from another field, this guide will help you understand what it takes to become a data scientist.

## What is Data Science?

Data science is an interdisciplinary field that uses scientific methods, processes, algorithms, and systems to extract knowledge and insights from structured and unstructured data.

## Essential Skills

### 1. Programming Languages
- **Python**: The most popular language for data science
- **R**: Excellent for statistical analysis
- **SQL**: Essential for database management

### 2. Mathematics and Statistics
- Linear algebra
- Calculus
- Probability and statistics
- Hypothesis testing

### 3. Machine Learning
- Supervised learning
- Unsupervised learning
- Deep learning basics

## Getting Started

1. **Learn Python basics**
2. **Master pandas and numpy**
3. **Understand data visualization with matplotlib/seaborn**
4. **Practice with real datasets**
5. **Build projects for your portfolio**

## Conclusion

Data science is an exciting field with endless opportunities. Start with the basics, practice regularly, and don't be afraid to work on real projects. The journey may be challenging, but the rewards are worth it!`,
    author: "Dr. Sarah Johnson",
    category: "Tutorial",
    tags: ["data-science", "beginner", "python", "career"],
    featuredImage: "https://images.pexels.com/photos/577585/pexels-photo-577585.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    status: "published" as const,
    readTime: 8
  },
  {
    title: "Machine Learning Algorithms Explained",
    slug: "machine-learning-algorithms-explained",
    excerpt: "A comprehensive guide to understanding the most important machine learning algorithms and when to use them.",
    content: `# Machine Learning Algorithms Explained

Machine learning algorithms are the backbone of artificial intelligence. Understanding when and how to use different algorithms is crucial for any data scientist.

## Supervised Learning Algorithms

### Linear Regression
Perfect for predicting continuous values when there's a linear relationship between features and target.

**Use cases:**
- Predicting house prices
- Sales forecasting
- Risk assessment

### Decision Trees
Easy to interpret and visualize, great for both classification and regression.

**Advantages:**
- No assumptions about data distribution
- Handles both numerical and categorical data
- Easy to interpret

### Random Forest
An ensemble method that combines multiple decision trees for better accuracy.

**Benefits:**
- Reduces overfitting
- Handles missing values
- Provides feature importance

## Unsupervised Learning

### K-Means Clustering
Groups similar data points together without labeled examples.

**Applications:**
- Customer segmentation
- Market research
- Image segmentation

### Principal Component Analysis (PCA)
Reduces dimensionality while preserving important information.

## Deep Learning

### Neural Networks
Inspired by the human brain, capable of learning complex patterns.

**Types:**
- Feedforward networks
- Convolutional Neural Networks (CNNs)
- Recurrent Neural Networks (RNNs)

## Choosing the Right Algorithm

Consider these factors:
1. **Problem type** (classification, regression, clustering)
2. **Data size** and quality
3. **Interpretability** requirements
4. **Training time** constraints
5. **Accuracy** needs

## Conclusion

Each algorithm has its strengths and weaknesses. The key is understanding your data and problem requirements to make the best choice.`,
    author: "Prof. David Chen",
    category: "Programming",
    tags: ["machine-learning", "algorithms", "ai", "tutorial"],
    featuredImage: "https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    status: "published" as const,
    readTime: 12
  },
  {
    title: "The Future of Generative AI",
    slug: "future-of-generative-ai",
    excerpt: "Exploring the latest developments in generative AI and what they mean for the future of technology and creativity.",
    content: `# The Future of Generative AI

Generative Artificial Intelligence has revolutionized how we create content, from text and images to code and music. Let's explore what the future holds for this transformative technology.

## Current State of Generative AI

### Text Generation
- **Large Language Models** like GPT-4, Claude, and Gemini
- **Code generation** tools like GitHub Copilot
- **Content creation** for marketing and writing

### Image Generation
- **DALL-E 3** for photorealistic images
- **Midjourney** for artistic creations
- **Stable Diffusion** for open-source generation

### Video and Audio
- **Sora** for video generation
- **ElevenLabs** for voice synthesis
- **Runway ML** for video editing

## Emerging Trends

### 1. Multimodal AI
Future AI systems will seamlessly work across text, images, audio, and video.

### 2. Personalization
AI will adapt to individual preferences and styles.

### 3. Real-time Generation
Instant creation of content as you think or speak.

### 4. Collaborative AI
AI as a creative partner rather than just a tool.

## Industry Applications

### Education
- Personalized learning materials
- Interactive tutoring systems
- Automated assessment tools

### Healthcare
- Drug discovery acceleration
- Medical image analysis
- Personalized treatment plans

### Entertainment
- Interactive storytelling
- Procedural game content
- Virtual actors and musicians

## Challenges and Considerations

### Ethical Concerns
- **Deepfakes** and misinformation
- **Copyright** and intellectual property
- **Job displacement** in creative industries

### Technical Limitations
- **Hallucinations** and accuracy issues
- **Computational requirements**
- **Data bias** and fairness

## The Road Ahead

The future of generative AI is bright but requires careful consideration of:

1. **Responsible development**
2. **Regulatory frameworks**
3. **Human-AI collaboration**
4. **Accessibility and democratization**

## Conclusion

Generative AI will continue to transform industries and creative processes. Success will depend on balancing innovation with responsibility, ensuring these powerful tools benefit humanity as a whole.`,
    author: "Dr. Michael Lee",
    category: "Technology",
    tags: ["generative-ai", "future", "innovation", "ethics"],
    featuredImage: "https://images.pexels.com/photos/8386434/pexels-photo-8386434.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    status: "published" as const,
    readTime: 10
  },
  {
    title: "Python Best Practices for Data Scientists",
    slug: "python-best-practices-data-scientists",
    excerpt: "Essential Python coding practices that every data scientist should follow to write clean, efficient, and maintainable code.",
    content: `# Python Best Practices for Data Scientists

Writing clean, efficient Python code is crucial for data science projects. Here are the essential best practices every data scientist should follow.

## Code Organization

### 1. Use Virtual Environments
Always isolate your project dependencies:

\`\`\`bash
python -m venv myproject
source myproject/bin/activate  # On Windows: myproject\\Scripts\\activate
pip install -r requirements.txt
\`\`\`

### 2. Project Structure
Organize your code logically:

\`\`\`
project/
├── data/
│   ├── raw/
│   └── processed/
├── notebooks/
├── src/
│   ├── data/
│   ├── features/
│   └── models/
├── tests/
└── requirements.txt
\`\`\`

## Coding Standards

### 1. Follow PEP 8
Use consistent formatting and naming conventions:

\`\`\`python
# Good
def calculate_mean_squared_error(y_true, y_pred):
    return np.mean((y_true - y_pred) ** 2)

# Bad
def calcMSE(yt,yp):
    return np.mean((yt-yp)**2)
\`\`\`

### 2. Use Type Hints
Make your code more readable and catch errors early:

\`\`\`python
from typing import List, Tuple
import pandas as pd

def preprocess_data(df: pd.DataFrame) -> Tuple[pd.DataFrame, List[str]]:
    # Your preprocessing logic here
    return processed_df, feature_names
\`\`\`

## Data Handling

### 1. Use Pandas Efficiently
\`\`\`python
# Good - vectorized operations
df['new_column'] = df['column1'] * df['column2']

# Bad - iterating through rows
for index, row in df.iterrows():
    df.at[index, 'new_column'] = row['column1'] * row['column2']
\`\`\`

### 2. Handle Missing Data Explicitly
\`\`\`python
# Check for missing values
print(df.isnull().sum())

# Handle missing values appropriately
df['column'].fillna(df['column'].median(), inplace=True)
\`\`\`

## Error Handling

### 1. Use Try-Except Blocks
\`\`\`python
try:
    model = joblib.load('model.pkl')
except FileNotFoundError:
    print("Model file not found. Training new model...")
    model = train_new_model()
\`\`\`

### 2. Validate Input Data
\`\`\`python
def validate_input(df: pd.DataFrame) -> None:
    assert not df.empty, "DataFrame cannot be empty"
    assert 'target' in df.columns, "Target column missing"
    assert df['target'].dtype in ['int64', 'float64'], "Target must be numeric"
\`\`\`

## Performance Optimization

### 1. Use NumPy for Numerical Operations
\`\`\`python
# Fast NumPy operations
import numpy as np
result = np.dot(matrix1, matrix2)

# Avoid pure Python loops for large datasets
\`\`\`

### 2. Profile Your Code
\`\`\`python
import cProfile
cProfile.run('your_function()')
\`\`\`

## Documentation

### 1. Write Clear Docstrings
\`\`\`python
def train_model(X: pd.DataFrame, y: pd.Series) -> object:
    """
    Train a machine learning model.
    
    Args:
        X: Feature matrix
        y: Target variable
        
    Returns:
        Trained model object
        
    Raises:
        ValueError: If X and y have different lengths
    """
    pass
\`\`\`

### 2. Use Jupyter Notebooks Wisely
- Keep notebooks clean and well-documented
- Convert important code to modules
- Use meaningful cell outputs

## Testing

### 1. Write Unit Tests
\`\`\`python
import unittest

class TestDataPreprocessing(unittest.TestCase):
    def test_remove_outliers(self):
        # Test your functions
        pass
\`\`\`

### 2. Test Data Pipeline
Ensure your data processing steps work correctly with different inputs.

## Conclusion

Following these best practices will make your data science code more reliable, maintainable, and collaborative. Start implementing them gradually in your projects!`,
    author: "Dr. Emily Rodriguez",
    category: "Programming",
    tags: ["python", "best-practices", "data-science", "coding"],
    featuredImage: "https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    status: "published" as const,
    readTime: 15
  }
];

// Function to add sample posts to Firebase (for testing)
export const addSamplePosts = async () => {
  const { blogService } = await import('../services/blogService');
  
  try {
    for (const post of sampleBlogPosts) {
      await blogService.createPost({
        ...post,
        publishedAt: new Date(),
        views: Math.floor(Math.random() * 1000),
        likes: Math.floor(Math.random() * 100)
      });
    }
    console.log('Sample posts added successfully!');
  } catch (error) {
    console.error('Error adding sample posts:', error);
  }
};
