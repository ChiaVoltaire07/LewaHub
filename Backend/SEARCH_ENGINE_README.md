# LewaHub Natural Language Search Engine

## Overview

The LewaHub search engine is a sophisticated natural language search system designed to help users find the best schools in Cameroon through intuitive, conversational queries. The system combines rule-based NLP, intelligent ranking, caching, and optional AI enhancement to deliver relevant, fast, and accurate search results.

## Architecture

### Core Components

```
┌─────────────────┐
│   User Query    │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────────────┐
│     Search Controller                   │
│  - Input validation                     │
│  - Error handling                       │
│  - Response formatting                  │
└────────┬────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────┐
│     Search Service                      │
│  - Cache management                     │
│  - Query orchestration                  │
│  - Result aggregation                   │
└────────┬────────────────────────────────┘
         │
    ┌────┴────┬────────┬────────┐
    │         │        │        │
    ▼         ▼        ▼        ▼
┌──────┐  ┌──────┐ ┌──────┐ ┌──────┐
│Filter│  │Rank  │ │Cache │ │  AI  │
│Service│ │Service│ │Service│ │Service│
└──────┘  └──────┘ └──────┘ └──────┘
    │         │        │        │
    └────┬────┴────────┴────────┘
         │
         ▼
┌─────────────────────────────────────────┐
│     Prisma Database                     │
│  - Schools                              │
│  - Programs                             │
│  - Facilities                           │
│  - Evaluations                          │
│  - Views                                │
└─────────────────────────────────────────┘
```

## Features

### 1. Natural Language Processing

The filter service (`filter.service.ts`) extracts structured filters from unstructured natural language queries:

#### Supported Filters

- **Regions**: All 10 Cameroonian regions (Adamawa, Centre, East, Far North, Littoral, North, Northwest, South, Southwest, West)
- **Cities**: 14 major cities with automatic region detection (Yaounde, Douala, Bamenda, Buea, Limbe, etc.)
- **School Types**: Primary, Secondary, High School, Elementary, Nursery, Kindergarten, College, Lycee
- **Curriculum**: British, French, American, International, Cameroonian, IGCSE, GCSE, Baccalaureate
- **Facilities**: Library, Laboratory, Computer Lab, Dormitory, Sports, Cafeteria, WiFi, Swimming, Music, Art
- **Programs**: Computer Science, Science, Mathematics, English, French, Business, Arts, Engineering, Medicine, Law
- **Ownership**: Private or Public/Government
- **Boarding**: Boarding school detection

#### Typo Tolerance

Uses Levenshtein distance algorithm to handle typos:
- "bamendaa" → matches "bamenda"
- "libary" → matches "library"
- Threshold: 2 character differences

#### Search Intent Detection

Classifies queries into three categories:
- **specific**: "find schools in Bamenda"
- **browse**: "best schools in Centre"
- **compare**: "compare private vs public schools"

### 2. Intelligent Ranking Algorithm

The ranking service (`ranking.service.ts`) uses a sophisticated scoring system (0-100 points):

#### Scoring Breakdown

| Component | Max Points | Description |
|-----------|-----------|-------------|
| Verification Status | 30 | Approved schools get base score |
| Rating | 20 | Average evaluation score (0-5 scale) |
| Popularity | 15 | View count (logarithmic scale) |
| Boarding Match | 20 | Matches boarding filter |
| Facility Match | 25 | Percentage of requested facilities |
| Program Match | 25 | Percentage of requested programs |
| Keyword Match | 20 | Percentage of matched keywords |
| Completeness | 10 | Information richness |

#### Ranking Features

- **Percentage-based matching**: Schools don't need 100% match to rank well
- **Completeness bonus**: Schools with more information rank higher
- **Popularity weighting**: More viewed schools get priority
- **Quality weighting**: Higher rated schools rank better

### 3. Caching System

The cache service (`cache.service.ts`) provides Redis-based caching:

- **Cache Key**: SHA256 hash of normalized query
- **TTL**: 1 hour (3600 seconds)
- **Benefits**: 
  - Reduces database load
  - Improves response time
  - Handles repeated queries efficiently

### 4. AI Enhancement (Optional)

The AI service (`ai-search.service.ts`) provides advanced features using OpenAI:

#### Capabilities

1. **Query Enhancement**: Expands abbreviations, fixes typos, adds relevant terms
2. **AI Ranking**: Reranks results using GPT-3.5 (blended 70% AI, 30% algorithm)
3. **Search Summaries**: Generates natural language explanations of results
4. **Related Searches**: Suggests alternative queries

#### Usage

```typescript
import { aiSearchService } from './services/ai-search.service';

// Enhance query
const { enhancedQuery, keyConcepts } = await aiSearchService.enhanceQuery("comp sci school");

// Rank with AI
const aiRankedScores = await aiSearchService.rankResultsWithAI(query, schools, existingScores);

// Generate summary
const summary = await aiSearchService.generateSearchSummary(query, results);

// Get suggestions
const suggestions = await aiSearchService.suggestRelatedSearches(query);
```

**Note**: Requires `OPENAI_API_KEY` environment variable. Falls back gracefully if not available.

### 5. Comprehensive Error Handling

