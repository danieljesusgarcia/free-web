const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3001;
const SUBSCRIBERS_FILE = path.join(__dirname, 'subscribers.json');

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname)); // Serve static files from current directory

// Initialize subscribers file if it doesn't exist
if (!fs.existsSync(SUBSCRIBERS_FILE)) {
    fs.writeFileSync(SUBSCRIBERS_FILE, JSON.stringify({ subscribers: [] }, null, 2));
}

// Helper function to read subscribers
function readSubscribers() {
    try {
        const data = fs.readFileSync(SUBSCRIBERS_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading subscribers file:', error);
        return { subscribers: [] };
    }
}

// Helper function to write subscribers
function writeSubscribers(data) {
    try {
        fs.writeFileSync(SUBSCRIBERS_FILE, JSON.stringify(data, null, 2));
        return true;
    } catch (error) {
        console.error('Error writing subscribers file:', error);
        return false;
    }
}

// API endpoint: Subscribe to newsletter
app.post('/api/subscribe', (req, res) => {
    const { email } = req.body;

    // Validate email
    if (!email) {
        return res.status(400).json({
            success: false,
            message: 'Email is required'
        });
    }

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid email format'
        });
    }

    // Read current subscribers
    const data = readSubscribers();

    // Check for duplicates (case-insensitive)
    const isDuplicate = data.subscribers.some(
        sub => sub.email.toLowerCase() === email.toLowerCase()
    );

    if (isDuplicate) {
        return res.status(409).json({
            success: false,
            message: 'Email already subscribed',
            email: email
        });
    }

    // Add new subscriber
    const newSubscriber = {
        email: email,
        subscribedAt: new Date().toISOString()
    };

    data.subscribers.push(newSubscriber);

    // Save to file
    if (writeSubscribers(data)) {
        console.log(`✅ New subscriber: ${email}`);
        return res.status(201).json({
            success: true,
            message: 'Successfully subscribed!',
            email: email
        });
    } else {
        return res.status(500).json({
            success: false,
            message: 'Failed to save subscription'
        });
    }
});

// API endpoint: Get subscriber count (optional, for admin purposes)
app.get('/api/subscribers/count', (req, res) => {
    const data = readSubscribers();
    res.json({
        count: data.subscribers.length
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════════════════════╗
║                                                        ║
║   🎉 Youthness Development Server Running!            ║
║                                                        ║
║   📍 Local:   http://localhost:${PORT}                    ║
║   📁 Serving: ${__dirname.split('/').pop().padEnd(38)} ║
║                                                        ║
║   📡 API Endpoints:                                    ║
║      POST /api/subscribe                               ║
║      GET  /api/subscribers/count                       ║
║                                                        ║
║   Press Ctrl+C to stop the server                     ║
║                                                        ║
╚════════════════════════════════════════════════════════╝
    `);
});
