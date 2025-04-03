import { VideoItem, ViewState } from "@/types";

interface VideoSidebarProps {
  videos: VideoItem[];
  selectedVideoId: string | null;
  onSelectVideo: (id: string) => void;
  viewState: ViewState;
  toggleSidebar: () => void;
}

export default function VideoSidebar({
  videos,
  selectedVideoId,
  onSelectVideo,
  viewState,
  toggleSidebar,
}: VideoSidebarProps) {
  return (
    <aside className="md:w-72 bg-white p-4 rounded-lg shadow-sm overflow-hidden md:block transition-all relative">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold flex items-center gap-2 text-black">
          <i className="ri-list-check text-[#4B1C82]"></i>
          Video Titles
        </h3>
        <button 
          onClick={toggleSidebar}
          className="p-1.5 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors text-neutral-600"
          title="Hide sidebar"
        >
          <i className="ri-arrow-left-line"></i>
        </button>
      </div>
      
      <div className="space-y-3 max-h-[60vh] overflow-y-auto hidden-scrollbar">
        {viewState === "initial" && (
          <div className="text-neutral-500 italic text-sm">
            Search for highlights to see video titles here
          </div>
        )}
        
        {viewState === "loading" && (
          <div className="space-y-2">
            {Array(4).fill(0).map((_, i) => (
              <div key={i} className="h-14 bg-neutral-100 rounded animate-pulse"></div>
            ))}
          </div>
        )}
        
        {viewState === "results" && videos.map((video, index) => (
          <div
            key={video.id}
            onClick={() => onSelectVideo(video.id)}
            className={`video-title-item p-2 hover:bg-neutral-100 rounded cursor-pointer flex items-start border-l-4 ${
              selectedVideoId === video.id ? "border-[#4B1C82]" : "border-transparent hover:border-[#4B1C82]"
            }`}
          >
            <div className="text-[#4B1C82] mr-2 font-bold">{index + 1}.</div>
            <div className="line-clamp-2 text-black">{video.title}</div>
          </div>
        ))}
        
        {viewState === "noResults" && (
          <div className="text-neutral-500 italic text-sm">
            No videos found. Try a different search.
          </div>
        )}
        
        {viewState === "error" && (
          <div className="text-red-500 italic text-sm">
            Couldn't load video titles. Please try again.
          </div>
        )}
      </div>
    </aside>
  );
}
