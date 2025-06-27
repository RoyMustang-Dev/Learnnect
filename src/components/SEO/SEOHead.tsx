import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'course' | 'blog';
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  courseData?: {
    price?: number;
    currency?: string;
    category?: string;
    level?: string;
    duration?: string;
    instructor?: string;
  };
  structuredData?: object;
}

const SEOHead: React.FC<SEOProps> = ({
  title = 'Learnnect | Master AI, ML, Data Science & Generative AI',
  description = 'Transform your career with Learnnect\'s industry-ready courses in Data Science, AI/ML, and Generative AI. Join 10,000+ successful learners with 95% placement rate.',
  keywords = 'Data Science course, AI course, ML course, Generative AI course, online learning, career transformation, tech skills, programming, Python, machine learning',
  image = 'https://learnnect.com/assets/learnnect-og-image.png',
  url = 'https://learnnect.com',
  type = 'website',
  author = 'Learnnect Team',
  publishedTime,
  modifiedTime,
  courseData,
  structuredData
}) => {
  // Generate structured data for courses
  const generateCourseStructuredData = () => {
    if (!courseData) return null;

    return {
      "@context": "https://schema.org",
      "@type": "Course",
      "name": title,
      "description": description,
      "provider": {
        "@type": "Organization",
        "name": "Learnnect",
        "url": "https://learnnect.com",
        "logo": "https://learnnect.com/assets/learnnect-logo_gradient.png"
      },
      "offers": courseData.price ? {
        "@type": "Offer",
        "price": courseData.price,
        "priceCurrency": courseData.currency || "INR",
        "availability": "https://schema.org/InStock"
      } : undefined,
      "courseMode": "online",
      "educationalLevel": courseData.level,
      "timeRequired": courseData.duration,
      "instructor": courseData.instructor ? {
        "@type": "Person",
        "name": courseData.instructor
      } : undefined,
      "about": courseData.category,
      "url": url,
      "image": image
    };
  };

  // Generate structured data for blog posts
  const generateBlogStructuredData = () => {
    if (type !== 'article') return null;

    return {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": title,
      "description": description,
      "image": image,
      "author": {
        "@type": "Person",
        "name": author
      },
      "publisher": {
        "@type": "Organization",
        "name": "Learnnect",
        "logo": {
          "@type": "ImageObject",
          "url": "https://learnnect.com/assets/learnnect-logo_gradient.png"
        }
      },
      "datePublished": publishedTime,
      "dateModified": modifiedTime || publishedTime,
      "url": url,
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": url
      }
    };
  };

  // Generate organization structured data
  const generateOrganizationStructuredData = () => {
    return {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Learnnect",
      "alternateName": "Learnnect EdTech Platform",
      "url": "https://learnnect.com",
      "logo": "https://learnnect.com/assets/learnnect-logo_gradient.png",
      "description": "Leading EdTech platform for AI, ML, Data Science and Generative AI courses with industry-ready curriculum and 95% placement rate.",
      "foundingDate": "2024",
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+91-7007788926",
        "contactType": "customer service",
        "email": "support@learnnect.com",
        "availableLanguage": ["English", "Hindi"]
      },
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Wave City Sector 2",
        "addressLocality": "Ghaziabad",
        "postalCode": "201002",
        "addressCountry": "IN"
      },
      "sameAs": [
        "https://facebook.com/learnnect",
        "https://x.com/learnnect",
        "https://instagram.com/learnnect",
        "https://linkedin.com/company/learnnect",
        "https://youtube.com/@learnnect"
      ]
    };
  };

  const finalStructuredData = structuredData || 
    generateCourseStructuredData() || 
    generateBlogStructuredData() || 
    generateOrganizationStructuredData();

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      <link rel="canonical" href={url} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content="Learnnect" />
      <meta property="og:locale" content="en_US" />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />
      <meta property="twitter:site" content="@learnnect" />
      <meta property="twitter:creator" content="@learnnect" />

      {/* Article specific meta tags */}
      {type === 'article' && publishedTime && (
        <>
          <meta property="article:published_time" content={publishedTime} />
          <meta property="article:author" content={author} />
          {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
        </>
      )}

      {/* Additional SEO Meta Tags */}
      <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      <meta name="googlebot" content="index, follow" />
      <meta name="bingbot" content="index, follow" />
      
      {/* Language and Region */}
      <meta httpEquiv="content-language" content="en-US" />
      <meta name="geo.region" content="IN" />
      <meta name="geo.placename" content="India" />

      {/* Mobile Optimization */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="format-detection" content="telephone=no" />

      {/* Structured Data */}
      {finalStructuredData && (
        <script type="application/ld+json">
          {JSON.stringify(finalStructuredData)}
        </script>
      )}

      {/* Preconnect to external domains for performance */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      
      {/* Favicon and App Icons */}
      <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="manifest" href="/site.webmanifest" />
    </Helmet>
  );
};

export default SEOHead;
