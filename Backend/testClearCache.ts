import { deleteCache } from "./src/services/cache.service";

async function clearCache() {
    const query = "private boarding school in Yaounde";
    const cacheKey = `school-search:${query.toLowerCase().trim()}`;
    
    console.log(`Clearing cache for: "${query}"`);
    await deleteCache(cacheKey);
    console.log("✅ Cache cleared!");
}

clearCache().catch(console.error);