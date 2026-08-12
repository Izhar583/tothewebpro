export type ToolCategory = "seo" | "text" | "image" | "developer";

export interface ToolFAQ {
  question: string;
  answer: string;
}

export interface ToolDefinition {
  slug: string;
  name: string;
  shortDescription: string;
  category: ToolCategory;
  categoryLabel: string;
  categoryPath: string;
  icon: string;
  schemaDescription: string;
  metaTitle: string;
  metaDescription: string;
  howToUseParagraphs: string[];
  faqs: ToolFAQ[];
  relatedSlugs: string[];
  noIndex?: boolean;
}

export interface FetchMetaResponse {
  title: string;
  description: string;
  ogTitle: string;
  canonical: string;
}

export interface FetchMetaError {
  error: string;
}
