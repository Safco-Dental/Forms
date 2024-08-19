const express = require('express');
const axios = require('axios');
const app = express();
const cors = require('cors')
require('dotenv').config()
app.use(express.json());


var corsOptions = {
  origin: 'http://localhost:5500',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}


app.use(cors(corsOptions))


// Endpoint to handle form submissions
app.post('/submit-issue', async (req, res) => {
    const { title, body, labels, assignees } = req.body;  // Extract title and body from the request

    console.log(`Title: ${title}`)
    console.log(`Body: ${body}`)
    console.log(`${process.env.GH_TOKEN}`)


    console.log(req.body)



    try {
        // Make a POST request to GitHub API to create an issue
        const response = await axios.post(
            'https://api.github.com/repos/Safco-Dental/Forms/issues',
            {
                title: title,
                body: body,
                assignees,
                labels
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


const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log('Server is running on port ' + PORT);
});