The controller (`search.controller.ts`) includes:

- Query validation (length, format)
- Try-catch blocks for all async operations
- Detailed error messages
- Execution time tracking
- Metadata in responses

## API Endpoint

### GET /api/search

Search for schools using natural language.

**Query Parameters:**
- `query` (required): Natural language search query

**Response Format:**
```json
{
  "success": true,
  "data": [
    {
      "school_id": 1,
      "name": "School Name",
      "description": "School description",
      "region": { "name": "Northwest" },
      "boarding_available": true,
      "score": 85.5,
      "program": [...],
      "school_facility": [...]
    }
  ],
  "meta": {
    "query": "boarding school in Bamenda",
    "resultCount": 5,
    "executionTimeMs": 120,
    "cached": false
  }
}
```

**Error Responses:**
```json
{
  "success": false,
  "message": "Search query is required",
  "error": "Please provide a search query"
}
```

## Usage Examples

### Basic Search
```
GET /api/search?query=bamenda
```
Returns all approved schools in Bamenda.

### Complex Natural Language Query
```
GET /api/search?query=best private boarding school with library and computer lab in Northwest region
```

**Extracted Filters:**
- Region: Northwest
- Ownership: private
- Boarding: true
- Facilities: [library, computer]
- Keywords: [best]

### Typo Tolerance
```
GET /api/search?query=bamendaa
```
Still matches schools in Bamenda (typo tolerance).

### City Search
```
GET /api/search?query=schools in Yaounde
```
Automatically detects Yaounde → Centre region.

## Database Schema

### Key Models

- **school**: Core school information
- **program**: Academic programs offered
- **facility**: Available facilities
- **school_facility**: Many-to-many relationship
- **evaluation**: Ratings and reviews
- **school_view**: View tracking for popularity
- **fee**: Fee information
- **curriculum**: Curriculum types
- **region**: Geographic regions

## Performance Optimization

### Caching Strategy

1. **Query-level caching**: Each unique query is cached
2. **Hash-based keys**: Efficient Redis key generation
3. **TTL management**: 1-hour expiration balances freshness and performance
4. **Cache hits**: Instant response for repeated queries

### Database Optimization

1. **Selective includes**: Only fetch necessary relations
2. **Indexed searches**: Uses Prisma's optimized queries
3. **Case-insensitive matching**: Efficient `mode: "insensitive"`
4. **Limit results**: Maximum 50 schools per query

### Algorithm Efficiency

1. **Early filtering**: Database-level filtering before ranking
2. **Percentage scoring**: Partial matches still rank well
3. **Logarithmic popularity**: Prevents view count domination

## Testing

### Run Test Suite

```bash
# Test filter extraction
npx ts-node testSearchFilters.ts

# Test comprehensive search
npx ts-node testEnhancedSearch.ts

# Test basic search
npx ts-node testSearchService.ts
```

### Test Coverage

- ✅ Basic keyword search
- ✅ Region detection
- ✅ City detection
- ✅ Facility filtering
- ✅ Program filtering
- ✅ Ownership filtering
- ✅ Boarding filter
- ✅ Typo tolerance
- ✅ Complex combined queries
- ✅ Empty query handling
- ✅ Gibberish query handling

## Configuration

### Environment Variables

```env
# Database
DATABASE_URL=postgresql://user:pass@host:5432/db

# Redis
REDIS_URL=redis://localhost:6379

# OpenAI (Optional)
OPENAI_API_KEY=sk-...

# Server
PORT=3000
NODE_ENV=production
```

### Dependencies

**Required:**
- `@prisma/client`: Database ORM
- `express`: Web framework
- `ioredis`: Redis client
- `zod`: Validation

**Optional:**
- `openai`: AI enhancement

## Future Enhancements

### Planned Features

1. **Fuzzy Search**: Implement full-text search with PostgreSQL
2. **Synonyms**: Expand synonym dictionary
3. **Personalization**: User preference learning
4. **Autocomplete**: Real-time search suggestions
5. **Faceted Search**: Filter by multiple dimensions
6. **Geospatial**: Distance-based ranking
7. **Analytics**: Search query analytics
8. **A/B Testing**: Ranking algorithm experiments

### Potential Improvements

1. **Machine Learning**: Train ranking model on user clicks
2. **Semantic Search**: Vector embeddings for better matching
3. **Multi-language**: Support for French queries
4. **Voice Search**: Speech-to-text integration
5. **Image Search**: Search by school photos

## Troubleshooting

### Common Issues

**Issue**: No results for valid queries
- **Solution**: Ensure schools have `verification_status = "approved"`
- **Solution**: Check database has data

**Issue**: Slow search performance
- **Solution**: Verify Redis is running
- **Solution**: Check database indexes

**Issue**: AI features not working
- **Solution**: Verify `OPENAI_API_KEY` is set
- **Solution**: Check API quota and billing

## Contributing

When modifying the search engine:

1. **Filter Changes**: Update `filter.service.ts`
2. **Ranking Changes**: Update `ranking.service.ts`
3. **New Features**: Add to appropriate service
4. **Tests**: Update test files
5. **Documentation**: Update this README

## License

Part of the LewaHub platform.