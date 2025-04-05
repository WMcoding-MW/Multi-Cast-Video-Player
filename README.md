# Sports Highlights Hub

## Overview

**Sports Highlights Hub** is a web application designed to help users discover recent sports highlights from YouTube.  
By selecting a league and entering team names or relevant keywords, users can effortlessly find and watch the latest highlight videos.

## Features

- **Intuitive Search**: Easily search for sports highlights by selecting a league and specifying team names or keywords.
- **Recent Content**: Retrieves the most viewed YouTube videos from the past month to ensure up-to-date content.
- **Embedded Video Grid**: Displays search results in an organized, embedded video grid for seamless viewing.
- **Sidebar with Video Titles**: Features a toggleable sidebar that lists video titles for quick navigation.

## Technologies Used

The project leverages the following technologies:

- **Frontend**:
  - React: A JavaScript library for building user interfaces.
  - Tailwind CSS: A utility-first CSS framework for rapid UI development.
- **Backend**:
  - Node.js with Express: A web application framework for handling server-side logic.
- **API Integration**:
  - YouTube Data API v3: Fetches video data based on user search queries.

## Prerequisites

Before setting up the project, ensure you have the following installed:

- [Node.js](https://nodejs.org/): JavaScript runtime environment.
- [npm](https://www.npmjs.com/): Node package manager (comes with Node.js).
- [Git](https://git-scm.com/): Version control system.

Additionally, you'll need:

- **YouTube Data API Key**: Obtain an API key by creating a project in the [Google Cloud Console](https://console.cloud.google.com/).
- Navigate to the Project Directory:

bash
Copy
Edit
cd Sports-Highlights-Hub
Install Dependencies:

bash
Copy
Edit
npm install
Set Up Environment Variables:

Create a .env file in the root directory.

Add your YouTube Data API key:

env
Copy
Edit
REACT_APP_YOUTUBE_API_KEY=your_api_key_here
Usage
To start the development server:

bash
Copy
Edit
npm start
The application will run at http://localhost:3000/.

Contributing
Contributions are welcome! To contribute:

Fork the Repository: Click on the 'Fork' button at the top right of the repository page.

Clone Your Fork:

bash
Copy
Edit
git clone https://github.com/your-username/Sports-Highlights-Hub.git
Create a New Branch:

bash
Copy
Edit
git checkout -b feature/your-feature-name
Make Your Changes: Implement your feature or fix the identified bug.

Commit Your Changes:

bash
Copy
Edit
git commit -m "Description of your changes"
Push to Your Fork:

bash
Copy
Edit
git push origin feature/your-feature-name
Submit a Pull Request: Navigate to the original repository and click on 'New Pull Request'.

License
This project is licensed under the MIT License.

Acknowledgments
Special thanks to the developers and the open-source community for their invaluable resources and tools.
