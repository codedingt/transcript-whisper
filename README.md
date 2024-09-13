
# MP3 to Text Transcription with OpenAI Whisper

A web application that allows users to upload MP3 files, select a language, and transcribe the audio to text using OpenAI's Whisper API. The application handles large audio files by splitting them into manageable chunks and provides a user-friendly interface.

## Table of Contents

- [Demo](#demo)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [Configuration](#configuration)
- [Project Structure](#project-structure)
- [Technologies Used](#technologies-used)
- [Limitations](#limitations)
- [Future Improvements](#future-improvements)
- [License](#license)
- [Acknowledgements](#acknowledgements)
- [Contact](#contact)

## Demo

![Application Demo](demo_screenshot.png)

*Note: Include a screenshot or GIF demonstrating the application.*

## Features

- Upload MP3 files and transcribe them to text.
- Support for large audio files by splitting them into smaller chunks.
- Language selection with a dropdown menu.
- Real-time transcription progress display.
- Error handling and informative messages.
- Responsive and user-friendly interface.

## Prerequisites

- **Node.js** (version 14 or higher)
- **npm** (Node Package Manager)
- **ffmpeg** installed on your system
- An **OpenAI API key** with access to the Whisper API

### Installing ffmpeg

- **Ubuntu/Debian:**

  ```bash
  sudo apt-get update
  sudo apt-get install ffmpeg
  ```

- **macOS (with Homebrew):**

  ```bash
  brew install ffmpeg
  ```

- **Windows:**

  Download ffmpeg from [ffmpeg.org](https://ffmpeg.org/download.html) and add it to your system's PATH.

## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/codedingt/transcript-whisper.git
   cd transcript-whisper
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up your OpenAI API key:**

   - Create a `.env` file in the root directory.
   - Add the following line to `.env`:

     ```env
     OPENAI_API_KEY=your_openai_api_key_here
     ```

   *Important:* **Do not** commit your `.env` file to version control. The `.gitignore` file provided excludes it.

## Usage

1. **Start the server:**

   ```bash
   node server.js
   ```

2. **Open the application in your browser:**

   Navigate to `http://localhost:3000`.

3. **Transcribe an MP3 file:**

   - Click on "Choose File" and select an MP3 file.
   - Select the language or leave it as "Auto-detect".
   - Click "Transcribe" and wait for the transcription to complete.
   - View the transcription result on the page.

## Configuration

- **Port Configuration:**

  The server runs on port `3000` by default. You can change this by modifying the `PORT` variable in `server.js`.

- **Adjusting Chunk Duration and Bitrate:**

  If you encounter issues with file sizes, you can adjust the `chunkDuration` and `audioBitrate` in `server.js`:

  ```javascript
  let chunkDuration = 300; // Duration in seconds
  .audioBitrate('64k');    // Bitrate
  ```

## Project Structure

```
transcript-whisper/
├── uploads/            # Directory for uploaded files (auto-created)
├── index.html          # Frontend HTML file
├── script.js           # Frontend JavaScript
├── server.js           # Backend server code
├── package.json        # NPM package configuration
├── package-lock.json   # NPM package lock file
├── .gitignore          # Git ignore file
├── .env                # Environment variables (not committed to Git)
└── README.md           # Project documentation
```

## Technologies Used

- **Node.js**: JavaScript runtime for server-side programming.
- **Express.js**: Web framework for Node.js.
- **Multer**: Middleware for handling `multipart/form-data` for file uploads.
- **fluent-ffmpeg**: Library for working with FFmpeg for audio processing.
- **ffmpeg-static**: Static binaries for FFmpeg.
- **OpenAI Whisper API**: Speech recognition API for transcribing audio.

## Limitations

- **File Size Limitations**: The OpenAI Whisper API has a maximum file size limit of 25MB per request.
- **API Rate Limits**: Be mindful of the rate limits imposed by the OpenAI API to avoid errors.
- **Cost**: Transcribing audio using the OpenAI API incurs costs. As of October 2023, the cost is $0.006 per minute of audio (i.e., $0.36 per hour).

## Future Improvements

- **Support for Other Audio Formats**: Extend support to more audio file types (e.g., WAV, AAC).
- **Progress Bar**: Implement a progress bar to indicate transcription progress.
- **Authentication**: Add user authentication for personalized experience and security.
- **Deployment**: Prepare the application for deployment on platforms like Heroku or AWS.

## License

This project is licensed under the [MIT License](LICENSE).

## Acknowledgements

- [OpenAI Whisper API](https://openai.com/)
- [Node.js](https://nodejs.org/)
- [Express.js](https://expressjs.com/)
- [fluent-ffmpeg](https://github.com/fluent-ffmpeg/node-fluent-ffmpeg)
- [Multer](https://github.com/expressjs/multer)

## Contact

For any questions or issues, please open an issue on the repository or contact me at [info@codedingt.com](mailto:info@codedingt.com).
