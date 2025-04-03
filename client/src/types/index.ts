export interface VideoItem {
  id: string;
  title: string;
  thumbnail: string;
  publishedAt: string;
  channelTitle: string;
  viewCount?: string;
}

export interface SearchParams {
  league: string;
  query: string;
}

export type GridSize = 2 | 3 | 4;

export type ViewState = 
  | 'initial' 
  | 'loading' 
  | 'results' 
  | 'noResults' 
  | 'error';
