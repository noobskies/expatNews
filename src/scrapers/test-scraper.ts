import { TencentNewsScraper } from "./chinese-news/tencent-news.scraper";

/**
 * Simple test script to validate the Tencent News scraper
 */
async function testTencentScraper() {
  console.log("🚀 Testing Tencent News Scraper...");

  const scraper = new TencentNewsScraper();

  try {
    console.log("📰 Starting article scraping...");
    const result = await scraper.scrapeArticles();

    if (result.success && result.data) {
      console.log(`✅ Successfully scraped ${result.data.length} articles`);

      // Display first article as example
      if (result.data.length > 0) {
        const firstArticle = result.data[0];
        console.log("\n📄 Sample Article:");
        console.log(`Title: ${firstArticle?.title}`);
        console.log(`Author: ${firstArticle?.author ?? "Unknown"}`);
        console.log(`Category: ${firstArticle?.category ?? "Uncategorized"}`);
        console.log(`Published: ${firstArticle?.publishedAt.toISOString()}`);
        console.log(`URL: ${firstArticle?.url}`);
        console.log(
          `Content Preview: ${firstArticle?.content.substring(0, 200)}...`,
        );
      }
    } else {
      console.error("❌ Scraping failed:", result.error);
      if (result.retryAfter) {
        console.log(`⏰ Retry after: ${result.retryAfter}ms`);
      }
    }
  } catch (error) {
    console.error("💥 Unexpected error:", error);
  }
}

// Run the test if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  testTencentScraper()
    .then(() => {
      console.log("\n🏁 Test completed");
      process.exit(0);
    })
    .catch((error) => {
      console.error("💥 Test failed:", error);
      process.exit(1);
    });
}

export { testTencentScraper };
