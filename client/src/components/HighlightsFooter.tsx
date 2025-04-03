import logoPath from "../assets/logo.png";

export default function HighlightsFooter() {
  return (
    <footer className="bg-[#2F0D4E] text-white py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <div className="flex items-center">
              <img 
                src={logoPath} 
                alt="SHH Logo" 
                className="w-10 h-10 mr-3 p-[2px] rounded-full border-2 border-[#FFD700]"
              />
              <span className="text-white font-bold text-xl">Quiet Sports</span>
            </div>
            <p className="text-sm mt-2 text-gray-300">Premium sports highlights at your fingertips</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <a href="#" className="text-[#FFD700] hover:text-white transition-colors">
              <i className="ri-twitter-fill text-xl"></i>
            </a>
            <a href="#" className="text-[#FFD700] hover:text-white transition-colors">
              <i className="ri-youtube-fill text-xl"></i>
            </a>
            <a href="#" className="text-[#FFD700] hover:text-white transition-colors">
              <i className="ri-instagram-fill text-xl"></i>
            </a>
          </div>
        </div>
        
        <div className="mt-8 pt-4 border-t border-[#4B1C82] text-sm text-center">
          <p>© {new Date().getFullYear()} Quiet Sports. All videos are the property of their respective owners.</p>
        </div>
      </div>
    </footer>
  );
}
