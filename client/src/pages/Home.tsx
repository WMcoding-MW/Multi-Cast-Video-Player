import { useState, useRef } from "react";
import HighlightsHeader from "@/components/HighlightsHeader";
import VideoGrid from "@/components/VideoGrid";
import VideoSidebar from "@/components/VideoSidebar";
import HighlightsFooter from "@/components/HighlightsFooter";
import { SearchParams, VideoItem, GridSize, ViewState } from "@/types";
import { useQuery } from "@tanstack/react-query";
import ActionShotBg from "../assets/action-shot.jpg";

export default function Home() {
  const [showSidebar, setShowSidebar] = useState(window.innerWidth >= 768);
  const [searchParams, setSearchParams] = useState<SearchParams>({
    league: "",
    query: "",
  });
  const [gridSize, setGridSize] = useState<GridSize>(3);
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const playVideoButtonRef = useRef<() => void>(null);

  // Fetch highlights based on search parameters
  const {
    data: videos,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<VideoItem[]>({
    queryKey: [
      `/api/search?${new URLSearchParams({
        league: searchParams.league || "",
        query: searchParams.query || "",
      }).toString()}`,
    ],
    enabled: !!searchParams.query, // Only run query if query is provided
  });

  // Determine the current view state
  const getViewState = (): ViewState => {
    if (!searchParams.query) return "initial";
    if (isLoading) return "loading";
    if (isError) return "error";
    if (!videos || videos.length === 0) return "noResults";
    return "results";
  };

  const viewState = getViewState();

  // Handle search submission
  const handleSearch = (params: SearchParams) => {
    setSearchParams(params);
  };

  // Toggle sidebar visibility
  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  // Handle selecting a video from the sidebar
  const handleSelectVideo = (videoId: string) => {
    setSelectedVideoId(videoId);
  };

  // Get result title based on search parameters
  const getResultTitle = () => {
    if (!searchParams.query && !searchParams.league) return "Recent Highlights";

    let title = searchParams.league ? `${searchParams.league.toUpperCase()} Highlights` : "Sports Highlights";
    return searchParams.query ? `${title} - "${searchParams.query}"` : title;
  };

  // Handle play/pause of videos
  const handlePlayVideos = () => {
    if (playVideoButtonRef.current) {
      playVideoButtonRef.current();
    }
  };

  // Update the playing state
  const handlePlayStateChange = (state: boolean) => {
    setIsPlaying(state);
  };

  return (
    <div className="flex flex-col min-h-screen bg-cover bg-center relative" style={{
      backgroundImage: `linear-gradient(rgba(75, 28, 130, 0.85), rgba(28, 28, 28, 0.85)), url(${ActionShotBg})`
    }}>
      <HighlightsHeader 
        onSearch={handleSearch} 
        onWatch={handlePlayVideos}
        disabled={!videos || videos.length === 0}
        isPlaying={isPlaying}
      />
      
      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">
            <span>{getResultTitle()}</span>
          </h2>
          <div className="flex items-center gap-2">
            <button 
              onClick={toggleSidebar}
              className="px-3 py-1.5 text-sm bg-white border border-neutral-300 rounded-lg hover:bg-neutral-100 flex items-center gap-1 text-black"
              title={showSidebar ? "Hide video titles" : "Show video titles"}
            >
              <i className={`${showSidebar ? "ri-side-bar-fill" : "ri-side-bar-line"} text-black`}></i>
              <span>Titles {showSidebar ? "On" : "Off"}</span>
            </button>
            <div className="flex border border-neutral-300 rounded-lg overflow-hidden">
              <button 
                onClick={() => setGridSize(2)}
                className={`p-1.5 hover:bg-neutral-100 ${gridSize === 2 ? 'bg-neutral-200' : 'bg-white'}`}
                title="2 videos per row"
              >
                <i className="ri-layout-2-line text-lg text-black"></i>
              </button>
              <button 
                onClick={() => setGridSize(3)}
                className={`p-1.5 hover:bg-neutral-100 ${gridSize === 3 ? 'bg-neutral-200' : 'bg-white'}`}
                title="3 videos per row"
              >
                <i className="ri-layout-3-line text-lg text-black"></i>
              </button>
              <button 
                onClick={() => setGridSize(4)}
                className={`p-1.5 hover:bg-neutral-100 ${gridSize === 4 ? 'bg-neutral-200' : 'bg-white'}`}
                title="4 videos per row"
              >
                <i className="ri-layout-4-line text-lg text-black"></i>
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 relative">
          {showSidebar && (
            <VideoSidebar 
              videos={videos || []}
              selectedVideoId={selectedVideoId}
              onSelectVideo={handleSelectVideo}
              viewState={viewState}
              toggleSidebar={toggleSidebar}
            />
          )}
          
          {!showSidebar && (
            <button
              onClick={toggleSidebar}
              className="absolute left-0 top-0 p-2 bg-white border border-neutral-200 rounded-lg shadow-sm hover:bg-neutral-100 transition-colors z-10 mb-2"
              title="Show sidebar"
            >
              <i className="ri-arrow-right-line text-black"></i>
            </button>
          )}
          
          <VideoGrid 
            videos={videos || []}
            viewState={viewState}
            error={error instanceof Error ? error.message : "An unknown error occurred"}
            gridSize={gridSize}
            onRetry={() => refetch()}
            onSearchFocus={() => {
              const searchInput = document.getElementById("teamSearch");
              if (searchInput) searchInput.focus();
            }}
            onPlayStateChange={handlePlayStateChange}
            playButtonReference={playVideoButtonRef}
          />
        </div>
      </main>
      
      <HighlightsFooter />
    </div>
  );
}
