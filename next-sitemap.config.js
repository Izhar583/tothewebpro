/** @type {import('next-sitemap').IConfig} */
const fs = require("fs");
const path = require("path");

module.exports = {
  siteUrl: "https://tothewebpro.com",
  // Set to false to preserve the manually managed public/robots.txt.
  generateRobotsTxt: false,
  generateIndexSitemap: false,
  changefreq: "weekly",
  priority: 0.8,
  exclude: [
    "/api/*",
    "/admin",
    "/admin/*",
    "/search",
    "/tools/free-da-pa-checker",
    "/icon.png",
  ],
  additionalPaths: async (config) => {
    const result = [];

    // Main Blog Index
    result.push({
      loc: "/blog",
      changefreq: "daily",
      priority: 0.9,
      lastmod: new Date().toISOString(),
    });

    // Dynamic Blog Posts from data/posts.json
    try {
      const postsFile = path.join(__dirname, "data", "posts.json");
      if (fs.existsSync(postsFile)) {
        const posts = JSON.parse(fs.readFileSync(postsFile, "utf-8"));
        for (const post of posts) {
          if (post.status === "published" || !post.status) {
            result.push({
              loc: `/blog/${post.slug}`,
              changefreq: "weekly",
              priority: 0.8,
              lastmod: post.updatedAt || post.date || new Date().toISOString(),
            });
          }
        }
      }
    } catch (err) {
      console.error("Failed to load blog posts for next-sitemap:", err);
    }

    return result;
  },
};
