Sports Highlights Hub

Overview

Sports Highlights Hub is a web application that allows users to search for recent sports highlights from YouTube. Users can select a league and enter team names or keywords to find relevant highlight videos.

Features

Search for sports highlights based on league and team/keywords.

Fetches the most viewed YouTube videos from the last month.

Displays results in an embedded video grid.

Sidebar with toggleable video titles.

Technologies Used

HTML

CSS

JavaScript

YouTube Data API v3

Installation

Prerequisites

A modern web browser (Chrome, Firefox, Edge, etc.).

A valid YouTube Data API key.

Steps

Clone this repository:

git clone https://github.com/your-username/sports-highlights-hub.git
cd sports-highlights-hub

Open script.js and replace API_KEY with your own YouTube Data API key.

Open index.html in your browser to run the app.

Usage

Select a league from the dropdown.

Enter a team name or keywords in the search box.

Click the "Search Highlights" button.

View the embedded highlight videos.

File Structure

/sports-highlights-hub
│── index.html       # Main HTML file
│── style.css        # Styling for the web app
│── script.js        # JavaScript logic for fetching and displaying videos
│── README.md        # Documentation

API Key Configuration

Replace the placeholder API key in script.js:

const API_KEY = "YOUR_YOUTUBE_DATA_API_KEY";

Contributing

Feel free to fork this repository, make improvements, and submit pull requests. Contributions are welcome!

License

This project is licensed under the MIT License.

Contact

For questions or feedback, reach out via GitHub Issues.

