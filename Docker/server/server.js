const express = require('express');
const axios = require('axios');
const app = express();
const fs = require('fs');
const path = require('path');
const cors = require('cors')
const multer = require('multer');


const baseUrl = process.env.BASE_URL || ''
const baseUploadDir = 'uploads'



const corsOptions = {
  origin: 'https://safco-dental.github.io',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

app.use(cors(corsOptions))

// Function to sanitize filenames
const sanitizeFilename = (filename) => {
    return filename
        .replace(/\s+/g, '_') // Replace spaces with underscores
        .replace(/[^a-zA-Z0-9._-]/g, ''); // Remove special characters
};

const upload = multer({ storage: multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, baseUploadDir + '/');
    },
    filename: (req, file, cb) => {
        const sanitizedFilename = sanitizeFilename(file.originalname);
        cb(null, sanitizedFilename);
    }
}) });


require('dotenv').config()
app.use(express.json());

// Ensure the 'uploads' directory exists
if (!fs.existsSync(baseUploadDir)) {
    fs.mkdirSync(baseUploadDir);
}

// Endpoint to handle form submissions
app.post('/forms-submission/submit-issue', upload.array('files'), async (req, res) => {
    const { title, body, labels, assignees } = req.body;  // Extract title and body from the request
    try {
        // Generate file URLs
        const fileUrls = req.files.map(file => `${baseUrl}/${baseUploadDir}/${file.filename}`);

        // Include file URLs in the issue body
        const issueBody = fileUrls.length > 0 ? `${body}\n\n**Attached Files:**\n${fileUrls.join('\n')}` : body;

        // Make a POST request to GitHub API to create an issue
        const response = await axios.post(
            'https://api.github.com/repos/Safco-Dental/Forms/issues',
            {
                title: title,
                body: issueBody,
                assignees: [assignees],
                labels: [labels]
            },
            {
                headers: {
                    'Authorization': `token ${process.env.GH_TOKEN}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            }
        );

        // Check if the issue was created successfully
        if (response.status === 201) {
            res.status(200).send('Issue created successfully!');
        } else {
            res.status(response.status).send('Failed to create issue.');
        }
    } catch (error) {
        console.error('Error creating GitHub issue:', error.message);
        res.status(500).send('Failed to create issue.');
    }
});

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));



const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log('Server is running on port ' + PORT);
});