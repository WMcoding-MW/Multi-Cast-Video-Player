import { VideoItem } from "@/types";

// YouTube API key from environment variable
const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

// Build search query for YouTube API
export function buildSearchQuery(league: string, teamQuery: string): string {
  // Clean up inputs to avoid empty terms
  const cleanLeague = league.trim();
  const cleanQuery = teamQuery.trim();
  
  // Create a more accurate search query
  if (cleanLeague && cleanQuery) {
    return `${cleanLeague} ${cleanQuery} sports highlights recent`;
  } else if (cleanLeague) {
    return `${cleanLeague} sports highlights recent`;
  } else if (cleanQuery) {
    return `${cleanQuery} sports highlights recent`;
  }
  
  return 'sports highlights recent';
}

// Format the YouTube API URL
export function buildYouTubeApiUrl(query: string, maxResults: number = 6): string {
  const encodedQuery = encodeURIComponent(query);
  const publishedAfter = new Date();
  publishedAfter.setMonth(publishedAfter.getMonth() - 3); // Increase to 3 months for better results
  
  // Add relevanceLanguage=en and videoDuration=short parameters for more relevant highlights
  return `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=${maxResults}&q=${encodedQuery}&type=video&videoEmbeddable=true&key=${API_KEY}&order=relevance&relevanceLanguage=en&videoDuration=short&publishedAfter=${publishedAfter.toISOString()}`;
}

// Transform YouTube API response to our VideoItem format
export function transformYouTubeResults(data: any): VideoItem[] {
  if (!data || !data.items || !Array.isArray(data.items)) {
    return [];
  }
  
  // Filter out items that don't seem to be sports highlights
  // Based on common highlight-related keywords in title
  const highlightKeywords = ['highlight', 'play', 'score', 'goal', 'dunk', 'touchdown', 'slam', 'shot', 'save', 'match', 'game', 'vs'];
  
  const filteredItems = data.items.filter((item: any) => {
    const title = item.snippet.title.toLowerCase();
    // Ensure title has at least one of the highlight keywords
    return highlightKeywords.some(keyword => title.includes(keyword));
  });
  
  // If the filter removed too many results, fall back to the original list
  const itemsToUse = filteredItems.length >= 3 ? filteredItems : data.items;
  
  return itemsToUse.map((item: any) => ({
    id: item.id.videoId,
    title: item.snippet.title,
    thumbnail: item.snippet.thumbnails.high.url,
    publishedAt: item.snippet.publishedAt,
    channelTitle: item.snippet.channelTitle,
    // Note: View count is not included in search results, would require additional API call
  }));
}
