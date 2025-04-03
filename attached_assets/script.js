
const API_KEY = "AIzaSyBzB6nLQqxkNH4KsMWoT9K-zgbajGUOWhU";
const searchBtn = document.getElementById("searchBtn");
const videoGrid = document.getElementById("videoGrid");

searchBtn.addEventListener("click", () => {
  const league = document.getElementById("leagueSelect").value;
  const teamQuery = document.getElementById("teamSearch").value;
  const searchQuery = `${league} ${teamQuery} highlights`;

  fetchHighlights(searchQuery);
});

function fetchHighlights(query) {
  const encodedQuery = encodeURIComponent(query);
  const publishedAfter = new Date();
  publishedAfter.setMonth(publishedAfter.getMonth() - 1);

  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=4&q=${encodedQuery}&type=video&videoEmbeddable=true&key=${API_KEY}&order=viewCount&publishedAfter=${publishedAfter.toISOString()}`;

  // Show loading message
  videoGrid.innerHTML = "<p>Loading highlights...</p>";

  fetch(url)
	.then(res => res.json())
	.then(data => {
  	videoGrid.innerHTML = "";

  	// Remove any existing sidebar
  	const existingSidebar = document.querySelector(".video-sidebar");
  	if (existingSidebar) {
    	existingSidebar.remove();
  	}

  	const sidebar = document.createElement("div");
  	sidebar.classList.add("video-sidebar");

  	const toggleBtn = document.createElement("div");
  	toggleBtn.classList.add("video-sidebar-toggle");
  	toggleBtn.innerText = "Toggle Titles";
  	toggleBtn.addEventListener("click", () => {
    	sidebar.classList.toggle("collapsed");
  	});

  	sidebar.appendChild(toggleBtn);

  	data.items.forEach((item, index) => {
    	const videoId = item.id.videoId;
    	const title = item.snippet.title;

    	const iframe = document.createElement("iframe");
    	iframe.src = `https://www.youtube.com/embed/${videoId}?enablejsapi=1&mute=1`;
    	iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
    	iframe.allowFullscreen = true;
    	iframe.classList.add("highlight-frame");

    	const container = document.createElement("div");
    	container.classList.add("video-container");
    	container.appendChild(iframe);

    	const titleOption = document.createElement("div");
    	titleOption.classList.add("video-title");
    	titleOption.innerText = `${index + 1}. ${title}`;

    	sidebar.appendChild(titleOption);
    	videoGrid.appendChild(container);
  	});

  	videoGrid.insertAdjacentElement("beforebegin", sidebar);
	})
	.catch(err => {
  	console.error("Failed to fetch highlights:", err);
  	videoGrid.innerHTML = "<p>Failed to load highlights. Please try again later.</p>";
	});
}
