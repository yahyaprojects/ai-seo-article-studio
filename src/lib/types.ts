export interface ArticleSchema {
  "@context": "https://schema.org";
  "@type": "Article";
  headline: string;
  description: string;
  author: {
    "@type": "Organization";
    name: string;
  };
  datePublished: string;
  keywords: string[];
}

export interface SeoMetadata {
  title: string;
  metaDescription: string;
  slug: string;
  canonicalUrl: string;
  keywords: string[];
  ogTitle: string;
  ogDescription: string;
  schemaMarkup: ArticleSchema;
}

export interface ArticleSection {
  h2: string;
  content: string;
  h3s?: {
    title: string;
    content: string;
  }[];
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface ArticleImageOption {
  url: string;
  alt: string;
  source: "upload" | "web";
}

export interface GeneratedArticle {
  seo: SeoMetadata;
  article: {
    h1: string;
    introduction: string;
    sections: ArticleSection[];
    conclusion: string;
    faq: FaqItem[];
  };
  internalLinkingSuggestions: string[];
  imageAltSuggestions: string[];
  imageSearchQuery?: string;
  featuredImage?: ArticleImageOption;
  imageOptions?: ArticleImageOption[];
  createdAt: string;
}

export interface ArticleFormData {
  title: string;
  metaDescription: string;
  observations: string;
}
