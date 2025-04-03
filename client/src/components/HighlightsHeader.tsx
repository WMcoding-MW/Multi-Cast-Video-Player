import { useState } from "react";
import { SearchParams } from "@/types";
import logoPath from "../assets/logo.png";

interface HighlightsHeaderProps {
  onSearch: (params: SearchParams) => void;
  onWatch?: () => void;
  disabled?: boolean;
  isPlaying?: boolean;
}

export default function HighlightsHeader({ onSearch, onWatch, disabled = true, isPlaying = false }: HighlightsHeaderProps) {
  const [league, setLeague] = useState("");
  const [query, setQuery] = useState("");
  const [inputError, setInputError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (query.trim() === "") {
      setInputError(true);
      setTimeout(() => setInputError(false), 2000);
      return;
    }
    
    onSearch({ league, query: query.trim() });
  };

  return (
    <header className="shh-header shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center">
            <img src={logoPath} alt="SHH Logo" className="shh-logo h-12 mr-3 p-[2px] rounded-full border-2 border-[#FFD700]" />
            <h1 className="text-white text-2xl font-bold">
              <span className="shh-highlight-text">S</span>ports 
              <span className="shh-highlight-text">H</span>ighlight 
              <span className="shh-highlight-text">H</span>ub
            </h1>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col md:flex-row items-center gap-4 pb-2">
          <div className="w-full md:w-1/4">
            <div className="relative">
              <i className="ri-basketball-line absolute left-3 top-1/2 transform -translate-y-1/2 text-[#FFD700]"></i>
              <input
                type="text"
                id="leagueInput"
                placeholder="Enter league (e.g. 'NBA', 'Tennis')"
                value={league}
                onChange={(e) => setLeague(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-[#2F0D4E] text-white border border-[#FFD700] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFD700] placeholder-gray-400"
              />
            </div>
          </div>
          
          <div className="relative w-full md:w-1/2">
            <i className="ri-search-line absolute left-3 top-1/2 transform -translate-y-1/2 text-[#FFD700]"></i>
            <input
              type="text"
              id="teamSearch"
              placeholder="Search by team or keywords (e.g. 'Lakers', 'buzzer beater')"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 bg-[#2F0D4E] text-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFD700] placeholder-gray-400 ${
                inputError ? "border-red-500 ring-1 ring-red-500" : "border-[#FFD700]"
              }`}
            />
          </div>
          
          <div className="flex gap-2 w-full md:w-auto">
            <button
              type="submit"
              id="searchBtn"
              className="w-full md:w-auto px-6 py-2 bg-[#FFD700] hover:bg-[#E6C200] text-[#4B1C82] font-bold rounded-lg transition-colors flex items-center justify-center"
            >
              <i className="ri-search-line mr-2"></i>
              <span>Find Highlights</span>
            </button>
            
            {onWatch && (
              <button
                type="button"
                onClick={onWatch}
                disabled={disabled}
                className={`w-full md:w-auto px-6 py-2 ${
                  isPlaying 
                    ? "bg-red-500 hover:bg-red-600" 
                    : "bg-[#FFD700] hover:bg-[#E6C200]"
                } text-black font-medium rounded-lg transition-colors flex items-center justify-center ${
                  disabled ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <i className={`${isPlaying ? "ri-pause-fill" : "ri-play-fill"} mr-2 text-lg`}></i>
                <span>{isPlaying ? "Stop" : "Watch"}</span>
              </button>
            )}
          </div>
        </form>
      </div>
    </header>
  );
}
