import React, { useState, useRef, useEffect } from 'react';
import { VideoItem, GridSize, ViewState } from '@/types';

interface VideoGridProps {
  videos: VideoItem[];
  viewState: ViewState;
  error: string;
  gridSize: GridSize;
  onRetry: () => void;
  onSearchFocus: () => void;
  onPlayStateChange?: (isPlaying: boolean) => void;
  playButtonReference?: React.RefObject<() => void>;
}

export default function VideoGrid({
  videos,
  viewState,
  error,
  gridSize,
  onRetry,
  onSearchFocus,
  onPlayStateChange,
  playButtonReference
}: VideoGridProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const iframeRefs = useRef<Record<string, HTMLIFrameElement | null>>({});
  const videoContainerRef = useRef<HTMLDivElement>(null);

  // Function to format view counts with K, M, B suffixes
  const formatViewCount = (viewCount: string | undefined): string => {
    if (!viewCount) return "N/A";
    
    const count = parseInt(viewCount, 10);
    if (isNaN(count)) return "N/A";
    
    if (count >= 1000000000) {
      return (count / 1000000000).toFixed(1) + 'B';
    } else if (count >= 1000000) {
      return (count / 1000000).toFixed(1) + 'M';
    } else if (count >= 1000) {
      return (count / 1000).toFixed(1) + 'K';
    } else {
      return count.toString();
    }
  };

  // Function to format relative time (e.g., "2 days ago")
  const formatRelativeTime = (dateStr: string): string => {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return "Unknown date";
    
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);
    const diffMonth = Math.floor(diffDay / 30);
    const diffYear = Math.floor(diffDay / 365);
    
    if (diffYear > 0) {
      return diffYear === 1 ? '1 year ago' : `${diffYear} years ago`;
    } else if (diffMonth > 0) {
      return diffMonth === 1 ? '1 month ago' : `${diffMonth} months ago`;
    } else if (diffDay > 0) {
      return diffDay === 1 ? '1 day ago' : `${diffDay} days ago`;
    } else if (diffHour > 0) {
      return diffHour === 1 ? '1 hour ago' : `${diffHour} hours ago`;
    } else if (diffMin > 0) {
      return diffMin === 1 ? '1 minute ago' : `${diffMin} minutes ago`;
    } else {
      return 'Just now';
    }
  };

  // Function to get tailwind class for grid columns based on grid size
  const getGridColsClass = (): string => {
    switch (gridSize) {
      case 2:
        return 'grid-cols-1 sm:grid-cols-2 gap-4';
      case 3:
        return 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4';
      case 4:
        return 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4';
      default:
        return 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4';
    }
  };

  // Check if an element is in the viewport
  const isElementInViewport = (el: HTMLElement | null) => {
    if (!el) return false;
    const rect = el.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  };

  // Load YouTube iframe API and setup scroll handling
  useEffect(() => {
    // Load YouTube iframe API if not already loaded
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
    }

    // Add scroll event listener to pause videos when they are not in viewport
    const handleScroll = () => {
      if (isPlaying && !isFullscreen) {
        Object.keys(iframeRefs.current).forEach((videoId) => {
          const iframe = iframeRefs.current[videoId];
          if (iframe && iframe.contentWindow) {
            // If not in viewport and we're in playing mode, pause the video
            if (!isElementInViewport(iframe)) {
              iframe.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
            }
          }
        });
      }
    };

    // Debounce scroll handler for better performance
    let scrollTimeout: NodeJS.Timeout;
    const debouncedScrollHandler = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(handleScroll, 200);
    };

    window.addEventListener('scroll', debouncedScrollHandler);
    return () => {
      window.removeEventListener('scroll', debouncedScrollHandler);
      clearTimeout(scrollTimeout);
    };
  }, [isPlaying, isFullscreen]);

  // Function to toggle fullscreen mode
  const toggleFullscreen = () => {
    if (isFullscreen) {
      // Exit fullscreen
      setIsFullscreen(false);
      document.body.style.overflow = ''; // Restore scrolling
      
      // Pause all videos when exiting fullscreen
      if (isPlaying) {
        Object.keys(iframeRefs.current).forEach((videoId) => {
          try {
            const iframe = iframeRefs.current[videoId];
            if (iframe && iframe.contentWindow) {
              iframe.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
            }
          } catch (error) {
            console.error("Error pausing video:", error);
          }
        });
        setIsPlaying(false);
        if (onPlayStateChange) onPlayStateChange(false);
      }
    } else {
      // Enter fullscreen
      setIsFullscreen(true);
      document.body.style.overflow = 'hidden'; // Prevent scrolling
    }
  };

  // Function for Watch button - goes fullscreen & plays videos
  const playAllVideos = () => {
    console.log("playAllVideos called", { isPlaying, isFullscreen, viewState, videosCount: videos.length });
    
    if (isPlaying) {
      // Already playing, so pause all videos
      Object.keys(iframeRefs.current).forEach((videoId) => {
        try {
          const iframe = iframeRefs.current[videoId];
          if (iframe && iframe.contentWindow) {
            iframe.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
          }
        } catch (error) {
          console.error("Error pausing video:", error);
        }
      });
      setIsPlaying(false);
      if (onPlayStateChange) onPlayStateChange(false);
    } else {
      // Enter fullscreen mode first if needed
      if (!isFullscreen && viewState === "results" && videos.length > 0) {
        setIsFullscreen(true);
        document.body.style.overflow = 'hidden'; // Prevent scrolling
      }
      
      // Then play all videos after a delay to allow fullscreen to take effect
      setTimeout(() => {
        Object.keys(iframeRefs.current).forEach((videoId) => {
          try {
            const iframe = iframeRefs.current[videoId];
            if (iframe && iframe.contentWindow) {
              iframe.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
            }
          } catch (error) {
            console.error("Error playing video:", error);
          }
        });
        setIsPlaying(true);
        if (onPlayStateChange) onPlayStateChange(true);
      }, 500); // Longer delay to ensure DOM is ready
    }
  };
  
  // Expose the playAllVideos function through the reference if provided
  useEffect(() => {
    if (playButtonReference && typeof playButtonReference === 'object') {
      // TypeScript complains about assigning to current, so we use this workaround
      (playButtonReference as any).current = playAllVideos;
    }
  }, [playButtonReference, videos, isPlaying, isFullscreen]);

  // Cleanup body styles when component unmounts
  useEffect(() => {
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <div className="flex-1">
      {/* Initial State */}
      {viewState === "initial" && (
        <div className="shh-card p-8 text-center">
          <img
            src="/src/assets/favicon.png"
            alt="Sports Highlights Hub"
            className="w-20 h-20 mx-auto mb-4"
          />
          <h3 className="text-xl font-medium text-white mb-2">Ready to watch highlights?</h3>
          <p className="text-gray-300 mb-6">
            Select a league and search for your favorite team or player to get started.
          </p>
          <div className="flex justify-center gap-3">
            <button
              onClick={onSearchFocus}
              className="px-6 py-2 bg-[#FFD700] hover:bg-[#E6C200] text-black font-medium rounded-lg transition-colors flex items-center"
            >
              <i className="ri-search-line mr-2 text-black"></i>
              <span>Find Highlights</span>
            </button>
            <button
              onClick={playAllVideos}
              className={`px-6 py-2 ${isPlaying ? "bg-red-500 hover:bg-red-600" : "bg-[#FFD700] hover:bg-[#E6C200]"} text-black font-medium rounded-lg transition-colors flex items-center`}
              disabled={videos.length === 0}
            >
              <i className={`${isPlaying ? "ri-pause-fill" : "ri-play-fill"} mr-2 text-lg`}></i>
              <span>{isPlaying ? "Stop" : "Watch"}</span>
            </button>
          </div>
        </div>
      )}

      {/* Loading State */}
      {viewState === "loading" && (
        <div className={`grid ${getGridColsClass()}`}>
          {Array(6).fill(0).map((_, i) => (
            <div key={i} className="shh-card shadow-md overflow-hidden">
              <div className="aspect-video bg-[#2F0D4E] animate-pulse"></div>
              <div className="p-3">
                <div className="h-4 bg-[#2F0D4E] rounded animate-pulse mb-2"></div>
                <div className="h-3 bg-[#2F0D4E] rounded animate-pulse w-2/3"></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error State */}
      {viewState === "error" && (
        <div className="shh-card p-8 text-center">
          <i className="ri-error-warning-line text-5xl text-red-500 mb-4"></i>
          <h3 className="text-xl font-medium text-white mb-2">Couldn't load highlights</h3>
          <p className="text-gray-300 mb-6">{error}</p>
          <button
            onClick={onRetry}
            className="px-6 py-2 bg-[#FFD700] hover:bg-[#E6C200] text-black font-medium rounded-lg transition-colors"
          >
            <i className="ri-refresh-line mr-2 text-black"></i>
            Try Again
          </button>
        </div>
      )}

      {/* Results Grid - Normal View */}
      {viewState === "results" && !isFullscreen && (
        <div>
          <div className="mb-4 flex justify-between items-center">
            <button
              onClick={playAllVideos}
              className={`px-4 py-2 ${isPlaying ? "bg-red-500 hover:bg-red-600" : "bg-[#FFD700] hover:bg-[#E6C200]"} text-black font-medium rounded-lg transition-colors flex items-center shadow-md`}
            >
              <i className={`${isPlaying ? "ri-pause-fill" : "ri-play-fill"} mr-2 text-lg text-black`}></i>
              <span>{isPlaying ? "Stop" : "Watch"}</span>
            </button>
            <div className="text-sm text-gray-300">
              {isPlaying && <span className="flex items-center"><i className="ri-volume-up-line mr-1 text-[#FFD700]"></i> Videos are playing</span>}
            </div>
          </div>
        
          <div className={`grid ${getGridColsClass()}`}>
            {videos.map((video) => (
              <div key={video.id} className="shh-card shadow-md overflow-hidden">
                <div className="relative pt-[56.25%]">
                  <iframe
                    ref={(ref) => iframeRefs.current[video.id] = ref}
                    src={`https://www.youtube.com/embed/${video.id}?enablejsapi=1&mute=1&origin=${window.location.origin}&rel=0&showinfo=0&player_id=${video.id}&controls=1`}
                    title={video.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute top-0 left-0 w-full h-full border-0 rounded-t-lg"
                  ></iframe>
                </div>
                <div className="p-3 bg-white">
                  <h3 className="font-medium text-black line-clamp-2">{video.title}</h3>
                  <div className="flex items-center mt-2 text-sm text-gray-600">
                    <i className="ri-eye-line mr-1 text-[#4B1C82]"></i>
                    <span>{formatViewCount(video.viewCount)} views</span>
                    <span className="mx-2">•</span>
                    <span>{formatRelativeTime(video.publishedAt)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Results Grid - Fullscreen Mode */}
      {viewState === "results" && isFullscreen && (
        <div className="fullscreen-mode" ref={videoContainerRef}>
          <div className="sticky top-0 z-10 bg-black bg-opacity-75 p-4 mb-4 flex justify-between items-center">
            <div className="flex items-center">
              <button
                onClick={playAllVideos}
                className={`px-4 py-2 ${isPlaying ? "bg-red-500 hover:bg-red-600" : "bg-[#FFD700] hover:bg-[#E6C200]"} text-black font-medium rounded-lg transition-colors flex items-center shadow-md mr-3`}
              >
                <i className={`${isPlaying ? "ri-pause-fill" : "ri-play-fill"} mr-2 text-lg text-black`}></i>
                <span>{isPlaying ? "Stop" : "Watch"}</span>
              </button>
              <span className="text-white text-sm">Fullscreen Mode</span>
            </div>
            <button
              onClick={toggleFullscreen}
              className="px-4 py-2 bg-[#FFD700] hover:bg-[#E6C200] text-black font-medium rounded-lg transition-colors flex items-center shadow-md"
            >
              <i className="ri-fullscreen-exit-line mr-2 text-black"></i>
              <span>Exit Fullscreen</span>
            </button>
          </div>
        
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 px-2">
            {videos.map((video) => (
              <div key={video.id} className="shh-card shadow-md overflow-hidden">
                <div className="relative pt-[56.25%]">
                  <iframe
                    ref={(ref) => iframeRefs.current[video.id] = ref}
                    src={`https://www.youtube.com/embed/${video.id}?enablejsapi=1&mute=0&origin=${window.location.origin}&rel=0&showinfo=0&player_id=${video.id}&controls=1`}
                    title={video.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute top-0 left-0 w-full h-full border-0 rounded-lg"
                  ></iframe>
{/* Title overlay removed in fullscreen mode */}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No Results State */}
      {viewState === "noResults" && (
        <div className="shh-card p-8 text-center">
          <i className="ri-search-line text-5xl text-[#FFD700] mb-4"></i>
          <h3 className="text-xl font-medium text-white mb-2">No highlights found</h3>
          <p className="text-gray-300 mb-4">
            We couldn't find any highlights matching your search. Try different keywords.
          </p>
          <div className="text-gray-200 mb-6 p-3 bg-[#2F0D4E] rounded-lg inline-block">
            <ul className="text-left text-sm">
              <li className="mb-1"><span className="text-[#FFD700]">•</span> Try a different team or player name</li>
              <li className="mb-1"><span className="text-[#FFD700]">•</span> Use more general terms (e.g. "NBA highlights")</li>
              <li><span className="text-[#FFD700]">•</span> Check for typos in your search</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}