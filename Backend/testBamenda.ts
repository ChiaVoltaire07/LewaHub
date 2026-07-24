import { extractFilters } from "./src/services/filter.service";

const query = "bamenda";
const filters = extractFilters(query);

console.log(`Query: "${query}"`);
console.log("Filters:", JSON.stringify(filters, null, 2));