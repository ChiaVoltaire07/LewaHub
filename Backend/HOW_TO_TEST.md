# How to Test and Verify the Search Engine

## Prerequisites

1. Make sure your database is running and has data
2. Make sure Redis is running
3. Ensure your `.env` file has the correct `DATABASE_URL` and `REDIS_URL`

## Method 1: Using Test Scripts (Recommended for Development)

### Step 1: Test Filter Extraction
This shows how natural language queries are parsed into structured filters.

```bash
cd Backend
npx ts-node testSearchFilters.ts
```

**Expected Output:**
```
Query: "private school in Yaounde with dormitory"
Filters: {
  "city": "Yaounde",
  "region": "Centre",
  "boarding": true,
  "ownership": "private",
  "facilities": ["dormitory"]
}
```

### Step 2: Test Database State
Check what data exists in your database.

```bash
cd Backend
npx ts-node testSearchDebug.ts
```

**Expected Output:**
```
📊 Total schools in database: 13
✅ Approved schools: 13
🎯 Private + Boarding + Approved: 8
```

### Step 3: Test Actual Search
Test the search service with various queries.

```bash
cd Backend
npx ts-node testActualSearch.ts
```

**Expected Output:**
```
Query: "private boarding school in Yaounde"
✅ Found 1 school(s)
   1. Lewa International College (Score: 54.00)
```

### Step 4: Comprehensive Test
Test multiple queries at once.

```bash
cd Backend
npx ts-node testFinalVerification.ts
```

### Step 5: Clear Cache (if needed)
If you're getting stale results, clear the cache:

```bash
cd Backend
npx ts-node testClearCache.ts
```

## Method 2: Using the API Endpoint (Production-like Testing)

### Step 1: Start the Server

```bash
cd Backend
npm run dev
```

The server should start on `http://localhost:3000` (or your configured PORT).

### Step 2: Test with Thunder Client / Postman / curl

#### Example 1: Basic Search
```bash
curl "http://localhost:3000/api/search?query=bamenda"
```

**Expected Response:**
```json
{
  "success": true,
  "data": [],
  "meta": {
    "query": "bamenda",
    "resultCount": 0,
    "executionTimeMs": 15,
    "cached": false
  }
}
```

#### Example 2: Complex Natural Language Query
```bash
curl "http://localhost:3000/api/search?query=private boarding school in Yaounde"
```

**Expected Response:**
```json
{
  "success": true,
  "data": [
    {
      "school_id": 1,
      "name": "Lewa International College",
      "description": "...",
      "region": { "name": "Centre" },
      "boarding_available": true,
      "ownership": "private",
      "score": 54.00,
      "school_facility": [...]
    }
  ],
  "meta": {
    "query": "private boarding school in Yaounde",
    "resultCount": 1,
    "executionTimeMs": 28,
    "cached": false
  }
}
```

#### Example 3: Facility Search
```bash
curl "http://localhost:3000/api/search?query=library"
```

**Expected Response:**
```json
{
  "success": true,
  "data": [
    {
      "name": "Lewa International College",
      "score": 59.00,
      "school_facility": [
        { "facility": { "name": "Library" } }
      ]
    },
    ...
  ],
  "meta": {
    "resultCount": 3,
    ...
  }
}
```

#### Example 4: Region Search
```bash
curl "http://localhost:3000/api/search?query=schools in Centre"
```

**Expected Response:**
```json
{
  "success": true,
  "data": [
    {
      "name": "Lewa International College",
      "region": { "name": "Centre" },
      "score": 34.00
    },
    ...
  ],
  "meta": {
    "resultCount": 4,
    ...
  }
}
```

## Method 3: Using Thunder Client (VS Code Extension)

### Step 1: Open Thunder Client
1. Click on the Thunder Client icon in VS Code sidebar
2. Click "New Request"

### Step 2: Configure Request
- **Method**: GET
- **URL**: `http://localhost:3000/api/search?query=private boarding school in Yaounde`
- **Headers**: None required

