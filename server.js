const express = require('express');
const multer = require('multer');
const fetch = require('node-fetch');
const FormData = require('form-data');
const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('ffmpeg-static');
const path = require('path');

ffmpeg.setFfmpegPath(ffmpegPath);

const app = express();
const upload = multer({ dest: 'uploads/' });
const PORT = 3000;

// Replace 'YOUR_API_KEY' with your actual OpenAI API key
const OPENAI_API_KEY = 'YOUR_API_KEY';

app.post('/transcribe', upload.single('audio'), async (req, res) => {
    try {
        const audioPath = req.file.path;
        const language = req.body.language;

        console.log('Received file:', audioPath);

        // Get the duration of the audio file
        let duration = await getAudioDurationInSeconds(audioPath);
        console.log('Audio duration (seconds):', duration);

        let chunkDuration = 300; // Start with 5 minutes
        let chunkIndex = 0;
        let transcripts = [];
        let errors = [];

        for (let startTime = 0; startTime < duration; startTime += chunkDuration) {
            let chunkDurationAdjusted = Math.min(chunkDuration, duration - startTime);
            let chunkPath = `uploads/chunk_${chunkIndex}_${req.file.originalname}`;

            // Split the audio file
            await splitAudioFile(audioPath, chunkPath, startTime, chunkDurationAdjusted);
            console.log(`Created chunk: ${chunkPath}`);

            // Check chunk file size
            let chunkSize = fs.statSync(chunkPath).size;
            console.log(`Chunk size: ${chunkSize} bytes`);

            // Skip empty chunks
            if (chunkSize === 0) {
                console.error(`Chunk ${chunkIndex + 1} is empty. Skipping transcription.`);
                transcripts.push(`[Chunk ${chunkIndex + 1} is empty.]`);
                fs.unlinkSync(chunkPath);
                chunkIndex++;
                continue;
            }

            try {
                console.log(`Processing chunk ${chunkIndex + 1}`);
                // Transcribe the chunk
                let transcript = await transcribeAudio(chunkPath, language);
                transcripts.push(transcript);
            } catch (err) {
                console.error(`Error transcribing chunk ${chunkIndex + 1}:`, err.message);
                errors.push(`Error in chunk ${chunkIndex + 1}: ${err.message}`);
                transcripts.push(`[Error in chunk ${chunkIndex + 1}: ${err.message}]`);
            }

            // Delete the chunk file
            fs.unlinkSync(chunkPath);

            // Delay to prevent rate limiting
            await new Promise(resolve => setTimeout(resolve, 1000)); // 1 second delay

            chunkIndex++;
        }

        // Delete the original uploaded file
        fs.unlinkSync(audioPath);

        const fullTranscript = transcripts.join('\n');

        res.json({ text: fullTranscript, errors: errors });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: error.message || 'Internal server error.' });
    }
});

app.use(express.static('.'));

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// Helper function to get audio duration
function getAudioDurationInSeconds(filePath) {
    return new Promise((resolve, reject) => {
        ffmpeg.ffprobe(filePath, function(err, metadata) {
            if (err) return reject(err);
            const duration = metadata.format.duration;
            resolve(duration);
        });
    });
}

// Helper function to split audio file
function splitAudioFile(inputPath, outputPath, startTime, duration) {
    return new Promise((resolve, reject) => {
        ffmpeg(inputPath)
            .setStartTime(startTime)
            .duration(duration)
            .audioBitrate('64k') // Reduce bitrate to 64 kbps if needed
            .output(outputPath)
            .on('end', () => {
                console.log(`Created chunk: ${outputPath}`);
                resolve();
            })
            .on('error', (err) => {
                console.error('Error splitting audio file:', err);
                reject(err);
            })
            .run();
    });
}

// Helper function to transcribe audio
async function transcribeAudio(audioPath, language) {
    const formData = new FormData();
    formData.append('file', fs.createReadStream(audioPath));
    formData.append('model', 'whisper-1');
    if (language) {
        formData.append('language', language);
    }

    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${OPENAI_API_KEY}`
        },
        body: formData
    });

    let data;
    try {
        data = await response.json();
    } catch (parseError) {
        console.error('Error parsing response JSON:', parseError);
        throw new Error(`Failed to parse response: ${parseError.message}`);
    }

    if (response.ok && data.text) {
        console.log('Received transcript for chunk');
        return data.text;
    } else {
        console.error(`Transcription request failed with status ${response.status}: ${response.statusText}`);
        console.error('Response Headers:', response.headers.raw());
        console.error('Response Data:', data);
        let errorMessage = (data && data.error && data.error.message) ? data.error.message : `HTTP ${response.status}: ${response.statusText}`;
        throw new Error(errorMessage);
    }
}
