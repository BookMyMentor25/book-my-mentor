import { useEffect } from 'react';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: 'website' | 'article' | 'product';
  structuredData?: object;
  noIndex?: boolean;
}

const DEFAULT_TITLE = "BookMyMentor | Learn Product Management, Lean Startup & Project Management Online";
const DEFAULT_DESCRIPTION = "Master Product Management, Lean Startup & Project Management from industry experts. Get certified online courses with 95% success rate, placement support & lifetime access. Trusted by 2000+ students.";
const DEFAULT_KEYWORDS = "product management course, lean startup certification, project management training, online mentorship, career growth, MBA skills, agile methodology, business strategy, startup courses, professional development, PM certification, scrum master, product owner";
const DEFAULT_IMAGE = "https://storage.googleapis.com/gpt-engineer-file-uploads/WpjUkmCyfBZxuMlsihjyEz9JUPv1/social-images/social-1764996556949-bookMyMentor_lnkdn.jpg";
const BASE_URL = "https://bookmymentor.com";

export const SEOHead = ({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  keywords = DEFAULT_KEYWORDS,
  canonicalUrl,
  ogImage = DEFAULT_IMAGE,
  ogType = 'website',
  structuredData,
  noIndex = false,
}: SEOHeadProps) => {
  useEffect(() => {
    // Update document title
    document.title = title;

    // Helper function to update or create meta tag
    const updateMetaTag = (selector: string, content: string, attribute = 'content') => {
      let element = document.querySelector(selector) as HTMLMetaElement;
      if (!element) {
        element = document.createElement('meta');
        const [attr, value] = selector.replace('[', '').replace(']', '').replace(/"/g, '').split('=');
        if (attr === 'name' || attr === 'property') {
          element.setAttribute(attr, value);
        }
        document.head.appendChild(element);
      }
      element.setAttribute(attribute, content);
    };

    // Update meta tags
    updateMetaTag('meta[name="description"]', description);
    updateMetaTag('meta[name="keywords"]', keywords);
    updateMetaTag('meta[name="robots"]', noIndex ? 'noindex, nofollow' : 'index, follow');

    // Open Graph tags
    updateMetaTag('meta[property="og:title"]', title);
    updateMetaTag('meta[property="og:description"]', description);
    updateMetaTag('meta[property="og:type"]', ogType);
    updateMetaTag('meta[property="og:image"]', ogImage);
    updateMetaTag('meta[property="og:url"]', canonicalUrl || window.location.href);
    updateMetaTag('meta[property="og:site_name"]', 'BookMyMentor');
    updateMetaTag('meta[property="og:locale"]', 'en_US');

    // Twitter tags
    updateMetaTag('meta[name="twitter:title"]', title);
    updateMetaTag('meta[name="twitter:description"]', description);
    updateMetaTag('meta[name="twitter:image"]', ogImage);
    updateMetaTag('meta[name="twitter:card"]', 'summary_large_image');

    // Update canonical URL
    let canonicalElement = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonicalElement) {
      canonicalElement = document.createElement('link');
      canonicalElement.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalElement);
    }
    canonicalElement.setAttribute('href', canonicalUrl || `${BASE_URL}${window.location.pathname}`);

    // Add structured data
    if (structuredData) {
      const existingScript = document.querySelector('script[data-seo="page-structured-data"]');
      if (existingScript) {
        existingScript.remove();
      }
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-seo', 'page-structured-data');
      script.textContent = JSON.stringify(structuredData);
      document.head.appendChild(script);
    }

    return () => {
      // Cleanup page-specific structured data on unmount
      const script = document.querySelector('script[data-seo="page-structured-data"]');
      if (script) {
        script.remove();
      }
    };
  }, [title, description, keywords, canonicalUrl, ogImage, ogType, structuredData, noIndex]);

  return null;
};

// Pre-built structured data generators
export const generateCourseSchema = (course: {
  name: string;
  description: string;
  provider?: string;
  price: number;
  currency?: string;
  rating?: number;
  reviewCount?: number;
  duration?: string;
  url?: string;
}) => ({
  "@context": "https://schema.org",
  "@type": "Course",
  "name": course.name,
  "description": course.description,
  "provider": {
    "@type": "Organization",
    "name": course.provider || "BookMyMentor",
    "sameAs": BASE_URL
  },
  "offers": {
    "@type": "Offer",
    "price": course.price,
    "priceCurrency": course.currency || "INR",
    "availability": "https://schema.org/InStock",
    "url": course.url || BASE_URL
  },
  ...(course.rating && {
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": course.rating,
      "reviewCount": course.reviewCount || 100,
      "bestRating": 5,
      "worstRating": 1
    }
  }),
  ...(course.duration && {
    "timeRequired": course.duration
  })
});

export const generateFAQSchema = (faqs: { question: string; answer: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": faqs.map(faq => ({
    "@type": "Question",
    "name": faq.question,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": faq.answer
    }
  }))
});

export const generateBreadcrumbSchema = (items: { name: string; url: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": items.map((item, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "name": item.name,
    "item": item.url
  }))
});

export const generateOrganizationSchema = () => ({
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  "name": "BookMyMentor",
  "url": BASE_URL,
  "logo": `${BASE_URL}/favicon.ico`,
  "description": "Premier online learning platform for Product Management, Lean Startup & Project Management certification courses",
  "foundingDate": "2020",
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+91-XXXXXXXXXX",
    "contactType": "customer service",
    "availableLanguage": ["English", "Hindi"]
  },
  "sameAs": [
    "https://www.linkedin.com/company/bookmymentor",
    "https://twitter.com/bookmymentor",
    "https://www.facebook.com/bookmymentor"
  ],
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.9",
    "reviewCount": "2000",
    "bestRating": "5",
    "worstRating": "1"
  }
});

export const generateWebsiteSchema = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "BookMyMentor",
  "url": BASE_URL,
  "description": DEFAULT_DESCRIPTION,
  "potentialAction": {
    "@type": "SearchAction",
    "target": `${BASE_URL}/ai-tools?search={search_term_string}`,
    "query-input": "required name=search_term_string"
  }
});

export default SEOHead;
