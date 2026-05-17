import type { ToolDefinition } from "./types";

export function getSoftwareApplicationSchema(tool: ToolDefinition) {
  return {
    "@context": "https://schema.org" as const,
    "@type": "SoftwareApplication" as const,
    "name": tool.name,
    "description": tool.metaDescription,
    "applicationCategory": "UtilitiesApplication",
    "operatingSystem": "Web Browser",
    "url": `https://tothewebpro.com/tools/${tool.slug}`,
    "offers": {
      "@type": "Offer" as const,
      "price": "0",
      "priceCurrency": "GBP"
    },
    "provider": {
      "@type": "Organization" as const,
      "name": "ToTheWebPro",
      "url": "https://tothewebpro.com"
    }
  };
}

export function getBreadcrumbListSchema(tool: ToolDefinition) {
  return {
    "@context": "https://schema.org" as const,
    "@type": "BreadcrumbList" as const,
    "itemListElement": [
      {
        "@type": "ListItem" as const,
        "position": 1,
        "name": "Home",
        "item": "https://tothewebpro.com"
      },
      {
        "@type": "ListItem" as const,
        "position": 2,
        "name": tool.categoryLabel,
        "item": `https://tothewebpro.com${tool.categoryPath}`
      },
      {
        "@type": "ListItem" as const,
        "position": 3,
        "name": tool.name,
        "item": `https://tothewebpro.com/tools/${tool.slug}`
      }
    ]
  };
}

export function getFAQPageSchema(tool: ToolDefinition) {
  return {
    "@context": "https://schema.org" as const,
    "@type": "FAQPage" as const,
    "mainEntity": tool.faqs.map((faq) => ({
      "@type": "Question" as const,
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer" as const,
        "text": faq.answer
      }
    }))
  };
}

export function getToolSchemas(tool: ToolDefinition) {
  return {
    softwareApp: getSoftwareApplicationSchema(tool),
    breadcrumb: getBreadcrumbListSchema(tool),
    faq: getFAQPageSchema(tool)
  };
}
