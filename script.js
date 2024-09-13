document.getElementById('transcription-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const fileInput = document.getElementById('audio-file');
    const languageSelect = document.getElementById('language');
    const resultElement = document.getElementById('result');
    const loadingElement = document.getElementById('loading');

    const file = fileInput.files[0];
    const language = languageSelect.value;

    if (!file) {
        alert('Please select an MP3 file.');
        return;
    }

    const formData = new FormData();
    formData.append('audio', file);
    formData.append('language', language);

    // Show loading message
    loadingElement.style.display = 'block';
    resultElement.textContent = '';

    fetch('/transcribe', {
        method: 'POST',
        body: formData
    })
    .then(response => {
        loadingElement.style.display = 'none';
        if (!response.ok) {
            throw new Error('Transcription failed.');
        }
        return response.json();
    })
    .then(data => {
        if (data.text) {
            resultElement.textContent = data.text;
            if (data.errors && data.errors.length > 0) {
                alert('Some chunks failed to transcribe:\n' + data.errors.join('\n'));
            }
        } else {
            resultElement.textContent = 'Error: ' + data.error;
        }
    })
    .catch(error => {
        console.error('Error:', error);
        resultElement.textContent = 'An error occurred: ' + error.message;
        // Hide loading message
        loadingElement.style.display = 'none';
    });
});