### Step 3: Send Request
- Click "Send"
- View the response in the right panel

### Step 4: Try Different Queries
Try these test queries:

1. `query=bamenda` - Should return 0 (no schools in Bamenda)
2. `query=schools in Centre` - Should return 4 schools
3. `query=library` - Should return 3 schools with library
4. `query=private school with library` - Should return 2 schools
5. `query=boarding` - Should return schools with boarding
6. `query=computer lab` - Should return schools with computer lab

## Understanding the Results

### Score Breakdown
The score (0-100) is calculated based on:
- **30 points**: Approved status
- **20 points**: Rating (if available)
- **15 points**: Popularity (view count)
- **25 points**: Facility match percentage
- **25 points**: Program match percentage
- **20 points**: Keyword match percentage
- **10 points**: Completeness (info richness)

### Common Issues and Solutions

#### Issue: No results returned
**Possible causes:**
1. No approved schools in database
   - **Solution**: Run `npx ts-node testSearchDebug.ts` to check
2. Filters too restrictive
   - **Solution**: Try broader query like "schools in Centre"
3. Cache has old empty result
   - **Solution**: Run `npx ts-node testClearCache.ts`

#### Issue: Wrong schools returned
**Check:**
1. Run `npx ts-node testSearchTrace.ts` to see what filters are extracted
2. Check if database has correct data
3. Verify facility/program names match

#### Issue: Slow response
**Check:**
1. Is Redis running? (`redis-cli ping` should return "PONG")
2. Is database indexed properly?
3. Check network latency

## Debugging Tips

### 1. Check What Filters Are Extracted
```bash
cd Backend
npx ts-node testSearchFilters.ts
```

### 2. Check Database Content
```bash
cd Backend
npx ts-node testSearchDebug.ts
```

### 3. Check Facilities
```bash
cd Backend
npx ts-node testFacilities.ts
```

### 4. Trace Specific Query
```bash
cd Backend
npx ts-node testSearchTrace.ts
```

### 5. Clear Cache
```bash
cd Backend
npx ts-node testClearCache.ts
```

## Quick Test Checklist

- [ ] Server starts without errors
- [ ] Redis is running
- [ ] Database has approved schools
- [ ] Test query "schools in Centre" returns results
- [ ] Test query "library" returns schools with library
- [ ] Test query "private boarding school in Yaounde" returns results
- [ ] Cache is working (second request is faster)
- [ ] Error messages are clear for invalid queries

## Example Testing Session

```bash
# 1. Start Redis (if not running)
redis-server

# 2. Start the server
cd Backend
npm run dev

# 3. In another terminal, test with curl
curl "http://localhost:3000/api/search?query=schools in Centre"

# 4. Or use Thunder Client in VS Code

# 5. Check filter extraction
npx ts-node testSearchFilters.ts

# 6. Verify database
npx ts-node testSearchDebug.ts
```

## Performance Testing

### Test Caching
```bash
# First request (no cache)
time curl "http://localhost:3000/api/search?query=library"

# Second request (cached - should be faster)
time curl "http://localhost:3000/api/search?query=library"
```

You should see the second request is significantly faster.

## Next Steps

1. **Add more test data**: Use the admin panel or scraper to add more schools
2. **Test edge cases**: Try typos, gibberish, very long queries
3. **Monitor performance**: Check execution times in meta
4. **Test AI features**: Add `OPENAI_API_KEY` to `.env` and test AI enhancement

## Troubleshooting

### "Authentication failed against database server"
- Check your `DATABASE_URL` in `.env`
- Ensure PostgreSQL is running
- Verify credentials are correct

### "Redis connection failed"
- Check your `REDIS_URL` in `.env`
- Ensure Redis is running: `redis-cli ping`

### "No results for valid queries"
- Run `npx ts-node testSearchDebug.ts` to check database
- Run `npx ts-node testClearCache.ts` to clear stale cache
- Check if schools have `verification_status = "approved"`

### "Module not found errors"
- Run `npm install` to install dependencies
- Run `npx prisma generate` to generate Prisma client