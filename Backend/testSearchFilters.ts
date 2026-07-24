import { extractFilters } from "./src/services/filter.service";

// Test cases
const testQueries = [
    "boarding school",
    "schools with library",
    "computer lab in Centre",
    "science school",
    "private school in Yaounde with dormitory",
    "international curriculum",
    "computer science",
    "private school in centre with laboratory",
    "library"
];

console.log("Testing Filter Extraction:\n");

for (const query of testQueries) {
    const filters = extractFilters(query);
    console.log(`Query: "${query}"`);
    console.log("Filters:", JSON.stringify(filters, null, 2));
    console.log("");
}