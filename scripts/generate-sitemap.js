import { SitemapStream, streamToPromise } from 'sitemap';
import { createWriteStream, writeFileSync } from 'fs';
import { resolve } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// ES module compatibility
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Import course data (we'll create a simple data structure for now)
const coursesData = {
  courses: [
    { courseId: 'data-science-mastery', courseDisplayName: 'Data Science Mastery', category: 'Data Science', image: '/assets/courses/data-science.jpg' },
    { courseId: 'ai-ml-bootcamp', courseDisplayName: 'AI/ML Bootcamp', category: 'AI/ML', image: '/assets/courses/ai-ml.jpg' },
    { courseId: 'generative-ai-pro', courseDisplayName: 'Generative AI Pro', category: 'Generative AI', image: '/assets/courses/gen-ai.jpg' },
    { courseId: 'python-programming', courseDisplayName: 'Python Programming', category: 'Programming', image: '/assets/courses/python.jpg' },
    { courseId: 'web-development', courseDisplayName: 'Full Stack Web Development', category: 'Web Development', image: '/assets/courses/web-dev.jpg' },
    { courseId: 'cloud-computing', courseDisplayName: 'Cloud Computing Essentials', category: 'Cloud Computing', image: '/assets/courses/cloud.jpg' }
  ]
};

async function generateSitemap() {
  const sitemap = new SitemapStream({ hostname: 'https://learnnect.com' });

  // Static pages with priority and change frequency
  const staticPages = [
    { url: '/', changefreq: 'daily', priority: 1.0 },
    { url: '/about', changefreq: 'monthly', priority: 0.8 },
    { url: '/contact', changefreq: 'monthly', priority: 0.7 },
    { url: '/courses', changefreq: 'weekly', priority: 0.9 },
    { url: '/blog', changefreq: 'daily', priority: 0.8 },
    { url: '/auth', changefreq: 'monthly', priority: 0.5 },
    { url: '/privacy', changefreq: 'yearly', priority: 0.3 },
    { url: '/terms', changefreq: 'yearly', priority: 0.3 },
  ];

  // Add static pages
  staticPages.forEach(page => {
    sitemap.write({
      url: page.url,
      changefreq: page.changefreq,
      priority: page.priority,
      lastmod: new Date().toISOString()
    });
  });

  // Add course pages
  if (coursesData && coursesData.courses) {
    coursesData.courses.forEach(course => {
      sitemap.write({
        url: `/courses/${course.courseId}`,
        changefreq: 'weekly',
        priority: 0.8,
        lastmod: new Date().toISOString(),
        img: course.image ? [{
          url: `https://learnnect.com${course.image}`,
          caption: course.courseDisplayName,
          title: course.courseDisplayName
        }] : undefined
      });
    });
  }

  // Add blog posts (you can expand this when you have blog data)
  const blogPosts = [
    { slug: 'ai-careers-2025', title: 'Top AI Careers in 2025', date: '2024-12-20' },
    { slug: 'machine-learning-guide', title: 'Complete Machine Learning Guide', date: '2024-12-18' },
    { slug: 'data-science-roadmap', title: 'Data Science Career Roadmap', date: '2024-12-15' },
    { slug: 'generative-ai-future', title: 'Future of Generative AI', date: '2024-12-12' },
    { slug: 'python-for-beginners', title: 'Python Programming for Beginners', date: '2024-12-10' }
  ];

  blogPosts.forEach(post => {
    sitemap.write({
      url: `/blog/${post.slug}`,
      changefreq: 'monthly',
      priority: 0.7,
      lastmod: post.date
    });
  });

  // Course category pages
  const categories = ['premium', 'foundation', 'free', 'ai-ml', 'data-science', 'programming'];
  categories.forEach(category => {
    sitemap.write({
      url: `/courses/category/${category}`,
      changefreq: 'weekly',
      priority: 0.6,
      lastmod: new Date().toISOString()
    });
  });

  sitemap.end();

  // Write sitemap to public directory
  const sitemapPath = resolve(__dirname, '../public/sitemap.xml');
  const writeStream = createWriteStream(sitemapPath);
  
  try {
    const sitemapXML = await streamToPromise(sitemap);
    writeStream.write(sitemapXML);
    writeStream.end();
    
    console.log('✅ Sitemap generated successfully at:', sitemapPath);
    console.log('📊 Total URLs:', staticPages.length + (coursesData?.courses?.length || 0) + blogPosts.length + categories.length);
  } catch (error) {
    console.error('❌ Error generating sitemap:', error);
  }
}

// Generate robots.txt as well
function generateRobotsTxt() {
  const robotsContent = `User-agent: *
Allow: /

# Allow all search engines to crawl all pages
Allow: /courses/
Allow: /blog/
Allow: /about
Allow: /contact
Allow: /auth

# Disallow admin and private areas
Disallow: /dashboard/
Disallow: /admin/
Disallow: /api/
Disallow: /settings/
Disallow: /_next/
Disallow: /node_modules/

# Sitemap location
Sitemap: https://learnnect.com/sitemap.xml

# Crawl delay (optional - helps with server load)
Crawl-delay: 1`;

  const robotsPath = resolve(__dirname, '../public/robots.txt');
  writeFileSync(robotsPath, robotsContent);
  console.log('✅ robots.txt generated successfully at:', robotsPath);
}

// Run the generators
generateSitemap();
generateRobotsTxt();

export { generateSitemap, generateRobotsTxt };
