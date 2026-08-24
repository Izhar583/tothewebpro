/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://tothewebpro.com",
  // Set to false to preserve the manually managed public/robots.txt.
  // If you want next-sitemap to generate robots.txt, set this to true
  // and remove public/robots.txt from the repo.
  generateRobotsTxt: false,
  generateIndexSitemap: false,
  changefreq: "weekly",
  priority: 0.8,
  exclude: [
    "/api/*",
    "/search",
    "/tools/free-da-pa-checker",
  ],
};
