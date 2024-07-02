const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3001;

// Enable CORS
app.use(cors());

// Proxy endpoint
app.get('/proxy', async (req, res) => {
    const { url } = req.query;

    try {
        const response = await axios.get(url);
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(error.response?.status || 500).json({ error: 'Failed to fetch data' });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`CORS Proxy Server running on http://localhost:${PORT}`);
});
